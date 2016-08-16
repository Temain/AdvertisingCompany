using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Http.Description;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.ActionFilters;
using AdvertisingCompany.Web.Areas.Admin.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Controllers;
using AutoMapper;
using Microsoft.AspNet.Identity;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    [RoutePrefix("api/admin/clients")]
    public class ClientsController : BaseApiController
    {
        public ClientsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: admin/api/clients
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(ListClientsViewModel))]
        public ListClientsViewModel GetClients(string query = null, int page = 1, int pageSize = 10)
        {
            var clientsList = UnitOfWork.Repository<Client>()
                .GetQ(x => x.DeletedAt == null,
                    orderBy: o => o.OrderByDescending(c => c.CreatedAt),
                    includeProperties: "Campaigns, ActivityType.ActivityCategory, ResponsiblePerson, ApplicationUsers, ClientStatus");

            if (query != null)
            {
                clientsList = clientsList.Where(x => x.CompanyName.Contains(query));
            }

            var clients = clientsList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var clientViewModels = Mapper.Map<List<Client>, List<ClientViewModel>>(clients);
            var clientStatuses = UnitOfWork.Repository<ClientStatus>().Get().ToList();
            var clientStatusViewModels = Mapper.Map<List<ClientStatus>, List<ClientStatusViewModel>>(clientStatuses);

            var viewModel = new ListClientsViewModel
            {
                Clients = clientViewModels,
                ClientStatuses = clientStatusViewModels,
                PagesCount = (int)Math.Ceiling((double)clientsList.Count() / pageSize),
                Page = page
            };
            return viewModel;
        }

        // GET: admin/api/clients/0 (new) or admin/api/clients/5 (edit)
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(CreateClientViewModel))]
        [ResponseType(typeof(EditClientViewModel))]
        public IHttpActionResult GetClient(int id)
        {
            var activityTypes = UnitOfWork.Repository<ActivityType>()
                .Get(x => x.DeletedAt == null, 
                    includeProperties: "ActivityCategory", 
                    orderBy: o => o.OrderBy(p => p.ActivityCategory.ActivityCategoryName))
                .ToList();
            var activityTypeViewModels = Mapper.Map<IEnumerable<ActivityType>, IEnumerable<ActivityTypeViewModel>>(activityTypes);

            if (id == 0)
            {
                var viewModel = new CreateClientViewModel();
                viewModel.ActivityTypes = activityTypeViewModels;
                return Ok(viewModel);
            }
            else
            {
                var client = UnitOfWork.Repository<Client>()
                    .GetQ(x => x.ClientId == id && x.DeletedAt == null,
                        includeProperties: "ResponsiblePerson, ApplicationUsers")
                    .SingleOrDefault();
                if (client == null)
                {
                    return BadRequest();
                }

                var viewModel = Mapper.Map<Client, EditClientViewModel>(client);
                viewModel.ActivityTypes = activityTypeViewModels;

                return Ok(viewModel);
            }
        }


        // PUT: admin/api/clients/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutClient(EditClientViewModel viewModel)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == viewModel.ClientId && x.DeletedAt == null,
                    includeProperties: "ResponsiblePerson, ApplicationUsers")
                .SingleOrDefault();
            if (client == null)
            {
                return BadRequest();
            }

            // Здесь дополнительная валидация

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Mapper.Map<EditClientViewModel, Client>(viewModel, client);
            client.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<Client>().Update(client);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(viewModel.ClientId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            Logger.Info("Обновление информации о клиенте. ClientId={0}", viewModel.ClientId);

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: admin/api/clients
        [HttpPost]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostClient(CreateClientViewModel viewModel)
        {
            var client = Mapper.Map<CreateClientViewModel, Client>(viewModel);

            try
            {
                var user = new ApplicationUser { UserName = viewModel.UserName, Email = viewModel.Email };
                var result = UserManager.Create(user, viewModel.Password);
                if (result.Succeeded)
                {
                    if (!RoleManager.RoleExists("Client"))
                    {
                        RoleManager.Create(new ApplicationRole { Name = "Client" });
                    }

                    UserManager.AddToRole(user.Id, "Client");

                    UnitOfWork.Repository<Client>().Insert(client);
                    UnitOfWork.Save();

                    user.ClientId = client.ClientId;
                    UserManager.Update(user);

                    UserManager.SendEmail(user.Id, "ООО \"ИТ Альянс\"",
                        String.Format("Ваши учётные данные для доступа к просмотру фотоотчётов: <br/><br/>Логин: {0} <br/>Пароль: {1}", viewModel.UserName, viewModel.Password));
                }
                else
                {
                    foreach (var error in result.Errors)
                    {
                        ModelState.AddModelError("Shared", error);
                    }
                }
            }
            catch (SmtpException smtp)
            {
                ModelState.AddModelError("Shared", "Произошла ошибка при отправке письма с учётными данными. " + smtp.Message);
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Shared", ex.Message);
            }

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Logger.Info("Добавление нового клиента. ClientId={0}", client.ClientId);

            return Ok(new { clientId = client.ClientId });
        }

        [HttpPut]
        [Route("{clientId:int}/status/{statusId:int}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult ChangeStatus(int clientId, int statusId)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == clientId && x.DeletedAt == null)
                .SingleOrDefault();
            if (client == null)
            {
                return BadRequest();
            }

            var oldStatusId = client.ClientStatusId;
            client.ClientStatusId = statusId;
            client.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<Client>().Update(client);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(clientId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            Logger.Info("Изменение статуса клиента. ClientId={0}, OldStatusId={1}, NewStatusId={2}", oldStatusId, statusId);

            return StatusCode(HttpStatusCode.NoContent);
        }

        [HttpPut]
        [Route("{clientId:int}/change_password")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult ChangePassword(ChangePasswordViewModel viewModel)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == viewModel.ClientId && x.DeletedAt == null,
                    includeProperties: "ApplicationUsers")
                .SingleOrDefault();
            if (client == null)
            {
                return BadRequest();
            }

            var account = client.ApplicationUsers.FirstOrDefault();
            if (account != null)
            {
                UserManager.RemovePassword(account.Id);

                var result = UserManager.AddPassword(account.Id, viewModel.Password);
                if (result == IdentityResult.Success)
                {
                    Logger.Info("Изменение пароля клиента. ClientId={0}, ApplicationuserId = {1}", viewModel.ClientId, account.Id);

                    return StatusCode(HttpStatusCode.OK);
                }
            }

            return BadRequest(ModelState);
        }

        // DELETE: admin/api/clients/5
        [HttpDelete]
        [Route("{id:int}")]
        [ResponseType(typeof(Client))]
        public IHttpActionResult DeleteClient(int id)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (client == null)
            {
                return NotFound();
            }

            client.DeletedAt = DateTime.Now;
            UnitOfWork.Repository<Client>().Update(client);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            Logger.Info("Удаление клиента. ClientId={0}", id);

            return Ok(client);
        }

        private bool ClientExists(int id)
        {
            return UnitOfWork.Repository<Client>().GetQ().Count(e => e.ClientId == id && e.DeletedAt == null) > 0;
        }
    }
}