using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Client
{
    public class ClientStatusViewModel : IHaveCustomMappings
    {
        public int ClientStatusId { get; set; }

        /// <summary>
        /// Наименование статуса
        /// </summary>
        [Required]
        public string ClientStatusName { get; set; }

        public string ClientStatusLabelClass { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<ClientStatusViewModel, ClientStatus>("ClientStatus");

            configuration.CreateMap<ClientStatus, ClientStatusViewModel>("ClientStatus");
        }
    }
}