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
                        app.componentName('clientsList');
                    });

                    this.get('#clients/create', function() {
                        app.componentName('createClient');
                    });

                    this.get('#clients/:id/edit', function () {
                        current.params['clientId'] = this.params['id'];
                        app.componentName('editClient');
                    });

                    // Рекламные кампании
                    this.get('#campaigns', function () {
                        app.componentName('campaignsList');
                    });

                    this.get('#clients/:id/campaigns/create', function () {
                        current.params['clientId'] = this.params['id'];
                        app.componentName('createCampaign');
                    });

                    this.get('#clients/:id/campaigns/:campaignId/edit', function () {
                        current.params['clientId'] = this.params['id'];
                        current.params['campaignId'] = this.params['campaignId'];
                        app.componentName('editCampaign');
                    });

                    // Рекламные поверхности (адрес)
                    this.get('#addresses', function () {
                        app.componentName('addressesList');
                    });

                    this.get('#addresses/create', function () {
                        app.componentName('createAddress');
                    });

                    this.get('#addresses/:id/edit', function () {
                        current.params['addressId'] = this.params['id'];
                        app.componentName('editAddress');
                    });

                    // Фотоотчёты
                    this.get('#addresses/:id/reports', function () {
                        current.params['addressId'] = this.params['id'];
                        current.params['campaignId'] = null;
                        app.componentName('reportsList');
                    });

                    this.get('#clients/:clientId/campaigns/:campaignId/reports', function () {
                        current.params['campaignId'] = this.params['campaignId'];
                        current.params['addressId'] = null;
                        app.componentName('reportsList');
                    });

                    // Справочники
                    // Категории деятельности
                    this.get('#activity/categories', function () {
                        app.componentName('activityCategoriesList');
                    });

                    this.get('#activity/categories/create', function () {
                        app.componentName('createActivityCategory');
                    });

                    this.get('#activity/categories/:id/edit', function () {
                        current.params['activityCategoryId'] = this.params['id'];
                        app.componentName('editActivityCategory');
                    });

                    // Виды деятельности
                    this.get('#activities', function () {
                        app.componentName('activitiesList');
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