var g_allowed_href = 0;
var g_checkinglostinput = 0;
var g_parent_url = '';

function goStartPage(){
	if (!g_separate){
		openMain();
		openHome();
	} else {
		openMain();
		openHome(); //return;
		//notifyDialog('test'); return;
		//openProfile(); return;
		//openWhatsup();
		//createWhatsup();
		//openPeers(PEERTAB_FIND);

		//openActivityList();
		//createActivity();
		//createActivity(); createAssessment('abs');
		
		//viewActivity(4);
		//editActivity(119);
		
		//openUserPage(2);
		//openMessengerList();
		//openMessenger_user(24);
		
		//viewActivity(81);
		
		//viewActivity(102);
		//editActivity(102);
		//viewActivity(105);
/*		
		var
			skills = {
				"Collaboration":{
					"show":1,
					"score":2,
					"breakdowns":[]
				},
				"Communication":{
					"show":1,
					"score":3,
					"breakdowns":[
						{
							"assr_id":"1",
							"act_id": 4,
							"title":"Post-earthquake Visit to Sichuan",
							"img_id": 4,
							"score":5,
							"comments":"He performed well in the visit. He talked to many survivors and examined the site."
						},
						{
							"assr_id":"2",
							"act_id":4,
							"title":"Post-earthquake Visit to Sichuan",
							"img_id": 4,
							"score":4,
							"comments":"He helped in the evaluation work and exmaine everywhere."
						},
						{
							"assr_id":"1",
							"act_id":5,
							"title":"Science Society Open Day",
							"img_id": 21,
							"score":4,
							"comments":"He was dedicated to the work and led a good team."
						},
						{
							"assr_id":"2",
							"act_id":5,
							"title":"Science Society Open Day",
							"img_id": 21,
							"score":4.5,
							"comments":"I am impressed with his knowledge in all the fields of science."
						}
						
					]
				},
			}
			,info_users = [
				{
					"user_id":1,
					"img_id":1,
					"username":"Alan Poon",
					"email":"alantypoon@gmail.com",
					"position":"Computer Officer",
					"location":"The University of Hong Kong, HONG KONG"
				},
				{
					"user_id":2,
					"img_id":2,
					"username":"Cecilia Chan",
					"email":"cecilia.chan@gmail.com",
					"position":"Computer Officer",
					"location":"The University of Hong Kong, HONG KONG"
				},
				
			]
		;
		setTimeout(function(){
			//viewSkillBreakdown(skills, info_users, 'Communication');
		}, 1000);
*/
		var func = function(){
			if (g_saved_activity){
				
				// test edit
				var row = 3;
				
				// 2. edit
				//var jobj = $('.my_datatable[dt_type=assessments]').find('>tbody>tr:nth-child('+row+')>td:nth-child(3)'); editAssessment(jobj[0]);
				
				// 3. view
				viewAssessment(row, 'participant', g_user_id, g_user.username);
				//viewAssessment(row, 'assessor', g_user_id, g_user.username);
				//viewAssessment(row, 'coordinator', g_user_id, g_user.username);
				
				setTimeout(function(){
					//$(window).scrollTop(9999);
					//validateBeforeSubmit();
					//saveAssessment(1);
				}, 500);
				
			} else {
				setTimeout(func, 1000);
			}
		}
		//func();	// for viewassessment
	}
	
	// working scrolltop example
	//$(document).on("scroll", function(){
	//	console.log($(window).scrollTop());
	//});
}

////////////////////////////////////////////////////////////////////////////

