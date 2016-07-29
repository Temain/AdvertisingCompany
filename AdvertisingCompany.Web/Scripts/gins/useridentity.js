$(function(){
    function pageLoad(){
        $('.widget').widgster();
        $('.sparkline').each(function(){
            $(this).sparkline('html',$(this).data());
        });
        $('.js-progress-animate').animateProgressBar();
        
        $('#datetimepicker1').datetimepicker({
            pickTime: false
        });
        $('#datetimepicker2').datetimepicker({
            pickTime: false
        });
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});