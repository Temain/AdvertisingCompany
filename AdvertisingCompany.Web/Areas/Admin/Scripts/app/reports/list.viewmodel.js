function ReportsListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);

    self.addressId = ko.observable('');
    self.campaignId = ko.observable('');

    self.addressName = ko.observable('');
    self.clientName = ko.observable('');
    self.addressReports = ko.observableArray([]);

    self.loadAddressReports = function () {
        self.isInitialized(false);

        $.ajax({
            method: 'get',
            url: '/admin/api/reports',
            data: { addressId: self.addressId(), campaignId: self.campaignId() },
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

                if (response.addressName) {
                    self.addressName(response.addressName);
                }

                if (response.clientName) {
                    self.clientName(response.clientName);
                }
              
                self.isInitialized(true);
                app.view(self);
                initGallery();
            }
        });
    };

    Sammy(function () {
        this.get('#addresses/:id/reports', function () {
            var addressId = this.params['id'];
            self.addressId(addressId);
            self.campaignId(null);
            self.addressReports([]);

            self.loadAddressReports();
        });
    });

    Sammy(function () {
        this.get('#clients/:clientId/campaigns/:campaignId/reports', function () {
            var campaignId = this.params['campaignId'];
            self.campaignId(campaignId);
            self.addressId(null);
            self.addressReports([]);

            self.loadAddressReports();
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

