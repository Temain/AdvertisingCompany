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
    /// Категории видов деятельности клиента
    /// </summary>
    [Table("ActivityCategory", Schema = "dict")]
    public class ActivityCategory
    {
        public int ActivityCategoryId { get; set; }

        /// <summary>
        /// Наименование категории
        /// </summary>
        [Required]
        public string ActivityCategoryName { get; set; }

        /// <summary>
        /// Виды деятельности
        /// </summary>
        public ICollection<ActivityType> ActivityTypes { get; set; }
    }
}
