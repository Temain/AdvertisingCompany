using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class CreateAddressViewModel : IHaveCustomMappings
    {
        // public int AddressId { get; set; }

        [Display(Name = "Город")]
        public int CityId { get; set; }

        [Display(Name = "Улица")]
        public int StreetId { get; set; }

        [Display(Name = "Район")]
        public int AreaId { get; set; }

        [Display(Name = "Номер дома")]
        public string HouseNumber { get; set; }

        [Display(Name = "Номер корпуса")]
        public string BuildingNumber { get; set; }

        [Display(Name = "Номер подъезда")]
        public string PorchNumber { get; set; }

        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<CreateAddressViewModel, Address>("Address");
        }
    }
}