using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdvertisingCompany.Domain.Models
{
    /// <summary>
    /// События календаря
    /// </summary>
    [Table("Calendar", Schema = "dbo")]
    public class Calendar
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

        /// <summary>
        /// Пользователь
        /// </summary>
        [ForeignKey("ApplicationUser")]
        public string ApplicationUserId { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
    }
}
