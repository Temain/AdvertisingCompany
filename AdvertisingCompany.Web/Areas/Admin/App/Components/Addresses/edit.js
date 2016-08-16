define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy', 'knockout.bindings.datetimepicker',
    'knockout.bindings.selectpicker', 'kladr-with-map', 'text!/areas/admin/app/components/addresses/edit.html'
], function ($, ko, koMapping, koValidation, sammy, bdtp, bss, kladrWithMap, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var EditAddressViewModel = function(params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.managementCompanyName = ko.observable(params.managementCompanyName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование управляющей компании или ТСЖ.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.region = ko.observable(params.region || '');
        self.district = ko.observable(params.district || '');
        self.city = ko.observable(params.city || '');
        self.microdistrictId = ko.observable(params.microdistrictId || '').extend({
            required: {
                params: true,
                message: "Необходимо выбрать микрорайон.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.microdistrictInitialId = ko.observable();
        self.microdistrictInitialized = ko.observable(false);
        self.microdistricts = ko.observableArray(params.microdistricts || []);

        self.streetName = ko.observable(params.streetName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование улицы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            },
            validation: {
                validator: function(val) {
                    var hasError = $('[name="street"]').hasClass('kladr-error');
                    return !hasError;
                },
                message: "Выберите улицу из списка."
            }
        });
        self.street = ko.observable(params.street || '');

        self.building = ko.observable(params.building || '');
        self.buildingName = ko.observable(params.buildingName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать номер дома.",
                onlyIf: function() { return self.isValidationEnabled(); }
            },
            validation: {
                validator: function(val) {
                    var hasError = $('[name="building"]').hasClass('kladr-error');
                    return !hasError;
                },
                message: "Выберите номер дома из списка."
            }
        });

        self.numberOfEntrances = ko.observable(params.numberOfEntrances || '').extend({
            required: {
                params: true,
                message: "Необходимо указать количество подъездов.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.numberOfSurfaces = ko.observable(params.numberOfSurfaces || '').extend({
            required: {
                params: true,
                message: "Необходимо указать количество поверхностей.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.numberOfFloors = ko.observable(params.numberOfFloors || '').extend({
            required: {
                params: true,
                message: "Необходимо указать количество этажей.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.latitude = ko.observable(params.latitude || '');
        self.longitude = ko.observable(params.longitude || '');
        self.contractDate = ko.observable(params.contractDate || '');

        self.init = function() {
            var addressId = app.routes.currentParams.addressId;
            $.ajax({
                method: 'get',
                url: '/api/admin/addresses/' + addressId,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) { },
                success: function (response) {
                    var mappings = {
                        'microdistricts': {
                            create: function (options) {
                                return options.data;
                            }
                        }
                    };
                    ko.mapping.fromJS(response, mappings, self);
                    self.isValidationEnabled(false);

                    kladrWithMap.init({
                        defaultValues: {
                            regionId: response.region.id,
                            regionName: response.region.name,
                            // districtId: response.district.id,
                            // districtName: response.district.name,
                            cityId: response.city.id,
                            cityName: response.city.name,
                            streetId: response.street.id,
                            streetName: response.street.name,
                            streetParentId: response.street.parent.id,
                            streetParentType: response.street.parent.contentType,
                            buildingId: response.building.id,
                            buildingName: response.building.name,
                            buildingParentId: response.building.parent.id,
                            buildingParentType: response.building.parent.contentType
                        }
                    });

                    // TODO: Найти способ задать значение во время маппинга
                    self.microdistrictId(response.microdistrictId);
                    self.microdistrictInitialId(response.microdistrictId);
                }
            });
        };

        self.streetChanged = function() {
            self.buildingName('');
            self.street('');
            self.building('');
        };

        self.buildingChanged = function() {
            self.building('');
        };

        self.setMicrodistrictOptionContent = function(option, item) {
            if (!item) return;

            $(option).text(item.microdistrictName);
            $(option).attr('data-subtext', "<br/><span class='description'>" + item.microdistrictShortName + "</span>");

            ko.applyBindingsToNode(option, {}, item);
        };

        self.submit = function() {
            self.isValidationEnabled(true);

            var addressObjs = $.kladr.getAddress('.js-form-address', function(objs) {
                $.each(objs, function(i, obj) {
                    var location = new LocationViewModel(obj);

                    if ($.type(obj) === 'object') {
                        switch (obj.contentType) {
                        case $.kladr.type.region:
                            self.region(location);
                            break;

                        case $.kladr.type.district:
                            self.district(location);
                            break;

                        case $.kladr.type.city:
                            self.city(location);
                            break;

                        case $.kladr.type.street:
                            self.street(location);
                            break;

                        case $.kladr.type.building:
                            self.building(location);
                            break;
                        }
                    }
                });
            });

            if (geocoordinates != null && geocoordinates.length) {
                self.longitude(geocoordinates[0]);
                self.latitude(geocoordinates[1]);
            }

            var postData = ko.toJSON(self);

            $.ajax({
                method: 'put',
                url: '/api/admin/addresses/',
                data: postData,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function(response) {
                    var responseText = response.responseText;
                    if (responseText) {
                        responseText = JSON.parse(responseText);
                        var modelState = responseText.modelState;
                        if (modelState && modelState.shared) {
                            var message = '<strong>&nbsp;Адрес не сохранён. Список ошибок:</strong><ul>';
                            $.each(modelState.shared, function(index, error) {
                                message += '<li>' + error + '</li>';
                            });
                            message += '</ul>';

                            $.notify({
                                icon: 'fa fa-exclamation-triangle fa-2x',
                                message: message
                            }, {
                                type: 'danger'
                            });

                            return;
                        }

                        ko.serverSideValidator.validateModel(self, responseText);
                        $('.selectpicker').selectpicker('refresh');

                        $.notify({
                            icon: 'fa fa-exclamation-triangle',
                            message: "&nbsp;Пожалуйста, исправьте ошибки."
                        }, {
                            type: 'danger'
                        });
                    }
                },
                success: function(response) {
                    self.isValidationEnabled(false);
                    sammy().setLocation('#addresses');
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Адрес успешно изменён."
                    }, {
                        type: 'success'
                    });
                }
            });
        }
    }

    function LocationViewModel(dataModel) {
        var self = this;
        self.id = ko.observable(dataModel.id || '');
        self.contentType = ko.observable(dataModel.contentType || '');
        self.name = ko.observable(dataModel.name || '');
        self.type = ko.observable(dataModel.type || '');
        self.typeShort = ko.observable(dataModel.typeShort || '');
        self.zip = ko.observable(dataModel.zip || '');
        self.okato = ko.observable(dataModel.okato || '');
        self.parent = dataModel.parents != null && dataModel.parents.length ? $(dataModel.parents).last()[0] : '';
    }

    EditAddressViewModel.prototype.toJSON = function() {
        var copy = ko.toJS(this);
        delete copy.microdistricts;
        return copy;
    }

    var editAddressViewModel = new EditAddressViewModel();

    app.addViewModel({
        name: "address-edit",
        bindingMemberName: "editAddress",
        viewItem: editAddressViewModel
    });

    editAddressViewModel.init();

    return { viewModel: { instance: editAddressViewModel }, template: template };
});