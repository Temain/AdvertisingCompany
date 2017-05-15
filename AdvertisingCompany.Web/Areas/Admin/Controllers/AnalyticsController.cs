using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AdvertisingCompany.Domain.Context;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.Analytics;
using AdvertisingCompany.Web.Controllers;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator, Manager")]
    [RoutePrefix("api/admin/analytics")]
    public class AnalyticsController : BaseApiController
    {
        public AnalyticsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        [HttpGet]
        [Route("")]
        public IHttpActionResult Get()
        {
            var analyticsViewModel = new AnalyticsViewModel();

            using (var context = new ApplicationDbContext())
            {
                var query = @"
                    SELECT 
                        t0.Clients
                      , t0.NewClients
                      , t1.AdvertisingObjects
                      , t2.Reports
                    FROM (
                      SELECT 
                          0 AS Rn
                        , COUNT(*) AS Clients
                        , SUM(CASE WHEN MONTH(c.CreatedAt) = MONTH (GETDATE()) AND YEAR(c.CreatedAt) = YEAR(GETDATE()) THEN 1 ELSE 0 END) AS NewClients
                      FROM Client c
                      WHERE c.DeletedAt IS NULL
                    ) AS t0

                    -- Рекламные объекты
                    LEFT JOIN (
                      SELECT 
                          0 AS Rn
                        , COUNT(*) AS AdvertisingObjects

                      FROM Address a
                      WHERE a.DeletedAt IS NULL
                    ) AS t1 ON t0.Rn = t1.Rn

                    -- Загружено отчетов
                    LEFT JOIN (
                      SELECT 
                          0 AS Rn
                        , COUNT(*) AS Reports
  
                      FROM Address a
                      LEFT JOIN AddressReport ar ON a.AddressId = ar.AddressId
                      WHERE a.DeletedAt IS NULL
                        AND ar.DeletedAt IS NULL
                    ) AS t2 ON t0.Rn = t2.Rn";

                var analyticsFromDb = context.Database
                    .SqlQuery<AnalyticsViewModel>(query)
                    .ToList();

                if (analyticsFromDb.Any())
                {
                    analyticsViewModel = analyticsFromDb.FirstOrDefault();
                }
            }   

            return Ok(analyticsViewModel);
        }

        [HttpGet]
        [Route("clients_by_category")]
        public IHttpActionResult ClientsByActivityCategory()
        {
            var clients = UnitOfWork.Repository<Client>()
                .GetQ(x => x.DeletedAt == null,
                    /*orderBy: o => o.OrderByDescending(c => c.CreatedAt),*/
                    includeProperties: "ActivityType.ActivityCategory")
                .GroupBy(x => new { x.ActivityType.ActivityCategoryId, x.ActivityType.ActivityCategory.ActivityCategoryName })
                .Select(x => new
                {
                    name = x.Key.ActivityCategoryName,
                    y = x.Count()
                })
                .OrderByDescending(x => x.y)
                .ToList();

            return Ok(clients);
        }
    }
}
