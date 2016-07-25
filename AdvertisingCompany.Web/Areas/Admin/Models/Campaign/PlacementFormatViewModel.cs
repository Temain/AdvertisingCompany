using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class PlacementFormatViewModel : IHaveCustomMappings
    {
        public int PlacementFormatId { get; set; }

        /// <summary>
        /// Наименование формата размещения
        /// </summary>
        [Required]
        public string PlacementFormatName { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<PlacementFormatViewModel, PlacementFormat>("PlacementFormat");

            configuration.CreateMap<PlacementFormat, PlacementFormatViewModel>("PlacementFormat");
        }
    }
}