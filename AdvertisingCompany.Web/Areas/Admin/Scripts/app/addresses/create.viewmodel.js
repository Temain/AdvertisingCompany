var CreateAddressViewModel = function (app, dataModel) {
    var self = this;   

    self.managementCompanyName = ko.observable(dataModel.managementCompanyName || '');
    self.microdistrictId = ko.observable(dataModel.microdistrictId || '');
    self.microdistricts = ko.observableArray(dataModel.microdistricts || []);
    self.street = ko.observable(dataModel.street || '');
    self.houseNumber = ko.observable(dataModel.houseNumber || '');
    self.buildingNumber = ko.observable(dataModel.buildingNumber || '');
    self.numberOfEntrances = ko.observable(dataModel.numberOfEntrances || '');
    self.numberOfSurfaces = ko.observable(dataModel.numberOfSurfaces || '');
    self.numberOfFloors = ko.observable(dataModel.numberOfFloors || '');
    self.code = ko.observable(dataModel.code || '');
    self.zip = ko.observable(dataModel.zip || '');
    self.okato = ko.observable(dataModel.okato || '');
    self.latitude = ko.observable(dataModel.latitude || '');
    self.longitude = ko.observable(dataModel.longitude || '');
    self.contractDate = ko.observableArray(dataModel.contractDate || '');

    Sammy(function () {
        this.get('#addresses/create', function () {
            //$.ajax({
            //    method: 'get',
            //    url: '/admin/api/addresses/0',
            //    contentType: "application/json; charset=utf-8",
            //    headers: {
            //        'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            //    },
            //    error: function (response) {},
            //    success: function (response) {
            //        app.view(self);
            //    }
            //});

            app.view(self);

            kladrWithMap.init();
        });
    });

    self.submit = function () {
        self.isValidationEnabled(true);
        var postData = ko.toJSON(self);

        $.ajax({
            method: 'post',
            url: '/admin/api/clients/',
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
                Sammy().setLocation('#clients');
                $.notify({
                    icon: 'glyphicon glyphicon-ok',
                    message: "Клиент успешно сохранён."
                }, {
                    type: 'success'
                });
            }
        });
    }
}

app.addViewModel({
    name: "CreateAddress",
    bindingMemberName: "createAddress",
    factory: CreateAddressViewModel
});

