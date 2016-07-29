require.config(requireConfig);

// var app = {};
require(['jquery', 'knockout', 'knockout-validation', 'appdm', 'appvm'], function ($, ko, kov, appDataModel, appViewModel)
{
    var app = new appViewModel(new appDataModel());
    app.initialize();

    // Инициализация валидации Knockout
    ko.validation.init({
        decorateInputElement: true,
        errorClass: 'ko-field-validation-error',
        grouping: { observable: false }
    });

    ko.applyBindingsWithValidation(app);
});


// ko.components.register('analytics', { require: 'areas/admin/scripts/app/components/analytics/analytics.viewmodel' });