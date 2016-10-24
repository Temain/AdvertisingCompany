using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.ActivityType
{
    public class ActivityCategoryViewModel : IHaveCustomMappings
    {
        public int ActivityCategoryId { get; set; }

        [Required]
        [Display(Name = "Наименование категории вида деятельности")]
        public string ActivityCategoryName { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<ActivityCategoryViewModel, Domain.Models.ActivityCategory>("ActivityCategory");

            configuration.CreateMap<Domain.Models.ActivityCategory, ActivityCategoryViewModel>("ActivityCategory")
                .ForMember(m => m.ActivityCategoryName, opt => opt.MapFrom(s => s.ActivityCategoryName));
        }
    }
}