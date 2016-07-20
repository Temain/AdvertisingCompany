using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Address
{
    public class MicrodistrictViewModel : IHaveCustomMappings
    {
        public int MicrodistrictId { get; set; }

        /// <summary>
        /// Наименование микрорайона
        /// </summary>
        [Required]
        public string MicrodistrictName { get; set; }

        /// <summary>
        /// Сокращённое наименование микрорайона
        /// </summary>
        [Required]
        public string MicrodistrictShortName { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<MicrodistrictViewModel, Domain.Models.Microdistrict>("Microdistrict");

            configuration.CreateMap<Domain.Models.Microdistrict, MicrodistrictViewModel>("Microdistrict");
        }
    }
}