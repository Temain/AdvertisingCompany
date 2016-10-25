define(['jquery', 'knockout', 'sammy'], function ($, ko, sammy) {
    return (function () {

        var current = {
            path : {},
            params: {}
        }

        return {
            currentPath : current.path,
            currentParams : current.params,
            initialize: function() {
                sammy(function() {
                    this.post('/account/logoff/', function() { return true; });

                    // Клиенты
                    this.get('#clients', function() {
                        app.componentName('clients');
                    });

                    this.get('#clients/create', function() {
                        app.componentName('client-create');
                    });

                    this.get('#clients/:id/edit', function () {
                        current.params['clientId'] = this.params['id'];
                        app.componentName('client-edit');
                    });

                    // Рекламные кампании
                    this.get('#campaigns', function () {
                        app.componentName('campaigns');
                    });

                    this.get('#clients/:id/campaigns/create', function () {
                        current.params['clientId'] = this.params['id'];
                        app.componentName('campaign-create');
                    });

                    this.get('#clients/:id/campaigns/:campaignId/edit', function () {
                        current.params['clientId'] = this.params['id'];
                        current.params['campaignId'] = this.params['campaignId'];
                        app.componentName('campaign-edit');
                    });

                    // Рекламные поверхности (адрес)
                    this.get('#addresses', function () {
                        app.componentName('addresses');
                    });

                    this.get('#addresses/create', function () {
                        app.componentName('address-create');
                    });

                    this.get('#addresses/:id/edit', function () {
                        current.params['addressId'] = this.params['id'];
                        app.componentName('address-edit');
                    });

                    // Фотоотчёты
                    this.get('#addresses/:id/reports', function () {
                        current.params['addressId'] = this.params['id'];
                        app.componentName('address-reports');
                    });

                    this.get('#clients/:clientId/campaigns/:campaignId/reports', function () {
                        current.params['campaignId'] = this.params['campaignId'];
                        app.componentName('client-reports');
                    });

                    // Справочники
                    // Категории деятельности
                    this.get('#activity/categories', function () {
                        app.componentName('activity-categories');
                    });

                    this.get('#activity/categories/create', function () {
                        app.componentName('activity-category-create');
                    });

                    this.get('#activity/categories/:id/edit', function () {
                        current.params['activityCategoryId'] = this.params['id'];
                        app.componentName('activity-category-edit');
                    });

                    // Виды деятельности
                    this.get('#activity/types', function () {
                        app.componentName('activity-types');
                    });

                    this.get('#activity/types/create', function () {
                        app.componentName('activity-type-create');
                    });

                    this.get('#activity/types/:id/edit', function () {
                        current.params['activityTypeId'] = this.params['id'];
                        app.componentName('activity-type-edit');
                    });

                    // Календарь
                    this.get('#calendar', function () {
                        app.componentName('calendar');
                    });

                    // Аналитика
                    this.get('#analytics', function() {
                        app.componentName('analytics');
                    });
                    this.get('/admin/', function() { this.app.runRoute('get', '#analytics') });
                }).run();
            }
        }
    }());
});