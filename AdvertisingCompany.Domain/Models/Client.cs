using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace AdvertisingCompany.Domain.Models
{
    /// <summary>
    /// Клиент
    /// </summary>
    [Table("Client", Schema = "dbo")]
    public class Client
    {
        public Client()
        {
            CreatedAt = DateTime.Now;
        }

        public int ClientId { get; set; }

        /// <summary>
        /// Название компании
        /// </summary>
        [Required]
        [StringLength(1000)]
        public string CompanyName { get; set; }

        /// <summary>
        /// Вид деятельности клиента
        /// </summary>
        public int ActivityTypeId { get; set; }
        public ActivityType ActivityType { get; set; }

        /// <summary>
        /// Ответственное лицо
        /// </summary>
        public int ResponsiblePersonId { get; set; }
        [ForeignKey("ResponsiblePersonId")]
        public Person ResponsiblePerson { get; set; }

        /// <summary>
        /// Номер телефона
        /// </summary>
        [Required]
        [StringLength(100)]
        public string PhoneNumber { get; set; }

        /// <summary>
        /// Дополнительный номер телефона
        /// </summary>
        public string AdditionalPhoneNumber { get; set; }

        /// <summary>
        /// Электронная почта
        /// </summary>
        public string Email { get; set; }

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

        /// <summary>
        /// Статус клиента
        /// </summary>
        public int ClientStatusId { get; set; }
        public ClientStatus ClientStatus { get; set; }

        public ICollection<ApplicationUser> ApplicationUsers { get; set; }

        public ICollection<Campaign> Campaigns { get; set; }
    }
}
