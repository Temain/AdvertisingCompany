var requireConfig = {
    baseUrl: '/',
    paths: {
        'appdm': 'areas/admin/scripts/app/app.datamodel',
        'appvm': 'areas/admin/scripts/app/app.viewmodel',
        'bootstrap': 'scripts/bootstrap/bootstrap',
        'jquery': 'scripts/jquery/jquery-1.10.2',
        'knockout': 'scripts/knockout/knockout-3.4.0.debug',
        'knockout-validation': 'scripts/knockout/knockout.validation',
        'text': 'scripts/require/text',
        'sammy': 'scripts/sammy/sammy-0.7.5.min',
        'common': 'scripts/app/common'
    },
    shim: {
        'bootstrap': ['jquery'],
        'appvm': ['knockout', 'appdm', 'sammy', 'common']
    }
}