function initAll(){
	
	//$("input").attr('readonly', true);  $("input").removeAttr('readonly');
				
	//console.trace('initAll');
	g_parent_url = window.location.href;
	var index = g_parent_url.lastIndexOf('/');
	if (index > 8){
		g_parent_url = g_parent_url.substring(0, index + 1);
	}
	//alert(g_parent_url);	

	$('body').show();
	
	// get os, platform and screensize
	checkPlatform();
	
	// first set the defeault xeditable
	$.fn.editable.defaults.url = './svrop.php';
	$.fn.editable.defaults.send = 'always';
	$.fn.editable.defaults.pk = 1;
	$.fn.editable.defaults.onblur = 'submit';
	//$.fn.editable.defaults.params = params;
	//$.fn.editable.defaults.pk = g_user.email;	// working (has to remove data-pk first)
	//$.fn.editable.defaults.success = function(response, newValue){
	//	console.info(response);
	//}
	//$.fn.editable.defaults.error = function(response, newValue){
		//console.error(response);
	//	if (response.status != 200){
	//		console.error(response.responseText);
	//	}
	//}
	//$(window).scroll(function(){
	//	console.info($(window).scrollTop());
	//});
	//$.fn.dataTable.Responsive.defaults = true;
	//alert($.fn.dataTable.Responsive.defaults);

	// http://gsgd.co.uk/sandbox/jquery/easing/
	jQuery.easing.def = "easeOutQuad";
	
	//return;
	//$('.dropmenu').mouseout(function(){
		//$(this).hide();
	//});
	// top buttons
	drawSvg($('.svg_container'));		
		
	/////////////////////////////////////////////////////////////////////////////
	// EDITOR
	/////////////////////////////////////////////////////////////////////////////
	// spinner
	$('.assessment_spinner').spinner();

	initLogin();
	initProgress();
	initSkillCanvas();
	initTopmenu();
	initHome();
	initActivity();
	initAssessment();
	initPeerAssessment();
	initViewActivity();
	initSchedule();
	initMessenger();
	initWhatsup();
	initPeers();
	hideTemporarily();

	// calender
	$.datetimepicker.setLocale('en');
	
	//setBalloonNumber('todolist', 3);
	//setBalloonNumber('notice', 3);
	//setBalloonNumber('msg', 5);
	
	////////////////////////////////////////////////////////////////////////
	// TABS
	////////////////////////////////////////////////////////////////////////
	$("#tabs").tabs({
		
		//////////////////////////////////////////////////////////////////////////////////

		beforeActivate: function(event, ui){
/*			
			//return false;
			if (g_checkinglostinput){
				console.info('beforeactivate to tab: double skipped...');
				event.stopPropagation();
				return false;
			}
			var
				jobj = ui.newTab.find('a'),
				href = jobj.attr('href'),
				tab_index = getTabIndex(href)
			;
			if (!g_allowed_href) g_allowed_href = href;
			if (g_allowed_href != href){
				console.info('beforeactivate to tab: checkloseinput...', tab_index, href);
				g_checkinglostinput = 1;
				if (checkLoseInput('lose all the input',
					function(){
						var tab_index = getTabIndex(href);
						console.log('confirmed to tab:', tab_index, href);
						g_allowed_href = href;
						$("#tabs").tabs("option", "active", tab_index);
					}
				)){
					event.stopPropagation();
					return false;
				} else {
					g_checkinglostinput = 0;
					console.log('direct to tab:', tab_index, href);
					g_allowed_href = href;
				}
			}
*/			
		},
		
		//////////////////////////////////////////////////////////////////////////////////

		activate: function(event, ui){
			var
				jobj = ui.newTab.find('a'),
				href = jobj.attr('href'),
				tab_index = getTabIndex(href)
			;
			stopVideo();
			event.stopPropagation();
		},
	});
	
	$('#tabs a')
		.hover(function(e){
			//closeDropmenu();
			
			var jobj = $(this);
			var tab = jobj.attr('href');
			//console.info(tab);
			switch (tab){

				case '#tab_profile':
					//openDropmenu(jobj, 'profile');
					break;
					
				case '#tab_activity':
					//openDropmenu(jobj, 'activity');
					break;

				case '#tab_home':
				case '#tab_profile':
				case '#tab_peers':
				case '#tab_schedule':
				case '#tabs-5':
					closeDropmenu();
					break;
			}
		})
		
	////////////////////////////////////////////////////////////////////////
	// dropmenu
	////////////////////////////////////////////////////////////////////////
	$('.dropmenu').menu().hide();
	$('.action_button')
		.click(function(event){
			openDropmenu($(this), 'action', event);
		});
	$('.but_users_import')
		.click(function(event){
			openDropmenu($(this), 'import', event);
		});
	$('.import2_button')
		.click(function(event){
			openDropmenu($(this), 'import2', event);
		});
		
	// autogrow: http://www.technoreply.com/autogrow-textarea-plugin-3-0/
	$('.ta_question').autoGrow();
	$('.assess_comment').autoGrow();
	$('textarea.autogrow').autoGrow();
	
	// start page
	//$('.tab_page').hide();
	//$("#tabs").tabs("option", "active", TAB_HOME);

	// show pages
	//$('#tbl_root').show();	
	
	// combobox
	$('.skill_combobox').combobox();

	// toggle
	$('.toggle_stamp').toggles({
		drag: true, // allow dragging the toggle between positions
		click: true, // allow clicking on the toggle
		text: {
			on: 'Yes', // text for the ON position
			off: 'No' // and off
		},
		on: false, // is the toggle ON on init
		animate: 150, // animation time (ms)
		easing: 'swing', // animation transition easing function
		checkbox: null, // the checkbox to toggle (for use in forms)
		clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
		width: 50, // width used if not set in css
		height: 20, // height if not set in css
		type: 'compact' // if this is set to 'select' then the select style toggle will be used
	});
	
	// autosize (autogrow)
	autosize($('textarea.autogrow'));

	// CHANGE SAME BUTTON CLICKED
	$('#tabs a').click(function(){
		var href = $(this).attr('href');
		var selected = $('#tabs li[aria-selected=true] a').attr('href');
		console.debug(href, selected);
		switch (href){
			case '#tab_home': 		openHome(); break;
			case '#tab_profile': 	openProfile(); break;
			case '#tab_activity': 	openActivityList(); break;
			case '#tab_peers': 			openPeers(); break;
			case '#tab_schedule': 	openSchedule(); break;
		}
		//if (selected == '#tab_home'){
	})
	
	$('.msg_button').click(function(event){
		//openMsg('');
		openMessenger('');
		event.stopPropagation();
	});

	// clear selection
	$('#tbl_skills input.custom-combobox-input').val('');
	$('#div_editact_asst input.custom-combobox-input').val('');
	
	// placeholder for div_skills
	$('.div_skills input').attr('placeholder', 'Select or input a generic skill')
	
	//$('.activitiy_title').click(function(e){
	//	var jobj = $(this);
		//console.info(jobj);
	//	openActivityEdit();
	//});
	
	$('.activity_header select').change(function(e){
		var jselect = $(this),
			index = jselect[0].selectedIndex;
		console.info('change', index);
		var jtbl = jselect.parents('.activity_tbl'),
				jdiv = jtbl.find('.activity_div')
		;
		if (index == 2){
			jdiv.slideUp();
		} else {
			jdiv.slideDown();
		}
	});
	
	$('#topmenu_logout').mouseup(function(){
		goLogOut();
	});
	
	switchLang(LG_ENG);
	//switchLang(LG_THA);
/*
	// SET LOGIN MYINFO (APP)
	var jsonstr = "{\"status\":\"2\",\"uri\":\"" + getImgUrl(g_user.img_id, 'user') + "\",\"name\":\"" + g_user.username + "\"}"; 
	changeprofile(jsonstr);	
	
	// SET LOGIN MYINFO (WEB)
	updateMyInfo();
	updateImgPhoto($('.myinfo_photo'), g_user.img_id, 'user');
*/
	///////////////////////////////////////////////////////////////
	// profile blocks (draggable: drag and drop)
	/////////////////////////////////////////////////////////////////
	var jblocks = $('#profile_blocks');
	if (g_platform != 'ios' && g_platform != 'android'){
		jblocks
			.sortable({
			
				placeholder: 'ui-state-highlight',
				
				// http://stackoverflow.com/questions/5791886/jquery-draggable-shows-helper-in-wrong-place-after-page-scrolled
				helper: function(event, ui){
					var $clone =  $(ui).clone();
					$clone.css('position','absolute');
					return $clone.get(0);
				},
				
				update: function( event, ui ){
					console.info('update');
					var order = [];
					jblocks.find('.profile_divs').each(function(){
						order.push($(this).attr('type'));
					});
					// send to server
					call_svrop(
						{
							type:		'profile_order',
							email:	g_user.email,
							pwd:		g_user.pwd,
							order:	order,
						},
						function (obj){
							console.info('succeeded', obj);
							g_user.profile.order = order;
						},
						function (obj){
							console.error('failed', obj);
						}
					);
				},
				revert: true,
				// http://stackoverflow.com/questions/2995329/if-i-do-jquery-sortable-on-a-contenteditable-items-i-then-cant-focus-mouse
				//cancel: ':input, button, .contenteditable .btn .btn-group',
				//cancel: ':not([class*=profile_header])',
				cancel: 'input,textarea,button,select,option,:input,button,.contenteditable,.btn,.btn-group,.editable,.profile_divs,span',
			})
		//.on( "sortchange", function( event, ui ) {console.info('sortchange');});
	}			
	//var cancel = jblocks.sortable( "option", "cancel" ); console.error(cancel);

	////////////////////////////////////////////////////
	// before unload check lose input
	////////////////////////////////////////////////////
	//$( window ).unload(function(){
	window.onbeforeunload = function(e){
		// send disconnect to nodejs?
		
		var suspended = checkLoseInput('lose all the input');	// no success => no dialog
		console.info('unloading...', suspended);
		if (suspended){
			return 'Lose the input?';
		}
	};

	/////////////////////////////////////////////////////////	
	// RESIZE
	/////////////////////////////////////////////////////////
	$(window).resize(function(){
		
		//console.debug('window.resize');
		
		// check platform
		checkPlatform();		
		
		if (g_curr_user){
			
			// FOR PROFILE REVIEW
			var skills = getSkillsWithBreakdown_user(g_curr_user);
			drawSkillCanvas('cvs_skills_userpage', skills, 0);
			setTimeout(function(){
				resizeUserPage();
			}, 1000);	
				
		} else {
			
			switch (g_curr_page){
				
				case TAB_HOME:
					var skills = getSkillsWithBreakdown_user(g_user);
					drawSkillCanvas('cvs_skills_home', skills, 0);
					break;
					
				case TAB_PROFILE:
					var skills = getSkillsWithBreakdown_user(g_user);
					drawSkillCanvas('cvs_skills_profile', skills, 0);				
					break;

				case TAB_ACTIVITY:
					break;
					
				case TAB_SCHEDULE:
					refreshSchedule();
					break;
					
				case PAGE_MESSENGER_COMM:
					resizeMessenger();
					break;
			}
		}
	});	

	// refresh the size
	//getHardwareSpec();
	
	// check platform
	checkPlatform();		
	
	// checking of query string user_id
	var user_id = getParameterByName('user_id');
	var act_id = getParameterByName('act_id');
	var msg_type = getParameterByName('msg_type');
	var item_id = getParameterByName('item_id');
	var whatsup_id = getParameterByName('whatsup_id');
	if (confirmed_email || g_redirect == '1'){
		
		openLogin();
		
	} else {
		
		// already login now go to the main page

		connectChatServer();
		openMain();
		updateHome();
		
		// logged-in already
		if (whatsup_id){
			
			var s = 'go to whatsup page';
			//console.debug(s); alert(s);
			openWhatsup(whatsup_id);
			
		} else if (msg_type == MSG_TYPE_USR){
			
			var s = 'go to user messenger msg_type=' + msg_type + ' item_id=' + item_id;
			//console.debug(s); alert(s);
			openMessenger_userid(item_id);
			
		} else if (msg_type == MSG_TYPE_ACT){
			
			var s = 'go to act messenger';
			//console.debug(s); alert(s);
			openMessenger_actid(item_id);
			
		} else if (act_id){
			
			var s = 'go to act page';
			//console.debug(s); alert(s);
			viewActivity(act_id);
			
		} else if (user_id){
			
			var s = 'go to user page';
			openUserPage(user_id);
			
		} else {
			var s = 'go to start page';
			//console.debug(s); alert(s);
			goStartPage();
		}
	}
}

