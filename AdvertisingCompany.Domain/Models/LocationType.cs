using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdvertisingCompany.Domain.Models
{
    /// <summary>
    /// Тип объекта из КЛАДР
    /// </summary>
    [Table("LocationType", Schema = "kladr")]
    public class LocationType
    {
        public int LocationTypeId { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        [Required]
        public string LocationTypeName { get; set; }

        /// <summary>
        /// Сокращенное наименование
        /// </summary>
        [Required]
        public string LocationTypeShortName { get; set; }

        public ICollection<Location> Locations { get; set; }
    }
}
