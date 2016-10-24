using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;

namespace AdvertisingCompany.Web.Controllers
{
    [Authorize]
    public class ReportsController : BaseController
    {
        public ReportsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        public ActionResult Index(int id)
        {
            var report = UnitOfWork.Repository<AddressReport>()
               .GetQ(x => x.AddressReportId == id && x.DeletedAt == null,
                includeProperties: "Address")
               .FirstOrDefault();
            if (report == null)
            {
                return HttpNotFound();
            }

            // Проверка может ли просматривать отчёт пользователь
            if (User.IsInRole("Client"))
            {
                var clientMicrodistrictIds = UnitOfWork.Repository<Campaign>()
                    .GetQ(x => x.ClientId == UserProfile.ClientId && x.DeletedAt == null)
                    .SelectMany(x => x.Microdistricts)
                    .Select(x => x.MicrodistrictId)
                    .ToList();
                if (!clientMicrodistrictIds.Contains(report.Address.MicrodistrictId))
                {
                    throw new HttpException(404, "Попытка несанкционированного просмотра отчёта.");
                }
            }

            return File(report.ImageData, report.ImageMimeType);
        }
    }
}