$(function () {
    app.initialize();

    // Активировать Knockout
    ko.validation.init({
        decorateInputElement: true,
        errorClass: 'ko-field-validation-error',
        grouping: { observable: false }
    });
    ko.applyBindingsWithValidation(app);   
});
