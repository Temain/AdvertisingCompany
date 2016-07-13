﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Web.Controllers;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    public class AnalyticsController : BaseApiController
    {
        public AnalyticsController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        public IHttpActionResult Get()
        {
            return Ok("Всё ок!");
        }
    }
}
