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

function openUserPage(user_id, hidebackbut){
	console.info('openUserPage', user_id);

	var 
		jdiv = $('#div_view_user'),
		jback = jdiv.find('.but_back_userpage')
	;
	if (hidebackbut){
		jback.hide();
	} else {
		jback.show();			
	}
	
	g_curr_user = 0;
	getUserDoc(user_id, function(user){

		changeBodyView(PAGE_VIEW_USER);

		///////////////////////////////////////////////////
		// LOADED USER
		///////////////////////////////////////////////////
		//console.info('succeeded', obj);

		// user
		g_curr_user = user;

		jdiv.find('.but_message').css({
			'display': g_user_id == user.user_id ? 'none' : '',
		});
		jdiv.find('.but_logout, .but_editprofile').css({
			'display': g_user_id == user.user_id ? '' : 'none',
		});

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
				if (key == 'birthday'){
					var arr = value.split('-');
					value = arr[2] + ' ' + month_arr[arr[1] - 1];
				}
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
						s += 
									'<tr style="display:none"><td>'
									+ '<input id="uploader_viewprofile" type="file"/>'
								+ '</td></tr>'
								
								+ '<tr><td>'
									+ '<div id="gallery_viewprofile" class="uploader_gallery"></div>'
								+ '</td></tr>'

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
				s += '<tr><td><div class="section_separator"></div></td></tr>';
			}
		}
		s += '</table>';

		jsections.html(s);

		/////////////////////////////////////////////////////////////
		// POST OPERATION
		/////////////////////////////////////////////////////////////

		// MEDIA
		if (user.profile.media && user.profile.media.length > 0){
/*			
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
						jbody.uploader('loadGallery', media_arr);//, jgallery);
					}
				},
				function (obj){
					console.error('failed', obj);
				}
			);
*/		
			var 
				juploader = $('#uploader_viewprofile'),
				jgallery = $('#gallery_viewprofile')
			;
			initUploader(juploader, jgallery, 'view_profile', {user_id: g_user_id},
				0,
				0,
				0,
				0
			);
			juploader.uploader('loadGallery', user.profile.media);
		}

		// ACTIVITIES
		jdiv.find('.div_userpage_act').empty();
		var
			 joclx = jdiv.find('.div_userpage_oclx').empty(),
			 jyolox = jdiv.find('.div_userpage_yolox').empty()
		;

		// remove old stuff
		resetBxSlider();

		var acts = jsonclone(user.profile.activity);
		acts.sort(cmp_act_title);

		if (acts.length){

			// add the first ul
			for (var i = 0; i < acts.length; i++){
				var
					act = acts[i],
					act_id = act.act_id,
					act_desc = ''
				;
				if (typeof(act.show) == 'undefined'){
					act.show = 0;
				}
				if (typeof(act.act_gsscore) == 'undefined'){
					act.act_gsscore = 0;
				}
				if (act.show == 0 || act.act_gsscore == 0){
					continue;
				}

				console.info('act_id', act_id);

				// ACTIVITY DETAILS
				var s =
					'<li><table class="tbl_userpage_uact" onclick="viewActivity(' + act_id + ')" act_id="' + act_id + '">' +
						'<tr>' +
							'<td>' + getImgActTitle(act) + '</td>' +
						'</tr>' +
						'<tr>' +
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
			joclx.append('<div class="div_userpage_empty">No any Participated activities</div>');
		}
		if (!jyolox.find('ul').length){
			jyolox.append('<div class="div_userpage_empty">No any Self-initiated activities</div>');
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
	});
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
	//console.debug('equalColumnHeight', h)
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
	// http://bxslider.com/options
	var opts = {};
	$.extend(opts, g_bxslider_opts, {});
	if (g_bxslider){
	} else {
		g_bxslider = jdiv.find('.bxslider').bxSlider(opts);
	}
}

///////////////////////////////////////////////////////////////////

