using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using System.Web.Http;

namespace AdvertisingCompany.Web.Results
{
    public class HtmlActionResult<T> : IHttpActionResult
    {
        private readonly string _viewTemplate;
        private readonly T _model;

        public HtmlActionResult(string viewTemplateFullPath, T model)
        {
            _viewTemplate = File.ReadAllText(AppDomain.CurrentDomain.BaseDirectory + viewTemplateFullPath);
            _model = model;
        }

        public Task<HttpResponseMessage> ExecuteAsync(CancellationToken cancellationToken)
        {
            var response = new HttpResponseMessage(HttpStatusCode.OK);

            var parsedView = RazorEngine.Razor.Parse(_viewTemplate, _model);

            response.Content = new StringContent(parsedView);
            response.Content.Headers.ContentType = new MediaTypeHeaderValue("text/html");

            return Task.FromResult(response);
        }
    }
}