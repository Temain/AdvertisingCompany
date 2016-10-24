using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AdvertisingCompany.Domain.Models
{
    /// <summary>
    /// Дом с рекламными поверхностями
    /// </summary>
    [Table("Address", Schema = "dbo")]
    public class Address
    {
        public int AddressId { get; set; }

        /// <summary>
        /// Наименование управляющей компании или ТСЖ 
        /// </summary>
        [Required]
        public string ManagementCompanyName { get; set; }

        /// <summary>
        /// Регион 
        /// </summary>
        public int RegionId { get; set; }
        [ForeignKey("RegionId")]
        public Location Region { get; set; }

        /// <summary>
        /// Район
        /// </summary>
        public int? DistrictId { get; set; }
        [ForeignKey("DistrictId")]
        public Location District { get; set; }

        /// <summary>
        /// Город
        /// </summary>
        public int CityId { get; set; }
        [ForeignKey("CityId")]
        public Location City { get; set; }

        /// <summary>
        /// Микрорайон города
        /// </summary>
        public int MicrodistrictId { get; set; }
        public Microdistrict Microdistrict { get; set; }

        /// <summary>
        /// Улица 
        /// </summary>
        public int StreetId { get; set; }
        [ForeignKey("StreetId")]
        public Location Street { get; set; }

        /// <summary>
        /// Номер строения
        /// </summary>
        public int BuildingId { get; set; }
        [ForeignKey("BuildingId")]
        public Location Building { get; set; }

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

        /// <summary>
        /// Дата создания записи
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Дата обновления записи
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Дата удаления записи
        /// </summary>
        public DateTime? DeletedAt { get; set; }

        /// <summary>
        /// Отчёты о размещении рекламы
        /// </summary>
        public ICollection<AddressReport> Reports { get; set; }

        /// <summary>
        /// Сокращённое наименование. Пример : [ ул.Калинина д.13 ]
        /// </summary>
        public string ShortName
        {
            get
            {
                return Street.LocationType.LocationTypeShortName + ". " + Street.LocationName + " " +
                       Building.LocationType.LocationTypeShortName + ". " + Building.LocationName;
            }
        }
    }
}
