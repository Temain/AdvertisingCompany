define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy',
     'text!home/html/?path=~/areas/admin/views/activityCategories/edit.cshtml'
], function($, ko, koMapping, koValidation, sammy, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var EditActivityCategoryViewModel = function (params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.activityCategoryId = ko.observable(params.activityCategoryId || '').extend({
            required: { params: true }
        });
        self.activityCategoryName = ko.observable(params.activityCategoryName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование категории."
            }
        });

        self.init = function () {
            var activityCategoryId = app.routes.currentParams.activityCategoryId;
            $.ajax({
                method: 'get',
                url: '/admin/api/activity/categories/' + activityCategoryId,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) { },
                success: function (response) {
                    ko.mapping.fromJS(response, {}, self);
                    app.applyComponent(self);
                    app.view(self);
                }
            });
        };

        self.submit = function() {
            self.isValidationEnabled(true);
            var postData = ko.toJSON(self);

            $.ajax({
                method: 'put',
                url: '/admin/api/activity/categories/',
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
                        if (modelState && modelState.shared) {
                            var message = '<strong>&nbsp;Категория не сохранена. Список ошибок:</strong><ul>';
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
                    sammy().setLocation('#activity/categories');
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "Категория успешно изменена."
                    }, {
                        type: 'success'
                    });
                }
            });
        }
    }

    var editActivityCategoryViewModel = new EditActivityCategoryViewModel();

    app.addViewModel({
        name: "editActivityCategory",
        bindingMemberName: "editActivityCategory",
        viewItem: editActivityCategoryViewModel
    });

    editActivityCategoryViewModel.init();

    return { viewModel: { instance: editActivityCategoryViewModel }, template: template };
});