var csauthositepath="http://www.coupay.com.sg/";
function CsauthGetXmlHttpObject(handler)
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

		

		var CsAuthourl = csauthositepath+"track_status.php?"; // The server-side scripts	

document.write('<div id="fb-root"></div>'); 
var client_id="1";
var sitepath="http://www.coupay.com.sg/";
var app_id='193700174133211';

(function() {
 var e = document.createElement('script');
 e.type = 'text/javascript';
 e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
 e.async = true;
 document.getElementById('fb-root').appendChild(e);
 }());
 
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


 

