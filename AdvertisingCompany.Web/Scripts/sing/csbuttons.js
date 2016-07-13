var csbutton = csbutton || (function(){
    var _args = {}; // private

    return {
        init : function(Args) {
            _args = Args;            
        },
        putCsbutton : function() {
            if(_args[3]=='login')
            {
                var is_share_login='0';
            }
            else
            {
                var is_share_login='1';_
            }
            
            if(_args[4] && _args[4]!='')
            {
            document.write('<a href="javascript:void(0);"><img src="'+_args[0]+'" style="height:'+_args[1]+';width:'+_args[2]+';" onclick="gapi.auth.signIn({\'clientid\' : \''+_args[4]+'\',\'callback\': signinCallback,\'scope\':\'https://www.googleapis.com/auth/plus.login  https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile\',\'cookiepolicy\':\'single_host_origin\',\'approvalprompt\':\'force\',\'access_type\':\'online\'});return;"></a>');
            }
            else
            {
                document.write('<a href="javascript:void(0)" onclick="csfblogin('+is_share_login+')"><img src="'+_args[0]+'"  style="height:'+_args[1]+';width:'+_args[2]+';"></a>');
            }
            
        }
    };
}());
