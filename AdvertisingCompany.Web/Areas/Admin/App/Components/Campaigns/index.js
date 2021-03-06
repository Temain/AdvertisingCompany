﻿define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.selectpicker',
    'knockout.bindings.tooltip', 'sammy', 'underscore', 'moment', 'progress',
    'text!/areas/admin/app/components/campaigns/index.html'
], function ($, ko, koMapping, bss, bst, sammy, _, moment, progress, template) {

    ko.mapping = koMapping;
    window.moment = moment;

    function CampaignsListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedCampaign = ko.observable();
        self.campaigns = ko.observableArray([]);
        self.paymentStatuses = ko.observableArray([]);
        self.page = ko.observable(1);
        self.pagesCount = ko.observable(1);
        self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
        self.pageSize = ko.observable(10);
        self.searchQuery = ko.observable('');

        self.loadCampaigns = function() {
            self.isInitialized(false);
            progress.show();

            $.ajax({
                method: 'get',
                url: '/api/admin/campaigns',
                data: { query: self.searchQuery() || '', page: self.page(), pageSize: self.pageSize() },
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function(response) {
                    progress.hide();
                },
                success: function(response) {
                    ko.mapping.fromJS(
                        response.campaigns,
                        {
                            key: function(data) {
                                return ko.utils.unwrapObservable(data.campaignId);
                            },
                            create: function(options) {
                                var campaignViewModel = new CampaignViewModel(options.data);
                                // ko.serverSideValidator.updateKoModel(clientViewModel);
                                return campaignViewModel;
                            }
                        },
                        self.campaigns
                    );
                    ko.mapping.fromJS(response.paymentStatuses, {}, self.paymentStatuses);

                    self.page(response.page);
                    self.pagesCount(response.pagesCount);
                    self.isInitialized(true);
                    progress.hide();
                }
            });
        };

        self.pageChanged = function(page) {
            self.page(page);
            self.loadCampaigns();

            window.scrollTo(0, 0);
        };

        self.pageSizeChanged = function() {
            self.page(1);
            self.loadCampaigns();

            window.scrollTo(0, 0);
        };

        self.paymentStatusChanged = function(campaign, event) {
            if (self.isInitialized()) {
                $.ajax({
                    method: 'put',
                    url: '/api/admin/campaigns/' + campaign.campaignId() + '/paymentstatus/' + campaign.paymentStatusId(),
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + app.getAccessToken()
                    },
                    error: function(response) {
                        $.notify({
                            icon: 'fa fa-exclamation-triangle',
                            message: "&nbsp;Произошла ошибка при изменении статуса оплаты кампании. Статус оплаты не изменён."
                        }, {
                            type: 'danger'
                        });
                    },
                    success: function(response) {
                        var newStatus = _.find(self.paymentStatuses(), function(status) { return status.paymentStatusId() == campaign.paymentStatusId() });
                        campaign.paymentStatusLabelClass(newStatus.paymentStatusLabelClass());

                        // Сброс стилей кнопки выпадающего списка
                        var statusSelect = $(event.target);
                        _.each(self.paymentStatuses(), function(status) {
                            statusSelect.selectpicker('setStyle', 'btn-' + status.paymentStatusLabelClass(), 'remove');
                        });

                        statusSelect.selectpicker('setStyle', 'btn-' + campaign.paymentStatusLabelClass());

                        $.notify({
                            icon: 'glyphicon glyphicon-ok',
                            message: "&nbsp;Статус оплаты кампании успешно изменён."
                        }, {
                            type: 'success'
                        });
                    }
                });
            }
        };

        self.search = _.debounce(function() {
            self.page(1);
            self.loadCampaigns();
        }, 300);

        self.selectCampaign = function (data) {
            if (self.selectedCampaign() != null && self.selectedCampaign().campaignId() == data.campaignId()) {
                self.selectedCampaign(null);
            } else {
                self.selectedCampaign(data);
            }

            return true;
        };

        self.isSelected = function (data) {
            return self.selectedCampaign() != null && self.selectedCampaign() == data;
        };

        self.isMonthChanged = function (index, data) {
            if (index) {
                var prevRecordMonth = moment(self.campaigns()[index - 1].createdAt()).month();
                var currentRecordMonth = moment(data.createdAt()).month();

                return prevRecordMonth != currentRecordMonth;
            }

            return false;
        };

        self.monthName = function (monthNumber) {
            var fakeDate = new Date(2016, monthNumber, 1);
            var result = moment(fakeDate).locale('ru').format('MMMM');
            return result.charAt(0).toUpperCase() + result.slice(1);
        };

        self.monthNameAndYear = function (date) {
            var result = moment(date).locale('ru').format('MMMM YYYY');
            return result.charAt(0).toUpperCase() + result.slice(1);
        };

        self.init = function () {
            self.loadCampaigns();
        };

        self.showDeleteModal = function (data, event) {
            $("#delete-popup").modal();
        };

        self.deleteCampaign = function () {
            $.ajax({
                method: 'delete',
                url: '/api/admin/campaigns/' + self.selectedCampaign().campaignId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function (response) {
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Произошла ошибка при удалении рекламной кампании."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    self.init();

                    $("#delete-popup").modal("hide");
                    self.selectedCampaign(null);

                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Рекламная кампания успешно удалена."
                    }, {
                        type: 'success'
                    });
                }
            });
        };

        return self;
    }

    function CampaignViewModel(campaign) {
        var self = this;

        self.campaignId = ko.observable(campaign.campaignId || '');
        self.clientId = ko.observable(campaign.clientId || '');
        self.clientName = ko.observable(campaign.clientName || '');
        self.activityTypeName = ko.observable(campaign.activityTypeName || '');
        self.activityCategoryName = ko.observable(campaign.activityCategoryName || '');
        self.microdistrictNames = ko.observableArray(campaign.microdistrictNames || []);
        self.placementFormatName = ko.observable(campaign.placementFormatName || '');
        self.placementCost = ko.observable(campaign.placementCost || '');
        self.placementMonthId = ko.observable(campaign.placementMonthId || '');
        self.paymentOrderName = ko.observable(campaign.paymentOrderName || '');
        self.paymentStatusId = ko.observable(campaign.paymentStatusId || '');
        self.paymentStatusInitialId = ko.observable(campaign.paymentStatusId || '');
        self.paymentStatusInitialized = ko.observable(false);
        self.paymentStatusName = ko.observable(campaign.paymentStatusName || '');
        self.paymentStatusLabelClass = ko.observable(campaign.paymentStatusLabelClass || '');
        self.paymentStatuses = ko.observableArray(campaign.paymentStatuses || []);
        self.comment = ko.observable(campaign.comment || '');
        self.createdAt = ko.observable(campaign.createdAt || '');
    }

    var campaignsList = new CampaignsListViewModel();

    app.addViewModel({
        name: "campaigns",
        bindingMemberName: "campaignsList",
        instance: campaignsList
    });

    campaignsList.init();

    return { viewModel: { instance: campaignsList }, template: template };
});