var CreateClientViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.companyName = ko.observable(dataModel.companyName || '').extend({
        required: {
            params: true,
            message: "Необходимо указать наименование компании.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.activityTypeId = ko.observable(dataModel.activityTypeId || '').extend({
        required: {
            params: true,
            message: "Необходимо указать вид деятельности клиента.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.activityTypes = ko.observableArray(dataModel.activityTypes || []);

    self.responsiblePersonId = ko.observable(dataModel.responsiblePersonId || '');
    self.responsiblePersonLastName = ko.observable(dataModel.responsiblePersonLastName || '').extend({
        required: {
            params: true,
            message: "Введите фамилию.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.responsiblePersonFirstName = ko.observable(dataModel.responsiblePersonFirstName || '').extend({
        required: {
            params: true,
            message: "Введите имя.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.responsiblePersonMiddleName = ko.observable(dataModel.responsiblePersonMiddleName || '');
    self.phoneNumber = ko.observable(dataModel.phoneNumber || '').extend({
        required: {
            params: true,
            message: "Введите номер телефона.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.additionalPhoneNumber = ko.observable(dataModel.additionalPhoneNumber || '');
    self.email = ko.observable(dataModel.email || '');
    self.userName = ko.observable(dataModel.userName || '').extend({
        required: {
            params: true,
            message: "Введите имя пользователя.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.password = ko.observable(dataModel.password || '').extend({
        required: {
            params: true,
            message: "Введите пароль.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.confirmPassword = ko.observable(dataModel.confirmPassword || '').extend({
        required: {
            params: true,
            message: "Введите подтверждение пароля.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });

    Sammy(function () {
        this.get('#clients/create', function () {
            $.ajax({
                method: 'get',
                url: '/admin/api/clients/0',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {},
                success: function (response) {
                    var mappings = {
                        'activityTypes': {
                            create: function (options) {
                                return options.data;
                            }
                        }
                    };

                    self.isValidationEnabled(false);
                    ko.mapping.fromJS(response, mappings, self);
                    $('#activityTypeId').selectpicker('refresh');

                    app.view(self);
                }
            });
        });
    });

    self.submit = function (toNextStage) {
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
                var responseText = response.responseText;
                if (responseText) {
                    responseText = JSON.parse(responseText);
                    var modelState = responseText.modelState;
                    if (modelState.shared) {
                        var message = '<strong>&nbsp;Клиент не сохранён. Список ошибок:</strong><ul>';
                        $.each(modelState.shared, function (index, error) {
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

                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Пожалуйста, исправьте ошибки."
                    }, {
                        type: 'danger'
                    });
                }
            },
            success: function (response) {
                if (toNextStage) {
                    Sammy().setLocation('##clients/' + response.clientId + '/campaigns/create');
                } else {
                    Sammy().setLocation('#clients');
                }

                self.isValidationEnabled(false);
                $.notify({
                    icon: 'glyphicon glyphicon-ok',
                    message: "Клиент успешно сохранён."
                }, {
                    type: 'success'
                });
            }
        });
    }

    self.setActivityTypeOptionContent = function (option, item) {
        if (!item) return;

        $(option).text(item.activityTypeName);
        $(option).attr('data-subtext', "<br/><span class='description'>" + item.activityCategory + "</span>");
        //$(option).attr('title', item.Abbreviation());

        ko.applyBindingsToNode(option, {}, item);
    };
}

CreateClientViewModel.prototype.toJSON = function () {
    var copy = ko.toJS(this);
    delete copy.activityTypes;
    return copy;
}

app.addViewModel({
    name: "CreateClient",
    bindingMemberName: "createClient",
    factory: CreateClientViewModel
});