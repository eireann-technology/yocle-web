var g_allowed_href = 0;
var g_checkinglostinput = 0;
var g_parent_url = '';

function goStartPage(){
	if (!g_separate){
		openMain();
		openBaseMenu('home');
		openHome();
	} else {
		//openMain(); openHome(); return;

		openBaseMenu('home');
		openHome();
		//return;

		//viewSkillBreakdown2(g_user.skills, [], 'Creativity');

		//openUserPage(2); return;
		//notifyDialog('test'); return;
		//openProfile(); return;
		//editProfile(); return;
		//openWhatsup(); return;
		//openBlog(); return;

		//createWhatsup();
		//openPeers(PEERTAB_FIND);

		//openActivityList();
		//createActivity();
		//createActivity(); createAssessment('abs');

		//editActivity(132);
		//viewActivity(132);
		//viewActivity(119);
		//editActivity(119);

		//editActivity(138);
		//viewActivity(138);

		//viewActivity(131);
		//viewActivity(103);

		//viewActivity(138);
		//editActivity(138);

		openMessengerList(); return;

		//viewActivity(81);

		//viewActivity(102);
		//editActivity(102);

		//editActivity(142, ACTTAB_ASSESSMENTS); return;
		//viewActivity(142);

		//editActivity(148);
		//viewActivity(148);
		//viewActivity(189, ACTTAB_RATING); return;
		//viewActivity(189, ACTTAB_ASSESSMENTS); //return;
		//viewActivity(189, ACTTAB_PHOTO); return;

		//editActivity(189, ACTTAB_INFO); return;
		//editActivity(189, ACTTAB_ASSESSMENTS); return;
		//editActivity(189, ACTTAB_RUBRICS); return;
		//editActivity(189, ACTTAB_PHOTO); return;

		//viewActivity(203, ACTTAB_ASSESSMENTS);
		//viewActivity(189, ACTTAB_ASSESSMENTS); //return;
		//viewActivity(217, ACTTAB_ASSESSMENTS); return;
		//viewActivity(217, ACTTAB_ASSESSMENTS); return;

		//editActivity(233, ACTTAB_PARTICIPANTS);
		//viewActivity(217, ACTTAB_PARTICIPANTS); return;
		//viewActivity(219, ACTTAB_ASSESSMENTS); return;

		var timeout = 500; // ms
		var func = function(){
			if (g_saved_activity){

				//openMessenger_user(16); return;
///*
				setTimeout(function(){
///*
					//var role = 'part';
					//var row = 1, jtd = $('[dt_type=assessment_'+role+'1] tr:nth-child('+row+') > td:last-child');
					//jtd.find('.div_but_special').trigger("click"); return;

					//showRoleTab(ROLE_ASSESSOR);

					var role = 'part';
					setTimeout(function(){
						var row = 5, jtd = $('[dt_type=assessment_'+role+'1] tr:nth-child('+row+') > td:last-child');
						jtd.find('.div_but_special').trigger("click");
						return;

						setTimeout(function(){
							var row = 1, jtd = $('[dt_type=assessment_'+role+'2] tr:nth-child('+row+') td:last-child');
							jtd.find('button').trigger("click");
						}, timeout);

					}, timeout);

//*/
					//showRoleTab(ROLE_COORDINATOR);
					//showRoleTab(ROLE_ASSESSOR);
					//return;

					//$(window).scrollTop(9999);
					//validateBeforeSubmit();
					//saveAssessment(1);

					//showActTab(ACTTAB_PHOTO);	return;
					//showActTab(ACTTAB_ASSESSMENTS);
					//showActTab(ACTTAB_RUBRICS);
					//showActTab(ACTTAB_RATING);	//return;

/*
					var role = 'coor';
					setTimeout(function(){
						var row = 2, jtd = $('[dt_type=assessment_'+role+'1] > tbody > tr:nth-child('+row+') > td:last-child');
						jtd.find('.div_but_special').trigger("click");
						setTimeout(function(){
							var row = 2, jtd = $('[dt_type=assessment_'+role+'2] tr:nth-child('+row+') td:last-child');
							jtd.find('.div_but_special').trigger("click");
						}, 1000);
					}, 1000);
*/
				}, timeout);

			} else {
				setTimeout(func, timeout);
			}
		}
		func();	// for second level
	}
	// working scrolltop example
	//$(document).on("scroll", function(){
	//	console.log($(window).scrollTop());
	//});
}
/*
						//return;

						//var row = 1, jtd = $('[dt_type=assessments] > tbody >  tr:nth-child('+row+') > td:last-child');
						//jtd.find('.div_but_special').trigger("click");
						//return;
						//showRoleTab(ROLE_PARTICIPANT);
						//showRoleTab(ROLE_ASSESSOR);
						//showRoleTab(ROLE_COORDINATOR);
						//return;

						//viewAssessment(1, 'participant', 1, 'alan'); return;
						// 2. edit
						//var row = 2;
						//var jtd = $('.my_datatable[dt_type=assessments]').find('>tbody>tr:nth-child('+row+')>td:nth-child(3)');
						//jtd.find('.div_but_special').trigger("click"); return;
							// rating check
							//var jtd3 = $('[dt_type=impression_assr1] tr:last-child td:last-child');
							//jtd3.find('.div_but_special').trigger("click"); return;

							var role = 'assr';
							var ass_id = 1;
							var jtd2 = $('[dt_type=assessment_'+role+'1] tr:nth-child('+ass_id+') td:first-child');
							//eval('viewAsst_'+role+'1(ass_id, jtd2)');

							var role = 'part';
							var ass_id = 2;
							var jtd2 = $('[dt_type=assessment_'+role+'1] tr:nth-child(' + ass_id + ') td:first-child');
							eval('viewAsst_'+role+'1(ass_id, jtd2)');

							var role = 'assr';
							var row = 1;
							var jbut = $('[dt_type=assessment_'+role+'2] tr:nth-child('+row+') button');
							//eval('viewAsst_'+role+'2(jbut)');

							setTimeout(function(){
								var role = 'coor', row = 4, jtd = $('[dt_type=assessment_'+role+'2] tr:nth-child('+row+') td:last-child');
								console.log(jtd);
								jtd.find('.div_but_special').trigger("click");
								return;

								var jtd3 = $('[dt_type=assessment_'+role+'2] tr:nth-child('+row+') td:last-child');
								//jtd3.find('button').trigger("click");

							}, 1000);
						}, timeout);

					}, timeout);

				}, timeout);
//*/

