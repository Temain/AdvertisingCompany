define([
    'jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'sammy', 'knockout.bindings.selectpicker',
    'text!/areas/admin/static/activityTypes/create.html'
], function ($, ko, koMapping, koValidation, sammy, bss, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;

    var CreateActivityTypeViewModel = function(params) {
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
        self.activityCategories = ko.observableArray(params.activityCategories || []);

        self.activityTypeName = ko.observable(params.activityTypeName || '').extend({
            required: {
                params: true,
                message: "Необходимо указать наименование вида деятельности.",
                onlyIf: function() { return self.isValidationEnabled(); }
            }
        });
        
        self.init = function() {
            $.ajax({
                method: 'get',
                url: '/admin/api/activity/types/0',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function(response) {},
                success: function (response) {
                    self.isValidationEnabled(false);
                    ko.mapping.fromJS(response, {}, self);
                    app.applyComponent(self);
                }
            });
        };

        self.submit = function() {
            self.isValidationEnabled(true);
            var postData = ko.toJSON(self);

            $.ajax({
                method: 'post',
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
                    sammy().setLocation('#activity/types');
                    self.isValidationEnabled(false);
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "Вид деятельности успешно сохранён."
                    }, {
                        type: 'success'
                    });
                }
            });
        }
    }

    var createActivityTypeViewModel = new CreateActivityTypeViewModel();

    app.addViewModel({
        name: "createActivityType",
        bindingMemberName: "createActivityType",
        viewItem: createActivityTypeViewModel
    });

   createActivityTypeViewModel.init();

   return { viewModel: { instance: createActivityTypeViewModel }, template: template };
});