function ClientsListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);

    self.clients = ko.observableArray([]);
    self.clientStatuses = ko.observableArray([]);
    self.page = ko.observable(1);
    self.pagesCount = ko.observable(1);
    self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
    self.pageSize = ko.observable(10);
    self.searchQuery = ko.observable('');

    self.loadClients = function () {
        self.isInitialized(false);
        progress.show();

        $.ajax({
            method: 'get',
            url: '/admin/api/clients',
            data: { query: self.searchQuery() || '', page: self.page(), pageSize: self.pageSize() },
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function(response) {
                progress.hide();
            },
            success: function (response) {
                ko.mapping.fromJS(
                    response.clients,
                    {
                        key: function (data) {
                            return ko.utils.unwrapObservable(data.clientId);
                        },
                        create: function (options) {
                            var clientViewModel = new ClientViewModel(options.data);
                            // ko.serverSideValidator.updateKoModel(clientViewModel);
                            return clientViewModel;
                        }
                    },
                    self.clients
                );               

                ko.mapping.fromJS(response.clientStatuses, {}, self.clientStatuses);
                self.page(response.page);
                self.pagesCount(response.pagesCount);
                self.isInitialized(true);
                progress.hide();
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

    self.clientStatusChanged = function (client, event) {
        if (self.isInitialized()) {
            $.ajax({
                method: 'put',
                url: '/admin/api/clients/' + client.clientId() + '/status/' + client.clientStatusId(),
                // data: JSON.stringify({ clientId: client.clientId(), statusId: client.clientStatusId() }),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "Произошла ошибка при изменении статуса клиента. Статус клиента не изменён."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    var newStatus = _.find(self.clientStatuses(), function (status) { return status.clientStatusId() == client.clientStatusId() });
                    client.clientStatusLabelClass(newStatus.clientStatusLabelClass());

                    // Сброс стилей кнопки выпадающего списка
                    var statusSelect = $(event.target);
                    _.each(self.clientStatuses(), function (status) {
                        statusSelect.selectpicker('setStyle', 'btn-' + status.clientStatusLabelClass(), 'remove');
                    });

                    statusSelect.selectpicker('setStyle', 'btn-' + client.clientStatusLabelClass());

                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "Статус клиента успешно изменён."
                    }, {
                        type: 'success'
                    });
                }
            });
        }
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

function ClientViewModel(dataModel) {
    var self = this;

    self.clientId = ko.observable(dataModel.clientId || '');
    self.campaignId = ko.observable(dataModel.campaignId || '')
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
    self.clientStatusInitialId = ko.observable(dataModel.clientStatusId || '');
    self.clientStatusInitialized = ko.observable(false);
    self.clientStatusName = ko.observable(dataModel.clientStatusName || '');
    self.clientStatusLabelClass = ko.observable(dataModel.clientStatusLabelClass || '');
    self.createdAt = ko.observable(dataModel.createdAt || '');
}

function ClientStatusViewModel(dataModel) {
    var self = this;
    self.clientStatusId = ko.observable(dataModel.clientStatusId || '');
    self.clientStatusName = ko.observable(dataModel.clientStatusName || '');
    self.clientStatusLabelClass = ko.observable(dataModel.clientStatusLabelClass || '');
}

app.addViewModel({
    name: "ClientsList",
    bindingMemberName: "clientsList",
    factory: ClientsListViewModel
});

