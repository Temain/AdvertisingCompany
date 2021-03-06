﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace AdvertisingCompany.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.LowercaseUrls = true;

            /*
             * Указание пространства имён обязательно 
             */

            routes.MapRoute(
                name: "Reports",
                url: "Reports/{id}",
                defaults: new { controller = "Reports", action = "Index" },
                namespaces: new[] { "AdvertisingCompany.Web.Controllers" }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional },
                namespaces: new[] { "AdvertisingCompany.Web.Controllers" }
            );
        }
    }
}
