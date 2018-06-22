

/////////////////////////////////////////////////////////////////////////////////////////////
// open ass page after publish
// coordinator:
//		view: statistics completed, marked
// participant:
//		perform:
//		review:
//		share:
// assessor:
//		mark:
//		review:g
/////////////////////////////////////////////////////////////////////////////////////////////
var
	g_but_review_assessee = '<button type="button" class="btn btn-sm btn-list-edit" onclick=\'markAssessment(getIdFromRow(this),this,"review")\' data-toggle="tooltip" title="Review"><i class="glyphicon glyphicon-certificate"></i></button>',
	g_but_mark_assessee = '<button type="button" class="btn btn-sm btn-list-edit" onclick=\'markAssessment(getIdFromRow(this),this,"mark")\' data-toggle="tooltip" title="Mark"><i class="glyphicon glyphicon-check"></i></button>',
	g_curr_inline_jtr = 0,
	g_left_arrow = '<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeLightBox()"/>',
	g_multi_perform = 0,	// testing only
	g_multi_marking = 1
;

function initViewAsst(){
	var jdiv = $('.div_asst_view');
	jdiv.find('.btn_close, .btn_cancel, .btn_back').click(function(){
		goBack_asst();
	});

	jdiv.find('.btn_clear').click(function(){
		clearViewActAsst();
	});

	jdiv.find('.btn_save').click(function(){
		confirmDialog('Are you sure to save now?', function(){
			saveAssessment(0);
		});
	});
	jdiv.find('.btn_submit').click(function(){
		if (validateBeforeSubmit()){
			confirmDialog('Are you sure to submit now?', function(){
				saveAssessment(1);
			});
		}
	});
	jdiv.find('.btn_resubmit').click(function(){
		confirmDialog('Are you sure to request to resubmit now?', function(){
			openProgress2('Processing...');
			var act_id = g_saved_activity.act_id;
			call_svrop(
				{
					type: 'resubmit_ass',
					act_id: act_id,
					user_id: g_user_id,
					ass_id: g_curr_ass_id,
				},
				function (obj){
					console.info('succeeded', obj);
					closeProgress2();
					if (obj.error){
						errorDialog('Error: ' + obj.error);
						return;
					} else {
						notifyDialog('The request is submitted successfully.', BootstrapDialog.TYPE_INFO);
					}
				}
			);
		});
	});
	$('.td_asst_add').click(function(){
		addPrtRubrics();
	})

	// uploader
	jdiv.find('.uploader_viewass_general').each(function(){
		var
			juploader = $(this),
			jgallery = juploader.parent().parent().find('.gallery_viewass_general')
		;
		initUploader(
			juploader,
		 	jgallery,
			'assessment', {act_id: 0, ass_id: 0}
		);
	})

	// add asst stars
	jdiv.find('.div_asst_stars').html(getDivStar(0, '<b>Score:</b> ', 1));
}

//////////////////////////////////////////////////////////////////////////////////////////////

var g_curr_role = 0, g_curr_ass_id = 0, g_curr_method = '';

