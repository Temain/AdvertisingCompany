define(['jquery', 'knockout'], function ($, ko, sammy) {
    return (function () {

        //var current = {
        //    path: {},
        //    params: {}
        //}

        return {
            initialize: function () {
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
                // Категории видов деятельности
                register('activityCategoriesList', {
                    require: rootPath + 'activityCategories/list.viewmodel'
                });
                register('createActivityCategory', {
                    require: rootPath + 'activityCategories/create.viewmodel'
                });
                register('editActivityCategory', {
                    require: rootPath + 'activityCategories/edit.viewmodel'
                });

                // Виды деятельности
                register('activityTypesList', {
                    require: rootPath + 'activityTypes/list.viewmodel'
                });
                register('createActivityType', {
                    require: rootPath + 'activityTypes/create.viewmodel'
                });
                register('editActivityType', {
                    require: rootPath + 'activityTypes/edit.viewmodel'
                });

                // Фотоотчёты
                register('reportsList', {
                    require: rootPath + 'reports/list.viewmodel'
                });
            }
        }
    }());
});