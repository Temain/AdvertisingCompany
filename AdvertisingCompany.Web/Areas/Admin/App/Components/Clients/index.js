define(['jquery', 'knockout', 'knockout.mapping', 'knockout.validation.server-side', 'knockout.bindings.selectpicker',
    'knockout.bindings.tooltip', 'sammy', 'underscore', 'moment', 'progress',
    'text!/areas/admin/app/components/clients/index.html'], function ($, ko, koMapping, koValidation, bss, bst, sammy, _, moment, progress, template) {

    ko.mapping = koMapping;
    ko.serverSideValidator = koValidation;
    window.moment = moment;

    function ClientsListViewModel(params) {
        var self = this;
        self.isInitialized = ko.observable(false);

        self.selectedClient = ko.observable();
        self.clients = ko.observableArray([]);
        self.clientStatuses = ko.observableArray([]);
        self.page = ko.observable(1);
        self.pagesCount = ko.observable(1);
        self.pageSize = ko.observable(10);
        self.searchQuery = ko.observable('');
        self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);

        self.changePasswordViewModel = new ChangePasswordViewModel();

        self.loadClients = function () {
            self.isInitialized(false);
            progress.show();

            $.ajax({
                method: 'get',
                url: '/api/admin/clients',
                data: { query: self.searchQuery() || '', page: self.page(), pageSize: self.pageSize() },
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    progress.hide();
                },
                success: function (response) {
                    ko.mapping.fromJS(
                        response.clients,
                        {
                            key: function (data) {
                                return ko.utils.unwrapObservable(data.clientId);
                            },
                            create: function (options) {
                                var clientViewModel = new ClientViewModel(options.data);
                                // ko.serverSideValidator.updateKoModel(clientViewModel);
                                return clientViewModel;
                            }
                        },
                        self.clients
                    );

                    ko.mapping.fromJS(response.clientStatuses, {}, self.clientStatuses);
                    self.page(response.page);
                    self.pagesCount(response.pagesCount);
                    self.isInitialized(true);
                    progress.hide();
                }
            });
        };

        self.pageChanged = function (page) {
            self.page(page);
            self.loadClients();

            window.scrollTo(0, 0);
        };

        self.pageSizeChanged = function () {
            self.page(1);
            self.loadClients();

            window.scrollTo(0, 0);
        };

        self.clientStatusChanged = function (client, event) {
            if (self.isInitialized()) {
                $.ajax({
                    method: 'put',
                    url: '/api/admin/clients/' + client.clientId() + '/status/' + client.clientStatusId(),
                    // data: JSON.stringify({ clientId: client.clientId(), statusId: client.clientStatusId() }),
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                    },
                    error: function (response) {
                        $.notify({
                            icon: 'fa fa-exclamation-triangle',
                            message: "&nbsp;Произошла ошибка при изменении статуса клиента. Статус клиента не изменён."
                        }, {
                            type: 'danger'
                        });
                    },
                    success: function (response) {
                        var newStatus = _.find(self.clientStatuses(), function (status) { return status.clientStatusId() == client.clientStatusId() });
                        client.clientStatusLabelClass(newStatus.clientStatusLabelClass());

                        // Сброс стилей кнопки выпадающего списка
                        var statusSelect = $(event.target);
                        _.each(self.clientStatuses(), function (status) {
                            statusSelect.selectpicker('setStyle', 'btn-' + status.clientStatusLabelClass(), 'remove');
                        });

                        statusSelect.selectpicker('setStyle', 'btn-' + client.clientStatusLabelClass());

                        $.notify({
                            icon: 'glyphicon glyphicon-ok',
                            message: "&nbsp;Статус клиента успешно изменён."
                        }, {
                            type: 'success'
                        });
                    }
                });
            }
        };

        self.search = _.debounce(function () {
            self.page(1);
            self.loadClients();
        }, 300);

        self.selectClient = function (data) {
            if (self.selectedClient() != null && self.selectedClient().clientId() == data.clientId()) {
                self.selectedClient(null);
            } else {
                self.selectedClient(data);
            }

            return true;
        };

        self.isSelected = function (data) {
            return self.selectedClient() != null && self.selectedClient().clientId() == data.clientId();
        };

        self.isMonthChanged = function (index, data) {
            if (index) {
                var prevRecordMonth = moment(self.clients()[index - 1].createdAt()).month();
                var currentRecordMonth = moment(data.createdAt()).month();

                return prevRecordMonth != currentRecordMonth;
            }

            return false;
        };

        self.monthNameAndYear = function (date) {
            var result = moment(date).locale('ru').format('MMMM YYYY');
            return result.charAt(0).toUpperCase() + result.slice(1);
        };

        self.init = function () {
            self.loadClients();
        };

        self.showChangePasswordModal = function (data, event) {
            var clientId = self.selectedClient().clientId();
            self.changePasswordViewModel = new ChangePasswordViewModel();
            self.changePasswordViewModel.clientId(clientId);

            ko.serverSideValidator.clearErrors('#change-password-popup');

            var modalBody = $('#change-password-form')[0];
            app.applyElement(self.changePasswordViewModel, modalBody);

            $('#change-password-popup').modal();
        };

        self.changePassword = function () {
            var viewModel = self.changePasswordViewModel;
            viewModel.isValidationEnabled(true);
            var postData = ko.toJSON(viewModel);

            $.ajax({
                method: 'put',
                url: '/api/admin/clients/' + self.selectedClient().clientId() + '/change_password',
                data: postData,
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    var responseText = response.responseText;
                    if (responseText) {
                        responseText = JSON.parse(responseText);
                        var modelState = responseText.modelState;
                        if (modelState && modelState.shared) {
                            var message = '<strong>&nbsp;Пароль не изменён. Список ошибок:</strong><ul>';
                            $.each(modelState.shared, function (index, error) {
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

                        ko.serverSideValidator.validateModel(self.changePasswordViewModel, responseText);

                        $.notify({
                            icon: 'fa fa-exclamation-triangle',
                            message: "&nbsp;Пожалуйста, исправьте ошибки."
                        }, {
                            type: 'danger',
                            z_index: 9999
                        });
                    }
                },
                success: function (response) {
                    viewModel.isValidationEnabled(false);
                    $("#change-password-popup").modal("hide");
                    $.notify({
                        icon: 'glyphicon glyphicon-ok',
                        message: "&nbsp;Пароль клиента успешно изменён."
                    }, {
                        type: 'success',
                        z_index: 9999
                    });
                }
            });
        };

        self.showDeleteModal = function (data, event) {
            $("#delete-popup").modal();
        };

        self.deleteClient = function () {
            $.ajax({
                method: 'delete',
                url: '/api/admin/clients/' + self.selectedClient().clientId(),
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                },
                error: function (response) {
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Произошла ошибка при удалении клиента."
                    }, {
                        type: 'danger'
                    });
                },
                success: function (response) {
                    self.selectedClient(null);
                    self.init();
                    $("#delete-popup").modal("hide");
                    $.notify({
                        icon: 'fa fa-exclamation-triangle',
                        message: "&nbsp;Клиент успешно удалён."
                    }, {
                        type: 'success'
                    });
                }
            });
        };

        return self;
    }

    function ClientViewModel(dataModel) {
        var self = this;

        self.clientId = ko.observable(dataModel.clientId || '');
        self.campaignId = ko.observable(dataModel.campaignId || '')
        self.companyName = ko.observable(dataModel.companyName || '');
        self.activityTypeId = ko.observable(dataModel.activityTypeId || '');
        self.activityTypeName = ko.observable(dataModel.activityTypeName || '');
        self.activityCategoryName = ko.observable(dataModel.activityCategoryName || '');
        self.responsiblePersonId = ko.observable(dataModel.responsiblePersonId || '');
        self.responsiblePersonShortName = ko.observable(dataModel.responsiblePersonShortName || '');
        self.phoneNumber = ko.observable(dataModel.phoneNumber || '');
        self.additionalPhoneNumber = ko.observable(dataModel.additionalPhoneNumber || '');
        self.email = ko.observable(dataModel.email || '');
        self.userNames = ko.observableArray(dataModel.userNames || []);
        self.clientStatusId = ko.observable(dataModel.clientStatusId || '');
        self.clientStatusInitialId = ko.observable(dataModel.clientStatusId || '');
        self.clientStatusInitialized = ko.observable(false);
        self.clientStatusName = ko.observable(dataModel.clientStatusName || '');
        self.clientStatusLabelClass = ko.observable(dataModel.clientStatusLabelClass || '');
        self.createdAt = ko.observable(dataModel.createdAt || '');
        self.comment = ko.observable(dataModel.comment || '');
    }

    function ChangePasswordViewModel(dataModel) {
        var self = this;
        if (!dataModel) {
            dataModel = {};
        }

        self.isValidationEnabled = ko.observable(false);

        self.clientId = ko.observable(dataModel.clientId || '').extend({
            required: {
                params: true
            }
        });;
        self.password = ko.observable(dataModel.password || '').extend({
            required: {
                params: true,
                message: "Введите пароль.",
                onlyIf: function () { return self.isValidationEnabled(); }
            }
        });
        self.confirmPassword = ko.observable(dataModel.confirmPassword || '').extend({
            required: {
                params: true,
                message: "Введите подтверждение пароля.",
                onlyIf: function () { return self.isValidationEnabled(); }
            }
        });
    }

    var clientsListViewModel = new ClientsListViewModel();

    app.addViewModel({
        name: "clients",
        bindingMemberName: "clientsList",
        viewItem: clientsListViewModel
    });

    clientsListViewModel.init();

    return { viewModel: { instance: clientsListViewModel }, template: template };
});