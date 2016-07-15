var CreateClientViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.companyName = ko.observable(dataModel.companyName || '').extend({
        required: {
            params: true,
            message: "Необходимо указать наименование."
        }
    });
    self.activityTypeId = ko.observable(dataModel.activityTypeId || '');
    self.activityTypes = ko.observableArray(dataModel.activityTypes || []);
    self.responsiblePersonId = ko.observable(dataModel.responsiblePersonId || '');
    self.responsiblePersonLastName = ko.observable(dataModel.responsiblePersonLastName || '');
    self.responsiblePersonFirstName = ko.observable(dataModel.responsiblePersonFirstName || '');
    self.responsiblePersonMiddleName = ko.observable(dataModel.responsiblePersonMiddleName || '');
    self.phoneNumber = ko.observable(dataModel.phoneNumber || '');
    self.additionalPhoneNumber = ko.observable(dataModel.additionalPhoneNumber || '');
    self.email = ko.observable(dataModel.email || '');
    self.userName = ko.observable(dataModel.userName || '');
    self.password = ko.observable(dataModel.password || '');
    self.confirmPassword = ko.observable(dataModel.confirmPassword || '');

    Sammy(function () {
        this.get('#client/create', function () {
            app.view(self);
        });
    });

    self.submit = function () {
        //self.isValidationEnabled(true);
        //var result = ko.validation.group(self, { deep: true });
        //if (!self.isValid()) {
        //    result.showAllMessages(true);
        //    return false;
        //}

        var postData = ko.toJSON(self);

        $.ajax({
            method: 'post',
            url: '/admin/api/client/',
            data: postData,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function (response) {
                var modelState = response.responseText;
                if (modelState) {
                    modelState = JSON.parse(modelState);
                    console.log(modelState);
                }
            },
            success: function (response) {
                result.showAllMessages(false);
                app.navigateToClient();
            }
        });
    }
}

app.addViewModel({
    name: "CreateClient",
    bindingMemberName: "createClient",
    factory: CreateClientViewModel
});