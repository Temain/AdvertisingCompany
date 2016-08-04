define(['jquery', 'knockout', 'sammy', 'routes', 'knockout.validation.server-side', 'common', 'underscore', 'app-data'], function ($, ko, sammy, routes, koValidation, common, _, dataModel)
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

        self.backlink = function () {
            window.location.hash = app.returnUrl;
        }

        self.routes = routes;

        // Отображаемый компонент 
        self.componentName = ko.observable();
        self.componentName.subscribe(function (newValue) {
            var componentViewModel = self.views[newValue];
            if (typeof componentViewModel !== "undefined" && typeof componentViewModel.init === 'function') {
                componentViewModel.init();
            }
        });

        // Инициализация компонентов
        self.registerComponents = function () {
            var rootPath = 'areas/admin/scripts/app/components/';
            var register = ko.components.register;

            register('analytics', {
                require: rootPath + 'analytics/analytics.viewmodel'
            });

            // Клиенты
            register('clientsList', {
                require: rootPath + 'clients/list.viewmodel'
            });
            register('createClient', {
                require: rootPath + 'clients/create.viewmodel'
            });
            register('editClient', {
                require: rootPath + 'clients/edit.viewmodel'
            });

            // Рекламные кампании
            register('campaignsList', {
                require: rootPath + 'campaigns/list.viewmodel'
            });
            register('createCampaign', {
                require: rootPath + 'campaigns/create.viewmodel'
            });
            register('editCampaign', {
                require: rootPath + 'campaigns/edit.viewmodel'
            });

            // Рекламные полотна (адреса)
            register('addressesList', {
                require: rootPath + 'addresses/list.viewmodel'
            });
            register('createAddress', {
                require: rootPath + 'addresses/create.viewmodel'
            });
            register('editAddress', {
                require: rootPath + 'addresses/edit.viewmodel'
            });

            // Справочники:
            // Виды деятельности
            register('activitiesList', {
                require: rootPath + 'activities/list.viewmodel'
            });

            // Фотоотчёты
            register('reportsList', {
                require: rootPath + 'reports/list.viewmodel'
            });

            self.componentName('analytics');
        };

        self.applyComponent = function (viewModel) {
            $('.selectpicker').html('');
            $('.selectpicker').selectpicker('destroy');

            var componentBody = $('#component .widget')[0];
            ko.applyValidation(viewModel, componentBody);
            ko.cleanNode(componentBody);
            ko.applyBindingsToDescendants(viewModel, componentBody);

            $('.selectpicker').selectpicker('refresh');
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
