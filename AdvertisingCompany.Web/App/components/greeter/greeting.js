/// <reference path="C:\Users\Temain\Documents\Visual Studio 2015\Projects\AdvertisingCompany\AdvertisingCompany.Web\Views/Greeter/greeting.html" />
define(['knockout', 'text!app/components/greeter/greeting.html'], function (ko, greeterTemplate) {
    function greeterViewModel(params) {
        var self = this;
        self.message = ko.observable(params.message);
        return self;
    }
    return { viewModel: greeterViewModel, template: greeterTemplate };
});