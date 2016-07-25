using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class PaymentStatusViewModel : IHaveCustomMappings
    {
        public int PaymentStatusId { get; set; }

        /// <summary>
        /// Наименование статуса оплаты
        /// </summary>
        [Required]
        public string PaymentStatusName { get; set; }

        public string PaymentStatusLabelClass { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<PaymentStatusViewModel, PaymentStatus>("PaymentStatus");

            configuration.CreateMap<PaymentStatus, PaymentStatusViewModel>("PaymentStatus");
        }
    }
}