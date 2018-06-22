// edit

var
		g_ref_limit = '<div data-name="ref_limit" data-mode="popup" data-type="limit" data-title="Word Limit" data-emptytext="N/A" data-showbuttons="bottom" data-placement="top" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0" data-url=""></div>',
		g_but_edit_ass = '<button type="button" class="btn btn-sm btn_edit_ass" onclick="editAssessment(this)" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i> </button>'
;

var
	g_saved_assessment_edit = 0,
	g_assessments = [],
	g_saved_asst_tr = 0
;
function initEditAsst(){
	var
		juploader = $('#uploader_editass'),
		jgallery = $('#gallery_editass')
	;
	initUploader(juploader, jgallery, 'assessment', {act_id:0, ass_id: 0},
		function(media_arr, media_id_arr){
			console.info('onUpdate', media_id_arr);
			//g_saved_activity.media = media_id_arr;
		},
		0,
		1
	);

}
/////////////////////////////////////////////////////////////////////////////////////////

function editAssessment(obj){
	console.info('editAssessment', obj);

	clear_tinymce_edit();
	$('.div_editact_asslist').hide();
	$('.div_editact_assedit, #div_asst_edit').show();
	$('#div_activity_edit > .btn_panel').hide();

	if (!obj) return;

	var jobj = $(obj),
			jtr = jobj.closest('tr'),
			jtbl = jobj.closest('table'),
			jtbl_id = jtbl.attr('id'),
			dt = jtbl.DataTable()
			row = dt.row(jtr),
			cols = row.data(),
			ncol = cols.length,
			ass_id = parseInt(cols[ncol - 2]),	// a hidden one
			method = cols[ncol - 1],
			jdiv = jtr.find('>td:nth-child(2)>div')
			//title = jdiv.editable('getValue', true)
	;
	g_saved_asst_tr = jtr;
	g_curr_ass_id = ass_id;
	console.log('editAssessment', ass_id, method);//, weight, title);//, jdiv)

	var index = ass_id - 1;
	if (g_assessments[index]){
		var assessment = g_assessments[index];
		delete assessment.new_assessment;
		editAssessment2(assessment);
	} else {
		console.error('assessment not found', 'ass_id=' + ass_id);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function editAssessment2(assessment){

	//changeBodyView(PAGE_EDIT_ASS);
	var
		selector = '#div_asst_edit',
		jdiv = $(selector),
		act_id = g_saved_activity.act_id,
		ass_id = assessment.ass_id,
		method = assessment.method,
		method_name = method_arr[method] ? method_arr[method] : '',
		weight = assessment.weight,
		index = parseInt(ass_id) - 1,
		title = assessment.title
	;
	setCurrPage(PAGE_EDIT_ASS);

	$('.div_editass_heading').html('Edit Assessment: ' + method_name);
	jdiv.find('.bodyview_title2').html(method_name);
	jdiv.find('.editable[data-name=assessment_title]').editable('setValue', title);
	//jdiv.find('.editable[data-name=assessment_desc]').editable('setValue', assessment.desc?assessment.desc:'');

	init_tinymce_editable('assdesc', assessment.desc);
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

	// UPLOADER
	if (!assessment.media){
		assessment.media = [];
	}
	$('#uploader_editass')
		.uploader('set_query_ids', {act_id: act_id, ass_id: ass_id})
		.uploader('loadGallery', assessment.media)
	;

	//////////////////////////////////////////////////////////////////////
	// PREPARE ASSESSMENT
	//////////////////////////////////////////////////////////////////////
	if (method == 'prt'){

		$('.div_edit_asst_items').hide();

	} else {

		$('.div_edit_asst_items').show();

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

		// DRAW THE ITEMS
		refreshEditItems(assessment);
	}

	showActBtnPanel();

	// save the ready settings
	g_saved_assessment_edit = jsonclone(assessment);

	// return to top
	$(window).scrollTop(0);
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
	//g_saved_assessment_edit = jsonclone(assessment);

	setPanelists(selector, [], assessment.panelists, function(){
		//console.info('cleared assessment');
		//g_saved_assessment_edit = getEditAssessment();
	});
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
		if (method == 'bl2'){
			method = 'blg';
		}
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

/////////////////////////////////////////////////////////////////////////////////////////////////

function getEditAssessment(ass_id, method, title, weight){
	close_tinymce_all(1);
	
	var
			selector = '#div_asst_edit',
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
	assessment.title = jdiv.find('.editable[data-name=assessment_title]').editable('getValue', true);
	//assessment.desc = jdiv.find('.editable[data-name=assessment_desc]').editable('getValue', true);
	assessment.desc = get_tiny_contents('assdesc');
	assessment.method = method;
	assessment.weight = weight;
	assessment.start = start;
	assessment.end = end;
	assessment.skills = skills;
	assessment.panelists = panelists;
	assessment.items = getEditItemsValues(selector);
	assessment.media = $('#uploader_editass').uploader('getMediaIDArr');
	//console.info('getEditAssessment', assessment);
	return assessment;
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function updateEditAssessment(){

	console.log('updateEditAssessment');

	var
		ass_index = g_curr_ass_id - 1,
		old_rubrics = 0
	;
	// OLD RUBRICS
	//var old_asst = g_saved_activity.assessment.assessments[ass_index];
	var old_asst = g_assessments[ass_index];
	if (old_asst.rubrics){
		old_rubrics = jsonclone(old_asst.rubrics);
		console.log('old_rubris', old_rubrics);
	}

	// NEW RUBRICS
	var new_asst = g_assessments[ass_index] = getEditAssessment();
	var new_rubrics = setDefaultRubrics(new_asst);

	// UPDATE TITLE
	g_saved_asst_tr.find('.ass_list_title').text(new_asst.title);

	// copy from old_rubrics to new_rubrics
	if (old_rubrics){
		// copy params
		new_rubrics.sep_skills = old_rubrics.sep_skills;
		new_rubrics.sep_quesions = old_rubrics.sep_quesions;

		for (var i = 0; i < old_rubrics.items.length; i++){
			var old_item = old_rubrics.items[i];
			var old_item_id = old_item.item_id;
			for (var j = 0; j < new_rubrics.items.length; j++){
				var new_item = new_rubrics.items[j];
				// same item_id?
				if (old_item_id == new_item.item_id){
					for (var m  = 0; m < old_item.rows.length; m++){
						var old_row = old_item.rows[m];
						var old_row_name = old_row.row_name;

						for (var n  = 0; n < new_item.rows.length; n++){
							var new_row = new_item.rows[n];
							var new_row_name = new_row.row_name;
							// same row name?
							if (old_row_name == new_row_name){
								console.log('copy rubrics row', j, new_row_name, old_row);
								new_rubrics.items[j].rows[n] = jsonclone(old_row);
								break;
							}
						}
					}
				}
			}
		}
	}
	console.log('new_rubrics', new_rubrics);
	g_assessments[ass_index].rubrics = new_rubrics;
	
	refreshEditActRubrics(g_assessments);
}
