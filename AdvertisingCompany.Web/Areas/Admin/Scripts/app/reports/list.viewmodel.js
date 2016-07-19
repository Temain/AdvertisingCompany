function ReportsListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);

    self.reports = ko.observableArray([]);
    self.page = ko.observable(1);
    self.pagesCount = ko.observable(1);
    self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
    self.pageSize = ko.observable(10);
    self.searchQuery = ko.observable('');

    self.loadReports = function () {
        self.isInitialized(false);
        progress.show();

        $.ajax({
            method: 'get',
            url: '/admin/api/reports',
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
                    response.reports,
                    {
                        key: function (data) {
                            return ko.utils.unwrapObservable(data.campaignId);
                        },
                        create: function (options) {
                            var reportViewModel = new ReportViewModel(options.data);
                            // ko.serverSideValidator.updateKoModel(clientViewModel);
                            return reportViewModel;
                        }
                    },
                    self.reports
                );               

                self.page(response.page);
                self.pagesCount(response.pagesCount);
                self.isInitialized(true);
                progress.hide();
            }
        });
    };

    self.pageChanged = function (page) {
        self.page(page);
        self.loadReports();

        window.scrollTo(0, 0);
    };

    self.pageSizeChanged = function () {
        self.page(1);
        self.loadReports();

        window.scrollTo(0, 0);
    };

    self.search = _.debounce(function () {
        self.page(1);
        self.loadReports();
    }, 300);

    Sammy(function () {
        this.get('#reports', function () {
            app.view(self);
            self.loadReports();
        });
    });

    return self;
}

function ReportViewModel(dataModel) {
    var self = this;
}

app.addViewModel({
    name: "ReportsList",
    bindingMemberName: "reportsList",
    factory: ReportsListViewModel
});

