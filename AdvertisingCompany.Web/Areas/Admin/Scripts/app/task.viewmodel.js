var TaskViewModel = function (app, dataModel) {
    var self = this;

    self.list = ko.observableArray([]);
    self.selectedPage = ko.observable(1);
    self.pageSizes = ko.observableArray([10, 25, 50, 100, 200]);
    self.selectedPageSize = ko.observable(10);
    self.tasksCount = ko.observable();
    self.pagesCount = ko.observable();
    self.searchQuery = ko.observable('');

    self.selectedPageChanged = function (page) {
        if (page > 0 && page <= self.pagesCount()) {
            self.selectedPage(page);
            self.loadTasks();

            window.scrollTo(0, 0);
        }
    }

    self.pageSizeChanged = function () {
        self.selectedPage(1);
        self.loadTasks();

        window.scrollTo(0, 0);
    };

    Sammy(function () {
        this.get('#task', function () {
            app.markLinkAsActive('task');
            app.breadcrumb(['Заявки']);

            self.loadTasks();
        });

        this.get('/', function () { this.app.runRoute('get', '#task') });
    });

    self.loadTasks = function() {
        $.ajax({
            method: 'get',
            url: '/api/Task',
            data: { query: self.searchQuery(), page: self.selectedPage(), pageSize: self.selectedPageSize() },
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (response) {
                ko.mapping.fromJS(response.items, {}, self.list);
                self.pagesCount(response.pagesCount);
                self.tasksCount(response.itemsCount);
                app.view(self);
            }
        });
    }

    self.search = _.debounce(function () {
        self.selectedPage(1);
        self.loadTasks();
    }, 300);

    self.removeTask = function (task) {
        $.ajax({
            method: 'delete',
            url: '/api/Task/' + task.taskId(),
            data: JSON.stringify(ko.toJS(self)),
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (response) {
                self.list.remove(task);
                showAlert('success', 'Запись успешно удалёна.');
            }
        });
    }

    return self;
}

var EditTaskViewModel = function(app, dataModel) {
    var self = this;

    self.clientName = ko.observable();
    self.carModel = ko.observable();
    self.carNumber = ko.observable();
    self.crashTypeId = ko.observable().extend({
        required: {
            params: true,
            message: "Необходимо выбрать вид работы."
        }
    });
    self.crashTypes = ko.observable([]);

    self.employeeId = ko.observable().extend({
        required: {
            params: true,
            message: "Необходимо выбрать исполнителя."
        }
    });
    self.employees = ko.observable([]);
    self.spareParts = ko.observable([]);
    self.comment = ko.observable();
    self.createdAt = ko.observable(moment());
    self.totalCost = ko.computed(function () {
        var total = 0;

        var selectedSpareParts = $.grep(self.spareParts(),
            function (e) {
                return $.inArray(e.sparePartId(), self.sparePartIds()) != -1;
            });

        for (var i = 0; i < selectedSpareParts.length; i++) {
            total += selectedSpareParts[i].cost() << 0;
        }

        var selectedCrashType = $.grep(self.crashTypes(),
            function (e) {
                return e.crashTypeId() == self.crashTypeId();
            });
        if (selectedCrashType.length) {
            total += selectedCrashType[0].repairCost() << 0;
        }

        return total;
    }, this);


    self.save = function () {
        var result = ko.validation.group(self, { deep: true });
        if (!self.isValid()) {
            result.showAllMessages(true);

            return false;
        }

        var postData = {
            taskId: self.taskId(),
            clientName: self.clientName(),
            carModel: self.carModel(),
            carNumber: self.carNumber(),
            crashTypeId: self.crashTypeId(),
            employeeId: self.employeeId(),
            createdAt: self.createdAt(),
            sparePartIds: self.sparePartIds(),
            comment: self.comment()
        };

        $.ajax({
            method: 'put',
            url: '/api/Task/',
            data: JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            success: function (response) {
                app.navigateToTask();
                showAlert('success', 'Изменения успешно сохранены.');
            }
        });
    }

    Sammy(function () {
        this.get('#task/:id', function () {
            app.markLinkAsActive('task');
            app.returnUrl = '#task';

            var id = this.params['id'];
            if (id === 'create') {
                app.breadcrumb(['Заявки', 'Новая']);

                $.ajax({
                    method: 'get',
                    url: '/api/Task/0',
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                    },
                    success: function (response) {
                        ko.mapping.fromJS(response, {}, app.Views.CreateTask);
                        app.view(app.Views.CreateTask);
                        app.Views.CreateTask.isValidationEnabled(false);
                    }
                });
            } else {
                app.breadcrumb(['Заявки', 'Редактирование']);

                $.ajax({
                    method: 'get',
                    url: '/api/Task/' + id,
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
                    },
                    success: function (response) {
                        ko.mapping.fromJS(response, {}, self);
                        app.view(self);
                    }
                });
            }
        });
    });
}

