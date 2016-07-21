using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Address
{
    public class CreateAddressViewModel : IHaveCustomMappings
    {
        public CreateAddressViewModel()
        {
            NumberOfEntrances = 1;
            NumberOfFloors = 1;
            NumberOfSurfaces = 1;
        }

        /// <summary>
        /// Наименование управляющей компании или ТСЖ 
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать наименование управляющей компании или ТСЖ.")]
        public string ManagementCompanyName { get; set; }

        /// <summary>
        /// Регион 
        /// </summary>
        public LocationViewModel Region { get; set; }

        /// <summary>
        /// Район
        /// </summary>
        public LocationViewModel District { get; set; }

        /// <summary>
        /// Город
        /// </summary>
        public LocationViewModel City { get; set; }

        /// <summary>
        /// Микрорайон города
        /// </summary>
        [Required(ErrorMessage = "Необходимо выбрать микрорайон.")]
        public int? MicrodistrictId { get; set; }
        public IEnumerable<MicrodistrictViewModel> Microdistricts { get; set; }

        /// <summary>
        /// Улица 
        /// </summary>
        public LocationViewModel Street { get; set; }

        /// <summary>
        /// Номер строения
        /// </summary>
        public LocationViewModel Building { get; set; }

        /// <summary>
        /// Количество подъездов
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать количество подъездов.")]
        public int? NumberOfEntrances { get; set; }

        /// <summary>
        /// Количество рекламных поверхностей
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать количество поверхностей.")]
        public int? NumberOfSurfaces { get; set; }

        /// <summary>
        /// Количество этажей
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать количество этажей.")]
        public int? NumberOfFloors { get; set; }

        /// <summary>
        /// Широта
        /// </summary>
        public double Latitude { get; set; }

        /// <summary>
        /// Долгота
        /// </summary>
        public double Longitude { get; set; }

        /// <summary>
        /// Дата заключения договора
        /// </summary>
        public DateTime? ContractDate { get; set; }


        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<CreateAddressViewModel, Domain.Models.Address>("Address")
                .ForMember(m => m.CreatedAt, opt => opt.MapFrom(s => DateTime.Now))
                .ForMember(m => m.RegionId, opt => opt.Ignore())
                .ForMember(m => m.DistrictId, opt => opt.Ignore())
                .ForMember(m => m.CityId, opt => opt.Ignore())
                .ForMember(m => m.StreetId, opt => opt.Ignore())
                .ForMember(m => m.BuildingId, opt => opt.Ignore());
        }
    }
}