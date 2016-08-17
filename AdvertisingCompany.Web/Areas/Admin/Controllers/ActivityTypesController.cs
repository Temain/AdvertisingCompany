using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using System.Web.Http.Description;
using AdvertisingCompany.Domain.DataAccess.Interfaces;
using AdvertisingCompany.Domain.Models;
using AdvertisingCompany.Web.ActionFilters;
using AdvertisingCompany.Web.Areas.Admin.Models;
using AdvertisingCompany.Web.Areas.Admin.Models.ActivityType;
using AdvertisingCompany.Web.Areas.Admin.Models.Client;
using AdvertisingCompany.Web.Controllers;
using AutoMapper;
using Microsoft.AspNet.Identity;
using AdvertisingCompany.Web.Areas.Admin.Models.Campaign;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator")]
    [RoutePrefix("api/admin/activity/types")]
    public class ActivityTypesController : BaseApiController
    {
        public ActivityTypesController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: api/admin/activity/types
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(ListActivityTypesViewModel))]
        public ListActivityTypesViewModel GetActivityType(string query = null, int page = 1, int pageSize = 10)
        {
            var activitiesList = UnitOfWork.Repository<ActivityType>()
                .GetQ(x => x.DeletedAt == null, includeProperties: "ActivityCategory",
                    orderBy: o => o.OrderBy(c => c.ActivityCategory.ActivityCategoryName));

            if (query != null)
            {
                activitiesList = activitiesList.Where(x => x.ActivityTypeName.Contains(query));
            }

            var activities = activitiesList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var activityViewModels = Mapper.Map<List<ActivityType>, List<ActivityTypeViewModel>>(activities);
            var viewModel = new ListActivityTypesViewModel
            {
                Types = activityViewModels,
                PagesCount = (int)Math.Ceiling((double)activitiesList.Count() / pageSize),
                Page = page
            };
            return viewModel;
        }

        // GET: api/admin/activity/types/0 (new) or api/admin/activity/types/5 (edit)
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(CreateActivityTypeViewModel))]
        [ResponseType(typeof(EditActivityTypeViewModel))]
        public IHttpActionResult GetActivityType(int id)
        {
            var activityCategories = UnitOfWork.Repository<ActivityCategory>()
                .GetQ(x => x.DeletedAt == null, orderBy: o => o.OrderBy(p => p.ActivityCategoryName))
                .ToList();
            var activityCategoryViewModels = Mapper.Map<IEnumerable<ActivityCategory>, IEnumerable<ActivityCategoryViewModel>>(activityCategories);

            if (id == 0)
            {
                var viewModel = new CreateActivityTypeViewModel();
                viewModel.ActivityCategories = activityCategoryViewModels;
                return Ok(viewModel);
            }
            else
            {
                var type = UnitOfWork.Repository<ActivityType>()
                    .Get(x => x.ActivityTypeId == id && x.DeletedAt == null)
                    .SingleOrDefault();
                if (type == null)
                {
                    return BadRequest();
                }

                var viewModel = Mapper.Map<ActivityType, EditActivityTypeViewModel>(type);
                viewModel.ActivityCategories = activityCategoryViewModels;

                return Ok(viewModel);
            }
        }


        // PUT: api/admin/activity/types/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutActivityType(EditActivityTypeViewModel viewModel)
        {
            var type = UnitOfWork.Repository<ActivityType>()
                .Get(x => x.ActivityTypeId == viewModel.ActivityTypeId && x.DeletedAt == null)
                .SingleOrDefault();
            if (type == null)
            {
                return BadRequest();
            }

            Mapper.Map<EditActivityTypeViewModel, ActivityType>(viewModel, type);
            type.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<ActivityType>().Update(type);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityTypeExists(viewModel.ActivityCategoryId))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/admin/activity/categories/
        [HttpPost]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PostActivityType(CreateActivityTypeViewModel viewModel)
        {
            var type = Mapper.Map<CreateActivityTypeViewModel, ActivityType>(viewModel);
            UnitOfWork.Repository<ActivityType>().Insert(type);
            UnitOfWork.Save();

            // См. атрибут KoJsonValidate 
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return Ok();
        }

        // DELETE: api/admin/activity/categories/5
        [HttpDelete]
        [Route("{id:int}")]
        [ResponseType(typeof(ActivityType))]
        public IHttpActionResult DeleteActivityType(int id)
        {
            var type = UnitOfWork.Repository<ActivityType>()
                .Get(x => x.ActivityTypeId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (type == null)
            {
                return NotFound();
            }

            type.DeletedAt = DateTime.Now;
            UnitOfWork.Repository<ActivityType>().Update(type);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityTypeExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(type);
        }

        private bool ActivityTypeExists(int id)
        {
            return UnitOfWork.Repository<ActivityType>().GetQ().Count(e => e.ActivityTypeId == id && e.DeletedAt == null) > 0;
        }
    }
}