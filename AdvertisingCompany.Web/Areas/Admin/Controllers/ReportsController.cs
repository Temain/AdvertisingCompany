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
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using AdvertisingCompany.Web.Areas.Admin.Models.Report;
using AdvertisingCompany.Web.Results;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    // [Authorize(Roles = "Administrator")]
    [RoutePrefix("api/admin/reports")]
    public class ReportsController : BaseApiController
    {
        public ReportsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: api/admin/addresses/5/reports
        [HttpGet]
        [Route("~/api/admin/addresses/{addressId:int}/reports")]
        [ResponseType(typeof(ListAddressReportsViewModel))]
        public ListAddressReportsViewModel GetAddressReports(int addressId)
        {
            var address = UnitOfWork.Repository<Address>()
                .GetQ(x => x.AddressId == addressId && x.DeletedAt == null,
                    includeProperties: "Reports, Street.LocationType, Building.LocationType")
                .SingleOrDefault();
            if (address != null)
            {
                var reports = address.Reports
                    .Where(x => x.DeletedAt == null && x.CreatedAt.Month == DateTime.Now.Month)
                    .ToList();

                var reportViewModels = Mapper.Map<List<AddressReport>, List<AddressReportViewModel>>(reports);
                var addressReports = new ListAddressReportsViewModel
                {
                    AddressName = address.ShortName,
                    AddressReports = reportViewModels
                };

                return addressReports;
            }

            return null;
        }

        // GET: api/admin/campaigns/5/reports
        [HttpGet]
        [Route("~/api/admin/campaigns/{campaignId:int}/reports")]
        [ResponseType(typeof(ListClientReportsViewModel))]
        public ListClientReportsViewModel GetCampaignReports(int campaignId)
        {
            var campaign = UnitOfWork.Repository<Campaign>()
                .GetQ(x => x.CampaignId == campaignId && x.Client.DeletedAt == null && x.DeletedAt == null,
                    includeProperties: "Client, Microdistricts")
                .SingleOrDefault();
            if (campaign != null)
            {
                var clientMicrodistrictIds = campaign.Microdistricts.Select(x => x.MicrodistrictId);
                var microdistrictsReports = UnitOfWork.Repository<AddressReport>()
                    .Get(x => clientMicrodistrictIds.Contains(x.Address.MicrodistrictId)
                        && x.Address.DeletedAt == null && x.DeletedAt == null
                        && x.CreatedAt.Month == DateTime.Now.Month,
                        includeProperties: "Address, Address.Microdistrict, Address.Street.LocationType, Address.Building.LocationType")
                    .GroupBy(g => new { g.Address.MicrodistrictId, g.Address.Microdistrict.MicrodistrictName, g.Address.Microdistrict.MicrodistrictShortName })
                    .Select(x => new MicrodistrictReportsViewModel
                    {
                        MicrodistrictId = x.Key.MicrodistrictId,
                        MicrodistrictName = x.Key.MicrodistrictName,
                        MicrodistrictShortName = x.Key.MicrodistrictShortName,
                        AddressReports = Mapper.Map<IEnumerable<AddressReport>, IEnumerable<AddressReportViewModel>>(x)
                    })
                    .ToList();

                var clientReports = new ListClientReportsViewModel
                {
                    ClientName = campaign.Client.CompanyName,
                    MicrodistrictsReports = microdistrictsReports
                };

                return clientReports;
            }

            return null;
        }

        // GET: api/admin/reports/5
        [AllowAnonymous]
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(AddressReportViewModel))]
        public IHttpActionResult GetReport(int id)
        {
            var report = UnitOfWork.Repository<AddressReport>()
                .GetQ(x => x.AddressReportId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (report == null)
            {
                return BadRequest();
            }

            return new FileResult(report.ImageData, report.ImageMimeType);
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
            catch (Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
        }

        // DELETE: api/admin/reports/5
        [HttpDelete]
        [Route("{id:int}")]
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