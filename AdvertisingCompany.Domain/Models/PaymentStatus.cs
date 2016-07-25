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
    /// Статус оплаты размещения рекламы
    /// </summary>
    [Table("PaymentStatus", Schema = "dict")]
    public class PaymentStatus
    {
        public int PaymentStatusId { get; set; }

        [Required]
        public string PaymentStatusName { get; set; }

        public string PaymentStatusLabelClass { get; set; }

        /// <summary>
        /// Рекалмные кампании
        /// </summary>
        public ICollection<Campaign> Campaigns { get; set; }
    }
}
