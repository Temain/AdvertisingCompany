using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class AddressViewModel : IHaveCustomMappings
    {
        public int AddressId { get; set; }

        public string City { get; set; }

        public string Area { get; set; }

        public string Street { get; set; }

        public string HouseNumber { get; set; }

        public string BuildingNumber { get; set; }

        public string PorchNumber { get; set; }

        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<Address, AddressViewModel>("Address")
                .ForMember(m => m.AddressId, opt => opt.MapFrom(s => s.AddressId))
                .ForMember(m => m.City, opt => opt.MapFrom(s => s.Street.City.CityName))
                .ForMember(m => m.Area, opt => opt.MapFrom(s => s.Area.AreaName))
                .ForMember(m => m.Street, opt => opt.MapFrom(s => s.Street.StreetName))
                .ForMember(m => m.HouseNumber, opt => opt.MapFrom(s => s.HouseNumber))
                .ForMember(m => m.BuildingNumber, opt => opt.MapFrom(s => s.BuildingNumber));
                //.ForMember(m => m.PorchNumber, opt => opt.MapFrom(s => s.PorchNumber));
        }
    }
}