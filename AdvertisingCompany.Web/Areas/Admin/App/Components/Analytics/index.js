define(['jquery', 'knockout', 'knockout.mapping', 'sammy', 'highcharts', 'highcharts-funnel',
'text!/areas/admin/app/components/analytics/index.html'], function ($, ko, koMapping, sammy, highcharts, highchartsFunnel, template) {

    ko.mapping = koMapping;

    function AnalyticsViewModel(params) {
        var self = this;

        self.isInitialized = ko.observable(false);

        self.clients = ko.observable(AnalyticsViewModel.clients || '0');
        self.newClients = ko.observable(AnalyticsViewModel.newClients || '0');
        self.visitsPerDay = ko.observable(AnalyticsViewModel.visitsPerDay || '0');
        self.online = ko.observable(AnalyticsViewModel.online || '0');
        self.advertisingObjects = ko.observable(AnalyticsViewModel.advertisingObjects || '0');
        self.reports = ko.observable(AnalyticsViewModel.reports || '0');
        self.incomeForYear = ko.observable(AnalyticsViewModel.incomeForYear || '0');
        self.incomeForMonth = ko.observable(AnalyticsViewModel.incomeForMonth || '0');

        self.init = function () {
            self.isInitialized(false);

            $.ajax({
                method: 'get',
                url: '/api/admin/analytics',
                contentType: "application/json; charset=utf-8",
                headers: {
                    'Authorization': 'Bearer ' + app.getAccessToken()
                },
                success: function (response) {
                    if (response) {
                        ko.mapping.fromJS(response, {}, self);

                        self.isInitialized(true);
                    }
                }
            });

            // Диаграммы
            setTimeout(function () {
                // Воронка продаж
                Highcharts.chart('salesFunnel', {
                    credits: {
                        enabled: false
                    },
                    chart: {
                        type: 'funnel',
                        marginRight: 100
                    },
                    title: {
                        text: 'Воронка продаж',
                        x: -50
                    },
                    plotOptions: {
                        series: {
                            dataLabels: {
                                enabled: true,
                                format: '<b>{point.name}</b> ({point.y:,.0f})',
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                                softConnector: true
                            },
                            neckWidth: '30%',
                            neckHeight: '25%'

                            //-- Other available options
                            // height: pixels or percent
                            // width: pixels or percent
                        }
                    },
                    legend: {
                        enabled: false
                    },
                    series: [{
                        name: 'Unique users',
                        data: [
                            ['Что-то №1', 5000],
                            ['Что-то №2', 4000],
                            ['Что-то №3', 3000],
                            ['Что-то №4', 2000],
                            ['Что-то №5', 1000]
                        ]
                    }]
                });

                // По роду деятельности
                $.ajax({
                    method: 'get',
                    url: '/api/admin/analytics/clients_by_category',
                    contentType: "application/json; charset=utf-8",
                    headers: {
                        'Authorization': 'Bearer ' + app.getAccessToken()
                    },
                    success: function (data) {
                        Highcharts.chart('byActivityCategory', {
                            credits: {
                                enabled: false
                            },
                            chart: {
                                type: 'column'
                            },
                            title: {
                                text: 'Количество клиентов по категориям деятельности'
                            },
                            //subtitle: {
                            //    text: 'Click the columns to view versions. Source: <a href="http://netmarketshare.com">netmarketshare.com</a>.'
                            //},
                            xAxis: {
                                type: 'category'
                            },
                            yAxis: {
                                title: {
                                    text: 'Количество клиентов'
                                }
                            },
                            legend: {
                                enabled: false
                            },
                            plotOptions: {
                                series: {
                                    borderWidth: 0,
                                    dataLabels: {
                                        enabled: true,
                                        format: '{point.y}'
                                    }
                                }
                            },

                            tooltip: {
                                headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
                                pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y}</b> клиентов<br/>'
                            },

                            series: [{
                                name: 'Категория деятельности',
                                colorByPoint: true,
                                data: data
                            }]
                        });
                    }
                });
               
            }, 1000);       
        };

        return self;
    }

    var analytics = new AnalyticsViewModel();

    app.addViewModel({
        name: "analytics",
        bindingMemberName: "analytics",
        instance: analytics
    });

    analytics.init();

    return { viewModel: { instance: analytics }, template: template };
});