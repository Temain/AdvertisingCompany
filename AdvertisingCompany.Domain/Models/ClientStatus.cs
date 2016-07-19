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
    /// Статус клиента
    /// </summary>
    [Table("ClientStatus", Schema = "dict")]
    public class ClientStatus
    {
        public int ClientStatusId { get; set; }

        /// <summary>
        /// Наименование статуса
        /// </summary>
        [Required]
        public string ClientStatusName { get; set; }

        public string ClientStatusLabelClass { get; set; }

        public ICollection<Client> Clients { get; set; }
    }
}
