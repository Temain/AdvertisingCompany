var client_id="1";
var sitepath="http://www.coupay.com/";
var app_id='532241270201105';
var u_no=Math.random();
window.fbAsyncInit = function () {
    FB.init({
    appId: app_id, // App ID
    status: true, // check login status
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true  // parse XFBML
    });
    
};


        

(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "https://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));


function addParameterToURL(param){
    _url = document.URL;
    _url += (_url.split('?')[1] ? '&':'?') + param;
    return _url;
}



/*var share_test = function(url_base,title) {
	var title = encodeURIComponent(title);
	var url = encodeURIComponent(url_base);
	window.open('http://www.facebook.com/sharer.php?u='+url+'&t='+title, 'sharer', 'toolbar=0,status=0,width=626,height=436');
};
*/


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

		

		var url = sitepath+"track_status.php?"; // The server-side scripts	



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

function track_ref(cvar,reg_user)
{
    
    xmlHttp_149=GetXmlHttpObject(handleHttpResponse_reg);

				xmlHttp_149.open("GET",url + "ref_by="+encodeURIComponent(cvar)+"&app_id="+app_id+"&reg_user="+encodeURIComponent(reg_user)+'&siteid='+client_id);				

				xmlHttp_149.send(null);
}

function handleHttpResponse_reg()
{
    if (xmlHttp_149.readyState == 4) {
        alert("Referral is tracked");
    }    
}


function trac_share_click(uid,click_url,shared_by,clicked_by)
{
    
    
    xmlHttp_149=GetXmlHttpObject(handleHttpResponse_dilip);

				xmlHttp_149.open("GET",url + "url="+encodeURIComponent(click_url)+"&app_id="+app_id+"&uid="+uid+"&sb="+shared_by+"&cb="+clicked_by+'&siteid='+client_id);				

				xmlHttp_149.send(null);
}
function handleHttpResponse_dilip()
{
    if (xmlHttp_149.readyState == 4) {
        alert("Clcik is tracked");
    }    
}

			function track_url(click_url,uid,email,name,site_id) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse);

				xmlHttp.open("GET",url + "clickurl="+encodeURIComponent(click_url)+"&app_id="+app_id+"&uid="+uid+"&uname="+name+"&email="+email+'&siteid='+site_id);				

				xmlHttp.send(null);

		}

document.write("<a href='javascript:void(0)'><img src='"+sitepath+"images/site/shear_fb_icon_h.png' onclick='login(1);'></a>");

		function handleHttpResponse() {

    if (xmlHttp.readyState == 4) {
        alert("Thanks for sharing.");
        }

    /*FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    alert(response.authResponse.userID);
    
            FB.ui({
  method: 'share',
  href: document.URL,
}, function(response)
{
    
  if (response && !response.error_code) {
    
    alert(response);
    
    }
});

}*/

/*FB.ui({
  method: 'share',
  href: document.URL,
}, function(response)
{
    
  if (response && !response.error_code) {
    
    FB.api('/me', function (info) {
        alert("shared by"+info.first_name+"  "+info.id);
                                    
                        });

    
    }

    });*/

//share_test(document.URL,'Sharing Test for Coupay.com');

		}	
        
        
        
        function login(type) {
    
    FB.getLoginStatus(function(response) {
        
        
 });
    
    FB.login(function (response) {
    if (response.authResponse) {
      if(type=='1')
      {
        FB.api('/v2.0/me?fields=link,id,first_name,last_name,name,birthday,gender,location,email,hometown,locale,timezone,friends,likes', function (info) {
    track_url_new(info);     
       
                        });
        }
        else
        {
             
        }                
        /*FBUserId = response.authResponse.userID;
        FBAccessToken = response.authResponse.accessToken;        
        alert("UserId: " + response.authResponse.user);
                alert("Access Token: " + FBAccessToken);*/
    } else {

		
        
    }
    },{scope: 'email,publish_stream,user_birthday,user_hometown,user_interests,user_location,user_likes,user_friends'});
}
	
    function track_url_new(info) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse_sub);
                
                
                var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                
                var uid=info.id;
                
				xmlHttp.open("GET",url+'app_id='+app_id+'&siteid='+client_id+'&other='+encodeURIComponent(JSON.stringify(info)));				

				xmlHttp.send(null);

		}



		function handleHttpResponse_sub() {
		  
          if (xmlHttp.readyState == 4) {

				
                 FB.api('/v2.0/me', function (info) {
                    
                    
                   FB.ui({
                      method: 'share',
                      href:addParameterToURL("csid="+info.email+'&client_id='+client_id),
                        }, function(response)
                        {
    
                        if (response && !response.error_code) {
    
                        var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                        track_url(document.URL,info.id,info.email,uname,client_id);
    
                    }
                     });
     
       
                        });

			  }
              
		  
            /*FB.ui({
  method: 'share',
  href:addParameterToURL("csid="+info.id),
}, function(response)
{
    
  if (response && !response.error_code) {
    
    
    
    
    }
     });*/

    
  }  
  
  
  
  function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
}  

// Would write the value of the QueryString-variable called name to the console  
 
if(getQueryStringValue("csid")!='')
{
    createCookie('csid',getQueryStringValue('csid'),'30');
   setTimeout(function(){ 
    
    FB.getLoginStatus(function(response) {
                if(response.authResponse)
                {
                FB.api('/v2.0/me', function (info) {
                    var url=removeURLParameter(document.URL,'csid');
                    var myurl=removeURLParameter(url,'client_id');
                    var myurl2=removeURLParameter(myurl,'fb_action_ids');
                    var myurl3=removeURLParameter(myurl2,'fb_action_types');
                    var shared_by=getQueryStringValue('csid'); 
                    
                trac_share_click(info.id,myurl3,shared_by,info.email);
                });
                }
              });   },2000);   
}

if(readCookie('csid'))
{
   
   setTimeout(function(){ 
    
    FB.getLoginStatus(function(response) {
                if(response.authResponse)
                {
                FB.api('/v2.0/me', function (info) {
                     track_ref(readCookie('csid'),info.email);
                });
                }
              });   },2000);   
   
    
}

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        
        var c = ca[i];
       
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}