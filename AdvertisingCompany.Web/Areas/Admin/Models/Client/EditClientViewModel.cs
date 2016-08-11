using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Client
{
    public class EditClientViewModel : IHaveCustomMappings
    {
        public int ClientId { get; set; }

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

        [Display(Name = "Комментарий")]
        public string Comment { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.Client, EditClientViewModel>("Client")
                .ForMember(x => x.ResponsiblePersonLastName, opt => opt.MapFrom(s => s.ResponsiblePerson.LastName))
                .ForMember(x => x.ResponsiblePersonFirstName, opt => opt.MapFrom(s => s.ResponsiblePerson.FirstName))
                .ForMember(x => x.ResponsiblePersonMiddleName, opt => opt.MapFrom(s => s.ResponsiblePerson.MiddleName))
                .AfterMap((s, d) =>
                {
                    var applicationUser = s.ApplicationUsers.FirstOrDefault();
                    if (applicationUser != null)
                    {
                        d.UserName = applicationUser.UserName;
                    }
                });

            configuration.CreateMap<EditClientViewModel, Domain.Models.Client>("Client")
                .ForMember(m => m.ClientId, opt => opt.MapFrom(s => s.ClientId))
                .ForMember(m => m.CompanyName, opt => opt.MapFrom(s => s.CompanyName))
                .ForMember(m => m.ActivityTypeId, opt => opt.MapFrom(s => s.ActivityTypeId))
                .ForMember(m => m.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
                .ForMember(m => m.AdditionalPhoneNumber, opt => opt.MapFrom(s => s.AdditionalPhoneNumber))
                .ForMember(m => m.Email, opt => opt.MapFrom(s => s.Email))
                .ForMember(m => m.Comment, opt => opt.MapFrom(s => s.Comment))
                .ForMember(m => m.ResponsiblePerson, opt => opt.MapFrom(s => s))
                .ForMember(m => m.ApplicationUsers, opt => opt.Ignore())
                .ForMember(m => m.ResponsiblePersonId, opt => opt.Ignore())
                .ForMember(m => m.CreatedAt, opt => opt.Ignore())
                .AfterMap((s, d) =>
                {
                    var applicationUser = d.ApplicationUsers.FirstOrDefault();
                    if (applicationUser != null)
                    {
                        applicationUser.UserName = s.UserName;
                    }
                });

            configuration.CreateMap<EditClientViewModel, Person>("ClientPerson")
                .ForMember(m => m.LastName, opt => opt.MapFrom(s => s.ResponsiblePersonLastName))
                .ForMember(m => m.FirstName, opt => opt.MapFrom(s => s.ResponsiblePersonFirstName))
                .ForMember(m => m.MiddleName, opt => opt.MapFrom(s => s.ResponsiblePersonMiddleName));
        }
    }
}