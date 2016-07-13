var sitepath="http://www.coupay.com.sg/";
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
        
        var csloginjs = csloginjs || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;
            // some other initialising
        },
        validateCsApi : function() {
            if(_args[0]=='m6NGeEub36' && _args[1]=='5' && _args[2]=='bcY4JJaoUl' &&  _args[3]=='coupay.com' )
            {
              
              document.write('<div id="fb-root"></div>'); 
var client_id="1";

var app_id='532241270201105';

window.fbAsyncInit = function() {
 FB.init({appId: '532241270201105', status: true, cookie: true, xfbml: true});
 FB.Event.subscribe('edge.create', function(href, widget) {
 
 var url_share=removeURLParameter(document.URL,'csid');
        var myurl_share=removeURLParameter(url_share,'site_id');
        var myurl_share2=removeURLParameter(myurl_share,'is_fb');
        var myurl2_share=removeURLParameter(myurl_share2,'is_li');
        var myurl3_share=removeURLParameter(myurl_share2,'is_tw');
        if(myurl3_share.slice(-1)=='?')
        {
            var final_url=myurl2_share.slice(-1);
        }
        else
        {
            var final_url=myurl3_share;
        }
        
           track_like_unlike(final_url,'1'); 
 
 });
 
 FB.Event.subscribe('edge.remove', function(href, widget) {
 
 var url_share=removeURLParameter(document.URL,'csid');
        var myurl_share=removeURLParameter(url_share,'site_id');
        var myurl_share2=removeURLParameter(myurl_share,'is_fb');
        var myurl2_share=removeURLParameter(myurl_share2,'is_li');
        var myurl3_share=removeURLParameter(myurl_share2,'is_tw');
        if(myurl3_share.slice(-1)=='?')
        {
            var final_url=myurl2_share.slice(-1);
        }
        else
        {
            var final_url=myurl3_share;
        }
        
           track_like_unlike(final_url,'0');
           
 });

};

(function() {
 var e = document.createElement('script');
 e.type = 'text/javascript';
 e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
 e.async = true;
 document.getElementById('fb-root').appendChild(e);
 }());
 
document.writeln('<script src="https://platform.twitter.com/widgets.js" type="text/javascript">');
document.writeln('</script>');                   

document.writeln('<script src="http://platform.linkedin.com/in.js" type="text/javascript"></script>');

document.writeln('<script src="https://apis.google.com/js/platform.js" async defer></script>');    


function cslisharesuccess()
{
 var url_share=removeURLParameter(document.URL,'csid');
        var myurl_share=removeURLParameter(url_share,'site_id');
        var myurl_share2=removeURLParameter(myurl_share,'is_fb');
        var myurl2_share=removeURLParameter(myurl_share2,'is_li');
        var myurl3_share=removeURLParameter(myurl_share2,'is_tw');
        if(myurl3_share.slice(-1)=='?')
        {
            var final_url=myurl2_share.slice(-1);
        }
        else
        {
            var final_url=myurl3_share;
        }
        
           track_like_unlike(final_url,'3'); 
    
}
function cslishareerror()
{
    alert('li share error');
}

setTimeout(function() {

twttr.ready(function (twttr) { twttr.events.bind('tweet', function (event) 
                                {
                                   var url_share=removeURLParameter(document.URL,'csid');
        var myurl_share=removeURLParameter(url_share,'site_id');
        var myurl_share2=removeURLParameter(myurl_share,'is_fb');
        var myurl2_share=removeURLParameter(myurl_share2,'is_li');
        var myurl3_share=removeURLParameter(myurl_share2,'is_tw');
        if(myurl3_share.slice(-1)=='?')
        {
            var final_url=myurl2_share.slice(-1);
        }
        else
        {
            var final_url=myurl3_share;
        }
        
           track_like_unlike(final_url,'2'); 
 
                                    
                                    });
               }); },1000);

function addParameterToURLnew(new_url,param){
    _url = new_url;
    _url += (_url.split('?')[1] ? '&':'?') + param;
    return _url;
}


function addParameterToURL(param){
    _url = document.URL;
    _url += (_url.split('?')[1] ? '&':'?') + param;
    return _url;
}







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

function track_like_unlike(like_url,like_unlike)
{
    
    xmlHttp_149=GetXmlHttpObject(handleHttpResponse_like_unlike);

	xmlHttp_149.open("GET",url + "like_url="+encodeURIComponent(like_url)+'&site_id='+client_id+'&is_like='+like_unlike);				

	xmlHttp_149.send(null);
}

function handleHttpResponse_like_unlike()
{
    if (xmlHttp_149.readyState == 4) {
        alert(xmlHttp_149.responseText);
       
    }    
}

 function csGpshare(plusone)
  {

    if(plusone.type=='confirm')
	{
	   track_like_unlike(document.URL,'4');
       
	}

}


document.write('<div id="csshareicons" style="width:auto;float:left;" ><div style="width:auto;float:left;" id="cslike" class="fb-like" data-href="'+document.URL+'" data-send="false" data-layout="button_count" data-width="50" data-show-faces="false"></div>');
document.write('&nbsp;&nbsp;&nbsp;<div id="tw" style="width:84px;float:left;margin-left:10px;"><a href="'+document.URL+'" class="twitter-share-button"  data-lang="en">Tweet</a></div>&nbsp;&nbsp;&nbsp;');
document.write('<div id="li" style="width:auto;float:left;"><script type="IN/Share" data-counter="right"   data-onSuccess="cslisharesuccess"   data-onError="cslishareerror"  ></script></div>');
document.write('<div id="gp" style="width:40px;float:left;margin-left:4px;"><g:plusone onendinteraction="csGpshare"></g:plusone></div>');
document.write('</div>');
  
                
            }
            else
            {
                alert("Authentication fail.");
                return;
            }
        }
    };
}());
        



