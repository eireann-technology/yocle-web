var
	TAB_HOME = 0,
	TAB_PROFILE = 1,
	TAB_NTWK = 2,
	TAB_OCLX = 3,
	TAB_YOLOX = 4,
	TAB_ACTIVITY = 3
;

var g_editor_opts = {
	lang: 'en',
	fixedBtnPane: true,
	btnsGrps: {
		test: ['strong', 'em'] // Custom nammed group
	},
	btnsDef: {
			// Customizables dropdowns
			align: {
					dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
					ico: 'justifyLeft'
			},
			image: {
					dropdown: ['insertImage', 'noembed', 'upload'],//, 'base64'],
					ico: 'insertImage'
			},
			//createTable: {
			//	ico: 'createTable',
			//}
	},
	btns: [
			//['createTable'],
			['bold', 'italic', 'underline'],//, 'strikethrough'],
			['formatting'],
			['align'],
			['unorderedList', 'orderedList'],
			//['superscript', 'subscript'],
			['link'],
			['image'],
			['foreColor', 'backColor'],
			//['preformatted'],
			['horizontalRule'],
			['removeformat'],
			['viewHTML'],
//					['fullscreen', 'close']
			//['undo', 'redo'],
			['script', 'style'],
	],
	autogrow: true,
};


/////////////////////////////////////////////////////////////////

