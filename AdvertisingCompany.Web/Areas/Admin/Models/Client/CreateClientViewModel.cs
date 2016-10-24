using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;
using AdvertisingCompany.Web.Constants;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Client
{
    public class CreateClientViewModel : IHaveCustomMappings
    {
        [Required(ErrorMessage = "Необходимо указать наименование компании.")]
        [StringLength(1000)]
        [Display(Name = "Название компании")]
        public string CompanyName { get; set; }

        [Required(ErrorMessage = "Необходимо указать вид деятельности клиента.")]
        [Display(Name = "Вид деятельности клиента")]
        public int? ActivityTypeId { get; set; }
        public IEnumerable<ActivityTypeViewModel> ActivityTypes { get; set; }


        /// <summary>
        /// Ответственное лицо
        /// </summary>
        public int ResponsiblePersonId { get; set; }

        [Required(ErrorMessage = "Введите фамилию.")]
        [Display(Name = "Фамилия")]
        public string ResponsiblePersonLastName { get; set; }

        [Required(ErrorMessage = "Введите имя.")]
        [Display(Name = "Имя")]
        public string ResponsiblePersonFirstName { get; set; }

        [Display(Name = "Отчество")]
        public string ResponsiblePersonMiddleName { get; set; }


        [Required(ErrorMessage = "Введите номер телефона.")]
        [StringLength(100)]
        [Display(Name = "Номер телефона")]
        public string PhoneNumber { get; set; }

        [Display(Name = "Дополнительный номер телефона")]
        public string AdditionalPhoneNumber { get; set; }

        [Required(ErrorMessage = "Введите адрес электронной почты.")]
        [Display(Name = "Адрес электронной почты")]
        [EmailAddress]
        public string Email { get; set; }

        [Required(ErrorMessage = "Введите имя пользователя.")]
        [Display(Name = "Логин")]
        public string UserName { get; set; }

        [Required(ErrorMessage = "Введите пароль.")]
        [StringLength(100, ErrorMessage = "Пароль должен содержать не менее {2} символов.", MinimumLength = 4)]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Введите подтверждение пароля.")]
        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("Password", ErrorMessage = "Пароль и его подтверждение не совпадают.")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "Комментарий")]
        public string Comment { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.Client, CreateClientViewModel>("Client");

            configuration.CreateMap<CreateClientViewModel, Domain.Models.Client>("Client")
                .ForMember(m => m.CompanyName, opt => opt.MapFrom(s => s.CompanyName))
                .ForMember(m => m.ActivityTypeId, opt => opt.MapFrom(s => s.ActivityTypeId))
                .ForMember(m => m.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
                .ForMember(m => m.AdditionalPhoneNumber, opt => opt.MapFrom(s => s.AdditionalPhoneNumber))
                .ForMember(m => m.Email, opt => opt.MapFrom(s => s.Email))
                .ForMember(m => m.ResponsiblePerson, opt => opt.MapFrom(s => s))
                .ForMember(m => m.ClientStatusId, opt => opt.MapFrom(s => ClientStatuses.Active))
                .ForMember(m => m.Comment, opt => opt.MapFrom(s => s.Comment))
                .ForMember(m => m.ApplicationUsers, opt => opt.Ignore())
                .ForMember(m => m.CreatedAt, opt => opt.MapFrom(s => DateTime.Now));

            configuration.CreateMap<CreateClientViewModel, Person>("ClientPerson")
                .ForMember(m => m.LastName, opt => opt.MapFrom(s => s.ResponsiblePersonLastName))
                .ForMember(m => m.FirstName, opt => opt.MapFrom(s => s.ResponsiblePersonFirstName))
                .ForMember(m => m.MiddleName, opt => opt.MapFrom(s => s.ResponsiblePersonMiddleName));
        }
    }
}