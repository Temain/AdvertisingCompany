var requireConfig = {
    baseUrl: '/',
    waitSeconds: 14, // default: 7
    paths: {
        'app': 'areas/admin/app/app',
        'routes': 'areas/admin/app/routes.config',
        'components': 'areas/admin/app/components.config',
        'bootstrap': 'scripts/bootstrap/bootstrap.min',
        'bootstrap-select': 'scripts/bootstrap-select/bootstrap-select.min',
        'bootstrap-datetimepicker': 'scripts/bootstrap-datetimepicker/bootstrap-datetimepicker',
        'bootstrap-typeahead': 'scripts/typeahead/bootstrap3-typeahead.min',
        'jquery': 'scripts/jquery/jquery-1.10.2.min',
        'jquery-ui-core': 'scripts/jquery-ui/ui/core',
        'jquery-ui-widget': 'scripts/jquery-ui/ui/widget',
        'jquery-ui-mouse': 'scripts/jquery-ui/ui/mouse',
        'jquery-ui-draggable': 'scripts/jquery-ui/ui/draggable',
        'jquery-ui-resizable': 'scripts/jquery-ui/ui/resizable',
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
        'common': 'scripts/common',
        'underscore': 'scripts/underscore/underscore.min',
        'moment': 'scripts/moment/moment-with-locales.min',
        'progress': 'scripts/progress',
        'gins': 'scripts/gins/app',
        'gins-settings': 'scripts/gins/settings',
        'gins-gallery': 'scripts/gins/gallery',
        'gins-calendar': 'scripts/gins/calendar',
        'widgster': 'scripts/widgster/widgster',
        'jquery-slimscroll': 'scripts/jquery-slimscroll/jquery.slimscroll.min',
        'pace': 'scripts/pace/pace.min',
        'bootstrap-notify': 'scripts/bootstrap-notify/bootstrap-notify.min',
        'kladr': 'scripts/kladr/kladr',
        'kladr-core': 'scripts/kladr/core',
        'kladr-with-map': 'scripts/kladr/form_with_map',
        'ymaps': '//api-maps.yandex.ru/2.1/?lang=ru_RU',
        'holder': 'scripts/holder/holder',
        'file-input': 'scripts/jasny-bootstrap/js/fileinput',
        'magnific-popup': 'scripts/magnific-popup/dist/jquery.magnific-popup.min',
        'modernizr': 'scripts/shuffle/dist/modernizr.custom.min',
        'shuffle': 'scripts/shuffle/dist/shuffle.min',
        'evenheights': 'scripts/shuffle/dist/evenheights',
        'file-size': 'scripts/filesize.min',
        'dropzone': 'scripts/dropzone/dropzone-amd-module',
        'fullcalendar': 'scripts/fullcalendar/fullcalendar.min',
        'fullcalendar-locale': 'scripts/fullcalendar/dist/lang/ru'
    },
    shim: {
        'app': ['gins'],
        'bootstrap': ['jquery'],
        'bootstrap-datetimepicker': ['moment'],
        'knockout.bindings.datetimepicker': ['bootstrap-datetimepicker'],
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
        'gins-gallery': {
            deps: ['jquery', 'magnific-popup', 'shuffle'],
            exports: 'initGallery'
        },
        'gins-calendar': {
            deps: [
                'jquery', 'fullcalendar'
            ],
            exports: 'initCalendar'
        },
        'magnific-popup' : {
            deps: ['jquery']   
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'file-size': {
            exports: 'filesize'
        },
        'widgster': ['jquery'],
        'jquery-slimscroll': ['jquery'],
        'progress': {
            deps: ['jquery', 'bootstrap'],
            exports: 'progress'
        },
        'kladr-core': ['jquery'],
        'kladr': {
            deps: ['kladr-core']
        },
        'kladr-with-map' : {
            deps: ['kladr', 'ymaps'],
            exports: 'kladrWithMap'
        },
        'fullcalendar': ['moment', 'jquery', 'jquery-ui-core', 'jquery-ui-widget', 'jquery-ui-mouse', 'jquery-ui-draggable', 'jquery-ui-resizable'],
        'fullcalendar-locale': ['fullcalendar']
    }
}