//////////////////////////////////////////////////////////////////////
 
function toggleDetails(obj){
	stopVideo();
	var jobj = $(obj);
	var jtr = jobj.parent().parent().next();
	jtr.find('div.div_details').slideToggle('swing');	// must be with div
}

//////////////////////////////////////////////////////////////////////
 
function toggleAddExp(){
	$("#div_add_exp").slideToggle('swing');	// must be with div
}

//////////////////////////////////////////////////////////////////////
 
function togglePage(name){
	stopVideo();
	var display = $(name).css('display') != 'none';
	if (!display){
		$('.display_page').hide();
	}
	//$(name).slideToggle();
	$(name).css('display', display?'none':'block');
}

///////////////////////////////////////////////////////////////////////
var myuser = '';
/*
function toggleMyUser(){
	if (myuser == 'samson'){
		setMyUser('ian');
	} else {
		setMyUser('samson');
	}
}
*/
///////////////////////////////////////////////////////////////////////

//function setMyUser(user){
/*	
	myuser = user;
	var photo = '', name = '', curriculum = '';
	switch (user){
		case 'samson':
			photo = 'm03.jpg';
			name = 'Samson Chan';
			curriculum = 'Social Science Year 2';
			break;
		case 'ian':
			photo = 'p11.jpg';
			name = 'Ian Smith';
			curriculum = 'Social Science Professor';
			break;
	}
	//$('.curriculum_myself').html(curriculum);
	//var p = $('.photo_myself').parent();	p.html('<img src="./people/' + photo + '.jpg" class="photo_myself"/>')
*/	
//	$('.name_myself').html(user['name']);
//	$('.photo_myself,.photo_myself2').attr('src', user['photo']);//'./people/' + photo)	
//}


