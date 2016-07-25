using System.Collections.Generic;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class ListCampaignsViewModel
    {
        public List<CampaignViewModel> Campaigns { get; set; }
        public List<PaymentStatusViewModel> PaymentStatuses { get; set; }
        public int PagesCount { get; set; }
        public int Page { get; set; }
    }
}