function initAll(){
	//return;
	
	// top buttons
	drawSvg($('.svg_container'));
	
	// tooltip
	$( document ).tooltip();
	$( document ).click(function(){
		closeDropmenu();
	});

	// profile blocks
	$('#profile_blocks').sortable({
		placeholder: 'ui-state-highlight',
		// http://stackoverflow.com/questions/5791886/jquery-draggable-shows-helper-in-wrong-place-after-page-scrolled
		helper: function(event, ui){
			var $clone =  $(ui).clone();
			$clone.css('position','absolute');
			return $clone.get(0);
		},		
	}).disableSelection();

	// resize
	//$(window).resize(onSize);
	
	/////////////////////////////////////////////////////////////////////////////
	// EDITOR
	/////////////////////////////////////////////////////////////////////////////
	$.extend(true, $.trumbowyg.langs, {
		fr: {
			align: 'Alignement',
			image: 'Image'
		}
	});

	$('.editor').trumbowyg(g_editor_opts);	
	
	// combobox
	$('.profile_combobox').combobox();
	$('.assessment_combobox').combobox();
	
	createSelect();
	
	// combobox event
	$('#cb_profile_activity input')
		.on("autocompleteselect", function(event, ui){
			//console.debug(label);
			var label = ui.item.label;
			switch (label){
				
				case 'OCL-X':
					$('#cb_exp_name_oclx').show();
					$('#cb_exp_name_yolox').hide();
					showProfileDesc(1);
					var txt = $('#cb_exp_name_oclx select option')[0].text;
					$('#cb_exp_name_oclx input').val(txt);
					break;
					
				case 'YOLO-X':
					$('#cb_exp_name_oclx').hide();
					$('#cb_exp_name_yolox').show();
					showProfileDesc(4);
					var txt = $('#cb_exp_name_yolox select option')[0].text;
					$('#cb_exp_name_yolox input').val(txt);
					break;
		}
	});
	
	$('#cb_exp_name_oclx input')
		.on("autocompleteselect", function(event, ui){
			var value = parseInt(ui.item.option.value);
			showProfileDesc(value);
		});

	$('#cb_exp_name_yolox input')
		.on("autocompleteselect", function(event, ui){
			var value = parseInt(ui.item.option.value);
			showProfileDesc(value);
		});
		
	showProfileDesc(1);
	var txt = $('#cb_exp_name_oclx select option')[0].text;
	$('#cb_exp_name_oclx input').val(txt);
	
	// spinner
	$('.assessment_spinner').spinner();
	
	// https://datatables.net/reference/option/dom
	
	createActivity();
	//createTask();
	$('.datatable').DataTable({
		//dom: '<"top"i>rt<"bottom"flp><"clear">',
		//dom: '<"top"f>',
		dom: '',
	});
	
	$('.datatable').on('draw.dt', function(){
		console.debug('redraw datatable');
		var jtbl = $(this),
				id = jtbl.attr('id')
		;
		console.debug('redraw', id);
		removeUnneedSorting(jtbl);
		if (id == 'tbl_search_activity'){
			toggleAllTasks(1);
		}
	});
	removeUnneedSorting($('.datatable'));	
 
	// calender
	$.datetimepicker.setLocale('en');
	$('.assessment_datetime').datetimepicker();                	
	
	setBalloonNumber('todolist', 3);
	setBalloonNumber('notice', 3);
	setBalloonNumber('msg', 5);
	
	// TABS
	$("#tabs").tabs({
		//active: starttab,
		activate: function(event, ui){
			//console.debug('activate');
			stopVideo();
			$('.dropmenu, .ocla_page').hide();
			var jobj = ui.newTab.find('a');
			var href = jobj.attr('href');
			console.debug(href);
			switch (href){
				
				case '#tabs-2':
					showProfileDesc(1);				
					break;
				
				case '#tabs-3':
					//openCreateActivity();
					break;
				
				//case '#tabs-4a':
				//	$('#tabs-4a').show();
				//	break;
					
				//case '#tabs-5a':
				//	$('#tabs-5a').show();
				//	break;
					
				case '#tabs-8b':
					openSearchActivity();
					break;
			}
		}
	});
	
	$('#tabs a')
		.hover(function(){
				
			var jobj = $(this);
			var tab = jobj.attr('href');
			//console.debug(tab);
			switch (tab){
				
				case '#tabs-4a':
					openDropmenu(jobj, 'ocla');
					//event.stopPropagation();
					break;

				case '#tabs-5a':
					openDropmenu(jobj, 'yolox');
					//event.stopPropagation();
					break;
				
				case '#tabs-8b':
					openDropmenu(jobj, 'activity');
					break;
					
				case '#tabs-1':
				case '#tabs-2':
				case '#tabs-3':
				case '#tabs-5':
					closeDropmenu();
					break;
			}
		})
	;
	// dropmenu
	$('.dropmenu').menu().hide();
	$('.dropmenu a').click(function(e){
		var jobj = $(this);
		var href = jobj.attr('href');
		//console.debug('dropmenu', href);
		if (href.indexOf('#search') == 0){
			$('.search_page').hide();
		} else if (href.indexOf('#tabs') == 0){
			$('.ui-tabs-panel').hide();
			$('.ocla_page').hide();
			if (href.indexOf('#tabs-4') == 0){
				$("#tabs").tabs("option", "active", TAB_OCLX);
			} else if (href.indexOf('#tabs-5') == 0){
				$("#tabs").tabs("option", "active", TAB_YOLOX);
			}
		}
		
		stopVideo();
		
		switch (href){
			case '#tabs-8a':// create activity
				openCreateActivity();
				break;
				
			case '#search_asm':
			case '#search_stp':
			case '#search_ntc':
			case '#search_msg':
			case '#search_gs':
				var type = href.split('_')[1].toUpperCase();
				openActivityAction(type);
				break;
			
			case '#search_view':
			case '#search_viewedit':
				openCreateActivity();
				break;
				
			case '#search_sendmsg':
				openMsg('');
				break;
				
			case '#search_searchppl':
				openSearchPeople();
				break;
				
			case '#search_eva':
				openEvaPage();
				break;

			case '#lang_THA':
			case '#lang_ENG':
				var lang = href.split('_')[1];
				var lang2 = window['LG_'+lang];
				switchLang(lang2);
				break;
				
			case '#search_gsgrades':
				opengsgrades();
				break;
				
			case '#search_asmmarks':
				openasmmarks();
				break;
				
		}
	});
	$('.action_button')
		.click(function(event){
			openDropmenu($(this), 'action', event);
		});
	$('.import_button')
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
	
	$('.but_trash').button({
		text: false,
		icons: {	primary: "ui-icon-trash"}
	}).mouseup(function(){	// work for mobile too
		onDelete(this);
	});
		
	// start page
	$('.ocla_page').hide();
	$("#tabs").tabs("option", "active", TAB_HOME);

	// show pages
	$('#tbl_root').show();	
	
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
	
	$('.toggle_type').toggles({
		type: 'select',
		//type: 'compact' // if this is set to 'select' then the select style toggle will be used
		drag: true, // allow dragging the toggle between positions
		click: true, // allow clicking on the toggle
		text: {
			on: 'OCL-X', 		// text for the ON position
			off: 'YOLO-X', 	// and off
		},
		on: false, // is the toggle ON on init
		animate: 150, // animation time (ms)
		easing: 'swing', // animation transition easing function
		checkbox: null, // the checkbox to toggle (for use in forms)
		clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
		width: 100, // width used if not set in css
		height: 20, // height if not set in css
	});
	
	$('.toggle_type').on('toggle', function(e, active) {
		var className = active?'.text_oclx_full':'.text_yolox_full';
		$('#td_activity_type')
			.text('('+getLangStr(className)+')')
			.addClass(className);
		$('.toggle_type');
	}).data('toggles').toggle(true);

	$('.toggle_impression').toggles({
		//type: 'select',
		type: 'compact', // if this is set to 'select' then the select style toggle will be used
		drag: true, // allow dragging the toggle between positions
		click: true, // allow clicking on the toggle
		text: {
			on: '<span class="text_enable"></span>', // text for the ON position
			off: '<span class="text_disable"></span>' // and off
		},
		on: true, // is the toggle ON on init
		animate: 150, // animation time (ms)
		easing: 'swing', // animation transition easing function
		checkbox: null, // the checkbox to toggle (for use in forms)
		clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
		width: 100, // width used if not set in css
		height: 20, // height if not set in css
	});
	
	$('.toggle_impression').on('toggle', function(e, active) {
		//$('#td_stamp2').text(active?'(Stamp proof is required from the coordinator)':'(Stamp proof is NOT required from the coordinator)')
		if (active){
			$('#div_gs').parent().parent().show();
			$('#div_gs').slideDown()	// show
		} else {
			$('#div_gs').slideUp();	// hide
			$('#div_gs').parent().parent().hide();
		}
		var label = active?'text_enable_gs':'text_disable_gs';
		$('#td_gs')
			.text(getLangStr('.'+label))
			.addClass(label)
		;

	}).data('toggles').toggle(true);
	
	$('#td_gs').text(getLangStr('.text_enable_gs'))
	
	$('.toggle_assess').toggles({
		//type: 'select',
		type: 'compact', // if this is set to 'select' then the select style toggle will be used
		drag: true, // allow dragging the toggle between positions
		click: true, // allow clicking on the toggle
		text: {
			on: '<span class="text_enable"></span>', // text for the ON position
			off: '<span class="text_disable"></span>' // and off
		},
		on: true, // is the toggle ON on init
		animate: 150, // animation time (ms)
		easing: 'swing', // animation transition easing function
		checkbox: null, // the checkbox to toggle (for use in forms)
		clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
		width: 100, // width used if not set in css
		height: 20, // height if not set in css
	});
	
	$('.toggle_assess').on('toggle', function(e, active) {
		//$('#td_stamp2').text(active?'(Stamp proof is required from the coordinator)':'(Stamp proof is NOT required from the coordinator)')
		if (active){
			$('#div_assess_method').parent().parent().show();
			$('#div_assess_method').slideDown()	// show
		} else {
			$('#div_assess_method').slideUp();	// hide
			$('#div_assess_method').parent().parent().hide();
		}
		var label = active?'text_enable_assess':'text_disable_assess';
		$('#td_assess')
			.text(getLangStr('.'+label))
			.addClass(label)
		;
	}).data('toggles').toggle(true);
		
	$('#td_assess').text(getLangStr('.text_enable_assess'))
		
	// default toggle on
	//$('#toggle_activity_type').data('toggles').toggle(true);
	
	$('.assess_assessment_button').click(function(){
		console.debug('assess_assessment_button');
		assessAssessment(this);
	});
	
	$('#dialog_assessment').dialog({
		modal: true,
		autoOpen: false,
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
	});
	// 
	// http://bernii.github.io/gauge.js/
	//
	var gauge = $('.status_gauge').gauge({
		lines: 12, // The number of lines to draw
		angle: 0.15, // The length of each line
		lineWidth: 0.44, // The line thickness
		pointer: {
			length: 0.49, // The radius of the inner circle
			strokeWidth: 0.053, // The rotation offset
			color: '#000000' // Fill color
		},
		limitMax: 'false',   // If true, the pointer will not go past the end of the gauge
		colorStart: '#6FADCF',   // Colors
		colorStop: '#8FC0DA',    // just experiment with them
		strokeColor: '#E0E0E0',   // to see which ones work best for you
		generateGradient: true,
		percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
	});
	gauge.each(function(){
		var jgauge = $(this);
		var jtext = jgauge.parent().find('div');
		var gauge0 = jgauge.data().gauge;
		//gauge0.setTextField(jtext[0]);
		//gauge0.animationSpeed = 32; // set animation speed (32 is default value)
		//gauge0.maxValue = 5; // set max gauge value
		var user = jgauge.attr('user'),
			value = 0
		;
		switch (user){
			case 'samson': value = 3.6; break;
			case 'chole': value = 3.6; break;
		}
		gauge0.set(value);		
	});
	
	// jquery.star-rating-svg
	// http://github.com/nashio/star-rating-svg
	$('.gs_rating').starRating({
    initialRating: 0,
		totalStars: 5,
		starSize: 24,
		strokeWidth: 0,
		useGradient: false,		
		emptyColor: 'lightgray',
		hoverColor: 'salmon',
		activeColor: 'cornflowerblue',		
    disableAfterRate: false,
    callback: function(currentRating, $el){
			calcAvGauge(currentRating, $el);
    },
    onHover: function(currentIndex, currentRating, $el){
			//calcAvGauge(currentRating, $el);
		},
    onLeave: function(currentIndex, currentRating, $el){
      //console.log('index: ', currentIndex, 'currentRating: ', currentRating, ' DOM element ', $el);
      //$('.live-rating').text(currentRating);
    },
  });
	// READ ONLY
	$('.gs_rating2').starRating({
		readOnly: true,
    disableAfterRate: false,
    initialRating: 0,
		totalStars: 5,
		starSize: 16,
		strokeWidth: 0,
		useGradient: false,		
		emptyColor: 'white',
		hoverColor: 'white',
		activeColor: 'cornflowerblue',		
    callback: function(currentRating, $el){
			calcAvGauge(currentRating, $el);
    },
    onHover: function(currentIndex, currentRating, $el){
			//calcAvGauge(currentRating, $el);
		},
  });
	var i = 0, gsarr = $('#tbl_gsgrades .gs_rating2');
	[4, 3.5, 3.5, 4.5, 4, 4].forEach(function(rating){
		var jstar = gsarr.eq(i++);
		jstar.starRating('setRating', rating);
	});
	var i = 0, commentarr = $('#tbl_gsgrades .gs_text_box');
	['Good work! Wilson has outstanding team-building skills and builds a team-oriented attitude among all teammates. (Prof. David Japser)', 'Well done! Marianna has an extraordinary ability to turn a group into a team and pulls people together into a cooperative and successful team. (Ian smith)'].forEach(function(s){
		commentarr.eq(i++).text(s);
	});
	
	// autosize (autogrow)
	autosize($('textarea.autogrow'));
	
	// uniform checkbox
	$('input[type=checkbox]').uniform();
	
	$('#cb_assessment,#cb_notice,#cb_message').change(function(){
		toggleAllTasks(1);
	});
	$('.details_button').click(function(){
		toggleDetails(this);
	});
	
	$('.tbl_chole td').click(function(){
		openChloePage(1);
	});
	$('a[href=\\#tabs-3]').click(function(){
		openChloePage(0);
	});
	$('a[href=\\#tabs-8b]').click(function(){
		console.debug('tabs-8b');
		$('#tabs-8a').hide();
		$('#tabs-8b').show();
	});

	$('#dialog_msg .trumbowyg-editor').keypress(function(event){
		if (event.which == 13) {
			event.preventDefault();
			sendMsg();
		}		
	});
	
	$('.msg_button').click(function(event){
		openMsg('');
		event.stopPropagation();
	});
	
	initgsgrades();
	
	setMyUser('samson');
	//setMyUser('ian');

	// clear selection
	$('#tbl_gskills input.custom-combobox-input').val('');
	$('#div_assess_method input.custom-combobox-input').val('');
	
	// placeholder for div_skills
	$('.div_skills input').attr('placeholder', 'Select or input a generic skill')
	
	
	switchLang(LG_ENG);
	//switchLang(LG_THA);

	// exit for production version
	if (g_bProduction){
		return;
	}
/*
	// create activity
	$("#tabs").tabs("option", "active", TAB_ACTIVITY); $('.ocla_page').hide(); $('#tabs-8a').show();
	var jdetails = $('.tr_method_headline td:nth-child(4) button.details_button');
	jdetails.eq(6).click();	// learning contract
	setTimeout(function(){
		$(document).scrollTop(50000);
	}, 500);
	//opengsgrades();
*/

	// search activity
	$("#tabs").tabs("option", "active", TAB_ACTIVITY); $('.ocla_page').hide(); $('#tabs-8b').show();
	toggleAllTasks();
	
	//$("#tabs").tabs("option", "active", TAB_NTWK); openChloePage(1);	// search other's homepage
	//$("#tabs").tabs("option", "active", TAB_PROFILE);
	//$("#tabs").tabs("option", "active", TAB_ACTIVIY);
	//return;
	
	///////////////////////
	// TESTING
	///////////////////////
	// show tab
	//$('.ui-tabs-panel').hide();
	//$('.ocla_page').hide();
	
	// OCLX
	//$("#tabs").tabs("option", "active", TAB_OCLX);
	//$('.ocla_page').hide(); $('#tabs-4d').show();
	//var but = $('#tabs-4d .details_button')[0];
	//but.onclick();
		
	// YOLO
	//$("#tabs").tabs("option", "active", TAB_YOLOX);
	//$('.ocla_page').hide(); $('#tabs-5c').show();
	//var but = $('#tabs-5c .details_button')[0];
	//but.onclick();
}

