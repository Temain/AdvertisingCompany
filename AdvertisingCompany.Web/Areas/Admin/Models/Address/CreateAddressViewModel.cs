using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Address
{
    public class CreateAddressViewModel : IHaveCustomMappings
    {
        /// <summary>
        /// Наименование управляющей компании или ТСЖ 
        /// </summary>
        [Required]
        public string ManagementCompanyName { get; set; }

        /// <summary>
        /// Микрорайон города
        /// </summary>
        public int MicrodistrictId { get; set; }
        public IEnumerable<MicrodistrictViewModel> Microdistricts { get; set; }

        /// <summary>
        /// Улица 
        /// </summary>
        public string Street { get; set; }

        /// <summary>
        /// Номер строения
        /// </summary>
        [Required]
        [StringLength(10)]
        public string Building { get; set; }

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

        /// <summary>
        /// Идентификатор КЛАДР
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// Почтовый индекс
        /// </summary>
        public string Zip { get; set; }

        /// <summary>
        /// Идентификатор ОКАТО
        /// </summary>
        public string Okato { get; set; }

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
            configuration.CreateMap<CreateAddressViewModel, Domain.Models.Address>("Address");
        }
    }
}