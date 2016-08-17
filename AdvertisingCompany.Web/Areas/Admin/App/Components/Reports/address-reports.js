define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.tooltip', 'shuffle', 'magnific-popup', 'file-size',
    'text!/areas/admin/app/components/reports/address-reports.html'
], function($, ko, koMapping, bst, Shuffle, magnific, filesize, template) {

    ko.mapping = koMapping;
    window.filesize = filesize;

    function AddressReportsListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedReport = ko.observable();
        self.addressId = ko.observable('');

        self.addressName = ko.observable('');
        self.addressReports = ko.observableArray([]);

        self.loadAddressReports = function() {
            self.isInitialized(false);

            $.ajax({
                method: 'get',
                url: '/api/admin/addresses/' + self.addressId() + '/reports',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function(response) {},
                success: function(response) {
                    ko.mapping.fromJS(response.addressReports, {}, self.addressReports);
                    self.addressName(response.addressName);
                    self.isInitialized(true);  

                    // Инициализация ShuffleJS и magnific-popup
                    var element = document.getElementById('grid');
                    window.myShuffle = new Shuffle(element, {
                        itemSelector: '.js-item',
                        sizer: document.getElementById('.sizer-element')
                    });

                    $('#grid').magnificPopup({
                        delegate: '.js-item-preview a',
                        type: 'image',
                        gallery: {
                            enabled: true
                        }
                    });
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
                    'Authorization': 'Bearer ' + app.getAccessToken()
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
                    self.selectedReport(null);

                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Файл успешно удалён."
                    }, {
                        type: 'success'
                    });
                }
            });
        };

        self.init = function() {
            var addressId = app.routes.currentParams.addressId;
            self.addressId(addressId);

            self.addressReports([]);
            self.loadAddressReports();
        };

        return self;
    }

    var addressReportsList = new AddressReportsListViewModel();

    app.addViewModel({
        name: "address-reports",
        bindingMemberName: "addressReportsList",
        instance: addressReportsList
    });

    addressReportsList.init();

    return { viewModel: { instance: addressReportsList }, template: template };
});