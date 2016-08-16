define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.tooltip', 'gins-gallery', 'file-size',
    'text!/areas/admin/app/components/reports/index.html'
], function($, ko, koMapping, bst, initGallery, filesize, template) {

    ko.mapping = koMapping;
    window.filesize = filesize;

    function ReportsListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedReport = ko.observable();
        self.addressId = ko.observable('');
        self.campaignId = ko.observable('');

        self.addressName = ko.observable('');
        self.clientName = ko.observable('');
        self.addressReports = ko.observableArray([]);

        self.loadAddressReports = function() {
            self.isInitialized(false);

            $.ajax({
                method: 'get',
                url: '/api/admin/reports',
                data: { addressId: self.addressId(), campaignId: self.campaignId() },
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function(response) {},
                success: function(response) {
                    ko.mapping.fromJS(
                        response.addressReports,
                        {
                            key: function(data) {
                                return ko.utils.unwrapObservable(data.addressReportId);
                            },
                            create: function(options) {
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
                    initGallery();                   
                }
            });
        };

        self.showDeleteModal = function (data, event) {
            self.selectedReport(data);
            $("#delete-popup").modal();
        };

        self.deleteReport = function () {
            $.ajax({
                method: 'delete',
                url: '/api/admin/reports/' + self.selectedReport().addressReportId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Произошла ошибка при удалении файла."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {                 
                    self.init();
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Файл успешно удалён."
                    }, {
                        type: 'success'
                    });
                }
            });

            self.selectedReport(null);
        };

        self.init = function() {
            var addressId = app.routes.currentParams.addressId;
            var campaignId = app.routes.currentParams.campaignId;

            if (addressId) {
                self.addressId(addressId);
                self.campaignId(null);
            } else {
                self.campaignId(campaignId);
                self.addressId(null);
            }

            self.addressReports([]);
            self.loadAddressReports();
        };

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
        self.imageThumbnail = ko.observable(dataModel.imageThumbnail || '');
        self.imageMimeType = ko.observable(dataModel.imageMimeType || '');
        self.createdAt = ko.observable(dataModel.createdAt || '');
    }

    var reportsListViewModel = new ReportsListViewModel();

    app.addViewModel({
        name: "reports",
        bindingMemberName: "reportsList",
        viewItem: reportsListViewModel
    });

    reportsListViewModel.init();

    return { viewModel: { instance: reportsListViewModel }, template: template };
});