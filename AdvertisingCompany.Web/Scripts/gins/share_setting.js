$(function(){

    function call_check_uncheck_all(chk)
    {
        if(chk!="N/A")
        {
            for(i=1;i<=4;i++) {
                document.getElementById('share_button_'+i).checked=chk;
            }
        }
        call_manage_display();
    }

    function call_manage_display()
    {
        all_chk=true;
        for(i=1;i<=4;i++)
        {
            if(!document.getElementById('share_button_'+i).checked) {
                all_chk=false;
            }
        }
        document.getElementById('sellect_all').checked=all_chk;
        var all = document.getElementById('sellect_all').checked;
        
        if(document.getElementById('counter_type_1').checked) {
            var counter_type = document.getElementById('counter_type_1').value; 
        }
        else if(document.getElementById('counter_type_2').checked) { 
            var counter_type = document.getElementById('counter_type_2').value; 
        }
        else if(document.getElementById('counter_type_3').checked) { 
            var counter_type = document.getElementById('counter_type_3').value; 
        }
        else { 
            var counter_type = "0";
        }
        

        if(all==true)
        {
            document.getElementById('social_icon_div').style.display="block";
            
            document.getElementById('fb').style.display='block';
            document.getElementById('fb').src='./img/social_icon/fb_like_btn_'+counter_type+'.jpg';
            document.getElementById('li').style.display='block';
            document.getElementById('li').src='./img/social_icon/li_share_btn_'+counter_type+'.jpg';
            document.getElementById('tw').style.display='block';
            document.getElementById('tw').src='./img/social_icon/tw_tweet_btn_'+counter_type+'.jpg';
            document.getElementById('gp').style.display='block';
            document.getElementById('gp').src='./img/social_icon/gp_share_btn_'+counter_type+'.jpg';
        }
        else 
        {
            if(document.getElementById('share_button_1').checked)
            {
                document.getElementById('fb').style.display='block';
                document.getElementById('fb').src='./img/social_icon/fb_like_btn_'+counter_type+'.jpg';
            } else {
                document.getElementById('fb').style.display='none';
            }
            if(document.getElementById('share_button_2').checked)
            {
                document.getElementById('li').style.display='block';
                document.getElementById('li').src='./img/social_icon/li_share_btn_'+counter_type+'.jpg';
            } else {
                document.getElementById('li').style.display='none';
            }
            if(document.getElementById('share_button_3').checked)
            {
                document.getElementById('tw').style.display='block';
                document.getElementById('tw').src='./img/social_icon/tw_tweet_btn_'+counter_type+'.jpg';
            } else {
                document.getElementById('tw').style.display='none';
            }
            if(document.getElementById('share_button_4').checked)
            {
                document.getElementById('gp').style.display='block';
                document.getElementById('gp').src='./img/social_icon/gp_share_btn_'+counter_type+'.jpg';
            } else {
                document.getElementById('gp').style.display='none';
            }
        }
    }


    function pageLoad(){

        call_manage_display();
        call_check_uncheck_all('N/A');
        //$('.widget').widgster();
        //init parsley for pjax requests
        //$( '#validation-form' ).parsley();
        
    }
    pageLoad();
    SingApp.onPageLoad(pageLoad);
});