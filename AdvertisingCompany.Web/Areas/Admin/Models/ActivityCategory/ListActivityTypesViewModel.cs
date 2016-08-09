﻿using System.Collections.Generic;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class ListActivityCategoriesViewModel
    {
        public List<ActivityCategoryViewModel> Categories { get; set; }
        public int PagesCount { get; set; }
        public int Page { get; set; }
    }
}