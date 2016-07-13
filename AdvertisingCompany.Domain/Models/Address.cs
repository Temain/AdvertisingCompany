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
        /// Район
        /// </summary>
        public int? AreaId { get; set; }
        public virtual Area Area { get; set; }

        /// <summary>
        /// Город
        /// </summary>
        public int? CityId { get; set; }
        public City City { get; set; }

        /// <summary>
        /// Микрорайон города
        /// </summary>
        public int MicrodistrictId { get; set; }
        public Microdistrict Microdistrict { get; set; }

        /// <summary>
        /// Улица 
        /// </summary>
        public int StreetId { get; set; }
        public Street Street { get; set; }

        /// <summary>
        /// Номер дома
        /// </summary>
        [Required]
        [StringLength(10)]
        public string HouseNumber { get; set; }

        /// <summary>
        /// Номер корпуса
        /// </summary>
        [StringLength(10)]
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

        ///// <summary>
        ///// Номер подъезда
        ///// </summary>
        //public string PorchNumber { get; set; }

        /// <summary>
        /// Дата заключения договора
        /// </summary>
        public DateTime? ContractDate { get; set; }

        /// <summary>
        /// Дата создания записи
        /// </summary>
        [JsonIgnore]
        public DateTime? CreatedAt { get; set; }

        /// <summary>
        /// Дата обновления записи
        /// </summary>
        [JsonIgnore]
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Дата удаления записи
        /// </summary>
        [JsonIgnore]
        public DateTime? DeletedAt { get; set; }

        /// <summary>
        /// Отчёты о размещении рекламы
        /// </summary>
        public ICollection<AddressReport> Reports { get; set; }
    }
}