function viewAssessment(ass_id, role, part_id, part_name, callback, caller){

	console.log('viewAssessment', 'ass_id=' + ass_id, 'part_id=' + part_id, 'part_name=' + part_name, caller);

	g_curr_role = role;
	g_curr_ass_id = ass_id;
	g_curr_part_id = part_id;
	openProgress2();

	// ACT ASSESSMENT
	var
		assessment = getActAssessement(g_saved_activity, ass_id),
		act_id = g_saved_activity.act_id,
		method = assessment.method
	;
	g_curr_method = method;

	if (!part_id){	// || part_id == g_user_id){

		// preview only: no need to read user
		viewAssessment2(ass_id, role, part_id, g_user, callback);

	} else {

		call_svrop(
			{
				type: 'get_userdoc',
				user_id: part_id,
			},
			function (obj){
				g_curr_user = obj.user;
				viewAssessment2(ass_id, role, part_id, g_curr_user, callback);
			}
		);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////

var g_saved_user_doc = 0;

function viewAssessment2(ass_id, role, part_id, user_doc, callback){

	g_saved_user_doc = user_doc;

	var
		jdiv = $('.div_viewass_' + role + ' .div_asst_view'),
		activity = g_saved_activity,
		act_id = activity.act_id,

		assessment = getActAssessement(activity, ass_id),
		ass_panelists = assessment.panelists ? assessment.panelists : 0,

		uass = getUserAssessment(user_doc, act_id, ass_id),
		uass_panelists = uass ? uass.panelists : 0,

		asst = getActAssessement(activity, ass_id),
		participant = getUserByID(g_act_parts, part_id),
		method = asst.method,
		method_name = method_arr[method]
	;
	// READ ALL THE ASSESSORS FIRST
	var jdiv2 = jdiv.find('.div_peer_assessment');
	if (role == 'previewing'){

		jdiv2.hide();
		viewAssessment3(ass_id, role, part_id, user_doc, 0, callback);

	} else {

		var index = ass_id - 1;
		jdiv2.show();

	 //	(g_multi_perform || !uass.performed)
		var bPeerAsstEditable =
			role == 'participant'
		&&
			ass_panelists.peers != 'all'
		&&
			ass_panelists.peers > 0
		&&
			(
				!uass_panelists.peer_assessors.length	// not selected
			||
				!uass.marked	// not marked
			)
		;

		updatePanelists(jdiv, ass_panelists, uass_panelists, part_id, bPeerAsstEditable, function(){
			viewAssessment3(ass_id, role, part_id, user_doc, bPeerAsstEditable, callback);
		});

	}
}
/////////////////////////////////////////////////////////////////////////////////////

function viewAssessment3(ass_id, role, part_id, user_doc, bPeerAsstEditable, callback){

	var
		jdiv = $('.div_viewass_' + role + ' .div_asst_view'),
		activity = g_saved_activity,
		act_id = activity.act_id,
		assessment = getActAssessement(activity, ass_id),
		uass = getUserAssessment(user_doc, act_id, ass_id),
		ass_panelists = assessment.panelists ? assessment.panelists : 0,
		uass_panelists = uass ? uass.panelists : 0,
		act_id = activity.act_id,
		asst = getActAssessement(activity, ass_id),
		participant = getUserByID(g_act_parts, part_id),
		method = asst.method,
		method_name = method_arr[method],
		all_assessors = getMyAssessors(
			ass_panelists,
			uass_panelists,
			part_id
		),
		av_marks = 0
	;
	// add user_id to the assessor array

	if (uass.method == 'blg' || uass.method == 'bl2'){
		//for (var i in uass.items){
		for (var i = 0; i < uass.items.length; i++){
			var item = uass.items[i];
			//for (var j in item.comments){
			if (item.comments){
				for (var j = 0; j < item.comments.length; j++){
					var comment = item.comments[j];
					remove_element_from_array(all_assessors, comment.user_id);
					all_assessors.push(comment.user_id);
				}
			}
		}
	}
	//console.info('viewAssessment3', uass);
	closeProgress2();

	jdiv.find('.bodyview_title2').html(method_name);
	jdiv.find('.btn_panel').show();
	setCurrPage(PAGE_VIEW_ASS);

	//alert(uass.performed);

	// HIDE ALL TOOLTIPS
	$('.tbl_actpage [data-toggle=tooltip]').tooltip('disable');

	// TIMESTAGE
	var
		timestage = getTimeStage(asst.start, asst.end),
		stage = timestage.stage
	;
	//stage = TIMESTAGE_CLOSED;	// testing only
	// PUT ASSESSMENT ON THE LIGHTBOX
	var media_id_arr = [];	// for pst post operations

	/////////////////////////////////////////////////////////////////////////////////////////
	// 1. HEADER
	/////////////////////////////////////////////////////////////////////////////////////////
	// PERIOD
	var sPeriod = getUniformPeriod(asst.start, asst.end);
	jdiv.find('.asspage_period').html(
		'<b>Period:</b> ' + asst.start + ' - ' + asst.end + ' <span class="time_stage">(' + timestage.desc + ')</span>'
	);

	// DESC
	jdiv.find('.asspage_desc').html(asst.desc);

	// ROLE
	jdiv.find('.asspage_role').html('<b>Role:</b> ' + capitalizeWords(role));

	// PARTICIPANTS
	jdiv.find('.asspage_participant').html('<b>Participant:</b> ' + (participant.username ? participant.username : ''));

	// STATUS
	var status = getAssStatus(uass);
	if (status){

		// STATUS
		jdiv.find('.asspage_status').html('<b>Status:</b> ' + status.desc);

		// MARKS
		if (status.value == UASSSTATUS_MARKED){
			switch (role){

				case 'participant':
				case 'coordinator':
					av_marks = getMarksByID(asst, 'part_asst_marks', part_id)
					break;

				case 'assessor':
					var assr_id = g_user_id;
					av_marks = getMarksByID(asst, 'assr_asst_marks', assr_id+','+part_id);
					break;
			}
		}
		//setDivStarValue(jdiv, marks);

		jdiv.find('.uploader_viewass_general')
			.uploader('loadGallery', asst.media)
		;

		// show/hide
		if (g_curr_role == 'assessor' && method == 'prt' && (g_multi_marking || !uass.marked)){
			$('.td_asst_add').show();
		} else {
			$('.td_asst_add').hide();
		}
		if (method == 'pst'){
			$('#viewass_uploader_pst').show();
		} else {
			$('#viewass_uploader_pst').hide();
		}
		if (asst.media && asst.media.length){
			jdiv.find('.div_assview_material').show();
		} else {
			jdiv.find('.div_assview_material').hide();
		}
		if (asst.skills && obj_count(asst.skills)){
			jdiv.find('.div_assview_skills').show();
		} else {
			jdiv.find('.div_assview_skills').hide();
		}
	}

	/////////////////////////////////////////////////////////////////////////////////////////
	// 2. ASSESSMENT ITEMS
	/////////////////////////////////////////////////////////////////////////////////////////
	var	method = asst.method;

	// find opts for view or edit
	// according to
	// 1. method
	// 2. role
	// 3. time stage
	// 4. status (saved, performed, marked)
	if (!uass){
		uass = {};
	}
	if (!uass.items){
		uass.items = [];
	}
	if (!uass.saved) uass.saved = '';
	if (!uass.performed) uass.performed = '';
	if (!uass.marked) uass.marked = '';

	var opts = {
		bViewQuestion: 1,
		bViewAnswer:
		(
			role != 'participant'
				&& (method == 'bl2' || uass.performed)	// assessor and participant to able to see the daily journal
		)
		||
			role == 'participant'
		,
		bEditAnswer:
			role == 'participant'
				&& method != 'prt'
				&& stage == TIMESTAGE_OPENING
				&& (g_multi_perform || !uass.performed)
				&& !uass.marked
		,
		bEditMarking:
			role == 'assessor'
				//&& method != 'sur'
				&&
						(
							method == 'prt'
							||
							method == 'mcq'
							||
							(
								stage >= TIMESTAGE_OPENING
								//&& uass.performed != ''
								&& (g_multi_marking || !uass.marked)
							)
						)
		,
		bViewMarking:
			role != 'previewing'
				//&& method != 'sur'
				&&
				(
					(
						role == 'assessor'
						&& (
							method == 'prt'
							||
							uass.marked
						)
					)
					||
					(
						role != 'assessor'
						&& uass.marked != ''
					)
				)
		,
		bEditComment:
			role == 'assessor'
				&& method != 'sur'
				&& stage >= TIMESTAGE_OPENING && (g_multi_marking || !uass.marked)
		,
	};
	if (role == 'previewing' || method == 'pst'){
		opts.bViewAnswer = 0;
	}
	if (method == 'sur' && !anyEnabledRubrics(asst)){
		opts.bViewMarking = 0;
		opts.bEditMarking = 0;
	}
	//console.log('opts', opts);
	var
		jtbl = jdiv.find('.tbl_asspage_asst'),
		tbody = jtbl.find('>tbody').empty()
	;
	// write down the method
	jtbl.attr('method', method);
	if (opts.bViewMarking || opts.bEditMarking){
		$('.asspage_marks').show();
	} else {
		$('.asspage_marks').hide();
	}

	jdiv.find('.asspage_hdr_others, .viewass_uploader_pst, .asspage_hdr_blg').hide();
	jdiv.find('.tbl_asspage_asst_general, .tbl_asspage_asst_pst').hide();

	switch (method){
		case 'pst':
			jdiv.find('.tbl_asspage_asst_pst').show();
			break;

		default:
			jdiv.find('.tbl_asspage_asst_general').show();
			break;
	}

	// prepare calculation of marks
	g_assr_item_marks_hash = {};
	g_assr_asst_marks = 0;

	switch (method){

		case 'prt':
			jdiv.find('.asspage_hdr_others').show();
			viewActAsst_prt_all(opts, asst, uass, tbody);
			break;

		case 'pst':
			jdiv.find('.viewass_uploader_pst').show();
			media_id_arr = viewActAsst_pst(opts, asst, uass, role, tbody, stage, status, act_id, part_id);
			break;

		case 'blg':
		case 'bl2':
			jdiv.find('.asspage_hdr_blg').show();
			jdiv.find('[name=anchor_actview_blog]').text(method_arr[method]);

			if (opts.bViewAnswer || opts.bEditAnswer){
				var
					total_marks = 0,
					total_count = 0
				;
				for (var i = 0; i < uass.items.length; i++){
					var
						item = uass.items[i],
						item_id = i + 1
					;
					total_marks += parseFloat(addBlogItem(opts, jdiv, asst, uass, item));
					total_count++;
				}
				if (total_count > 0){
					av_marks = getTruncatedScore(total_marks/total_count);
				}
			}
			if (role == 'participant' && !uass.performed && !uass.marked){
				jdiv.find('.but_additem').show();
			} else {
				jdiv.find('.but_additem').hide();
			}

			// resize after loading images
			jdiv.find('img').load(function(){
				transdiv_resize();
			});
			break;

		default:

			jdiv.find('.asspage_hdr_others').show();
			var act_items = asst.items;
			if (!act_items || !act_items.length){

				console.error('error no items in this assessment ' + ass_id);

			} else {

				for (var i = 0; i < asst.items.length; i++){
					var item = asst.items[i];
					var item_id = i + 1;
					viewItem(opts, asst, uass, stage, status, tbody, role, item_id, part_id);
				}
			}

			break;
	}
	// rubrics for all assessments
	switch (method){
		case 'pst':
		case 'blg':
		case 'bl2':
			if (opts.bViewMarking || opts.bEditMarking || uass.items.length > 0){

			} else {
				var s = getViewRubricTbl(asst, 0, 0, RUBRICS_VIEW);
				tbody.append(s);
			}
			break;

		case 'sur':
			if (!anyEnabledRubrics(asst)){
				av_marks = '';
			}
			break;

		case 'mcq':
			av_marks = g_assr_asst_marks;
			break;
	}

	showDivStar($('.div_item_stars'));

	/////////////////////////////////////////////////////////////////////////////////////////
	// 3. SKILLS
	/////////////////////////////////////////////////////////////////////////////////////////
	var skills = asst.skills;
	var jtbl = jdiv.find('.my_datatable[dt_type=skills]');
	if (skills){
		//console.info('skills', skills);
		if (!jtbl.hasClass('dataTable')){
			jtbl.DataTable({
				//ordering: false,	// otherwise, the list is difficult to trace
				rowReorder: true,
				autoWidth: false,
				bPaginate: false,
				dom: '',
				language:{
					emptyTable: '',
					zeroRecords: '',
				},
				columnDefs: [
					//{	targets: [ 0 ],	orderable: false,	},
				],
			});
		}
		var dt_skills = jtbl.show().DataTable().clear().draw();
		for (var skill_name in skills){
			dt_skills.row.add([skill_name]);
		}
		dt_skills.draw();
	}

	//////////////////////////////////////////////////////////////////
	// 5. BUTTONS
	//////////////////////////////////////////////////////////////////
	showViewAsstBtnPanel(jdiv, act_id, role, uass, stage, method, opts);

	// SAVE FOR CHECKLOSEINPUT
	g_saved_assessment_view = getAssessmentInput(role);

	// EXPAND/COLLAPSE ASSESSORS
	var jbut_expand = jdiv.find('[name=anchor_assview_assessors] .but_expand');
	var jdiv_expand = jdiv.find('.div_asspage_assessors');
	jdiv_expand.show();

	// collapse after showing the page
	var default_minus = bPeerAsstEditable;
	setExpandable(jbut_expand, jdiv_expand, default_minus);

	// show av_marks
	var jav_marks = jdiv.find('.div_asst_stars');
	if (g_curr_role == 'assessor' || uass.marked){
		jav_marks.show();
		setDivStarValue(jav_marks, av_marks);
	} else {
		jav_marks.hide();
	}

	// callback
	callback && callback();

	// fixit: record the scrolltop for now
	$(window).scrollTop(0);
}


/////////////////////////////////////////////////////////////////////////////////////////////

function getIdFromRow(obj){
	var jobj = $(obj),
			jtr = jobj.closest('tr')
	;
	if (jtr.hasClass('child')){	// for responsive table
		jtr = jtr.prev();
	}
	var jtbl = jobj.closest('table'),
			jtbl_id = jtbl.attr('id'),
			dt = jtbl.DataTable()
			row = dt.row( jtr ),
			cols = row.data(),
			id = cols[0]
	;
	return isNaN(id) ? id : parseInt(id);
}

///////////////////////////////////////////////////////////////

function getUserAssessment(user, act_id, ass_id){
	var uass = 0;
	var activities = user.profile.activity;
	for (var i = 0; i < activities.length; i++){
		var activity = activities[i];
		if (activity.act_id == act_id){
			var assessments = activity.assessments;
			if (ass_id - 1 <= assessments.length){
				uass = assessments[ass_id - 1]
			}
			if (!uass){
				uass = {
					ass_id: ass_id,
					items: [],
					weight: 0,
				};
				['method', 'title', 'start', 'end', 'desc'].forEach(function(name){
					uass[name] = activity[name];
				});
			}
			break;
		}
	}
	return uass;
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function getActAssessement(activity, ass_id){
	// FIND ASSESSMENT FROM THE MEMORY OR FROM THE DATABASE?
	var assessment = 0, index = ass_id - 1;
	if (index >= 0 && index < activity.assessment.assessments.length){
		assessment = activity.assessment.assessments[index];
	}
	if (!assessment){
		console.error('wrong assessment ass_id=' + ass_id);
	}
	return assessment;
}

//////////////////////////////////////////////////////////////////////////////////////////////

var
	UASSSTATUS_NEW = 0,
	UASSSTATUS_SAVED = 1,
	UASSSTATUS_PERFORMED = 2,
	UASSSTATUS_MARKED = 3
;
function getAssStatus(uass){
	var value = 0, desc = '';
	if (uass.marked){
		value = UASSSTATUS_MARKED;
		desc = 'Marked ' + uass.marked;
	} else if (uass.performed){
		value = UASSSTATUS_PERFORMED;
		desc = 'Submitted at ' + uass.performed;
	} else if (uass.saved){
		value = UASSSTATUS_SAVED;
		desc = 'Saved at ' + uass.saved;
	} else {
		value = UASSSTATUS_NEW;
		desc = 'New';
	}
	return {
		value: value,
		desc: desc,
	};
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getAssessmentByAssID(activity, ass_id){
	return activity.assessment.assessments[parseInt(ass_id) - 1];
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function getAssessmentMarks(jsliders){
	var ass_marks = 0;
	jsliders.each(function(){
		var
			 marks = parseInt($(this).attr('marks')),
			 weight = parseInt($(this).attr('weight'))
		;
		//console.info(!isNaN(marks), !isNaN(weight))
		if (!isNaN(marks) && !isNaN(weight)){
			ass_marks += (marks * (weight / 100.0));
		}
	});
	//console.info(ass_marks, typeof(ass_marks), !isNaN(ass_marks));
	ass_marks = Math.ceil(ass_marks);
	return ass_marks;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function clearViewActAsst(){
	console.info('clearViewActAsst');
	checkLoseInput(clearViewActAsst2);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function clearViewActAsst2(){
	console.info('clearViewActAsst2');
	var jdiv = g_bodyview;
	switch (g_curr_role){

		case 'assessor':
			jdiv.find('.rubrics_selected').removeClass('rubrics_selected');
			jdiv.find('.slider').slider( "value", 0);
			jdiv.find('.slider .custom-handle').text(0);
			jdiv.find('.asspage_open_comments').each(function(){
				$(this).html('');
			});
			break;

		case 'participant':
			jdiv.find('.asspage_open_answer').each(function(){
				$(this).html('');
			});
			break;
	}
}

///////////////////////////////////////////////////////////////
// assessment, 'part_asst_marks', part_id

function getMarksByID(obj, name, key, bRedIfNull){
	var marks = '-';
	var obj2 = obj[name];
	if (!key){
		if (typeof(obj2) != 'undefined'){
			marks = obj2;
		}
	} else if (obj2 && typeof(obj2[key]) != 'undefined'){
		marks = obj2[key];
	}
	//if (bRedIfNull && marks == '-')
	//{
	//	marks = '<span style="color:red">' + marks + '</span>';
	//}
	return marks;
}

/////////////////////////////////////////////////////////////
// alantypoon 20170705
// show status for the assessment
/////////////////////////////////////////////////////////////

function setMarksByID(assessment, name, key, marks){
	if (!assessment || !name || !key){
		console.info('setMarksByID error');
	} else {
		if (!assessment[name]){
			assessment[name] = {};
		}
		assessment[name][key] = marks;
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////////////

function saveAssessment(bSubmit){
	var
		jdiv = $('.div_viewass_' + g_curr_role + ' .div_asst_view'),
		act_id = g_saved_activity.act_id,
		asst = getAssessmentByAssID(g_saved_activity, g_curr_ass_id),
		input = getAssessmentInput(),
		user_id = 0,
		assr_id = 0,
		assr_asst_marks = ''
	;
	console.info('saveAssessment', 'submit='+bSubmit, input);

	switch (g_curr_role){

		case 'participant':
			user_id = g_user_id;
			break;

		case 'assessor':
			user_id = g_curr_part_id;
			assr_id = g_user_id;
			// get the final marks from this assessor
			if (asst.method == 'sur' && !obj_count(input)){
				assr_asst_marks = 'Checked';
			} else {
				assr_asst_marks = getAssrAsstMarks(asst, input);
			}
			break;
	}
	openProgress2();

	var sendinput = {
		type: 'save_assessment',
		user_id: user_id,
		assr_id: assr_id,
		act_id: act_id,
		ass_id: g_curr_ass_id,
		role: g_curr_role,
		input: input,
		method: g_curr_method,
		assr_asst_marks: assr_asst_marks,
		submitted: bSubmit?1:0,
	};

	console.debug('save_assessment', sendinput);
	call_svrop(

		sendinput,

		function (obj){

			console.info('success', obj);
			closeProgress2();

			// POST SUBMISSION OPERATIONS
			var activity = g_saved_activity,
					assr_id = g_user_id,
					part_id = g_curr_part_id
			;

			// copy the uass to the memory
			var uact = getUact(act_id);
			if (uact && uact.assessments && uact.assessments[g_curr_ass_id - 1]){
				uact.assessments[g_curr_ass_id - 1] = jsonclone(obj.uass);
			}

			switch (g_curr_role){

				case 'participant':
					////////////////////////////////////////////////////
					// write to the user
					////////////////////////////////////////////////////
/*
					var uass = getUserAssessment(g_user, act_id, g_curr_ass_id);
					if (uass){
						uass = obj.uass;
						// answer
						for (var item_id in input){
							// 1. update assr_item_marks
							var input_item = input[item_id],
								index = item_id - 1
							;
							if (!uass.items){
								uass.items = [];
							}
							if (!uass.items[index]){
								uass.items[index] = {};
							}
							if (input_item.answer){
								uass.items[index].answer = input_item.answer;
							}
							if (input_item.media_id_arr){
								uass.items[index].media_id_arr = input_item.media_id_arr;
							}
							if (input_item.media_id){
								uass.items[index].media_id = input_item.media_id;
							}
							if (input_item.media_desc){
								uass.items[index].media_desc = input_item.media_desc;
							}
						}
						// status
						if (!bSubmit){
							uass.saved = obj.server_time;
						} else {
							uass.performed = obj.server_time;
						}
					}
*/
					/////////////////////////////////////////////////////////////////////////////
					// update activity in memory
					/////////////////////////////////////////////////////////////////////////////
					if (bSubmit){
						var
							assessment = getAssessmentByAssID(activity, g_curr_ass_id),
							method = assessment.method
						;
						assessment.part_asst_marks[part_id] = 'submitted';
					}
					break;

				case 'assessor':

					/////////////////////////////////////////////////////////////////////////////
					// update activity in memory
					/////////////////////////////////////////////////////////////////////////////
					var	assessment = getAssessmentByAssID(activity, g_curr_ass_id),
						method = assessment.method
					;

					// 1. assr_asst_marks
					setMarksByID(assessment, 'assr_asst_marks', assr_id+','+part_id, assr_asst_marks);	// this should also work!

					// 2. part_asst_marks
					setMarksByID(assessment, 'part_asst_marks', part_id, obj.part_asst_marks);

					// 3. assr_asst_completed
					setCompletedByID(assessment, 'assr_asst_completed', assr_id, obj.assr_asst_completed);

					//changeBodyView(-1);	return;
					/////////////////////////////////////////////////////////////////////////////
					// update user profile in memory (if it is my user_id: self marking)
					/////////////////////////////////////////////////////////////////////////////
					if (part_id == g_user_id){

						// uass
/*
						var uass = getUserAssessment(g_user, act_id, g_curr_ass_id);
						if (uass){
							uass = obj.uass;
							for (var item_id in input){

								if (!uass.items){
									uass.items = {};
								}
								if (!uass.items[index]){
									uass.items[index] = {};
								}
								if (!uass.items[index].assessors){
									uass.items[index].assessors = {};
								}

								// 1. update assr_item_marks
								var input_item = input[item_id],
									index = item_id == 0 ? 0 : item_id - 1,	// 0 = prt
									part_item = uass.items[index]
									//part_item = uass.items[item_id]
								;
								if (part_item){
									var assessors = part_item.assessors;
									assessor = getUserByID(assessors, g_user_id);
									assessor.assr_item_marks	= input_item.assr_item_marks;
									assessor.comments			= input_item.comments;
									assessor.date 				= input_item.date;
									assessor.assr_rubrics_indexes = input_item.assr_rubrics_indexes;
								} else {
									console.error('undefined part_item', uass.items, index);
								}

								// 2. update part_item_marks
								if (method == 'mcq'){

									part_item.part_item_marks = assessor.assr_item_marks;

								} else {

									var total_marks = 0, total_markers = 0;
									for (var assr_id in assessors){
										var assessor2 = assessors[assr_id];
										total_marks += parseInt(assessor2.assr_item_marks + '');
										total_markers++;
									}
									if (total_markers > 0){
										part_item.part_item_marks = parseInt(total_marks / total_markers);
									}
								}
							}
						}
*/
					}

					// 4. marked time
					if (bSubmit){
						var uass = getUserAssessment(g_user, act_id, g_curr_ass_id);
						if (uass){
							uass.marked = obj.server_time;
						}
					}
					break;
			}
			// notification only for participants
			if (g_curr_role == 'participant'){
				notifyDialog('The assessment is ' + (!bSubmit?'saved':'submitted') + '.');
			}
			// after submission
			if (bSubmit){

				switch (g_curr_role){

					case 'participant':
						// reload this
						g_jcurr_marks.html(g_string_submitted);

						// refresh stat in accessor
						//viewActAsst_assr1();
						//viewActAsst_coor1();
						showRoleTab2(ROLE_PARTICIPANT);
						goBack_asst();
						break;

					case 'assessor':

						// update table
						var marks = getStarsStatus(assr_asst_marks);
						g_jcurr_marks.html(marks);
						showDivStar(g_jcurr_marks.parent());
						var stat = getAsstStat(activity, g_curr_ass_id);
						g_jcurr_stat.html(stat);

						// update assessor
						refreshAsstMarked();

						// update part
						//refreshAsstPart();

						showRoleTab2(ROLE_ASSESSOR);
						goBack_asst();
						break;

					case 'coordinator':
						changeBodyView(-1);
						showRoleTab2(ROLE_COORDINATOR);
						break;
				}
			}

		},
		function (obj){
			//console.error('saveactivity failed', obj);
		}
	);
}

////////////////////////////////////////////////////////

function closeViewAssessment(){
	console.debug('closeViewAssessment');
	changeBodyView(-1);
}

////////////////////////////////////////////////////////

function validateBeforeSubmit(){
	var err = 0, jobj = 0;
	var jdiv = $('.div_viewass_' + g_curr_role + ' .div_asst_view');

	// CHECK OPEN ANSWERS
	if (g_curr_role == 'participant'){
		var janswers = jdiv.find('.asspage_open_answer');
		if (janswers.length){
			janswers.each(function(){
				var ans = $(this).html().trim();
				if (ans == ''){
					err = "This field must not be empty.";
					showInvalidInput($(this), err);
					if (!jobj) jobj = $(this); // get the first error to scroll
				}
			});
		}

		// CHECK PEER SELECTION
		var jtbl = jdiv.find('.tbl_peer_assessment')
		var npeerassr = jtbl.find('.span_peers').text();
		if (!isNaN(npeerassr) && parseInt(npeerassr) > 0){
			npeerassr =  parseInt(npeerassr);
			var npart = parseInt(jtbl.find('.span_participants').text());
			var assessors = getUsers(jtbl);
			var nselected = assessors.length;
			if (nselected != npeerassr){
				var
					jdiv = jdiv.find('.div_asspage_assessors'),
					jbut = jdiv.prev().find('.but_expand')
				;
				expandDiv(jbut, jdiv, 1);
				err = "Select your peer assessors";
				var jobj2 = jtbl.find('.btn_select');
				showInvalidInput(jobj2, err);
				if (!jobj) jobj = jobj2; // get the first error to scroll
			}
		}
	}
	// SCROLL TO THE FIRST ELEMENT
	if (jobj){
		scroll2Element(jobj);
	}
	return !err;
}

//////////////////////////////////////////////////////////////

function getAssessorsFromPanelists(activity, panelists){
	var assrs_hash = {};

	if (panelists.coordinator == 1){
		var coor_id = parseInt(activity.coordinator_id);
		assrs_hash[coor_id] = 1;
	}
	//echo "add panelists: "; print_r($panelists['others']); echo "<br><br>";
	if (typeof(panelists.others) == 'array'){
		for (var i in panelists.others){
			var user_id = panelists.others[i];
			assrs_hash[user_id] = 1;
		}
	}
	//echo "<b>HASH panelists:</b>"; print_r($assessors); echo "<br><br>";
	return hash2numArr_key(assrs_hash);
}

//////////////////////////////////////////////////////////////

function getAssrAsstMarks(asst, input){

	console.log('getAssrAsstMarks', asst, input);

	var
		marks = 0,
		method = asst.method
	;
	switch (method){

		case 'prt':
			var total = 0, count = 0;
			for (var item_id in input){
				total += parseFloat(input[item_id].assr_item_marks);
				count++;
			}
			if (count > 0){
				marks = total / count;
			}
			break;

		case 'mcq':
			marks = g_assr_asst_marks;
			break;

		default:
			for (var item_id in input){

				var weight = 100;
				if (asst.items.length){

					weight = asst.items[item_id].weight;

				} else {

					// for pst and blg
					var total = obj_count(input);
					if (total > 0){
						weight = Math.floor((1 / total ) * 100);
					}
				}
				var item_marks = parseFloat(input[item_id].assr_item_marks);
				marks += item_marks * (weight / 100);
			}
			break;
	}
	return getDecPlace(marks, 2);
}

//////////////////////////////////////////////////////////////

function refreshAsstMarked(){
	var
		//jdiv = $('#div_viewass_assr'),
		stat = getAsstStat(g_saved_activity, g_curr_ass_id)
	;
	//$('.viewass_info').html('submitted/marked/total: ' + stat);
	$('.viewass_info').html('total/submitted/marked: ' + stat);
}


//////////////////////////////////////////////////////////////

function getAsstStat(act, ass_id){

	var
		npart = act.participants.length,
		asst = getAssessmentByAssID(act, ass_id),
		nsubmitted = obj_count(asst.part_asst_marks),
		nmark = 0
	;

	//console.log(asst.part_asst_marks);

	for (var key in asst.assr_asst_marks){
		var assr_id = key.split(',')[0];
		if (assr_id == g_user_id){
			nmark++
		}
	}

	//console.log('getAsstStat', asst, nsubmitted + '/' + nmark + '/' + npart);
	//return '<span class="asst_stat">' + nsubmitted + '/' + nmark + '/' + npart + '</span>';
	return '<span class="asst_stat">' + npart + '/' + nsubmitted + '/' + nmark + '</span>';
}

//////////////////////////////////////////////////////////////

function refreshAsstTitle(ass_id){
	var asst = getAssessmentByAssID(g_saved_activity, ass_id);
	$('.viewact_title').html(getActTitle(g_saved_activity, asst));
}

//////////////////////////////////////////////////////////////

function showViewAsstBtnPanel(jdiv, act_id, role, uass, stage, method, opts){
	$('#div_viewact_btn_panel').hide();
	var
		jpanel = jdiv.find('.div_viewass_btn_panel'),
		full_btns = '.btn_back,.btn_cancel,.btn_close,.btn_save,.btn_clear,.btn_submit,.btn_resubmit',
		btns = '.btn_back'
	;
	switch (role){

		case 'participant':
			if (!g_multi_perform && uass.performed != ''){
				if (stage == TIMESTAGE_OPENING && !uass.marked){
					btns += ',.btn_resubmit';
				}
			} else if (method == 'prt'){
			} else if (method == 'pst'){
				btns += ',.btn_save,.btn_submit';
			} else if (opts.bEditAnswer){
				btns += ',.btn_clear,.btn_save,.btn_submit';
			}
			break;

		case 'assessor':
			if (!g_multi_marking && uass.marked != ''){
			} else if (method == 'prt' || method == 'sur'){
				btns += ',.btn_submit';
			} else if (opts.bEditMarking){
				btns += ',.btn_clear,.btn_submit'; // consider .btn_save
			}
			break;

		case 'coordinator':
			if (act_id != 0){
				btns += ',.btn_delete';
			}
			break;
	}
	////////////////////////////////////////////
	// BUTTON PANEL
	////////////////////////////////////////////
	jpanel
		.find(full_btns).hide();

	jpanel
		.find(btns).show();
}

//////////////////////////////////////////////////////////////////////////////////////////

function getAssessmentInput(){

	// output
	var jdiv = $('.div_viewass_' + g_curr_role + ' .div_asst_view');
	var input = [], item_id = 1;

	switch (g_curr_method){
		case 'pst':
			break;

		default:
			jdiv = jdiv.find('.tbl_asspage_asst_general');	break;
			break;
	}

	switch (g_curr_role){

		case 'participant':
			switch (g_curr_method){

				case 'sur':
					// selects only
					jdiv.find('select, .asspage_open_answer').each(function(){
						var jobj = $(this);
						var answer = '';
						if (jobj.prop('tagName') == 'SELECT'){
							var jselect = jobj,
								val = jselect.val();
							;
							answer = val;
						} else {
							answer = jobj.html();
						}
						var input_item = {
							ass_item_id: item_id++,
							answer: answer,
						}
						input.push(input_item);// [item_id++] = input_item;
					});
					break;

				case 'mcq':
					jdiv
						.find('.tbl_mcq_answer')
						.each(function(){
							var
								jobj = $(this),
								janswers = jobj.find('input:checked'),
								answers = []
							;
							janswers.each(function(){
								answers.push($(this).val());
							});
							var input_item = {
								ass_item_id: item_id++,
								answer: answers.join(','),
							}
							input.push(input_item);
						});
					break;

				case 'pst':
					var juploader = jdiv.find('.uploader_viewass_pst');
					var media_id_arr = juploader.uploader('getMediaIDArr');
					var media_desc_hash = juploader.uploader('getMediaDescHash');
					//for (var i in media_id_arr){
					for (var i = 0; i < media_id_arr.length; i++){
						var media_id = media_id_arr[i];
						var media_desc = media_desc_hash[media_id];
						var input_item = {
							ass_item_id: item_id++,
							media_id: media_id,
							media_desc: media_desc,
						}
						input.push(input_item);
					}
					break;

				default:
					jdiv.find('.tbl_ass_item').each(function(){

						// GET MEDIA FOR EACH ITEM
						var media_id_arr = [], media_desc_hash = {};
						var juploader = $(this).find('.uploader_init');
						if (juploader.length > 0){	// otherwise media_id_arr will be a messy nested object !
							media_id_arr = juploader.uploader('getMediaIDArr');
							media_desc_hash = juploader.uploader('getMediaDescHash');
						}
						var input_item = {
							ass_item_id:			item_id++,
							answer: 					$(this).find('.asspage_open_answer').html(),
							media_id_arr: 		media_id_arr,
							media_desc_hash:	media_desc_hash,
						}
						input.push(input_item);
					});
					break;

			}
			break;

		case 'assessor':

			if (g_curr_method == 'mcq'){

				////////////////////////
				// MCQ
				////////////////////////
				jdiv.find('.tbl_mcq_comments').each(function(){
					var
						jtbl = $(this),
						jitem = jtbl.closest('.tbl_ass_item')
					;
					var comments = jtbl.find('.asspage_open_comments').text().trim();
					var input_item = {
						ass_item_id:			item_id,
						assr_rubrics_indexes: 	{},
						assr_item_marks: 		g_assr_item_marks_hash[item_id++],
						comments: 				comments,
						date: 					getDateTimeString(),	// to be replaced in the server side
					};
					input.push(input_item);
				});


			} else {

				////////////////////////
				// OTHER METHODS
				////////////////////////

				jdiv.find('.tbl_5star_marking').each(function(){
					var
						jtbl = $(this),
						assr_rubrics_indexes = {}
						total_scores = 0,
						skill_counter = 0
					;
					jtbl.find('.head3').each(function(){
						var
							jtd = $(this),
							row_name = jtd.find('.row_name').text().trim()
						;
						if (row_name){
							var
								jtr = jtd.parent(),
								index = 0,
								jselected = jtr.find('.rubrics_selected')
							;
							if (jselected.length){
								index = jtr.find('.cell').index(jselected) + 1;	// one-based
							}
							if (index > 0){
								assr_rubrics_indexes[row_name] = index;
								total_scores += index;
								skill_counter++;
							}
							//console.info(item_id, row_name, index, total_scores, skill_counter);
						}
					});

					// marks
					var assr_item_marks = !skill_counter ? 0 : getTruncatedScore(total_scores / skill_counter);
					console.log('assr_item_marks', assr_item_marks);
					var comments = jtbl.find('.asspage_open_comments').text().trim();
					var input_item = {
						ass_item_id:			item_id++,
						assr_rubrics_indexes: 	assr_rubrics_indexes,
						assr_item_marks: 		assr_item_marks,
						comments: 				comments,
					};

					// date time
					if (g_curr_method == 'prt'){
						input_item.daterange = jtbl.prev('.tbl_prt_hdr').find('.event_daterange').val();
					} else {
						input_item.date = getDateTimeString();	// to be replaced in the server side
					}
					input.push(input_item);
				});
			}

	}
	// REVERSE THE ORDER FOR SPECIAL ASSESSMENT (e.g. BLG AND BL2)
	if (g_curr_method == 'blg' || g_curr_method == 'bl2'){
		for (var i = 0; i < input.length; i++){
			var input_item = input[i];
			input_item.ass_item_id = input.length - input_item.ass_item_id + 1;
		}
	}
	console.log('getAssessmentInput', input);
	return input;
}
