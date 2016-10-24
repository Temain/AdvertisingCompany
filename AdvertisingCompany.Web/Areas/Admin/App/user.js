define(['jquery', 'knockout'], function ($, ko) {
    return function UserViewModel(data) {
        var self = this;

        self.roles = ko.observableArray(data.roles.split(",") || []);

        // function to check if role passed is in array
        self.hasRole = function (roleName) {
            for (i = 0; 1 < self.roles.length ; i++) {
                if (self.roles[i] == roleName)
                    return true
            }
            return false;
        }
    };
});