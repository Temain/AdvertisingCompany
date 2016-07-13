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
    /// Город
    /// </summary>
    [Table("City", Schema = "dict")]
    public class City
    {
        public int CityId { get; set; }

        /// <summary>
        /// Наименование 
        /// </summary>
        [Required]
        public string CityName { get; set; }

        public string CityKladrCode { get; set; }

        /// <summary>
        /// Районы города
        /// </summary>
        public int AreaId { get; set; }
        public Area Area { get; set; }
        
        /// <summary>
        /// Улицы города
        /// </summary>
        public ICollection<Street> Streets { get; set; }

        /// <summary>
        /// Дома с рекламными поверхностями
        /// </summary>
        public ICollection<Address> Addresses { get; set; }
    }
}
