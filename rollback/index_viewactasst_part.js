///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Participants' Table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActAsst_part1(jtbl, assessments, uact){

	//console.info('viewActAsst_part1', assessments, uact);
	
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
	// viewAssessment(ass_id, 'review', part_id, participant_name);
	var dt = jtbl.show().DataTable().clear().draw();
	for (var index in assessments){
		var
			assessment = assessments[index],
			method = assessment.method,
			ass_id = assessment.ass_id,
			name = getAssessmentName(assessment),
			//marks = getMarksByID(assessment, 'part_asst_marks', g_user_id),
			//button = '<button type="button" class="btn btn-sm btn-ass-view" onclick=\'viewAssessment(' + ass_id + ', "participant", g_user_id, g_user.username)\' data-toggle="tooltip" title="View">'
			//	+ '<i class="glyphicon glyphicon-search"></i>'
			// + '</button>',
			marks = '-'
		;
		switch (method){
			case 'sur': case 'prt':	break;
			default:
				marks = getMarksByID(assessment, 'part_asst_marks', g_user_id);
				break;
		}
		
		dt.row.add([
			//ass_id,
			name,
			marks,
			g_but_right, //button
		]);
	}
	dt.draw();
	
}
