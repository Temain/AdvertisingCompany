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
    /// Микрорайон
    /// </summary>
    [Table("Microdistrict", Schema = "dict")]
    public class Microdistrict
    {
        public int MicrodistrictId { get; set; }

        /// <summary>
        /// Наименование микрорайона
        /// </summary>
        [Required]
        public string MicrodistrictName { get; set; }

        /// <summary>
        /// Рекламные кампании клиентов с данным микрорайоном
        /// </summary>
        public ICollection<Campaign> Campaigns { get; set; }

        /// <summary>
        /// Рекламные поверхности данного микрорайона
        /// </summary>
        public ICollection<Address> Addresses { get; set; }

        /// <summary>
        /// Улицы данного микрорайона
        /// </summary>
        public ICollection<Street> Streets { get; set; }
    }
}
