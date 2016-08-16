define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.selectpicker', 'knockout.bindings.tooltip', 'progress',
    'text!/areas/admin/static/activityTypes/index.html'
], function($, ko, koMapping, bss, bst, progress, template) {

    ko.mapping = koMapping;

    function ActivityTypesListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedType = ko.observable();
        self.types = ko.observableArray([]);
        self.page = ko.observable(1);
        self.pagesCount = ko.observable(1);
        self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
        self.pageSize = ko.observable(10);
        self.searchQuery = ko.observable('');

        self.loadActivityTypes = function() {
            self.isInitialized(false);
            progress.show();

            $.ajax({
                method: 'get',
                url: '/admin/api/activity/types',
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
                        response.types,
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
                        self.types
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
            self.loadActivityTypes();

            window.scrollTo(0, 0);
        };

        self.pageSizeChanged = function() {
            self.page(1);
            self.loadActivityTypes();

            window.scrollTo(0, 0);
        };

        self.search = _.debounce(function() {
            self.page(1);
            self.loadActivityTypes();
        }, 300);

        self.init = function() {
            self.loadActivityTypes();
        };

        self.showDeleteModal = function (data, event) {
            self.selectedType(data);
            $("#delete-popup").modal();
        };

        self.deleteType = function () {
            $.ajax({
                method: 'delete',
                url: '/admin/api/activity/types/' + self.selectedType().activityTypeId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "Произошла ошибка при удалении вида деятельности."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    self.init();
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Вид деятельности успешно удалён."
                    }, {
                        type: 'success'
                    });
                }
            });
        };

        return self;
    }

    function ActivityTypeViewModel(activityTypeViewModel) {
        var self = this;

        self.activityTypeId = ko.observable(activityTypeViewModel.activityTypeId || '');
        self.activityTypeName = ko.observable(activityTypeViewModel.activityTypeName || '');
        self.activityCategoryName = ko.observable(activityTypeViewModel.activityCategoryName || '');
    }

    var activityTypesListViewModel = new ActivityTypesListViewModel();

    app.addViewModel({
        name: "activityTypesList",
        bindingMemberName: "activityTypesList",
        viewItem: activityTypesListViewModel
    });

    activityTypesListViewModel.init();

    return { viewModel: { instance: activityTypesListViewModel }, template: template };
});