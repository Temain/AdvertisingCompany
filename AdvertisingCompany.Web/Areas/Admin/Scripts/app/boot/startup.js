require.config(requireConfig);

var app = {};
require(['jquery', 'knockout', 'knockout-validation', 'appdm', 'appvm'],
    function ($, ko, kov, appDataModel, appViewModel) {
        app = new appViewModel(new appDataModel());
        app.initialize();

        // Инициализация валидации Knockout
        ko.validation.init({
            decorateInputElement: true,
            errorClass: 'ko-field-validation-error',
            grouping: { observable: false }
        });

        ko.components.register('analytics', { require: 'areas/admin/scripts/app/components/analytics/analytics.viewmodel' });
        ko.components.register('clientsList', { require: 'areas/admin/scripts/app/components/clients/list.viewmodel' });

        ko.applyBindingsWithValidation(app);
    });
