define(['jquery', 'knockout', 'sammy', 'fullcalendar-locale', 'gins-calendar',
'text!/areas/admin/app/components/calendar/index.html'], function ($, ko, sammy, fc, initCalendar, template) {

    function CalendarViewModel(params) {
        var self = this;

        self.selectedYear = ko.observable(new Date().getFullYear());
        self.monthsEvents = ko.observableArray([]);
        self.monthsEventsByYear = ko.computed(function () {
            return ko.utils.arrayFilter(self.monthsEvents(), function (monthEvents) {
                return monthEvents.yearNumber == self.selectedYear();
            });
        });

        self.isInitialized = ko.observable(false);

        self.init = function () {
            self.isInitialized(false);

            $.ajax({
                method: 'get',
                url: '/api/admin/calendar',
                contentType: "application/json; charset=utf-8",
                headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
                error: function (response) { console.log(response); },
                success: function (data) {
                    self.monthsEvents(data.monthsEvents);

                    var events = $.map(data.events, function (element) {
                        return {
                            id: element.calendarId,
                            title: element.title,
                            start: element.start ? moment(element.start).toDate() : null,
                            end: element.end ? moment(element.end).toDate() : null,
                            backgroundColor: element.color,
                            allDay: element.allDay,
                            textColor: '#fff'
                        };
                    });

                    setTimeout(function () {
                        self.isInitialized(true);
                        initCalendar({
                            events: events,
                            createEvent: self.createEvent,
                            editEvent: self.editEvent,
                            deleteEvent: self.deleteEvent
                        });
                    }, 1000);
                }
            });
        };

        self.createEvent = function (event, onSuccess) {
            var postData = {
                CalendarId: event.id || 0,
                Title: event.title,
                Start: event.start ? moment(event.start).format() : null,
                End: event.end ? moment(event.end).format() : null,
                AllDay: event.allDay,
                Color: event.backgroundColor
            };

            $.ajax({
                method: 'post',
                url: '/api/admin/calendar/',
                data: JSON.stringify(postData),
                contentType: "application/json; charset=utf-8",
                headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
                error: function(response) { console.log(response); },
                success: function (response) {
                    onSuccess(response.id);
                }
            });
        };

        self.editEvent = function (event) {
            var putData = {
                CalendarId: event.id,
                Title: event.title,
                Start: event.start ? moment(event.start).format() : null,
                End: event.end ? moment(event.end).format() : null,
                AllDay: event.allDay,
                Color: event.backgroundColor
            }

            $.ajax({
                method: 'put',
                url: '/api/admin/calendar/',
                data: JSON.stringify(putData),
                contentType: "application/json; charset=utf-8",
                headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
                error: function (response) { console.log(response); },
                success: function (response) { }
            });
        };

        self.deleteEvent = function (eventId) {
            $.ajax({
                method: 'delete',
                url: '/api/admin/calendar/' + eventId,
                contentType: "application/json; charset=utf-8",
                headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
                error: function (response) { console.log(response); },
                success: function (response) { }
            });
        };

        self.setMonth = function (monthNumber) {
            var currentDate = moment($("#calendar").fullCalendar('getDate')).lang('ru');
            $("#calendar").fullCalendar('gotoDate', currentDate.get('year'), monthNumber);

            currentDate = moment($("#calendar").fullCalendar('getDate')).lang('ru');
            $('#calender-current-date').html(currentDate.format('MMMM YYYY').capitalize());
        };

        self.monthName = function (monthNumber) {
            var fakeDate = new Date(2016, monthNumber, 1);
            var result = moment(fakeDate).locale('ru').format('MMMM');
            return result.charAt(0).toUpperCase() + result.slice(1);
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