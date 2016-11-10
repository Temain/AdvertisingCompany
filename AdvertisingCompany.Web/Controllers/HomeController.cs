using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Mvc;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models;
using AutoMapper;

namespace AdvertisingCompany.Web.Controllers
{
    [Authorize]
    public class HomeController : BaseController
    {
        public HomeController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        public ActionResult Index()
        {
            if (User.IsInRole("Administrator") || User.IsInRole("Manager"))
            {
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }

            var clientMicrodistrictIds = UnitOfWork.Repository<Campaign>()
                .GetQ(x => x.ClientId == UserProfile.ClientId && x.Client.DeletedAt == null && x.DeletedAt == null)
                .SelectMany(x => x.Microdistricts)
                .AsNoTracking()
                .Select(x => x.MicrodistrictId);

            var clientReports = UnitOfWork.Repository<AddressReport>()
                .GetQ(x => clientMicrodistrictIds.Contains(x.Address.MicrodistrictId) 
                    && x.Address.DeletedAt == null && x.DeletedAt == null
                    && x.CreatedAt.Month == DateTime.Now.Month,
                    includeProperties: "Address, Address.Microdistrict, Address.Street.LocationType, Address.Building.LocationType")
                .GroupBy(g => new { g.Address.MicrodistrictId, g.Address.Microdistrict.MicrodistrictName, g.Address.Microdistrict.MicrodistrictShortName })
                .AsNoTracking()
                .ToList()
                .Select(x => new MicrodistrictReportsViewModel
                {
                    MicrodistrictId = x.Key.MicrodistrictId,
                    MicrodistrictName = x.Key.MicrodistrictName,
                    MicrodistrictShortName = x.Key.MicrodistrictShortName,
                    AddressReports = Mapper.Map<IEnumerable<AddressReport>, IEnumerable<AddressReportViewModel>>(x)
                })
                .ToList();

            return View(clientReports ?? new List<MicrodistrictReportsViewModel>());
        }

        //protected override void Dispose(bool disposing)
        //{
        //    UnitOfWork.Dispose();
        //    base.Dispose(disposing);
        //}
    }
}
