define(['jquery', 'knockout'], function ($, ko, sammy) {
    return (function () {

        //var current = {
        //    path: {},
        //    params: {}
        //}

        return {
            initialize: function () {
                var rootPath = 'areas/admin/app/components/';
                var register = ko.components.register;

                register('analytics', {
                    require: rootPath + 'analytics/index'
                });

                // Клиенты
                register('clients', { require: rootPath + 'clients/index' });
                register('client-create', { require: rootPath + 'clients/create' });
                register('client-edit', { require: rootPath + 'clients/edit' });

                // Рекламные кампании
                register('campaigns', { require: rootPath + 'campaigns/index' });
                register('campaign-create', { require: rootPath + 'campaigns/create' });
                register('campaign-edit', { require: rootPath + 'campaigns/edit' });

                // Рекламные полотна (адреса)
                register('addresses', { require: rootPath + 'addresses/index' });
                register('address-create', { require: rootPath + 'addresses/create' });
                register('address-edit', { require: rootPath + 'addresses/edit' });

                // Справочники:
                // Категории видов деятельности
                register('activity-categories', { require: rootPath + 'activity/categories/index' });
                register('activity-category-create', { require: rootPath + 'activity/categories/create' });
                register('activity-category-edit', { require: rootPath + 'activity/categories/edit' });

                // Виды деятельности
                register('activity-types', { require: rootPath + 'activity/types/index' });
                register('activity-type-create', { require: rootPath + 'activity/types/create' });
                register('activity-type-edit', { require: rootPath + 'activity/types/edit' });

                // Фотоотчёты
                register('address-reports', { require: rootPath + 'reports/address-reports' });
                register('client-reports', { require: rootPath + 'reports/client-reports' });
            }
        }
    }());
});