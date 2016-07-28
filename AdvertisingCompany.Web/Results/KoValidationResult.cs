using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Net;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using AdvertisingCompany.Web.Extensions;

namespace AdvertisingCompany.Web.Results
{
    public class KoValidationResult : IHttpActionResult
    {
        private ModelStateDictionary _modelState;

        public KoValidationResult(ModelStateDictionary modelState)
        {
            _modelState = modelState;
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage();
            response.StatusCode = HttpStatusCode.BadRequest;
            response.Content = new JsonContent(new { koValid = _modelState.IsValid, modelState = _modelState.ToKoJson() });

            return Task.FromResult(response);
        }
    }
}