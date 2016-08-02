using System;
using System.ComponentModel.DataAnnotations;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Helpers;
using AdvertisingCompany.Web.Models.Mapping;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Report
{
    public class AddressReportViewModel : IHaveCustomMappings
    {
        public int AddressReportId { get; set; }

        /// <summary>
        /// Дата отчёта
        /// </summary>
        public string ReportDate { get; set; }

        /// <summary>
        /// Дом с рекламными поверхностями
        /// </summary>
        public int AddressId { get; set; }

        /// <summary>
        /// Комментарий
        /// </summary>
        public string Comment { get; set; }

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
                .ForMember(m => m.ReportDate, opt => opt.MapFrom(s => s.CreatedAt != null ? s.CreatedAt.Value.ToShortDateString() : ""))
                .ForMember(m => m.ImageLength, opt => opt.MapFrom(s => s.ImageLength))
                .ForMember(m => m.ImageData, opt => opt.MapFrom(s => Convert.ToBase64String(s.ImageData)))
                .ForMember(m => m.ImageThumbnail, opt => opt.MapFrom(s => Convert.ToBase64String(ImageHelpers.MakeThumbnail(s.ImageData, 200, 200))));
        }
    }
}