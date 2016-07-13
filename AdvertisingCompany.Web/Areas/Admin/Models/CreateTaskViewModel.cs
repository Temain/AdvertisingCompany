using System.ComponentModel.DataAnnotations;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class CreateTaskViewModel
    {
        // public int TaskId { get; set; }

        public string ClientId { get; set; }

        public string ClientFullName { get; set; }

        [Display(Name = "Город")]
        public string CityId { get; set; }

        [Display(Name = "Район")]
        public int AreaId { get; set; }

        // public string AddressId { get; set; }
        // public string HouseNumber { get; set; }
        // public string PorchNumber { get; set; }
    }
}