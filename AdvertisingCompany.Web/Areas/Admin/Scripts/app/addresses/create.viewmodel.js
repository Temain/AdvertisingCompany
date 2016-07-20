var CreateAddressViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.managementCompanyName = ko.observable(dataModel.managementCompanyName || '').extend({
        required: {
            params: true,
            message: "Необходимо указать наименование управляющей компании.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.region = ko.observable(dataModel.region || '');
    self.district = ko.observable(dataModel.district || '');
    self.city = ko.observable(dataModel.city || '');
    self.microdistrictId = ko.observable(dataModel.microdistrictId || '').extend({
        required: {
            params: true,
            message: "Выберите микрорайон.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });;
    self.microdistricts = ko.observableArray(dataModel.microdistricts || []);
    self.street = ko.observable(dataModel.street || '');
    self.building = ko.observable(dataModel.building || '');
    self.numberOfEntrances = ko.observable(dataModel.numberOfEntrances || '').extend({
        required: {
            params: true,
            message: "Необходимо указать количество подъездов.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });;
    self.numberOfSurfaces = ko.observable(dataModel.numberOfSurfaces || '').extend({
        required: {
            params: true,
            message: "Необходимо указать количество поверхностей.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });;
    self.numberOfFloors = ko.observable(dataModel.numberOfFloors || '').extend({
        required: {
            params: true,
            message: "Необходимо указать количество этажей.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });;
    self.latitude = ko.observable(dataModel.latitude || '');
    self.longitude = ko.observable(dataModel.longitude || '');
    self.contractDate = ko.observable(dataModel.contractDate || '');

    Sammy(function () {
        this.get('#addresses/create', function () {
            $.ajax({
                method: 'get',
                url: '/admin/api/addresses/0',
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
                    $('#microdistrictId').selectpicker('refresh');

                    app.view(self);
                    kladrWithMap.init();
                }
            });
        });
    });

    self.submit = function () {
        self.isValidationEnabled(true);

        var addressObjs = $.kladr.getAddress('.js-form-address', function (objs) {
            $.each(objs, function (i, obj) {
                var location = new LocationViewModel(obj);

                if ($.type(obj) === 'object') {
                    switch (obj.contentType) {
                        case $.kladr.type.region:
                            self.region = location;
                            break;

                        case $.kladr.type.district:
                            self.district = location;
                            break;

                        case $.kladr.type.city:
                            self.city = location;
                            break;

                        case $.kladr.type.street:
                            self.street = location;
                            break;

                        case $.kladr.type.building:
                            self.building = location;
                            break;
                    }
                }
            });
        });

        var postData = ko.toJSON(self);

        $.ajax({
            method: 'post',
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
                    ko.serverSideValidator.validateModel(self, modelState);
                    
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "Пожалуйста, исправьте ошибки."
                    }, {
                        type: 'danger'
                    });
                }
            },
            success: function (response) {
                self.isValidationEnabled(false);
                Sammy().setLocation('#addresses');
                $.notify({
                    icon: 'glyphicon glyphicon-ok',
                    message: "Адрес успешно сохранён."
                }, {
                    type: 'success'
                });
            }
        });
    }
}

CreateAddressViewModel.prototype.toJSON = function () {
    var copy = ko.toJS(this); 
    delete copy.microdistricts;
    return copy;
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

app.addViewModel({
    name: "CreateAddress",
    bindingMemberName: "createAddress",
    factory: CreateAddressViewModel
});