/////////////////////////////////////////////////////////////////////////////////////

function onDelete(but){
	//if (confirm('Are you sure to delete this?')){
    $( "#dialog-confirm" ).dialog({
      modal: true,
      resizable: false,
      height:180,
      buttons: {
        "Yes": function() {
          $( this ).dialog( "close" );
					
					var jbut = $(but),
							jtd = jbut.parent(),
							jtr = jtd.parent(),
							jtbody = jtr.parent(),
							jtrs = jtbody.find('tr'),
							length = jtrs.length,
							index = jtrs.index(jtr)
					;
					//console.debug(index, length);
					if (index == length - 1){
						jtr.find('textarea').val('').css('height', '');
						jtr.find('div.autogrow-textarea-mirror').html('');
					} //else 
					{
						jtr.remove();
					}

					$('.div_details').each(function(){
						var num = 1;
						$(this).find('.assessment_num').each(function(){
							$(this).text((num++) + '.');
						});
						var code = 65; // begin from A
						$(this).find('.mcq_letter').each(function(){
							$(this).text(String.fromCharCode(code++) + '.');
						});
					});
				
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });		
		
	//}
}


//////////////////////////////////////////////////////////////////////
 
 function setBalloonNumber(name, num){
	var jobj = $('#topmenu_'+name), jballoon = jobj.find('.balloon'), jtext = jobj.find('.balloon2');
	if (num){
		if (num > 99){
			num = 99;
		}
		var offset = jobj.offset(), x = offset.left, y = offset.top, w = jobj.width(), w1 = num.toString().lenth*10;
		jtext.text(num);
		jballoon.show();
	} else {
		jballoon.hide();
	}
}

//////////////////////////////////////////////////////////////////////
 
function toggleDropmenu(obj, menu){
	var jobj = $(obj), jmenu = $("#dropmenu_"+menu);
	if (jmenu.css('display') != 'none'){
		console.debug('toggleDropMenu', 'close');
		jmenu.hide();
	} else {
		console.debug('toggleDropMenu', 'open');
		openDropmenu(obj, menu);
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

function toggleMyUser(){
	if (myuser == 'samson'){
		setMyUser('ian');
	} else {
		setMyUser('samson');
	}
}

///////////////////////////////////////////////////////////////////////

function setMyUser(user){
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
	$('.name_myself').html(name);
	$('.curriculum_myself').html(curriculum);
	$('.photo_myself,.photo_myself2').attr('src', './people/' + photo)
	//var p = $('.photo_myself').parent();	p.html('<img src="./people/' + photo + '.jpg" class="photo_myself"/>')
	
}


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
	//console.debug('showProfileDesc', index, obj.youtube);
	$('#div_profile_desc').html(obj.text);
	$('#img_profile_desc').attr('src', obj.img);
	$('#addexp_priv1').prop('checked', true);
	$('#video_profile_desc').html('<iframe class="ifrm_youtube" src="' + obj.youtube + '" frameborder="0" allowfullscreen></iframe>');
}

// <video width="800" height="480" controls="1"><source type="video/mp4"/></video>
//$('#video_profile_desc').html('<video width="800" height="480" controls="1"><source type="video/mp4" src="' + obj.video + '"/></video>');
//console.debug(obj.video, $('#video_profile_desc').html());

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

function changePerson(name){
	console.debug('changePerson', name)
	$('.ocla_page').hide();
	$("#tabs").tabs("option", "active", TAB_HOME);
	setMyUser('samson');
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
 
function closeDropmenu(){
	//console.trace('closeDropMenu')
	$('.dropmenu').hide();
		//$('.dropmenu, .ocla_page').hide();
}

//////////////////////////////////////////////////////////////////////

function createActivity(){
	$('.dropmenu, .ocla_page').hide();
	$('#tabs-8a').show();
}

//////////////////////////////////////////////////////////////////////

function openModal(jdiv){
	//console.debug(jdiv[0].outerHTML);
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


///////////////////////////////////////////////////////////////

function toggleAllTasks(bNoChangeCheckbox){
	console.debug('toggleAllTasks', bNoChangeCheckbox?1:0);
	
	var created = createTask();
	
	// CHECK VISIBLITY
	var visible = 0;
	$('.div_act_details').each(function(){
		var jdiv = $(this);
		if (isVisible(jdiv)){
			visible++;
		}
	});
	if (!bNoChangeCheckbox){
		if (!visible){
			$('#cb_assessment').prop('checked', true);
			$('#cb_notice').prop('checked', true);
			$('#cb_message').prop('checked', true);
		} else {
			$('#cb_assessment').prop('checked', false);
			$('#cb_notice').prop('checked', false);
			$('#cb_message').prop('checked', false);
		}
		$.uniform.update();
	}
	// FILTER
	var assessment = $('#cb_assessment').prop('checked')?1:0,
			notice = $('#cb_notice').prop('checked')?1:0,
			message = $('#cb_message').prop('checked')?1:0
	;
	// SHOW/HIDE EACH ROW
	$('.div_act_details').each(function(){
		var jdiv = $(this),
				type = jdiv.attr('tasktype')
		;
		var bShow = 0;
		switch (type){
			case 'GS':
			case 'EVA':
			case 'ASM':
			case 'STP':
				if (assessment)	bShow = 1;
				break;
			case 'NTC':	if (notice)			bShow = 1;	break;
			case 'MSG':	if (message)		bShow = 1;	break;
		}
		if (bShow){
			jdiv.parent().parent().show();
			if (created){
				jdiv.show();
			} else {
				jdiv.slideDown('slow', function(){});
			}
		} else {
			jdiv.slideUp('slow', function(){
				jdiv.parent().parent().hide();
			});
		}
	});

	
}

///////////////////////////////////////////////////////////////

function openChloePage(bShow){
	console.debug('chole', bShow);
	$("#tabs").tabs("option", "active", TAB_NTWK);
	if (bShow){
		$('#div_ntwk').hide();
		$('#div_chole').slideDown();
	} else {
		$('#div_ntwk').show();
		$('#div_chole').slideUp();
	}
}

///////////////////////////////////////////////////////////////

function openCreateActivity(){
	$("#tabs").tabs("option", "active", TAB_ACTIVITY);
	$('#tabs-8b').hide();	
	setTimeout(function(){	// settimeout prevent scrolling down
		$('#tabs-8a').show();	
		var obj = g_activity_arr[2];
		$('#div_search_desc').html('<iframe class="ifrm_youtube" src="' + obj.youtube + '" frameborder="0" allowfullscreen></iframe>');
	}, 100);
	
}

///////////////////////////////////////////////////////////////

function openSearchActivity(){
	$("#tabs").tabs("option", "active", TAB_ACTIVITY);
	$('.ocla_page').hide();
	$('#tabs-8b').show();
	setTimeout(function(){
		toggleAllTasks(1);
	}, 50);	
}

//////////////////////////////////////////////////////////////////////
 var	g_activity_index = 0,
			g_task_index = 0
			//g_person_name = ''
;
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
	//console.debug('openDropmenu', menu);	//, g_activity_index, g_task_index, tasktype); debugger;
	switch (menu){
		case 'action':
			// PER ACTIVITY
			var jtr = jobj.parent().parent();
			// global variable!!
			g_activity_index = jtr.attr('index');
			g_task_index = -1;
			console.debug('openDropmenu1', menu, g_activity_index);
			
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
			console.debug('openDropmenu2', menu, g_activity_index, g_task_index, tasktype);
			var tasktype2 = tasktype.toLowerCase();
			var s1 = "#dropmenu_searchact li a[href!='\\#search_"+ tasktype2 +"']",
					s2 = "#dropmenu_searchact li a[href='\\#search_"+ tasktype2 +"']"
			;
			//console.debug(tasktype2, g_activity_index);
			$(s1).parent().hide();
			$(s2).parent().show();
			console.debug(tasktype);
			//console.debug($('#dropmenu_searchact li:last-child a').length);
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
}

///////////////////////////////////////////////////////////////////////////

function createTask(){
	var created = 0;
	//if (!$('#tbl_search_activity .td_task').length){
	if (!$('.div_act_details').length){
		// CREATE TASK LIST
		$('#tbody_search_activity > tr[role=row]').each(function(){
			var jtr = $(this),
					index = parseInt(jtr.attr('index'))	// activity index
			;
			var trs = '';
			if (!isNaN(index)){
				var profile = g_activity_arr[index];
				if (profile && profile.tasks){
					var tasks = profile.tasks;
					for (var i = tasks.length - 1; i >= 0; i--){
						var task = tasks[i];
						var svg = '', btnsvg = '', btntext = '';
						switch (task.type){
							case 'GS':
							case 'ASM':
							case 'EVA':
							case 'STP':
								svg = 'pin'; ;
								btnsvg = 'fill';
								btntext = 'Perform';
								break;
							case 'NTC':
								svg = 'notice';
								btnsvg = 'eye';
								btntext = '&nbsp;&nbsp;View&nbsp;&nbsp;';
								break;
							case 'MSG':
								svg = 'message';
								btnsvg = 'reply';
								btntext = 'Response';
								break;
						}
						// ADD TO DATATABLE ROW
						$(
							'<tr>'
								+ '<td>&nbsp;</td>'
								+ '<td classx="td_task" colspan="6">'
									+ '<div class="div_act_details" tasktype="' + task.type + '" taskindex="' + i + '" index="'+index+'">'
										+ '<table cellspacing="0" cellpadding="0" border="0">'
											+ '<tr>'
												+ '<td>'
													+ '<span class="svg_container" svg="' + svg + '" svgfill="black" svgsize="16"></span>'
													+ '&nbsp;' + task.title
												+ '</td>'
												+ '<td style="width:100px; text-align:center">' + task.start + '</td>'
												+ '<td style="width:100px; text-align:center">' + task.end + '</td>'
												+ '<td style="width:80px;">&nbsp;</td>'
												+ '<td style="width:25px; text-align:center">'
													+ '<span class="svg_container searchact_button" svg="settings" svgsize="18" svgfill="gray" style="cursor:pointer"></span>'
												+ '</td>'
											+ '</tr>'
										+ '</table>'
									+ '</div>'
								+ '</td>'
							+ '</tr>'
						).insertAfter(jtr);
						created++;
					}
				}
			}
		});
		if (created){
			
			// link button click
			$('.searchact_button')
				.click(function(event){
					console.debug('searchact...');
					openDropmenu($(this), 'searchact', event);
				});
			
			// REDRAW SVG
			drawSvg($('#tbody_search_activity .svg_container'));
		}
	}
	return created;
}

////////////////////////////////////////////////////////

function openActivityAction(type, index){
	var btns = 0;
	switch (type){
		case 'ASM':
			btns = {
				Submit: function() {
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				},
			};		
			break;
			
		case 'GS':
		case 'EVA':
		case 'STP':
			btns = {
				Save: function() {
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				},
			};		
			break;
			
		case 'NTC':
		case 'MSG':
			btns = {
				Send: function(){
					sendMsg('#dialog_msg');
				},
				Close: function() {
					$( this ).dialog( "close" );
				},
			};
			break;
	}
	var type2 = type.toLowerCase();
	//console.debug('openActivityAction', type2, g_activity_index);
	
	var activity = g_activity_arr[g_activity_index],
			task = activity && g_task_index >= 0?activity.tasks[g_task_index]:'';
			title = getLangStr('dialog_'+type2);
	//$('#dialog_'+type2).attr('title', title);
	setDialogTitle('dialog_'+type2);
	$('#'+type2+'_title').text(activity.title);
	$('#'+type2+'_date').text(activity.start + ' - ' + activity.end);
	//console.debug(type2);	debugger;
	
	switch (type){
		
			case 'MSG':
				openMsg('', 1);
				break;
				
			default:
				$('#dialog_' + type2).dialog({
					modal: true,
					width: 'auto',
					height: 'auto',
					buttons: btns,
				});
	}

	switch (type){
		
		case 'GS':
			$('#tbl_gs span.gs_rating').each(function(){
				$(this)
					.attr('rating','')
					.starRating('setRating', 0);
			});
			$('#gs_task').html(task.title);
			setGauge1($('#mygauge1'), 0);
			setGauge1($('#mygauge2'), 0);
			break;
			
		case 'ASM':
			if (task.question){
				$('#asm_question').html(task.question);
			}
			break;
			
		case 'EVA':
			//$('#tbl_eva span.gs_rating2').each(function(){
			//	$(this)
			//		.attr('rating','')
			//		.starRating('setRating', 0);
			//});
			$('#eva_task').html(task.title);
			break;
			
		case 'NTC':
			$('#td_search_ntc_contents').html(task.html);
			break;
			
		case 'MSG':
			//$('#dialog_msg .trumbowyg-editor').focus();
			break;
		
	}
}

////////////////////////////////////////////////////////////////////

function createSelect(){
	for (var i = 1; i < g_activity_arr.length; i++){
		var activity = g_activity_arr[i];
		var type = i < 4 ? 'oclx' : 'yolox';
		var selected = '';	//= i == 1 ? ' selected' : '';
		$('#cb_exp_name_' + type + ' select').append('<option value="' + i + ' ' + selected + '">'+activity.title+'</option>');
	}
}


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

///////////////////////////////////////////////////////

function openEvaPage(){
	//$('#dialog_eva').show();
	var activity = g_activity_arr[g_activity_index],
			task = activity && g_task_index >= 0?activity.tasks[g_task_index]:'';
	;
	$('#eva_title').html(activity.title);
	$('#eva_task').html(task.title);
	$('#eva_date').html(task.start);

	$('.dropmenu, .ocla_page').hide();
	$('#tabs-8c').show();
}

//////////////////////////////////////////////////////////

function setGauge1(jgauge1, value){
	jgauge1.parent().find('.preview-textfield').html(value);
	var data = jgauge1.data();
	if (data){
		// delete otherwise the pointer or color will not be gone
		// and create the gauge again
		var opts = data.gauge.options;
		delete data.gauge
		data.gauge = new Gauge(jgauge1[0]).setOptions(opts);
	} //else 
	
	if (data.gauge){
		var gauge = data.gauge;
		gauge.set(value);
	}
}

////////////////////////////////////////////////////////////////////
var
	g_details_button = '<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"><svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 18.453 18.453" style="width: 16px; height: 16px;" xml:space="preserve"><rect x="2.711" y="4.058" width="8.23" height="1.334"></rect><path d="M14.972,14.088c0.638-1.127,0.453-2.563-0.475-3.49c-0.549-0.549-1.279-0.852-2.058-0.852c-0.779,0-1.51,0.303-2.059,0.852s-0.852,1.279-0.852,2.059c0,0.777,0.303,1.508,0.852,2.059c0.549,0.547,1.279,0.85,2.057,0.85c0.507,0,0.998-0.129,1.434-0.375l3.262,3.262l1.101-1.102L14.972,14.088z M13.664,13.881c-0.652,0.652-1.796,0.652-2.448,0c-0.675-0.676-0.675-1.773,0-2.449c0.326-0.326,0.762-0.506,1.225-0.506s0.897,0.18,1.224,0.506s0.507,0.762,0.507,1.225S13.991,13.554,13.664,13.881z" fill="black"></path><path d="M13.332,16.3H1.857c-0.182,0-0.329-0.148-0.329-0.328V1.638c0-0.182,0.147-0.329,0.329-0.329h11.475c0.182,0,0.328,0.147,0.328,0.329V8.95c0.475,0.104,0.918,0.307,1.31,0.597V1.638C14.97,0.735,14.236,0,13.332,0H1.857C0.954,0,0.219,0.735,0.219,1.638v14.334c0,0.902,0.735,1.637,1.638,1.637h11.475c0.685,0,1.009-0.162,1.253-0.76l-0.594-0.594C13.772,16.347,13.426,16.3,13.332,16.3z" fill="black"></path><rect x="2.711" y="7.818" width="8.23" height="1.334"></rect></svg></span>&nbsp; Details</button>',
	g_pecentage_spinner = '<input class="assessment_spinner" value="0" style="width:25px"/>',
	g_trash_button = '<button class="icon_button but_trash ui-button ui-widget ui-state-default ui-corner-all ui-button-icon-only" role="button" title="" onclick="onDelete(this)"><span class="ui-button-icon-primary ui-icon ui-icon-trash"></span><span class="ui-button-text"></span></button>'
;

function addSkill(obj){
	var jobj = $(obj),
			jtbl = jobj.parents('.tbl_skills1'),
			jskill = jtbl.find('input.custom-combobox-input'),
			jtbody = jtbl.find('.tbl_skills2 tbody')
	;
	
	var skill = jskill.val();
	if (skill != ''){
		// check if it already exists
		var bFound = 0;
		jtbody.find('td:first-child').each(function(){
			var skill0 = $(this).text().trim();
			//console.debug(skill, skill0);
			if (skill0 == skill){
				bFound = 1;
				return;
			}
		});
		if (bFound){
			showErrDialog('Error', 'This skill already exists')
		} else {
			//var trs = '<tr role="row"><td class="sorting_1">'+skill+'</td><td>'+g_pecentage_spinner+'</td><td>'+g_details_button+'</td><td>'+g_trash_button+'</td></tr>';
			//console.debug(trs);
			//console.debug($('#tbl_gskills2 .datatable tbody').length)
			//var trs = '<tr role="row"><td class="sorting_1">'+skill+'</td><td>'+g_pecentage_spinner+'</td><td>'+g_details_button+'</td><td>'+g_trash_button+'</td></tr>';
			//$('#tbl_gskills2 .datatable tbody').append(trs);
			//$('#tbl_gskills2 .datatable tbody .assessment_spinner').spinner();
			var trs = '<tr role="row"><td class="sorting_1">'+skill+'</td><td>'+g_details_button+'</td><td>'+g_trash_button+'</td></tr>';
			jtbody.append(trs);
			jskill.val('');
		}
	}
}

/////////////////////////////////////////////////////////////////////////

function showErrDialog(title, msg){
	//console.debug('onError', obj);
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

////////////////////////////////////////////////////////////////////

function openMsg(partner, bAddTheirMsg){
	if (partner == ''){
	}
	//$('#div_msg_partner').text(partner);
	// clear first
	$('#div_msgout_inner').html('');
	$('#dialog_msg .trumbowyg-editor').html('');
	g_msg_index = 0;
	if (bAddTheirMsg){
		addTheirMsg();
	}
	$('#dialog_msg').dialog({
		modal: true,
		autoOpen: true,
		resizable: false,
		width:'auto',		
		height:'auto',		
		buttons: {
			Send: function(){
				sendMsg();
			},
			Close: function(){
				$(this).dialog("close");
			},
		},	
	});
	setTimeout(function(){
		$('#dialog_msg .trumbowyg-editor').focus();	
	}, 500);
}

////////////////////////////////////////////////////////////////////////

var g_msg_arr = [
			'How are you?',
			'I\'m fine. Thanks. And you?',
			'I am fine too.',
			'Have you completed the assessments?',
			'Yes.',
			'That is great! I have completed the survey and now I am working on reflective journal.',
			'Cool!',
			'Let me read your essay later.',
			'Okay.',
		],
		g_msg_index = 0,
		g_timeout_theirmsg = 0
;
function addTheirMsg(){
	var time = getDateString();
	var msg = g_msg_arr[g_msg_index];
	if (++g_msg_index >= g_msg_arr.length) g_msg_index = 0;
	$('#div_msgout_inner').append('<div class="bubble them">'+time+msg+'</div>');	
	clearTimeout(g_timeout_theirmsg);
	g_timeout_theirmsg = 0;
	scrollMsg();
}

////////////////////////////////////////////////////////////////////////

function addMyMsg(){
	var time = getDateString();
	var msg = g_msg_arr[g_msg_index];
	if (++g_msg_index >= g_msg_arr.length) g_msg_index = 0;
	$('#div_msgout_inner').append('<div class="bubble me">'+time+msg+'</div>');	
	scrollMsg();
}

////////////////////////////////////////////////////////////////////////

function scrollMsg(){
	var h = 0;
	$('#div_msgout_inner div').each(function(){
		h += $(this).height() + 100;
	})
	//console.debug('scrollMsg', h);
	$('#div_msgout').animate({
    scrollTop: h,
	});
}

////////////////////////////////////////////////////////////////////////

function sendMsg(){
	// send previous message
	if (g_timeout_theirmsg){
		addTheirMsg();
	}
	var msg = $('#dialog_msg .trumbowyg-editor').html();
	addMyMsg();
	$('#dialog_msg .trumbowyg-editor')
		.html('')
		.focus()
	;
	g_timeout_theirmsg = setTimeout(addTheirMsg, 1000);
}

/////////////////////////////////////////////////////////////////////////////

function getTimeString(){
	var d = new Date();
	return get2Digits(d.getHours()) + ":" + get2Digits(d.getMinutes());
}

/////////////////////////////////////////////////////////////////////////////

function getDateString(){
	var d = new Date();
	return '<div class="date_string">' +
		d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' +
		get2Digits(d.getHours()) + ':' + get2Digits(d.getMinutes())
		//+ ':' + get2Digits(d.getSeconds())
		+ '</div>'
	;
}

///////////////////////////////////////////////////////////////////////////////

function get2Digits(n) {
    return (n < 10 ? '0' + n : n).toString();
}

///////////////////////////////////////////////////////////////////////////////

function switchLang(lang){
	console.debug('switchLang', lang);
	g_curr_lang = lang;
	$.each(g_lang_map, function(index, value) {
    //console.debug(index, value);
		var text = value[lang],
			jobj = $(index)
		;
		if (!jobj.length){
			//console.error(index, ' cannot find the index');
			//debugger;
		} else {
			var tagname = jobj.prop("tagName");
			//console.debug(tagname, text);
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

/////////////////////////////////////////////////////////

function calcAvGauge(currentRating, $el){
	//console.log('index: ', currentIndex, 'currentRating: ', currentRating, ' DOM element ', $el);
	// save
	$el.attr('rating', currentRating);
	// find overall
	var jtbody = $el.parent().parent().parent();
	//console.debug(currentRating, jtbody);
	var number = 0, total = 0;
	jtbody.find('span[rating]').each(function(){
		var rating = parseFloat($(this).attr('rating'));
		if (typeof(rating) != 'undefined' &&  !isNaN(rating)){
			total += rating;
		}
		number++;
	});
	var av = Math.floor((total / number) * 10) / 10;
	//console.debug('total=', total, 'number=', number, 'av=', av);
	// FIND & SET GAUGE
	var jgauge1 = jtbody.parent().parent().parent().find('.status_gauge');
	setGauge1(jgauge1, av);
}

/////////////////////////////////////////////////////////

function initgsgrades(){
	$('.datatable_printable').DataTable({
		dom: 'B',
		buttons: [{
			extend: 'print',
			exportOptions: {
					format: {
							body: function(data, column, row){
								var data2 = data;
								switch (column){
									case 4:	// overall
										data2 = $(data).text();	// remove the canvas
										break;
								}
								return data2;
							}
					},
			},
			customize: function ( win ) {
			
				var jbody = $(win.document.body);
				jbody
					.css('text-align', 'center')
					.css('padding', '8px')
					.css('font-size', '10pt' )
					//.prepend('<img src="http://yolofolio.cetl.hku.hk/images/yocle_logo.png" style="position:absolute; top:0; left:0;" />')
					.find( 'table' )
					.addClass('compact')
					.css( 'font-size', 'inherit');
				var 
						jtbl = jbody.find('> table'),
						jthead = jtbl.find('> thead'),
						jtbody = jtbl.find('> tbody')
				;
				jtbl.css('width', 780);
			
				switch (g_dialog_type){
				
					case 'dialog_gsgrades':
						jthead.find('> tr > th:nth-child(1)').css('width', 1).css('text-align', 'left').hide();			// photo
						jthead.find('> tr > th:nth-child(2)').css('width', 120).css('text-align', 'left');		// name
						jthead.find('> tr > th:nth-child(3)').css('width', 220).css('text-align', 'left');		// generic skills
						jthead.find('> tr > th:nth-child(4)').css('width', 300).css('text-align', 'left');		// comments
						jthead.find('> tr > th:nth-child(5)').css('width', 80).css('text-align', 'center').css('padding', 0);		// overall
							
						jtbody.find('> tr > td:nth-child(1)').hide();												// photo
						jtbody.find('> tr > td:nth-child(2)').css('text-align', 'left');		// name
						var td_gs = jtbody.find('> tr > td:nth-child(3)').css('width', 220);;									// generic skills
						jtbody.find('> tr > td:nth-child(4)').css('text-align', 'left');		// comments
						jtbody.find('> tr > td:nth-child(5)').css('text-align', 'center');	// overall
						td_gs.find('table').width('100%');
						td_gs.find('td:nth-child(1)').prop('nowrap', true).css('width', 130);
						td_gs.find('td:nth-child(2)').prop('nowrap', true).css('width', 90);
						break;
						
					case 'dialog_asmmarks':
						jthead.find('> tr > th:nth-child(1)').css('width', 1).css('text-align', 'left').hide();			// photo
						jthead.find('> tr > th:nth-child(2)').css('width', 120).css('text-align', 'left');			// name
						jthead.find('> tr > th:nth-child(3)').css('width', 80).css('text-align', 'center').css('padding', 0);			// marks
						jthead.find('> tr > th:nth-child(4)').css('width', 300).css('text-align', 'left');		// comments
							
						jtbody.find('> tr > td:nth-child(1)').hide();													// photo
						jtbody.find('> tr > td:nth-child(2)').css('text-align', 'left');			// name
						jtbody.find('> tr > td:nth-child(3)').css('text-align', 'center');		// marks
						jtbody.find('> tr > td:nth-child(4)').css('text-align', 'left');			// comments
						break;
				}
			},
		}]
	});
}

///////////////////////////////////////////////////////////////////////////////
var g_dialog_type = '';

function opengsgrades(){
	g_dialog_type = 'dialog_gsgrades';
	var title = getLangStr('dialog_gsgrades'),
			activity = g_activity_arr[g_activity_index],
			task = activity && g_task_index >= 0?activity.tasks[g_task_index]:''
	;
	$('#gsgrades_title').text(activity?activity.title:'');
	$('#gsgrades_date').text((activity?activity.start:'') + ' - ' + (activity?activity.end:''));
	$('#gsgrades_task').text(task?task.title:'');
	$('.buttons-print').hide();
	
	$('#dialog_gsgrades')
		.dialog({
			modal: true,
			title: title,
			autoOpen: true,
			resizable: false,
			width:'auto',		
			height:'auto',		
			buttons: {
				Print: function(){
					$('#dialog_gsgrades .buttons-print').click();
				},
				Close: function(){
					$(this).dialog("close");
				},
			},	
		});
}

/////////////////////////////////////////////////////////////////////////////////////////

function openasmmarks(){
	g_dialog_type = 'dialog_asmmarks';
	var title = getLangStr(g_dialog_type),
			activity = g_activity_arr[g_activity_index],
			task = activity && g_task_index >= 0?activity.tasks[g_task_index]:''
	;
	$('#asmmarks_title').text(activity?activity.title:'');
	$('#asmmarks_date').text((activity?activity.start:'') + ' - ' + (activity?activity.end:''));
	$('#asmmarks_task').text(task?task.title:'');
	$('.buttons-print').hide();
	$('#dialog_asmmarks')
		.dialog({
			modal: true,
			title: title,
			autoOpen: true,
			resizable: false,
			width:'auto',		
			height:'auto',		
			buttons: {
				Print: function(){
					$('#dialog_asmmarks .buttons-print').click();
				},
				Close: function(){
					$(this).dialog("close");
				},
			},	
		});
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function setDialogTitle(name){
	$('#' + name).parent().find('.ui-dialog-title').text(getLangStr(name));
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function assessAssessment(obj){
	var activity = g_activity_arr[g_activity_index],
			task = activity && g_task_index >= 0?activity.tasks[g_task_index]:'';
			jbut = $(obj),
			person_name = jbut.parent().parent().find('td:nth-child(2)').html()
	;
	$('#eva_title2').html(activity.title);
	$('#eva_task2').html(task.title);
	$('#eva_date2').html(task.start);
	$('#eva_name2').html(person_name);
	$('#td_eva_contents').html(task.html);
	
	// assess assessment
	setDialogTitle('dialog_eva');
	
	$('#dialog_eva')
		.dialog({
			modal: true,
			autoOpen: true,
			resizable: false,
			width:'auto',
			height:'auto',
			buttons: {
				Submit: function() {
					$( this ).dialog( "close" );
				},
				Cancel: function() {
					$( this ).dialog( "close" );
				},
			},
			//open:function(event, ui){
				//$('#dialog_eva').attr('title', ''); // avoid tooltip
			//},
		});
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function onChangeLikertScale(obj){
	var jobj = $(obj),
		scale = parseInt(jobj.val()),
		jtbl1 = jobj.parents('.tbl_details').eq(0),
		jtbl2 = jtbl1.find('.tbl_rubrics')
	;
	var showarr = [1,1,1,1,1]
	switch (scale){
		case 3:
			showarr[1] = 
			showarr[4] = 0;
			break;
		case 4:
			showarr[3] = 0;
			break;
		case 5:
			break;
	}
	//console.debug('scale', scale, showarr);
	var i = 1;
	showarr.forEach(function(bShow){
		jtbl2.find('> tbody > tr > td:nth-child(' + (i++) + ')').css('display', bShow?'':'none');
	});
}

///////////////////////////////////////////////////////////////

function createActivity(){
	// assign desc
	for (var i = 1; i < g_activity_arr.length; i++){
/*	
		var obj = g_activity_arr[i];
		$('.div_title[index='+i+']').html(obj.title);
		$('.div_date[index='+i+']').html(obj.date);
		$('.div_desc[index='+i+']').html(obj.text);
		$('.img_act[index='+i+']').attr('src', obj.img);
		$('.ifrm_youtube[index='+i+']').attr('src', obj.youtube);
*/
		var a = g_activity_arr[i];
		var tr =
			'<tr index="' + i + '">'
				+ '<td>' + a.type + '</td>'
				+ '<td class="activitiy_title">' + a.title + '</td>'
				+ '<td>' + a.role + '</td>'
				+ '<td>' + a.start + '</td>'
				+ '<td>' + a.end + '</td>'
				+ '<td>' + a.status + '</td>'
				+ '<td>'
					+ '<span class="svg_container action_button" svg="settings" svgsize="18" svgfill="gray" style="cursor:pointer"></span>'
				+ '</td>'
			+ '</tr>'
		;
		$('#tbody_search_activity').append(tr);
	}
	// REDRAW SVG
	drawSvg($('#tbody_search_activity .svg_container'));	
}
