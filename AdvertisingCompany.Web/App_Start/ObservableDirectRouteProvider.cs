using System.Collections.Generic;
using System.Linq;
using System.Web.Http.Controllers;
using System.Web.Http.Routing;

namespace AdvertisingCompany.Web
{
    public class ObservableDirectRouteProvider : IDirectRouteProvider
    {
        public IEnumerable<RouteEntry> DirectRoutes { get; private set; }

        public IReadOnlyList<RouteEntry> GetDirectRoutes(HttpControllerDescriptor controllerDescriptor, IReadOnlyList<HttpActionDescriptor> actionDescriptors, IInlineConstraintResolver constraintResolver)
        {
            var realDirectRouteProvider = new DefaultDirectRouteProvider();
            var directRoutes = realDirectRouteProvider.GetDirectRoutes(controllerDescriptor, actionDescriptors, constraintResolver);
            // Store the routes in a property so that they can be retrieved later
            if (DirectRoutes == null)
            {
                DirectRoutes = new List<RouteEntry>();
            }
            DirectRoutes = DirectRoutes.Union(directRoutes);
            return directRoutes;
        }
    }
}