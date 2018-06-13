var g_userpage_uploader = 0;
var g_curr_user = 0;
var g_bxslider = 0;
var g_bxslider_opts = {
	auto: true,
	pause: 4000,
	mode: 'fade',
	video: true,
	controls: false,
	//adaptiveHeight: true,
	responsive: false,
	slideMargin: 0,
}
//var g_bxslider_arr = [];

function openUserPage(user_id){
	console.info('openUserPage', user_id);
	g_curr_user = 0;	
	
	if (window.event){
		window.event.stopPropagation();
	}
	
	if (user_id == g_user_id){
		
		openUserPage2(g_user);
		
	} else {
	
		openProgress2();
		
		// load user page
		call_svrop(
			{
				type: 'get_userdoc',
				user_id: user_id,
			},
			function (obj){
				closeProgress2();
				openUserPage2(obj.user);
			}
		);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////

function getDateFormat_work(value){
	if (value == sPresent){
		return sPresent;
	} else if (value){
		var arr = value.split('-'), mval = parseInt(arr[1]) - 1, year = arr[0];
		var month = month_arr[mval];
		return month + ' ' + year;
	} else {
		return '';
	}
}

/////////////////////////////////////////////////////////////////////////////////////////

function getDateFormat_award(value){
	var arr = value.split('-'), mval = parseInt(arr[1]) - 1, year = arr[0];
	var month = month_arr[mval];
	return month + ' ' + year;
}

/////////////////////////////////////////////////////////////////////////////////////////

function getComma(a, b){
	if (a != '' && b != ''){
		return ',&nbsp;';
	} else {
		return '';
	}
}

/////////////////////////////////////////////////////////////////////////////////////////

function closeUserPage(){
	changeBodyView(-1);	// go to previous page
}

///////////////////////////////////////////////////////////////////////////////

function openUserPage2(user){

	changeBodyView(PAGE_VIEW_USER);
	
	var jdiv = $('#div_view_user');
	///////////////////////////////////////////////////
	// LOADED USER
	///////////////////////////////////////////////////
	//console.info('succeeded', obj);
	
	// user
	g_curr_user = user;
	
	// user stat
	var obj = getUserStat(user);
	user.participated = obj.participated;
	user.assessed = obj.assessed;
	user.coordinated = obj.coordinated;
	$('.stat_network3').text(user.network);
	$('.stat_participated3').text(user.participated);
	$('.stat_assessed3').text(user.assessed);
	$('.stat_coordinated3').text(user.coordinated);
	
	jdiv.find('.bodyview_title').text(user.username);
	// topmenu search
	//$('#inp_topmenu_search').val(user.username);

	refreshUserPageSkills(user);
	
	// PHOTO
	jdiv.find('.photo')
		.css('visibility', 'hidden')
		.load(function(){
			$(this).css('visibility', 'visible')
		})			
		.attr('src', getUserImgSrc(user.img_id))
	;
	
	// for each key
	for (var key in user){
		var value = user[key];
		//console.info(key, value);
		var jobj = jdiv.find('.' + key);
		if (jobj.length){
			jobj.html(value);
		}
	}
	
	// SECTIONS
	var jsections = jdiv.find('.sections');
	jsections.empty();
	var	order = user.profile.order,
		s = '<table width="100%">'
	;

	//console.info(order);
	for (var key in order){
		var
			section = order[key],
			title = title_arr[section][0]
		;
		if (section == 'activity'){
			continue;	// show in another way
		}
		
		//console.info(section);
		if (user[section] || (user.profile[section] && user.profile[section].length)){
			s += '<tr><td>'
						+ '<div class="actpage_header">' + title + '</div>'
						+ '<table class="tbl_userpage">'
			;
						
			switch (section){
			
				case 'media':
					s += '<tr><td>'
							+ '<div class="uploader_gallery">' +
							'</td></tr>'
					;
					break;

				case 'interest':
				case 'objectives':
					s += '<tr><td class="userpage_cell">'
							+ getBrText(user.profile[section])
						+ '</td></tr>'
					;
					break;
					
				case 'language':
//					s += '<tr><td class="userpage_cell">'
//							+ '<table class="language_outer">'
//							+ '<thead><tr>'
//					;
/*					
					['', 'Spoken', 'Written', 'Remarks'].forEach(function(element, index, array){
						s	+= '<td class="span_language_header" style="border-bottom: 1px solid #e0e0e0;">' + element + '</td>';
					});
					s += '</tr></thead><tbody>';
					var arr = user.profile[section];
					arr.forEach(function(element, index, array){
						s += '<tr>'
							+ '<td class="span_language language_language">' + element.language + '</td>'
							+ '<td class="span_language language_spoken">' + prof_arr[element.spoken] + '</td>'
							+ '<td class="span_language language_written">' + prof_arr[element.written] + '</td>'
							+ '<td class="span_language language_remarks">' + element.remarks + '</td>'
							+ '</tr>'
						;
					});
*/
					var arr = user.profile[section];
					arr.forEach(function(value, index, array){
						s += '<tr><td class="userpage_cell">'
						s += '<div class="span_language" style="margin-bottom:10px"><span class="language_language">' + value.language + '</span>' +
							'<br/><span class="language_spoken">Spoken: ' + prof_arr[value.spoken] + '</span> ' +
							'<br/><span class="language_written">Written: ' + prof_arr[value.written] + '</span> ';
						if (value.remarks){
							s += '<br/><span class="language_remarks">Remarks: ' + value.remarks + '</span>';
						}
						s += '</div>';
						+ '</td></tr>'
					});
					
					//s	+= '</td></tr></table>'
					//	+ '</td></tr>'
					//;
					break;
					
				default:
					var arr = user.profile[section];
					s += '<tr><td class="userpage_cell">';
					arr.reverse().forEach(function(element, index, array){
						switch (section){
						
							case 'publication':
								s += '<div class="publication_outer">'
										+ '<div class="award_title">' + element.title + '</div> '
										+ '<span class="publication_publisher">' + element.publisher + '</span> '
										+ '<div class="publication_date">' + getDateFormat_work(element.date) + '</div> '
										+ '<div class="publication_desc">' + element.desc + '</div> '
									+ '</div>';
									if (index != arr.length - 1){
										s += '<br/>';
									}
								;
								break;
						
							case 'award':
								s += '<div class="award_outer">'
										+ '<div class="award_title">' + element.title + '</div> '
										+ '<span class="award_issuer">' + element.issuer + '</span> '
										+ '<div class="award_date">' + getDateFormat_award(element.date) + '</div> '
										+ '<div class="award_desc">' + element.desc + '</div> '
									+ '</div>';
									if (index != arr.length - 1){
										s += '<br/>';
									}
								;
								break;
						
							case 'education':
								s += ''
									+ '<div class="education_school">' + element.school + '</div>'
									+ '<div><span class="education_degree">' + element.degree + '</span> ' + getComma(element.degree, element.field)
									+ '<span class="education_field">' + element.field + '</span></div>'
									+ '<div class="education_period">' + element.start + ' - ' + element.end + '</div>'
									if (index != arr.length - 1){
										s += '<br/>';
									}
								;
								break;
								
							case 'work':
								s += ''
									+ '<div class="work_title">' + element.title + '</div>'
									+ '<div><span class="work_company">' + element.company + '</span>, '
									+ '<span class="work_location">' + element.location + '</span></div>'
									+ '<div class="work_period">' + getDateFormat_work(element.start) + ' - ' + getDateFormat_work(element.end) + '</div>'
									if (index != arr.length - 1){
										s += '<br/>';
									}
								;
								break;
								
						}
					});
					s	+= '</td></tr>'
					;
					break
			}
			s += '</table>';
					+ '</td></tr>';
			//console.info(user.profile[section]);
			s += '<tr><td><div class="section_separator"></div></td></tr>';
		}
	}
	s += '</table>';
	//s += '<div class="section_separator"></div>';
	
	jsections.html(s);
	
	/////////////////////////////////////////////////////////////
	// POST OPERATION
	/////////////////////////////////////////////////////////////
	
	// MEDIA
	if (user.profile.media && user.profile.media.length > 0){
		call_svrop(
			{
				type: 'get_media',
				media_id_arr: user.profile.media,
			},
			function (obj){
				//console.info('succeeded', obj);
				var media_arr = obj.media_arr;
				var jbody = $('body');
				var jgallery = jsections.find('.uploader_gallery');
				if (!g_userpage_uploader){
					var opts = {
						gallery: jgallery,
						media_arr: media_arr,
						trash: 0,
					};
					jbody.uploader(opts);
					g_userpage_uploader = 1;
				} else {
					jbody.uploader('loadGallery', media_arr, jgallery);
				}
			},
			function (obj){
				console.error('failed', obj);
			}
		);	
	}
	
	// ACTIVITIES
	jdiv.find('.div_userpage_act').empty();
	var
		 joclx = jdiv.find('.div_userpage_oclx').empty(),
		 jyolox = jdiv.find('.div_userpage_yolox').empty()
	;

	// remove old stuff
	resetBxSlider();
	
	var activities = user.profile.activity;
	if (activities.length){
		// add the first ul

		for (var i = 0; i < activities.length; i++){
			var
				act = activities[i],
				act_id = act.act_id,
				act_desc = ''
			;
			console.debug('act_id', act_id);
			
			// ACTIVITY DETAILS
			var s =
				'<li><table class="tbl_userpage_uact" onclick="viewActivity(' + act_id + ')" act_id="' + act_id + '">' +
					'<tr>' +
						'<td>' + getImgActTitle(act) + '</td>' +
					'</tr>' +
					'<tr>' +
						//'<td><div class="uact_desc">' + (act.desc?act.desc:'') + '</div></td>' +
						'<td><div class="uact_desc">' + act_desc + '</div></td>' +
					'</tr>'
			;
			// ADD ASSESSORS
			if (act.assessors && act.assessors.length){
				s += '<tr>' +
								'<td>' +
									'<table class="tbl_uact_assessors">' +
										'<tr class="tr_uact_assessors" assessors="' + (act.assessors.join(',')) + '"></tr>' +
									'</table>' +
								'</td>' +
							'</tr>'
				;
			}
			s += '</table></li>';
			switch (act.act_type){
				
				case 'OCL-X':
					if (!joclx.find('ul').length){
						joclx.append('<ul class="bxslider"/>');
					}
					joclx.find('ul').append(s);
					break;
					
				case 'YOLO-X':
					if (!jyolox.find('ul').length){
						jyolox.append('<ul class="bxslider"/>');
					}
					jyolox.find('ul').append(s);
					break;
			}
		}

		// update the description
		$('.tbl_userpage_uact').each(function(){

			var jtbl = $(this);
			var act_id = parseInt(jtbl.attr('act_id'));
			//console.debug(act_id);

			call_svrop(
				{
					type: 'get_actdesc',
					act_id: act_id,
				},
				// ON SUCCESS
				function (obj){
					var desc = obj.desc?obj.desc:'';
					jtbl.find('.uact_desc').html(desc);
				},
				function (obj){
					console.error('failed', obj);
				}
			);	
			
		});

/*		
		// add ellipsis
		jdiv.find('.uact_title').dotdotdot();
		jdiv.find('.uact_desc').dotdotdot();

		// http://bxslider.com/options
		if (g_platform == 'web'){
			g_bxslider = jdiv.find('.bxslider').bxSlider(g_bxslider_opts);
		}
*/		
		// add assessors
		jdiv.find('.tr_uact_assessors').each(function(){
			var jtr = $(this);
			var assessors = jtr.attr('assessors').split(',');
			// check with server
			if (assessors.length){
				call_svrop(
					{
						type: 'check_users',
						users: assessors,
					},
					function (obj){
						//console.info('check_users', obj.users);
						var assessors = obj.users,
							max_assessors = 3
						;
						for (var j = 0; j < assessors.length && j < max_assessors; j++){
							var assessor = assessors[j];
							jtr.append(
								'<td><table class="tbl_assessor" user_id="' + assessor.user_id + '"><tr><td><img src="' + getImgUrl(assessor.img_id, 'user') + '"></td></tr><tr><td><div class="uact_assessor_username">' + assessor.username + '</div></td></tr></table></td>'
							);
							jtr.find('.tbl_assessor').click(function(e){
									var user_id = $(this).attr('user_id');
									openUserPage(user_id);
									e.stopPropagation();
							 });
						}
						if (assessors.length > max_assessors){
							var jtd = $('<td class="td_openlist"><span class="glyphicon glyphicon-chevron-right"></span></td>');
							jtr.append(jtd);
							jtd.click(function(e){
								var jtr2 = $(this).closest('.tr_uact_assessors');
								console.info('popup', jtr2.attr('assessors'));
								var jdiv = $('<div/>');
								createUserList(jdiv, assessors, 'Assessors');
								$.featherlight(jdiv, {});
								e.stopPropagation();
							});
						}
				
					}
				)
			}
		});
	}
	if (!joclx.find('ul').length){
		joclx.append('<div class="div_userpage_empty">No any OCL-X activities</div>');
	}
	if (!jyolox.find('ul').length){
		jyolox.append('<div class="div_userpage_empty">No any YOLO-X activities</div>');
	}
	
	// DRAW CANVAS
	drawSkillCanvas('cvs_skills_userpage', user.skills, 1, 0);
	
	// ASSOCIATE MESSAGE
	jdiv.find('.but_message').unbind().click(function(){
		openMessenger_user(user.user_id, user.username);
	});
	
	setTimeout(function(){
		resizeUserPage();
	}, 1000);
}


///////////////////////////////////////////////////////////////////////////////////////////////

function resetBxSlider(){
	if (g_bxslider){
		var bxslider_arr = [];
		for (var i = 0; i < g_bxslider.length; i++){
			var bxslider = g_bxslider.eq(i).bxSlider();
			bxslider_arr.push(bxslider);
		}
		for (var i in bxslider_arr){
			bxslider_arr[i].destroySlider();
		}
		g_bxslider.remove();
		g_bxslider = 0;
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////

function resizeUserPage(){
	
	if (g_platform != 'web') return;
	
	var jdiv = $('#div_view_user');
	
	var jcols = jdiv.find('.tbl_col');
	
	var w = jcols.eq(0).outerWidth();
	var h = jcols.eq(0).outerHeight() - 12;
	if (h < 350) h = 350;
	console.debug('equalColumnHeight', h)
	var d1 = 150, d2 = 180;
	jdiv.find('.uact_desc').each(function(){
		var
			jobj = $(this),
			jtbl = jobj.closest('table')
		;
		//console.debug(jobj, jtbl);
		var h2 = jtbl.find('tr td:first-child').outerHeight();
		jobj.height(h - h2 - d1);
	});
	
	jcols.eq(1).height(h);
	jcols.eq(2).height(h);
	jcols.eq(1).find('.uact_desc').height(h-d2);
	jcols.eq(2).find('.uact_desc').height(h-d2);
/*	
	// make 3 column the same height
	var max_h = -1, max_jobj = 0;
	jdiv.find('.tbl_col').each(function(){
		var jobj = $(this),
			h = jobj.outerHeight();
		//console.debug(h);
		if (h > max_h){
			max_h = h;
			max_jobj = jobj
		}
	});
	
	jdiv.find('.tbl_col').each(function(){
		var jobj = $(this);
		if (jobj != max_jobj){
			jobj.height(max_h);
		}
		//jobj.find('.bx-viewport').height(max_h)
	});
*/	
	// reload sliders
	//for (var i = 0; i < g_bxslider.length; i++){
	//	g_bxslider.eq(i).bxSlider().reloadSlider(g_bxslider_opts);
	//}	
	//for (var i = 0; i < g_bxslider.length; i++){
	//	var bxslider = g_bxslider.eq(i).bxSlider();
	//	arr.push(bxslider);
	//}
	
	// add ellipsis
	//jdiv.find('.uact_title').dotdotdot();
	//jdiv.find('.uact_desc').dotdotdot();

	//resetBxSlider();
	// http://bxslider.com/options
	var opts = {};
	$.extend(opts, g_bxslider_opts, {});
	if (g_bxslider){
		//for (var i = 0; i < g_bxslider.length; i++){
			//g_bxslider.eq(i).bxSlider().reloadSlider(opts);
			//g_bxslider.eq(i).bxSlider().destroySlider();
			//jdiv.find('.bxslider').bxSlider(opts);
		//}
	} else {
		g_bxslider = jdiv.find('.bxslider').bxSlider(opts);
	}
}