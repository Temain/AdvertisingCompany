﻿define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy',
    'knockout.bindings.selectpicker', 'text!/areas/admin/app/components/clients/create.html'
], function ($, ko, koMapping, koValidation, sammy, bss, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var CreateClientViewModel = function(params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.companyName = ko.observable(params.companyName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование компании.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.activityTypeId = ko.observable(params.activityTypeId || '').extend({
            required: {
                params: true,
                message: "Необходимо указать вид деятельности клиента.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.activityTypes = ko.observableArray(params.activityTypes || []);

        self.responsiblePersonId = ko.observable(params.responsiblePersonId || '');
        self.responsiblePersonLastName = ko.observable(params.responsiblePersonLastName || '');
        self.responsiblePersonFirstName = ko.observable(params.responsiblePersonFirstName || '').extend({
            required: {
                params: true,
                message: "Введите имя.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.responsiblePersonMiddleName = ko.observable(params.responsiblePersonMiddleName || '');
        self.phoneNumber = ko.observable(params.phoneNumber || '').extend({
            required: {
                params: true,
                message: "Введите номер телефона.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.additionalPhoneNumber = ko.observable(params.additionalPhoneNumber || '');
        self.email = ko.observable(params.email || '').extend({
            required: {
                params: true,
                message: "Введите адрес электронной почты.",
                onlyIf: function () { return self.isValidationEnabled(); }
            }
        });
        self.userName = ko.observable(params.userName || '').extend({
            required: {
                params: true,
                message: "Введите имя пользователя.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.password = ko.observable(params.password || '').extend({
            required: {
                params: true,
                message: "Введите пароль.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.confirmPassword = ko.observable(params.confirmPassword || '').extend({
            required: {
                params: true,
                message: "Введите подтверждение пароля.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.comment = ko.observable(params.comment || '');
        self.sendMail = ko.observable(false);

        self.init = function() {
            $.ajax({
                method: 'get',
                url: '/api/admin/clients/0',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function(response) {},
                success: function (response) {
                    self.isValidationEnabled(false);
                    var mappings = {
                        'activityTypes': {
                            create: function(options) {
                                return options.data;
                            }
                        }
                    };
                    ko.mapping.fromJS(response, mappings, self);
                    app.applyComponent(self);
                }
            });
        };

        self.submit = function (toNextStage) {
            self.disableOrEnableButtons(false, toNextStage);
            self.isValidationEnabled(true);

            var postData = ko.toJSON(self);

            $.ajax({
                method: 'post',
                url: '/api/admin/clients/',
                data: postData,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                complete: function () {
                    self.disableOrEnableButtons(true, toNextStage);
                },
                error: function(response) {
                    var responseText = response.responseText;
                    if (responseText) {
                        responseText = JSON.parse(responseText);
                        var modelState = responseText.modelState;
                        if (modelState && modelState.shared) {
                            var message = '<strong>&nbsp;Клиент не сохранён. Список ошибок:</strong><ul>';
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
                    if (toNextStage) {
                        sammy().setLocation('#clients/' + response.clientId + '/campaigns/create');
                    } else {
                        sammy().setLocation('#clients');
                    }

                    self.isValidationEnabled(false);

                    var message = "&nbsp;Клиент успешно сохранён.";
                    if (self.sendMail()) {
                        message += "<br/>На email клиента отправлено письмо с учётными данными.";
                    }

                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: message
                    }, {
                        type: 'success'
                    });
                }
            });
        }

        self.disableOrEnableButtons = function (isDisabled, hasNextStage) {
            var action = isDisabled ? 'reset' : 'loading';

            if (hasNextStage) {
                $("#createClient").prop("disabled", !isDisabled);
                $("#createCampaign").button(action);
            } else {
                $("#createClient").button(action);
                $("#createCampaign").prop("disabled", !isDisabled);
            }
        };

        self.setActivityTypeOptionContent = function(option, item) {
            if (!item) return;

            $(option).text(item.activityTypeName);
            // $(option).attr('data-subtext', "<br/><span class='description'>" + item.activityCategoryName + "</span>");
            // $(option).attr('title', item.Abbreviation());

            ko.applyBindingsToNode(option, {}, item);
        };
    }

    CreateClientViewModel.prototype.toJSON = function() {
        var copy = ko.toJS(this);
        delete copy.activityTypes;
        return copy;
    }

    var createClient = new CreateClientViewModel();

    app.addViewModel({
        name: "client-create",
        bindingMemberName: "createClient",
        instance: createClient
    });

    createClient.init();

    return { viewModel: { instance: createClient }, template: template };
});