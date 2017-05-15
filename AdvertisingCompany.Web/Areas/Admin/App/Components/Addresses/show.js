define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.tooltip', 'ymaps',
    'text!/areas/admin/app/components/addresses/show.html'
], function($, ko, koMapping, bst, ymaps, template) {

    ko.mapping = koMapping;

    function ShowAddressesViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(true);

        self.addresses = ko.observableArray([]);

        self.myMap;

        self.loadAddresses = function() {
            //self.isInitialized(false);

            $.ajax({
                method: 'get',
                url: '/api/admin/addresses',
                data: { all: true },
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function(response) { },
                success: function (response) {
                    ko.mapping.fromJS(
                        response.addresses,
                        {
                            key: function (data) {
                                return ko.utils.unwrapObservable(data.addressId);
                            },
                            create: function (options) {
                                return new AddressViewModel(options.data);
                            }
                        },
                        self.addresses
                    );

                    self.myMap.geoObjects.removeAll();

                    $.each(self.addresses(), function (index, obj) {
                        var coordinates = [obj.longitude(), obj.latitude()];
                        var placemark = new ymaps.Placemark(coordinates, {
                            balloonContent: "<strong>Адрес: " + obj.streetName() + ' ' + obj.buildingNumber() + '</strong>'
                                //+ "<br/>Микрорайон: " + obj.microdistrictShortName() +
                                + "<br/>Управляющая компания: " + obj.managementCompanyName()
                                + "<br/>Количество подъездов: " + obj.numberOfEntrances()
                                + "<br/>Количество этажей: " + obj.numberOfFloors()
                                + "<br/>Количество рекламных поверхностей: " + obj.numberOfSurfaces()
                        }, {
                            preset: 'islands#dotIcon',
                            iconColor: '#735184'
                        });

                        self.myMap.geoObjects.add(placemark);
                    });

                    //self.isInitialized(true);
                }
            });
        };
    
        self.init = function () {
            setTimeout(function () {
                ymaps.ready(function () {
                    self.myMap = new ymaps.Map("map", {
                        center: [45.03909376242208, 38.97636406359854], // Краснодар
                        zoom: 12,
                        controls: ['zoomControl', 'searchControl', 'typeSelector', 'fullscreenControl']
                    });

                    self.loadAddresses();
                });
            }, 1000);
        };

        return self;
    }

    function AddressViewModel(address) {
        var self = this;

        self.addressId = ko.observable(address.addressId || '');
        self.managementCompanyName = ko.observable(address.managementCompanyName || '');
        self.microdistrictShortName = ko.observable(address.microdistrictShortName || '');
        self.streetName = ko.observable(address.streetName || '');
        self.buildingNumber = ko.observable(address.buildingNumber || '');
        self.numberOfEntrances = ko.observable(address.numberOfEntrances || '');
        self.numberOfSurfaces = ko.observable(address.numberOfSurfaces || '');
        self.numberOfFloors = ko.observable(address.numberOfFloors || '');
        self.contractDate = ko.observable(address.contractDate || '');
        self.latitude = ko.observable(address.latitude || '');
        self.longitude = ko.observable(address.longitude || '');
    }

    var addressesShow = new ShowAddressesViewModel();

    app.addViewModel({
        name: "addresses-show",
        bindingMemberName: "addressesShow",
        instance: addressesShow
    });

    addressesShow.init();

    return { viewModel: { instance: addressesShow }, template: template };
});