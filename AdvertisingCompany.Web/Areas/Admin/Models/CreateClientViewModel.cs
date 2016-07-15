﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models
{
    public class CreateClientViewModel : IHaveCustomMappings
    {
        [Required]
        [StringLength(1000)]
        [Display(Name = "Название компании")]
        public string CompanyName { get; set; }

        [Display(Name = "Вид деятельности клиента")]
        public int ActivityTypeId { get; set; }
        public IEnumerable<ActivityTypeViewModel> ActivityTypes { get; set; }


        /// <summary>
        /// Ответственное лицо
        /// </summary>
        public int ResponsiblePersonId { get; set; }

        [Required]
        [Display(Name = "Фамилия")]
        public string ResponsiblePersonLastName { get; set; }

        [Required]
        [Display(Name = "Имя")]
        public string ResponsiblePersonFirstName { get; set; }

        [Display(Name = "Отчество")]
        public string ResponsiblePersonMiddleName { get; set; }


        [Required]
        [StringLength(100)]
        [Display(Name = "Номер телефона")]
        public string PhoneNumber { get; set; }

        [Display(Name = "Дополнительный номер телефона")]
        public string AdditionalPhoneNumber { get; set; }

        [Display(Name = "Адрес электронной почты")]
        public string Email { get; set; }

        [Display(Name = "Логин")]
        public string UserName { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "Пароль должен содержать не менее {2} символов.", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "Пароль")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "Подтверждение пароля")]
        [Compare("Password", ErrorMessage = "Пароль и его подтверждение не совпадают.")]
        public string ConfirmPassword { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<CreateClientViewModel, Client>("Client")
                .ForMember(m => m.CompanyName, opt => opt.MapFrom(s => s.CompanyName))
                .ForMember(m => m.ActivityTypeId, opt => opt.MapFrom(s => s.ActivityTypeId))
                .ForMember(m => m.PhoneNumber, opt => opt.MapFrom(s => s.PhoneNumber))
                .ForMember(m => m.AdditionalPhoneNumber, opt => opt.MapFrom(s => s.AdditionalPhoneNumber))
                .ForMember(m => m.Email, opt => opt.MapFrom(s => s.Email))
                .ForMember(m => m.ApplicationUsers, opt => opt.MapFrom(s => s))
                .ForMember(m => m.ResponsiblePerson, opt => opt.MapFrom(s => s))
                .ForMember(m => m.ClientStatusId, opt => opt.Ignore())
                .ForMember(m => m.CreatedAt, opt => opt.Ignore());

            //configuration.CreateMap<CreateClientViewModel, ApplicationUser>("ClientUser")
            //    .ForMember(m => m.Email, opt => opt.MapFrom(s => s.Email))
            //    .ForMember(m => m.UserName, opt => opt.MapFrom(s => s.UserName));

            configuration.CreateMap<CreateClientViewModel, Person>("ClientPerson")
                .ForMember(m => m.LastName, opt => opt.MapFrom(s => s.ResponsiblePersonLastName))
                .ForMember(m => m.FirstName, opt => opt.MapFrom(s => s.ResponsiblePersonFirstName))
                .ForMember(m => m.MiddleName, opt => opt.MapFrom(s => s.ResponsiblePersonMiddleName));
        }
    }
}