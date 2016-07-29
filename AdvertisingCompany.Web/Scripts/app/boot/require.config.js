var requireConfig = {
    baseUrl: '/',
    paths: {
        'bootstrap': 'scripts/bootstrap/bootstrap',
        'jquery': 'scripts/jquery/jquery-1.10.2',
        'knockout': 'scripts/knockout/knockout-3.4.0.debug',
        'text': 'scripts/require/text'
    },
    shim: {
        'bootstrap': {
            deps: ['jquery']
        }
    }
}