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
    /// Порядок оплаты размещения рекламы
    /// </summary>
    [Table("PaymentOrder", Schema = "dict")]
    public class PaymentOrder
    {
        public int PaymentOrderId { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        [Required]
        public string PaymentOrderName { get; set; }

        /// <summary>
        /// Рекалмные кампании
        /// </summary>
        public ICollection<Campaign> Campaigns { get; set; }
    }
}
