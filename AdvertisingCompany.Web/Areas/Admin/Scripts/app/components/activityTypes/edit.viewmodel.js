define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy', 'knockout.bindings.selectpicker',
     'text!home/html/?path=~/areas/admin/views/activityTypes/edit.cshtml'
], function($, ko, koMapping, koValidation, sammy, bss, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var EditActivityTypeViewModel = function (params) {
        var self = this;

        if (!params) {
            params = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.activityCategoryId = ko.observable(params.activityCategoryId || 0).extend({
            required: {
                params: true,
                message: "Выберите категорию вида деятельности.",
                onlyIf: function () { return self.isValidationEnabled(); }
            }
        });
        self.activityCategoryInitialId = ko.observable();
        self.activityCategoryInitialized = ko.observable(false);
        self.activityCategories = ko.observableArray(params.activityCategories || []);

        self.activityTypeName = ko.observable(params.activityTypeName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование вида деятельности.",
                onlyIf: function () { return self.isValidationEnabled(); }
            }
        });

        self.init = function () {
            var activityTypeId = app.routes.currentParams.activityTypeId;
            $.ajax({
                method: 'get',
                url: '/admin/api/activity/types/' + activityTypeId,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) { },
                success: function (response) {
                    ko.mapping.fromJS(response, {}, self);
                    app.applyComponent(self);
                    app.view(self);

                    self.activityCategoryInitialId(response.activityCategoryId);
                    self.activityCategoryId(response.activityCategoryId);
                }
            });
        };

        self.submit = function() {
            self.isValidationEnabled(true);
            var postData = ko.toJSON(self);

            $.ajax({
                method: 'put',
                url: '/admin/api/activity/types/',
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
                            var message = '<strong>&nbsp;Вид деятельности не сохранён. Список ошибок:</strong><ul>';
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
                        $('.selectpicker').selectpicker('refresh');

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
                    sammy().setLocation('#activity/types');
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "Вид деятельности успешно изменён."
                    }, {
                        type: 'success'
                    });
                }
            });
        }
    }

    var editActivityTypeViewModel = new EditActivityTypeViewModel();

    app.addViewModel({
        name: "editActivityType",
        bindingMemberName: "editActivityType",
        viewItem: editActivityTypeViewModel
    });

    editActivityTypeViewModel.init();

    return { viewModel: { instance: editActivityTypeViewModel }, template: template };
});