///////////////////////////////////////////////////////////////////////

function stopVideo(){
	$('video').each(function(){
			this.pause();
//			this.stop();
	})
}

///////////////////////////////////////////////////////////////////////

function showProfileDesc(index){
	var obj = g_activity_arr[index];
	//console.info('showProfileDesc', index, obj.youtube);
	$('#div_profile_desc').html(obj.text);
	$('#img_profile_desc').attr('src', obj.img);
	$('#addexp_priv1').prop('checked', true);
	$('#video_profile_desc').html('<iframe class="ifrm_youtube" src="' + obj.youtube + '" frameborder="0" allowfullscreen></iframe>');
}

// <video width="800" height="480" controls="1"><source type="video/mp4"/></video>
//$('#video_profile_desc').html('<video width="800" height="480" controls="1"><source type="video/mp4" src="' + obj.video + '"/></video>');
//console.info(obj.video, $('#video_profile_desc').html());

///////////////////////////////////////////////////////////////////////

function toggleEdit(jobj){
	//e.g. div_yolo1
	jobj.toggleClass('editor');
	if (jobj.hasClass('editor')){
		var h = jobj.height();
		jobj.attr('height0', h)
		jobj.trumbowyg(g_editor_opts);	
	} else {
		jobj.trumbowyg('destroy');
		var h = parseInt(jobj.attr('height0'));
		jobj.height(h);
	}
}

