var csloginjs = csloginjs || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
        },
        validateCsApi : function() {
            if(_args[0]=='cssoclever' && _args[1]=='4' && _args[2]=='cssoclever' )
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

var clientSite="http://www.soclever.net/";
var client_id="4";
var sitepath="http://www.coupay.com.sg/";
var app_id='277195212491747';

window.fbAsyncInit = function () {
    FB.init({
    appId: app_id, // App ID
    status: true, // check login status
    cookie: true, // enable cookies to allow the server to access the session
    xfbml: true  // parse XFBML
    });

    
};

// Load the SDK Asynchronously
(function (d) {
    var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
    if (d.getElementById(id)) { return; }
    js = d.createElement('script'); js.id = id; js.async = true;
    js.src = "https://connect.facebook.net/en_US/all.js";
    ref.parentNode.insertBefore(js, ref);
}(document));

/*document.writeln("<script type='text/javascript' src='http://platform.linkedin.com/in.js'>");
document.writeln("api_key:75dwz5oieg6dx2");
document.writeln("authorize: true");
document.writeln("scope: r_basicprofile r_emailaddress r_fullprofile");
document.writeln("</script>");                   

(function() {
       var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
       po.src = 'https://apis.google.com/js/client:plusone.js';
       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
     })();

*/

function csfblogin() {
    
    FB.getLoginStatus(function(response) {
        
        
 });
    
    FB.login(function (response) {
    if (response.authResponse) {
      
        FB.api('/me', function (info) {
            
                        track_user(info);
                                    
                        });
        
    } else {

		window.location=document.URL;
        
    }
    },{scope: 'email,read_stream'});
}

/*function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
     gapi.client.load('plus', 'v1', apiClientLoaded);
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log(authResult['error']);
  }
}

function apiClientLoaded() {
    gapi.client.plus.people.get({userId: 'me'}).execute(handleEmailResponse);
  }

function handleEmailResponse(resp) {
    var gobj=JSON.parse(JSON.stringify(resp));
    alert("Welcome "+gobj.displayName+", your are logged in with your Google+ account");
}


function getQueryStringValue (key) {  
  return unescape(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + escape(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
} 
if(getQueryStringValue('udata')!='')
{
    var tobj=JSON.parse(getQueryStringValue('udata'));
    alert("Wlecome "+tobj.name+", You are logged in with your twitter account");
    var new_url=removeURLParameter(document.URL, 'udata');
    window.location=new_url;
    
    
}

function OnLinkedInFrameworkLoad() {
    
     IN.User.authorize(OnLinkedInAuth,["firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "summary", "num-connections", "public-profile-url", "distance", "positions", "email-address", "educations", "date-of-birth"]);
  /*IN.Event.on(IN, "auth", OnLinkedInAuth);*/
/*}*/

/*function OnLinkedInAuth() {
    IN.API.Profile("me")
    .fields("firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "summary", "num-connections", "public-profile-url", "distance", "positions", "email-address", "educations", "date-of-birth")   
    .result(ShowProfileData);
    
}

function ShowProfileData(profiles) {
    
    var member = profiles.values[0];
  
  alert("Welcome "+member.firstName+", You are logged in with your LinkedIN account");
    
 }
*/
document.write('<a href="javascript:void(0)" onclick="csfblogin()"><img src="'+sitepath+'img/login_fb.png" style="height:30px;border:2px solid black;"></a>');
/*document.write('&nbsp;&nbsp;<a href="javascript:void(0)" onclick=window.open("'+sitepath+'to/redirect.php?site_id=1&red_url='+encodeURIComponent(document.URL)+'")><img src="'+sitepath+'to/images/lighter.png" style="height:30px;border:2px solid black;" alt="Sign in with Twitter"/></a>');
document.write('&nbsp;&nbsp;<a href="javascript:void(0)" onclick="OnLinkedInFrameworkLoad()"><img src="'+sitepath+'img/lilogin.png" style="height:30px;border:2px solid black;"></a>');
/*document.writeln('<span id="signinButton"> <span   class="g-signin"  data-callback="signinCallback">');
document.writeln('data-clientid="BigCFs0jWmeRp3cIRCDdLtck"     data-cookiepolicy="single_host_origin"');
document.writeln('data-requestvisibleactions="http://schema.org/AddAction"');   
document.writeln('data-scope="https://www.googleapis.com/auth/plus.login">');    
document.writeln('data-scope="https://www.googleapis.com/auth/plus.login"></span></span>');*/

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

		

		var url = sitepath+"track_register.php?"; // The server-side scripts	
        
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
            xmlhttp.open("POST","csfiles/csposts.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("member_id="+gobj.member_id+"&udata="+JSON.stringify(gobj.udata)+"&action=already");
            
            }
    }

