define(['jquery', 'knockout', 'sammy', 'routes', 'components',
    'knockout.validation.server-side', 'common', 'underscore',
    'app-data'], function ($, ko, sammy, routes, components, koValidation, common, _, dataModel)
{
    function AppViewModel(dataModel) {
        var self = this;

        self.dataModel = dataModel;
        // self.view = ko.observable();
        self.views = {};
        self.routes = routes;
        self.isInitialized = ko.observable(false);

        // Отображаемый компонент 
        self.componentName = ko.observable();
        self.componentName.subscribe(function (newValue) {
            var componentViewModel = self.views[newValue];
            if (typeof componentViewModel !== "undefined" && typeof componentViewModel.init === 'function') {
                componentViewModel.init();
            }
        });

        function cleanUpLocation() {
            window.location.hash = "";

            if (typeof (history.pushState) !== "undefined") {
                history.pushState("", document.title, location.pathname);
            }
        }

        self.addViewModel = function (options) {
            self.views[options.name] = options.viewItem;

            var navigator;

            self[options.bindingMemberName] = ko.computed(function () {
                if (!dataModel.getAccessToken()) {
                    var fragment = window.common.getFragment();
                    if (fragment.access_token) {
                        window.location.hash = fragment.state || '';
                        dataModel.setAccessToken(fragment.access_token);

                        self.isInitialized(true);
                    } else {
                        window.location = "/account/authorize?client_id=web&response_type=token&state=" + encodeURIComponent(window.location.hash);
                    }
                } else {
                    self.isInitialized(true);
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

        self.applyComponent = function (viewModel) {
            var selectpickers = $('.selectpicker');
            if (selectpickers.length) {
                $('.selectpicker').html('');
                $('.selectpicker').selectpicker('destroy');
            }

            var componentBody = $('#component .widget')[0];
            if (componentBody) {
                ko.applyValidation(viewModel, componentBody);
                ko.cleanNode(componentBody);
                ko.applyBindingsToDescendants(viewModel, componentBody);
            }

            if (selectpickers.length) {
                $('.selectpicker').selectpicker('refresh');
            }
        };

        self.applyElement = function (viewModel, elementBody) {
            if (elementBody) {
                ko.applyValidation(viewModel, elementBody);
                ko.cleanNode(elementBody);
                ko.applyBindingsToDescendants(viewModel, elementBody);
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
            routes.initialize();
            self.initSidebar();
        }
    }

    var appViewModel = new AppViewModel(dataModel);

    // Добавляем модель представления чтобы получить access_token
    // При отсутствии access_token'a происходит перенаправление на метод authorize 
    appViewModel.addViewModel({
        name: "loading",
        bindingMemberName: "loading",
        viewItem: {}
    });

    // После перенаправления получаем access_token
    appViewModel.addViewModel({
        name: "loaded",
        bindingMemberName: "loaded",
        viewItem: {}
    });

    return appViewModel;
});
