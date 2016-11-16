define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy',
    'knockout.bindings.selectpicker', 'text!/areas/admin/app/components/clients/edit.html'
], function($, ko, koMapping, koValidation, sammy, bss, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var EditClientViewModel = function (params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.clientId = ko.observable(params.activityTypeId || '').extend({
            required: { params: true }
        });
        self.companyName = ko.observable(params.companyName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование компании."
            }
        });
        self.activityTypeId = ko.observable(params.activityTypeId || '').extend({
            required: {
                params: true,
                message: "Необходимо указать вид деятельности клиента.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.activityTypeInitialId = ko.observable();
        self.activityTypeInitialized = ko.observable(false);
        self.activityTypes = ko.observableArray(params.activityTypes || []);

        self.responsiblePersonId = ko.observable(params.responsiblePersonId || '');
        self.responsiblePersonLastName = ko.observable(params.responsiblePersonLastName || '');
        self.responsiblePersonFirstName = ko.observable(params.responsiblePersonFirstName || '').extend({
            required: {
                params: true,
                message: "Введите имя."
            }
        });
        self.responsiblePersonMiddleName = ko.observable(params.responsiblePersonMiddleName || '');
        self.phoneNumber = ko.observable(params.phoneNumber || '').extend({
            required: {
                params: true,
                message: "Введите номер телефона."
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
                message: "Введите имя пользователя."
            }
        });
        self.password = ko.observable(params.password || '').extend({
            required: {
                params: true,
                message: "Введите пароль."
            }
        });
        self.confirmPassword = ko.observable(params.confirmPassword || '').extend({
            required: {
                params: true,
                message: "Введите подтверждение пароля."
            }
        });
        self.comment = ko.observable(params.comment || '');

        self.init = function () {
            var clientId = app.routes.currentParams.clientId;
            $.ajax({
                method: 'get',
                url: '/api/admin/clients/' + clientId,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function (response) { },
                success: function (response) {
                    var mappings = {
                        'activityTypes': {
                            create: function (options) {
                                return options.data;
                            }
                        }
                    };

                    ko.mapping.fromJS(response, mappings, self);
                    app.applyComponent(self);

                    // TODO: Найти способ задать значение во время маппинга
                    self.activityTypeInitialId(response.activityTypeId);
                    self.activityTypeId(response.activityTypeId);
                }
            });
        };

        self.submit = function () {
            $("#editClient").button("loading");

            self.isValidationEnabled(true);

            var postData = ko.toJSON(self);

            $.ajax({
                method: 'put',
                url: '/api/admin/clients/',
                data: postData,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                complete: function() {
                    $("#editClient").button("reset");
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
                    self.isValidationEnabled(false);
                    sammy().setLocation('#clients');
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Клиент успешно изменён."
                    }, {
                        type: 'success'
                    });
                }
            });
        }

        self.setActivityTypeOptionContent = function(option, item) {
            if (!item) return;

            $(option).text(item.activityTypeName);
            // $(option).attr('data-subtext', "<br/><span class='description'>" + item.activityCategoryName + "</span>");
            // $(option).attr('title', item.Abbreviation());

            ko.applyBindingsToNode(option, {}, item);
        };
    }

    EditClientViewModel.prototype.toJSON = function() {
        var copy = ko.toJS(this);
        delete copy.activityTypes;
        return copy;
    }

    var editClient = new EditClientViewModel();

    app.addViewModel({
        name: "client-edit",
        bindingMemberName: "editClient",
        instance: editClient
    });

    editClient.init();

    return { viewModel: { instance: editClient }, template: template };
});