/////////////////////////////////////////////////////////////////////////////////////
var g_profile_menuitems = 0;
var g_profile_initialized = 0;

function openProfile2(){
	console.info('openProfile');
	g_curr_user = 0;

	changeBodyView(TAB_PROFILE);
	
	// update profile
	if (!g_profile_initialized){
		updateProfile();
		g_profile_initialized = 1;
	}
	
	//$('#div_topmenu').show();

	// hide
	//$.featherlight.close();
	//$('.tab_page').hide();
	
	// show
	//$("#tabs").tabs("option", "active", TAB_PROFILE);
	//$('#tab_profile, #tbl_my_profile').show();
	
	// show skills
	var skills = getSkillsWithBreakdown_user(g_user);
	drawSkillCanvas('cvs_skills_profile', skills, 1);
}

//////////////////////////////////////////////////////////////////////////////////////

function updateProfileBlock(){

	// REMOVE ALL FIRST
	$('#profile_blocks').empty();
	//return;
			
	g_profile_menuitems = [];
	
	// ADD EACH PROFILE GROUP ACCORDING TO THE ORDER ARRAY
	g_user.profile.order.forEach(function(name){
	
		console.info('each_profile', name);
		var title = title_arr[name][0];
		var s = 
		'<li class="ui-state-default">' +
			'<table cellspacing="5" width="100%">' +
				'<thead>' +
					'<tr>' +
						'<td width="100%">' + // ui-state-default">' + 
							'<a class="cmenu_anchor" name="anchor_profile_' + name + '">' +
								'<div class="profile_header">' + title + '</div>' +
							'</a>'
						'</td>'
		;
		// build the starting block
		var type = name;
		var anchor = 'anchor_profile_' + type;
		//console.info(type, anchor);
		
		switch (type){
			
			case 'activity':
				s += '</tr>'
					+ '</thead>'
				+	'</table>'
				+ '<table width="100%">' +
						'<tbody>' +
							'<tr>' +
								'<td colspan="2">' +
									'<div class="editable profile_divs" type="' + type + '" hoverable="0" data-emptytext="" >' +
									'</div>'
				;
				break;
			
			case 'objectives':
				var data_type = 'wysihtml5';
				//var data_type = 'textarea'
				//if (g_platform == 'ios'){	data_type = 'textarea';}	// workaround for ios forever loading
				//if (g_platform == 'android'){	data_type = 'textarea';}	// workaround for edit reload
				//if (g_platform != 'ios' && g_platform != 'android') data_type = 'wysihtml5';
				
				// SINGLE ITEM
				s += '<td class="profile_add_td">' + 
								'<div class="btn btn-primary but_edititem" type="' + type + '">' +
									'<span>Edit</span>' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table><table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td class="text_box" colspan="2">' +
								'<div class="editable profile_divs" data-name="' + type + '" data-mode="inline" data-showbuttons="bottom" data-type="' + data_type + '" data-title="Please fill in" data-emptytext="&nbsp;" data-inputclass="input_' + type + '" type="' + type + '" style="padding:10px"></div>'
				;
				break;
			
			case 'interest':
				//var data_type = 'wysihtml5';
				var data_type = 'textarea';
				// SINGLE ITEM
				s += '<td class="profile_add_td">' + 
								'<div class="btn btn-primary but_edititem" type="' + type + '">' +
									'<span>Edit</span>' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table><table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td class="text_box" colspan="2">' +
								'<div class="editable profile_divs" data-name="' + type + '" data-mode="inline" data-showbuttons="bottom" data-type="' + data_type + '" data-title="Please fill in" data-emptytext="&nbsp;" data-inputclass="input_' + type + '" type="' + type + '" style="padding:10px"></div>'
				;
				break;

			case 'media':
				s += '<td class="profile_add_td">' + 
								'<input class="uploader" type="file" accept="image/*; video/*; capture=camcorder" data-title="Add">' +
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table><table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td colspan="2">' +
									'<div class="uploader_gallery profile_divs" type="' + type + '"></div>' +
							'</td>'
				;
				break;
				
			default:
				// MULTIPLE ITEM
				s += '<td class="profile_add_td">' + 
								'<div class="btn btn-primary but_additem" type="' + type + '">' +
									'<span>Add</span>' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table>' +
					'<table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td colspan="2">'
				;
				//if (type == 'language'){
				//	s += '<div class="profile_div" style="width:98%; padding: 4px 0px; border-bottom:1px solid #e0e0e0"><table border="0" class="language_outer" style="width:100%; "><tbody><tr></tr></tbody><td class="span_language_header">Language</td><td class="span_language_header">Spoken</td><td class="span_language_header">Written</td><td class="span_language_header">Remarks</td></table></div>';
				//}
				s += 	'<div class="profile_divs" type="' + type + '">' +
							'</div>'
				;
				break;
		}
		
		s += '</td>' +
				'</tr>' +
			'</tbody>' +
		'</table>';
		
		//console.info(s);
		$('#profile_blocks').append(s);
		
		// ADD TO JSON
		g_profile_menuitems.push({
			title: title,
			anchor: anchor,
		});
	});
	console.info(g_profile_menuitems);
	if (g_curr_page == TAB_PROFILE){
		cmenu({menuitems:g_profile_menuitems});
	}
	
	//return;
	// SET UPLOADER
	var jdiv = $('#profile_blocks');
	initUploader(jdiv.find('.uploader'), jdiv.find('.uploader_gallery'), 'user', {user_id: g_user_id}
		,function(media_arr, media_id_arr){
			console.info('onUpdate', media_id_arr);
			g_user.profile.media = media_id_arr;
		}
	);
	
	// RETRIEVE FROM DB
	if (!g_user.profile.media){
		g_user.profile.media = [];
	}
	if (g_user.profile.media.length > 0){
		call_svrop(
			{
				type: 'get_media',
				media_id_arr: g_user.profile.media,
			},
			function (obj){
				console.info('succeeded', obj);
				var media_arr = obj.media_arr;
				//console.info(media_arr);
				$('#profile_blocks .uploader').eq(0).uploader("loadGallery", media_arr);
			},
			function (obj){
				console.error('failed', obj);
			}
		);	
	}
	
	// update myinfo profile
	$('.profile_divs').each(function(){
		var jdivs = $(this), type = jdivs.attr('type');
		updateMyInfoProfile(type);
	});

	// update profile editable
	var jobjs = $('#tbl_my_profile .editable');
	//console.debug('add xeditable1', jobjs);
	var params = {
			type:			'xeditable',
			user_id:		g_user_id,
			pwd:			g_user.pwd,	
	}
 	$.fn.editable.defaults.params = params;

	jobjs.editable({
		pk: 1,
		params: params,
		url:					'./svrop.php',
		showbuttons:	'bottom',
		placement:		'bottom',
		//emptytext: '......',
	});

	// update user info
	$('.editable[data-name=username]')
		.attr('show_trash', 0)
		.editable('setValue', g_user.username)
		.editable('option', 'success', function(response, newValue){
			g_user.username = newValue;
			$('.myinfo_username').html(g_user.username);
		})

	$('.editable[data-name=position], .editable[data-name=location]')
		.unbind("click")
		.bind( "click", function(event){
			// any til_now selection under work or education?
			// no. type in anything you want
			var jeditable = 0;
			['work', 'education'].forEach(function(type){
				var profile_arr = g_user.profile[type];
				for (var i = profile_arr.length - 1; i >= 0; i--){
					var item = profile_arr[i];
					//console.info(item);
					if (item.end == sPresent){
						var item_id = item.item_id;
						$('.profile_divs[type=' + type + ']').find('div.editable[item_id='+item_id+']').each(function(e){
							if (!jeditable){
								jeditable = $(this);
							}
						});
					}
				}
			});
			if (!jeditable){
				$(this).editable('show');
			} else {
				setTimeout(function(){
					jeditable.editable('show');
				}, 10);
			}
		});
	;	
	// update home page
	$('.myinfo_objectives').html(g_user.profile.objectives);
	
	//////////////////////////////////////////////////////////////////////////
	// UPDATE PROFILE PAGE
	//////////////////////////////////////////////////////////////////////////
	$('.editable[data-name=objectives]').attr('show_trash', 0).editable('setValue', g_user.profile.objectives);
	$('.editable[data-name=interest]').attr('show_trash', 0).editable('setValue', g_user.profile.interest);
	//$('.editable[data-name=profile_activity]').unbind();
	
	// profile photo upload
	$("#inp_user_photo").change(function(){
		var img_id = g_user.img_id;
		uploadPhoto($(this), g_user_id, 0, img_id, function(img_id2){
				g_user.img_id = img_id2;
				$('.myinfo_photo')
					.attr('src', getUserImgSrc(img_id2));
			},
			function(resp){
			}
		)
	});	
	// add profile buttons
	$('#tbl_my_profile .but_additem').mouseup(function(){
		var jobj = $(this),
				type = jobj.attr('type'),
				jdivs = $('.profile_divs[type=' + type + ']')
		;
		addProfileSection(jdivs, type);
	});
		
	//////////////////////////////////////////////////////////////////////////////////////
	// edit buttons for users to identify editable 
	//////////////////////////////////////////////////////////////////////////////////////
	$('#tbl_my_profile .but_edititem').click(function(e){	// for objectives and interests
		var jobj = $(this),
				type = jobj.attr('type'),
				jdivs = $('.profile_divs[type=' + type + ']')
		;
		var jobj = $('.editable[data-name=' + type + ']'),
			data_type = jobj.attr('data-type');
		;
		e.stopPropagation();
		e.preventDefault();		
		jobj.editable('toggle');
		
		setTimeout(function(){
			var jobj2 = jobj.next().find('.editable-input');
			if (!jobj2.length) jobj2 = jobj;
			scroll2Element(jobj2, function(){
				//self.input.activate();
			});
		}, 10);
	});
	
/*	
	var jobj = $('#editable_mood');
	jobj.editable({
		value: 'Cheerful',
		typeahead: {
				name: 'mood',
				local: ['Cheerful', 'Happy', 'Sad']
		}
	});
	
//*/	
}


