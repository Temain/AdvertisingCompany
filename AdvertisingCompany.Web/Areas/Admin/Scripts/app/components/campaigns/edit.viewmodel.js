define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy',
    'knockout.bindings.selectpicker', 'text!/areas/admin/static/campaigns/edit.html'
], function($, ko, koMapping, koValidation, sammy, bss, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var EditCampaignViewModel = function(params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.campaignId = ko.observable(params.campaignId || '').extend({
            required: { params: true }
        });
        self.clientId = ko.observable(params.clientId || '').extend({
            required: { params: true }
        });
        self.responsiblePersonId = ko.observable(params.responsiblePersonId || '').extend({
            required: { params: true }
        });
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
        self.placementMonthId = ko.observable(params.placementMonthId || '').extend({
            required: {
                params: true,
                message: "Выберите месяц размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.placementMonthInitialId = ko.observable();
        self.placementMonthInitialized = ko.observable(false);
        self.placementMonths = ko.observableArray(params.placementMonths || []);

        self.placementFormatId = ko.observable(params.placementFormatId || '').extend({
            required: {
                params: true,
                message: "Выберите формат размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.placementFormatInitialId = ko.observable();
        self.placementFormatInitialized = ko.observable(false);
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
        self.paymentOrderInitialId = ko.observable();
        self.paymentOrderInitialized = ko.observable(false);
        self.paymentOrders = ko.observableArray(params.paymentOrders || []);

        self.paymentStatusId = ko.observable(params.paymentStatusId || '').extend({
            required: {
                params: true,
                message: "Укажите статус оплаты размещения рекламы.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        self.paymentStatusInitialId = ko.observable();
        self.paymentStatusInitialized = ko.observable(false);
        self.paymentStatuses = ko.observableArray(params.paymentStatuses || []);

        self.comment = ko.observable(params.comment || '');

        self.init = function() {
            var clientId = app.routes.currentParams.clientId;
            var campaignId = app.routes.currentParams.campaignId;

            $.ajax({
                method: 'get',
                url: '/admin/api/clients/' + clientId + '/campaigns/' + campaignId,
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
                        },
                        'placementFormats': {
                            create: function (options) {
                                return options.data;
                            }
                        },
                        'paymentOrders': {
                            create: function (options) {
                                return options.data;
                            }
                        },
                        'paymentStatuses': {
                            create: function (options) {
                                return options.data;
                            }
                        },
                    };

                    ko.mapping.fromJS(response, mappings, self);
                    // $('.selectpicker').selectpicker('refresh');
                    self.clientId(clientId);
                    app.applyComponent(self);

                    // TODO: Найти способ задать значение во время маппинга
                    self.placementMonthInitialId(response.placementMonthId);
                    self.placementMonthId(response.placementMonthId);
                    self.placementFormatInitialId(response.placementFormatId);
                    self.placementFormatId(response.placementFormatId);
                    self.paymentOrderInitialId(response.paymentOrderId);
                    self.paymentOrderId(response.paymentOrderId);
                    self.paymentStatusInitialId(response.paymentStatusId);
                    self.paymentStatusId(response.paymentStatusId);
                }
            });
        };

        self.submit = function() {
            self.isValidationEnabled(true);
            var postData = ko.toJSON(self);

            $.ajax({
                method: 'put',
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
                        message: "Рекламная кампания успешно изменена."
                    }, {
                        type: 'success'
                    });
                }
            });
        }

        self.setMicrodistrictsContent = function(option, item) {
            if (!item) return;

            $(option).text(item.microdistrictShortName());
            $(option).attr('data-subtext', "<br/><span class='description'>" + item.microdistrictName() + "</span>");

            ko.applyBindingsToNode(option, {}, item);
        };
    }

    EditCampaignViewModel.prototype.toJSON = function() {
        var copy = ko.toJS(this);
        delete copy.microdistricts;
        delete copy.placementFormats;
        delete copy.placementMonths;
        delete copy.paymentOrders;
        delete copy.paymentStatuses;
        return copy;
    }

    var editCampaignViewModel = new EditCampaignViewModel();

    app.addViewModel({
        name: "editCampaign",
        bindingMemberName: "editCampaign",
        viewItem: editCampaignViewModel
    });

    editCampaignViewModel.init();

    return { viewModel: { instance: editCampaignViewModel }, template: template };
});