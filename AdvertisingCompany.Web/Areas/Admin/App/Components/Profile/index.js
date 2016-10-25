define(['jquery', 'knockout', 'sammy', 'text!/areas/admin/app/components/profile/index.html'], function ($, ko, sammy, template) {
    function ProfileViewModel(params) {
        var self = this;

        self.status = ko.observable("");
        self.isInitialized = ko.observable(false);

        self.init = function () {
            $.ajax({
                method: 'get',
                url: '/api/admin/analytics',
                contentType: "application/json; charset=utf-8",
                headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
                success: function (data) {
                    self.isInitialized(true);
                }
            });
        };

        return self;
    }

    var profile = new ProfileViewModel();

    app.addViewModel({
        name: "profile",
        bindingMemberName: "profile",
        instance: profile
    });

    profile.init();

    return { viewModel: { instance: profile }, template: template };
});