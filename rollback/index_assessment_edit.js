// edit 

var 
		g_ref_limit = '<div data-name="ref_limit" data-mode="popup" data-type="limit" data-title="Word Limit" data-emptytext="N/A" data-showbuttons="bottom" data-placement="top" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0" data-url=""></div>',
		
		g_but_edit_ass = '<button type="button" class="btn btn-sm btn_edit_ass" onclick="editAssessment(this)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i> </button>'
;

var
	g_saved_assessment_edit = 0,
	g_assessments = []
;
/////////////////////////////////////////////////////////////////////////////////////////

function editAssessment(obj){
	console.info('editAssessment', obj);
	$('#div_activity_edit').show();
	$('#div_activity_view').hide();
	$('#div_assessment_edit').show();
	$('#div_assessment_view').hide();
	if (!obj) return;

	var jobj = $(obj),
			jtr = jobj.closest('tr'),
			jtbl = jobj.closest('table'),
			jtbl_id = jtbl.attr('id'),
			dt = jtbl.DataTable()
			row = dt.row( jtr ),
			cols = row.data(),
			ncol = cols.length,
			ass_id = parseInt(cols[ncol-2]),	// a hidden one
			method = cols[ncol-1],
			jdiv = jtr.find('>td:nth-child(2)>div')
			//title = jdiv.editable('getValue', true)
	;
	console.info('editAssessment', ass_id, method);//, weight, title);//, jdiv)
	
	var index = ass_id - 1;
	if (g_assessments[index]){
		//g_assessments[index].title = title;
		var assessment = g_assessments[index];
		delete assessment.new_assessment;
		editAssessment2(assessment);
	} else {
		console.error('assessment not found', 'ass_id=' + ass_id);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function editAssessment2(assessment){
	
	changeBodyView(PAGE_EDIT_ASS);

	var
		selector = '#div_assessment_edit',
		jdiv = $(selector),
		ass_id = assessment.ass_id,
		method = assessment.method,
		method_name = method_arr[method]?method_arr[method]:'',
		weight = assessment.weight,
		index = parseInt(ass_id) - 1,
		title = assessment.title
	;

	jdiv.find('.bodyview_title2').html(method_name);
	jdiv.find('.editable[data-name=assessment_title]').editable('setValue', title);
	jdiv.find('.editable[data-name=assessment_desc]').editable('setValue', assessment.desc?assessment.desc:'');
	
	jdiv.find('.start_datetime').val(assessment.start);
	jdiv.find('.end_datetime').val(assessment.end);
	
	setDateTimePicker(jdiv);
	
	// SETUP PANELISTS
	setupPanelists(selector);
	
	setPanelists(jdiv, assessment.skills, assessment.panelists, function(){
		// SAVE WITH ITEMS AND USERS
		//g_saved_assessment_edit = getEditAssessment(ass_id, method, title, weight);
	});
	
	// PLACEHOLDER
	setShortPlaceHolder(jdiv);	
	
	//////////////////////////////////////////////////////////////////////
	// PREPARE ASSESSMENT
	//////////////////////////////////////////////////////////////////////
	if (method == 'prt'){
		jdiv.find('.tbl_likert').show();
		if (!assessment.likert){
			assessment.likert = 3;
		}
		jdiv.find('.select_likert option:nth-child(' + (assessment.likert-2) + ')').prop('selected', true);
	} else {
		jdiv.find('.tbl_likert').hide();
	}
	
	// ADD IF NONE
	checkAddFirstItem(assessment);

	//////////////////////////////////////////////////////////////////////
	// ITEMS
	//////////////////////////////////////////////////////////////////////
	var jtbl = jdiv.find('.my_datatable[dt_type=items]'), dt = 0;
	if (!jtbl.hasClass('dataTable')){
		jtbl.DataTable({
			//responsive: true,
			//ordering: false,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			autoWidth: false,	
			columnDefs: [
				{ targets: '_all',	orderable: false},
				//{	targets: [0,2,3,4],	width: 1},
			],
		});
	}
	dt = jtbl.DataTable();
	
	// save the ready settings
	g_saved_assessment_edit = assessment;

	// DRAW THE ITEMS
	if (typeof(window['getEditItem_' + method]) != 'function'){
		$('.div_edit_asst_items').hide();
	} else {
		$('.div_edit_asst_items').show();
		refreshEditItems(assessment);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function clearEditAssessment(){
	var jdiv = $('#div_editact_asst');
	
	var assessment = jsonclone(g_saved_assessment_edit ? g_saved_assessment_edit : template_assessment);
	var method = assessment.method;

	var start = g_saved_activity.start;
	var end = g_saved_activity.end;
	
	// clear data
	assessment.status = 'new';
	assessment.method = method;
	assessment.start = start;
	assessment.end = end;
	assessment.skills = [];
	assessment.items = [];
	assessment.panelists = jsonclone(template_panelists);
	// clear ui
	jdiv.find('.start_datetime').val(start);
	jdiv.find('.end_datetime').val(end);
	// clear table
	jdiv.find('table[dt_type='+method+']').DataTable().clear().draw();
	//addAssessmentItem(method);
	//jdiv.find('.select_likert option:nth-child(1)').prop('selected', true);
	
	// SET PANELISTS
	g_saved_assessment_edit = assessment;
	setPanelists(selector, [], assessment.panelists, function(){
		//console.info('cleared assessment');
		//g_saved_assessment_edit = getEditAssessment();
	});
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function getEditAssessment(ass_id, method, title, weight){
	var
			selector = '#div_assessment_edit',
			jdiv 			= $(selector),
			start 		= jdiv.find('.start_datetime').val(),
			end 			= jdiv.find('.end_datetime').val(),
			skills 		= getSkillsFromTbl(selector, 1),
			panelists = getPanelists(selector)
	;
	if (g_saved_assessment_edit){
		ass_id 		= g_saved_assessment_edit.ass_id;
		title 		= g_saved_assessment_edit.title;
		method 		= g_saved_assessment_edit.method;
		weight 		= g_saved_assessment_edit.weight;
	}
	var assessment = jsonclone(template_assessment);
	assessment.ass_id = ass_id;
	assessment.desc = jdiv.find('.editable[data-name=assessment_desc]').editable('getValue', true);
	assessment.method = method;
	assessment.title = title;
	assessment.weight = weight;
	assessment.start = start;
	assessment.end = end;
	assessment.skills = skills;
	assessment.panelists = panelists;
	assessment.items = getEditItemsValues(selector);
	switch (method){
		case 'prt':
			assessment.likert = parseInt(jdiv.find('.select_likert').val());
			break;
	}
	//console.info('getEditAssessment', assessment);
	return assessment;
}


/////////////////////////////////////////////////////////////////////////////////////////////////

function closeEditAssessment(){
	var assessment = getEditAssessment();
	assessment.title = $('#div_assessment_edit .editable[data-name=assessment_title]').editable('getValue', true);	
	console.info('close edit assessment', assessment);
	var
		ass_id = parseInt(assessment.ass_id),
		index = ass_id - 1
	;
	g_assessments[index] = assessment;
	
	// refresh title
	var jtbl = $('.my_datatable[dt_type=assessments]'),
		jtr = jtbl.find('>tbody>tr:nth-child('+ass_id+')')
	;
	//jtr.find('.editable[data-name=assessment_title]').editable('setValue', assessment.title);
	jtr.find('td:nth-child(2) span.ass_list_title').html(assessment.title);
	changeBodyView(-1);
	
	//g_curr_assessment_edit = 0;
	g_saved_assessment_edit = 0;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues(selector){
	var items = [];
	if (g_saved_assessment_edit){
		var method = g_saved_assessment_edit.method,
			jdiv = $(selector);

		var jtbl = jdiv.find('.my_datatable[dt_type=items]'),
			dt = jtbl.DataTable()
		;
		// LOOP FOR EVERY ROW
		jtbl.find('>tbody>tr:nth-child(odd)').each(function(){
			var
				jtr = $(this)
				,weight = parseInt(jtr.find('>td:nth-child(4)').text())
				,jtr2 = jtr.next()
				,item = eval('getEditItemsValues_' + method)(jtr2)
			;
			if (item){
				item.weight = weight;
				items.push(item);
			}
		});
	}
	return items;
}

