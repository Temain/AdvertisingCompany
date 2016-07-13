$(function(){

    function initSparkline2(){
        $('#sparkline2').sparkline([2,4,8],{
            type: 'pie',
            width: '100px',
            height: '100px',
            sliceColors: ['#F5CB7B', '#FAEEE5', '#f0f0f0']
        });
    }

    /* Inspired by Lee Byron's test data generator. */
    function _stream_layers(n, m, o) {
        if (arguments.length < 3) o = 0;
        function bump(a) {
            var x = 1 / (.1 + Math.random()),
                y = 2 * Math.random() - .5,
                z = 10 / (.1 + Math.random());
            for (var i = 0; i < m; i++) {
                var w = (i / m - y) * z;
                a[i] += x * Math.exp(-w * w);
            }
        }
        return d3.range(n).map(function() {
            var a = [], i;
            for (i = 0; i < m; i++) a[i] = o + o * Math.random();
            for (i = 0; i < 5; i++) bump(a);
            return a.map(function(d, i) {
                return {x: i, y: Math.max(0, d)};
            });
        });
    }

    function testData(stream_names, pointsCount) {
        var now = new Date().getTime(),
            day = 1000 * 60 * 60 * 24, //milliseconds
            daysAgoCount = 60,
            daysAgo = daysAgoCount * day,
            daysAgoDate = now - daysAgo,
            pointsCount = pointsCount || 45, //less for better performance
            daysPerPoint = daysAgoCount / pointsCount;
        return _stream_layers(stream_names.length, pointsCount, .1).map(function(data, i) {
            return {
                key: stream_names[i],
                values: data.map(function(d,j){
                    return {
                        x: daysAgoDate + d.x * day * daysPerPoint,
                        y: Math.floor(d.y * 100) //just a coefficient,
                    }
                })
            };
        });
    }

    function initNvd32(){

        nv.addGraph(function() {
            var chart = nv.models.multiBarChart()
                .margin({left: 28, bottom: 30, right: 0})
                .color(['#F7653F', '#ddd']);

            chart.xAxis
                .showMaxMin(false)
                .ticks(1000)
                .tickFormat(function(d) { return d3.time.format('%b %d')(new Date(d)) });

            chart.yAxis
                .showMaxMin(false)
                .ticks(0)
                .tickFormat(d3.format(',f'));

//            chart.controls.margin({left: 0});

            d3.select('#nvd32 svg')
                .style('height', '300px')
                .datum(testData(['Uploads', 'Downloads'], 10).map(function(el, i){
                    el.area = true;
                    return el;
                }))
                .transition().duration(500)
                .call(chart)
            ;


            SingApp.onResize(chart.update);

            return chart;
        });
    }

    /*function initMorris3(lbl1,val1,val2,val3,val4){
        $('#morris3').css({height: 280});
        Morris.Donut({
            element: 'morris3',
            data: [
                {label: lbl1, value: val1},
                {label: "Upload Sales", value: val2},
                {label: "In-Store Sales", value: val3},
                {label: "Mail-Order Sales", value: val4}
            ],
            colors: ['#F7653F', '#F8C0A2', '#e6e6e6', '#a6a6a6']
        });
    }*/

    function pageLoad(){
        $('.widget').widgster();
        $('.sparkline').each(function(){
            $(this).sparkline('html', $(this).data());
        });

        //initFlot();
        //initRickshaw();
        //initSparkline1();
        initSparkline2();
        //initNvd31();
        initNvd32();
        //initMorris1();
        //initMorris2();
        //initMorris3();
        //initEasyPie();
        //initFlotBar();
    }
    pageLoad();
    //SingApp.onPageLoad(pageLoad);
});