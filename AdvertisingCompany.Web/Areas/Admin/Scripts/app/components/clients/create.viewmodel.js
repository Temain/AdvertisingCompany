define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side',
    'knockout.bindings.selectpicker', 'text!areas/admin/static/clients/create.html'
], function($, ko, koMapping, koValidation, bss, template) {

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
        self.responsiblePersonLastName = ko.observable(params.responsiblePersonLastName || '').extend({
            required: {
                params: true,
                message: "Введите фамилию.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
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
        self.email = ko.observable(params.email || '');
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

        self.init = function() {
            $.ajax({
                method: 'get',
                url: '/admin/api/clients/0',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function(response) {},
                success: function(response) {
                    var mappings = {
                        'activityTypes': {
                            create: function(options) {
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
        };

        self.submit = function(toNextStage) {
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

        self.setActivityTypeOptionContent = function(option, item) {
            if (!item) return;

            $(option).text(item.activityTypeName);
            $(option).attr('data-subtext', "<br/><span class='description'>" + item.activityCategory + "</span>");
            //$(option).attr('title', item.Abbreviation());

            ko.applyBindingsToNode(option, {}, item);
        };
    }

    CreateClientViewModel.prototype.toJSON = function() {
        var copy = ko.toJS(this);
        delete copy.activityTypes;
        return copy;
    }

    var createClientViewModel = new CreateClientViewModel();

    app.addViewModel({
        name: "createClient",
        bindingMemberName: "createClient",
        viewItem: createClientViewModel
    });

    createClientViewModel.init();

    return { viewModel: { instance: createClientViewModel }, template: template };
});