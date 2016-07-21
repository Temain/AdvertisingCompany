function AddressesListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);

    self.addresses = ko.observableArray([]);
    self.page = ko.observable(1);
    self.pagesCount = ko.observable(1);
    self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
    self.pageSize = ko.observable(10);
    self.searchQuery = ko.observable('');

    self.loadAddresses = function () {
        self.isInitialized(false);
        progress.show();

        $.ajax({
            method: 'get',
            url: '/admin/api/addresses',
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
                    response.addresses,
                    {
                        key: function (data) {
                            return ko.utils.unwrapObservable(data.addressId);
                        },
                        create: function (options) {
                            var addressViewModel = new AddressViewModel(options.data);
                            // ko.serverSideValidator.updateKoModel(clientViewModel);
                            return addressViewModel;
                        }
                    },
                    self.addresses
                );               

                self.page(response.page);
                self.pagesCount(response.pagesCount);
                self.isInitialized(true);
                progress.hide();
            }
        });
    };

    self.pageChanged = function (page) {
        self.page(page);
        self.loadAddresses();

        window.scrollTo(0, 0);
    };

    self.pageSizeChanged = function () {
        self.page(1);
        self.loadAddresses();

        window.scrollTo(0, 0);
    };

    self.search = _.debounce(function () {
        self.page(1);
        self.loadAddresses();
    }, 300);

    Sammy(function () {
        this.get('#addresses', function () {
            app.view(self);
            self.loadAddresses();
        });
    });

    return self;
}

function AddressViewModel(dataModel) {
    var self = this;

    self.addressId = ko.observable(dataModel.addressId || '');
    self.managementCompanyName = ko.observable(dataModel.managementCompanyName || '');
    self.microdistrictShortName = ko.observable(dataModel.microdistrictShortName || '');
    self.streetName = ko.observable(dataModel.streetName || '');
    self.buildingNumber = ko.observable(dataModel.buildingNumber || '');
    self.numberOfEntrances = ko.observable(dataModel.numberOfEntrances || '');
    self.numberOfSurfaces = ko.observable(dataModel.numberOfSurfaces || '');
    self.numberOfFloors = ko.observable(dataModel.numberOfFloors || '');
    self.contractDate = ko.observable(dataModel.contractDate || '');
}



app.addViewModel({
    name: "AddressesList",
    bindingMemberName: "addressesList",
    factory: AddressesListViewModel
});

