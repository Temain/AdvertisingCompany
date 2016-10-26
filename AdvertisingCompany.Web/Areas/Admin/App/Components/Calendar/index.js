define(['jquery', 'knockout', 'sammy', 'fullcalendar-locale', 'gins-calendar', 'text!/areas/admin/app/components/calendar/index.html'], function ($, ko, sammy, fc, initCalendar, template) {
    function CalendarViewModel(params) {
        var self = this;

        self.isInitialized = ko.observable(false);

        self.init = function () {         
            $.ajax({
                method: 'get',
                url: '/api/admin/analytics',
                contentType: "application/json; charset=utf-8",
                headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
                success: function (data) {
                    setTimeout(function () {
                        self.isInitialized(true);
                        initCalendar({
                            saveEvent: self.saveEvent
                        });
                    }, 1000);
                }
            });
        };

        self.saveEvent = function (event) {
            
        };

        return self;
    }

    var calendar = new CalendarViewModel();

    app.addViewModel({
        name: "calendar",
        bindingMemberName: "calendar",
        instance: calendar
    });

    calendar.init();

    return { viewModel: { instance: calendar }, template: template };
});