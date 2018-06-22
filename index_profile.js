	/////////////////////////////////////////////////////////////////////////////////////

var g_profile_menuitems = 0;
var g_profile_initialized = 0;

function openProfile2(){
	console.info('openProfile');
	openUserPage(g_user_id, 1);
}

/////////////////////////////////////////////////////////////////////////////////////

function editProfile(){
	g_curr_user = 0;

	changeBodyView(TAB_PROFILE);

	// update profile
	if (!g_profile_initialized){
		updateProfile();
		g_profile_initialized = 1;
	}

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
		var 
			title = title_arr[name][0],
			title2 = name != 'media' ? title : title + '<div class="div_material_hdr">File formats: png, mp4, bmp, gif, jpg, mp3, pdf</div>'
		;
		
		var s = 
		'<li class="ui-state-default">' +
			'<table cellspacing="5" width="100%">' +
				'<thead>' +
					'<tr>' +
						'<td width="100%">' + 
							'<a class="cmenu_anchor" name="anchor_profile_' + name + '">' +
								'<div class="profile_header">' + title2 + '</div>' +
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
									'</div>' +
								'</td>' +
							'</tr>' +
						'</tbody>' +
					'</table>';
				break;

			case 'objectives':
				s += '<td class="profile_add_td">' +
								'<button id="but_tinymce_objectives" class="btn btn-primary but_edititem" type="' + type + '">Edit</button>' +
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table>' +
					'<table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td class="text_box" colspan="2">' +
								'<div id="div_tinymce_objectives"></div>' +
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>';
				break;

			case 'interest':
				s += '<td class="profile_add_td">' +
								'<button id="but_tinymce_interest" class="btn btn-primary but_edititem" type="' + type + '">Edit</button>' +
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table><table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td class="text_box" colspan="2">' +
								'<div id="div_tinymce_interest"></div>' +
							'</td>' +
							'<tr>' +
						'</tbody>' +
					'</table>';
				break;

			case 'media':
				s += '<td class="profile_add_td">' +
								'<input id="uploader_editprofile" class="uploader" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">' + 
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table><table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td colspan="2">' +
									'<div id="gallery_editprofile" class="uploader_gallery profile_divs" type="' + type + '"></div>' +
							'</td>' +
						'<tr>' +
					'</tbody>' +
				'</table>';
				break;

			default:
				// MULTIPLE ITEM
				s += '<td class="profile_add_td">' +
								'<button class="btn btn-primary but_additem" type="' + type + '">Add</button>' +
							'</td>' +
						'</tr>' +
					'</thead>' +
					'</table>' +
					
					'<table width="100%">' +
					'<tbody>' +
						'<tr>' +
							'<td colspan="2">' +
 								'<div class="profile_divs" type="' + type + '">' +
								'</div>' +
							'</td>' +
						'</tr>' +
					'</tbody>' +
				'</table>'
				;
				break;
		}

		//console.info(s);
		$('#profile_blocks').append(s);

		// ADD TO JSON
		g_profile_menuitems.push({
			title: title,
			anchor: anchor,
		});
	});
	//console.info(g_profile_menuitems);
	if (g_curr_page == TAB_PROFILE){
		cmenu({menuitems: g_profile_menuitems});
	}

	// SET UPLOADER
	
	
	///////////////////////////////////////
	// MEDIA UPLOAD
	///////////////////////////////////////
	
	// RETRIEVE FROM DB
	if (!g_user.profile.media){
		g_user.profile.media = [];
	}
	
	var
		jdiv = $('#profile_blocks'),
			bEditable = 0,
			mediaFolder = getMediaFolder()
	;
	var 
		juploader = $('#uploader_editprofile'),
		jgallery = $('#gallery_editprofile')
	;
	initUploader(
		juploader,
		jgallery,
		'user',
		{user_id: g_user_id},
		function(media_arr, media_id_arr){
			console.info('onUpdate', media_id_arr);
			g_user.profile.media = media_id_arr;
		},
		0,
		bEditable,
		mediaFolder,
		function (jobj, new_value){
			console.log('profile desc new_value', jobj, new_value);
			juploader.uploader('saveMediaDesc');
		}
	);
	juploader.uploader("loadGallery", g_user.profile.media, 1);

	// update myinfo profile
	$('.profile_divs').each(function(){
		var jdivs = $(this), type = jdivs.attr('type');
		updateMyInfoProfile(type);
	});

	// update profile editable
	var jobjs = $('#tbl_my_profile .editable');
	//console.debug('add xeditable1', jobjs);
	var params = {
			type:		'xeditable',
			user_id:	g_user_id,
			email:		g_user.email,
			username: 	g_user.username,
			pwd:		g_user.pwd,
	}
 	$.fn.editable.defaults.params = params;

	jobjs.editable({
		pk: 1,
		params: 		params,
		url:			'./svrop.php',
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
						$('.profile_divs[type=' + type + ']').find('div.editable[item_id=' + item_id + ']').each(function(e){
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
		})
	;

	// update home page
	updateMyBirthday();
	$('.myinfo_objectives').html(g_user.profile.objectives);

	//////////////////////////////////////////////////////////////////////////
	// UPDATE PROFILE PAGE
	//////////////////////////////////////////////////////////////////////////
	$('.editable[data-name=email]')
		.attr('show_trash', 0)
		.editable('setValue', g_user.email)
		//.editable('option', 'success', function(response, newValue){
		.on('save', function(e, params) {
			var new_email = params.newValue;
			var error = 'JSON parse error';
			try {
				error = JSON.parse(params.response).error;
			} catch (e) {}

			console.debug(e, params, error);
			if (error){
				notifyDialog(
					'<b>' + new_email + '</b> is already taken. ' +
					'Please choose another email.',
					BootstrapDialog.TYPE_WARNING
				);
			} else {
				notifyDialog(
					'A confirmation email will be sent to <b>' + new_email + '</b> shortly. ' +
					'Please click the hyperlink inside to confirm the change.',
					BootstrapDialog.TYPE_INFO
				);
			}
			// remain the same
			//alert(g_user.email);
		})
		.editable('option', 'display',  function(value, sourceData){
			// resume to the previous value
			$('.editable[data-name=email]').text(g_user.email);
		})
		//.on('shown', function(e, editable) {
		 //  editable.input.$input.val('hahaha');
		//});
	;
	$('.editable[data-name=birthday]')
		.attr('show_trash', 0)
		.editable('setValue', g_user.birthday);

	$('.editable[data-name=pwd]')
		.attr('show_trash', 0)
		.editable('setValue', g_user.pwd)
	;
	//$('.editable[data-name=objectives]').attr('show_trash', 0).editable('setValue', g_user.profile.objectives);
	//$('.editable[data-name=interest]').attr('show_trash', 0).editable('setValue', g_user.profile.interest);

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
	init_tinymce_editable('objectives', g_user.profile.objectives,
		function (unique_name, value){
			var params2 = merge_options(params, {type: 'xeditable', name: 'objectives', value: value});
			console.info('save obj', params2);
			call_svrop(params2, function (){
				console.info('save succeeded');
			});
		}
	);
	init_tinymce_editable('interest', g_user.profile.interest,
		function (unique_name, value){
			var params2 = merge_options(params, {type: 'xeditable', name: 'interest', value: value});
			console.info('save interest', params2);
			call_svrop(params2, function (){
				console.info('save succeeded');
			});
		}
	);
}


/////////////////////////////////////////////////////////////////////

function updateMyInfoProfile(type){
	console.log('updateMyInfoProfile', type);

	if (type == 'objectives' || type == 'interest' || type == 'media' || type == ''){
		// skip this two

	} else {

		var jdivs = $('.profile_divs[type=' + type + ']');
		jdivs.empty();

		var
			sections = g_user.profile[type],
			num_of_sections = sections.length
		;
		// draw border
		var s = '<div class="line_separator"/>';

		if (type == 'activity'){
			sections = jsonclone(sections);
			sections.sort(cmp_act_title);
		}

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
					act_gsscore:	activity.act_gsscore,
				};
				bDisabled = true;
				//console.log('value', value);
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
				item_id:	item_id,
				type: 		'xeditable',
				user_id:	g_user_id,
				pwd:			g_user.pwd,
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

/////////////////////////////////////////////

function updateMyBirthday(){
	var arr = g_user.birthday.split('-');
	var birthday = arr[2] + ' ' + month_arr[arr[1] - 1];
	$('.myinfo_birthday').html(birthday);
}
