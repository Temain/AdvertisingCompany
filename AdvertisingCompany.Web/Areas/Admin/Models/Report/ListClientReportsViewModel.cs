using System.Collections.Generic;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Report
{
    public class ListClientReportsViewModel
    {
        public string ClientName { get; set; }
        public List<MicrodistrictReportsViewModel> MicrodistrictsReports { get; set; }
    }
}