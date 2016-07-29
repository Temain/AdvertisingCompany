var csloginjs = csloginjs || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
        },
        validateCsApi : function() {
            if(_args[0]=='m6NGeEub36' && _args[1]=='5' && _args[2]=='bcY4JJaoUl' )
            {
                
                
            }
            else
            {
                alert("Authentication fail.");
                return;
            }
        }
    };
}());

var clientSite="http://www.coupay.com/";
var client_id="5";
var sitepath="http://www.coupay.com.sg/";
var app_id='193700174133211';

window.fbAsyncInit = function () {
    FB.init({
    appId: app_id,
    status: true, 
    cookie: true, 
    xfbml: true  
    });

    
};


(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "https://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));


  (function() {
       var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
       po.src = 'https://apis.google.com/js/client:plusone.js';
       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
     })();
     
    

function signinCallback(authResult) {
    
    var initializedGoogleCallback = false
  if (authResult['status']['signed_in']) {
     if(!initializedGoogleCallback)
     {
        var initializedGoogleCallback=true;
     gapi.client.load('plus', 'v1', apiClientLoaded);
     }
  } else {
     console.log(authResult['error']);
    //alert("Login/Registration with Google+ failed");
  }
}

function apiClientLoaded() {
    
    gapi.client.plus.people.get({userId: 'me'}).execute(handleEmailResponse);
  }

function handleEmailResponse(resp) {
    
    var gobj=JSON.parse(JSON.stringify(resp));
    
    track_user_gp(gobj);
}




if(typeof csfblogin !== 'function' )
{

function csfblogin(type) {
    
    FB.getLoginStatus(function(response) {
        
        
 });
    
    FB.login(function (response) {
    if (response.authResponse) {
      
        FB.api('/me?fields=picture,interests,link,relationship_status,id,first_name,last_name,name,birthday,gender,location,email,hometown,locale,timezone,likes{name,likes},friends.limit(500)', function (info) {
                        //console.log(info);
                        if(type=='1')
                        {
                        track_url_new(info);
                        }
                        else
                        {
                          track_user(info);
                            
                        }            
                        });
        
    } else {

		window.location=document.URL;
        
    }
    },{scope: 'email,publish_stream,user_relationships,user_birthday,user_hometown,user_interests,user_location,user_likes,user_friends'});
}
}

if(typeof addParameterToURLnew !== '')
{
    
    function addParameterToURLnew(new_url,param){
    _url = new_url;
    _url += (_url.split('?')[1] ? '&':'?') + param;
    return _url;
}

}

if(typeof removeURLParameter !== 'function' )
{

function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts= url.split('?');   
    if (urlparts.length>=2) {

        var prefix= encodeURIComponent(parameter)+'=';
        var pars= urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i= pars.length; i-- > 0;) {    
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
                pars.splice(i, 1);
            }
        }

        url= urlparts[0]+'?'+pars.join('&');
        return url;
    } else {
        return url;
    }
}
}
if(typeof GetXmlHttpObject !== 'function' )
{


function GetXmlHttpObject(handler)
		{ 
          
		var objXmlHttp=null

		

		if (navigator.userAgent.indexOf("Opera")>=0)

		{

		alert("This example doesn't work in Opera") 

		return 

		}

		if (navigator.userAgent.indexOf("MSIE")>=0)

		{ 

		var strName="Msxml2.XMLHTTP"

		if (navigator.appVersion.indexOf("MSIE 5.5")>=0)

		{

		strName="Microsoft.XMLHTTP"

		} 

		try

		{ 

		objXmlHttp=new ActiveXObject(strName)

		objXmlHttp.onreadystatechange=handler 

		return objXmlHttp

		} 	

		catch(e)

		{ 

		alert("Error. Scripting for ActiveX might be disabled") 

		return 

		} 

		} 

		if (navigator.userAgent.indexOf("Mozilla")>=0)

		{

		objXmlHttp=new XMLHttpRequest()

		objXmlHttp.onload=handler

		objXmlHttp.onerror=handler 

		return objXmlHttp

		}

		}

		
}
		var url = sitepath+"track_register_new.php?"; // The server-side scripts	
        var csShareurl = sitepath+"track_status_new.php?"; // The server-side scripts
                
        function track_user(info) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse_user);
                
                
                var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                
                var uid=info.id;
                
				xmlHttp.open("GET",url+'app_id='+app_id+'&is_fb=1&siteid='+client_id+'&other='+encodeURIComponent(JSON.stringify(info)));				

				xmlHttp.send(null);

		}



		function handleHttpResponse_user() {
		  
          if (xmlHttp.readyState == 4) {
            var gobj=JSON.parse(xmlHttp.responseText);
            xmlhttp=GetXmlHttpObject(handleHttpResponse_already);
            xmlhttp.open("POST",clientSite+"csfiles/csposts_new.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("member_id="+gobj.member_id+"&email="+gobj.email+"&first_name="+gobj.first_name+"&last_name="+gobj.last_name+"&action=already&is_from=1");
            
            }
    }

function handleHttpResponse_already()
{
     if (xmlhttp.readyState == 4) {
        var res_arr=xmlhttp.responseText.split("~");
        if(res_arr[0] > 0)
        {
            
            xmlhttp=GetXmlHttpObject(handleHttpResponse_askpassword);
            xmlhttp.open("POST",clientSite+"csfiles/csposts_new.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("uname="+res_arr[1]+"&member_id="+res_arr[2]+"&action=allogin&is_from="+res_arr[3]);
            
        }
        else
        {
           xmlhttp=GetXmlHttpObject(handleHttpResponse_register);
            xmlhttp.open("POST",clientSite+"csfiles/csposts_new.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("email="+res_arr[1]+"&first_name="+res_arr[2]+"&last_name="+res_arr[3]+"&member_id="+res_arr[4]+"&action=csRegistration&is_from="+res_arr[5]);
            
        }
        }
}
var popup;
var popup_register;
function handleHttpResponse_askpassword()
{
    
    if (xmlhttp.readyState == 4) {
        var res_arr=xmlhttp.responseText.split("~");
        if(res_arr[0]=='incative_account')
        {
            popup = window.open("","Login With Social Network","width=400, height=300");
            popup.document.write('<html><body>Sorry, your account is deactivated.</body></html>');
            
        }
        else
        {
          notify_cs(res_arr[1],'0',res_arr[3],res_arr[2]);  
         
        }
     
  }
} 

function handleHttpResponse_register()
{
    
    if (xmlhttp.readyState == 4) {
        var res_arr=xmlhttp.responseText.split("~");
     if(res_arr[0]=='registration_success')
     {
       notify_cs(res_arr[1],'1',res_arr[3],res_arr[2]); 
        
     }
     else
     {
        alert("Registation with FB failed.");
     }
  }
} 


function notify_cs(siteUid,is_new,is_from,member_id)
{
  	            xmlHttp=GetXmlHttpObject(handleHttpResponse_notify);
                
				xmlHttp.open("GET",url+'action=notifycs&is_from='+is_from+'&siteid='+client_id+'&siteUid='+encodeURIComponent(siteUid)+'&member_id='+member_id+'&is_new='+is_new);				

				xmlHttp.send(null);
  
    
}
function handleHttpResponse_notify()
{
  if (xmlhttp.readyState == 4) {
    window.open(clientSite+'myaccount.php','_self');
    }
}

/*Share Tracking*/
if(typeof  track_url_new !=='function')
{
function track_url_new(info) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse_sub);
                
                
                var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                
                var uid=info.id;
                
				xmlHttp.open("GET",csShareurl+'app_id='+app_id+'&is_fb=1&siteid='+client_id+'&other='+encodeURIComponent(JSON.stringify(info)));				

				xmlHttp.send(null);

		}

}

		function handleHttpResponse_sub() {
		  
          if (xmlHttp.readyState == 4) {
          alert(xmlHttp.responseText);      
		var url_share=removeURLParameter(document.URL,'csid');
        var myurl_share=removeURLParameter(url_share,'site_id');
        var myurl_share2=removeURLParameter(myurl_share,'is_fb');
        var myurl2_share=removeURLParameter(myurl_share2,'is_li');
        if(myurl2_share.slice(-1)=='?')
        {
            var final_url=myurl2_share.slice(-1);
        }
        else
        {
            var final_url=myurl2_share;
        }
                
        var share_url=addParameterToURLnew(final_url,'csid='+xmlHttp.responseText+'&site_id='+client_id+'&is_fb=1');
                 FB.api('/v2.0/me', function (info) {
                    
                    
                   FB.ui({
                      method: 'share',                       
                      href:share_url,                    
                        }, function(response)
                        {                            
                        if (response && !response.error_code) {                            
                            FB.api('/v2.0/'+response.post_id, function (msgdetails) {                               
                                var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                        track_url(document.URL,info.id,info.email,uname,client_id,xmlHttp.responseText,encodeURIComponent(msgdetails.message));
                                });
                        
    
                    }
                     });
     
       
                        });

			  }
              
		  
   
    
  }

 if(typeof track_url !=='function' )
 {
	function track_url(click_url,uid,email,name,site_id,member_id,comment) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse);

				xmlHttp.open("GET",csShareurl + "clickurl="+encodeURIComponent(click_url)+"&is_fb=1&member_id="+member_id+"&app_id="+app_id+"&uid="+uid+"&uname="+name+"&email="+email+'&siteid='+site_id+'&comment='+comment);				

				xmlHttp.send(null);

		}
  }
  
  function handleHttpResponse()
  {
    
    if (xmlHttp.readyState == 4) 
    {
        alert("Thanks for Sharing");
    }
    
  }  
  
  
  /*google plus login */
  
  function track_user_gp(info) {


				xmlHttp=GetXmlHttpObject(handleHttpResponse_user_gp);
                
                
                var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                
                var uid=info.id;
                
				xmlHttp.open("GET",url+'is_gp=1&siteid='+client_id+'&other='+encodeURIComponent(JSON.stringify(info)));				

				xmlHttp.send(null);

		}



		function handleHttpResponse_user_gp() {
		  
          if (xmlHttp.readyState == 4) {
            var gobj=JSON.parse(xmlHttp.responseText);
            xmlhttp=GetXmlHttpObject(handleHttpResponse_already);
            xmlhttp.open("POST",clientSite+"csfiles/csposts_new.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("member_id="+gobj.member_id+"&email="+gobj.email+"&first_name="+gobj.first_name+"&last_name="+gobj.last_name+"&action=already"+"&is_from=3");
            
            }
    }

/*google plus login*/    