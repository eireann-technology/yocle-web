/*
var isMobile = {
    Android: function() {
        return /Android/i.test(navigator.userAgent);
    },
    BlackBerry: function() {
        return /BlackBerry/i.test(navigator.userAgent);
    },
    iOS: function() {
        return /iPhone|iPad|iPod/i.test(navigator.userAgent);
    },
    Windows: function() {
        return /IEMobile/i.test(navigator.userAgent);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
    }
};
*/
//////////////////////////////////////////////////////////////////////////////////////////////////////
//
// newwin
//
// url = datatable_level2.php
// jsfunc = setDataTable('1','<div> ..... </div>')";
// e.g.	open_newwin("datatable_level3.php", "setDataTable('"+arg1+"','"+arg2+"')");
function open_newwin(url, jdiv, callback, obj){
	console.info('open_newwin', url);
	var bSuccess = 0;
/*
	//alert('platform: ' + g_platform);
	switch (g_platform){

		case 'ios':
		case 'android':
			//var jsfunc = "setNewWinDiv('" + jdiv.html() + "', '" + g_platform + "', '" + callback + "', '" + JSON.stringify(obj) + "')";
			var jsfunc = "setNewWinDiv('', '" + g_platform + "', '" + callback + "', '" + JSON.stringify(obj) + "')";
			var url2 = (!g_bProduction ? 'dev/' + url : url) + ('?separate='+g_separate) ;
			//alert(url2+','+jsfunc);
			switch (g_platform){

				case 'ios':
					//alert('call ios postMessage:\r\n\r\n' + url2 + ', ' + jsfunc);
					//window.location = "newwin://" + url2 + ">" + jsfunc;
					//alert(2);
					if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.app && window.webkit.messageHandlers.app.postMessage){
						try {
							window.webkit.messageHandlers.app.postMessage({'cmd': 'newwin://' + url2 + '>' + jsfunc});
							bSuccess = 1;
						} catch (e){
							alert(e.message);
						}
					}
					//alert(3);
					break;

				case 'android':
					if (typeof app != "undefined"){
						app.newwin(url2, jsfunc);
						bSuccess = 1;
					}
					break;
			}
			break;
	}
*/
	// UNUSED!!!
	if (!bSuccess){
		// windows desktop
		// open lightbox: https://github.com/noelboss/featherlight
		var jdiv = ('<div/>');
		g_lightbox = $.featherlight(jdiv, {
			closeOnClick: false,
			//closeOnEsc:   false,
			closeIcon:		'',
		});
		var jdiv2 = $('.featherlight-inner').attr('id', 'newwin_div');
		$('html, body').css('overflow', 'hidden');
		newwin_callback(callback, obj);
	}
}

//////////////////////////////////////////////////////////////////////////////

function newwin_callback(callback, obj){
	//alert('newwin_callback: ' + callback);
	switch (callback){
			case 'editAssessment2':
				editAssessment2(obj);
				break;
	}
}

//////////////////////////////////////////////////////////////////////////////////////

// jsfunc = callback('Callback from level 3')
function backwin(callback, obj){
	var jsfunc = 'backwin_callback("' + callback + '", "' + JSON.stringify(obj) + "')";
	switch (g_platform){

		case 'ios':
			if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.app && window.webkit.messageHandlers.app.postMessage){
				try {
					window.webkit.messageHandlers.app.postMessage({'cmd': 'backwin://'+jsfunc});
					bSuccess = 1;
				} catch(e){}
			}
			break;

		case 'android':
			if (typeof app != "undefined")	{
				app.backwin(jsfunc);
			}
			break;
	}
}

//////////////////////////////////////////////////////////////////////////////////////

