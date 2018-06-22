var
	g_saved_activity = 0,
	g_act_parts = 0,
	g_impr_assrs = 0,
	g_curr_part_id = 0,
	g_saved_uact = 0,
	g_saved_acttab_index = 0
;

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function initViewAct(){

	var	jdiv = $('#div_activity_view');

	jdiv.find('.btn_viewact_edit').click(function(){
		var act_id = parseInt(jdiv.attr('act_id'));
		editActivity(act_id, g_acttab_index);
	});
	jdiv.find('.btn_viewact_export').click(function(){
		var act_id = parseInt(jdiv.attr('act_id'));
		exportActivity(act_id);
	})

	jdiv.find('.btn_viewact_submit').click(function(){
		switch (g_acttab_index){

			case ACTTAB_RATING:
				submitImpression2();
				break;

			case ACTTAB_PHOTO:
				submitActViewMaterial();
				break;
		}
	});

	// revamped
	jdiv.find('.but_viewct_cancel').click(function(){
		goBack_impr();
	});

	// uploader
	var
		juploader = $('#uploader_viewact'),
		jgallery = $('#gallery_viewact'),
		bEditable = 1 //g_curr_role != 'participant'
	;
	initUploader(juploader, jgallery, 'activity', {act_id: 0},
		function (media_arr, media_id_arr){
			console.info('onUpdate', media_id_arr);
			g_saved_activity.media = media_id_arr;
		},
		0,
		bEditable
	);

}

////////////////////////////////////////////////////////////////////////////

function getDtOrderComment(value){
	var len = value.toString().length;
	var s = value + '';
	for (var i = len; i < 11; i++){
		s = '0' + s;
	}
	return '<!--'+s+'-->';
}

///////////////////////////////////////////////////////////////
// timestage value can be sorted by importance (the smaller the more important)
///////////////////////////////////////////////////////////////
var
	TIMESTAGE_PENDING = 1,
	TIMESTAGE_OPENING = 2,
	TIMESTAGE_CLOSED = 3
;
function getTimeStage(start, end){
	var
		stage = 0,
		value = 0,
		desc = '',
		datetime = getDateTimeString()
	;
	if (datetime >= start && datetime <= end){

		////////////////////////////////////////////////////
		// TIMESTAGE 1: OPENED (WITHIN)
		////////////////////////////////////////////////////
		var diff = getDateTimeDiff(end, new Date());
		//console.info(start, end, diff);
		desc += diff.desc + ' to close';
		value = diff.value;
		stage = TIMESTAGE_OPENING;

	} else if (datetime < start){

		////////////////////////////////////////////////////
		// TIMESTAGE 2: PENDING (BEFORE)
		////////////////////////////////////////////////////
		var diff = getDateTimeDiff(start, new Date());
		desc += diff.desc + ' to open';
		value = 1000000000 + diff.value; // add 1000 years
		stage = TIMESTAGE_PENDING;

	} else {

		////////////////////////////////////////////////////
		// TIMESTAGE 3: CLOSED (AFTER)
		////////////////////////////////////////////////////
		desc += 'Closed';
		var diff = getDateTimeDiff(new Date(), end);
		value = 2000000000 + diff.value; // add 2000 years
		stage = TIMESTAGE_CLOSED;
	}
	desc += '';

	return {
		value: value,
		desc: desc,
		stage: stage,
	};
}

//////////////////////////////////////////////////////////////////

var sAbout = '~';
function getDateTimeDiff(a, b){
	var t1 = moment(a);
	var t2 = moment(b);
	var d = moment.duration(t1.diff(t2)), tmp = 0, value = parseInt(d.asMinutes()), desc = '';
	if ((tmp = parseInt(d.asYears())) > 0){
		desc = sAbout + tmp + ' year' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asMonths())) > 0){
		desc = sAbout + tmp + ' month' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asWeeks())) > 0){
		desc = sAbout + tmp + ' week' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asDays())) > 0){
		desc = sAbout + tmp + ' day' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asHours())) > 0){
		desc = sAbout + tmp + ' hour' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asMinutes())) > 0){
		desc = sAbout + tmp + ' miniute' + (tmp > 1 ? 's' : '');
	} else if ((tmp = parseInt(d.asSeconds())) > 0){
		desc = sAbout + tmp + ' second' + (tmp > 1 ? 's' : '');
	}
	if (!value || desc == ''){
		console.error('error in getDateTimeDiff', a, b);
	}
	return {
		value: value,
		desc: desc,
	};
}

