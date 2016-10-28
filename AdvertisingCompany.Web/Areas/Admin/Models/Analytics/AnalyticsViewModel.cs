using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace AdvertisingCompany.Web.Areas.Admin.Models.Analytics
{
    public class AnalyticsViewModel
    {
        /// <summary>
        /// Количество клиентов
        /// </summary>
        public int Clients { get; set; }

        /// <summary>
        /// Новые клиенты за последний месяц
        /// </summary>
        public int NewClients { get; set; }

        /// <summary>
        /// Посещений за день
        /// </summary>
        public int VisitsPerDay { get; set; }

        /// <summary>
        /// Пользователей онлайн
        /// </summary>
        public int Online { get; set; }

        /// <summary>
        /// Количество рекламных объектов
        /// </summary>
        public int AdvertisingObjects { get; set; }

        /// <summary>
        /// Загружено отчетов
        /// </summary>
        public int Reports { get; set; }

        /// <summary>
        /// Прибыль за год
        /// </summary>
        public int IncomeForYear { get; set; }

        /// <summary>
        /// Прибыль за месяц
        /// </summary>
        public int IncomeForMonth { get; set; }
    }
}