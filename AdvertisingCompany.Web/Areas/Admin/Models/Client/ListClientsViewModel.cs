using System.Collections.Generic;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Client
{
    public class ListClientsViewModel
    {
        public List<ClientViewModel> Clients { get; set; }
        public List<ClientStatusViewModel> ClientStatuses { get; set; }
        public int PagesCount { get; set; }
        public int Page { get; set; }
    }
}