///////////////////////////////////////////////////////////////////////

function isVisible(jobj){
	var display = jobj.css('display');
	if (display == 'none'){
		return false;
	} else {
		return true;
	}
}

//////////////////////////////////////////////////////////////////////

function openModal(jdiv){
	//console.info(jdiv[0].outerHTML);
	jdiv.dialog({
		modal:true,
		width: 'auto',
		height: 'auto',
		buttons:{
			Ok: function() {
				$( this ).dialog( "close" );
			},
			Cancel: function() {
				$( this ).dialog( "close" );
			},
		}
	})
}

///////////////////////////////////////////////////////////////
// remove sorting from unname column
///////////////////////////////////////////////////////////////

function removeUnneedSorting(jtbl){
	jtbl.find('.sorting').each(function(){
		var jobj = $(this),
			text = jobj.text().trim()
		;
		if (text == '' || text == 'Weight %'){
			jobj.removeClass('sorting');
		}
	});
}

//////////////////////////////////////////////////////////////////////
 var	g_activity_index = 0,
			g_task_index = 0
			
;

////////////////////////////////////////////////////////////////////
/*
function createSelect(){
	for (var i = 1; i < g_activity_arr.length; i++){
		var activity = g_activity_arr[i];
		var type = i < 4 ? 'oclx' : 'yolox';
		var selected = '';	//= i == 1 ? ' selected' : '';
		$('#cb_exp_name_' + type + ' select').append('<option value="' + i + ' ' + selected + '">'+activity.title+'</option>');
	}
}
*/

///////////////////////////////////////////////////////

function openSearchPeople(){
	$('#dialog_people').dialog({
		modal: true,
		autoOpen: true,
		resizable: false,
		width:'auto',		
		height:'auto',		
		buttons: {
			Close: function() {
				$( this ).dialog( "close" );
			},
		},	
	});
}

////////////////////////////////////////////////////////////////////

