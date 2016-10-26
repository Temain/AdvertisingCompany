var initCalendar = function (options) {
    
    var events = options.events || [];
    var createEvent = options.createEvent || function () { };
    var editEvent = options.editEvent || function () { };

    function pageLoad() {
        $('#external-events').find('div.external-event').each(function () {

            // create an Event Object (http://arshaw.com/fullcalendar/docs/event_data/Event_Object/)
            // it doesn't need to have a start or end
            var eventObject = {
                title: $.trim($(this).text()) // use the element's text as the event title
            };

            // store the Event Object in the DOM element so we can get to it later
            $(this).data('eventObject', eventObject);

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });

        });

        var date = new Date();
        var d = date.getDate();
        var m = date.getMonth();
        var y = date.getFullYear();
        var $calendar = $('#calendar').fullCalendar({
            header: {
                left: '',
                center: '',
                right: ''
            },
            allDayText: 'Весь день',
            axisFormat: 'HH:mm',

            // time formats
            titleFormat: {
                month: 'MMMM yyyy',
                week: "MMM d[ yyyy]{ '&#8212;'[ MMM] d yyyy}",
                day: 'dddd, MMM d, yyyy'
            },
            columnFormat: {
                month: 'ddd',
                week: 'ddd d.M',
                day: 'dddd d.M'
            },
            timeFormat: { // for event elements
                '': 'HH:mm' // default
            },
            lang: 'ru',
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            monthNamesShort: ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июнь', 'Июль', 'Авг.', 'Сент.', 'Окт.', 'Ноя.', 'Дек.'],
            dayNames: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
            dayNamesShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            selectable: true,
            selectHelper: true,
            select: function (start, end, allDay) {
                var $modal = $("#createModal"),
                    $btn = $('#createEvent');
                $btn.off('click');
                $btn.click(function () {
                    var title = $("#event-name").val();
                    if (title) {
                        var event =  {
                            title: title,
                            start: start,
                            end: end,
                            allDay: allDay,
                            backgroundColor: '#64bd63',
                            textColor: '#fff'
                        };

                        $calendar.fullCalendar('renderEvent', event, true);
                        saveEvent(event);
                    }
                    $calendar.fullCalendar('unselect');
                });
                $modal.modal('show');
                $calendar.fullCalendar('unselect');
            },
            editable: true,
            droppable: true,
            drop: function (date, allDay) { // this function is called when something is dropped

                // retrieve the dropped element's stored Event Object
                var originalEventObject = $(this).data('eventObject');

                // we need to copy it, so that multiple events don't have a reference to the same object
                var copiedEventObject = $.extend({}, originalEventObject);

                // assign it the date that was reported
                copiedEventObject.start = date;
                copiedEventObject.allDay = allDay;

                var $categoryClass = $(this).data('event-class');
                if ($categoryClass)
                    copiedEventObject['className'] = [$categoryClass];

                // render the event on the calendar
                // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
                $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);

                $(this).remove();
            },
            eventDrop: function(event, delta, revertFunc) {
                editEvent(event);
            },
            events : events,
            // US Holidays
            //events: [
            //    {
            //        title: 'All Day Event',
            //        start: new Date(y, m, 1),
            //        backgroundColor: '#79A5F0',
            //        textColor: '#fff'
            //    },
            //    {
            //        title: 'Long Event',
            //        start: new Date(y, m, d + 5),
            //        end: new Date(y, m, d + 7)
            //    },
            //    {
            //        id: 999,
            //        title: 'Repeating Event',
            //        start: new Date(y, m, d - 3, 16, 0),
            //        allDay: false
            //    },
            //    {
            //        title: 'Click for Flatlogic',
            //        start: new Date(y, m, 28),
            //        end: new Date(y, m, 29),
            //        url: 'http://flatlogic.com/',
            //        backgroundColor: '#e5603b',
            //        textColor: '#fff'
            //    }
            //],

            eventClick: function (event) {
                // opens events in a popup window
                if (event.url) {
                    window.open(event.url, 'gcalevent', 'width=700,height=600');
                    return false;
                } else {
                    var $modal = $("#editModal"),
                        $modalLabel = $("#editModalLabel");
                    $modalLabel.html(event.title);
                    $modal.find(".modal-body p").html(function () {
                        if (event.allDay) {
                            return "На весь день";
                        } else {
                            return "Начало: <strong>" + event.start.getHours() + ":" + (event.start.getMinutes() == 0 ? "00" : event.start.getMinutes()) + "</strong></br>"
                                + (event.end == null ? "" : "Окончание: <strong>" + event.end.getHours() + ":" + (event.end.getMinutes() == 0 ? "00" : event.end.getMinutes()) + "</strong>");
                        }
                    }());
                    $modal.modal('show');
                }
            }

        });

        $("#calendar-switcher").find("label").click(function () {
            $calendar.fullCalendar('changeView', $(this).find('input').val());
        });

        var currentDate = $calendar.fullCalendar('getDate');

        $('#calender-current-date').html(
            moment(currentDate).lang("ru").format('MMMM YYYY').capitalize() +
            " - <span class='fw-semi-bold'>" +
            moment(currentDate).lang("ru").format("dddd").capitalize() +
            "</span>"
        );

        $('#calender-prev').click(function () {
            $calendar.fullCalendar('prev');
            currentDate = $calendar.fullCalendar('getDate');
            $('#calender-current-date').html(
                moment(currentDate).lang("ru").format('MMMM YYYY').capitalize() +
                " - <span class='fw-semi-bold'>" +
                moment(currentDate).lang("ru").format("dddd").capitalize() +
                "</span>"
            );
        });
        $('#calender-next').click(function () {
            $calendar.fullCalendar('next');
            currentDate = $calendar.fullCalendar('getDate');
            $('#calender-current-date').html(
                moment(currentDate).lang("ru").format('MMMM YYYY').capitalize() +
                " - <span class='fw-semi-bold'>" +
                moment(currentDate).lang("ru").format("dddd").capitalize() +
                "</span>"
            );
        });
    }
    pageLoad();
};

String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
}