///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Assessor's Table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////


function viewActAsst_assr1(jtbl, activity, ass_peer_assessees){
	console.info('viewActAsst_assr1', jtbl, activity, ass_peer_assessees);

	if (!jtbl.hasClass('dataTable')){
		jtbl.DataTable({
			order: [[ 0, 'asc' ]],			
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language: {
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				{	targets: '_all',	orderable: false},
				{	targets: [ 0 ],	orderable: false, type: 'string'},
			],
		});
	}
	var assr_id = g_user_id;
	var dt = jtbl.show().DataTable().clear().draw();

	// loop all the assessments
	var assessments = activity.assessment.assessments;
	for (var i in assessments){
		var assessment = assessments[i];	
			ass_id = assessment.ass_id,
			ass_name = getAssessmentName(assessment),
			completed = getCompletedByID(assessment, 'assr_asst_completed', assr_id),
			peer_assessors = ass_peer_assessees[ass_id];
			
		var amiassessor = amIAssessor(assessment, activity, ass_peer_assessees);
		if (amiassessor){
			dt.row.add([
				ass_name,
				g_but_plus,
			]);
		}
	}
	dt.draw();
	jtbl.parent().find('.subsection_header').show();
}



///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActAsst_assr2(ass_id, obj, ass_peer_assessees){
	console.debug('viewActAsst_assr2', ass_id);
	var jtr = 0;	
	if (obj){
		jtr = $(obj).parent(); //parent().
	} else if (g_curr_inline_jtr){
		jtr = g_curr_inline_jtr.prev();
		removeParticipantList();
	}			
	if (!jtr){
		console.error('no row selected');
		return;
	}
	if (g_curr_inline_jtr){
		resumeIconPlus();
		var
			 ass_id2 = g_curr_inline_jtr.attr('ass_id'),
			 dt_type = g_curr_inline_jtr.closest('table').attr('dt_type')
		;
		if (ass_id2 == ass_id && dt_type == 'assessment_assr1'){
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}
	
	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var activity = g_saved_activity,
		act_id = activity.act_id,
		//participants = activity.participants,
		assessment = getAssessmentByAssID(activity, ass_id),
		method = assessment.method
	;

	var amiassessor = amIAssessor(assessment, activity, ass_peer_assessees);
	if (amiassessor){
		
		//console.info(jtr);
		var s = '<table class="my_datatable display nowrap" dt_type="assessment_assr2" style="padding-left:20px; width:100%">'
						+ '<thead>'
							+ '<tr>'
								+ '<td>User ID</td>'
								+ '<td>Participants</td>'
		;
		switch (method){
			
			case 'sur': case 'prt':
				break;

			default:
				s += '<td>Marks</td>';
				break;
		}		
		s += '<td></td>'
							+ '</tr>'
						+ '</thead>'
					+ '</table>'
		;
		jtr.after('<tr ass_id="' + ass_id + '"><td colspan="7" class="td_inline_tbl"><div style="display:none">' + s + '</div></td></tr>');
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
				//{	targets: [ 1 ]},
				//{	targets: [ 2 ],	className: 'dt-center'},
				{	targets: '_all',	orderable: false},
			],
		});
		var assr_id = g_user_id;
		var dt = jtbl.show().DataTable().clear().draw();

		var aminormalassessor = amIAssessor(assessment, activity, 0);

		var assessees = aminormalassessor ? activity.participants : ass_peer_assessees[ass_id];

		for (var i = 0; i < assessees.length; i++){
			var part_id = assessees[i],
				imgusername = getImgUserName(part_id, g_curr_participants),
				marks = getMarksByID(assessment, 'assr_asst_marks', assr_id + ',' + part_id, 1)
			;
			var arr = [];
			switch (method){
				case 'sur': case 'prt':
					arr = [
						part_id,
						imgusername,
						g_but_right,
					];
					break;
					
				default:
					arr = [
						part_id,
						imgusername,
						marks,
						g_but_right,
					];
					break;
			}			
			dt.row.add(arr);		
		}
		dt.draw();

		jtbl.find('td').click(function(e){
			viewActAsst_assr3($(this));
		});
		
 		// render bootstrap tooltip
		//if (g_platform != 'ios' && g_platform != 'android'){
		//	jtbl.find('[data-toggle="tooltip"]').tooltip();
		//}

		// SHOW THE TBL
		var jdiv = jtbl.parent();
		jdiv.slideDown();

		// ADD BUTTONS PANEL
		jtr2.after('<tr class="tr_buttons_panel"><td colspan="7"><div class="buttons_panel">'
			+ '<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button> '
			+ '<div></td></tr>');
			
		jtr2.next().find('.btn_close').click(function(){
			console.info('close participants');
			resumeIconPlus();	// resume the icon +
			slideUpParticipantList();
		});
		
		// REMEMBER THE ROW
		g_curr_inline_jtr = jtr2;
	}

}

//////////////////////////////////////////////////////////////////
var g_curr_participant_jtr = 0;

function viewActAsst_assr3(jobj){
	var 
		assessment = getAssessmentByAssID(g_saved_activity, ass_id),
		jtr = jobj.closest('tr'),
		jtbl = $(jtr.closest('table')),
		jtr2 = jtbl.closest('tr'),
		ass_id = parseInt(jtr2.attr('ass_id')),
		dt = jtbl.DataTable(),
		row = dt.row(jtr),
		cols = row.data(),
		part_id = parseInt(cols[0]),
		participant_name = $('<div>' + cols[1] + '</div>').text()
	;
	g_curr_part_id = part_id;
	g_curr_participant_jtr = jtr;
	viewAssessment(ass_id, 'assessor', part_id, participant_name);
}


