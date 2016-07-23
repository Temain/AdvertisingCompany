using System.Collections.Generic;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Report
{
    public class ListAddressesReportsViewModel
    {
        public string AddressName { get; set; }
        public string Month { get; set; }
        public List<AddressReportViewModel> AddressReports { get; set; }
    }
}