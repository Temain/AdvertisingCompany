using System;
using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Helpers;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Models
{
    public class AddressReportViewModel : IHaveCustomMappings
    {
        public int AddressReportId { get; set; }

        /// <summary>
        /// Микрорайон
        /// </summary>
        public int MicrodistrictId { get; set; }
        public string MicrodistrictName { get; set; }
        public string MicrodistrictShortName { get; set; }

        /// <summary>
        /// Дом с рекламными поверхностями
        /// </summary>
        public int AddressId { get; set; }

        public string AddressName { get; set; }

        /// <summary>
        /// Имя файла
        /// </summary>
        public string ImageName { get; set; }

        /// <summary>
        /// Размер файла
        /// </summary>
        public long? ImageLength { get; set; }

        /// <summary>
        /// Фотография
        /// </summary>
        public string ImageData { get; set; }

        /// <summary>
        /// Уменьшенная версия фотографии
        /// </summary>
        public string ImageThumbnail { get; set; }

        /// <summary>
        /// Тип
        /// </summary>
        public string ImageMimeType { get; set; }

        /// <summary>
        /// Дата создания записи
        /// </summary>
        public DateTime? CreatedAt { get; set; }

        public void CreateMappings(AutoMapper.IConfiguration configuration)
        {
            configuration.CreateMap<AddressReport, AddressReportViewModel>("AddressReport")
                .ForMember(m => m.ImageLength, opt => opt.MapFrom(s => s.ImageLength))
                .ForMember(m => m.MicrodistrictId, opt => opt.MapFrom(s => s.Address.MicrodistrictId))
                .ForMember(m => m.MicrodistrictName, opt => opt.MapFrom(s => s.Address.Microdistrict.MicrodistrictName))
                .ForMember(m => m.MicrodistrictShortName, opt => opt.MapFrom(s => s.Address.Microdistrict.MicrodistrictShortName))
                .ForMember(m => m.AddressId, opt => opt.MapFrom(s => s.AddressId))
                .ForMember(m => m.AddressName, opt => opt.MapFrom(s => s.Address.ShortName))
                // .ForMember(m => m.ImageData, opt => opt.MapFrom(s => Convert.ToBase64String(s.ImageData)))
                .ForMember(m => m.ImageData, opt => opt.Ignore())
                .ForMember(m => m.ImageThumbnail, opt => opt.MapFrom(s => Convert.ToBase64String(ImageHelpers.CreateThumbnail(s.ImageData, 640))));
        }
    }
}