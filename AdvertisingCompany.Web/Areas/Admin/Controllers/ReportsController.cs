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
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Controllers;
using AutoMapper;
using Microsoft.AspNet.Identity;
using System.Net.Http;
using System.Web;
using System.Diagnostics;
using System.Text;
using System.Threading.Tasks;
using AdvertisingCompany.Web.Areas.Admin.Models.Report;

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
        [ResponseType(typeof(ListAddressesReportsViewModel))]
        public ListAddressesReportsViewModel GetReports(int? addressId = null, int? campaignId = null)
        {
            IQueryable<Address> addresses = null;
            IQueryable<Campaign> campaigns = null;
            if (addressId != null)
            {
                addresses = UnitOfWork.Repository<Address>()
                   .GetQ(x => x.AddressId == addressId && x.DeletedAt == null,
                       includeProperties: "Reports, Street, Street.LocationType, Building, Building.LocationType");
            }

            if (campaignId != null)
            {
                campaigns = UnitOfWork.Repository<Campaign>()
                    .GetQ(x => x.CampaignId == campaignId && x.DeletedAt == null,
                        includeProperties: @"Client, Microdistricts, Microdistricts.Addresses, Microdistricts.Addresses.Reports,
                            Microdistricts.Addresses.Street, Microdistricts.Addresses.Street.LocationType,
                            Microdistricts.Addresses.Building, Microdistricts.Addresses.Building.LocationType");
                if (campaigns != null && campaigns.Any())
                {
                    addresses = campaigns.SelectMany(x => x.Microdistricts).SelectMany(x => x.Addresses);
                }
            }

            if (addresses != null)
            {
                var reports = addresses.SelectMany(x => x.Reports)
                    .Where(x => x.CreatedAt != null && x.CreatedAt.Value.Month == DateTime.Now.Month)
                    .ToList();
                var reportViewModels = Mapper.Map<List<AddressReport>, List<AddressReportViewModel>>(reports);

                var viewModel = new ListAddressesReportsViewModel
                {
                    AddressReports = reportViewModels
                };

                // Для одного адреса получаем сокращенное наименование
                if (addressId != null)
                {
                    var address = addresses.FirstOrDefault();
                    if (address != null)
                    {
                        viewModel.AddressName = address.ShortName;
                    }
                }

                // Для клиента получаем сокращенное наименование компании
                if (campaigns != null)
                {
                    var campaign = campaigns.SingleOrDefault();
                    if (campaign != null)
                    {
                        viewModel.ClientName = campaign.Client.CompanyName;
                    }
                }

                return viewModel;
            }

            return null;
        }

        // POST: admin/api/reports
        [HttpPost]
        [Route("")]
        [ResponseType(typeof(void))]
        public async Task<HttpResponseMessage> PostReport()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            var addressReport = new AddressReport { CreatedAt = DateTime.Now };

            try
            {
                var filesReadToProvider = await Request.Content.ReadAsMultipartAsync();

                foreach (var stream in filesReadToProvider.Contents)
                {
                    var bytes = await stream.ReadAsByteArrayAsync();
                    var name = stream.Headers.ContentDisposition.Name.Trim('"');
                    switch (name)
                    {
                        case "addressId":
                        {
                            var addressIdString = Encoding.UTF8.GetString(bytes);
                            var addressId = Convert.ToInt32(addressIdString);
                            addressReport.AddressId = addressId;
                            break;  
                        }
                        case "comment":
                        {
                            addressReport.Comment = Encoding.UTF8.GetString(bytes);
                            break;
                        }
                        case "file":
                        {
                            addressReport.ImageData = bytes;
                            addressReport.ImageName = stream.Headers.ContentDisposition.FileName.Trim('"');
                            addressReport.ImageLength = stream.Headers.ContentLength;
                            addressReport.ImageMimeType = stream.Headers.ContentType.MediaType;
                            break;
                        } 
                    }                                    
                }

                UnitOfWork.Repository<AddressReport>().Insert(addressReport);
                UnitOfWork.Save();

                return Request.CreateResponse(HttpStatusCode.OK);
            }
            catch (System.Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        // DELETE: admin/api/reports/5
        [HttpDelete]
        [Route("")]
        [ResponseType(typeof(AddressReport))]
        public IHttpActionResult DeleteReport(int id)
        {
            var addressReport = UnitOfWork.Repository<AddressReport>()
                .Get(x => x.AddressReportId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (addressReport == null)
            {
                return NotFound();
            }

            addressReport.DeletedAt = DateTime.Now;
            UnitOfWork.Repository<AddressReport>().Update(addressReport);

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

            return Ok(addressReport);
        }

        private bool ReportExists(int id)
        {
            return UnitOfWork.Repository<AddressReport>().GetQ().Count(e => e.AddressReportId == id && e.DeletedAt == null) > 0;
        }
    }
}