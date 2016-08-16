define(['jquery', 'knockout', 'sammy', 'text!/areas/admin/app/components/analytics/index.html'], function ($, ko, sammy, template) {
    function AnalyticsViewModel(params) {
        var self = this;

        self.status = ko.observable("");

        self.init = function () {
            $.ajax({
                method: 'get',
                url: '/api/admin/analytics',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                success: function (data) {
                    self.status('Состояние: ' + data);
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