using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AdvertisingCompany.Domain.Models
{
    [Table("AddressReport", Schema = "dbo")]
    public class AddressReport
    {
        public int AddressReportId { get; set; }

        /// <summary>
        /// Дом с рекламными поверхностями
        /// </summary>
        public int AddressId { get; set; }
        public Address Address { get; set; }

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
        public byte[] ImageData { get; set; }

        /// <summary>
        /// Тип
        /// </summary>
        public string ImageMimeType { get; set; }

        /// <summary>
        /// Дата создания записи
        /// </summary>
        public DateTime? CreatedAt { get; set; }

        /// <summary>
        /// Дата обновления записи
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Дата удаления записи
        /// </summary>
        public DateTime? DeletedAt { get; set; }
    }
}
