define(['jquery', 'knockout', 'knockout.mapping', 'sammy', 'fullcalendar-locale', 'gins-calendar',
'text!/areas/admin/app/components/calendar/index.html'], function ($, ko, koMapping, sammy, fc, initCalendar, template) {

    ko.mapping = koMapping;

    function CalendarViewModel(params) {
        var self = this;

        self.selectedYear = ko.observable(new Date().getFullYear());
        self.monthsEvents = ko.observableArray([]);
        self.monthsEventsByYear = ko.computed(function () {
            var events = ko.utils.arrayFilter(self.monthsEvents(), function (monthEvents) {
                return monthEvents.yearNumber == self.selectedYear();
            });

            return events.sort(function (first, second) {
                return first.monthNumber == second.monthNumber ? 0 : (first.monthNumber < second.monthNumber ? -1 : 1);
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
                    ko.mapping.fromJS(
                        data.monthsEvents,
                        {
                            create: function (options) {
                                var monthEvents = {
                                    yearNumber: options.data.yearNumber,
                                    monthNumber: options.data.monthNumber,
                                    count: ko.observable(options.data.count)
                                };
                                return monthEvents;
                            }
                        },
                        self.monthsEvents
                    );

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
                            deleteEvent: self.deleteEvent,
                            setYear: self.setYear
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
                    self.eventsAddedOrDeleted(event.start, 1);
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

        self.deleteEvent = function (event) {
            $.ajax({
                method: 'delete',
                url: '/api/admin/calendar/' + event.id,
                contentType: "application/json; charset=utf-8",
                headers: { 'Authorization': 'Bearer ' + app.getAccessToken() },
                error: function (response) { console.log(response); },
                success: function (response) {
                    self.eventsAddedOrDeleted(event.start, -1);
                }
            });
        };

        self.eventsAddedOrDeleted = function (date, count) {
            if (!date) return;

            var eventMonth = moment(date).get('month') + 1;
            var eventYear = moment(date).get('year');

            var monthEvents = ko.utils.arrayFirst(self.monthsEvents(), function (item) {
                return item.yearNumber === eventYear && item.monthNumber === eventMonth;
            });

            if (monthEvents) {
                monthEvents.count(monthEvents.count() + count);

                if (!monthEvents.count()) {
                    self.monthsEvents.remove(monthEvents);
                }
            } else {
                self.monthsEvents.push({ yearNumber: eventYear, monthNumber: eventMonth, count: ko.observable(1) });
            }
        };

        self.setYear = function (year) {
            self.selectedYear(year);
        };

        self.setMonth = function (monthNumber) {
            var currentDate = moment($("#calendar").fullCalendar('getDate')).lang('ru');
            $("#calendar").fullCalendar('gotoDate', currentDate.get('year'), monthNumber);

            currentDate = moment($("#calendar").fullCalendar('getDate')).lang('ru');
            $('#calendar-current-date').html(currentDate.format('MMMM YYYY').capitalize());
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