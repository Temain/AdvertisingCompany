using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using System.Net.Http;
using AdvertisingCompany.Web.Extensions;

namespace AdvertisingCompany.Web.ActionFilters
{
    public class KoJsonValidateAttribute : ActionFilterAttribute
    {
        protected bool IgnoreValidation;

        public KoJsonValidateAttribute(bool ignoreValidation = false)
        {
            this.IgnoreValidation = ignoreValidation;
        }

        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            if (IgnoreValidation)
            {
                return;
            }

            var modelState = actionContext.ModelState;
            if (!modelState.IsValid)
            {
                actionContext.Response = actionContext.Request.CreateResponse(HttpStatusCode.BadRequest, 
                     new { KoValid = modelState.IsValid, ModelState = modelState.ToKoJson() });
            }
        }
    }
}