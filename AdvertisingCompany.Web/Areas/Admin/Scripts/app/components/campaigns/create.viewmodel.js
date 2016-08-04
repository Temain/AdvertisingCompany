define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side',
    'knockout.bindings.selectpicker', 'sammy', 'underscore',
    'text!areas/admin/static/campaigns/create.html'
], function($, ko, koMapping, koValidation, bss, sammy, _, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var CreateCampaignViewModel = function(params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.clientId = ko.observable();
        self.responsiblePersonId = ko.observable(params.responsiblePersonId || '');
        self.responsiblePersonName = ko.observable(params.responsiblePersonName || '');
        self.companyName = ko.observable(params.companyName || '');
        self.activityTypeName = ko.observable(params.activityTypeName || '');
        self.microdistrictIds = ko.observableArray(params.microdistrictIds || []).extend({
            required: {
                params: true,
                message: "Необходимо указать микрорайон(ы) размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.microdistricts = ko.observableArray(params.microdistricts || []);
        self.placementMonthId = ko.observable(params.placementMonthId || 0).extend({
            required: {
                params: true,
                message: "Выберите месяц размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        //self.placementMonthInitialId = ko.observable();
        //self.placementMonthInitialized = ko.observable(false);
        self.placementMonths = ko.observableArray(params.placementMonths || []);

        self.placementFormatId = ko.observable(params.placementFormatId || '').extend({
            required: {
                params: true,
                message: "Выберите формат размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.placementFormats = ko.observableArray(params.placementFormats || []);
        self.placementCost = ko.observable(params.placementCost || '').extend({
            required: {
                params: true,
                message: "Введите стоимость размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.paymentOrderId = ko.observable(params.paymentOrderId || '').extend({
            required: {
                params: true,
                message: "Выберите порядок оплаты размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.paymentOrders = ko.observableArray(params.paymentOrders || []);
        self.paymentStatusId = ko.observable(params.paymentStatusId || '').extend({
            required: {
                params: true,
                message: "Укажите статус оплаты размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.paymentStatuses = ko.observableArray(params.paymentStatuses || []);
        self.comment = ko.observable(params.comment || '');

        self.init = function() {
            var clientId = app.routes.currentParams.clientId;
            $.ajax({
                method: 'get',
                url: '/admin/api/clients/' + clientId + '/campaigns/0',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) { },
                success: function (response) {
                    self.isValidationEnabled(false);
                    var mappings = {
                        'placementMonths': {
                            create: function (options) {
                                return options.data;
                            }
                        }
                    };

                    ko.mapping.fromJS(response, mappings, self);
                    self.clientId(clientId);

                    app.applyComponent(self);
                    app.view(self);
                }
            });
        };

        self.submit = function() {
            self.isValidationEnabled(true);
            var postData = ko.toJSON(self);

            $.ajax({
                method: 'post',
                url: '/admin/api/clients/' + self.clientId() + '/campaigns',
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
                        if (modelState.shared) {
                            var message = '<strong>&nbsp;Рекламная кампания не сохранена.</strong><ul>';
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
                    sammy().setLocation('#campaigns');
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "Рекламная кампания успешно сохранена."
                    }, {
                        type: 'success'
                    });
                }
            });
        }

        self.setMicrodistrictsContent = function(option, item) {
            if (!item) return;

            $(option).attr('title', item.microdistrictShortName());

            ko.applyBindingsToNode(option, {}, item);
        };
    }

    CreateCampaignViewModel.prototype.toJSON = function() {
        var copy = ko.toJS(this);
        delete copy.microdistricts;
        delete copy.placementFormats;
        delete copy.placementMonths;
        delete copy.paymentOrders;
        delete copy.paymentStatuses;
        return copy;
    }

    var createCampaignViewModel = new CreateCampaignViewModel();

    app.addViewModel({
        name: "createCampaign",
        bindingMemberName: "createCampaign",
        viewItem: createCampaignViewModel
    });

    createCampaignViewModel.init();

    return { viewModel: { instance: createCampaignViewModel }, template: template };
});