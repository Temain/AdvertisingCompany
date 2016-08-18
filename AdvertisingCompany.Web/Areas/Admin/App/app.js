define(['jquery', 'knockout', 'sammy', 'routes', 'components', 'knockout.validation.server-side',
    'common', 'underscore'], function ($, ko, sammy, routes, components, koValidation, common, _)
{
    function AppViewModel() {
        var self = this;

        self.userInfoUrl = "/api/Me";
        self.siteUrl = "/admin/";
        self.returnUrl = self.siteUrl;

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

        self.setAccessToken = function (accessToken) {
            sessionStorage.setItem("accessToken", accessToken);
        };

        self.getAccessToken = function () {
            return sessionStorage.getItem("accessToken");
        };

        function cleanUpLocation() {
            window.location.hash = "";

            if (typeof (history.pushState) !== "undefined") {
                history.pushState("", document.title, location.pathname);
            }
        }

        self.addViewModel = function (options) {
            self.views[options.name] = options.instance;

            self[options.bindingMemberName] = ko.computed(function () {
                if (!self.getAccessToken()) {
                    var fragment = window.common.getFragment();
                    if (fragment.access_token) {
                        window.location.hash = fragment.state || '';
                        self.setAccessToken(fragment.access_token);

                        self.isInitialized(true);
                    } else {
                        window.location = "/account/authorize?client_id=web&response_type=token&state=" + encodeURIComponent(window.location.hash);
                    }
                } else {
                    self.isInitialized(true);
                }

                return self.views[options.name];
            });
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
            var sidebar = $('#sidebar');
            var url = window.location.hash;
            var newActiveLink = sidebar.find('a[href*="' + url + '"]').filter(function () {
                return this.hash === url;
            });

            // collapse .collapse only if new and old active links belong to different .collapse
            if (!newActiveLink.is('.active > .collapse > li > a')) {
                sidebar.find('.active .active').closest('.collapse').collapse('hide');
            }
            sidebar.find('.active').removeClass('active');

            newActiveLink.closest('li').addClass('active')
                .parents('li').addClass('active');

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

    var appViewModel = new AppViewModel();

    // Добавляем модель представления чтобы получить access_token
    // При отсутствии access_token'a происходит перенаправление на метод authorize 
    appViewModel.addViewModel({
        name: "loading",
        bindingMemberName: "loading",
        instance: {}
    });

    // После перенаправления получаем access_token
    appViewModel.addViewModel({
        name: "loaded",
        bindingMemberName: "loaded",
        instance: {}
    });

    return appViewModel;
});