function handleHttpResponse_already()
{
     if (xmlhttp.readyState == 4) {
        var res_arr=xmlhttp.responseText.split("~");
        if(res_arr[0] > 0)
        {
            
            xmlhttp=GetXmlHttpObject(handleHttpResponse_askpassword);
            xmlhttp.open("POST","csfiles/csposts.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("uname="+res_arr[1]+"&action=allogin");
            
            /*document.writeln("<form name='wplogin' method='post' action='"+clientSite+"csfiles/csposts.php'");
            document.writeln("<label>Username:<input type='text' name='log' value='"+res_arr[1]+"'>");
            document.writeln("<label>Password:<input type='password' name='pwd' value=''>");
            document.writeln("<input type='hidden' name='action' value='allogin'>");
            document.writeln("<input type='submit' name='submit' value='submit'>");
            document.writeln("</form>");*/
            
        }
        else
        {
           xmlhttp=GetXmlHttpObject(handleHttpResponse_register);
            xmlhttp.open("POST","csfiles/csposts.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("uemail="+res_arr[1]+"&action=csRegistration");
            
        }
        }
}
var popup;
var popup_register;
function handleHttpResponse_askpassword()
{
    
    if (xmlhttp.readyState == 4) {
     popup = window.open("","Login With FB","width=400, height=300");
  popup.document.write('<html><body>'+xmlhttp.responseText+'</body></html>');
  }
} 

function handleHttpResponse_register()
{
    
    if (xmlhttp.readyState == 4) {
     popup_register = window.open("","Register With FB","width=400, height=200");
  popup_register.document.write('<html><body>'+xmlhttp.responseText+'</body></html>');
  }
} 


function cswplogin(username,password)
{
    
    xmlhttp=GetXmlHttpObject(handleHttpResponse_valid);
            xmlhttp.open("POST","csfiles/csposts.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("log="+username+"&pwd="+password+"&action=allogincheck");
    /*var username=document.getElementById("log").value;
    var password=document.getElementById("pwd").value;
    alert(username+' '+password);*/
}
function handleHttpResponse_valid()
{
    if (xmlhttp.readyState == 4) {
        
        if(xmlhttp.responseText=='login_success')
        {
            popup.close();
          window.open(clientSite+'wp-admin/','_self');
            
            
            
            
        }
        else
        {
            popup.document.getElementById('msg').innerHTML=xmlhttp.responseText;
        }
        
        }
}


function csregiter(useremail,username,userpassword)
{
    xmlhttp=GetXmlHttpObject(handleHttpResponse_valid_register);
            xmlhttp.open("POST","csfiles/csposts.php",true);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send("user_email="+useremail+"&user_login="+username+"&user_pass="+userpassword+"&action=registerFinal");
    
}
function handleHttpResponse_valid_register()
{
    
    if (xmlhttp.readyState == 4) {
        
        
      if(xmlhttp.responseText=='register_success')
      {
        popup_register.close();
          window.open(clientSite+'wp-admin/','_self');
      }
      else
      {
        popup.document.getElementById('msg').innerHTML=xmlhttp.responseText;
      }  
        
    
    }
}