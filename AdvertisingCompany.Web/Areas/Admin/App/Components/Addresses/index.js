define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.selectpicker',
    'knockout.bindings.tooltip', 'holder', 'dropzone', 'progress',
    'text!/areas/admin/app/components/addresses/index.html'
], function($, ko, koMapping, bss, bst, holder, Dropzone, progress, template) {

    ko.mapping = koMapping;

    function AddressesListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedAddress = ko.observable();
        self.addresses = ko.observableArray([]);
        self.page = ko.observable(1);
        self.pagesCount = ko.observable(1);
        self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
        self.pageSize = ko.observable(10);
        self.searchQuery = ko.observable('');
        self.loadingFiles = ko.observable(false);

        // Для загрузки отчётов
        self.imageDropzone;
        self.comment = ko.observable('');

        self.loadAddresses = function() {
            self.isInitialized(false);
            progress.show();

            $.ajax({
                method: 'get',
                url: '/api/admin/addresses',
                data: { query: self.searchQuery() || '', page: self.page(), pageSize: self.pageSize() },
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function(response) {
                    progress.hide();
                },
                success: function(response) {
                    ko.mapping.fromJS(
                        response.addresses,
                        {
                            key: function(data) {
                                return ko.utils.unwrapObservable(data.addressId);
                            },
                            create: function(options) {
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

        self.pageChanged = function(page) {
            self.page(page);
            self.loadAddresses();

            window.scrollTo(0, 0);
        };

        self.pageSizeChanged = function() {
            self.page(1);
            self.loadAddresses();

            window.scrollTo(0, 0);
        };

        self.search = _.debounce(function() {
            self.page(1);
            self.loadAddresses();
        }, 300);

        self.selectAddress = function (data) {
            if (self.selectedAddress() != null && self.selectedAddress().addressId() == data.addressId()) {
                self.selectedAddress(null);
            } else {
                self.selectedAddress(data);
            }

            return true;
        };

        self.isSelected = function (data) {
            return self.selectedAddress() != null && self.selectedAddress() == data;
        };

        self.showUploadModal = function (data, event) {
            if (self.imageDropzone != null) {
                self.imageDropzone.destroy();
            }

            self.imageDropzone = new Dropzone("div#imageDropzone", { url: "/api/admin/reports/" });
            self.comment('');
            $("#upload-popup").modal();
        };

        self.uploadFiles = function (data, event) {

            self.imageDropzone.on('sending', function (file, xhr, formData) {
                formData.append("addressId", data.selectedAddress().addressId());
                formData.append("comment", data.comment());
            });

            self.imageDropzone.on("success", function (file, response) {
                self.imageDropzone.options.autoProcessQueue = true;
            });

            self.imageDropzone.on("error", function (file, response) {
                self.loadingFiles(false);
                $.notify({
                    icon: 'fa fa-exclamation-triangle',
                    message: "&nbsp;Произошла ошибка при загрузке файла."
                }, {
                    type: 'danger',
                    z_index: 99999
                });
            });

            self.imageDropzone.on("complete", function (file) {
                if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                    self.imageDropzone.destroy();
                    self.loadingFiles(false);
                    $("#upload-popup").modal("hide");

                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Файлы успешно загружены."
                    }, {
                        type: 'success'
                    });
                }
            });

            if (self.imageDropzone.getQueuedFiles().length > 0) {
                self.loadingFiles(true);
                self.imageDropzone.processQueue();
            } else {
                self.imageDropzone.uploadFiles([]);
            }
        };

        self.init = function () {
            self.loadAddresses();
        };

        self.showDeleteModal = function (data, event) {
            $("#delete-popup").modal();
        };

        self.deleteAddress = function () {
            $.ajax({
                method: 'delete',
                url: '/api/admin/addresses/' + self.selectedAddress().addressId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Произошла ошибка при удалении адреса."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    self.selectedAddress(null);
                    self.init();
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Адрес успешно удалён."
                    }, {
                        type: 'success'
                    });
                }
            });
        };

        return self;
    }

    Dropzone.options.imageDropzone = {
        url: '/api/admin/reports/',
        autoProcessQueue: false,
        paramName: "file", 
        acceptedFiles: ".jpg, .png, .jpeg",
        headers: {
            'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
        },
        addRemoveLinks: true,
        dictRemoveFile: 'Удалить',
        dictCancelUpload: 'Отмена',
        dictCancelUploadConfirmation: 'Вы действительно хотите отмениь загрузку файлов?'
    };

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

    var addressesListViewModel = new AddressesListViewModel();

    app.addViewModel({
        name: "addresses",
        bindingMemberName: "addressesList",
        viewItem: addressesListViewModel
    });

    addressesListViewModel.init();

    return { viewModel: { instance: addressesListViewModel }, template: template };
});