using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class PaymentOrderViewModel : IHaveCustomMappings
    {
        public int PaymentOrderId { get; set; }

        /// <summary>
        /// Наименование порядка оплаты
        /// </summary>
        [Required]
        public string PaymentOrderName { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<PaymentOrderViewModel, PaymentOrder>("PaymentOrder");

            configuration.CreateMap<PaymentOrder, PaymentOrderViewModel>("PaymentOrder");
        }
    }
}