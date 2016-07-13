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
    public class ClientController : BaseController
    {
        public ClientController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        [HttpGet]
        public ActionResult Index()
        {
            return View();
        }

        //[HttpPost]
        //public ActionResult Get(int page = 1, int pageSize = 10)
        //{
        //    if (Request.IsAjaxRequest())
        //    {
        //        var clientsList = UnitOfWork.Repository<ApplicationUser>()
        //            .GetQ(orderBy: o => o.OrderByDescending(x => x.CreatedAt));

        //        var clients = clientsList
        //            .Skip((page - 1) * pageSize)
        //            .Take(pageSize)
        //            .ToList();

        //        var clientsViewModel = Mapper.Map<List<ApplicationUser>, List<ClientViewModel>>(clients);
        //        var viewModel = new ListClientsViewModel
        //        {
        //            Clients = clientsViewModel,
        //            PagesCount = (int)Math.Ceiling((double)clientsList.Count() / pageSize),
        //            SelectedPage = page
        //        };

        //        return Json(viewModel);
        //    }

        //    return null;
        //}
    }
}