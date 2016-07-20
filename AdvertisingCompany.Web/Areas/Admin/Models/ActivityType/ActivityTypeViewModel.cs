using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.ActivityType
{
    public class ActivityTypeViewModel : IHaveCustomMappings
    {
        public int ActivityTypeId { get; set; }

        [Required]
        [Display(Name = "Наименование вида деятельности")]
        public string ActivityTypeName { get; set; }

        [Required]
        [Display(Name = "Наименование категории вида деятельности")]
        public string ActivityCategory { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<ActivityTypeViewModel, Domain.Models.ActivityType>("ActivityType");

            configuration.CreateMap<Domain.Models.ActivityType, ActivityTypeViewModel>("ActivityType");
        }
    }
}