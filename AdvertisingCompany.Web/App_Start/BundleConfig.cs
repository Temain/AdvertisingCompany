﻿namespace AdvertisingCompany.Web
{
    using System.Web.Optimization;
    using AdvertisingCompany.Web.Constants;

    public static class BundleConfig
    {
        /// <summary>
        /// For more information on bundling, visit <see cref="http://go.microsoft.com/fwlink/?LinkId=301862"/>.
        /// </summary>
        public static void RegisterBundles(BundleCollection bundles)
        {
            // Enable Optimizations
            // Set EnableOptimizations to false for debugging. For more information,
            // Web.config file system.web/compilation[debug=true]
            // OR
            // BundleTable.EnableOptimizations = true;

            // Enable CDN usage.
            // Note: that you can choose to remove the CDN if you are developing an intranet application.
            // Note: We are using Google's CDN where possible and then Microsoft if not available for better
            //       performance (Google is more likely to have been cached by the users browser).
            // Note: that protocol (http:) is omitted from the CDN URL on purpose to allow the browser to choose the protocol.
            bundles.UseCdn = false;

            AddCss(bundles);
            AddJavaScript(bundles);
        }

        private static void AddCss(BundleCollection bundles)
        {
            // Bootstrap - Twitter Bootstrap CSS (http://getbootstrap.com/).
            // Site - Your custom site CSS.
            // Note: No CDN support has been added here. Most likely you will want to customize your copy of bootstrap.
            bundles.Add(new StyleBundle(
                "~/styles/app")
                .Include("~/Content/bootstrap.css")
                .Include("~/Content/styles.css", new CssRewriteUrlTransform()));

            // Font Awesome - Icons using font (http://fortawesome.github.io/Font-Awesome/).
            bundles.Add(new StyleBundle(
                "~/styles/fa"/*,
                ContentDeliveryNetwork.MaxCdn.FontAwesomeUrl*/)
                .Include("~/Content/font-awesome.css"));

            bundles.Add(new StyleBundle("~/styles/login")
                .Include("~/Content/gins/application.css")
                .Include("~/Content/gins/custom.css"));

            bundles.Add(new StyleBundle("~/styles/login-ie9")
                .Include("~/Content/gins/application-ie9-part2.css")
                .Include("~/Content/gins/custom.css"));

            bundles.Add(new StyleBundle("~/styles/gins")
                .Include("~/Content/gins/application.css")
                .Include("~/Content/magnific-popup/magnific-popup.css")
                .Include("~/Content/dropzone/dropzone.css")
                .Include("~/Content/shuffle/style.css")
                .Include("~/Content/shuffle/shuffle-style.css")
                .Include("~/Content/gins/custom.css"));

            bundles.Add(new StyleBundle("~/styles/gins-ie9")
                .Include("~/Content/gins/application-ie9-part2.css"));

            bundles.Add(new StyleBundle("~/styles/datepicker")
                .Include("~/Content/bootstrap-datetimepicker.css"));

            bundles.Add(new StyleBundle("~/styles/select")
                .Include("~/Content/bootstrap-select.css"));

            bundles.Add(new StyleBundle("~/styles/select2")
                .Include("~/Content/select2/select2.css")
                .Include("~/Content/select2/select2-bootstrap.css"));

            bundles.Add(new StyleBundle("~/styles/datatables")
                .Include("~/Content/datatables/jquery.dataTables.css"));

            bundles.Add(new StyleBundle("~/styles/kladr")
                .Include("~/Content/kladr/jquery.kladr.min.css")
                .Include("~/Content/kladr/style.css"));

            bundles.Add(new StyleBundle("~/styles/magnific-popup")
                .Include("~/Content/magnific-popup/magnific-popup.css"));

            bundles.Add(new StyleBundle("~/styles/shuffle")
                .Include("~/Content/shuffle/style.css")
                .Include("~/Content/shuffle/shuffle-styles.css"));
        }

        /// <summary>
        /// Creates and adds JavaScript bundles to the bundle collection. Content Delivery Network's (CDN) are used
        /// where available.
        ///
        /// Note: MVC's built in <see cref="System.Web.Optimization.Bundle.CdnFallbackExpression"/> is not used as
        /// using in-line scripts is not permitted under Content Security Policy (CSP) (See <see cref="FilterConfig"/>
        /// for more details).
        ///
        /// Instead, we create our own fail-over bundles. If a CDN is not reachable, the fail-over script loads the
        /// local bundles instead. The fail-over script is only a few lines of code and should have a minimal impact,
        /// although it does add an extra request (Two if the browser is IE8 or less). If you feel confident in the CDN
        /// availability and prefer better performance, you can delete these lines.
        /// </summary>
        /// <param name="bundles">The bundles.</param>
        private static void AddJavaScript(BundleCollection bundles)
        {
            // jQuery - The JavaScript helper API (http://jquery.com/).
            Bundle jqueryBundle = new ScriptBundle("~/bundles/jquery"/*, ContentDeliveryNetwork.Google.JQueryUrl*/)
                .Include("~/Scripts/jquery/jquery-{version}.js");
            bundles.Add(jqueryBundle);

            // jQuery Validate - Client side JavaScript form validation (http://jqueryvalidation.org/).
            Bundle jqueryValidateBundle = new ScriptBundle(
                "~/bundles/jqueryval"/*,
                ContentDeliveryNetwork.Microsoft.JQueryValidateUrl*/)
                .Include("~/Scripts/jquery/jquery.validate*");
            bundles.Add(jqueryValidateBundle);

            // Microsoft jQuery Validate Unobtrusive - Validation using HTML data- attributes
            // http://stackoverflow.com/questions/11534910/what-is-jquery-unobtrusive-validation
            Bundle jqueryValidateUnobtrusiveBundle = new ScriptBundle(
                "~/bundles/jqueryvalunobtrusive"/*,
                ContentDeliveryNetwork.Microsoft.JQueryValidateUnobtrusiveUrl*/)
                .Include("~/Scripts/jquery/jquery.validate*");
            bundles.Add(jqueryValidateUnobtrusiveBundle);

            // Modernizr - Allows you to check if a particular API is available in the browser (http://modernizr.com).
            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            // Note: The current version of Modernizr does not support Content Security Policy (CSP) (See FilterConfig).
            // See here for details: https://github.com/Modernizr/Modernizr/pull/1263 and
            // http://stackoverflow.com/questions/26532234/modernizr-causes-content-security-policy-csp-violation-errors
            Bundle modernizrBundle = new ScriptBundle(
                "~/bundles/modernizr"/*,
                ContentDeliveryNetwork.Microsoft.ModernizrUrl*/)
                .Include("~/Scripts/modernizr-*");
            bundles.Add(modernizrBundle);

            // Bootstrap - Twitter Bootstrap JavaScript (http://getbootstrap.com/).
            Bundle bootstrapBundle = new ScriptBundle(
                "~/bundles/bootstrap"/*,
                ContentDeliveryNetwork.Microsoft.BootstrapUrl*/)
                .Include("~/Scripts/bootstrap/bootstrap.js")
                .Include("~/Scripts/respond/respond.js");
            bundles.Add(bootstrapBundle);

            Bundle knockoutBundle = new ScriptBundle("~/bundles/knockout")
                .Include("~/Scripts/knockout/knockout-{version}.js")
                .Include("~/Scripts/knockout/knockout.mapping-latest.js")
                .Include("~/Scripts/knockout/knockout.validation.js")
                .Include("~/Scripts/knockout/knockout-server-side-validation.js")
                .Include("~/Scripts/knockout/knockout.bindings.js");
            bundles.Add(knockoutBundle);

            Bundle singBundle = new ScriptBundle("~/bundles/gins")
                //.Include("~/Scripts/bootstrap/transition.js")
                //.Include("~/Scripts/bootstrap/collapse.js")
                .Include("~/Scripts/bootstrap/button.js")
                .Include("~/Scripts/bootstrap/tooltip.js")
                .Include("~/Scripts/bootstrap/alert.js")
                .Include("~/Scripts/jquery-slimscroll/jquery.slimscroll.js")
                .Include("~/Scripts/widgster/widgster.js")
                .Include("~/Scripts/pace/pace.min.js")
                .Include("~/Scripts/gins/settings.js")
                .Include("~/Scripts/gins/app.js")
                .Include("~/Scripts/gins/index.js")
                .Include("~/Scripts/gins/custom.js")
                .Include("~/Scripts/shuffle/dist/jquery.shuffle.modernizr.min.js")
                .Include("~/Scripts/magnific-popup/dist/jquery.magnific-popup.min.js")
                .Include("~/Scripts/gins/gallery.js")
                .Include("~/Scripts/jasny-bootstrap/js/fileinput.js")
                .Include("~/Scripts/jasny-bootstrap/js/inputmask.js")
                .Include("~/Scripts/holder/holder.js")
                .Include("~/Scripts/filesize.min.js");
            bundles.Add(singBundle);

            Bundle singLoginBundle = new ScriptBundle("~/bundles/gins-login")
                .Include("~/Scripts/bootstrap/transition.js")
                .Include("~/Scripts/bootstrap/collapse.js")
                .Include("~/Scripts/bootstrap/dropdown.js")
                .Include("~/Scripts/bootstrap/button.js")
                .Include("~/Scripts/bootstrap/tooltip.js")
                .Include("~/Scripts/bootstrap/alert.js")
                .Include("~/Scripts/jquery-slimscroll/jquery.slimscroll.js")
                .Include("~/Scripts/widgster/widgster.js")
                //.Include("~/Scripts/pace.js/pace.min.js")
                .Include("~/Scripts/gins/settings.js")
                .Include("~/Scripts/gins/app.js")
                .Include("~/Scripts/gins/index.js")
                .Include("~/Scripts/gins/custom.js");
            bundles.Add(singLoginBundle);

            Bundle datepickerBundle = new ScriptBundle("~/bundles/datepicker")
                .Include("~/Scripts/moment/moment-with-locales.min.js")
                .Include("~/Scripts/bootstrap-datetimepicker/bootstrap-datetimepicker.js");      
            bundles.Add(datepickerBundle);

            Bundle selectBundle = new ScriptBundle("~/bundles/select")
                .Include("~/Scripts/bootstrap-select/bootstrap-select.min.js");
            bundles.Add(selectBundle);

            Bundle typeaheadBundle = new ScriptBundle("~/bundles/typeahead")
                .Include("~/Scripts/typeahead/bootstrap3-typeahead.min.js");
            bundles.Add(typeaheadBundle);

            Bundle highchartsBundle = new ScriptBundle("~/bundles/highcharts")
                .Include("~/Scripts/highcharts/highcharts.js")
                .Include("~/Scripts/highcharts/highcharts-more.js")
                .Include("~/Scripts/highcharts/modules/data.js")
                .Include("~/Scripts/highcharts/modules/exporting.js");
            bundles.Add(highchartsBundle);

            Bundle datatableBundle = new ScriptBundle("~/bundles/datatables")
                .Include("~/Scripts/datatables/jquery.dataTables.js")
                .Include("~/Scripts/datatables/tables-dynamic.js");
            bundles.Add(datatableBundle);

            Bundle notifyBundle = new ScriptBundle("~/bundles/bootstrap-notify")
                .Include("~/Scripts/bootstrap-notify/bootstrap-notify.js");
            bundles.Add(notifyBundle);

            Bundle kladrBundle = new ScriptBundle("~/bundles/kladr")
                .Include("~/Scripts/kladr/core.js")
                .Include("~/Scripts/kladr/kladr.js")
                .Include("~/Scripts/kladr/kladr_zip.js")
                // .Include("~/Scripts/kladr/jquery.kladr.min.js")
                .Include("~/Scripts/kladr/form_with_map.js");
            bundles.Add(kladrBundle);

            Bundle magnificBundle = new ScriptBundle("~/bundles/magnific-popup")
                .Include("~/Scripts/magnific-popup/dist/jquery.magnific-popup.min.js");
            bundles.Add(magnificBundle);

            Bundle paceBundle = new ScriptBundle("~/bundles/pace")
                .Include("~/Scripts/pace/pace.min.js");
            bundles.Add(paceBundle);

            Bundle shuffleBundle = new ScriptBundle("~/bundles/shuffle")
                .Include("~/Scripts/shuffle/dist/shuffle.js");
            bundles.Add(shuffleBundle);

            // Script bundle for the site. The fall-back scripts are for when a CDN fails, in this case we load a local
            // copy of the script instead.
            Bundle failoverCoreBundle = new ScriptBundle("~/bundles/site")
                .Include("~/Scripts/fallback/styles.js")
                .Include("~/Scripts/fallback/scripts.js")
                .Include("~/Scripts/logging.js");
            bundles.Add(failoverCoreBundle);
        }
    }
}
