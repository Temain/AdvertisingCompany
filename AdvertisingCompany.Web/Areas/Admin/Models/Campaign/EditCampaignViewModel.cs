using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Constants;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class EditCampaignViewModel : IHaveCustomMappings
    {
        /// <summary>
        /// Идентификатор кампании
        /// </summary>
        public int CampaignId { get; set; }

        /// <summary>
        /// Идетификатор клиента
        /// </summary>
        public int ClientId { get; set; }

        /// <summary>
        /// Ответственное лицо [Client]
        /// </summary>
        public int ResponsiblePersonId { get; set; }

        /// <summary>
        /// Ф.И.О. ответственного лица [Client]
        /// </summary>
        public string ResponsiblePersonName { get; set; }

        /// <summary>
        /// Наименование компании [Client]
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// Род деятельности [Client]
        /// </summary>
        public string ActivityTypeName { get; set; }

        /// <summary>
        /// Микрорайоны размещения рекламы
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать микрорайон(ы) размещения рекламы.")]
        public int?[] MicrodistrictIds { get; set; }
        public IEnumerable<MicrodistrictViewModel> Microdistricts { get; set; }

        /// <summary>
        /// Месяц размещения рекламы
        /// </summary>
        [Required(ErrorMessage = "Выберите месяц размещения рекламы.")]
        public int? PlacementMonthId { get; set; }
        public IEnumerable<PlacementMonthViewModel> PlacementMonths { get; set; }

        /// <summary>
        /// Формат размещения
        /// </summary>
        [Required(ErrorMessage = "Выберите формат размещения рекламы.")]
        public int? PlacementFormatId { get; set; }
        public IEnumerable<PlacementFormatViewModel> PlacementFormats { get; set; }

        /// <summary>
        /// Стоимость размещения
        /// </summary>
        [Required(ErrorMessage = "Введите стоимость размещения рекламы.")]
        public double? PlacementCost { get; set; }

        /// <summary>
        /// Форма оплаты
        /// </summary>
        [Required(ErrorMessage = "Выберите форму оплаты размещения рекламы.")]
        public int? PaymentOrderId { get; set; }
        public IEnumerable<PaymentOrderViewModel> PaymentOrders { get; set; }

        /// <summary>
        /// Статус оплаты
        /// </summary>
        [Required(ErrorMessage = "Укажите статус оплаты размещения рекламы.")]
        public int? PaymentStatusId { get; set; }
        public IEnumerable<PaymentStatusViewModel> PaymentStatuses { get; set; }

        /// <summary>
        /// Комментарий
        /// </summary>
        [StringLength(5000)]
        public string Comment { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.Client, EditCampaignViewModel>("Campaign")
                .ForMember(m => m.ResponsiblePersonId, opt => opt.MapFrom(s => s.ResponsiblePersonId))
                .ForMember(m => m.ResponsiblePersonName, opt => opt.MapFrom(s => s.ResponsiblePerson.FullName))
                .ForMember(m => m.CompanyName, opt => opt.MapFrom(s => s.CompanyName))
                .ForMember(m => m.PlacementMonthId, opt => opt.MapFrom(s => DateTime.Now.Month))
                .ForMember(m => m.ActivityTypeName, opt => opt.MapFrom(s => s.ActivityType.ActivityCategory.ActivityCategoryName + " / " + s.ActivityType.ActivityTypeName));

            configuration.CreateMap<Domain.Models.Campaign, EditCampaignViewModel>("Campaign")
                .ForMember(m => m.ClientId, opt => opt.MapFrom(s => s.ClientId))
                .ForMember(m => m.CampaignId, opt => opt.MapFrom(s => s.CampaignId))
                .ForMember(m => m.ResponsiblePersonId, opt => opt.MapFrom(s => s.Client.ResponsiblePersonId))
                .ForMember(m => m.ResponsiblePersonName, opt => opt.MapFrom(s => s.Client.ResponsiblePerson.FullName))
                .ForMember(m => m.CompanyName, opt => opt.MapFrom(s => s.Client.CompanyName))
                .ForMember(m => m.ActivityTypeName, opt => opt.MapFrom(s => s.Client.ActivityType.ActivityCategory + " / " + s.Client.ActivityType.ActivityTypeName))
                .ForMember(m => m.MicrodistrictIds, opt => opt.MapFrom(s => s.Microdistricts.Select(x => x.MicrodistrictId)))
                .ForMember(m => m.PlacementMonthId, opt => opt.MapFrom(s => s.PlacementMonthId))
                .ForMember(m => m.PlacementFormatId, opt => opt.MapFrom(s => s.PlacementFormatId))
                .ForMember(m => m.PlacementCost, opt => opt.MapFrom(s => s.PlacementCost))
                .ForMember(m => m.PaymentOrderId, opt => opt.MapFrom(s => s.PaymentOrderId))
                .ForMember(m => m.PaymentStatusId, opt => opt.MapFrom(s => s.PaymentStatusId))
                .ForMember(m => m.Comment, opt => opt.MapFrom(s => s.Comment));

            configuration.CreateMap<EditCampaignViewModel, Domain.Models.Campaign>("Campaign")
                .ForMember(m => m.PlacementMonthId, opt => opt.MapFrom(s => s.PlacementMonthId))
                .ForMember(m => m.PlacementFormatId, opt => opt.MapFrom(s => s.PlacementFormatId))
                .ForMember(m => m.PlacementCost, opt => opt.MapFrom(s => s.PlacementCost))
                .ForMember(m => m.PaymentOrderId, opt => opt.MapFrom(s => s.PaymentOrderId))
                .ForMember(m => m.PaymentStatusId, opt => opt.MapFrom(s => s.PaymentStatusId))
                .ForMember(m => m.Comment, opt => opt.MapFrom(s => s.Comment))
                .ForMember(m => m.CreatedAt, opt => opt.Ignore());
        }
    }
}