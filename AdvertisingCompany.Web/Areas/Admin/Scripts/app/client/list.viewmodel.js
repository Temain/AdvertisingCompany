function ClientsListViewModel(app, dataModel) {
    var self = this;

    self.clients = ko.observableArray([]);
    self.page = ko.observable(1);
    self.pagesCount = ko.observable(1);
    self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
    self.pageSize = ko.observable(10);
    self.searchQuery = ko.observable('');

    self.loadClients = function() {
        $.ajax({
            method: 'get',
            url: '/admin/api/clients',
            data: { query: self.searchQuery() || '', page: self.page(), pageSize: self.pageSize() },
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function (response) { },
            success: function (response) {
                ko.mapping.fromJS(response.clients, {}, self.clients);
                self.page(response.page);
                self.pagesCount(response.pagesCount);              
            }
        });
    };

    self.pageChanged = function (page) {
        self.page(page);
        self.loadClients();

        window.scrollTo(0, 0);
    };

    self.pageSizeChanged = function () {
        self.page(1);
        self.loadClients();

        window.scrollTo(0, 0);
    };

    self.search = _.debounce(function () {
        self.page(1);
        self.loadClients();
    }, 300);

    Sammy(function () {
        this.get('#clients', function () {
            self.loadClients();
            app.view(self);
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

