using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Campaign
{
    public class PlacementMonthViewModel
    {
        /// <summary>
        /// Номер месяца
        /// </summary>
        public int PlacementMonthId { get; set; }

        /// <summary>
        /// Наименование месяца
        /// </summary>
        [Required]
        public string PlacementMonthName { get; set; }
    }
}