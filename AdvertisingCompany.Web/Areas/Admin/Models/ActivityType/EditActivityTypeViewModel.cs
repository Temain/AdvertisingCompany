using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;
using AdvertisingCompany.Web.Areas.Admin.Models.Address;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Constants;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class EditActivityTypeViewModel : IHaveCustomMappings
    {
        public int ActivityTypeId { get; set; }

        /// <summary>
        /// Наименование вида деятельности
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать наименование вида деятельности.")]
        public string ActivityTypeName { get; set; }

        /// <summary>
        /// Категория вида деятельности
        /// </summary>
        [Required(ErrorMessage = "Необходимо выбрать категорию.")]
        public int ActivityCategoryId { get; set; }
        public IEnumerable<ActivityCategoryViewModel> ActivityCategories { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.ActivityType, EditActivityTypeViewModel>("EditActivityType")
                .ForMember(m => m.ActivityTypeId, opt => opt.MapFrom(s => s.ActivityTypeId))
                .ForMember(m => m.ActivityCategoryId, opt => opt.MapFrom(s => s.ActivityCategoryId))
                .ForMember(m => m.ActivityTypeName, opt => opt.MapFrom(s => s.ActivityTypeName));

            configuration.CreateMap<EditActivityTypeViewModel, Domain.Models.ActivityType>("EditActivityType")
                .ForMember(m => m.ActivityTypeId, opt => opt.Ignore())
                .ForMember(m => m.ActivityCategoryId, opt => opt.MapFrom(s => s.ActivityCategoryId))
                .ForMember(m => m.ActivityTypeName, opt => opt.MapFrom(s => s.ActivityTypeName));
        }
    }
}