/////////////////////////////////////////////////////////////////////

function updateMyInfoProfile(type){

	if (type == 'objectives' || type == 'interest' || type == 'media' || type == ''){
		// skip this two
		
	} else {
	
		var jdivs = $('.profile_divs[type=' + type + ']');
		jdivs.empty();
		
		var sections = g_user.profile[type],
			num_of_sections = sections.length
		;
		// draw border
		var s = '<div class="line_separator"/>';
		for (var i = 0; i < sections.length; i++){
			var section = sections[i];
			var jdiv = addProfileSection(jdivs, type, section);
			if (type != 'language' && num_of_sections-- > 1){
				jdivs.prepend(s);
			}		
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function addProfileSection(jdivs, type, section){

	// remove any new div
	$('div[item_id=-1]').remove();
	
	// add div
	var jsection = $('<div data-type="' + type + '" data-name="profile_' + type + '" data-mode="inline" data-emptytext="" data-showbuttons="bottom" data-placement="bottom" data-title="Please fill in" class="editable editable-click profile_div"></div>');
	jdivs.prepend(jsection);
		
	// set item id
	var item_id = !section ? -1 : section.item_id;	// consider using -1 for server-side add
	jsection.attr('item_id', item_id);
	
	// old value
	var
		value = 0,
		bDisabled = false
	;
	if (section){
		
		switch (type){
		
			case 'media':	
				break;

			case 'activity':
				var
					activity = section,
					act_id = activity.act_id;
					uact = getUact(act_id),
					act_period = getUniformPeriod(activity.start, activity.end, 1),	// 1= no time
					act_roles = getUactRoles(uact),
					act_status = getActStatus(uact, 0, 0)	 // 0=no dt order comment
				;
				if (!activity.impression){
					activity.impression = {};
				}
				if (!activity.impression.skills){
					activity.impression.skills = {};
				}
				value = {
					act_id: 			activity.act_id,
					title: 				activity.title,
					img_id:				activity.img_id,
					act_type: 		activity.act_type,
					sharing:			activity.sharing,
					start: 				activity.start,
					end:					activity.end,
					feedback: 		activity.feedback,
					skills: 			activity.impression.skills,
					act_roles:		act_roles,
					act_period:		act_period,
					act_status:		act_status.desc,
				}
				bDisabled = true;
				break;
		
			case 'education':
				value = {
					school: 			section.school,
					degree:			 	section.degree,
					field: 				section.field,
					start: 				section.start,
					end: 					section.end,
					desc: 				section.desc,
				}
				break;
				
			case 'work':
				value = {
					company: 			section.company,
					title: 				section.title,
					location: 		section.location,
					start: 				section.start,
					end: 					section.end,
					desc: 				section.desc,
				}
				break;

			case 'award':
				value = {
					title: 				section.title,
					issuer: 			section.issuer,
					date: 				section.date,
					desc: 				section.desc,
				}
				break;
				
			case 'publication':
				value = {
					title: 				section.title,
					publisher: 		section.publisher,
					date: 				section.date,
					desc: 				section.desc,
				}
				break;

			case 'language':
				value = {
					language: 	section.language,
					spoken: 		section.spoken,
					written: 		section.written,
					remarks: 		section.remarks,
				}
				break;
		}
	}

	if (type == 'media') return;
	
	// add xeditable
	//console.debug('add xeditable2', jsection);
	var jeditable = jsection
		.editable({
			pk: 1,
			params: {
				item_id: item_id,
				type: 'xeditable',
				user_id: g_user_id,
				pwd: g_user.pwd,
			},
			url: './svrop.php',
			value: value,
			disabled: bDisabled,
			validate: function(value){
				// trim all the whitespaces
				for (var key in value){
					value[key] = $.trim(value[key]);
				}
				var jspan = jeditable.next();
				switch (type){
				
					case 'work':
						if (!value.company){
							// no company
							jspan.find('input[name=company]').focus();
							return 'Please enter the company';
						} else if (!value.title){
							// no title
							jspan.find('input[name=title]').focus();
							return 'Please enter your title';
						} else if (value.end != sPresent){
							// check end date >= start date
							if (value.start > value.end){
								jspan.find('input[name=startDateMonth]').focus();
								return 'Invalid date range';
							}
						}
						break;

					case 'education':
						if (!value.school){
							// no school
							jspan.find('input[name=school]').focus();
							return 'Please enter the school';
						} else if (value.end != sPresent){
							// check end date >= start date
							if (value.start > value.end){
								jspan.find('input[name=startDateYear]').focus();
								return 'Invalid date range';
							}
						}
						break;
						
					case 'award':
						if (!value.title){
							// no school
							jspan.find('input[name=title]').focus();
							return 'Please enter the title';
						}
						break;
						
					case 'publication':
						if (!value.title){
							// no school
							jspan.find('input[name=title]').focus();
							return 'Please enter the title';
						}
						break;
						
					case 'language':
						if (!value.language){
							// no school
							jspan.find('input[name=language]').focus();
							return 'Please enter the language';
						}
						break;
						
				}
			},
		})
	//console.info(jitem);
	
	// show now if new
	if (!section){
		setTimeout(function(){
			jsection.editable('show');
		}, 10);
	}
	return jsection;
}

