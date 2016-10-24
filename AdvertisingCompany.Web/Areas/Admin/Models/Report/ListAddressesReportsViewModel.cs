using System.Collections.Generic;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Report
{
    public class ListAddressReportsViewModel
    {
        public string AddressName { get; set; }
        public List<AddressReportViewModel> AddressReports { get; set; }
    }
}