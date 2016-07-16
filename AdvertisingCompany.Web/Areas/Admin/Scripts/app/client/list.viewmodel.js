function ClientsListViewModel(app, dataModel) {
    var self = this;

    self.clients = ko.observableArray([]);

    Sammy(function () {
        this.get('#clients', function () {
            $.ajax({
                method: 'get',
                url: '/admin/api/clients',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) { },
                success: function (response) {
                    ko.mapping.fromJS(response, {}, self.clients);
                    app.view(self);
                }
            });
        });
    });

    return self;
}

function ClientViewModel(app, dataModel) {
    var self = this;

    self.clientId = ko.observable(dataModel.clientId || '');
    self.companyName = ko.observable(dataModel.companyName || '');
    self.activityTypeId = ko.observable(dataModel.activityTypeId || '');
    self.activityTypeName = ko.observable(dataModel.activityTypeName || '');
    self.responsiblePersonId = ko.observable(dataModel.responsiblePersonId || '');
    self.responsiblePersonShortName = ko.observable(dataModel.responsiblePersonShortName || '');
    self.phoneNumber = ko.observable(dataModel.phoneNumber || '');
    self.additionalPhoneNumber = ko.observable(dataModel.additionalPhoneNumber || '');
    self.email = ko.observable(dataModel.email || '');
    self.userNames = ko.observableArray(dataModel.userNames || []);
    self.clientStatusId = ko.observable(dataModel.clientStatusId || '');
    self.clientStatusName = ko.observable(dataModel.clientStatusName || '');
    self.createdAt = ko.observable(dataModel.createdAt || '');
}

app.addViewModel({
    name: "ClientsList",
    bindingMemberName: "clientsList",
    factory: ClientsListViewModel
});