function backwin_callback(callback, sobj){
	//alert('backwin_callback: ' + callback);
	switch (callback){
		default:
			break;
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////

// jsonstr = {\"status\":\"2\",\"uri\":\"people/m10.jpg\",\"name\":\"Chan Tai Man\"}";  status = 1 (not login), status = 2 (logoned)
/*
	After logon, call
	jsonstr = {\"status\":\"2\",\"uri\":\"people/m10.jpg\",\"name\":\"Chan Tai Man\"}";

	After logout, call
	jsonstr = {\"status\":\"1\",\"uri\":\"\",\"name\":\"\"}";
*/
/*
function changeprofile(jsonstr){
	if (isMobile.Android()){
		if(typeof app != "undefined")	{
			app.changeprofile(jsonstr);
		}
	} else if(isMobile.iOS()) {
		window.location = "changeprofile://"+jsonstr;
	} else { // windows desktop
	}
}
*/

////////////////////////////////////////////////////////////////////////////////////////////////////

function changeprofile(jsonstr){
	switch (g_platform){

		case 'android':
			if (typeof(app) != "undefined"){
				try {
					app.changeprofile(jsonstr);
				} catch (e){
					alert(e?e.message:'error1');
				}
			}
			break;

		case 'ios':
			if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.app && window.webkit.messageHandlers.app.postMessage){
				try {
					window.webkit.messageHandlers.app.postMessage({'cmd': "changeprofile://"+jsonstr});
					bSuccess = 1;
				} catch (e){
					alert(e?e.message:'error2');
				}
			}
			break;
	}
}

///////////////////////////////////////////////////////////////////////////////////////

// 1. setup
// jsonstr = {\"menuitems\":[{\"anchor\":\"paragraph1\",\"title\":\"Paragraph 1\"}, {\"anchor\":\"paragraph2\",\"title\":\"Paragraph 2\"},{\"anchor\":\"paragraph3\",\"title\":\"Paragraph 3\"},{\"anchor\":\"paragraph4\",\"title\":\"Paragraph 4\"},{\"anchor\":\"paragraph5\",\"title\":\"Paragraph 5\"},{\"anchor\":\"paragraph6\",\"title\":\"Paragraph 6\"},{\"anchor\":\"paragraph7\",\"title\":\"Paragraph 7\"},{\"anchor\":\"paragraph8\",\"title\":\"Paragraph 8\"}]}";

// 2. anchor in html
// <p><a name="paragraph2">Paragraph 2</a><br><br>

// 3. remove anchors
// jsonstr = "{\"menuitems\":[]}";

/*
function cmenu(jsonstr) {
 if(isMobile.Android()) {
		if(typeof app != "undefined")	{
			app.cmenu(jsonstr);
			return;
		}
	}
	else if(isMobile.iOS()) {
		window.location = "cmenu://"+jsonstr;
		return;
	}
	else { // windows desktop

	}
}
*/
//function cmenu(jsonstr){
function cmenu(json){
		if (!json){
			json = {menuitems:[]};
		}
		var jsonstr = JSON.stringify(json);
		switch (g_platform){
		case 'android':
			if (typeof(app) != "undefined"){
				try {
					app.cmenu(jsonstr);
				} catch (e){
					alert(e?e.message:'error1');
				}
			}
			break;

		case 'ios':
			if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.app && window.webkit.messageHandlers.app.postMessage){
				try {
					window.webkit.messageHandlers.app.postMessage({'cmd': "cmenu://"+jsonstr});
					bSuccess = 1;
				} catch (e){
					alert(e?e.message:'error2');
				}
			}
			break;
	}
}

//////////////////////////////////////////////////////////////

function goto(hash) {
	location.hash = hash;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function external_call(command, arg1){

	//alert('external_call:' + command + ', ' + arg1);

	if (command) command = command.trim();
	if (arg1) arg1 = arg1.trim();

	switch (command){

		case 'notify_token':
			var token = arg1;
			//alert('token=***' + token + '***\r\n\r\nplatform=' + g_platform + '\r\n\r\nurl=' + my_server_url());

			// update to server
			call_svrop(
				{
					type: 'notify_token',
					user_id: g_user_id,
					platform: g_platform,
					token: token,
				},
				function (obj){
					console.info('notify_token completed');
				}
			);
			break;

		case 'home':
			openHome();
			break;

		case 'profile':
			openProfile();
			break;

		case 'activity':
			openActivityList();
			break;

		case 'schedule':
			openSchedule();
			break;

		case 'logout':
			goLogOut();
			break;

		case 'messenger':
			//alert('messenger');
			openMessengerList();
			break;

		case 'whats_up':
			//alert('whats_up');
			openWhatsup();
			break;

		case 'peers':
			openPeers();
			break;

		default:
			alert('unknown external_call:' + command + ', ' + arg1);
			break;
	}

}

////////////////////////////////////////////////////////////////////////////////////////////////

// $message = 'YOCLE:::Cecilia invites you to be an accessor of the activity "Serving the elderly".:::https://yolofolio.cetl.hku.hk/svrop.php?type=read_notification&user_id=1&msg_id=101';
function sendNotification(msg){
	// update to server
	// send notification
}

////////////////////////////////////////////////////////////////////////////////////////////////

function showhideactionbar(show){ // i=0 hide the bar, i=1 show the bar
	//return;
	//alert('showhideactionbar: ' + i + ' ' + g_platform);
	//return;
	show = 0; // permanantly disabled 20180620

	switch (g_platform){

		case 'ios':
			if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.app && window.webkit.messageHandlers.app.postMessage){
				try {
					window.webkit.messageHandlers.app.postMessage({'cmd': 'showhideactionbar://' + show});
					//bSuccess = 1;
				} catch(e){}
			}
			break;

		case 'android':
			//alert('showhideactionbar(start): ' + i);
			try {
				if (typeof app != "undefined")	{
					app.showhideactionbar(show);
				}
			} catch (e){}
			//alert('showhideactionbar(end): ' + i);
			break;
	}
}

////////////////////////////////////////////////////////////////////////////////////////////

function storeLogonSession(){
	switch (g_platform){
		case 'ios':
			break;

		case 'android':
			try {
				if (typeof app != "undefined")	{
					app.storeLogonSession(document.cookie);
				}
			} catch (e){}
			break;
	}
}


//////////////////////////////////////////////////////////////////////////////////////////

function enabledisablepullrefresh(i){ // i=0 disable, i=1 enable

	var bSuccess = 0;

	switch (g_platform){

		case 'ios':

			if (window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.app && window.webkit.messageHandlers.app.postMessage){
				try {
					window.webkit.messageHandlers.app.postMessage({'cmd': 'pullrefresh://'+i});
					bSuccess = 1;
				} catch(e){}
			}
			break;

		case 'android':
			//alert('showhideactionbar(start): ' + i);
			try {
				if (typeof app != "undefined")	{
					app.enabledisablepullrefresh(i);
					bSuccess = 1;
				}
			} catch (e){}
			//alert('showhideactionbar(end): ' + i);
			break;
	}
	//alert('enabledisablepullrefresh: ' + i + ' platform=' + g_platform + ' success=' + bSuccess);

}
