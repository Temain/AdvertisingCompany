using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Address
{
    public class AddressViewModel : IHaveCustomMappings
    {
        public int AddressId { get; set; }

        /// <summary>
        /// Наименование управляющей компании или ТСЖ 
        /// </summary>
        public string ManagementCompanyName { get; set; }

        /// <summary>
        /// Микрорайон города
        /// </summary>
        public string MicrodistrictShortName { get; set; }

        /// <summary>
        /// Улица
        /// </summary>
        public string StreetName { get; set; }

        /// <summary>
        /// Дом / корпус
        /// </summary>
        public string BuildingNumber { get; set; }

        /// <summary>
        /// Количество подъездов
        /// </summary>
        public int NumberOfEntrances { get; set; }

        /// <summary>
        /// Количество рекламных поверхностей
        /// </summary>
        public int NumberOfSurfaces { get; set; }

        /// <summary>
        /// Количество этажей
        /// </summary>
        public int NumberOfFloors { get; set; }

        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.Address, AddressViewModel>("Address")
                .ForMember(m => m.AddressId, opt => opt.MapFrom(s => s.AddressId))
                .ForMember(m => m.ManagementCompanyName, opt => opt.MapFrom(s => s.ManagementCompanyName))
                .ForMember(m => m.MicrodistrictShortName, opt => opt.MapFrom(s => s.Microdistrict.MicrodistrictShortName))
                .ForMember(m => m.StreetName, opt => opt.MapFrom(s => s.Street.LocationType.LocationTypeShortName + ". " + s.Street.LocationName))
                .ForMember(m => m.BuildingNumber, opt => opt.MapFrom(s => s.Building.LocationType.LocationTypeShortName + ". " + s.Building.LocationName))
                .ForMember(m => m.NumberOfEntrances, opt => opt.MapFrom(s => s.NumberOfEntrances))
                .ForMember(m => m.NumberOfSurfaces, opt => opt.MapFrom(s => s.NumberOfSurfaces))
                .ForMember(m => m.NumberOfFloors, opt => opt.MapFrom(s => s.NumberOfFloors));
        }
    }
}