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
using AdvertisingCompany.Web.Controllers;
using AutoMapper;
using Microsoft.AspNet.Identity;
using System.Net.Http;
using System.Web;
using System.Diagnostics;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using AdvertisingCompany.Web.Results;
using AdvertisingCompany.Web.Models;

namespace AdvertisingCompany.Web.Controllers
{
    [System.Web.Mvc.Authorize]
    [RoutePrefix("api/reports")]
    public class ReportsController : BaseApiController
    {
        public ReportsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: api/reports/5
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(FileResult))]
        public IHttpActionResult GetReport(int id)
        {
            var user = User.Identity.Name;

            var report = UnitOfWork.Repository<AddressReport>()
                .GetQ(x => x.AddressReportId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (report == null)
            {
                return BadRequest();
            }

            return new FileResult(report.ImageData, report.ImageMimeType);
        }
    }
}