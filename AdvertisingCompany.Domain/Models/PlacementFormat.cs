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
    /// Формат размещения рекламы
    /// </summary>
    [Table("PlacementFormat", Schema = "dict")]
    public class PlacementFormat
    {
        public int PlacementFormatId { get; set; }

        /// <summary>
        /// Наименование формата размещения
        /// </summary>
        [Required]
        public string PlacementFormatName { get; set; }

        /// <summary>
        /// Рекламные кампании
        /// </summary>
        public ICollection<Campaign> Campaigns { get; set; }
    }
}
