define(['jquery', 'knockout'], function ($, ko) {
    return function appDataModel() {
        var self = this;
        // Routes
        self.userInfoUrl = "/api/Me";
        self.siteUrl = "/admin/";

        // Route operations

        // Other private operations

        // Operations

        // Data
        self.returnUrl = self.siteUrl;

        // Data access operations
        self.setAccessToken = function (accessToken) {
            sessionStorage.setItem("accessToken", accessToken);
        };

        self.getAccessToken = function () {
            return sessionStorage.getItem("accessToken");
        };
    }
}, this);
