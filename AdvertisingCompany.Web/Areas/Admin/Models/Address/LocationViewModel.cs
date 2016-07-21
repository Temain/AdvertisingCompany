using AdvertisingCompany.Web.Models.Mapping;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Address
{
    public class LocationViewModel : IHaveCustomMappings
    {
        /// <summary>
        /// Идентификатор КЛАДР
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Уровень
        /// </summary>
        public string ContentType { get; set; }

        /// <summary>
        /// Наименование
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Тип
        /// </summary>
        public string Type { get; set; }

        /// <summary>
        /// Сокращение типа
        /// </summary>
        public string TypeShort { get; set; }

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
            configuration.CreateMap<Domain.Models.Location, LocationViewModel>("Location")
                .ForMember(m => m.Id, opt => opt.MapFrom(s => s.Code))
                .ForMember(m => m.ContentType, opt => opt.MapFrom(s => s.LocationLevel.LocationLevelName))
                .ForMember(m => m.Name, opt => opt.MapFrom(s => s.LocationName))
                .ForMember(m => m.Type, opt => opt.MapFrom(s => s.LocationType.LocationTypeShortName))
                .ForMember(m => m.TypeShort, opt => opt.MapFrom(s => s.LocationType.LocationTypeShortName))
                .ForMember(m => m.Zip, opt => opt.MapFrom(s => s.Zip))
                .ForMember(m => m.Okato, opt => opt.MapFrom(s => s.Okato));

            configuration.CreateMap<LocationViewModel, Domain.Models.Location>("Location")
                .ForMember(m => m.Code, opt => opt.MapFrom(s => s.Id.Trim()))
                .ForMember(m => m.LocationName, opt => opt.MapFrom(s => s.Name.Trim()))
                .ForMember(m => m.Okato, opt => opt.MapFrom(s => s.Okato.Trim()))
                .ForMember(m => m.Zip, opt => opt.MapFrom(s => s.Zip.Trim()))
                .ForMember(m => m.Parent, opt => opt.MapFrom(s => s.Parent))
                .ForMember(m => m.ParentId, opt => opt.Ignore())
                .ForMember(m => m.LocationId, opt => opt.Ignore())
                .ForMember(m => m.LocationLevelId, opt => opt.Ignore())
                .ForMember(m => m.LocationTypeId, opt => opt.Ignore())
                .AfterMap((s, d) =>
                {
                    if(d.LocationLevel == null)
                    {
                        d.LocationLevel = new Domain.Models.LocationLevel();
                    }
                    d.LocationLevel.LocationLevelName = s.ContentType;

                    if (d.LocationType == null)
                    {
                        d.LocationType = new Domain.Models.LocationType();
                    }
                    d.LocationType.LocationTypeName = s.Type;
                    d.LocationType.LocationTypeShortName = s.TypeShort;
                });
        }
    }
}