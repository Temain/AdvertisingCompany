function CampaignsListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);

    self.campaigns = ko.observableArray([]);
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
                //ko.mapping.fromJS(
                //    response.campaigns,
                //    {
                //        key: function (data) {
                //            return ko.utils.unwrapObservable(data.campaignId);
                //        },
                //        create: function (options) {
                //            var campaignViewModel = new CampaignViewModel(options.data);
                //            // ko.serverSideValidator.updateKoModel(clientViewModel);
                //            return campaignViewModel;
                //        }
                //    },
                //    self.campaigns
                //);               

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

function CampaignViewModel(dataModel) {
    var self = this;
}

app.addViewModel({
    name: "CampaignsList",
    bindingMemberName: "campaignsList",
    factory: CampaignsListViewModel
});

