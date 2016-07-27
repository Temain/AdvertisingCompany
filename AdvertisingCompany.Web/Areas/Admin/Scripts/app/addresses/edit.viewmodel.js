var EditAddressViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.managementCompanyName = ko.observable(dataModel.managementCompanyName || '').extend({
        required: {
            params: true,
            message: "Необходимо указать наименование управляющей компании или ТСЖ.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.region = ko.observable(dataModel.region || '');
    self.district = ko.observable(dataModel.district || '');
    self.city = ko.observable(dataModel.city || '');
    self.microdistrictId = ko.observable(dataModel.microdistrictId || '').extend({
        required: {
            params: true,
            message: "Необходимо выбрать микрорайон.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.microdistrictInitialId = ko.observable();
    self.microdistrictInitialized = ko.observable(false);
    self.microdistricts = ko.observableArray(dataModel.microdistricts || []);

    self.streetName = ko.observable(dataModel.streetName || '').extend({
        required: {
            params: true,
            message: "Необходимо указать наименование улицы.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.street = ko.observable(dataModel.street || '');

    self.building = ko.observable(dataModel.building || '');
    self.buildingName = ko.observable(dataModel.buildingName || '').extend({
        required: {
            params: true,
            message: "Необходимо указать номер дома.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });

    self.numberOfEntrances = ko.observable(dataModel.numberOfEntrances || '').extend({
        required: {
            params: true,
            message: "Необходимо указать количество подъездов.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.numberOfSurfaces = ko.observable(dataModel.numberOfSurfaces || '').extend({
        required: {
            params: true,
            message: "Необходимо указать количество поверхностей.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.numberOfFloors = ko.observable(dataModel.numberOfFloors || '').extend({
        required: {
            params: true,
            message: "Необходимо указать количество этажей.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.latitude = ko.observable(dataModel.latitude || '');
    self.longitude = ko.observable(dataModel.longitude || '');
    self.contractDate = ko.observable(dataModel.contractDate || '');

    Sammy(function () {
        this.get('#addresses/:id/edit', function () {
            var id = this.params['id'];
            $.ajax({
                method: 'get',
                url: '/admin/api/addresses/' + id,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {},
                success: function (response) {
                    var mappings = {
                        'microdistricts': {
                            create: function (options) {
                                return options.data;
                            }
                        }
                    };

                    ko.mapping.fromJS(response, mappings, self);
                    app.view(self);

                    kladrWithMap.init({
                        defaultValues: {
                            regionId: response.region.id,
                            regionName : response.region.name,
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
        });
    });

    self.submit = function () {
        self.isValidationEnabled(true);
        var postData = ko.toJSON(self);

        $.ajax({
            method: 'put',
            url: '/admin/api/addresses/',
            data: postData,
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function (response) {
                var modelState = response.responseText;
                if (modelState) {
                    modelState = JSON.parse(modelState);

                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "Пожалуйста, исправьте ошибки."
                    }, {
                        type: 'danger'
                    });

                    $('.selectpicker').selectpicker('refresh');
                    ko.serverSideValidator.validateModel(self, modelState);
                }
            },
            success: function (response) {
                Sammy().setLocation('#clients');
                $.notify({
                    icon: 'glyphicon glyphicon-ok',
                    message: "Адрес успешно изменён."
                }, {
                    type: 'success'
                });
            }
        });
    }
}

EditAddressViewModel.prototype.toJSON = function () {
    var copy = ko.toJS(this);
    delete copy.microdistricts;
    return copy;
}

app.addViewModel({
    name: "EditAddress",
    bindingMemberName: "editAddress",
    factory: EditAddressViewModel
});