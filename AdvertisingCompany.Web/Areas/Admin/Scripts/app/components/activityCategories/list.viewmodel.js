define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.bindings.selectpicker', 'knockout.bindings.tooltip', 'progress',
    'text!/areas/admin/static/activityCategories/index.html'
], function($, ko, koMapping, bss, bst, progress, template) {

    ko.mapping = koMapping;

    function ActivityCategoriesListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedCategory = ko.observable();
        self.categories = ko.observableArray([]);
        self.page = ko.observable(1);
        self.pagesCount = ko.observable(1);
        self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
        self.pageSize = ko.observable(10);
        self.searchQuery = ko.observable('');

        self.loadActivityCategories = function() {
            self.isInitialized(false);
            progress.show();

            $.ajax({
                method: 'get',
                url: '/admin/api/activity/categories',
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
                        response.categories,
                        {
                            key: function(data) {
                                return ko.utils.unwrapObservable(data.activityCategoryId);
                            },
                            create: function(options) {
                                var activityCategoryViewModel = new ActivityCategoryViewModel(options.data);
                                // ko.serverSideValidator.updateKoModel(clientViewModel);
                                return activityCategoryViewModel;
                            }
                        },
                        self.categories
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
            self.loadActivityCategories();

            window.scrollTo(0, 0);
        };

        self.pageSizeChanged = function() {
            self.page(1);
            self.loadActivityCategories();

            window.scrollTo(0, 0);
        };

        self.search = _.debounce(function() {
            self.page(1);
            self.loadActivityCategories();
        }, 300);

        self.init = function() {
            self.loadActivityCategories();
        };

        self.showDeleteModal = function (data, event) {
            self.selectedCategory(data);
            $("#delete-popup").modal();
        };

        self.deleteCategory = function () {
            $.ajax({
                method: 'delete',
                url: '/admin/api/activity/categories/' + self.selectedCategory().activityCategoryId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "Произошла ошибка при удалении категории вида деятельности."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    self.init();
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Категория вида деятельности успешно удалёна."
                    }, {
                        type: 'success'
                    });
                }
            });
        };

        return self;
    }

    function ActivityCategoryViewModel(activityCategoryViewModel) {
        var self = this;

        self.activityCategoryId = ko.observable(activityCategoryViewModel.activityCategoryId || '');
        self.activityCategoryName = ko.observable(activityCategoryViewModel.activityCategoryName || '');
    }

    var activityCategoriesListViewModel = new ActivityCategoriesListViewModel();

    app.addViewModel({
        name: "activityCategoriesList",
        bindingMemberName: "activityCategoriesList",
        viewItem: activityCategoriesListViewModel
    });

    activityCategoriesListViewModel.init();

    return { viewModel: { instance: activityCategoriesListViewModel }, template: template };
});