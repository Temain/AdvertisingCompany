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
        /// Категория вида деятельности
        /// </summary>
        public int ActivityCategoryId { get; set; }
        public ActivityCategory ActivityCategory { get; set; }

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
        /// Клиенты рекламной компании
        /// </summary>
        public ICollection<Client> Clients { get; set; }
    }
}
