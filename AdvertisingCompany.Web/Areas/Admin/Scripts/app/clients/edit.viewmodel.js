﻿var EditClientViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.clientId = ko.observable(dataModel.activityTypeId || '').extend({
        required: { params: true }
    });
    self.companyName = ko.observable(dataModel.companyName || '').extend({
        required: {
            params: true,
            message: "Необходимо указать наименование компании."
        }
    });
    self.activityTypeId = ko.observable(dataModel.activityTypeId || '').extend({
        required: {
            params: true,
            message: "Необходимо указать вид деятельности клиента.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.activityTypeInitialId = ko.observable();
    self.activityTypeInitialized = ko.observable(false);
    self.activityTypes = ko.observableArray(dataModel.activityTypes || []);

    self.responsiblePersonId = ko.observable(dataModel.responsiblePersonId || '');
    self.responsiblePersonLastName = ko.observable(dataModel.responsiblePersonLastName || '').extend({
        required: {
            params: true,
            message: "Введите фамилию."
        }
    });
    self.responsiblePersonFirstName = ko.observable(dataModel.responsiblePersonFirstName || '').extend({
        required: {
            params: true,
            message: "Введите имя."
        }
    });
    self.responsiblePersonMiddleName = ko.observable(dataModel.responsiblePersonMiddleName || '');
    self.phoneNumber = ko.observable(dataModel.phoneNumber || '').extend({
        required: {
            params: true,
            message: "Введите номер телефона."
        }
    });
    self.additionalPhoneNumber = ko.observable(dataModel.additionalPhoneNumber || '');
    self.email = ko.observable(dataModel.email || '');
    self.userName = ko.observable(dataModel.userName || '').extend({
        required: {
            params: true,
            message: "Введите имя пользователя."
        }
    });
    self.password = ko.observable(dataModel.password || '').extend({
        required: {
            params: true,
            message: "Введите пароль."
        }
    });
    self.confirmPassword = ko.observable(dataModel.confirmPassword || '').extend({
        required: {
            params: true,
            message: "Введите подтверждение пароля."
        }
    });

    Sammy(function () {
        this.get('#clients/:id/edit', function () {
            var id = this.params['id'];
            $.ajax({
                method: 'get',
                url: '/admin/api/clients/' + id,
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

                    ko.mapping.fromJS(response, mappings, self);

                    app.view(self);

                    // TODO: Найти способ задать значение во время маппинга
                    self.activityTypeId(response.activityTypeId);
                    self.activityTypeInitialId(response.activityTypeId);
                }
            });
        });
    });

    self.submit = function () {
        self.isValidationEnabled(true);
        var postData = ko.toJSON(self);

        $.ajax({
            method: 'put',
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
                    if (modelState && modelState.shared) {
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
                    $('.selectpicker').selectpicker('refresh');

                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Пожалуйста, исправьте ошибки."
                    }, {
                        type: 'danger'
                    });
                }
            },
            success: function (response) {
                self.isValidationEnabled(false);
                Sammy().setLocation('#clients');
                $.notify({
                    icon: 'glyphicon glyphicon-ok',
                    message: "Клиент успешно изменён."
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

EditClientViewModel.prototype.toJSON = function () {
    var copy = ko.toJS(this);
    delete copy.activityTypes;
    return copy;
}


app.addViewModel({
    name: "EditClient",
    bindingMemberName: "editClient",
    factory: EditClientViewModel
});