using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.ActionFilters;
using AdvertisingCompany.Web.Areas.Admin.Models;
using AdvertisingCompany.Web.Controllers;
using AutoMapper;
using Microsoft.AspNet.Identity;
using SaleOfDetails.Web.Models;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    public class ClientController : BaseApiController
    {
        public ClientController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        //// GET: api/Client
        //public IEnumerable<ClientViewModel> GetClients()
        //{
        //    var clients = UnitOfWork.Repository<Client>()
        //        .Get(
        //            orderBy: o => o.OrderBy(p => p.Person.LastName)
        //                .ThenBy(p => p.Person.FirstName),
        //            includeProperties: "Person");

        //    var clientViewModels = Mapper.Map<IEnumerable<Client>, IEnumerable<ClientViewModel>>(clients);

        //    return clientViewModels;
        //}

        //// GET: api/Client
        //public ListViewModel<ClientViewModel> GetClients(int page, int pageSize = 10)
        //{
        //    var clientsList = UnitOfWork.Repository<Client>()
        //        .GetQ(
        //            orderBy: o => o.OrderBy(p => p.Person.LastName)
        //                .ThenBy(p => p.Person.FirstName),
        //            includeProperties: "Person");

        //    var clients = clientsList
        //        .Skip((page - 1) * pageSize)
        //        .Take(pageSize)
        //        .ToList();

        //    var clientViewModels = Mapper.Map<IEnumerable<Client>, IEnumerable<ClientViewModel>>(clients);
        //    var viewModel = new ListViewModel<ClientViewModel>
        //    {
        //        Items = clientViewModels,
        //        ItemsCount = clientsList.Count(),
        //        PagesCount = (int)Math.Ceiling((double)clientsList.Count() / pageSize),
        //        SelectedPage = page
        //    };

        //    return viewModel;
        //}

        // GET: api/Client/5
        [ResponseType(typeof(CreateClientViewModel))]
        public IHttpActionResult GetClient()
        {
            var viewModel = new CreateClientViewModel();
            var activityTypes = UnitOfWork.Repository<ActivityType>()
                .Get(orderBy: o => o.OrderBy(p => p.ActivityCategory));
            viewModel.ActivityTypes = Mapper.Map<IEnumerable<ActivityType>, IEnumerable<ActivityTypeViewModel>>(activityTypes);

            return Ok(viewModel);
        }

        // GET: api/Client/5
        [ResponseType(typeof(ClientViewModel))]
        public IHttpActionResult GetClient(int id)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == id, includeProperties: "Person")
                .SingleOrDefault();
            if (client == null)
            {
                return NotFound();
            }

            var clientViewModel = Mapper.Map<Client, ClientViewModel>(client);

            return Ok(clientViewModel);
        }

        //// PUT: api/Client/5
        //[ResponseType(typeof(void))]
        //public IHttpActionResult PutClient(ClientViewModel viewModel)
        //{
        //    if (!ModelState.IsValid)
        //    {
        //        return BadRequest(ModelState);
        //    }

        //    var client = UnitOfWork.Repository<Client>()
        //        .Get(x => x.ClientId == viewModel.ClientId)
        //        .SingleOrDefault();
        //    if (client == null)
        //    {
        //        return BadRequest();
        //    }

        //    Mapper.Map<ClientViewModel, Client>(viewModel, client);
        //    client.Person.UpdatedAt = DateTime.Now;
        //    client.UpdatedAt = DateTime.Now;

        //    UnitOfWork.Repository<Client>().Update(client);

        //    try
        //    {
        //        UnitOfWork.Save();
        //    }
        //    catch (DbUpdateConcurrencyException)
        //    {
        //        if (!ClientExists(viewModel.ClientId))
        //        {
        //            return NotFound();
        //        }
        //        else
        //        {
        //            throw;
        //        }
        //    }

        //    return StatusCode(HttpStatusCode.NoContent);
        //}

        // POST: api/Client
        [KoJsonValidate]
        [ResponseType(typeof(Client))]
        public IHttpActionResult PostClient(CreateClientViewModel viewModel)
        {
            var client = Mapper.Map<CreateClientViewModel, Client>(viewModel);

            var user = new ApplicationUser { UserName = viewModel.Email, Email = viewModel.Email };
            var result = UserManager.Create(user, viewModel.Password);
            if (result.Succeeded)
            {                
                UnitOfWork.Repository<Client>().Insert(client);
                UnitOfWork.Save();

                user.ClientId = client.ClientId;
                UserManager.Update(user);
            }
            else
            {
                foreach (var error in result.Errors)
                {
                    ModelState.AddModelError("", error);
                }
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            return Ok();
        }

        // DELETE: api/Client/5
        [ResponseType(typeof(Client))]
        public IHttpActionResult DeleteClient(int id)
        {
            Client client = UnitOfWork.Repository<Client>().GetById(id);
            if (client == null)
            {
                return NotFound();
            }

            UnitOfWork.Repository<Client>().Delete(client);
            UnitOfWork.Save();

            return Ok(client);
        }

        private bool ClientExists(int id)
        {
            return UnitOfWork.Repository<Client>().GetQ().Count(e => e.ClientId == id) > 0;
        }
    }
}