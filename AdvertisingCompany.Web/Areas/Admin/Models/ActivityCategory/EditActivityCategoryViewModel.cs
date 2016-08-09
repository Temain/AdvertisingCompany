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
    public class EditActivityCategoryViewModel : IHaveCustomMappings
    {
        /// <summary>
        /// Идентификатор категории вида деятельности
        /// </summary>
        public int ActivityCategoryId { get; set; }

        /// <summary>
        ///  Наименование категории вида деятельности
        /// </summary>
        [Required(ErrorMessage = "Необходимо указать наименование категории.")]
        public string ActivityCategoryName { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<Domain.Models.ActivityCategory, EditActivityCategoryViewModel>("EditActivityCategory")
                .ForMember(m => m.ActivityCategoryId, opt => opt.MapFrom(s => s.ActivityCategoryId))
                .ForMember(m => m.ActivityCategoryName, opt => opt.MapFrom(s => s.ActivityCategoryName));

            configuration.CreateMap<EditActivityCategoryViewModel, Domain.Models.ActivityCategory>("EditActivityCategory")
                .ForMember(m => m.ActivityCategoryId, opt => opt.Ignore())
                .ForMember(m => m.ActivityCategoryName, opt => opt.MapFrom(s => s.ActivityCategoryName));
        }
    }
}