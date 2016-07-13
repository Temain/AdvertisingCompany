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
    /// Улица
    /// </summary>
    [Table("Street", Schema = "dict")]
    public class Street
    {
        public int StreetId { get; set; }

        [Required]
        public string StreetName { get; set; }

        public string StreetKladrCode { get; set; }

        /// <summary>
        /// Город к которому относится данная улица
        /// </summary>
        public int CityId { get; set; }
        public City City { get; set; }

        /// <summary>
        /// Микрорайон города к которому относится данная улица
        /// </summary>
        public int? MicrodistrictId { get; set; }
        public Microdistrict Microdistrict { get; set; }

        /// <summary>
        /// Дома с рекламными поверхностями
        /// </summary>
        public ICollection<Address> Addresses { get; set; } 
    }
}
