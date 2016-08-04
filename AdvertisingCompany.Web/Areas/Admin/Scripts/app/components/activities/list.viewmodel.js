define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.selectpicker', 'knockout.bindings.tooltip', 'progress',
    'text!home/html/?path=~/areas/admin/views/activities/index.cshtml'
], function($, ko, koMapping, bss, bst, progress, template) {

    ko.mapping = koMapping;

    function ActivitiesListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.activities = ko.observableArray([]);
        self.page = ko.observable(1);
        self.pagesCount = ko.observable(1);
        self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
        self.pageSize = ko.observable(10);
        self.searchQuery = ko.observable('');

        self.loadActivities = function() {
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
                success: function(response) {
                    ko.mapping.fromJS(
                        response.activities,
                        {
                            key: function(data) {
                                return ko.utils.unwrapObservable(data.activityTypeId);
                            },
                            create: function(options) {
                                var activityViewModel = new ActivityTypeViewModel(options.data);
                                // ko.serverSideValidator.updateKoModel(clientViewModel);
                                return activityViewModel;
                            }
                        },
                        self.activities
                    );

                    self.page(response.page);
                    self.pagesCount(response.pagesCount);
                    self.isInitialized(true);
                    progress.hide();
                }
            });
        };

        self.pageChanged = function(page) {
            self.page(page);
            self.loadActivities();

            window.scrollTo(0, 0);
        };

        self.pageSizeChanged = function() {
            self.page(1);
            self.loadActivities();

            window.scrollTo(0, 0);
        };

        self.search = _.debounce(function() {
            self.page(1);
            self.loadActivities();
        }, 300);

        self.init = function() {
            app.view(self);
            self.loadActivities();
        };

        return self;
    }

    function ActivityTypeViewModel(activityTypeViewModel) {
        var self = this;

        self.activityTypeId = ko.observable(activityTypeViewModel.activityTypeId || '');
        self.activityTypeName = ko.observable(activityTypeViewModel.activityTypeName || '');
        self.activityCategory = ko.observable(activityTypeViewModel.activityCategory || '');
    }

    var activitiesListViewModel = new ActivitiesListViewModel();

    app.addViewModel({
        name: "activitiesList",
        bindingMemberName: "activitiesList",
        viewItem: activitiesListViewModel
    });

    activitiesListViewModel.init();

    return { viewModel: { instance: activitiesListViewModel }, template: template };
});