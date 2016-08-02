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
                        app.views['clientsList'].init();
                    });

                    this.get('#clients/create', function() {
                        app.componentName('createClient');
                        app.views['createClient'].init();
                    });

                    this.get('#clients/:id/edit', function () {
                        current.params['clientId'] = this.params['id'];
                        app.componentName('editClient');
                        app.views['editClient'].init();
                    });

                    // Рекламные кампании
                    this.get('#campaigns', function () {
                        app.componentName('campaignsList');
                        app.views['campaignsList'].init();
                    });

                    this.get('#clients/:id/campaigns/create', function () {
                        current.params['clientId'] = this.params['id'];
                        app.componentName('createCampaign');
                        app.views['createCampaign'].init();
                    });

                    this.get('#clients/:id/campaigns/:campaignId/edit', function () {
                        current.params['clientId'] = this.params['id'];
                        current.params['campaignId'] = this.params['campaignId'];
                        app.componentName('editCampaign');
                        app.views['editCampaign'].init();
                    });

                    // Рекламные поверхности (адрес)
                    this.get('#addresses', function () {
                        app.componentName('addressesList');
                        app.views['addressesList'].init();
                    });

                    this.get('#addresses/create', function () {
                        app.componentName('createAddress');
                        app.views['createAddress'].init();
                    });

                    this.get('#addresses/:id/edit', function () {
                        current.params['addressId'] = this.params['id'];
                        app.componentName('editAddress');
                        app.views['editAddress'].init();
                    });

                    // Фотоотчёты
                    this.get('#addresses/:id/reports', function () {
                        current.params['addressId'] = this.params['id'];
                        app.componentName('reportsList');
                        app.views['reportsList'].init();
                    });

                    this.get('#clients/:clientId/campaigns/:campaignId/reports', function () {
                        current.params['campaignId'] = this.params['campaignId'];
                        app.componentName('reportsList');
                        app.views['reportsList'].init();
                    });

                    // Виды деятельности
                    this.get('#activities', function () {
                        app.componentName('activitiesList');
                        app.views['activitiesList'].init();
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