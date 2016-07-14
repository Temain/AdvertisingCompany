using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Web.Controllers;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class HomeController : BaseController
    {
        public HomeController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: Admin/Home
        public ActionResult Index()
        {
            return View();
        }
    }
}