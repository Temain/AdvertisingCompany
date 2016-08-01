var requireConfig = {
    baseUrl: '/',
    paths: {
        'appdm': 'areas/admin/scripts/app/app.datamodel',
        'appvm': 'areas/admin/scripts/app/app.viewmodel',
        'bootstrap': 'scripts/bootstrap/bootstrap.min',
        'bootstrap-select': 'scripts/bootstrap-select/bootstrap-select.min',
        'bootstrap-datetimepicker': 'scripts/bootstrap-datetimepicker/bootstrap-datetimepicker',
        'bootstrap-typeahead': 'scripts/typeahead/bootstrap3-typeahead.min',
        'jquery': 'scripts/jquery/jquery-1.10.2.min',
        'knockout': 'scripts/knockout/knockout-3.4.0.debug',
        'knockout.mapping': 'scripts/knockout/knockout.mapping-latest.debug',
        'knockout.validation': 'scripts/knockout/knockout.validation.min',
        'knockout.validation.server-side': 'scripts/knockout/knockout-server-side-validation',
        'knockout.bindings.datetimepicker': 'scripts/knockout/knockout.bindings.datetimepicker',
        'knockout.bindings.numeric': 'scripts/knockout/knockout.bindings.numeric',
        'knockout.bindings.selectpicker': 'scripts/knockout/knockout.bindings.selectpicker',
        'knockout.bindings.tooltip': 'scripts/knockout/knockout.bindings.tooltip',
        'knockout.bindings.typeahead': 'scripts/knockout/knockout.bindings.typeahead',
        'text': 'scripts/require/text',
        'sammy': 'scripts/sammy/sammy-0.7.5.min',
        'common': 'scripts/app/common',
        'underscore': 'scripts/underscore/underscore.min',
        'moment': 'scripts/moment/moment-with-locales.min',
        'progress': 'scripts/progress',
        'gins': 'scripts/gins/app',
        'gins-settings': 'scripts/gins/settings',
        'widgster': 'scripts/widgster/widgster',
        'jquery-slimscroll': 'scripts/jquery-slimscroll/jquery.slimscroll.min',
        'pace': 'scripts/pace/pace.min',
        'bootstrap-notify': 'scripts/bootstrap-notify/bootstrap-notify.min'
    },
    shim: {
        'bootstrap': ['jquery'],
        'bootstrap-datetimepicker': ['moment'],
        'knockout.mapping': {
            deps: ['knockout'],
            exports: 'koMapping'
        },
        'knockout.validation.server-side' : {
            deps: ['jquery', 'knockout'],
            exports: 'koValidation'
        },
        'gins-settings': ['jquery'],
        'gins': {
            deps: ['jquery', 'widgster', 'gins-settings', 'bootstrap', 'jquery-slimscroll', 'pace', 'bootstrap-notify'],
            exports: 'Sing'
        },
        'widgster': ['jquery'],
        'jquery-slimscroll': ['jquery'],
        'progress': {
            deps: ['jquery', 'bootstrap'],
            exports: 'progress'
        },
        'appvm': ['knockout', 'appdm', 'sammy', 'common']
    }
}