$(function(){


    function initAnimations(){
        $('#geo-locations-number, #percent-1, #percent-2, #percent-3').each(function(){
            $(this).animateNumber({
                number: $(this).text().replace(/ /gi, ''),
                numberStep: $.animateNumber.numberStepFactories.separator(' '),
                easing: 'easeInQuad'
            }, 1000);   
        });

        $('.js-progress-animate').animateProgressBar();
    }

    function pjaxPageLoad(){
        $('.widget').widgster();
        //initMap();
        //initCalendar();
        //initRickshaw();
        initAnimations();
    }
    
    pjaxPageLoad();
    SingApp.onPageLoad(pjaxPageLoad);

});