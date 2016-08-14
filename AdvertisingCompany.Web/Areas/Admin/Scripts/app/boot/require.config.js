var requireConfig = {
    baseUrl: '/',
    waitSeconds: 14, // default: 7
    paths: {
        'app': 'areas/admin/scripts/app/app.viewmodel',
        'app-data': 'areas/admin/scripts/app/app.datamodel',
        'routes': 'areas/admin/scripts/app/boot/routes',
        'components': 'areas/admin/scripts/app/boot/components',
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
        'common': 'scripts/common',
        'underscore': 'scripts/underscore/underscore.min',
        'moment': 'scripts/moment/moment-with-locales.min',
        'progress': 'scripts/progress',
        'gins': 'scripts/gins/app',
        'gins-settings': 'scripts/gins/settings',
        'gins-gallery': 'scripts/gins/gallery',
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
        'shuffle': 'scripts/shuffle/dist/jquery.shuffle.modernizr.min',
        'file-size': 'scripts/filesize.min',
        'dropzone': 'scripts/dropzone/dropzone-amd-module'
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
        'magnific-popup' : {
            deps: ['jquery']   
        },
        'modernizr': {
            exports: 'Modernizr'
        },
        'file-size': {
            exports: 'filesize'
        },
        'shuffle': ['jquery', 'modernizr'],
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
        }
    }
}