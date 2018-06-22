///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Participants' Table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActAsst_part1(){
	console.log('viewActAsst_part1');
	var
		jtr = $('#tr_actpage_assessment_participant'),
		jtbl = jtr.find('[dt_type=assessment_part1]')
	;
	if (!g_ass_part){
		jtr.hide();
	} else {
		jtr.show();
		var
			activity = g_saved_activity,
			assessments = activity.assessment.assessments,
			uact = g_saved_uact
		;
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
		var dt = jtbl.show().DataTable().clear().draw();
		for (var index in assessments){
			var
				assessment = assessments[index],
				method = assessment.method,
				ass_id = assessment.ass_id,
				name = getAssTitle(assessment),
				marks = '-'
			;
			marks = getMarksByID(assessment, 'part_asst_marks', g_user_id);
			//marks = getDisplayMarks(marks);
			marks = getStarsStatus(marks);

			dt.row.add([
				name,
				marks,
				g_but_right, //button
			]);
		}
		dt.draw();

		refreshViewAsstTbl(jtbl);
		showDivStar(jtbl);
	}
}

////////////////////////////////////////////////////

function viewAsst_part1(ass_id, obj){

	refreshAsstTitle(ass_id);

	console.info('viewAssr_part1', ass_id);//, obj);
	var
		jbut = $(obj),
		jtr = jbut.closest('tr')
	;
	g_curr_part_id = g_user_id;
	g_jcurr_marks = jtr.find('>td:nth-child(2)');


	$('.div_act_tabs').slideUp(400, function(){
		$('#view_act_title_ass, .tbl_ass_tabs').hide();
		showActBtnPanel();
	});

	viewAssessment(ass_id, 'participant', g_user_id, g_user.username, function(){
		transdiv($('#div_viewass_part'), 1, function(){
			//$('.div_act_tabs, #view_act_title_ass, .tbl_ass_tabs').hide();
		});
	}, 'viewAsst_part1');
}

////////////////////////////////////////////////////


function refreshAsstTitle(ass_id){
	var	asst = getAssessmentByAssID(g_saved_activity, ass_id);
	$('.viewact_title').html(getActAssTitle(g_saved_activity, asst));
}
