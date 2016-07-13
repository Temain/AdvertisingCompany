using System.Web.Http;
using System.Web.Mvc;

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

            context.Routes.MapHttpRoute(
                "Admin_Api",
                "Admin/api/{controller}/{id}",
                new { controller = "Home", id = RouteParameter.Optional }
            );

            context.MapRoute(
                "Admin_Default",
                "Admin/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}