var
	g_details_button = '<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 18.453 18.453" style="width: 16px; height: 16px;" xml:space="preserve"><rect x="2.711" y="4.058" width="8.23" height="1.334"></rect><path d="M14.972,14.088c0.638-1.127,0.453-2.563-0.475-3.49c-0.549-0.549-1.279-0.852-2.058-0.852c-0.779,0-1.51,0.303-2.059,0.852s-0.852,1.279-0.852,2.059c0,0.777,0.303,1.508,0.852,2.059c0.549,0.547,1.279,0.85,2.057,0.85c0.507,0,0.998-0.129,1.434-0.375l3.262,3.262l1.101-1.102L14.972,14.088z M13.664,13.881c-0.652,0.652-1.796,0.652-2.448,0c-0.675-0.676-0.675-1.773,0-2.449c0.326-0.326,0.762-0.506,1.225-0.506s0.897,0.18,1.224,0.506s0.507,0.762,0.507,1.225S13.991,13.554,13.664,13.881z" fill="black"></path><path d="M13.332,16.3H1.857c-0.182,0-0.329-0.148-0.329-0.328V1.638c0-0.182,0.147-0.329,0.329-0.329h11.475c0.182,0,0.328,0.147,0.328,0.329V8.95c0.475,0.104,0.918,0.307,1.31,0.597V1.638C14.97,0.735,14.236,0,13.332,0H1.857C0.954,0,0.219,0.735,0.219,1.638v14.334c0,0.902,0.735,1.637,1.638,1.637h11.475c0.685,0,1.009-0.162,1.253-0.76l-0.594-0.594C13.772,16.347,13.426,16.3,13.332,16.3z" fill="black"></path><rect x="2.711" y="7.818" width="8.23" height="1.334"></rect></svg></span>&nbsp; Details</button>',
	g_pecentage_spinner = '<input class="assessment_spinner" value="0" style="width:25px"/>'
;


/////////////////////////////////////////////////////////////////////////

function showErrDialog(title, msg){
	//console.info('onError', obj);
	$('#div_errmsg').text(msg);
	$('#dialog-message')
		.attr('title', title)
		.dialog({
			resizable: false,
			height:180,
			modal: true,
			buttons: {
				Close: function() {
					$( this ).dialog( "close" );
				}
			}			
		});	
}

///////////////////////////////////////////////////////////////////////////////

function switchLang(lang){
	console.info('switchLang', lang);
	g_curr_lang = lang;
	$.each(g_lang_map, function(index, value) {
    //console.info(index, value);
		var text = value[lang],
			jobj = $(index)
		;
		if (!jobj.length){
			//console.error(index, ' cannot find the index');
			//debugger;
		} else {
			var tagname = jobj.prop("tagName");
			//console.info(tagname, text);
			switch (tagname){
				case 'INPUT':
					jobj.attr('placeholder', text);
					break;
				default:
					jobj.text(text);
					break;
			}
		}
	});
}

///////////////////////////////////////////////////////////////////////////////

function getLangStr(index){
	return g_lang_map[index][g_curr_lang];
}

//////////////////////////////////////////////////////////

