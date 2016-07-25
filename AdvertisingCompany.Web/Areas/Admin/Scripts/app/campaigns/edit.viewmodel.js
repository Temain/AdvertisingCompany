var EditCampaignViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.campaignId = ko.observable(dataModel.campaignId || '').extend({
        required: { params: true }
    });
    self.clientId = ko.observable(dataModel.clientId || '').extend({
        required: { params: true }
    });
    self.responsiblePersonId = ko.observable(dataModel.responsiblePersonId || '').extend({
        required: { params: true }
    });
    self.responsiblePersonName = ko.observable(dataModel.responsiblePersonName || '');
    self.companyName = ko.observable(dataModel.companyName || '');
    self.activityTypeName = ko.observable(dataModel.activityTypeName || '');
    self.microdistrictIds = ko.observableArray(dataModel.microdistrictIds || []).extend({
        required: {
            params: true,
            message: "Необходимо указать микрорайон(ы) размещения рекламы.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.microdistricts = ko.observableArray(dataModel.microdistricts || []);
    self.placementMonthId = ko.observable(dataModel.placementMonthId || '').extend({
        required: {
            params: true,
            message: "Выберите месяц размещения рекламы.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.placementMonthInitialId = ko.observable();
    self.placementMonthInitialized = ko.observable(false);
    self.placementMonths = ko.observableArray(dataModel.placementMonths || []);

    self.placementFormatId = ko.observable(dataModel.placementFormatId || '').extend({
        required: {
            params: true,
            message: "Выберите формат размещения рекламы.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.placementFormatInitialId = ko.observable();
    self.placementFormatInitialized = ko.observable(false);
    self.placementFormats = ko.observableArray(dataModel.placementFormats || []);

    self.placementCost = ko.observable(dataModel.placementCost || '').extend({
        required: {
            params: true,
            message: "Введите стоимость размещения рекламы.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });

    self.paymentOrderId = ko.observable(dataModel.paymentOrderId || '').extend({
        required: {
            params: true,
            message: "Выберите порядок оплаты размещения рекламы.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.paymentOrderInitialId = ko.observable();
    self.paymentOrderInitialized = ko.observable(false);
    self.paymentOrders = ko.observableArray(dataModel.paymentOrders || []);

    self.paymentStatusId = ko.observable(dataModel.paymentStatusId || '').extend({
        required: {
            params: true,
            message: "Укажите статус оплаты размещения рекламы.",
            onlyIf: function () { return self.isValidationEnabled(); }
        }
    });
    self.paymentStatusInitialId = ko.observable();
    self.paymentStatusInitialized = ko.observable(false);
    self.paymentStatuses = ko.observableArray(dataModel.paymentStatuses || []);

    self.comment = ko.observable(dataModel.comment || '');

    Sammy(function () {
        this.get('#clients/:clientId/campaigns/:campaignId/edit', function () {
            var clientId = this.params['clientId'];
            var campaignId = this.params['campaignId'];

            $.ajax({
                method: 'get',
                url: '/admin/api/clients/' + clientId + '/campaigns/' + campaignId,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {},
                success: function (response) {
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

                    self.clientId(clientId);
                    self.isValidationEnabled(false);

                    app.view(self);

                    // TODO: Найти способ задать значение во время маппинга
                    self.placementMonthId(response.placementMonthId);
                    self.placementMonthInitialId(response.placementMonthId);
                    self.placementFormatId(response.placementFormatId);
                    self.placementFormatInitialId(response.placementFormatId);
                    self.paymentOrderId(response.paymentOrderId);
                    self.paymentOrderInitialId(response.paymentOrderId);
                    self.paymentStatusId(response.paymentStatusId);
                    self.paymentStatusInitialId(response.paymentStatusId);
                }
            });
        });
    });

    self.submit = function () {
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
            error: function (response) {
                var responseText = response.responseText;
                if (responseText) {
                    responseText = JSON.parse(responseText);
                    var modelState = responseText.modelState;
                    if (modelState.shared) {
                        var message = '<strong>&nbsp;Рекламная кампания не сохранена.</strong><ul>';
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
                self.isValidationEnabled(false);
                Sammy().setLocation('#campaigns');
                $.notify({
                    icon: 'glyphicon glyphicon-ok',
                    message: "Рекламная кампания успешно изменена."
                }, {
                    type: 'success'
                });
            }
        });
    }

    self.setMicrodistrictsContent = function (option, item) {
        if (!item) return;

        $(option).attr('title', item.microdistrictShortName());

        ko.applyBindingsToNode(option, {}, item);
    };
}

EditCampaignViewModel.prototype.toJSON = function () {
    var copy = ko.toJS(this);
    delete copy.microdistricts;
    delete copy.placementFormats;
    delete copy.placementMonths;
    delete copy.paymentOrders;
    delete copy.paymentStatuses;
    return copy;
}

app.addViewModel({
    name: "EditCampaign",
    bindingMemberName: "editCampaign",
    factory: EditCampaignViewModel
});