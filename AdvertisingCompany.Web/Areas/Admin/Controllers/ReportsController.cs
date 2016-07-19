﻿using System;
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

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    [RoutePrefix("admin/api/reports")]
    public class ReportsController : BaseApiController
    {
        public ReportsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: admin/api/reports
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(ListClientsViewModel))]
        public ListClientsViewModel GetReports(string query, int page = 1, int pageSize = 10)
        {
            var clientsList = UnitOfWork.Repository<Client>()
                .GetQ(x => x.DeletedAt == null,
                    orderBy: o => o.OrderBy(c => c.CreatedAt),
                    includeProperties: "ActivityType, ResponsiblePerson, ApplicationUsers, ClientStatus");

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

        // GET: admin/api/reports/0 (new) or admin/api/reports/5 (edit)
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(CreateClientViewModel))]
        [ResponseType(typeof(EditClientViewModel))]
        public IHttpActionResult GetReport(int id)
        {
            var activityTypes = UnitOfWork.Repository<ActivityType>()
                .Get(orderBy: o => o.OrderBy(p => p.ActivityCategory))
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
                    .Get(x => x.ClientId == id && x.DeletedAt == null,
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


        // PUT: admin/api/reports/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutReport(EditClientViewModel viewModel)
        {
            var client = UnitOfWork.Repository<Client>()
                .Get(x => x.ClientId == viewModel.ClientId && x.DeletedAt == null,
                    includeProperties: "ResponsiblePerson, ApplicationUsers")
                .SingleOrDefault();
            if (client == null)
            {
                return BadRequest();
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
                if (!ReportExists(viewModel.ClientId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: admin/api/reports
        [HttpPost]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostReport(CreateClientViewModel viewModel)
        {
            var client = Mapper.Map<CreateClientViewModel, Client>(viewModel);

            var user = new ApplicationUser { UserName = viewModel.UserName, Email = viewModel.Email };
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

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok();
        }

        // DELETE: admin/api/reports/5
        [HttpDelete]
        [Route("")]
        [ResponseType(typeof(Client))]
        public IHttpActionResult DeleteReport(int id)
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
                if (!ReportExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(client);
        }

        private bool ReportExists(int id)
        {
            return UnitOfWork.Repository<Client>().GetQ().Count(e => e.ClientId == id && e.DeletedAt == null) > 0;
        }
    }
}