function onWinResize(){
/*
	console.info('onWinResize', $(this));
	var
		nScreenH = eval(window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight),
		h1 = $('#td_topmenu').height(),
		h2 = $('#ui-tabs-nav').height(),
		h = nScreenH - h1 - h2 - 100
	;
	console.info(h);
	$('#div_scheduler').height(h);
*/	
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var g_dropmenu_opened = 0;
function openDropmenu(obj, menu, event){
	var jobj = $(obj), jmenu = $("#dropmenu_" + menu);
	var offset = jobj.offset(),
		y = offset.top + jobj.height(),
		x = offset.left,
		w = jmenu.width(),
		screenw = eval(window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth),
		border = 30
	;
	if (x + w + border > screenw){
		x = screenw - w - border;
	} 
	//var jtr = jobj.parent().parent().parent().parent().parent(),
	//		g_activity_index = jtr.attr('index'),
	//		g_task_index = jtr.attr('taskindex'),
	//		tasktype = jtr.attr('tasktype')
	//;
	//console.info('openDropmenu', menu);	//, g_activity_index, g_task_index, tasktype); debugger;
	switch (menu){
		case 'action':
			// PER ACTIVITY
			var jtr = jobj.parent().parent();
			// global variable!!
			g_activity_index = jtr.attr('index');
			g_task_index = -1;
			console.info('openDropmenu1', menu, g_activity_index);
			
			var jtd = jtr.find('td:nth-child(3)')
			var role = jtd.text().trim().substring(0,1).toLowerCase();
			switch (role){
				case 'c':	// coordinator
				case 'a':
					jmenu.find('li:nth-child(1)').hide();	// view details
					jmenu.find('li:nth-child(2)').show();	// view/edit details
					
					jmenu.find('li:nth-child(5)').show();	// view details
					jmenu.find('li:nth-child(6)').show();	// view/edit details
					break;
					
				case 'p': // participant
					jmenu.find('li:nth-child(1)').show();
					jmenu.find('li:nth-child(2)').hide();
					
					jmenu.find('li:nth-child(5)').hide();	// view details
					jmenu.find('li:nth-child(6)').hide();	// view/edit details
					break;
			}
			break;
			
		case 'searchact':
			// PER TASK
			var jtr = jobj.parent().parent().parent().parent().parent();
			// GLOBAL VARIABLE!!
			g_activity_index = jtr.attr('index');
			g_task_index = jtr.attr('taskindex');
			var tasktype = jtr.attr('tasktype');
			console.info('openDropmenu2', menu, g_activity_index, g_task_index, tasktype);
			var tasktype2 = tasktype.toLowerCase();
			var s1 = "#dropmenu_searchact li a[href!='\\#search_"+ tasktype2 +"']",
					s2 = "#dropmenu_searchact li a[href='\\#search_"+ tasktype2 +"']"
			;
			//console.info(tasktype2, g_activity_index);
			$(s1).parent().hide();
			$(s2).parent().show();
			console.info(tasktype);
			//console.info($('#dropmenu_searchact li:last-child a').length);
			switch (tasktype){
				case 'GS':
					$('#dropmenu_searchact li a[href=\\#search_gsgrades').parent().show();
					break;
				case 'EVA':
					$('#dropmenu_searchact li a[href=\\#search_asmmarks').parent().show();
					break;
			}
			break;
			
		default:
			y += 11;
			break;
	}
	var display = jmenu.css('display');
	if (!isVisible(jmenu)){
		$('.dropmenu').hide();
		jmenu.show().offset({left:x, top:y});
		jmenu.hide().fadeIn('swing');
	}
	if (event){
		switch (menu){
			case 'action':
			case 'import':
			case 'import2':
			case 'searchact':
			case 'lang':
				event.stopPropagation();
				break;
		}
	}
	g_dropmenu_opened = 1;
}

//////////////////////////////////////////////////////////////////////
 
function closeDropmenu(){
	//console.trace('closeDropMenu')
	$('.dropmenu').hide();
	g_dropmenu_opened = 0;
}

//////////////////////////////////////////////////////////////////////
 
function switchTabClass(index){
	//ui-tabs-active ui-state-active
	$('[aria-selected=true]').attr('aria-expanded', 'false');
	$('[aria-expanded=true]').attr('aria-selected', 'false');
	$('[role=tab]').removeClass('ui-tabs-active').removeClass('ui-state-active');
	$('[aria-controls=' + index + ']')
		.addClass('ui-tabs-active').addClass('ui-state-active')
		.attr('aria-expanded', 'true').attr('aria-selected', 'true')
	;
}

//////////////////////////////////////////////////////////////////////

function getTabIndex(href){
	var tab_index = -1;
	switch (href){
		case '#tab_home':		tab_index = 0; break;
		case '#tab_profile':	tab_index = 1; break;
		case '#tab_activity':	tab_index = 2; break;
		case '#tab_schedule':	tab_index = 3; break;
		case '#tab_peers':	tab_index = 4; break;
	}
	return tab_index;
}

//////////////////////////////////////////////////////////////////////

function setShortPlaceHolder(jroot){
	switch (g_platform){
		case 'ios':
		case 'android':
			var jtoken = jroot.find('.my_tokenfield[tt_type=users]');
			jtoken.next().next().find('.tt-input').attr('placeholder', 'User names');
			jroot.find('.my_tokenfield[tt_type=skills]').next().next().find('.tt-input').attr('placeholder', 'Skills');
			break;
	}
}


/////////////////////////////////////////////////////////////////////////////////////
// open tabs
/////////////////////////////////////////////////////////////////////////////////////

function openHome(){
	if (!checkLoseInput('cancel all the input', function(){
		openHome2();
	})){
		openHome2();
	}		
}

/////////////////////////////////////////////////////////////////////////////////////

function openProfile(){
	if (!checkLoseInput('cancel all the input', function(){
		openProfile2();
	})){
		openProfile2();
	}		
}

/////////////////////////////////////////////////////////////////////////////////////

function openActivityList(){
	if (!checkLoseInput('cancel all the input', function(){
		openActivityList2();
	})){
		openActivityList2();
	}		
}

/////////////////////////////////////////////////////////////////////////////////////

function openSchedule(){
	if (!checkLoseInput('cancel all the input', function(){
		openSchedule2();
	})){
		openSchedule2();
	}		
}