function printPaper(){
	// not compatible with all browser
	$('#iframe_pdf')[0].contentWindow.print();
	// http://printjs.crabbly.com/
	//var url = window.location.href + 'generate_profile.php?download=1&user_id=' + g_user_id;
	//printJS({printable: url, type:'pdf', showModal:true})
}


///////////////////////////////////////////////////////////////////

function backPrint(){
	enabledisablepullrefresh(1);
	enableGotoTop(1);

	$('#div_printout').hide();
	$('#div_main').show();
	checkOnResize();
}


///////////////////////////////////////////////////////////////////

function goPrintProfile(){
	var user_id = 0;
	if (g_curr_user){
		user_id = g_curr_user.user_id;
	} else {
		user_id = g_user_id;
	}
	var url = my_server_url() + 'generate_profile.php?user_id=' + user_id;

	viewPDF(url, "profile_" + user_id + ".pdf", 'profile.pdf');
}

///////////////////////////////////////////////////////////////////

var g_pdf_url = '', g_pdf_filename = '', g_pdf_origname = '';

function viewPDF(url, file_name, orig_name){
	var s = 'viewPDF: ' + url + ' ' + file_name + ' ' + orig_name;
	console.log(s);
	//alert(s);

	g_pdf_url = url;
	g_pdf_filename = file_name;
	g_pdf_origname = orig_name;
	var jdiv = $('#div_printout');

	$('#div_main').hide();
	jdiv.show();

	enabledisablepullrefresh(0);
	enableGotoTop(0);
	var h = 50;

	// set for each platform
	switch (g_platform){
		case 'ios':
			jdiv.find('.btn_download, .btn_printpaper, .btn_openpdf').css('visibility', 'hidden');
			break;

		case 'android':
			jdiv.find('.btn_download, .btn_printpaper, .btn_openpdf').css('visibility', 'hidden');
			break;

		case 'web':
			break;
	}
	//jdiv.find('tr:first-child td').height(h);

	var url2 = './ViewerJS_0.5.8_alan/#' + url;
	//alert(s +'\r\n' + url2);

	$('#div_iframe_pdf')
		.html('<iframe id="iframe_pdf" allowfullscreen webkitallowfullscreen style="display:block" src="about:blank"></iframe>');

	$('#iframe_pdf')
		.attr('src', url2)
		.height(g_nScreenH - h)
	;

}

///////////////////////////////////////////////////////////////////

function openPDF(){
	console.log('openPDF', g_pdf_filename, g_pdf_origname);

	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", 'download_file.php');
	form.setAttribute("target", 'newwin');

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "file_name");
	hiddenField.setAttribute("value", g_pdf_filename);
	form.appendChild(hiddenField);

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "orig_name");
	hiddenField.setAttribute("value", g_pdf_origname);
	form.appendChild(hiddenField);

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "download");
	hiddenField.setAttribute("value", 0);
	form.appendChild(hiddenField);

	document.body.appendChild(form);
	window.open('', 'newwin');
	form.submit();

}

/////////////////////////////////////////////////////////////////////////////////////

function downloadPDF(){
	console.log('downloadPDF', g_pdf_filename, g_pdf_origname);

	var form = document.createElement("form");
	form.setAttribute("method", "post");
	form.setAttribute("action", 'download_file.php');
	form.setAttribute("target", 'iframe_pdf');

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "file_name");
	hiddenField.setAttribute("value", g_pdf_filename);
	form.appendChild(hiddenField);

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "orig_name");
	hiddenField.setAttribute("value", g_pdf_origname);
	form.appendChild(hiddenField);

	var hiddenField = document.createElement("input");
	hiddenField.setAttribute("type", "hidden");
	hiddenField.setAttribute("name", "download");
	hiddenField.setAttribute("value", 1);
	form.appendChild(hiddenField);

	document.body.appendChild(form);
	form.submit();
}

//////////////////////////////////////////////////////////////////////////////////////

function viewPDF_static(file){
	var folder = getMediaFolder();
	viewPDF(folder + '../pdf/' + file);
}