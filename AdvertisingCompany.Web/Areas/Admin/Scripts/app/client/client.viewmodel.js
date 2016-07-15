function ClientViewModel(app, dataModel) {
    var self = this;

    self.status = ko.observable("");

    Sammy(function () {
        this.get('#client', function () {
            app.view(self);
        });
    });

    return self;
}

app.addViewModel({
    name: "Client",
    bindingMemberName: "client",
    factory: ClientViewModel
});


