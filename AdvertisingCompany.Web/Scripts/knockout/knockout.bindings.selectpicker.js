define(['knockout', 'bootstrap-select'], function (ko, bss) {
    ko.bindingHandlers.selectPicker = {
        // after: ['options'],
        init: function (element, valueAccessor, allBindingsAccessor) {
            var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
            if ($(element).is('select')) {
                if (ko.isObservable(valueAccessor())) {
                    if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                        // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                        ko.bindingHandlers.selectedOptions.init(element, valueAccessor, allBindingsAccessor);
                    } else {
                        // regular select and observable so call the default value binding
                        ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor);
                    }
                }

                $(element).addClass('selectpicker').selectpicker(selectPickerOptions);
            }
        },
        update: function (element, valueAccessor, allBindingsAccessor) {
            if ($(element).is('select')) {
                var selectPickerOptions = allBindingsAccessor().selectPickerOptions;
                if (typeof selectPickerOptions !== 'undefined' && selectPickerOptions !== null) {
                    var options = selectPickerOptions.optionsArray,
                        initValue = selectPickerOptions.initValue,
                        initialized = selectPickerOptions.initialized,
                        optionsText = selectPickerOptions.optionsText,
                        optionsValue = selectPickerOptions.optionsValue,
                        optionsCaption = selectPickerOptions.optionsCaption,
                        isDisabled = selectPickerOptions.disabledCondition || false,
                        resetOnDisabled = selectPickerOptions.resetOnDisabled || false;
                    if (ko.utils.unwrapObservable(options).length > 0) {
                        // call the default Knockout options binding
                        ko.bindingHandlers.options.update(element, options, allBindingsAccessor);
                    }
                    if (isDisabled && resetOnDisabled) {
                        // the dropdown is disabled and we need to reset it to its first option
                        $(element).selectpicker('val', $(element).children('option:first').val());
                    }

                    var value = valueAccessor()();
                    if (initValue !== undefined && initValue !== null && value) {
                        var iValue = initValue();
                        if (initialized !== undefined && initialized !== null) {
                            if (!initialized()) {
                                valueAccessor()(initValue());
                                initialized(true);
                            }
                        } else {
                            console.log('Set initialize property in selectPickerOptions.');
                        }
                    }

                    $(element).prop('disabled', isDisabled);
                }
                if (ko.isObservable(valueAccessor())) {
                    var value = valueAccessor()();
                    if (value) {
                        $(element).closest('.bootstrap-select').removeClass('ko-field-validation-error');
                    }

                    if ($(element).prop('multiple') && $.isArray(ko.utils.unwrapObservable(valueAccessor()))) {
                        // in the case of a multiple select where the valueAccessor() is an observableArray, call the default Knockout selectedOptions binding
                        ko.bindingHandlers.selectedOptions.update(element, valueAccessor);
                    } else {
                        // call the default Knockout value binding
                        ko.bindingHandlers.value.update(element, valueAccessor);
                    }
                }

                // valueAccessor()(2);

                $(element).selectpicker('refresh');
            }
        }
    };
});