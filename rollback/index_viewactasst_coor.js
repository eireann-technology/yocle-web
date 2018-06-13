
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coordinator's Table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActAsst_coor1(jtbl, assessments){

	console.info('viewActAsst_coor1');//, jtbl, assessments);
	
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
				//{	targets: [ 1 ],	orderable: false},
				//{ targets: [ 2 ],	orderable: false, className: 'dt-center'},
				//{ targets: [ 3 ],	orderable: false, className: 'dt-center'},
				//{ targets: -1, visible: false},
			],			
		});
	}

	var dt = jtbl.show().DataTable();
	
	dt.clear().draw();
	for (var index in assessments){
		var
			assessment = assessments[index],
			ass_id = assessment.ass_id,
			ass_name = getAssessmentName(assessment)
			//completed = (assessment.coordinator_completed ? assessment.coordinator_completed : 0) + '%'
		;
		var arr = [
			ass_name,
			g_but_plus,
		];
		dt.row.add(arr);
	}
	dt.draw();
	if (g_platform != 'ios' && g_platform != 'android'){
		jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	}
}

////////////////////////////////////////////////////////////////////

function viewActAsst_coor2(ass_id, obj){

	console.info('viewActAsst_coor2', ass_id);
	
	// HIDE THE HIGHTLIGHT ROW
	if (g_curr_inline_jtr){
		resumeIconPlus();
		var
			 ass_id2 = g_curr_inline_jtr.attr('ass_id'),
			 dt_type = g_curr_inline_jtr.closest('table').attr('dt_type')
		;
		if (ass_id2 == ass_id && dt_type == 'assessment_coor1'){
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}		
	
	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var
		activity = g_saved_activity,
		act_id = activity.act_id,
		participants = activity.participants,
		assessment = getAssessmentByAssID(activity, ass_id),
		method = assessment.method
	;
	if (participants)
	{
		var jtr = $(obj).closest('tr');
		if (jtr.hasClass('child')){
			jtr = jtr.prev();
		}		
		var s = '<table class="my_datatable display" dt_type="assessment_coor2" style="width:100%">'
						+ '<thead>'
							+ '<tr>'
								+ '<td>User ID</td>'
								+ '<td>Particpants</td>';
								
		switch (method){
			case 'sur': case 'prt':
				break;
			default:
				s += '<td>Marks</td>';
				break;
		};
		
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
				{	targets: '_all',	orderable: false},
			],
		});
		var dt = jtbl.show().DataTable().clear().draw();
		for (var i = 0; i < participants.length; i++){
			var	part_id = participants[i];
			;
			//var date = participant.date ? getDateWithoutTime(assessment_participant.date) : '',
			var	imgusername = getImgUserName(part_id, g_curr_participants),
				marks = getMarksByID(assessment, 'part_asst_marks', part_id, 1)
				//button = '<button type="button" class="btn btn-sm btn-ass-view" onclick=\'viewActAsst_coor3($(this))\' data-toggle="tooltip" title="View">'
				//		+ '<i class="glyphicon glyphicon-eye-open"></i>'
				//	+ '</button>'
			;
			
			//console.info(assessors);
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
			
			//console.info(arr);
			dt.row.add(arr);
		}
		dt.draw();
		
		jtbl.find('td').click(function(e){
			viewActAsst_coor3($(this));
		});

		// UPDATE PHOTO
		jtbl.find('.person_photo').each(function(){
			var img_id = $(this).attr('img_id');
			if (img_id){
				updateImgPhoto($(this), img_id, 'user');
			}
		});			

		// SHOW THE TBL
		var jdiv = jtbl.parent();
		jdiv.slideDown();

		// REMEMBER THE ROW
		g_curr_inline_jtr = jtr2;

		// ADD BUTTONS PANEL
		jtr2.after(
			'<tr class="tr_buttons_panel">'
				+ '<td colspan="7">'
					+ '<div class="buttons_panel">'
						+ '<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button> '
					+ '<div></td></tr>'
		);

		// HIDE THE TABLE
		var jtr3 = jtr2.next();
		jtr3.find('.btn_close').click(function(){
			console.info('close participants');
			resumeIconPlus();	// resume the icon +
			slideUpParticipantList();
		});

	}
}

//////////////////////////////////////////////////////////////////

function viewActAsst_coor3(jobj){
	var 
		jtr = jobj.closest('tr'),
		jtbl = $(jtr.closest('table')),
		jtr2 = jtbl.closest('tr'),
		ass_id = parseInt(jtr2.attr('ass_id')),
		//assessment = getAssessmentByAssID(g_saved_activity, ass_id),
		dt = jtbl.DataTable(),
		row = dt.row(jtr),
		cols = row.data(),
		part_id = parseInt(cols[0]),
		participant_name = $('<div>' + cols[1] + '</div>').text()
	;
	console.info('viewActAsst_coor3', ass_id);
	
	viewAssessment(ass_id, 'coordinator', part_id, participant_name);		
}
