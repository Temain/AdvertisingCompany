using System.Web.Http;
using System.Web.Mvc;
using AdvertisingCompany.Web.Extensions;

namespace AdvertisingCompany.Web.Areas.Admin
{
    public class AdminAreaRegistration : AreaRegistration 
    {
        public override string AreaName 
        {
            get 
            {
                return "Admin";
            }
        }

        public override void RegisterArea(AreaRegistrationContext context)
        {
            context.Routes.AppendTrailingSlash = true;

            context.MapHttpRoute(
                name: "Admin_WithActionApi",
                routeTemplate: "admin/api/{controller}/create",
                defaults: new { area = "admin" }
            );

            context.MapHttpRoute(
                name: "Admin_Api",
                routeTemplate: "admin/api/{controller}/{id}",
                defaults: new { area = "admin", id = RouteParameter.Optional }
            );

            context.MapRoute(
                "Admin_Default",
                "Admin/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}