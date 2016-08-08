using System;
using System.Collections.Generic;
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
            if (User.IsInRole("Administrator"))
            {
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }

            var clientMicrodistrictIds = UnitOfWork.Repository<Campaign>()
                .GetQ(x => x.ClientId == UserProfile.ClientId && x.DeletedAt == null)
                .SelectMany(x => x.Microdistricts)
                .Select(x => x.MicrodistrictId);

            var reports = UnitOfWork.Repository<AddressReport>()
                .GetQ(x => clientMicrodistrictIds.Contains(x.Address.MicrodistrictId) && x.DeletedAt == null
                    && x.CreatedAt.Value.Month == DateTime.Now.Month,
                    includeProperties: "Address, Address.Microdistrict, Address.Street.LocationType, Address.Building.LocationType")
                .ToList();

            var reportViewModels = Mapper.Map<List<AddressReport>, List<AddressReportViewModel>>(reports);

            return View(reportViewModels ?? new List<AddressReportViewModel>());
        }
    }
}
