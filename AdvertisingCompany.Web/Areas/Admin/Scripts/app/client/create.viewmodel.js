var CreateClientViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.comment = ko.observable();
    self.createdAt = ko.observable(moment());

    self.save = function () {
        self.isValidationEnabled(true);
        var result = ko.validation.group(self, { deep: true });
        if (!self.isValid()) {
            result.showAllMessages(true);
            return false;
        }

        var postData = {            
        };

        $.ajax({
            method: 'post',
            url: '/api/Task/',
            data: JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function(response) {},
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