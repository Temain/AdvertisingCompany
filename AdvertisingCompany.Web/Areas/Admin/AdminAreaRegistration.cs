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
                name: "Admin_Api",
                routeTemplate: "admin/api/{controller}/{id}",
                defaults: new { area = "admin", id = RouteParameter.Optional }
            );

            context.MapHttpRoute(
                name: "Admin_Client_ChangeStatus",
                routeTemplate: "admin/api/{controller}/{clientId}/status/{statusId}",
                defaults: new { area = "admin", controller = "clients" }
            );

            context.MapHttpRoute(
                name: "Admin_Campaign_ChangePaymentStatus",
                routeTemplate: "admin/api/{controller}/{campaignId}/paymentstatus/{statusId}",
                defaults: new { area = "admin", controller = "campaigns" }
            );

            context.MapHttpRoute(
                name: "Admin_Campaign_GetCampaign",
                routeTemplate: "admin/api/clients/{clientId}/{controller}/{campaignId}",
                defaults: new { area = "admin", controller = "campaigns" }
            );

            context.MapHttpRoute(
                name: "Admin_Campaign_PostCampaign",
                routeTemplate: "admin/api/clients/{clientId}/{controller}",
                defaults: new { area = "admin", controller = "campaigns" }
            );

            context.MapRoute(
                "Admin_Default",
                "Admin/{controller}/{action}/{id}",
                new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}