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
    [Authorize(Roles = "Administrator")]
    public class AddressController : BaseController
    {
        public AddressController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Get(int page = 1, int pageSize = 10)
        {
            if (Request.IsAjaxRequest())
            {
                var addressesList = UnitOfWork.Repository<Address>()
                    .GetQ(orderBy: o => o.OrderBy(x => x.Area.AreaName));

                var addresses = addressesList
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToList();

                var addressesViewModel = Mapper.Map<List<Address>, List<AddressViewModel>>(addresses);
                var viewModel = new ListAddressesViewModel
                {
                    Addresses = addressesViewModel,
                    PagesCount = (int)Math.Ceiling((double)addressesList.Count() / pageSize),
                    SelectedPage = page
                };

                return Json(viewModel);
            }

            return null;
        }

        [HttpGet]
        public ActionResult Create()
        {
            var address = new CreateAddressViewModel();
            CreateSelectLists();

            return View(address);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(CreateAddressViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                var address = Mapper.Map<CreateAddressViewModel, Address>(viewModel);

                UnitOfWork.Repository<Address>().Insert(address);
                UnitOfWork.Save();

                Logger.Info("Добавлен рекламный объект. AddressId = " + address.AddressId);

                return RedirectToAction("Index");
            }

            CreateSelectLists();

            return View(viewModel);
        }

        private void CreateSelectLists()
        {
            var cities = UnitOfWork.Repository<City>().Get();
            ViewBag.Cities = new SelectList(cities, "CityId", "CityName");
        }
    }
}