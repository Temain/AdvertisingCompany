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
using System.Data.Entity;

namespace AdvertisingCompany.Web.Areas.Admin.Controllers
{
    [Authorize(Roles = "Administrator, Manager")]
    [RoutePrefix("api/admin/activity/categories")]
    public class ActivityCategoriesController : BaseApiController
    {
        public ActivityCategoriesController(IUnitOfWork unitOfWork)
            : base(unitOfWork)
        {
        }

        // GET: api/admin/activity/categories
        [HttpGet]
        [Route("")]
        [ResponseType(typeof(ListActivityCategoriesViewModel))]
        public ListActivityCategoriesViewModel GetActivityCategories(string query = null, int page = 1, int pageSize = 10)
        {
            var categoriesList = UnitOfWork.Repository<ActivityCategory>()
                .GetQ(x => x.DeletedAt == null, orderBy: o => o.OrderBy(c => c.ActivityCategoryName));

            if (query != null)
            {
                categoriesList = categoriesList.Where(x => x.ActivityCategoryName.Contains(query));
            }

            var categories = categoriesList
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsNoTracking()
                .ToList();

            var categoryViewModels = Mapper.Map<List<ActivityCategory>, List<ActivityCategoryViewModel>>(categories);
            var viewModel = new ListActivityCategoriesViewModel
            {
                Categories = categoryViewModels,
                PagesCount = (int) Math.Ceiling((double)categoriesList.Count() / pageSize),
                Page = page
            };
            return viewModel;
        }

        // GET: api/admin/activity/categories/0 (new) or api/admin/activity/categories/5 (edit)
        [HttpGet]
        [Route("{id:int}")]
        [ResponseType(typeof(CreateActivityCategoryViewModel))]
        [ResponseType(typeof(EditActivityCategoryViewModel))]
        public IHttpActionResult GetActivityCategory(int id)
        {
            if (id == 0)
            {
                var viewModel = new CreateActivityCategoryViewModel();
                return Ok(viewModel);
            }
            else
            {
                var category = UnitOfWork.Repository<ActivityCategory>()
                    .Get(x => x.ActivityCategoryId == id && x.DeletedAt == null)
                    .SingleOrDefault();
                if (category == null)
                {
                    return BadRequest();
                }

                var viewModel = Mapper.Map<ActivityCategory, EditActivityCategoryViewModel>(category);

                return Ok(viewModel);
            }
        }


        // PUT: api/admin/activity/categories/5
        [HttpPut]
        [Route("")]
        [KoJsonValidate]
        [ResponseType(typeof(void))]
        public IHttpActionResult PutActivityCategory(EditActivityCategoryViewModel viewModel)
        {
            var category = UnitOfWork.Repository<ActivityCategory>()
                .Get(x => x.ActivityCategoryId == viewModel.ActivityCategoryId && x.DeletedAt == null)
                .SingleOrDefault();
            if (category == null)
            {
                return BadRequest();
            }

            Mapper.Map<EditActivityCategoryViewModel, ActivityCategory>(viewModel, category);
            category.UpdatedAt = DateTime.Now;

            UnitOfWork.Repository<ActivityCategory>().Update(category);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityCategoryExists(viewModel.ActivityCategoryId))
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
        public IHttpActionResult PostActivityCategory(CreateActivityCategoryViewModel viewModel)
        {
            var category = Mapper.Map<CreateActivityCategoryViewModel, ActivityCategory>(viewModel);
            UnitOfWork.Repository<ActivityCategory>().Insert(category);
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
        [ResponseType(typeof(ActivityCategory))]
        public IHttpActionResult DeleteActivityCategory(int id)
        {
            var category = UnitOfWork.Repository<ActivityCategory>()
                .Get(x => x.ActivityCategoryId == id && x.DeletedAt == null)
                .SingleOrDefault();
            if (category == null)
            {
                return NotFound();
            }

            category.DeletedAt = DateTime.Now;
            UnitOfWork.Repository<ActivityCategory>().Update(category);

            try
            {
                UnitOfWork.Save();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ActivityCategoryExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return Ok(category);
        }

        private bool ActivityCategoryExists(int id)
        {
            return UnitOfWork.Repository<ActivityCategory>().GetQ().Count(e => e.ActivityCategoryId == id && e.DeletedAt == null) > 0;
        }
    }
}