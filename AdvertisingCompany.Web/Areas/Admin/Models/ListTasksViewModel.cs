using System.Collections.Generic;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class ListTasksViewModel
    {
        public List<TaskViewModel> Tasks { get; set; }
        public int PagesCount { get; set; }
        public int SelectedPage { get; set; }
    }
}