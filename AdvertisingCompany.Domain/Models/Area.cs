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
    /// Район
    /// </summary>
    [Table("Area", Schema = "dict")]
    public class Area
    {
        public int AreaId { get; set; }

        [Required]
        public string AreaName { get; set; }

        public string AreaKladrCode { get; set; }

        /// <summary>
        /// Города
        /// </summary>
        public ICollection<City> Cities { get; set; }

        /// <summary>
        /// Дома с рекламными поверхностями
        /// </summary>
        public ICollection<Address> Addresses { get; set; }
    }
}
