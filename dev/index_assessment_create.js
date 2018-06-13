
/////////////////////////////////////////////////////////////////////////////

function createAssessment(method){
	var jdiv = $('#div_editact_asst');
	if (!method){
		method = jdiv.find('.select_methods').val();
	}
	var activity = getEditActivity();
	var assessment = jsonclone(template_assessment);
	assessment.new_assessment = 1;
	assessment.panelists = jsonclone(activity.impression.panelists);
	assessment.method = method;
	assessment.start = g_saved_activity.start;
	assessment.end = g_saved_activity.end;
	//if (method == 'prt'){
		//assessment.likert = 3; // default value
	//}
	console.info('createAssessment', method, assessment);
	addAssessment(method, assessment);
	var jtbl = jdiv.find('.my_datatable[dt_type=assessments]')
	initBasicLinked(jtbl);
	evenlyDistributeSliders(jtbl);
}

/////////////////////////////////////////////////////////////////////////////

function addAssessment(method, assessment){
	if (!method || !assessment){
		console.error('wrong arg in addAssessment');
		return;
	}
	var jdiv = $('#div_editact_asst')
		,method_name = method_arr[method] ? method_arr[method] : ''
		,index = g_assessments.length
		,ass_id = index + 1
		,title = assessment.title
	;

	// SAVE TO LOCAL MEMORY
	assessment.ass_id = ass_id;
	g_assessments[index] = assessment;

	var jtbl = $('.my_datatable[dt_type=assessments]'),
			dt = jtbl.DataTable(),
			arr = [
				method_name,
				'<span class="ass_list_title">' + title + '</span>' +
					//'<br/>' +
					//'<table><tr><td>'+g_percent_slider+'</td><td>'+g_but_left2+'</td><td>'+g_but_right2+'</td></tr></table>',
					g_percent_slider,
					//g_but_left2,g_but_right2,
				'',
				g_but_edit_ass,
				g_but_trash_ass,
				ass_id,
				method
			]
	;
	jtbl.show();
	dt.row.add(arr).draw();

	// POST-ADDITION OPERATIONS
	jtbl.find('.editable').editable();
	//initBasicLinked(jtbl);
}
