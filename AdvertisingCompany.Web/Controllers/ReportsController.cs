using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
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
            // Проверка может ли просматривать отчёт пользователь


            var report = UnitOfWork.Repository<AddressReport>()
               .GetQ(x => x.AddressReportId == id && x.DeletedAt == null)
               .FirstOrDefault();
            if (report == null)
            {
                return HttpNotFound();
            }

            return File(report.ImageData, report.ImageMimeType);
        }
    }
}