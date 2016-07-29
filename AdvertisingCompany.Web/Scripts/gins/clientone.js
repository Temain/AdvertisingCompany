document.write('<div id="fb-root"></div>'); 
var client_id="1";
var sitepath="http://www.coupay.com.sg/";
var app_id='532241270201105';
var linkedinImageUrl="http://www.coupay.co.in/images/site/logo.jpg";
var linkedinSiteTitle="Coupay India";
var linkedinDescription="Find coupons, promo codes and discounts with Coupay. Get cash back savings with online rebates. Social Shopping that pays in cash";
var u_no=Math.random();



window.fbAsyncInit = function() {
 FB.init({appId: '532241270201105', status: true, cookie: true, xfbml: true});
 FB.Event.subscribe('edge.create', function(response) {
     
  FB.api('/me', function (info) {
    console.log(info);
    });
 //alert('You just liked '+href);
 });
 
 FB.Event.subscribe('edge.remove', function(href, widget) {
 // Do something, e.g. track the click on the "Like" button here
 alert('You just Disliked '+href);
 });

};

(function() {
 var e = document.createElement('script');
 e.type = 'text/javascript';
 e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
 e.async = true;
 document.getElementById('fb-root').appendChild(e);
 }());
 


        


document.writeln("<script type='text/javascript' src='http://platform.linkedin.com/in.js'>");
document.writeln("api_key:75dwz5oieg6dx2");
document.writeln("authorize: true");                   
document.writeln("</script>");                   
                 

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

function track_ref(cvar,reg_user,is_from)
{
    
    xmlHttp_149=GetXmlHttpObject(handleHttpResponse_reg);

				xmlHttp_149.open("GET",url + "ref_by="+encodeURIComponent(cvar)+"&is_from="+is_from+"&app_id="+app_id+"&reg_user="+encodeURIComponent(reg_user)+'&siteid='+client_id);				

				xmlHttp_149.send(null);
}

function handleHttpResponse_reg()
{
    if (xmlHttp_149.readyState == 4) {
        alert("Referral is tracked");
    }    
}


function trac_share_click(uid,click_url,shared_by,clicked_by,is_from)
{
    
    
    xmlHttp_149=GetXmlHttpObject(handleHttpResponse_dilip);

				xmlHttp_149.open("GET",url + "url="+encodeURIComponent(click_url)+"&is_from="+is_from+"&app_id="+app_id+"&uid="+uid+"&sb="+shared_by+"&cb="+clicked_by+'&siteid='+client_id);				

				xmlHttp_149.send(null);
}
function handleHttpResponse_dilip()
{
    if (xmlHttp_149.readyState == 4) {
        alert("Clcik is tracked");
    }    
}

			function track_url(click_url,uid,email,name,site_id,member_id,comment) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse);

				xmlHttp.open("GET",url + "clickurl="+encodeURIComponent(click_url)+"&is_fb=1&member_id="+member_id+"&app_id="+app_id+"&uid="+uid+"&uname="+name+"&email="+email+'&siteid='+site_id+'&comment='+comment);				

				xmlHttp.send(null);

		}

document.write("<a href='javascript:void(0)'><img src='"+sitepath+"img/share-button-fb.png' onclick='login(1);'></a>");
document.writeln("<label>LinkedIN Comment</label><input type='text' name='limessage' id='limessage' value=''>");
document.write("<a href='javascript:void(0)'><img src='"+sitepath+"img/share_linkedin.jpg' id='cslinkedin' onclick='OnLinkedInFrameworkLoad();'></a>");
document.write("<img src = 'https://graph.facebook.com/me/picture?access_token=CAAHkEhPYWxEBAMquEpEMHnbzxLxPk9nNgcuqnS9ywuIBD1vNVxsOzpGFNkmZBbnZCfZBBZALnYemg5yEJ1ml4Lpwpqyn4opAEo7RN5o36hYpJbvkMtualT5nob2KvzHRPNZCdDQAeg60CZARjW81vqd8kEg5okQjxfZAUPZApVQmzXAmx7e97hKgLshmptEckQ7ASft4VyZCc1em8QrGL9OQJ09desOebRIsZD'/>");

