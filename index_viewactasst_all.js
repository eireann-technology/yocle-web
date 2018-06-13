///////////////////////////////////////////////////////////////////////////////////////////////////////////
var
	g_saved_assessment_view = 0,
	g_ass_asst_marks = 0,
	g_asst_assrs = 0,
	g_ass_part = 0,
	g_ass_assr = 0,
	g_ass_coor = 0
;

function viewActAsst_all(){
	console.log('viewActAsst_all');
	var
		activity = g_saved_activity,
		uact = g_saved_uact
	;
	if (!activity.assessment || activity.assessment.enabled == '0'){
		$('#tr_actpage_assessment').hide();

	} else {

		$('#tr_actpage_assessment').show();

		g_ass_coor = uact.uact_coordinator;
		g_ass_assr = g_peerassessees_ass_iamassr;
		g_ass_part = uact.uact_participant;
		var
			act_id = activity.act_id,
			assts = activity.assessment.assessments,
			participants = activity.participants
		;
		// check for weightings
		var arr = [], total = 0;
		for (var i = 0; i < assts.length; i++){
			var
				asst = assts[i],
				weight = asst.weight
			;
			// check primary assessor (for tab showing
			//if (amIPrimaryAssr(activity.coordinator_id, asst.panelists)){
			//	g_ass_assr = 1;
			//}
			var asst_assessors = getMyAssessors(asst.panelists, 0, g_user_id);
			if (in_array(g_user_id, asst_assessors)){
				g_ass_assr = 1;
			}
			// check for weight
			if (typeof(weight) != 'undefined' && !isNaN(weight)){
				arr.push(weight);
				total += parseInt(weight);
			}
		}
		// put evenly weights to the assessment (for display purpose only)
		if (arr.length != assts.length || total != 100){
			arr = getEvenWeightings(assts.length);
			for (var i = 0; i < assts.length; i++){
				assts[i].weight = arr[i];
			}
		}
	}
}

//////////////////////////////////////////////////////////////

function refreshAsstPart(){
	var
		activity = g_saved_activity,
		act_id = activity.act_id,
		uact = getUact(act_id)
	;
	// am i one of the participant?
	var jtr = $('#tr_actpage_assessment_participant');
	if (uact.uact_participant == 1){
		var jtbl = jtr.find('.my_datatable[dt_type=assessment_part1]');
		viewActAsst_part1(jtbl, activity.assessment.assessments, uact);
		refreshViewAsstTbl(jtbl);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////

function openAssessees_assessment(ass_id, obj){

	if (g_curr_inline_jtr){
		var ass_id2 = g_curr_inline_jtr.attr('ass_id');
		if (ass_id2 == ass_id){
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}

	var
		act_id = g_saved_activity.act_id,
		index = ass_id - 1
	;
	// DEBUGGING
	console.info('openAssessees_assessment', 'act_id='+act_id, 'ass_id='+ass_id, obj);

	// ADD ASSESSEES
	var uass = getUserAssessment(g_user, act_id, ass_id);
	var participants = uass.participants;
	if (!participants){
		console.error('no participants');
		return;
	}

	var jtr = $(obj).parent().parent();
	//console.info(jtr);
	var s = '<table class="my_datatable display nowrap" style="width:100%">'
					+ '<thead>'
						+ '<tr>'
							+ '<td>User ID</td>'
							+ '<td>Participant</td>'
							+ '<td>Performed</td>'
							+ '<td>Marked</td>'
							+ '<td>&nbsp;</td>'
						+ '</tr>'
					+ '</thead>'
				+ '</table>'
	;
	jtr.after('<tr act_id="' + act_id + '" ass_id="' + ass_id + '"><td colspan="10"></div><div class="div_assessors" style="display:none">' + s + '</div></td></tr>');
	var jtr2 = jtr.next();
	var jtbl = jtr2.find('.my_datatable');
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
			{	targets: [ 0 ],	orderable: false,	visible: false, },
			{	targets: [ 4 ],	orderable: false},
		],
	});
	var dt = jtbl.show().DataTable().clear().draw();
	for (var i = 0; i < participants.length; i++){
		var user = participants[i],
			user_id = user.user_id ? user.user_id : 0,
			imgusername = getImgUserName(user),
			button = !user.performed ? '' : user.marked ? g_but_review_assessee : g_but_mark_assessee,
			arr = [
				user_id,
				imgusername,
				user.performed,
				user.marked,
				button
		];
		//console.info(arr);
		dt
			.row
			.add(arr);
	}
	dt.draw();
	if (g_platform != 'ios' && g_platform != 'android'){
		jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	}

	// HIDE THE TBL
	var jdiv = jtbl.parent();
	jdiv.slideDown();

	// REMEMBER THE ROW
	g_curr_inline_jtr = jtr2;

}

//////////////////////////////////////////////////////////////////////////////////////////////////

