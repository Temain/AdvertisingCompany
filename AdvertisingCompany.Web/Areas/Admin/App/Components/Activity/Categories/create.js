define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy',
    'text!/areas/admin/app/components/activity/categories/create.html'
], function ($, ko, koMapping, koValidation, sammy, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var CreateActivityCategoryViewModel = function(params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.activityCategoryName = ko.observable(params.activityCategoryName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование категории.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        
        self.init = function() {
            $.ajax({
                method: 'get',
                url: '/api/admin/activity/categories/0',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                error: function(response) {},
                success: function (response) {
                    self.isValidationEnabled(false);
                    ko.mapping.fromJS(response, {}, self);
                    app.applyComponent(self);
                }
            });
        };

        self.submit = function(toNextStage) {
            self.isValidationEnabled(true);
            var postData = ko.toJSON(self);

            $.ajax({
                method: 'post',
                url: '/api/admin/activity/categories/',
                data: postData,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
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
                    sammy().setLocation('#activity/categories');
                    self.isValidationEnabled(false);
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Категория успешно сохранён."
                    }, {
                        type: 'success'
                    });
                }
            });
        }
    }

    var createActivityCategory = new CreateActivityCategoryViewModel();

    app.addViewModel({
        name: "activity-category-create",
        bindingMemberName: "createActivityCategory",
        instance: createActivityCategory
    });

    createActivityCategory.init();

    return { viewModel: { instance: createActivityCategory }, template: template };
});