////////////////////////////////////////////////////////////////////////////

function initAll(){

	g_parent_url = window.location.href;
	var index = g_parent_url.lastIndexOf('/');
	if (index > 8){
		g_parent_url = g_parent_url.substring(0, index + 1);
	}
	$('body').show();

	// get os, platform and screensize
	checkPlatform();

	////////////////////////////////////////////////////
	// WEB/MOBILE VERSION
	////////////////////////////////////////////////////
	$('.div_tbl_period').html(
		$('.tbl_period_' + (g_platform == 'web' ? 'web' : 'mobile')).outerHTML()
	);


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

// add to featherlight else cannot resume scrollbar
	$.featherlight.defaults.afterClose = function(){
		//closeLightBox();
	}

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
	//initActivity();

	console.info('initActivity');
	initListAct();
	initEditAct();
	initViewAct();

	//initAssessment();
	console.info('initAssessment');
	initEditAsst();
	initViewAsst();
	initPeerAssessment();

	//initSchedule();
	initMessenger();
	initWhatsup();
	initPeers();
	hideTemporarily();
	initKeyboard();
	initBlog();

	// calender
	$.datetimepicker.setLocale('en');
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


	////////////////////////////////////////////////////
	// before unload check lose input
	////////////////////////////////////////////////////
	window.onbeforeunload = function(e){
		// send disconnect to nodejs?
		var suspended = checkLoseInput();	// no success => no dialog
		console.info('unloading...', suspended);
		if (suspended){
			return 'Lose the input?';
		}
	};

	/////////////////////////////////////////////////////////
	// RESIZE
	// checkonresize
	/////////////////////////////////////////////////////////
	//$(window).resize(function(){
		//checkOnResize();
	//});
	//var element = document.getElementById('myElement');

//	var element = $(document.body)[0];
//	new ResizeSensor(element, function() {
		//console.log('resize to ' + element.clientWidth);
//		checkOnResize();
//	});

	$(window).resize(function(){
		console.log('resized');
		checkOnResize();
	});

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

	// bottom menu
	$('.base_tab').click(function(){
		var tab_name = $(this).attr('tab_name');
		openBaseMenu(tab_name);
	});

	checkOnResize();
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
	checkLoseInput(openHome2);
}

/////////////////////////////////////////////////////////////////////////////////////

function openProfile(){
	checkLoseInput(openProfile2);
}

/////////////////////////////////////////////////////////////////////////////////////

function openActivityList(){
	checkLoseInput(openActivityList2);
}

/////////////////////////////////////////////////////////////////////////////////////

function openSchedule(){
	checkLoseInput(openSchedule2);
}

/////////////////////////////////////////////////////////////////////////////////////

function checkKey(e){
	console.info(e);
}

//////////////////////////////////////////////////////////////////////

function openBaseMenu(tab_name){
	$('.base_tab').removeClass('selected', 500);
	$('.base_tab[tab_name=' + tab_name + ']').addClass('selected', 1000);
}

//////////////////////////////////////////////////////////////////////

function delayOpen(func){
	setTimeout(func, 10);
}
