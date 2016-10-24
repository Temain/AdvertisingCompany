using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;
using AdvertisingCompany.Web.Helpers;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Models
{
    public class MicrodistrictReportsViewModel
    {
        public int MicrodistrictId { get; set; }
        public string MicrodistrictName { get; set; }
        public string MicrodistrictShortName { get; set; }

        public IEnumerable<AddressReportViewModel> AddressReports { get; set; }
    }
}