require.config(requireConfig);

/*
 * Глобальные переменные:
 *  - app [views, view, componentName]
 *  - app.routes [current]
 * 
 * Процесс добавления компонента:
 * 1. Добавить модель представления и шаблон в соответствии с уже имеющимися в проекте,
 * при необходимости добавить функцию init()
 * 2. В файле routes.js добавить роутинг
 * 3. В файле app.viewmodel.js зарегистрировать компонент [ko.components.register]
 * 
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
