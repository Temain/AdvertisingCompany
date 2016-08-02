require.config(requireConfig);

/*
 * Global variables:
 *  - app
 *  - routes
 */

var app = {};
require(['jquery', 'knockout', 'knockout.validation', 'routes', 'app'],
    function ($, ko, kov, routes, appLoaded) {
        app = appLoaded;

        // Инициализация валидации Knockout
        ko.validation.init({
            decorateInputElement: true,
            errorClass: 'ko-field-validation-error',
            grouping: { observable: false }
        });

        app.initialize();

        ko.applyBindingsWithValidation(app);
    });
