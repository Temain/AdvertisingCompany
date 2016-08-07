define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.selectpicker', 'knockout.bindings.tooltip', 'holder', 'file-input', 'progress',
    'text!home/html/?path=~/areas/admin/views/addresses/index.cshtml'
], function($, ko, koMapping, bss, bst, holder, fileInput, progress, template) {

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
        self.loadingFile = ko.observable(false);

        // Для загрузки отчётов
        self.currentAddressName = ko.observable('');
        self.currentAddressId = ko.observable('');
        self.reportDate = ko.observable('');
        self.comment = ko.observable('');

        self.loadAddresses = function() {
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

        self.showUploadModal = function(data, event) {
            Holder.run();
            $(".fileinput").fileinput('clear');

            self.currentAddressId(data.addressId());
            self.currentAddressName(data.streetName() + ' ' + data.buildingNumber());
            self.comment('');
            self.reportDate('');

            $("#upload-popup").modal();
        };

        self.uploadFile = function(data, event) {
            var element = $("#upload-popup");
            var fileUpload = element.find('.file-upload');
            var fileInput = $(fileUpload).find('.fileinput-hidden');
            var file = fileInput[0].files[0];
            if (file) {
                var formData = new FormData();
                formData.append("file", file);
                formData.append("addressId", data.currentAddressId());
                formData.append("comment", data.comment());

                var reportDateStr = (new Date(data.reportDate())).toUTCString();
                formData.append("reportDate", reportDateStr);

                self.loadingFile(true);

                $.ajax({
                    url: "/admin/api/reports/",
                    type: "POST",
                    data: formData,
                    contentType: false,
                    headers: {
                        'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                    },
                    processData: false,
                    error: function(response) {
                        self.loadingFile(false);
                        $("#upload-popup").modal("hide");
                        $.notify({
                            icon: 'fa fa-exclamation-triangle',
                            message: "Произошла ошибка при загрузке отчёта."
                        }, {
                            type: 'danger'
                        });
                    },
                    success: function(response) {
                        self.loadingFile(false);
                        $("#upload-popup").modal("hide");
                        $.notify({
                            icon: 'glyphicon glyphicon-ok',
                            message: "Отчёт успешно загружен."
                        }, {
                            type: 'success'
                        });
                    }
                });
            }
        };

        self.init = function () {
            // Заглушка ошибки при скрытых элементах для holder.js
            Holder.invisible_error_fn = function (fn) {
                return function (el) {
                    setTimeout(function () {
                        fn.call(this, el);
                    }, 10);
                }
            }

            self.loadAddresses();
            app.view(self);
        };

        self.showDeleteModal = function (data, event) {
            self.selectedAddress(data);
            $("#delete-popup").modal();
        };

        self.deleteAddress = function () {
            $.ajax({
                method: 'delete',
                url: '/admin/api/addresses/' + self.selectedAddress().addressId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "Произошла ошибка при удалении адреса."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    self.init();
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Адрес успешно удалён."
                    }, {
                        type: 'success'
                    });
                }
            });
        };

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

    var addressesListViewModel = new AddressesListViewModel();

    app.addViewModel({
        name: "addressesList",
        bindingMemberName: "addressesList",
        viewItem: addressesListViewModel
    });

    addressesListViewModel.init();

    return { viewModel: { instance: addressesListViewModel }, template: template };
});