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
    /// Вид деятельности клиента
    /// </summary>
    [Table("ActivityType", Schema = "dict")]
    public class ActivityType
    {
        public int ActivityTypeId { get; set; }

        /// <summary>
        /// Наименование вида деятельности
        /// </summary>
        [Required]
        public string ActivityTypeName { get; set; }

        /// <summary>
        /// Наименование категории вида деятельности
        /// </summary>
        [Required]
        public string ActivityCategory { get; set; }

        /// <summary>
        /// Клиенты рекламной компании
        /// </summary>
        public ICollection<Client> Clients { get; set; }
    }
}
