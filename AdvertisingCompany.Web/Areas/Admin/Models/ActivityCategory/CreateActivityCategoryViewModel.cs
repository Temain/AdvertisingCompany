using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Constants;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class CreateActivityCategoryViewModel : IHaveCustomMappings
    {
        /// <summary>
        /// Наименование категории вида деятельности
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать наименование категории.")]
        public string ActivityCategoryName { get; set; }
  
        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.ActivityCategory, CreateActivityCategoryViewModel>("CreateActivityCategory")
                .ForMember(m => m.ActivityCategoryName, opt => opt.MapFrom(s => s.ActivityCategoryName));

            configuration.CreateMap<CreateActivityCategoryViewModel, Domain.Models.ActivityCategory>("CreateActivityCategory")
                .ForMember(m => m.ActivityCategoryName, opt => opt.MapFrom(s => s.ActivityCategoryName))
                .ForMember(m => m.CreatedAt, opt => opt.MapFrom(s => DateTime.Now));
        }
    }
}