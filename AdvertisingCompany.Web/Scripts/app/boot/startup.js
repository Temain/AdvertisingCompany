require.config(requireConfig);

var app = {};
define(['jquery', 'knockout', 'bootstrap'], function ($, ko)
{
    ko.components.register('greeter', { require: 'scripts/app/components/greeter/greeting' });

    function AppViewModel() {
        var self = this;
        self.view = ko.observable('');

        self.changeView = function (viewName) {
            self.view(viewName);
        };
    }

    app = new AppViewModel();
    ko.applyBindings();
});