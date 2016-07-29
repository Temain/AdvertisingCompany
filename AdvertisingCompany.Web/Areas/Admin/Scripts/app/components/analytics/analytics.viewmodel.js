define(['knockout', 'sammy', 'text!areas/admin/static/analytics/index.html'], function (ko, template) {
    function analyticsViewModel(params) {
        var self = this;

        self.status = ko.observable("");

        Sammy(function () {
            this.get('#analytics', function () {
                // Make a call to the protected Web API by passing in a Bearer Authorization Header
                $.ajax({
                    method: 'get',
                    url: '/admin/api/analytics/get',
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                    },
                    success: function (data) {
                        self.status('Состояние: ' + data);
                        app.view(self);
                    }
                });
            });
            this.get('/admin/', function () { this.app.runRoute('get', '#analytics') });
        });

        return self;
    }

    return { viewModel: analyticsViewModel, template: template };
});






















//function AnalyticsViewModel(app, dataModel) {
//    var self = this;

//    self.status = ko.observable("");

//    Sammy(function () {
//        this.get('#analytics', function () {
//            // Make a call to the protected Web API by passing in a Bearer Authorization Header
//            $.ajax({
//                method: 'get',
//                url: '/admin/api/analytics/get',
//                contentType: "application/json; charset=utf-8",
//                headers: {
//                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
//                },
//                success: function (data) {
//                    self.status('Состояние: ' + data);
//                    app.view(self);
//                }
//            });
//        });
//        this.get('/admin/', function () { this.app.runRoute('get', '#analytics') });
//    });

//    return self;
//}

//app.addViewModel({
//    name: "Analytics",
//    bindingMemberName: "analytics",
//    factory: AnalyticsViewModel
//});
