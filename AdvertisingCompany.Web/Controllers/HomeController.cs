using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

namespace AdvertisingCompany.Web.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            if (User.IsInRole("Administrator"))
            {
                return RedirectToAction("Index", "Home", new { area = "Admin" });
            }

            return View();
        }
    }
}