///////////////////////////////////////////////////////////////
var
	ACTSTATUS_UNPUBLISHED = 0,
	ACTSTATUS_PENDING = 1,
	ACTSTATUS_OPENING = 2,
	ACTSTATUS_CLOSED = 3
;
function getActStatus(activity, bAddDtOrderComment, bDetails){
	var
		status = 0;
		desc = ''
	;
	if (activity.published == 0){
		status = ACTSTATUS_UNPUBLISHED;
		if (bAddDtOrderComment){
			desc = getDtOrderComment(0);
		}
		desc += 'Unpublished';
	} else {
		var timestage = getTimeStage(activity.start, activity.end);
		if (bAddDtOrderComment){
			desc = getDtOrderComment(timestage.value);
		}
		switch (timestage.stage){
			case TIMESTAGE_OPENING:
				status = ACTSTATUS_OPENING;
				if (bDetails){
					desc += 'Opening (' + timestage.desc + ')';
				} else {
					desc += timestage.desc;
				}
				break;
			case TIMESTAGE_PENDING:
				status = ACTSTATUS_PENDING;
				if (bDetails){
					desc += 'Pending (' + timestage.desc + ')';
				} else {
					desc += timestage.desc;
				}
				break;
			case TIMESTAGE_CLOSED:
				status = ACTSTATUS_CLOSED;
				if (bDetails){
					desc += 'Closed';
				} else {
					desc += timestage.desc;
				}
				break;
		}
	}
	return {
		status: status,
		desc: desc,
	}
}
/////////////////////////////////////////////////////////////////////////////////////////////
// https://datatables.net/forums/discussion/16317/sorting-a-checkbox-column
/////////////////////////////////////////////////////////////////////////////////////////////

function actpage_addUsers(users, jtbl, selected, onSuccess, onModify){
	console.info('actpage_addusers', users);

	if (!users.length){
		// hide
		jtbl.hide();
		onSuccess && onSuccess([]);

	} else {
		// show
		if (!jtbl.hasClass('dataTable')){
			jtbl.addClass('actpage_users');
			jtbl.DataTable({
				//ordering: true,	// otherwise, the list is difficult to trace
				//rowReorder: true,
				rowReorder: true,
				autoWidth: false,
				bPaginate: false,
				dom: '',
				language:{
					emptyTable: '',
					zeroRecords: '',
				},
				columnDefs: [
				],
			});
		}
		var dt = jtbl.show().DataTable().clear().draw();

		// check with server
		call_svrop(
			{
				type: 'check_users',
				users: users,
			},
			function (obj){
				var users_col = obj.users;
				if (users_col){
					for (var i = 0; i < users_col.length; i++){
						var user = users_col[i],
							user_id = user.user_id ? user.user_id : 0,
							imgusername = getImgUserName(user, users_col, 0, onModify),
							last_col = 0
						;
						if (!selected){
							last_col = user.status ? user.status : ''
						} else if (selected[user_id]){
							last_col = '<input type="checkbox" class="editor-active" checked>'
						} else {
							last_col = '<input type="checkbox" class="editor-active">'
						}
						var arr = [
								imgusername,
								last_col,
								user_id,
							];
						dt.row.add(arr);
					}
					dt.draw();

					// dt_num
					showDtNum(jtbl, ' users');

					if (g_platform != 'ios' && g_platform != 'android'){
						jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
					}
				}
				// onsuccess
				onSuccess && onSuccess(users_col);
			}
		)
	}
}

/////////////////////////////////////////////////////////////////////////