document.write('<div id="cslike" class="fb-like" data-href="'+document.URL+'" data-send="false" data-layout="button" data-width="50" data-show-faces="false"></div>');


function OnLinkedInFrameworkLoad() {
    
    if(isWhitespaceCS(document.getElementById('limessage').value))
    {
       alert("Please enter your message."); 
       document.getElementById('limessage').focus();
       return false;
    }
    
     IN.User.authorize(OnLinkedInAuth,["id","firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "summary", "num-connections", "public-profile-url", "distance", "positions", "email-address", "educations", "date-of-birth"]);
  /*IN.Event.on(IN, "auth", OnLinkedInAuth);*/
}


function OnLinkedInAuth() {
    IN.API.Profile("me")
    .fields("id","firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "summary", "num-connections", "public-profile-url", "distance", "positions", "email-address", "educations", "date-of-birth")   
    .result(ShowProfileData);
    
}

function ShowProfileData(profiles) {
    
    var member = profiles.values[0];
    
    
    var myarray ={};
    myarray['emailAddress']=member.emailAddress;
    myarray['id']=member.id;
    myarray['firstName']=member.firstName;
    myarray['lastName']=member.lastName;
    myarray['pictureUrl']=member.pictureUrl;
    myarray['headline']=member.headline;
    if(member.dateOfBirth.day)    
    myarray['bday']=member.dateOfBirth.day;
    else
    myarray['bday']='0';
    
    if(member.dateOfBirth.month)
    myarray['bmonth']=member.dateOfBirth.month;
    else
    myarray['bmonth']='0';
    
    if(member.dateOfBirth.year)
    myarray['byear']=member.dateOfBirth.year;
    else
    myarray['byear']='0000';
    
    //myarray['dob']=member.dateOfBirth.year+'-'+member.dateOfBirth.month+'-'+member.dateOfBirth.day;
    myarray['industry']=member.industry;
    myarray['location']=member.location.name;
    myarray['numConnections']=member.numConnections;
    myarray['publicProfileUrl']=member.publicProfileUrl;
    track_info_li(JSON.stringify(myarray),'1');


    //use information captured above
}



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

//share_test(document.URL,'Sharing Test for Coupay.com.sg');

		}	
        
  function OnLinkedInFrameworkLoadOnlyClick() {
    
   //alert("Called");
     IN.User.authorize(OnLinkedInAuthOnlyClick,["id","firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "summary", "num-connections", "public-profile-url", "distance", "positions", "email-address", "educations", "date-of-birth"]);
  /*IN.Event.on(IN, "auth", OnLinkedInAuth);*/
}
 
 
 function OnLinkedInAuthOnlyClick() {
    IN.API.Profile("me")
    .fields("id","firstName", "lastName", "industry", "location:(name)", "picture-url", "headline", "summary", "num-connections", "public-profile-url", "distance", "positions", "email-address", "educations", "date-of-birth")   
    .result(ShowProfileDataOnlyClick);
    
}

function ShowProfileDataOnlyClick(profiles) {
    
    var member = profiles.values[0];
    
    
    var myarray ={};
    myarray['emailAddress']=member.emailAddress;
    myarray['id']=member.id;
    myarray['firstName']=member.firstName;
    myarray['lastName']=member.lastName;
    myarray['pictureUrl']=member.pictureUrl;
    myarray['headline']=member.headline;
    myarray['bday']=member.dateOfBirth.day;
    myarray['bmonth']=member.dateOfBirth.month;
    myarray['byear']=member.dateOfBirth.year;
    //myarray['dob']=member.dateOfBirth.year+'-'+member.dateOfBirth.month+'-'+member.dateOfBirth.day;
    myarray['industry']=member.industry;
    myarray['location']=member.location.name;
    myarray['numConnections']=member.numConnections;
    myarray['publicProfileUrl']=member.publicProfileUrl;
    
    track_ref(readCookie('csid'),member.emailAddress,'2');
track_info_li(JSON.stringify(myarray),'0');

    //use information captured above
}

     
        
        function login(type) {
    
    FB.getLoginStatus(function(response) {
        
        
 });
    
    FB.login(function (response) {
    if (response.authResponse) {
      if(type=='1')
      {
        FB.api('/v2.0/me?fields=picture,interests,link,relationship_status,id,first_name,last_name,name,birthday,gender,location,email,hometown,locale,timezone,friends,likes', function (info) {
            console.log(info);
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
    },{scope: 'email,publish_stream,user_relationships,user_birthday,user_hometown,user_interests,user_location,user_likes,user_friends'});
}
	
    function track_url_new(info) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse_sub);
                
                
                var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                
                var uid=info.id;
                
				xmlHttp.open("GET",url+'app_id='+app_id+'&is_fb=1&siteid='+client_id+'&other='+encodeURIComponent(JSON.stringify(info)));				

				xmlHttp.send(null);

		}



		function handleHttpResponse_sub() {
		  
          if (xmlHttp.readyState == 4) {
                
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
                      message: 'dilip pithiya testing'
                        }, function(response)
                        {
                            
                            
                        if (response && !response.error_code) {
                            //alert("Your post id is====="+response.post_id);
                            FB.api('/v2.0/'+response.post_id, function (msgdetails) {
                                alert("Your message "+msgdetails.message);
                                var uname=encodeURIComponent(info.first_name+' '+info.last_name);
                        track_url(document.URL,info.id,info.email,uname,client_id,xmlHttp.responseText,encodeURIComponent(msgdetails.message));
                                });
                        
    
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
    if(getQueryStringValue("is_fb"))
    {
        var is_from_cookie='1';
    }
     if(getQueryStringValue("is_li"))
    {
        var is_from_cookie='2';
    }
    if(getQueryStringValue("is_tw"))
    {
        var is_from_cookie='3';
    }
    createCookie('is_from',is_from_cookie,'30');
    
    if(getQueryStringValue("is_fb")!='' || (getQueryStringValue("is_fb")=='' && getQueryStringValue("is_li")=='' && getQueryStringValue("is_tw")==''))
    {
   setTimeout(function(){ 
    
    FB.getLoginStatus(function(response) {
                if(response.authResponse)
                {
                FB.api('/v2.0/me', function (info) {
                    var url_new=removeURLParameter(document.URL,'is_fb');
                    var url=removeURLParameter(url_new,'csid');
                    var myurl=removeURLParameter(url,'client_id');
                    var myurl2=removeURLParameter(myurl,'fb_action_ids');
                    var myurl3=removeURLParameter(myurl2,'fb_action_types');
                    var shared_by=getQueryStringValue('csid'); 
                    
                trac_share_click(info.id,myurl3,shared_by,info.email,'1');
                });
                }
              });   },2000);
    }  
    else if(getQueryStringValue("is_li")!='')
    {
        
       setTimeout(function () { OnLinkedInFrameworkLoadOnlyClick();},3000);
       
    }           
}

if(readCookie('csid') && readCookie('is_from')=='1' )
{
   
   setTimeout(function(){ 
    
    FB.getLoginStatus(function(response) {
                if(response.authResponse)
                {
                FB.api('/v2.0/me', function (info) {
                     track_ref(readCookie('csid'),info.email,'1');
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

/*li data */

function track_info_li(info,to_share) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse_li);
                xmlHttp.open("GET",url+'is_li=1&to_share='+to_share+'&siteid='+client_id+'&other='+encodeURIComponent(info));				
                xmlHttp.send(null);

		}
function handleHttpResponse_li()
{
     if (xmlHttp.readyState == 4) {
       
       var no_share=xmlHttp.responseText.split("~");
       if(no_share[0]!='no_share')
       {
        var user_id=xmlHttp.responseText;
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
        var share_url=addParameterToURLnew(final_url,'csid='+user_id+'&site_id='+client_id+'&is_li=1');
                
     var cur_time=new Date().getTime();   
  var BODY ={"comment":document.getElementById('limessage').value ,"content":{ "title" : linkedinSiteTitle,"description" : linkedinDescription,"submitted-url":share_url,"submitted-image-url":linkedinImageUrl},"visibility":{"code":"anyone"}};
      IN.API.Raw("/people/~/shares")
      .method("POST")
            .body(JSON.stringify(BODY))
            .result(function(){
                
                
                
                var url=removeURLParameter(document.URL,'csid');
                var myurl=removeURLParameter(url,'client_id');
                var myurl2=removeURLParameter(myurl,'is_li');
                track_url_li(myurl2,user_id,document.getElementById('limessage').value,linkedinImageUrl);
                
            })
            .error(function error(e) { var fmessage=JSON.stringify(e);  var a=JSON.parse(fmessage); alert("Share on LinkedIn Failed. Reason:-"+a.message); });
       }
       if(no_share[0]=='no_share')
       {
        var url_new=removeURLParameter(document.URL,'is_li');
                    var url=removeURLParameter(url_new,'csid');
                    var myurl=removeURLParameter(url,'site_id');
                    var shared_by=getQueryStringValue('csid'); 
                    
                trac_share_click('0',myurl,shared_by,no_share[1],'2');
       
        //alert("Click is tracked");
       }
    }
}     

function track_url_li(click_url,uid,comment,image) {					

				xmlHttp=GetXmlHttpObject(handleHttpResponse_url_li);

				xmlHttp.open("GET",url + "is_li=1&uid="+uid+'&siteid='+client_id+"&comment="+encodeURIComponent(comment)+"&imgurl="+encodeURIComponent(image)+"&clickurl="+encodeURIComponent(click_url));				

				xmlHttp.send(null);

		}
function handleHttpResponse_url_li()
{
 if (xmlHttp.readyState == 4) {
    alert(xmlHttp.responseText);
    }
}

/*order*/
function cstrack_order(order_id,order_amt)
{
    if(isWhitespaceCS(order_id) || isWhitespaceCS(order_amt) )
    {
        alert("Please provide order id and order amount.");
        return false;
    }
    else
    {
        if(!validateIntegerCS(order_id))
        {
            alert("Please provide valid order id.");
            return false;
        }
        if(!checkDecimalsCS(order_amt))
        {
            alert("Please provide valid order amount.");
            return false;
            
        }
        
    }
   xmlHttp=GetXmlHttpObject(handleHttpResponse_ord);
   xmlHttp.open("GET",url + "is_from="+readCookie('is_from')+"&csid="+readCookie('csid')+'&order_id='+encodeURIComponent(order_id)+"&order_amt="+encodeURIComponent(order_amt)+"&site_id="+client_id);				
   
				xmlHttp.send(null);
    
}
function handleHttpResponse_ord()
{
    if (xmlHttp.readyState == 4) {
    alert(xmlHttp.responseText);
    }
}
/*order end*/
function isWhitespaceCS(charToCheck) {
	var whitespaceChars = " \t\n\r\f";
	return (whitespaceChars.indexOf(charToCheck) != -1);
}

function validateIntegerCS( strValue ) {
  var objRegExp  = /(^-?\d\d*$)/;  
  return objRegExp.test(strValue);
}



function checkDecimalsCS(fieldValue)
{
  decallowed = 2;  
  if (isNaN(fieldValue) || fieldValue == "")
  {
    return false;
    
  }    
  else
  {
   if (fieldValue.indexOf('.') == -1) fieldValue += ".";
   dectext = fieldValue.substring(fieldValue.indexOf('.')+1, fieldValue.length);

   if (dectext.length > decallowed)
   {  
            
      return false;
   }
   else
   {
     return true;
   }
  }
}

 



