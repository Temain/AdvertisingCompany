using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models;
using AdvertisingCompany.Web.Controllers;
using AdvertisingCompany.Web.Models;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    public class ReportController : BaseController
    {
        public ReportController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        public ActionResult Index(int addressId)
        {
            var address = UnitOfWork.Repository<Address>()
                .Get(x => x.AddressId == addressId)
                .FirstOrDefault();
            if (address == null)
            {
                throw new HttpException(404, "Рекламный объект с таким идентификатором не найден.");
            }

            var reportsViewModels = Mapper.Map<ICollection<AddressReport>, ICollection<ReportViewModel>>(address.Reports);

            // ViewBag.Address = address.FullAddress;
            return View(reportsViewModels);
        }

        [HttpGet]
        public ActionResult Create(int taskId)
        {
            return null;
        }
    }
}