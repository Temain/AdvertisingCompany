using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using AdvertisingCompany.Web.Models.Mapping;
using AutoMapper;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Calendar
{
    public class CalendarViewModel : IHaveCustomMappings
    {
        public int CalendarId { get; set; }

        /// <summary>
        /// Описание
        /// </summary>
        [Required]
        [StringLength(5000)]
        public string Title { get; set; }

        /// <summary>
        /// Дата и время начала события
        /// </summary>
        public DateTime? Start { get; set; }

        /// <summary>
        /// Дата и время окончания события
        /// </summary>
        public DateTime? End { get; set; }

        /// <summary>
        /// Событие на весь день
        /// </summary>
        public bool AllDay { get; set; }

        /// <summary>
        /// Цвет блока в календаре
        /// </summary>
        public string Color { get; set; }

        public void CreateMappings(IConfiguration configuration)
        {
            configuration.CreateMap<CalendarViewModel, Domain.Models.Calendar>("CreatCalendarEvent");
        }
    }
}