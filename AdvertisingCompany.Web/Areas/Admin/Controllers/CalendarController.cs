using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.Calendar;
using AdvertisingCompany.Web.Controllers;
using AutoMapper;
using Microsoft.AspNet.Identity;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator, Manager")]
    [RoutePrefix("api/admin/calendar")]
    public class CalendarController : BaseApiController
    {
        public CalendarController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: api/admin/calendar
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(CalendarViewModel))]
        public List<CalendarViewModel> GetCalendar()
        {
            var user = UserManager.FindById(User.Identity.GetUserId());

            var calendar = UnitOfWork.Repository<Calendar>()
                .GetQ(x => x.ApplicationUserId == user.Id)
                .Select(x => new CalendarViewModel
                {
                    CalendarId = x.CalendarId,
                    Title = x.Title,
                    Start = x.Start,
                    End = x.End,
                    AllDay = x.AllDay,
                    Color = x.Color
                })
                .ToList();

            return calendar;
        }

        // POST: api/admin/calendar
        [HttpPost]
        [Route("")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostCalendar(CalendarViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var user = UserManager.FindById(User.Identity.GetUserId());
            var calendarEvent = Mapper.Map<CalendarViewModel, Calendar>(viewModel);
            calendarEvent.ApplicationUserId = user.Id;

            UnitOfWork.Repository<Calendar>().Insert(calendarEvent);
            UnitOfWork.Save();

            return Ok();
        }

        // PUT: api/admin/calendar/5
        [HttpPut]
        [Route("")]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutCalendar(CalendarViewModel viewModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var calendar = UnitOfWork.Repository<Calendar>()
                .Get(x => x.CalendarId == viewModel.CalendarId, includeProperties: "ApplicationUser")
                .SingleOrDefault();
            if (calendar == null)
            {
                return BadRequest();
            }

            Mapper.Map<CalendarViewModel, Calendar>(viewModel, calendar);

            UnitOfWork.Repository<Calendar>().Update(calendar);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CalendarExists(viewModel.CalendarId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // DELETE: api/admin/calendar/5
        [HttpDelete]
        [Route("{id:int}")]
        [ResponseType(typeof(Calendar))]
        public IHttpActionResult DeleteCalendar(int id)
        {
            var calendar = UnitOfWork.Repository<Calendar>()
                .Get(x => x.CalendarId == id)
                .SingleOrDefault();
            if (calendar == null)
            {
                return NotFound();
            }
            UnitOfWork.Repository<Client>().Delete(calendar);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CalendarExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            Logger.Info("Удаление клиента. ClientId={0}", id);

            return Ok(calendar);
        }

        private bool CalendarExists(int id)
        {
            return UnitOfWork.Repository<Calendar>().GetQ().Count(e => e.CalendarId == id) > 0;
        }
    }
}
