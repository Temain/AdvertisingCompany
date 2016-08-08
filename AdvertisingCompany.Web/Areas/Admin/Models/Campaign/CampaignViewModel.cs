using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class CampaignViewModel : IHaveCustomMappings
    {
        /// <summary>
        /// Идентификатор кампании
        /// </summary>
        public int CampaignId { get; set; }

        /// <summary>
        /// Идентификатор клиента
        /// </summary>
        public int ClientId { get; set; }

        /// <summary>
        /// Наименование клиента
        /// </summary>
        public string ClientName { get; set; }

        /// <summary>
        /// Род деятельности [Client]
        /// </summary>
        public string ActivityTypeName { get; set; }

        /// <summary>
        /// Микрорайоны размещения рекламы
        /// </summary>
        public List<string> MicrodistrictNames { get; set; }

        /// <summary>
        /// Формат размещения
        /// </summary>
        public string PlacementFormatName { get; set; }

        /// <summary>
        /// Стоимость размещения
        /// </summary>
        public double? PlacementCost { get; set; }

        /// <summary>
        /// Форма оплаты
        /// </summary>
        public string PaymentOrderName { get; set; }

        /// <summary>
        /// Статус оплаты
        /// </summary>
        public int? PaymentStatusId { get; set; }
        public string PaymentStatusName { get; set; }
        public string PaymentStatusLabelClass { get; set; }
        public IEnumerable<PaymentStatusViewModel> PaymentStatuses { get; set; } 

        /// <summary>
        /// Комментарий
        /// </summary>
        public string Comment { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.Campaign, CampaignViewModel>("Campaign")
               .ForMember(m => m.ClientId, opt => opt.MapFrom(s => s.ClientId))
               .ForMember(m => m.ClientName, opt => opt.MapFrom(s => s.Client.CompanyName))
               .ForMember(m => m.ActivityTypeName, opt => opt.MapFrom(s => s.Client.ActivityType.ActivityCategory.ActivityCategoryName + " / " + s.Client.ActivityType.ActivityTypeName))
               .ForMember(m => m.MicrodistrictNames, opt => opt.MapFrom(s => s.Microdistricts.Select(x => x.MicrodistrictShortName)))
               .ForMember(m => m.PlacementFormatName, opt => opt.MapFrom(s => s.PlacementFormat.PlacementFormatName))
               .ForMember(m => m.PaymentOrderName, opt => opt.MapFrom(s => s.PaymentOrder.PaymentOrderName))
               .ForMember(m => m.PaymentStatusId, opt => opt.MapFrom(s => s.PaymentStatusId))
               .ForMember(m => m.PaymentStatusName, opt => opt.MapFrom(s => s.PaymentStatus.PaymentStatusName))
               .ForMember(m => m.Comment, opt => opt.MapFrom(s => s.Comment))
               .ForMember(m => m.PaymentStatusLabelClass, opt => opt.MapFrom(s => s.PaymentStatus.PaymentStatusLabelClass));
        }
    }
}