var CreateTaskViewModel = function (app, dataModel) {
    var self = this;
    self.isValidationEnabled = ko.observable(false);

    self.clientName = ko.observable();
    self.carModel = ko.observable();
    self.carNumber = ko.observable();
    self.crashTypeId = ko.observable().extend({
        required: {
            params: true,
            message: "Необходимо выбрать вид работы.",
            onlyIf: function () {
                return self.isValidationEnabled();
            }
        }
    });
    self.crashTypes = ko.observable([]);

    self.employeeId = ko.observable().extend({
        required: {
            params: true,
            message: "Необходимо выбрать исполнителя.",
            onlyIf: function () {
                return self.isValidationEnabled();
            }

        }
    });
    self.employees = ko.observable([]);
    self.sparePartIds = ko.observableArray([1]);
    self.spareParts = ko.observableArray([]);
    self.comment = ko.observable();
    self.createdAt = ko.observable(moment());

    self.totalCost = ko.computed(function () {
        var total = 0;

        var selectedSpareParts = $.grep(self.spareParts(),
            function(e) {
                return $.inArray(e.sparePartId(), self.sparePartIds()) != -1;
            });
        
        for (var i = 0; i < selectedSpareParts.length; i++) {
            total += selectedSpareParts[i].cost() << 0;
        }

        var selectedCrashType = $.grep(self.crashTypes(),
            function (e) {
                return e.crashTypeId() == self.crashTypeId();
            });
        if (selectedCrashType.length) {
            total += selectedCrashType[0].repairCost() << 0;
        }

        return total;
    }, this);

    self.save = function () {
        self.isValidationEnabled(true);
        var result = ko.validation.group(self, { deep: true });
        if (!self.isValid()) {
            result.showAllMessages(true);

            return false;
        }

        var postData = {            
            clientName: self.clientName(),
            carModel: self.carModel(),
            carNumber: self.carNumber(),
            crashTypeId: self.crashTypeId(),
            employeeId: self.employeeId(),
            createdAt: self.createdAt(),
            sparePartIds: self.sparePartIds(),
            comment: self.comment()
        };

        $.ajax({
            method: 'post',
            url: '/api/Task/',
            data: JSON.stringify(postData),
            contentType: "application/json; charset=utf-8",
            headers: {
                'Authorization': 'Bearer ' + app.dataModel.getAccessToken()
            },
            error: function(response) {
                // showAlert('danger', 'Произошла ошибка при добавлении сотрудника. Обратитесь в службу технической поддержки.');
            },
            success: function (response) {
                self.clientName('');
                self.carModel('');
                self.carNumber('');
                self.crashTypeId('');
                self.employeeId('');
                self.createdAt('');
                self.sparePartIds([]);
                self.comment('');

                result.showAllMessages(false);

                app.navigateToTask();
                showAlert('success', 'Запись успешно добавлена.');
            }
        });
    }
}

app.addViewModel({
    name: "Task",
    bindingMemberName: "task",
    factory: TaskViewModel
});

app.addViewModel({
    name: "EditTask",
    bindingMemberName: "editTask",
    factory: EditTaskViewModel
});

app.addViewModel({
    name: "CreateTask",
    bindingMemberName: "createTask",
    factory: CreateTaskViewModel
});