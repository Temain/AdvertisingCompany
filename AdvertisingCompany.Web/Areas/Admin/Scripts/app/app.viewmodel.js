define(['jquery', 'knockout', 'sammy', 'common', 'underscore'], function ($, ko, sammy, common, _)
{
    return function AppViewModel(dataModel) {
        // Private state
        var self = this;

        // Private operations
        function cleanUpLocation() {
            window.location.hash = "";

            if (typeof (history.pushState) !== "undefined") {
                history.pushState("", document.title, location.pathname);
            }
        }
        // Data
        self.views = {
            Loading: {} // Other views are added dynamically by app.addViewModel(...).
        };
        self.dataModel = dataModel;

        // UI state
        self.view = ko.observable(self.views.Loading);

        self.componentName = ko.observable();

        self.loading = ko.computed(function () {
            return self.view() === self.views.Loading;
        });

        // UI operations

        // Other navigateToX functions are added dynamically by app.addViewModel(...).

        // Other operations
        self.addViewModel = function (options) {
            // Add view to AppViewModel.Views enum (for example, app.Views.Home).
            self.views[options.name] = options.viewItem;

            // Add binding member to AppViewModel (for example, app.home);
            self[options.bindingMemberName] = ko.computed(function () {
                if (!dataModel.getAccessToken()) {
                    // The following code looks for a fragment in the URL to get the access token which will be
                    // used to call the protected Web API resource
                    var fragment = window.common.getFragment();

                    if (fragment.access_token) {
                        // returning with access token, restore old hash, or at least hide token
                        window.location.hash = fragment.state || '';
                        dataModel.setAccessToken(fragment.access_token);
                    } else {
                        // no token - so bounce to Authorize endpoint in AccountController to sign in or register
                        window.location = "/account/authorize?client_id=web&response_type=token&state=" + encodeURIComponent(window.location.hash);
                    }
                }

                if (self.view() !== options.viewItem) {
                    return null;
                }

                return self.views[options.name];
            });

            if (typeof (options.navigatorFactory) !== "undefined") {
                navigator = options.navigatorFactory(self, dataModel);
            } else {
                navigator = function () {
                    window.location.hash = options.bindingMemberName;
                };
            }

            // Add navigation member to AppViewModel (for example, app.NavigateToHome());
            self["navigateTo" + options.name] = navigator;
        };

        self.backlink = function () {
            window.location.hash = app.returnUrl;
        }

        self.initialize = function () {
            // app.returnUrl = '#task';
            sammy(function () {
                this.post('/account/logoff/', function () { return true; });

                this.get('#clients', function () {
                    app.componentName('clientsList');
                });

                this.get('#analytics', function () {
                    app.componentName('analytics');
                });
                this.get('/admin/', function () { this.app.runRoute('get', '#analytics') });
            }).run();

            // Заглушка ошибки при скрытых элементах для holder.js
            //Holder.invisible_error_fn = function (fn) {
            //    return function (el) {              
            //        setTimeout(function() {
            //            fn.call(this, el);
            //        }, 10);
            //    }
            //}

            ///**
            // * Holder js hack. removing holder's data to prevent onresize callbacks execution
            // * so they don't fail when page loaded
            // * via ajax and there is no holder elements anymore
            // */
            //$('img[data-src]').each(function () {
            //    delete this.holder_data;
            //});

            // Пометка активных элементов сайдбара
            $('.sidebar-nav ul > li > a').click(function () {
                $('.sidebar-nav ul > li').removeClass('active');
                $(this).parent().addClass('active');
                $('.sidebar-nav a[data-parent="#sidebar"]').parent('li').removeClass('active');
                $(this).closest('ul').parent('li').addClass('active');
            });

            $('.sidebar-nav a[data-parent="#sidebar"]').click(function () {
                $('.sidebar-nav a[data-parent="#sidebar"]').parent('li').removeClass('active');
                $(this).parent('li').addClass('active');
                var childLinks = $(this).next('ul');
                if (!childLinks.length) {
                    $('.sidebar-nav ul > li').removeClass('active');
                }
            });
        }
    }

}, this);
