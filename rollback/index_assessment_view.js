

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
//		review:
/////////////////////////////////////////////////////////////////////////////////////////////
var
	g_but_review_assessee = '<button type="button" class="btn btn-sm btn-list-edit" onclick=\'markAssessment(getIdFromRow(this),this,"review")\' data-toggle="tooltip" title="Review"><i class="glyphicon glyphicon-certificate"></i></button>',
	g_but_mark_assessee = '<button type="button" class="btn btn-sm btn-list-edit" onclick=\'markAssessment(getIdFromRow(this),this,"mark")\' data-toggle="tooltip" title="Mark"><i class="glyphicon glyphicon-check"></i></button>',
	g_curr_inline_jtr = 0,
	g_left_arrow = '<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeLightBox()"/>'
;
var
	 g_multi_perform = 0
	,g_multi_marking = 1
;

function initAssessment(){
	var jdiv = $('#div_assessment_view');
	jdiv.find('.btn_close, .btn_cancel, .btn_back').click(function(){
		closeViewAssessment();
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

}

//////////////////////////////////////////////////////////////////////////////////////////////

var g_curr_role = 0, g_curr_ass_id = 0, g_curr_method = '';

function viewAssessment(ass_id, role, part_id){

	console.info('viewAssessment', 'ass_id=' + ass_id, 'part_id=' + part_id);
	
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
	
	if (!part_id || part_id == g_user_id){
	
		viewAssessment2(ass_id, role, part_id, g_user);
		
	} else {
	
		call_svrop(
			{
				type: 'get_userdoc',
				user_id: part_id,
			},
			function (obj){
				g_curr_user = obj.user;
				viewAssessment2(ass_id, role, part_id, g_curr_user);
			}
		);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////

function viewAssessment2(ass_id, role, part_id, user_doc){
	var
		act_id = g_saved_activity.act_id,
		assessment = getActAssessement(g_saved_activity, ass_id),
		uass = getUserAssessment(user_doc, act_id, ass_id),
		ass_panelists = assessment.panelists ? assessment.panelists : 0,
		uass_panelists = uass ? uass.panelists : 0,
		my_assessors = getPrimaryAssessors(g_saved_activity.coordinator_id, g_user_id, ass_panelists, uass_panelists)
		//my_assessees = getMyAssessees(g_saved_activity.coordinator_id, g_user_id, g_saved_activity.participants, ass_panelists, uass_panelists)
	;
	console.info('my_assessors', my_assessors);//, 'my_assessees', my_assessees);
	
	// FIRST FIND THE PANELISTS FROM USERS
	getUsersFromDB(my_assessors, function(panelists_users){
		g_curr_assessment_assessors = panelists_users;
		viewAssessment3(ass_id, role, part_id, ass_panelists, uass_panelists, my_assessors, panelists_users, uass);
	});
}

//////////////////////////////////////////////////////////////////////////////////////////////
function viewAssessment3(ass_id, role, part_id, ass_panelists, user_panelists, my_assessors, panelists_user, uass){
	
	var jdiv = $('#div_assessment_view'),
			activity = g_saved_activity,
			act_id = activity.act_id,
			assessment = getActAssessement(activity, ass_id),
			participant = getUserByID(g_curr_participants, part_id),
			method = assessment.method
			method_name = method_arr[method]
	;
	//console.info('viewAssessment3', uass);
	closeProgress2();
	
	jdiv.find('.bodyview_title2').html(method_name);
	changeBodyView(PAGE_VIEW_ASS);
	//alert(uass.performed);

	// HIDE ALL TOOLTIPS
	$('.tbl_actpage [data-toggle=tooltip]').tooltip('disable');
	
	// TIMESTAGE
	var
		timestage = getTimeStage(assessment.start, assessment.end),
		stage = timestage.stage
	;
	//stage = TIMESTAGE_CLOSED;	// testing only
	// PUT ASSESSMENT ON THE LIGHTBOX
	
	var media_id_arr = [];	// for pst post operations
	
	/////////////////////////////////////////////////////////////////////////////////////////
	// 1. HEADER
	/////////////////////////////////////////////////////////////////////////////////////////
	
	// TITLE
	var title = assessment.title;// + ' (' + method_name + ')';
	jdiv.find('.asspage_title').html('<b>Title:</b> ' + title);
	
	// PERIOD
	var sPeriod = getUniformPeriod(assessment.start, assessment.end);
	//jdiv.find('.asspage_period').html('<b>Period:</b> ' + sPeriod + ' <span class="time_stage">(' + timestage.desc + ')</span>');
	jdiv.find('.asspage_period').html(
		'<b>Period:</b> ' + assessment.start + ' - ' + assessment.end + ' <span class="time_stage">(' + timestage.desc + ')</span>'
	);

	// DESC
	jdiv.find('.asspage_desc').html(assessment.desc);
	
	// ROLE
	//jdiv.find('.asspage_role').html('<table><tr><td><b>Role:</b> ' + capitalizeWords(role) + ' </td></tr></table>');
	jdiv.find('.asspage_role').html('<b>Role:</b> ' + capitalizeWords(role));

	// PARTICIPANTS
	jdiv.find('.asspage_participant').html('<b>Participant:</b> ' + (participant.username?participant.username:''));
	
	var status = getAssStatus(uass);
	if (status){
	
		// STATUS
		jdiv.find('.asspage_status').html('<b>Status:</b> ' + status.desc);

		// MARKS
		if (status.value == UASSSTATUS_MARKED){

			var marks = 0;
			switch (role){
				
				case 'participant':
				case 'coordinator':
					marks = getMarksByID(assessment, 'part_asst_marks', part_id)
					break;
					
				case 'assessor':
					var assr_id = g_user_id;
					marks = getMarksByID(assessment, 'assr_asst_marks', assr_id+','+part_id);
					break;
			}
			jdiv.find('.asspage_marks').html(marks + ' marks');
		}
	}
		
	/////////////////////////////////////////////////////////////////////////////////////////
	// 2. ASSESSMENT ITEMS
	/////////////////////////////////////////////////////////////////////////////////////////
	var	method = assessment.method;
	
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
			role != 'previewing'
				&& method != 'pst' ? 1 : 0
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
				&& method != 'sur'
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
				&& method != 'sur'
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
	var
		jtbl = jdiv.find('.tbl_asspage_assessment'),
		tbody = jtbl.find('>tbody').empty()
	;
	// write down the method
	jtbl.attr('method', method);
	
	// show the header
	jdiv.find('.asspage_header1,.asspage_marks').show();
	jdiv.find('.asspage_header2').hide();
	var jprt = jdiv.find('.div_asspage_prt');

	if (method == 'prt'){
		jtbl.hide();
		jprt.show();
	} else {
		jtbl.show();
		jprt.hide();
	}
	switch (method){
		
		case 'prt':
			// for prt it is very different
			viewActAsst_prt(opts, jprt, assessment, uass, role);
			break;
		
		case 'pst':
			// for pst it is also very different
			jdiv.find('.asspage_header1,.asspage_marks').hide();
			jdiv.find('.asspage_header2').show();			
			media_id_arr = viewActAsst_pst(opts, jprt, assessment, uass, role, tbody, stage, status, part_id, jdiv);
			break;
			
		default:
			var act_items = assessment.items;
			if (!act_items || !act_items.length){

				console.error('error no items in this assessment '+ ass_id);

			//} else if (!uass){

			//	console.error('no uass found act_id=' + act_id, 'ass_id=' + ass_id);

			} else {		

				var total_marks = 0;
				for (var i = 0; i < assessment.items.length; i++){
					var item_id = i + 1;
					total_marks += viewItem(opts, assessment, uass, stage, status, tbody, role, item_id, part_id);
				}
				if (method == 'mcq' || role == 'assessor'){
					g_assr_asst_marks = 
					total_marks = Math.ceil(total_marks);
					$('.asspage_marks').text(total_marks + ' marks');
				}
			}
			break;
	}
	
	////////////////////////////////////////////////////////////////
	// POST INITIALIZATION
	////////////////////////////////////////////////////////////////
	//tbody.find('.answer_gallery').each(function(){
	//	console.debug($(this));
	//});

	tbody.find('.slider').on('slide slidechange', function(ev, ui){
		var jtbl = $(this).closest('.tbl_asspage_marking');
		var jspan = jtbl.find('.span_marks');
		jspan.html(ui.value + ' marks');
		calcFinalMarks();
	});
	// add increase by 1%
	tbody.find('.but_left').click(function(){
		var jslider = $(this).closest('tr').find('.ui-slider');
		var value = jslider.slider('value');
		value--; if (value < 0) value = 0;
		jslider.slider('value', value);
		jslider.find('div').html(value);
	});		

	// add decrease by 1%
	tbody.find('.but_right').click(function(){
		var jslider = $(this).closest('tr').find('.ui-slider');
		var value = jslider.slider('value');
		value++; if (value > 100) value = 100;
		jslider.slider('value', value);
		jslider.find('div').html(value);
	});
	
	// add expand marks breakdown and each assessors' comments
	var expand = $('.asspage_marks_expand');
	if (expand.length){
		expand.unbind().click(function(e){
			var
				jobj2 = $(this),
				jdiv = jobj2.closest('tbody').find('>tr:nth-child(2)').find('.div_asspage_marking'),
				jtr = jdiv.parent().parent()
			;
			//console.info('click', jtr.css('display'));
			if (jdiv.css('display') == 'none'){
				jobj2.find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
				jtr.show();
				jdiv.hide().slideDown();
			} else {
				jobj2.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
				jdiv.slideUp("", function(){
					jtr.hide();
				});
			}
			e.stopPropagation();
		});
	}	
	
	// SHOW MARKS OR NOT
	if (opts.bViewMarking || opts.bEditMarking){
		jdiv.find('.tbl_asspage_marks').show();
	} else {
		jdiv.find('.tbl_asspage_marks').hide();
	}
	
	/////////////////////////////////////////////////////////////////////////////////////////
	// 3. SKILLS
	/////////////////////////////////////////////////////////////////////////////////////////
	var skills = assessment.skills;
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
	
	// set autogrow
	//jdiv.find('.asspage_open_answer').autoGrow();
	
	//////////////////////////////////////////////////////////////////
	// 4. PANELISTS AND ASSESSORS
	//////////////////////////////////////////////////////////////////
	//return;
	var panelists = assessment.panelists;
	var jtbl = jdiv.find('.my_datatable[dt_type=users]');
	if (!my_assessors.length){
		$('.ass_primaryassessors').hide();
		jtbl.hide();
	} else {
		$('.ass_primaryassessors').show();
		updateActPagePanelists(jtbl, my_assessors, panelists_user);
	}

	// PEER ASSESSMENT
	var bEditable = role == 'participant' && stage == TIMESTAGE_OPENING && (g_multi_perform || !uass.performed) && !uass.marked;
	var index = ass_id - 1;
	setPeerAssessment2(jdiv.find('.div_peer_assessment'), ass_panelists, user_panelists, bEditable, act_id, ass_id);
	//return;
	
	// SLIDERS FOR ASSESSOR MARKING
	var jsliders = jdiv.find( ".slider" );
	jsliders.each(function(){
		var jslider = $(this);
		jslider.slider({
			create: function() {
				var handle = $(this).find('.custom-handle');
				handle.text( $( this ).slider( "value" ) );
			},
			slide: function( event, ui ) {
				var marks = ui.value;
				var handle = $(this).find('.custom-handle');
				handle.text( marks );
				$(this).attr('marks', marks);
				calcFinalMarks();
			}
		})
		var marks = jslider.attr('marks');
		jslider.find('.custom-handle').text(marks);
		jslider.slider('value', marks);	
		if (jslider.hasClass('slider_disabled')){
			jslider.slider( "option", "disabled", true);
		}				
	});
	
	///////////////////////////////////////////
	// FOR MEDIA UPLOAD
	///////////////////////////////////////////
/*
	// INITUPLOADER
	if (method == 'pst'){
		var juploader = jdiv.find('.uploader');
		var jgallery = jdiv.find('.uploader_gallery');
		var bEditable = opts.bEditAnswer;
		var data_type = method == 'pst' ? 'poster2' : 'item_media';
		//var data_type = 'poster';
		var jbutton = initUploader(juploader, jgallery, data_type, {
				act_id: act_id, ass_id: ass_id, user_id: g_user_id
			},
			function (media_arr, media_id_arr){
				console.info('onUpdate', media_id_arr);
				//g_saved_activity.media = media_id_arr;
			},
			'.tbl_ass_item',
			bEditable
		);
	}
*/	
/*
	var juploader = jdiv.find('.uploader');
	var jgallery = jdiv.find('.uploader_gallery');
	var bEditable = opts.bEditAnswer ? 1 : 0;	// role == 'participant' && stage == TIMESTAGE_OPENING && (g_multi_perform || !uass.performed)
	juploader.parent().find('.uploader_label').css('visibility', bEditable?'visible':'hidden');

	var data_type = method == 'pst' ? 'poster2' : 'item_media';

	if (!juploader.hasClass('uploader_init'))
	{
		initUploader(juploader, jgallery, data_type, {
				act_id: act_id, ass_id: ass_id, user_id: g_user_id
			},
			function (media_arr, media_id_arr){
				console.info('onUpdate', media_id_arr);
				onGotMedia(juploader, media_id_arr, bEditable);
			},
			'.tbl_ass_item',
			bEditable
		);
	} else {
		juploader.uploader('setEditable', bEditable);
		onGotMedia(juploader, media_id_arr, bEditable);
	}
*/

	//////////////////////////////////////////////////////////////////
	// 5. BUTTONS
	//////////////////////////////////////////////////////////////////
	var btns = '.btn_back', full_btns = '.btn_back,.btn_cancel,.btn_close,.btn_save,.btn_clear,.btn_submit';
	
	switch (role){
		
		case 'participant':
			if (!g_multi_perform && uass.performed != ''){
				// view only
				btns = '.btn_back';
			} else if (method == 'prt'){
				//btns = '.btn_back';
			} else if (method == 'pst'){
				btns = '.btn_back,.btn_save,.btn_submit';
			} else if (opts.bEditAnswer){
				btns = '.btn_back,.btn_clear,.btn_save,.btn_submit';
			}
			break;

		case 'assessor':
			if (!g_multi_marking && uass.marked != ''){
				// view only
				btns = '.btn_back';
			} else if (method == 'prt'){
				btns = '.btn_back,.btn_submit';
			} else if (opts.bEditMarking){
				btns = '.btn_back,.btn_clear,.btn_submit'; // consider .btn_save
			}
			break;
			
		case 'coordinator':
			if (act_id != 0){
				btns = '.btn_back,.btn_delete';
			} else if (method == 'prt'){
				//btns = '.btn_back';
			}
			break;
	}
	jdiv.find(full_btns).hide();
	jdiv.find(btns).show();
		
	// EXPAND/COLLAPSE ASSESSORS
	var jbut_expand = $('[name=anchor_assview_assessors] .but_expand');
	var jdiv_expand = $('#div_asspage_assessors');
	setExpandable(jbut_expand, jdiv_expand);		
		
	// SAVE FOR CHECKLOSEINPUT
	g_saved_assessment_view = getAssessmentInput(role);
}

///////////////////////////////////////////////////////////////////////////////////


function onGotMedia(juploader, media_id_arr, bEditable){
	// UPDATE THE MEDIA
	if (media_id_arr && media_id_arr.length){

		// CALL GETMEDIA
		
		call_svrop(
			{
				type: 'get_media',
				media_id_arr: media_id_arr,
			},
			function (obj){
				//console.info('succeeded', obj);
				var media_arr = obj.media_arr;
				if (media_arr){
					var jdiv = $('#div_assessment_view');
					
					
					if (bEditable){
						
						// loadGallery
						juploader.uploader('loadGallery', media_arr);//, jgallery);
						
					} else {
						var jdivs =  jdiv.find('.div_uploader_media');
						// create marking table instead
						for (var i = 0; i < media_arr.length; i++){
							var
								media = media_arr[i],
								url =  './media/' + media.file_name,
								media_desc = media.media_desc,
								jdiv2 = jdivs.eq(i);
							;
							juploader.uploader('createElement', jdiv2, media.file_cat, media.file_id, 0, media.file_name, url, 0, media_desc);
						}
					}
					
				}
			},
			function (obj){
				console.error('failed', obj);
			}
		);	
	}	

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
/*			
			for (var j = 0; j < assessments.length; j++){
				var assessment = assessments[j];
				if (assessment.ass_id == ass_id){
					uass = assessment;
					break;
				}
			}
*/
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


///////////////////////////////////////////////////////////////

function markAssessment(user_id, obj, action){
	if (!g_saved_activity){
		console.error('no g_saved_activity');
	} else if (!g_curr_inline_jtr){
		console.error('no g_curr_inline_jtr');
	} else {
		var
			act_id = g_saved_activity.act_id,
			ass_id = parseInt(g_curr_inline_jtr.attr('ass_id')),
			jobj = $(obj),
			jtr = jobj.closest('tr'),
			jtbl = jobj.closest('table'),
			dt = jtbl.DataTable()
			row = dt.row( jtr ),
			cols = row.data(),
			user_html = cols[2]
		;
		console.info('markAssessment', 'act_id='+act_id, 'ass_id='+ass_id, 'user_id='+user_id);
		viewAssessment(ass_id, action, user_id, user_html);
	}
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

////////////////////////////////////////////////////////////////////////////////

function updateActPagePanelists(jtbl, panelists, panelists_user){

	//if (!panelists.length){
	//	jtbl.hide();
	//	jtbl.closest('div').find('.subsection_header').hide();
	//	return;

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
				{	targets: '_all',	className: 'dt-left'},
/*			
				{	targets: [ 0 ],	orderable: false,	visible: false, },
				{	targets: [ 1 ],	orderable: false},
				{	targets: [ 2 ],	orderable: false},				
				{	targets: [ 5 ],	orderable: false, className: 'dt-center'},				
*/				
			],
		});
	}
	//jtbl.hide();
	jtbl.prev().prev().show();	
	var dt = jtbl.show().DataTable().clear().draw();
	for (var i = 0; i < panelists.length; i++){
		var	user_id = panelists[i];
		var user = 	getUserByID(panelists_user, user_id);
		var
			//username = user.username ? user.username : '',
			//img_id = user.img_id ? user.img_id : 0,
			imgusername = getImgUserName(user_id, g_curr_assessment_assessors),
			status = user.status ? user.status : '',
			arr = [
				//user_id,
				//i + 1,
				imgusername,
				//user.email ? user.email : '',
				//getUserPosition(user),
				//status
			]
		;
		dt.row.add(arr);
	}
	dt.draw();
	//if (g_platform != 'ios' && g_platform != 'android'){
	//jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	//}
};

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

///////////////////////////////////////////////////////////////////////////////////////////////////

function getAssessmentName(assessment){
	var method = method_arr[assessment.method] ? method_arr[assessment.method] : '';
	var weight = assessment.weight;
	return '<!--' + assessment.ass_id + '-->' + assessment.title + ' (' + method + ', ' + weight + '%)'; //', ' + assessment.weight +  '%)';
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
		ass_marks += (marks * (weight / 100.0)); 
	});
	//console.info(ass_marks, typeof(ass_marks), !isNaN(ass_marks));
	ass_marks = Math.ceil(ass_marks);
	return ass_marks;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function clearViewActAsst(){
	console.info('clearViewActAsst');
	if (!checkLoseInput('cancel all the input', function(){	
		clearViewActAsst2();
	})){
		clearViewActAsst2();
	}
	//console.info(items);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function clearViewActAsst2(){
	console.info('clearViewActAsst2');
	var jdiv = g_bodyview;
	switch (g_curr_role){
		
		case 'assessor':
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

//////////////////////////////////////////////////////////////////////////////////////////

function getAssessmentInput(){
	// output
	var input = {};
	var jdiv = $('#div_assessment_view');
	
	switch (g_curr_role){
		
		case 'participant':
			switch (g_curr_method){
				
				case 'sur':
					// selects only
					var item_id = 1;
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
						input[item_id++] = {
							answer: answer,
						}
					});
					break;

				case 'mcq':
					var item_id = 1;
					jdiv.find('.tbl_mcq_answer').each(function(){
						var jobj = $(this);
						var answer = jobj.find('input:checked').val();
						input[item_id++] = {
							answer: answer,
						}
					});
					break;
					
				case 'pst':
					var juploader = jdiv.find('.uploader_init');
					if (juploader.length){
						var media_id_arr = juploader.uploader('getMediaIDArr');
						var media_desc_hash = juploader.uploader('getMediaDescHash');	
						var item_id = 1;
						for (var i in media_id_arr){
							var media_id = media_id_arr[i];
							var media_desc = media_desc_hash[media_id];
							input[item_id++] = {
								media_id: media_id,
								media_desc: media_desc,
							}
						}
					}
					break;

				default:
					jdiv.find('.tbl_ass_item').each(function(){

						var item_id = $(this).attr('item_id');

						var media_id_arr = [], media_desc_hash = {};
						var juploader = $(this).find('.uploader_init');
						if (juploader.length > 0){	// otherwise media_id_arr will be a messy nested object !
							media_id_arr = juploader.uploader('getMediaIDArr');	
							media_desc_hash = juploader.uploader('getMediaDescHash');	
						}
						input[item_id] = {
							answer: 			$(this).find('.asspage_open_answer').html(),
							media_id_arr: 		media_id_arr,
							media_desc_hash:	media_desc_hash,
						}
					
					});
					break;

			}
			break;
		
		case 'assessor':
			var item_id = 1;
			switch (g_curr_method){
				
				case 'prt':			
					jdiv.find('.tbl_asspage_prt tbody tr').each(function(){
						var tds = $(this).find('td');
						var td = $(this).find('td[data-selected=1]');
						var index = tds.index(td);
						//console.info(index);
						input[item_id++] = index;
					});
					break;
					
				case 'mcq':
					g_assr_asst_marks = 0;
					jdiv.find('.tbl_ass_item').each(function(){
						var jobj = $(this),
							assr_item_marks = parseInt(jobj.find('.assr_item_marks').text());
							comments = jobj.find('.asspage_open_comments').html()
						;
						g_assr_asst_marks += assr_item_marks;
						input[item_id++] = {
							user_id: g_user_id,
							img_id: g_user.img_id,
							username: g_user.username,
							assr_item_marks: assr_item_marks,
							comments: comments,
							date : getDateTimeString(),	// to be replaced in the server side
						};
					});
					break;
					
				default:
					jdiv.find('.tbl_asspage_marking').each(function(){
						var jtbl = $(this),
							item_id = $(this).attr('data-item-id'),
							assr_item_marks = parseInt(jtbl.find('.ui-slider').attr('marks')),
							comments = jtbl.find('.asspage_open_comments').html()
						;
						input[item_id] = {
							user_id: g_user_id,
							img_id: g_user.img_id,
							username: g_user.username,
							assr_item_marks: assr_item_marks,
							comments: comments,
							date : getDateTimeString(),	// to be replaced in the server side
						};
					});
					break;
			}
			break;
			
	}
	//console.info('getAssessmentInput', input);
	return input;
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
	if (bRedIfNull && marks == '-'){
		marks = '<span style="color:red">' + marks + '</span>';
	}
	return marks;
}

/////////////////////////////////////////////////////////////
// alantypoon 20170705
// show status for the assessment
/////////////////////////////////////////////////////////////
/*
function getMarksByID_asst(asst, name, key, bRedIfNull){
	var marks = '-';
	var obj2 = asst[name];
	if (!key){
		if (typeof(obj2) != 'undefined'){
			marks = obj2;
		}
	} else if (obj2 && typeof(obj2[key]) != 'undefined'){
		marks = obj2[key];
	}
	if (bRedIfNull && marks == '-'){
		marks = '<span style="color:red">' + marks + '</span>';
	}
	return marks;
}
*/
///////////////////////////////////////////////////////////////

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
		jdiv = $('#div_assessment_view'),
		act_id = g_saved_activity.act_id,
		input = getAssessmentInput(),
		user_id = 0,
		assr_id = 0
	;
	console.info('saveAssessment', 'submit='+bSubmit, input);
	
	switch (g_curr_role){
		
		case 'participant':
			user_id = g_user_id;
			break;
			
		case 'assessor':
			user_id = g_curr_part_id;
			assr_id = g_user_id;
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
		assr_asst_marks: g_assr_asst_marks,
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
			switch (g_curr_role){
				
				case 'participant':
					////////////////////////////////////////////////////
					// write to the user
					////////////////////////////////////////////////////
					var uass = getUserAssessment(g_user, act_id, g_curr_ass_id);
					if (uass){
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
					/////////////////////////////////////////////////////////////////////////////
					// update activity in memory
					/////////////////////////////////////////////////////////////////////////////
					var	assessment = getAssessmentByAssID(activity, g_curr_ass_id),
						method = assessment.method
					;
					// set assr_asst_marks as submitted
					var assrs = getAssessorsFromPanelists(activity, assessment.panelists)
					for (var assr_id in assrs){
						setMarksByID(assessment, 'assr_asst_marks', assr_id+','+part_id, 'performed');
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
					setMarksByID(assessment, 'assr_asst_marks', assr_id+','+part_id, obj.assr_asst_marks);
					
					// 2. part_asst_marks
					setMarksByID(assessment, 'part_asst_marks', part_id, obj.part_asst_marks);
					
					// 3. assr_asst_completed
					setCompletedByID(assessment, 'assr_asst_completed', assr_id, obj.assr_asst_completed);
					
					//changeBodyView(-1);	return;
					/////////////////////////////////////////////////////////////////////////////
					// update user profile in memory (if it is my user_id)
					/////////////////////////////////////////////////////////////////////////////
					if (part_id == g_user_id){
						
						var uass = getUserAssessment(g_user, act_id, g_curr_ass_id);
						if (uass){

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
									index = item_id - 1,
									part_item = uass.items[index]
								;
								if (method == 'prt'){

									//assessor.selected = input_item;
									//assessor.date = g_server_time;
									part_item.assessors[g_user_id] = {
										selected: input_item,
										date: g_server_time,
									}									

								} else {

									var assessors = part_item.assessors;
									assessor = getUserByID(assessors, g_user_id);
									assessor.assr_item_marks	= input_item.assr_item_marks;
									assessor.comments			= input_item.comments;
									assessor.date 				= input_item.date;

									// 2. update part_item_marks
									if (method == 'mcq'){
										
										part_item.part_item_marks = assessor.assr_item_marks;

									} else {
										
										var total_marks = 0, total_markers = 0;
										for (var assr_id in assessors){
											var assessor = assessors[assr_id];
											total_marks += parseInt(assessor.assr_item_marks+'');
											total_markers++;
										}										
										if (total_markers > 0){
											part_item.part_item_marks = parseInt(total_marks / total_markers);
										}
									}
								}
							}
						}
					}
					/////////////////////////////////////////////////////////////////////////////
					// update asst in memory
					/////////////////////////////////////////////////////////////////////////////
					// 1. assr_asst_marks
					if (g_curr_participant_jtr){
						g_curr_participant_jtr.find('td:nth-child(2)').text(obj.assr_asst_marks);	// g_assr_asst_marks
					}
					// 2. assr_asst_completed
					var completed = obj.assr_asst_completed;
					if (g_curr_inline_jtr){
						var jtr = g_curr_inline_jtr.prev();
						jtr.find('td:nth-child(3)').html(getCompleted(completed));
					}					
					// 3. refresh participant's view if exist
					var uact = getUact(act_id);
					if (uact.uact_participant == 1 && method != 'pst'){
						// but it above would ruin the pst
						//var jtr = $('#tr_actpage_assessment_participant');
						//viewActAsst_part1(jtr.find('.my_datatable'), activity.assessment.assessments, uact);

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
			
			notifyDialog('The assessment is ' + (!bSubmit?'saved':'submitted') + '.');
						
			// after submission
			if (bSubmit){
								
				if (g_curr_role == 'participant'){
					// 1. reload this
					setTimeout(function(){
						viewAssessment(g_curr_ass_id, g_curr_role, g_user_id, g_user.username);
					}, 1000);
				} else {
					// 2. return to the list
					changeBodyView(-1);
				}

			}
			
		},
		function (obj){
			//console.error('saveactivity failed', obj);
		}
	);	
}

////////////////////////////////////////////////////////

function calcFinalMarks(){
	var jsliders = $('.tbl_asspage_assessment .slider');
	g_assr_asst_marks = getAssessmentMarks(jsliders);
	
	$('#div_assessment_view .asspage_marks').html(g_assr_asst_marks  + ' marks');
}

////////////////////////////////////////////////////////

function closeViewAssessment(){
	console.debug('closeViewAssessment');
	
	// just for the participation case
	// useless: the output will only show after saving
/*	
	switch (g_curr_method){

		case 'prt':
			var input = getAssessmentInput();
			var uass = getUserAssessment(g_curr_user, g_saved_activity.act_id, g_curr_ass_id);
			if (uass){

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
						index = item_id - 1,
						part_item = uass.items[index]
					;
					part_item.assessors[g_user_id] = {
						selected: input_item,
						date: g_server_time,
					}
				}
			}		
			break;
	}
*/
	changeBodyView(-1);
}

////////////////////////////////////////////////////////

function validateBeforeSubmit(){
	var err = 0, jobj = 0;
	var jdiv = $('#div_assessment_view');
	
	// CHECK OPEN ANSWERS
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
	var npeerassr = parseInt(jtbl.find('.span_peers').text());
	if (npeerassr > 0){
		var npart = parseInt(jtbl.find('.span_participants').text());
		var assessors = getUsers(jtbl);
		var nselected = assessors.length;
		if (nselected != npeerassr){
			err = "Select your peer assessors";
			var jobj2 = jtbl.find('.btn_select');
			 showInvalidInput(jobj2, err);
			if (!jobj) jobj = jobj2; // get the first error to scroll
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
	return hash2numArr(assrs_hash);
}