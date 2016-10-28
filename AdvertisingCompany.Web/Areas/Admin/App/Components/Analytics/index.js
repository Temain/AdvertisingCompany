define(['jquery', 'knockout', 'knockout.mapping', 'sammy',
'text!/areas/admin/app/components/analytics/index.html'], function ($, ko, koMapping, sammy, template) {

    ko.mapping = koMapping;

    function AnalyticsViewModel(params) {
        var self = this;

        self.isInitialized = ko.observable(false);

        self.clients = ko.observable(AnalyticsViewModel.clients || '0');
        self.newClients = ko.observable(AnalyticsViewModel.newClients || '0');
        self.visitsPerDay = ko.observable(AnalyticsViewModel.visitsPerDay || '0');
        self.online = ko.observable(AnalyticsViewModel.online || '0');
        self.advertisingObjects = ko.observable(AnalyticsViewModel.advertisingObjects || '0');
        self.reports = ko.observable(AnalyticsViewModel.reports || '0');
        self.incomeForYear = ko.observable(AnalyticsViewModel.incomeForYear || '0');
        self.incomeForMonth = ko.observable(AnalyticsViewModel.incomeForMonth || '0');

        self.init = function () {
            self.isInitialized(false);

            $.ajax({
                method: 'get',
                url: '/api/admin/analytics',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                success: function (response) {
                    if (response) {
                        ko.mapping.fromJS(response, {}, self);

                        self.isInitialized(true);
                    }
                }
            });
        };

        return self;
    }

    var analytics = new AnalyticsViewModel();

    app.addViewModel({
        name: "analytics",
        bindingMemberName: "analytics",
        instance: analytics
    });

    analytics.init();

    return { viewModel: { instance: analytics }, template: template };
});