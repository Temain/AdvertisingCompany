using System.Collections.Generic;
using System.Linq;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Client
{
    public class ClientViewModel : IHaveCustomMappings
    {
        public int ClientId { get; set; }

        /// <summary>
        /// Идентификатор кампании
        /// </summary>
        public int? CampaignId { get; set; }

        /// <summary>
        /// Название компании
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// Вид деятельности клиента
        /// </summary>
        public int ActivityTypeId { get; set; }
        public string ActivityTypeName { get; set; }
        public string ActivityCategoryName { get; set; }

        /// <summary>
        /// Ответственное лицо
        /// </summary>
        public int ResponsiblePersonId { get; set; }
        public string ResponsiblePersonShortName { get; set; }

        /// <summary>
        /// Номер телефона
        /// </summary>
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Дополнительный номер телефона
        /// </summary>
        public string AdditionalPhoneNumber { get; set; }

        /// <summary>
        /// Электронная почта
        /// </summary>
        public string Email { get; set; }

        /// <summary>
        /// Имя пользователя (Логин)
        /// </summary>
        public List<string> UserNames { get; set; }

        /// <summary>
        /// Статус клиента
        /// </summary>
        public int ClientStatusId { get; set; }
        public string ClientStatusName { get; set; }
        public string ClientStatusLabelClass { get; set; }

        /// <summary>
        /// Дата создания записи
        /// </summary>
        public string CreatedAt { get; set; }

        /// <summary>
        /// Комментарий
        /// </summary>
        public string Comment { get; set; }


        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.Client, ClientViewModel>("Client")
                .ForMember(m => m.ClientId, opt => opt.MapFrom(s => s.ClientId))
                .ForMember(m => m.CampaignId, opt => opt.MapFrom(s => s.Campaigns.FirstOrDefault().CampaignId))
                .ForMember(m => m.CompanyName, opt => opt.MapFrom(s => s.CompanyName))
                .ForMember(m => m.ActivityTypeId, opt => opt.MapFrom(s => s.ActivityTypeId))
                .ForMember(m => m.ActivityTypeName, opt => opt.MapFrom(s => s.ActivityType.ActivityTypeName))
                .ForMember(m => m.ActivityCategoryName, opt => opt.MapFrom(s => s.ActivityType.ActivityCategory.ActivityCategoryName))
                .ForMember(m => m.ResponsiblePersonId, opt => opt.MapFrom(s => s.ResponsiblePersonId))
                .ForMember(m => m.ResponsiblePersonShortName, opt => opt.MapFrom(s => s.ResponsiblePerson.ShortName))
                .ForMember(m => m.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
                .ForMember(m => m.AdditionalPhoneNumber, opt => opt.MapFrom(s => s.AdditionalPhoneNumber))
                .ForMember(m => m.Email, opt => opt.MapFrom(s => s.Email))
                .ForMember(m => m.UserNames, opt => opt.MapFrom(s => s.ApplicationUsers.Select(x => x.UserName)))
                .ForMember(m => m.ClientStatusId, opt => opt.MapFrom(s => s.ClientStatusId))
                .ForMember(m => m.ClientStatusName, opt => opt.MapFrom(s => s.ClientStatus.ClientStatusName))
                .ForMember(m => m.ClientStatusLabelClass, opt => opt.MapFrom(s => s.ClientStatus.ClientStatusLabelClass))
                .ForMember(m => m.Comment, opt => opt.MapFrom(s => s.Comment))
                .ForMember(m => m.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt.HasValue ? s.CreatedAt.Value.ToShortDateString() : ""));
        }
    }
}