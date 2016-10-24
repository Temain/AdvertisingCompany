using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AdvertisingCompany.Domain.Models
{
    /// <summary>
    /// Рекламная кампания определённого клиента
    /// </summary>
    [Table("Campaign", Schema = "dbo")]
    public class Campaign
    {
        public int CampaignId { get; set; }

        /// <summary>
        /// Клиент
        /// </summary>
        public int ClientId { get; set; }
        public Client Client { get; set; }

        /// <summary>
        /// Месяц размещения (номер по порядку)
        /// </summary>
        public int PlacementMonthId { get; set; }

        /// <summary>
        /// Формат размещения рекламы
        /// </summary>
        public int PlacementFormatId { get; set; }
        public PlacementFormat PlacementFormat { get; set; }

        /// <summary>
        /// Стоимость размещения
        /// </summary>
        public double PlacementCost { get; set; }

        /// <summary>
        /// Порядок оплаты
        /// </summary>
        public int PaymentOrderId { get; set; }
        public PaymentOrder PaymentOrder { get; set; }

        /// <summary>
        /// Статус оплаты
        /// </summary>
        public int PaymentStatusId { get; set; }
        public PaymentStatus PaymentStatus { get; set; }

        /// <summary>
        /// Комментарий
        /// </summary>
        [StringLength(5000)]
        public string Comment { get; set; }

        /// <summary>
        /// Дата создания записи
        /// </summary>
        [JsonIgnore]
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Дата обновления записи
        /// </summary>
        [JsonIgnore]
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Дата удаления записи
        /// </summary>
        [JsonIgnore]
        public DateTime? DeletedAt { get; set; }

        /// <summary>
        /// Микрорайоны в которых будет размещаться реклама
        /// </summary>
        public ICollection<Microdistrict> Microdistricts { get; set; }
    }
}
