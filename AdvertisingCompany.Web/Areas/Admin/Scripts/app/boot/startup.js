require.config(requireConfig);

var app = {};
require(['jquery', 'knockout', 'knockout.validation', 'sammy', 'appdm', 'appvm', 'gins-settings', 'gins'],
    function ($, ko, kov, sammy, appDataModel, appViewModel, gins) {
        app = new appViewModel(new appDataModel());

        // Инициализация валидации Knockout
        ko.validation.init({
            decorateInputElement: true,
            errorClass: 'ko-field-validation-error',
            grouping: { observable: false }
        });
      
        ko.components.register('analytics', { require: 'areas/admin/scripts/app/components/analytics/analytics.viewmodel' });
        ko.components.register('clientsList', { require: 'areas/admin/scripts/app/components/clients/list.viewmodel' });

        app.componentName('analytics');
        app.initialize();

        ko.applyBindingsWithValidation(app);
    });
