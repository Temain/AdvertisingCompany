define(['jquery', 'knockout', 'sammy', 'routes', 'common', 'underscore', 'app-data'], function ($, ko, sammy, routes, common, _, dataModel)
{
    function AppViewModel(dataModel) {
        // Private state
        var self = this;

        // Private operations
        function cleanUpLocation() {
            window.location.hash = "";

            if (typeof (history.pushState) !== "undefined") {
                history.pushState("", document.title, location.pathname);
            }
        }
        // Data
        self.views = {
            Loading: {} // Other views are added dynamically by app.addViewModel(...).
        };
        self.dataModel = dataModel;

        // UI state
        self.view = ko.observable(self.views.Loading);

        self.componentName = ko.observable();

        self.loading = ko.computed(function () {
            return self.view() === self.views.Loading;
        });

        // UI operations

        // Other navigateToX functions are added dynamically by app.addViewModel(...).

        // Other operations
        self.addViewModel = function (options) {
            // Add view to AppViewModel.Views enum (for example, app.Views.Home).
            self.views[options.name] = options.viewItem;

            var navigator;

            // Add binding member to AppViewModel (for example, app.home);
            self[options.bindingMemberName] = ko.computed(function () {
                if (!dataModel.getAccessToken()) {
                    // The following code looks for a fragment in the URL to get the access token which will be
                    // used to call the protected Web API resource
                    var fragment = window.common.getFragment();

                    if (fragment.access_token) {
                        // returning with access token, restore old hash, or at least hide token
                        window.location.hash = fragment.state || '';
                        dataModel.setAccessToken(fragment.access_token);
                    } else {
                        // no token - so bounce to Authorize endpoint in AccountController to sign in or register
                        window.location = "/account/authorize?client_id=web&response_type=token&state=" + encodeURIComponent(window.location.hash);
                    }
                }

                if (self.view() !== options.viewItem) {
                    return null;
                }

                return self.views[options.name];
            });

            if (typeof (options.navigatorFactory) !== "undefined") {
                navigator = options.navigatorFactory(self, dataModel);
            } else {
                navigator = function () {
                    window.location.hash = options.bindingMemberName;
                };
            }

            // Add navigation member to AppViewModel (for example, app.NavigateToHome());
            self["navigateTo" + options.name] = navigator;
        };

        self.backlink = function () {
            window.location.hash = app.returnUrl;
        }

        self.routes = routes;

        self.registerComponents = function() {
            ko.components.register('analytics', { require: 'areas/admin/scripts/app/components/analytics/analytics.viewmodel' });

            ko.components.register('clientsList', { require: 'areas/admin/scripts/app/components/clients/list.viewmodel' });
            ko.components.register('createClient', { require: 'areas/admin/scripts/app/components/clients/create.viewmodel' });
            ko.components.register('editClient', { require: 'areas/admin/scripts/app/components/clients/edit.viewmodel' });

            ko.components.register('campaignsList', { require: 'areas/admin/scripts/app/components/campaigns/list.viewmodel' });
            ko.components.register('createCampaign', { require: 'areas/admin/scripts/app/components/campaigns/create.viewmodel' });
            ko.components.register('editCampaign', { require: 'areas/admin/scripts/app/components/campaigns/edit.viewmodel' });

            ko.components.register('addressesList', { require: 'areas/admin/scripts/app/components/addresses/list.viewmodel' });
            ko.components.register('createAddress', { require: 'areas/admin/scripts/app/components/addresses/create.viewmodel' });
            ko.components.register('editAddress', { require: 'areas/admin/scripts/app/components/addresses/edit.viewmodel' });

            ko.components.register('activitiesList', { require: 'areas/admin/scripts/app/components/activities/list.viewmodel' });

            ko.components.register('reportsList', { require: 'areas/admin/scripts/app/components/reports/list.viewmodel' });

            self.componentName('analytics');
        };

        self.initialize = function () {
            self.registerComponents();
            routes.initialize();

            // Пометка активных элементов сайдбара
            $('.sidebar-nav ul > li > a').click(function () {
                $('.sidebar-nav ul > li').removeClass('active');
                $(this).parent().addClass('active');
                $('.sidebar-nav a[data-parent="#sidebar"]').parent('li').removeClass('active');
                $(this).closest('ul').parent('li').addClass('active');
            });

            $('.sidebar-nav a[data-parent="#sidebar"]').click(function () {
                $('.sidebar-nav a[data-parent="#sidebar"]').parent('li').removeClass('active');
                $(this).parent('li').addClass('active');
                var childLinks = $(this).next('ul');
                if (!childLinks.length) {
                    $('.sidebar-nav ul > li').removeClass('active');
                }
            });
        }
    }

    return new AppViewModel(dataModel);
});