function slideUpParticipantList(){
	//console.debug('slideUpParticipantList', g_curr_inline_jtr);
	if (g_curr_inline_jtr){
		var jtr = g_curr_inline_jtr.prev();
		// retract the list
		var jdiv = g_curr_inline_jtr.find('div').eq(0);
		jdiv.slideUp('', function(){
			removeParticipantList();
		});
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function removeParticipantList(){
	if (g_curr_inline_jtr){
		var jtr = g_curr_inline_jtr.next();
		if (jtr.hasClass('tr_buttons_panel')){
		 jtr.remove();
		}
		g_curr_inline_jtr.remove();
		g_curr_inline_jtr = 0;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

// http://stackoverflow.com/questions/2644299/jquery-removeclass-wildcard
 $.fn.removeClassStartingWith = function (filter) {
	$(this).removeClass(function (index, className) {
		return (className.match(new RegExp("\\S*" + filter + "\\S*", 'g')) || []).join(' ');
	});
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////

function setGlyphicon(jdiv, name){
	jdiv.removeClassStartingWith('glyphicon-');
	jdiv.addClass('glyphicon-' + name);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function resumeIconPlus(){
	if (g_curr_inline_jtr){
		var jdiv = g_curr_inline_jtr.prev().find('.div_but_special i');
		setGlyphicon(jdiv, 'plus');
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function checkExpanded(jobj){
	var sametable = g_curr_inline_jtr && g_curr_inline_jtr.closest('table').find(jobj).length > 0;
	var sameindex = g_curr_inline_jtr && jobj.closest('tr').next().index() == g_curr_inline_jtr.index();
	var out = sametable && sameindex ?1:0;
	console.debug('checkExpanded', sametable, sameindex, out);
	return out;
}

/////////////////////////////////////////////////////////////////////////////////////////
function refreshViewAsstTbl(jtbl){
	// click to view/mark
	//var jtds = $('#tr_actpage_assessment .my_datatable tr[role=row] td');
	var jtds = jtbl.find('tr[role=row] td');
	//console.log(jtds);

	jtds.unbind().click(function(e){

		var
			jtd = $(e.srcElement || e.target),
			jtbl = jtd.closest('.my_datatable'),
			dt_type = jtbl.attr('dt_type')
		;

		e.stopPropagation();	// stop from escalating
		e.preventDefault();


		var role = dt_type.split('_')[1]
			jtd1 = jtd.closest('tr[role=row]').find('>td:first-child'),
			jtd2 = jtd.closest('tr[role=row]').find('>td:last-child'),
			ass_id = parseInt(jtd1.html().split('-->')[0].split('<!--')[1]),
			index = $(this).index()
		;
		if (isNaN(ass_id)){
			ass_id = g_curr_ass_id;
		}
		console.log('onclick1', role, ass_id);
		switch (role){

			case 'part1':
				viewAsst_part1(ass_id, jtd2);
				break;

			case 'assr1':
				viewAsst_assr1(ass_id, jtd2);
				break;

			case 'coor1':
				if (index == 0){
					viewAsst_coor1(ass_id, jtd2);
				} else {
					viewAsst_coor2(ass_id, jtd2);
				}
				break;

			case 'assr2':
				viewAsst_assr2(jtd2);
				break;

			case 'coor2':
				viewAsst_coor3(jtd2);
				break;
		}
	});
}

//////////////////////////////////////////////////////////////////

function goBack_asst(new_index){
	var
		jdiv = $('.div_viewass_' + g_curr_role),
		jdiv2 = jdiv.closest(' .div_transdiv'),
		index = parseInt(jdiv2.attr('transdiv_index'))
	;
	if (typeof(new_index) == 'undefined' && !isNaN(index)){
		new_index = index - 1;
	}
	if (new_index < 0){
		new_index = 0;
	}
	if (!new_index){
		$('.viewact_title').html(getActTitle(g_saved_activity));
	}

	if (!new_index
	 || (g_curr_role == 'assessor' && new_index == 1)
	 || (g_curr_role == 'coordinator' && new_index == 1)
	){
		if (g_curr_ntab > 1){
			$('.tbl_ass_tabs').show();
		}
		$('#view_act_title_ass').show();
		$('.div_act_tabs').slideDown();
		g_role_tbl = '';
	}
	console.log('goBack_asst', g_curr_role, g_curr_roletab, new_index);

	setCurrPage(PAGE_VIEW_ACT);

	showActBtnPanel();

	transdiv(jdiv2, new_index);
	scrollNow(g_scrolltop_arr2[new_index+1]);
}

///////////////////////////////////////////////////////////////////////////////

function showActBtnPanel(){
	switch (g_curr_page){
		case PAGE_VIEW_ASS_LIST:
		case PAGE_VIEW_ACT:
		case PAGE_VIEW_ASS:
			showViewActBtnPanel();
			break;

		case PAGE_EDIT_ASS_LIST:
		case PAGE_EDIT_ACT:
		case PAGE_EDIT_ASS:
			showEditActBtnPanel();
			break;
	}
}
