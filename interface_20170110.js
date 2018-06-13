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

// url = datatable_level2.php
// jsfunc = setDataTable('1','<div> ..... </div>')";
function newwin(url, jsfunc) {
 if(isMobile.Android()) {
		if(typeof app != "undefined")	{
			app.newwin(url, jsfunc);		
			return;
		}
	}	
	else if(isMobile.iOS()) {
//		window.location = "newwin://"+url+">"+jsfunc;
		window.webkit.messageHandlers.app.postMessage({'cmd': 'newwin://'+url+'>'+jsfunc});
		
		return;
	}
	else { // windows desktop
	
	}
}

// jsfunc = callback('Callback from level 3')
function backwin(jsfunc) {
 if(isMobile.Android()) {
		if(typeof app != "undefined")	{
			app.backwin(jsfunc);		
			return;
		}
	}	
	else if(isMobile.iOS()) {
		window.location = "backwin://"+jsfunc;
		window.webkit.messageHandlers.app.postMessage({'cmd': 'backwin://'+jsfunc});
		return;
	}
	else { // windows desktop
	
	}
}

// jsonstr = {\"menuitems\":[{\"anchor\":\"paragraph1\",\"title\":\"Paragraph 1\"}, {\"anchor\":\"paragraph2\",\"title\":\"Paragraph 2\"},{\"anchor\":\"paragraph3\",\"title\":\"Paragraph 3\"},{\"anchor\":\"paragraph4\",\"title\":\"Paragraph 4\"},{\"anchor\":\"paragraph5\",\"title\":\"Paragraph 5\"},{\"anchor\":\"paragraph6\",\"title\":\"Paragraph 6\"},{\"anchor\":\"paragraph7\",\"title\":\"Paragraph 7\"},{\"anchor\":\"paragraph8\",\"title\":\"Paragraph 8\"}]}";			
// jsonstr = {\"menuitems\":[]}";	
function cmenu(jsonstr) {
 if(isMobile.Android()) {
		if(typeof app != "undefined")	{
			app.cmenu(jsonstr);		
			return;
		}
	}	
	else if(isMobile.iOS()) {
//		window.location = "cmenu://"+jsonstr;
		window.webkit.messageHandlers.app.postMessage({'cmd': 'cmenu://'+jsonstr});
		return;
	}
	else { // windows desktop
	
	}
}

// jsonstr = {\"status\":\"2\",\"uri\":\"people/m10.jpg\",\"name\":\"Chan Tai Man\"}";  status = 1 (not login), status = 2 (logoned)
function changeprofile(jsonstr) {
 if(isMobile.Android()) {
		if(typeof app != "undefined")	{
			app.changeprofile(jsonstr);		
			return;
		}
	}	
	else if(isMobile.iOS()) {
//		window.location = "changeprofile://"+jsonstr;
		window.webkit.messageHandlers.app.postMessage({'cmd': 'changeprofile://'+jsonstr});
		return;
	}
	else { // windows desktop
	
	}
}

function external_call(command) {
//	alert(command);
	setTimeout("alert('"+command+"')", 1000 ); 
}

