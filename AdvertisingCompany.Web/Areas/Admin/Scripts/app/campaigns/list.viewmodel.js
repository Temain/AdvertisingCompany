function CampaignsListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);

    self.campaigns = ko.observableArray([]);
    self.paymentStatuses = ko.observableArray([]);
    self.page = ko.observable(1);
    self.pagesCount = ko.observable(1);
    self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
    self.pageSize = ko.observable(10);
    self.searchQuery = ko.observable('');

    self.loadCampaigns = function () {
        self.isInitialized(false);
        progress.show();

        $.ajax({
            method: 'get',
            url: '/admin/api/campaigns',
            data: { query: self.searchQuery() || '', page: self.page(), pageSize: self.pageSize() },
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function(response) {
                progress.hide();
            },
            success: function (response) {
                ko.mapping.fromJS(
                    response.campaigns,
                    {
                        key: function (data) {
                            return ko.utils.unwrapObservable(data.campaignId);
                        },
                        create: function (options) {
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

    self.pageChanged = function (page) {
        self.page(page);
        self.loadCampaigns();

        window.scrollTo(0, 0);
    };

    self.pageSizeChanged = function () {
        self.page(1);
        self.loadCampaigns();

        window.scrollTo(0, 0);
    };

    self.paymentStatusChanged = function (campaign, event) {
        if (self.isInitialized()) {
            $.ajax({
                method: 'put',
                url: '/admin/api/campaigns/' + campaign.campaignId() + '/paymentstatus/' + campaign.paymentStatusId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "Произошла ошибка при изменении статуса оплаты кампании. Статус оплаты не изменён."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    var newStatus = _.find(self.paymentStatuses(), function (status) { return status.paymentStatusId() == campaign.paymentStatusId() });
                    campaign.paymentStatusLabelClass(newStatus.paymentStatusLabelClass());

                    // Сброс стилей кнопки выпадающего списка
                    var statusSelect = $(event.target);
                    _.each(self.paymentStatuses(), function (status) {
                        statusSelect.selectpicker('setStyle', 'btn-' + status.paymentStatusLabelClass(), 'remove');
                    });

                    statusSelect.selectpicker('setStyle', 'btn-' + campaign.paymentStatusLabelClass());

                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "Статус оплаты кампании успешно изменён."
                    }, {
                        type: 'success'
                    });
                }
            });
        }
    };

    self.search = _.debounce(function () {
        self.page(1);
        self.loadCampaigns();
    }, 300);

    Sammy(function () {
        this.get('#campaigns', function () {
            app.view(self);
            self.loadCampaigns();
        });
    });

    return self;
}

function CampaignViewModel(dataModel) 
{
    var self = this;

    self.campaignId = ko.observable(dataModel.campaignId || '');
    self.clientId = ko.observable(dataModel.clientId || '');
    self.clientName = ko.observable(dataModel.clientName || '');
    self.activityTypeName = ko.observable(dataModel.activityTypeName || '');
    self.microdistrictNames = ko.observableArray(dataModel.microdistrictNames || []);
    self.placementFormatName = ko.observable(dataModel.placementFormatName || '');
    self.placementCost = ko.observable(dataModel.placementCost || '');
    self.paymentOrderName = ko.observable(dataModel.paymentOrderName || '');
    self.paymentStatusId = ko.observable(dataModel.paymentStatusId || '');
    self.paymentStatusInitialId = ko.observable(dataModel.paymentStatusId || '');
    self.paymentStatusInitialized = ko.observable(false);
    self.paymentStatusName = ko.observable(dataModel.paymentStatusName || '');
    self.paymentStatusLabelClass = ko.observable(dataModel.paymentStatusLabelClass || '');
    self.paymentStatuses = ko.observableArray(dataModel.paymentStatuses || []);
}

app.addViewModel({
    name: "CampaignsList",
    bindingMemberName: "campaignsList",
    factory: CampaignsListViewModel
});

