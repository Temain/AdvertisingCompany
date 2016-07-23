function ReportsListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);
    self.addressName = ko.observable('');
    self.addressReports = ko.observableArray([]);

    self.loadAddressReports = function (addressId) {
        self.isInitialized(false);

        $.ajax({
            method: 'get',
            url: '/admin/api/reports',
            data: { addressId: addressId },
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function(response) { },
            success: function (response) {
                ko.mapping.fromJS(
                    response.addressReports,
                    {
                        key: function (data) {
                            return ko.utils.unwrapObservable(data.addressReportId);
                        },
                        create: function (options) {
                            var reportViewModel = new AddressReportViewModel(options.data);
                            // ko.serverSideValidator.updateKoModel(clientViewModel);
                            return reportViewModel;
                        }
                    },
                    self.addressReports
                );
                self.addressName(response.addressName);

                initGallery();
                self.isInitialized(true);
            }
        });
    };

    Sammy(function () {
        this.get('#addresses/:id/reports', function () {
            var addressId = this.params['id'];

            app.view(self);
            self.loadAddressReports(addressId);
        });
    });

    return self;
}

function AddressReportViewModel(dataModel) {
    var self = this;

    self.addressReportId = ko.observable(dataModel.addressReportId || '');
    self.reportDate = ko.observable(dataModel.reportDate || '');
    self.addressId = ko.observable(dataModel.addressId || '');
    self.comment = ko.observable(dataModel.comment || '');
    self.imageName = ko.observable(dataModel.imageName || '');
    self.imageLength = ko.observable(dataModel.imageLength || '');
    self.imageData = ko.observable(dataModel.imageData || '');
    self.imageMimeType = ko.observable(dataModel.imageMimeType || '');
    self.createdAt = ko.observable(dataModel.createdAt || '');
}

app.addViewModel({
    name: "ReportsList",
    bindingMemberName: "reportsList",
    factory: ReportsListViewModel
});

