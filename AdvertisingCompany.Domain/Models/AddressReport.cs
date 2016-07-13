﻿using System;
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
        /// Дата отчёта
        /// </summary>
        public DateTime ReportDate { get; set; }

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
        /// Дата создания записи
        /// </summary>
        [JsonIgnore]
        public DateTime? CreatedAt { get; set; }

        /// <summary>
        /// Дата обновления записи
        /// </summary>
        [JsonIgnore]
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Дата удаления записи
        /// </summary>
        [JsonIgnore]
        public DateTime? DeletedAt { get; set; }
    }
}
