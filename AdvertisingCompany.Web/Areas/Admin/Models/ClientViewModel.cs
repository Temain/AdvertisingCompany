using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;
using Newtonsoft.Json;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class ClientViewModel : IHaveCustomMappings
    {
        public int ClientId { get; set; }

        /// <summary>
        /// Название компании
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// Вид деятельности клиента
        /// </summary>
        public int ActivityTypeId { get; set; }
        public string ActivityTypeName { get; set; }

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

        /// <summary>
        /// Дата создания записи
        /// </summary>
        public string CreatedAt { get; set; }


        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<Client, ClientViewModel>("Client")
                .ForMember(m => m.ClientId, opt => opt.MapFrom(s => s.ClientId))
                .ForMember(m => m.CompanyName, opt => opt.MapFrom(s => s.CompanyName))
                .ForMember(m => m.ActivityTypeId, opt => opt.MapFrom(s => s.ActivityTypeId))
                .ForMember(m => m.ActivityTypeName, opt => opt.MapFrom(s => s.ActivityType.ActivityCategory + "/" + s.ActivityType.ActivityTypeName))
                .ForMember(m => m.ResponsiblePersonId, opt => opt.MapFrom(s => s.ResponsiblePersonId))
                .ForMember(m => m.ResponsiblePersonShortName, opt => opt.MapFrom(s => s.ResponsiblePerson.ShortName))
                .ForMember(m => m.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
                .ForMember(m => m.AdditionalPhoneNumber, opt => opt.MapFrom(s => s.AdditionalPhoneNumber))
                .ForMember(m => m.Email, opt => opt.MapFrom(s => s.Email))
                .ForMember(m => m.UserNames, opt => opt.MapFrom(s => s.ApplicationUsers.Select(x => x.UserName)))
                .ForMember(m => m.ClientStatusId, opt => opt.MapFrom(s => s.ClientStatusId))
                .ForMember(m => m.ClientStatusName, opt => opt.MapFrom(s => s.ClientStatus.ClientStatusName))
                .ForMember(m => m.CreatedAt, opt => opt.MapFrom(s => s.CreatedAt.HasValue ? s.CreatedAt.Value.ToShortDateString() : ""));
        }
    }
}