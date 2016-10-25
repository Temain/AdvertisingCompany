define(['jquery', 'knockout', 'sammy', 'fullcalendar-locale', 'gins-calendar', 'text!/areas/admin/app/components/calendar/index.html'], function ($, ko, sammy, fc, initCalendar, template) {
    function CalendarViewModel(params) {
        var self = this;

        self.status = ko.observable("");

        self.init = function () {
            // 
            //$.ajax({
            //    method: 'get',
            //    url: '/api/admin/analytics',
            //    contentType: "application/json; charset=utf-8",
            //    headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
            //    success: function (data) {
            //        alert('!!!');
            //    }
            //});

            setTimeout(function () {
                initCalendar();

                //$('#calendar').fullCalendar({
                //    locale: 'ru'
                //});
            }, 3000);
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