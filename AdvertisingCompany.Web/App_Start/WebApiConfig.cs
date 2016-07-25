using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.ModelBinding.Binders;
using AdvertisingCompany.Web.Areas.Admin.Models.Campaign;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json.Serialization;

namespace AdvertisingCompany.Web
{
    public static class WebApiConfig
    {
        public static ObservableDirectRouteProvider GlobalObservableDirectRouteProvider = new ObservableDirectRouteProvider();

        public static void Register(HttpConfiguration config)
        {
            // Конфигурация и службы Web API
            // Настройка Web API для использования только проверки подлинности посредством маркера-носителя.
            config.SuppressDefaultHostAuthentication();
            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            // Используйте "верблюжий" стиль для данных JSON.
            config.Formatters.JsonFormatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();

            // Маршруты Web API
            config.MapHttpAttributeRoutes(GlobalObservableDirectRouteProvider);

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
