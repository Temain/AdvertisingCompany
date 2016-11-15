using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Calendar
{
    public class ShowEventsViewModel
    {
        /// <summary>
        /// Все события
        /// </summary>
        public List<CalendarViewModel> Events { get; set; }

        /// <summary>
        /// Количество событий в каждом месяце
        /// </summary>
        public List<MonthEventsViewModel> MonthsEvents { get; set; }
    }
}