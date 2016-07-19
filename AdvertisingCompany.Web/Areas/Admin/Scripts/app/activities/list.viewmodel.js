function ActivitiesListViewModel(app, dataModel) {
    var self = this;
    self.isInitialized = ko.observable(false);

    self.activities = ko.observableArray([]);
    self.page = ko.observable(1);
    self.pagesCount = ko.observable(1);
    self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
    self.pageSize = ko.observable(10);
    self.searchQuery = ko.observable('');

    self.loadActivities = function () {
        self.isInitialized(false);
        progress.show();

        $.ajax({
            method: 'get',
            url: '/admin/api/activities',
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
                //    response.activities,
                //    {
                //        key: function (data) {
                //            return ko.utils.unwrapObservable(data.activityTypeId);
                //        },
                //        create: function (options) {
                //            var activityViewModel = new ActivityViewModel(options.data);
                //            // ko.serverSideValidator.updateKoModel(clientViewModel);
                //            return activityViewModel;
                //        }
                //    },
                //    self.activities
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
        self.loadActivities();

        window.scrollTo(0, 0);
    };

    self.pageSizeChanged = function () {
        self.page(1);
        self.loadActivities();

        window.scrollTo(0, 0);
    };

    self.search = _.debounce(function () {
        self.page(1);
        self.loadActivities();
    }, 300);

    Sammy(function () {
        this.get('#activities', function () {
            app.view(self);
            self.loadActivities();
        });
    });

    return self;
}

function ActivityViewModel(dataModel) {
    var self = this;
}

app.addViewModel({
    name: "ActivitiesList",
    bindingMemberName: "activitiesList",
    factory: ActivitiesListViewModel
});

