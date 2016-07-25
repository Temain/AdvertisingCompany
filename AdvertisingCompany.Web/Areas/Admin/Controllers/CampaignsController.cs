﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.ActionFilters;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;
using AdvertisingCompany.Web.Areas.Admin.Models.Campaign;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Controllers;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    [RoutePrefix("admin/api/campaigns")]
    public class CampaignsController : BaseApiController
    {
        public CampaignsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: admin/api/campaigns
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(ListCampaignsViewModel))]
        public ListCampaignsViewModel GetCampaigns(string query, int page = 1, int pageSize = 10)
        {
            var campaignsList = UnitOfWork.Repository<Campaign>()
                .GetQ(x => x.DeletedAt == null,
                    orderBy: o => o.OrderByDescending(c => c.CreatedAt),
                    includeProperties: "Client, Client.ActivityType, Microdistricts, PlacementFormat, PaymentOrder, PaymentStatus");

            if (query != null)
            {
                campaignsList = campaignsList.Where(x => x.Client.CompanyName.Contains(query));
            }

            var campaigns = campaignsList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var campaignViewModels = Mapper.Map<List<Campaign>, List<CampaignViewModel>>(campaigns);
            var paymentStatuses = UnitOfWork.Repository<PaymentStatus>().Get().ToList();
            var paymentStatusViewModels = Mapper.Map<List<PaymentStatus>, List<PaymentStatusViewModel>>(paymentStatuses);

            var viewModel = new ListCampaignsViewModel
            {
                Campaigns = campaignViewModels,
                PaymentStatuses = paymentStatusViewModels,
                PagesCount = (int)Math.Ceiling((double) campaignsList.Count() / pageSize),
                Page = page
            };
            return viewModel;
        }

        // GET: admin/api/clients/5/campaigns/0 (new) or admin/api/clients/5/campaigns/8 (edit)
        [HttpGet]
        [Route("~/admin/api/clients/{clientId:int}/campaigns/{campaignId:int}")]
        [ResponseType(typeof(CreateCampaignViewModel))]
        // [ResponseType(typeof(EditCampaignViewModel))]
        public IHttpActionResult GetCampaign(int clientId, int campaignId)
        {
            var client = UnitOfWork.Repository<Client>()
                .GetQ(x => x.ClientId == clientId && x.DeletedAt == null,
                    includeProperties: "ResponsiblePerson, ActivityType")
                .SingleOrDefault();

            if (client == null)
            {
                return BadRequest();
            }

            var microdistricts = UnitOfWork.Repository<Microdistrict>()
                .Get(orderBy: o => o.OrderBy(p => p.MicrodistrictName))
                .ToList();
            var microdistrictViewModels = Mapper.Map<IEnumerable<Microdistrict>, IEnumerable<MicrodistrictViewModel>>(microdistricts);

            var placementFormats = UnitOfWork.Repository<PlacementFormat>()
                .Get(orderBy: o => o.OrderBy(p => p.PlacementFormatId))
                .ToList();
            var placementFormatViewModels = Mapper.Map<IEnumerable<PlacementFormat>, IEnumerable<PlacementFormatViewModel>>(placementFormats);

            var paymentOrders = UnitOfWork.Repository<PaymentOrder>()
                .Get(orderBy: o => o.OrderBy(p => p.PaymentOrderId))
                .ToList();
            var paymentOrderViewModels = Mapper.Map<IEnumerable<PaymentOrder>, IEnumerable<PaymentOrderViewModel>>(paymentOrders);

            var paymentStatuses = UnitOfWork.Repository<PaymentStatus>()
                .Get(orderBy: o => o.OrderBy(p => p.PaymentStatusId))
                .ToList();
            var paymentStatusViewModels = Mapper.Map<IEnumerable<PaymentStatus>, IEnumerable<PaymentStatusViewModel>>(paymentStatuses);

            var placementMonths = System.Globalization.CultureInfo.CurrentCulture.DateTimeFormat.MonthNames
                .Select((month, index) => new PlacementMonthViewModel { PlacementMonthId = index, PlacementMonthName = month })
                .Where(x => !String.IsNullOrEmpty(x.PlacementMonthName));

            if (campaignId == 0)
            {
                var viewModel = Mapper.Map<Client, CreateCampaignViewModel>(client);
                viewModel.Microdistricts = microdistrictViewModels;
                viewModel.PlacementFormats = placementFormatViewModels;
                viewModel.PaymentOrders = paymentOrderViewModels;
                viewModel.PaymentStatuses = paymentStatusViewModels;
                viewModel.PlacementMonths = placementMonths;
                return Ok(viewModel);
            }
            else
            {
                var campaign = UnitOfWork.Repository<Campaign>()
                    .Get(x => x.CampaignId == campaignId && x.DeletedAt == null,
                        includeProperties: "Client, Client.ResponsiblePerson, Client.ActivityType, Microdistricts")
                    .SingleOrDefault();
                if (campaign == null)
                {
                    return BadRequest();
                }

                var viewModel = Mapper.Map<Campaign, EditCampaignViewModel>(campaign);
                viewModel.Microdistricts = microdistrictViewModels;
                viewModel.PlacementFormats = placementFormatViewModels;
                viewModel.PaymentOrders = paymentOrderViewModels;
                viewModel.PaymentStatuses = paymentStatusViewModels;
                viewModel.PlacementMonths = placementMonths;

                return Ok(viewModel);
            }
        }


        // PUT: admin/api/campaigns/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCampaign(EditCampaignViewModel viewModel)
        {
            var campaign = UnitOfWork.Repository<Campaign>()
                .Get(x => x.CampaignId == viewModel.CampaignId && x.DeletedAt == null,
                    includeProperties: "Client, Client.ResponsiblePerson, Client.ActivityType")
                .SingleOrDefault();
            if (campaign == null)
            {
                return BadRequest();
            }

            Mapper.Map<EditCampaignViewModel, Campaign>(viewModel, campaign);
            campaign.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<Campaign>().Update(campaign);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CampaignExists(viewModel.CampaignId))
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

        // POST: admin/api/clients/5/campaigns
        [HttpPost]
        [Route("~/admin/api/clients/{clientId:int}/campaigns")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostCampaign([FromUri] int clientId, [FromBody] CreateCampaignViewModel viewModel)
        {
            var client = UnitOfWork.Repository<Client>()
                .GetQ(x => x.ClientId == clientId && x.DeletedAt == null,
                    includeProperties: "Campaigns")
                .SingleOrDefault();
            if (client == null)
            {
                return BadRequest();
            }

            if (client.Campaigns.Any())
            {
                ModelState.AddModelError("Shared", "Для клиента уже создана рекламная кампания.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var campaign = Mapper.Map<CreateCampaignViewModel, Campaign>(viewModel);
            campaign.Client = client;

            var microdistricts = UnitOfWork.Repository<Microdistrict>()
                .GetQ(x => viewModel.MicrodistrictIds.Contains(x.MicrodistrictId))
                .ToList();
            campaign.Microdistricts = microdistricts;

            try
            {
                UnitOfWork.Repository<Campaign>().Insert(campaign);
                UnitOfWork.Save();
            }
            catch (DataException)
            {
                return InternalServerError();
            }

            return Ok();
        }

        [HttpPut]
        [Route("{campaignId:int}/paymentstatus/{statusId:int}")]
        [ResponseType(typeof(void))]
        public IHttpActionResult ChangeStatus(int campaignId, int statusId)
        {
            var campaign = UnitOfWork.Repository<Campaign>()
                .Get(x => x.CampaignId == campaignId && x.DeletedAt == null)
                .SingleOrDefault();
            if (campaign == null)
            {
                return BadRequest();
            }

            campaign.PaymentStatusId = statusId;
            campaign.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<Campaign>().Update(campaign);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CampaignExists(campaignId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE: admin/api/campaigns/5
        [HttpDelete]
        [Route("")]
        [ResponseType(typeof(Client))]
        public IHttpActionResult DeleteCampaign(int id)
        {
            var campaign = UnitOfWork.Repository<Campaign>()
                .Get(x => x.CampaignId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (campaign == null)
            {
                return NotFound();
            }

            campaign.DeletedAt = DateTime.Now;
            UnitOfWork.Repository<Campaign>().Update(campaign);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CampaignExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(campaign);
        }

        private bool CampaignExists(int id)
        {
            return UnitOfWork.Repository<Campaign>().GetQ().Count(e => e.CampaignId == id && e.DeletedAt == null) > 0;
        }
    }
}