define(['knockout', 'bootstrap-datetimepicker'], function (ko, bsdt) {
    ko.bindingHandlers.datepicker = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            //initialize datepicker with some optional options
            var options = allBindingsAccessor().datepickerOptions || { format: 'DD/MM/YYYY HH:mm' };
            $(element).datetimepicker(options);

            //when a user changes the date, update the view model
            ko.utils.registerEventHandler(element, "dp.change", function (event) {
                var value = valueAccessor();
                if (ko.isObservable(value)) {
                    value(event.date);
                }
            });
        },
        update: function (element, valueAccessor) {
            var widget = $(element).data("DateTimePicker");
            //when the view model is updated, update the widget
            if (widget) {
                var date = ko.utils.unwrapObservable(valueAccessor());
                widget.date(moment(date));
            }
        }
    };
});