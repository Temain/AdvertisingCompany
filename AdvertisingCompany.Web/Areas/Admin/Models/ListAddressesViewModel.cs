using System.Collections.Generic;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class ListAddressesViewModel
    {
        public List<AddressViewModel> Addresses { get; set; }
        public int PagesCount { get; set; }
        public int SelectedPage { get; set; }
    }
}