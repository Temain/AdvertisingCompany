using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdvertisingCompany.Domain.Models
{
    /// <summary>
    /// Объекты из КЛАДР
    /// </summary>
    [Table("Location", Schema = "kladr")]
    public class Location
    {
        public int LocationId { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        public string LocationName { get; set; }

        /// <summary>
        /// Уровень
        /// </summary>
        public int LocationLevelId { get; set; }
        public LocationLevel LocationLevel { get; set; }

        /// <summary>
        /// Тип
        /// </summary>
        public int LocationTypeId { get; set; }
        public LocationType LocationType { get; set; }

        /// <summary>
        /// Идентификатор КЛАДР
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// Почтовый индекс
        /// </summary>
        public string Zip { get; set; }

        /// <summary>
        /// Идентификатор ОКАТО
        /// </summary>
        public string Okato { get; set; }

        /// <summary>
        /// Родительский объект
        /// </summary>
        public int? ParentId { get; set; }
        [ForeignKey("ParentId")]
        public Location Parent { get; set; }

        /// <summary>
        /// Микрорайоны города
        /// </summary>
        public ICollection<Microdistrict> Microdistricts { get; set; }
    }
}
