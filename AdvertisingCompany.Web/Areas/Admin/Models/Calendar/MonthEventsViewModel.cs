using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Calendar
{
    public class MonthEventsViewModel
    {
        public int YearNumber { get; set; }
        public int MonthNumber { get; set; }
        public int Count { get; set; }
    }
}