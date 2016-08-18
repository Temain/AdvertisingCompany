define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.tooltip', 'shuffle', 'magnific-popup', 'file-size',
    'text!/areas/admin/app/components/reports/client-reports.html'
], function($, ko, koMapping, bst, Shuffle, magnific, filesize, template) {

    ko.mapping = koMapping;
    window.filesize = filesize;


    function ClientReportsListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedReport = ko.observable();
        self.campaignId = ko.observable('');

        self.clientName = ko.observable('');
        self.microdistrictsReports = ko.observableArray([]);

        self.loadReports = function() {
            self.isInitialized(false);

            $.ajax({
                method: 'get',
                url: '/api/admin/campaigns/' + self.campaignId() + '/reports',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function(response) {},
                success: function(response) {
                    ko.mapping.fromJS(response.microdistrictsReports, {}, self.microdistrictsReports);
                    self.clientName(response.clientName);

                    self.isInitialized(true);

                    // Инициализация ShuffleJS 
                    var imageGrids = $('.grid-with-images');
                    $.each(imageGrids, function (index, imageGrid) {
                        // var element = document.getElementById('grid');
                        var shuffle = new Shuffle(imageGrid, {
                            itemSelector: '.js-item',
                            sizer: document.getElementById('.sizer-element')
                        });

                        $('#nav-state-toggle').click(function () {
                            shuffle.update();
                        });
                    });                   

                    // Инициализация MagnificPopup
                    $('.grid-with-images').magnificPopup({
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
            var campaignId = app.routes.currentParams.campaignId;
            self.campaignId(campaignId);

            self.microdistrictsReports([]);
            self.loadReports();
        };

        return self;
    }

    //function AddressReportViewModel(addressReport) {
    //    var self = this;

    //    self.addressReportId = ko.observable(addressReport.addressReportId || '');
    //    self.reportDate = ko.observable(addressReport.reportDate || '');
    //    self.addressId = ko.observable(addressReport.addressId || '');
    //    self.comment = ko.observable(addressReport.comment || '');
    //    self.imageName = ko.observable(addressReport.imageName || '');
    //    self.imageLength = ko.observable(addressReport.imageLength || '');
    //    self.imageData = ko.observable(addressReport.imageData || '');
    //    self.imageThumbnail = ko.observable(addressReport.imageThumbnail || '');
    //    self.imageMimeType = ko.observable(addressReport.imageMimeType || '');
    //    self.createdAt = ko.observable(addressReport.createdAt || '');
    //}

    var clientReportsList = new ClientReportsListViewModel();

    app.addViewModel({
        name: "client-reports",
        bindingMemberName: "clientReportsList",
        instance: clientReportsList
    });

    clientReportsList.init();

    return { viewModel: { instance: clientReportsList }, template: template };
});