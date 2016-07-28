using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Http.ModelBinding;
using System.Web.Http.Results;

namespace AdvertisingCompany.Web.Extensions
{
    public static class ModelStateExtensions
    {
        public static object ToKoJson(this ModelStateDictionary modelState)
        {
            var errors = modelState
                .Where(x => x.Value.Errors.Count > 0)
                .Select(ms => new
                {
                    key = ms.Key.ToLower(),
                    //Value = string.Join(",", ms.Value.Errors.Select(x => x.ErrorMessage)),
                    value = ms.Value.Errors.First().ErrorMessage
                })
                .ToArray();

            return errors;
        }
    }
}