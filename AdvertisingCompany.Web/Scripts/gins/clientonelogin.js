var csloginjs = csloginjs || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
        },
        validateCsApi : function() {
            if(_args[0]=='dilipCoupayIndia' && _args[1]=='1' && _args[2]=='CoupayIndia123' )
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


var client_id="1";
var sitepath="http://www.coupay.com.sg/";
var app_id='532241270201105';

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

document.writeln("<script type='text/javascript' src='http://platform.linkedin.com/in.js'>");
document.writeln("api_key:75dwz5oieg6dx2");
document.writeln("authorize: true");
document.writeln("scope: r_basicprofile r_emailaddress r_fullprofile");
document.writeln("</script>");                   

(function() {
       var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
       po.src = 'https://apis.google.com/js/client:plusone.js';
       var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
     })();



function csfblogin() {
    
    FB.getLoginStatus(function(response) {
        
        
 });
    
    FB.login(function (response) {
    if (response.authResponse) {
      
        FB.api('/me', function (info) {
            
                        alert("Welcome "+info.first_name+", you are logged in using your facebook account.");
                                    
                        });
        
    } else {

		window.location=document.URL;
        
    }
    },{scope: 'email,read_stream'});
}

function signinCallback(authResult) {
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
}

function OnLinkedInAuth() {
    IN.API.Profile("me")
    .fields("firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "summary", "num-connections", "public-profile-url", "distance", "positions", "email-address", "educations", "date-of-birth")   
    .result(ShowProfileData);
    
}

function ShowProfileData(profiles) {
    
    var member = profiles.values[0];
  
  alert("Welcome "+member.firstName+", You are logged in with your LinkedIN account");
    
 }

document.write('<a href="javascript:void(0)" onclick="csfblogin()"><img src="'+sitepath+'img/login_fb.png" style="height:30px;border:2px solid black;"></a>');
document.write('&nbsp;&nbsp;<a href="javascript:void(0)" onclick=window.open("'+sitepath+'to/redirect.php?site_id=1&red_url='+encodeURIComponent(document.URL)+'")><img src="'+sitepath+'to/images/lighter.png" style="height:30px;border:2px solid black;" alt="Sign in with Twitter"/></a>');
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