function closeViewActivity(){
	//alert('closeViewActivity');
	console.info('closeViewActivity');
	slideUpParticipantList();
	changeBodyView(-1);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function submitImpression2(){
	console.info('submitImpression2');
	var
		act_id = g_saved_activity.act_id,
		assr_id = g_user_id
	;
	var
		jtbl = $('.my_datatable[dt_type=impression_assr2]'),
		dt = jtbl.DataTable(),
		skills = {}
	;
	// gather all the markings
	jtbl.find('>tbody>tr').each(function(){
		var
			jtr = $(this),
			skill_name = jtr.find('td:first-child').html(),
			score = jtr.find('.star_rating').starRating('getRating')
		;
		skills[skill_name] = parseFloat(score);
	});
	var comments = $('.div_viewimpr_assessor .div_comments').html();

	openProgress2();

	call_svrop(
		{
			type: 'submit_impression2',
			act_id: act_id,
			assr_id: g_user_id,
			part_id: g_part_id,
			skills: skills,
			comments: comments,
		},
		function (obj){
			console.info('success', obj);
			// show dialog
			closeProgress2();
			//notifyDialog('The marking is submitted.');

			// update user
			if (g_user_id == g_part_id){
				var uact = getUact(act_id, g_user);
				uact.impression.skills = obj.skills;
			}

			// update activity
			var score = obj.act_assr_score;
			if (!g_saved_activity.impression.act_assr_scores){
				g_saved_activity.impression.act_assr_scores = {};
			}
			g_saved_activity.impression.act_assr_scores[g_user_id+','+g_part_id] = score;

			// update screen
			//score = '<!--' + score + '--><div class="star_rating" data-rating="' + score + '" part_id="' + g_part_id + '"></div>';
			//g_curr_part_jtd.html(score);
			//setStarRating(g_curr_part_jtd.find('.star_rating'), 0);
			g_curr_part_jtd.html(getDivStar(score, '', 1));
			showDivStar(g_curr_part_jtd);

			// ADD EVENTS
			addImpOnClickEvent();

			showRoleTab(ROLE_ASSESSOR);
		},
		function (obj){
			//console.error('saveactivity failed', obj);
		}
	);
}

///////////////////////////////////////////////////////////////////////

function submitActViewMaterial(){
	console.log('submitActViewMaterial');
	var juploader = $('#div_activity_view .div_viewact_media .uploader');

	juploader.uploader('saveMediaDesc', function(){
		notifyDialog('The descriptions are saved');
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////val

var g_uact_skills = 0;

function viewActivity(act_id, acttab_index){
	if (!acttab_index || acttab_index == ACTTAB_RUBRICS){
		acttab_index = ACTTAB_INFO;
	}
	console.info('viewActivity', act_id, acttab_index);
	if (window.event){
		window.event.stopPropagation();
	}
	if (!act_id || isNaN(act_id)){
		//debugger;
		console.tract('Undefined act_id')
		errorDialog('Undefined act_id');
		return;
	}

	$('.div_act_tabs, #view_act_title_ass, .tbl_ass_tabs, #div_activity_view .btn_panel').show();
	$('.div_viewact, #div_viewact_btn_panel').hide();

	// GET USER ACTIVITY
	var uact = getUact(act_id);
	if (!uact){
		// usually come from act page
		closeProgress2();
		console.error('no uact in console: act_id=', act_id, g_user);
		openHome();
		errorDialog('You are not participated in this activity.');
		return;
	}


	if (uact.published == 0){

		$('#tab_activity, #div_activity_view').show();	// for better testing
		editActivity(act_id);

	} else {

		openProgress2('Loading...');

		// load user page
		call_svrop(
			{
				type: 'get_activity',
				act_id: act_id,
			},
			function (obj){
				console.info('succeeded', obj);
				//closeProgress2();

				if (!obj.activity){
					// may be deleted
					console.error('return no activity', 'act_id='+act_id);
					openHome();
					errorDialog('This activity does not exist.');
					return;
				}

				// show the page
				var	jdiv = $('#div_activity_view');
				jdiv.attr('act_id', act_id).show();
				$('#div_activity_edit, #div_skill_breakdown').hide();
				changeBodyView(PAGE_VIEW_ACT);
				//g_curr_page = PAGE_VIEW_ACT;
				//showActTab(ACTTAB_INFO);
				setCurrPage(PAGE_VIEW_ACT);

				$('#tab_activity, #div_activity_view').show();	// for better testing
				var
					activity = obj.activity,
					selector = '#div_activity_view',
					jdiv = $(selector),
					coord_id = activity.coordinator_id,
					iamcoordinator = coord_id == g_user_id,
					iamassessor = uact.uact_assessor
				;

				// SET GLOBAL VARIABLE
				setSavedAct(activity);
				g_saved_parts = activity.participants;
				g_saved_uact = uact;
				g_saved_acttab_index = acttab_index;

				console.info('viewActivity act_id=' + act_id);

				// TOPMENU SEARCH
				$('#inp_topmenu_search').val('');

				// ID
				jdiv.attr('act_id', act_id);

				// PHOTO
				jdiv.find('.actpage_photo')
					.css('visibility', 'hidden')
					.load(function(){
						$(this).css('visibility', 'visible')
					})
					.attr('src', getActImgSrc(activity.img_id))
				;

				// SKILLS
				var skills = {};
				// convert to proper skills sttrusture
				for (var skill_name in uact.act_skills){
					// find in global skills
					var skill1 = uact.act_skills[skill_name];
					var skill2 = g_user.skills[skill_name];
					skills[skill_name] = {
						show: 1,
						skill_stars: skill1,
						markings: {},
					};
					var total_weight = 0;
					if (skill2 && skill2.markings[act_id]){
						var markings = jsonclone(skill2.markings[act_id]);
						// rearrange the global weightings to local ones
						for (var i in markings){
							var marking = markings[i];
							total_weight += marking.weight_pc;
						}
					}

					if (total_weight > 0){
						var total_weight_pc = 0;
						for (var i in markings){
							var marking = markings[i];
							if (i < markings.length - 1){
								marking.weight_pc = Math.floor(100 * marking.weight_pc / total_weight);
								total_weight_pc += marking.weight_pc;
							} else {
								marking.weight_pc = 100 - total_weight_pc;
							}
						}
					}
					skills[skill_name].markings[act_id] = markings;
				}
				g_uact_skills = skills;
				//console.debug(skills);
				var
					output = {
						tbl: 	'tbl_skills_act',
						chart: 	'cvs_skills_act',
						gauge: 	'cvs_gauge_act',
						num_of_assessors_shown: 0,
						editable: 0,
					},
					jtbl = $('#' + output.tbl),
					jchart = $('#' + output.chart),
					jgauge = output.gauge ? $('#' + output.gauge) : 0,
					num_of_assessors_shown = output.num_of_assessors_shown,
					editable = output.editable ? 1 : 0
				;

				// UPDATE TABLE AND CHART
				setSkillTableCanvas(jtbl, jchart, skills, [], num_of_assessors_shown, editable, activity.title);
				drawSkillCanvas('cvs_skills_act', skills, 1);
				setGauge1(jgauge, uact.act_gsscore);

				// TITLE
				jdiv.find('.actpage_title').html('<b>Title:</b> ' + activity.title + ' (' + getActType(activity) + ')');

				// PERIOD
				jdiv.find('.actpage_period').html('<b>Period:</b> ' + getUniformPeriod(activity.start, activity.end, 1));

				// COORDINATOR
				jdiv.find('.actpage_coordinator').html(
					'<b>Coordinator:</b> <span class="username" onclick="openUserPage(' + activity.coordinator_id + ')">'
						+	activity.coordinator_username
						+ '</span>'
				);

				// ROLE(S)
				var sRoles = getUactRoles(uact);
				jdiv.find('.actpage_roles').html(sRoles);
				var jtbl_roles = jdiv.find('.tbl_myroles');
				jtbl_roles.find('.userstat_text2').parent().css('display', uact.uact_coordinator == 1 ? 'block': 'none');
				jtbl_roles.find('.userstat_text3').parent().css('display', uact.uact_assessor == 1 ? 'block': 'none');
				jtbl_roles.find('.userstat_text4').parent().css('display', uact.uact_participant == 1 ? 'block': 'none');

				// ACTIVITY STATUS
				var act_status = getActStatus(activity, 0, 1);
				jdiv.find('.actpage_status').html('<b>Status:</b> ' + act_status.desc);

				// DESC
				jdiv.find('.actpage_desc').html('<b>Description:</b> ' + activity.desc);


				//////////////////////////////////////////////////////
				// PARTICIPANTS
				//////////////////////////////////////////////////////
				var jtbl = $(selector + ' [dt_type=actpage_participants]');
				if (g_saved_parts){

					actpage_addUsers(g_saved_parts, jtbl, 0, function(users){

						// STORE FULL PARTICIPANT INFO
						g_act_parts = users;

						// SET PANELIST'S PEER ASSESSMENT
						if (activity.impression && activity.impression.enabled){
							$('#tr_actpage_impression').show();

							var bEditable = uact.uact_participant == 1 && act_status.status == ACTSTATUS_OPENING;
							if (g_act_parts && g_act_parts.length){

								// add what may be missing
								if (!uact.impression){
									uact.impression = {};
								}
								if (!uact.impression.panelists){
									uact.impression.panelists = {};
								}
								if (!uact.impression.panelists.peer_assessors){
									uact.impression.panelists.peer_assessors = [];
								}
								// GET PRIMARY ASSESSORS
								var primary_assessors = getMyAssessors(
									activity.impression.panelists,
									uact.impression.panelists,
									g_user_id,
									activity.participants
								);
								if (primary_assessors.length){
									$('#tr_actpage_impression_primary_assessors').show();
								} else {
									$('#tr_actpage_impression_primary_assessors').hide();
								}

								// EXPAND/COLLAPSE ASSESSOR
								var jbut_expand = $('#tr_actpage_impression_primary_assessors .but_expand');
								var jdiv_expand = $('#div_actpage_impression_assessors');
								setExpandable(jbut_expand, jdiv_expand);

								// EXPAND/COLLAPSE PARTICIPANT
								//var jbut_expand = $('[name=anchor_actview_participants] .but_expand');
								//var jdiv_expand = $('#div_actpage_participant');
								//setExpandable(jbut_expand, jdiv_expand);

								var uact_imp_panelists = uact.impression.panelists;

							}
						} else {
							$('#tr_actpage_impression').hide();
						}
					});
				} else {
					jtbl.hide();
				}

				jdiv.find('.but_message').click(function(){
					openMessenger_act(activity);
				});

				// weight title
				var
					weight_imp = activity.impression.weight,
					weight_ass = activity.assessment.weight
				;
				if (isNaN(weight_imp) || isNaN(weight_ass) || (parseInt(weight_imp) + parseInt(weight_ass) != 100)){
					weight_imp = weight_ass = 50;
				}

				title_imp = 'Rating and Feedback (' + weight_imp + '%)';
				title_ass = 'Assessment (' + weight_ass + '%)';

				$('#view_act_title_imp').text(title_imp);
				$('#view_act_title_ass').text(title_ass);


				// OTHER ENHANCEMENTS
				if (g_platform != 'ios' && g_platform != 'android'){
					jdiv.find('[data-toggle=tooltip]').tooltip(); 	// render bootstrap tooltip
				}
				// UPLOADER
				var bEditable = iamcoordinator || iamassessor;	// leave to edit activity
				var juploader = $('#uploader_viewact');
				juploader
					.uploader('set_query_ids', {act_id: act_id})
					.uploader('loadGallery', activity.media, bEditable)
				;

				// RUBRICS
				refreshEditActRubrics(activity.assessment.assessments);

				//////////////////////////////////////////////////////
				// GET CURRENT PEER ASSESSEES
				//////////////////////////////////////////////////////
				call_svrop(
					{
						type: 'get_peerassessees_arr',
						act_id: act_id,
						user_id: g_user_id,
					},
					function (obj){
						console.info('get_peerassessee succeeded', obj);

						updatePeerAssesseesArr(obj.arr);

						showActTab(g_saved_acttab_index);

						showActBtnPanel();

						closeProgress2();
					}
				);
			},

			function (obj){
				console.error('failed', obj);
			}
		);
	}
}

/////////////////////////////////////////////////////////////////

function showViewActBtnPanel(){
	console.log('showViewActBtnPanel');

	$('#div_editact_btn_panel').hide();

	var
		btn_edit = 0,
		btn_submit = 0
	;
	if (g_curr_page == PAGE_VIEW_ASS_LIST || g_curr_page == PAGE_VIEW_ACT || g_curr_page == PAGE_VIEW_ASS){

		// CHECK COORDINATOR
		var uact = getUact(g_saved_activity.act_id);
		if (uact.uact_coordinator){
			//if (!g_transdiv_index)
			{
				btn_edit = 1;
			}
			switch (g_acttab_index){
				case ACTTAB_PHOTO:
					btn_submit = 1;
					break;
			}
		}

		// CHECK ASSESSOR
		switch (g_acttab_index){

			case ACTTAB_RATING:
				if (g_imp_assr && g_curr_page == PAGE_VIEW_ACT && g_role_tbl == 'assr2'){
					btn_submit = 1;
				}
				break;

			case ACTTAB_ASSESSMENTS:
				if (g_ass_assr && g_curr_page == PAGE_VIEW_ASS && g_role_tbl == 'assr2'){
					btn_submit = 1;
				}
				break;

			case ACTTAB_PHOTO:
				if (uact.uact_assessor){
					btn_submit = 1;
				}
				break;
		}

	}
	var jpanel = $('#div_viewact_btn_panel');

	// show/hide
	if (btn_edit || btn_submit){
		jpanel.show();
		if (btn_edit){
			$('.btn_viewact_edit').show();
			if (g_platform == 'web'){
				$('.btn_viewact_export').show();
			} else {
				$('.btn_viewact_export').hide();
			}
		} else {
			$('.btn_viewact_edit, .btn_viewact_export').hide();
		}
		if (btn_submit){
			$('.btn_viewact_submit').show();
		} else {
			$('.btn_viewact_submit').hide();
		}
	} else {
		jpanel.hide();
	}
}

////////////////////////////////////////////////////////////////////////

function exportActivity(act_id){
///*
	var
		folder = getMediaFolder(),
		url = folder + '../export/export_act_excel.php?act_id=' + act_id
	;

	// option 1: direct the http response to iframe
	//var s = '<iframe id="ifrm_export" src="' + url + '"></iframe>';
	//$('#div_export').html(s);

	// option 2: save the file, and open the file in iframe
	openProgress2('Processing...');
	$.ajax({
		type: 'POST',
		url: url,
		async: true,
		dataType: 'json',
		data: {
			act_id: act_id,
		},
		success: function (obj){
			console.log('success', obj);
			closeProgress2();
			setTimeout(function(){
				var url2 = folder + '../export_act/' + obj.file;
				var s = '<iframe id="ifrm_export" src="' + url2 + '"></iframe>';
				$('#div_export').html(s);
			}, 250);
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.error('error', jqXHR, textStatus, errorThrown);
			closeProgress2();
			errorDialog('Error in exporting.');
		},
	});

	//checkExportComplete();
}
/*
/////////////////////////////////////////////////////////////////

function checkExportComplete(){
	var
		iframe = $('#ifrm_export')[0],
 		iframeDoc = iframe.contentDocument || iframe.contentWindow.document,
		state = iframeDoc.readyState
	;
	console.log(state);
	if (state == 'complete'){
		closeProgress2();
	} else {
		setTimeout(checkExportComplete, 1000);
	}
}
*/
