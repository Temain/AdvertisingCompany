define(['jquery', 'knockout', 'sammy', 'routes', 'components',
    'knockout.validation.server-side', 'common', 'underscore',
    'app-data'], function ($, ko, sammy, routes, components, koValidation, common, _, dataModel)
{
    function AppViewModel(dataModel) {
        var self = this;

        function cleanUpLocation() {
            window.location.hash = "";

            if (typeof (history.pushState) !== "undefined") {
                history.pushState("", document.title, location.pathname);
            }
        }

        self.views = {
            Loading: {} 
        };

        self.dataModel = dataModel;

        self.view = ko.observable(self.views.Loading);

        self.loading = ko.computed(function () {
            return self.view() === self.views.Loading;
        });

        self.addViewModel = function (options) {
            self.views[options.name] = options.viewItem;

            var navigator;

            self[options.bindingMemberName] = ko.computed(function () {
                if (!dataModel.getAccessToken()) {
                    var fragment = window.common.getFragment();
                    if (fragment.access_token) {
                        window.location.hash = fragment.state || '';
                        dataModel.setAccessToken(fragment.access_token);
                    } else {
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

            self["navigateTo" + options.name] = navigator;
        };

        //self.backlink = function () {
        //    window.location.hash = app.returnUrl;
        //}

        self.routes = routes;

        // Отображаемый компонент 
        self.componentName = ko.observable();
        self.componentName.subscribe(function (newValue) {
            var componentViewModel = self.views[newValue];
            if (typeof componentViewModel !== "undefined" && typeof componentViewModel.init === 'function') {
                componentViewModel.init();
            }
        });

        self.applyComponent = function (viewModel) {
            var selectpickers = $('.selectpicker');
            if (selectpickers.length) {
                $('.selectpicker').html('');
                $('.selectpicker').selectpicker('destroy');
            }

            var componentBody = $('#component .widget')[0];
            ko.applyValidation(viewModel, componentBody);
            ko.cleanNode(componentBody);
            ko.applyBindingsToDescendants(viewModel, componentBody);

            if (selectpickers.length) {
                $('.selectpicker').selectpicker('refresh');
            }
        };

        self.initSidebar = function () {
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
        };

        self.initialize = function () {
            components.initialize();
            self.componentName('analytics');

            routes.initialize();

            self.initSidebar();
        }
    }

    return new AppViewModel(dataModel);
});
