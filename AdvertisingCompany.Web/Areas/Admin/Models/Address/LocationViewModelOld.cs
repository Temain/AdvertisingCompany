using AdvertisingCompany.Web.Models.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Address
{
    public class LocationViewModelOld : IHaveCustomMappings
    {
        public int LocationId { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        public string LocationName { get; set; }

        /// <summary>
        /// Тип
        /// </summary>
        public int LocationTypeId { get; set; }
        public string LocationTypeName { get; set; }
        public string LocationTypeShortName { get; set; }

        /// <summary>
        /// Уровень
        /// </summary>
        public int LocationLevelId { get; set; }
        public string LocationLevelName { get; set; }

        /// <summary>
        /// Идентификатор КЛАДР
        /// </summary>
        public string Code { get; set; }

        /// <summary>
        /// Почтовый индекс
        /// </summary>
        public string Zip { get; set; }

        /// <summary>
        /// Идентификатор ОКАТО
        /// </summary>
        public string Okato { get; set; }

        public LocationViewModel Parent { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            // configuration.CreateMap<LocationViewModel, Domain.Models.Address>("Location");
        }
    }
}