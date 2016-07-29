define(['knockout', 'text!static/greeter/greeting.html'], function (ko, greeterTemplate) {
    function greeterViewModel(params) {
        var self = this;
        self.message = ko.observable(params.message);
        return self;
    }
    return { viewModel: greeterViewModel, template: greeterTemplate };
});