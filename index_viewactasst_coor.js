
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coordinator's Table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActAsst_coor1(){	//jtbl, assessments){
	console.log('viewActAsst_coor1');	//, jtbl, assessments);

	var
		jtr = $('#tr_actpage_assessment_coordinator'),
		jtbl = jtr.find('[dt_type=assessment_coor1]')
	;
	if (!g_ass_coor){
		jtr.hide();

	} else {
		jtr.show();

		var
			activity = g_saved_activity,
			assessments = activity.assessment.assessments
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
		var dt = jtbl.show().DataTable();
		dt.clear().draw();
		for (var index in assessments){
			var
				assessment = assessments[index],
				ass_id = assessment.ass_id,
				ass_name = getAssTitle(assessment)
				stat = getAsstStat(g_saved_activity, ass_id)
			;
			var arr = [
				ass_name,
				stat,
				g_but_right,
			];
			dt.row.add(arr);
		}
		dt.draw();
		refreshViewAsstTbl(jtbl);

	}

}

////////////////////////////////////////////////////

function viewAsst_coor1(ass_id, obj){
	refreshAsstTitle(ass_id);

	console.info('viewAssr_coor1', ass_id, obj);

	$('.div_act_tabs').slideUp(400, function(){
		$('#view_act_title_ass, .tbl_ass_tabs').hide();
		showActBtnPanel();
	});

	// prepare div
	$('#div_viewass_coor .div_viewass_viewpart').hide();
	$('#div_viewass_coor .div_viewass_previewing').show();

	viewAssessment(ass_id, 'previewing', 0, '', function(){
		// view div
		transdiv($('#div_viewass_coor'), 1, function(){
			//$('.div_act_tabs, #view_act_title_ass, .tbl_ass_tabs').hide();
		});
	}, 'viewAsst_coor1');

}

//////////////////////////////////////////////////////////////////

function viewAsst_coor2(ass_id, obj){
	console.info('viewAssr_coor2', ass_id, obj);

	$('#div_viewass_coor .div_viewass_viewpart').show();
	$('#div_viewass_coor .div_viewass_previewing').hide();

	// view div
	transdiv($('#div_viewass_coor'), 1, function(){
		//$('.div_act_tabs, #view_act_title_ass, .tbl_ass_tabs').hide();
	});


	//console.info('viewActAsst_assr2b', ass_id);
	g_curr_ass_id = ass_id;

	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var activity = g_saved_activity,
		act_id = activity.act_id,
		asst = getAssessmentByAssID(activity, ass_id),
		method = asst.method,
		//title = getAssTitle(asst)
		//title = activity.title + '<br/>Asst#' + ass_id + ': ' + asst.title
		title = getActAssTitle(activity, asst);
	;

	// show marked / participants
	refreshAsstMarked();

	$('.viewact_title').html(getActAssTitle(activity, asst));

	var jdiv = $('#div_viewass_coor .div_viewass_viewpart');
	jdiv
		.attr('ass_id', ass_id)
		//.find('.viewass_title')
		//.html(title)
	;
	// cleear filter
	jdiv.find('.viewass_search').val('');

	var jtbl = jdiv.find('.my_datatable');

	var
		dt = 0,
		dt_opts = {
			ordering: true,	// otherwise, the list is difficult to trace
			order: [[ 2, "asc" ]],	// the user name
			//colReorder: true,
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				{	targets: [0],		orderable: false,	visible: false, },
				{	targets: [1],		orderable: true, 	type: 'html' },
				{	targets: [2],		orderable: true, 	type: 'string' },
				{	targets: [3],		orderable: false,	searchable: false},
			],
		}
	if (!jtbl.hasClass('dataTable')){

		// init datatable
		dt = jtbl.DataTable(dt_opts).search('').draw();

		// init search bar
		jdiv.find('.viewass_search').keyup(function(){
			var key = $(this).val();
			dt.search(key).draw();
		});

		// init sort field
		jdiv.find('.viewActPart_sel').change(function(){
			var index = $(this).prop('selectedIndex');
			//console.log(index);
			switch (index){

				case 0: // sort by status
					dt_opts.order = [[2, "asc"]];
					break;

				case 1: // sort by name
					dt_opts.order = [[1, "asc"]];
					break;
			}

			dt.destroy();
			jtbl.next().find('tbody').empty();
			var key = jdiv.find('.viewass_search').val();
			dt = jtbl.DataTable(dt_opts).search(key).draw();

		});


	} else {
		dt = jtbl.show().DataTable().clear().search('').draw();
	}

	var assessees = activity.participants;
	for (var i = 0; i < assessees.length; i++){
		var part_id = assessees[i],
			imgusername = getImgUserName(part_id, g_act_parts),
			//action = '<button class="btn btn-primary" onclick="viewAsst_coor3(this)" style="width:60px">View</button>',
			//action = '<span onclick="viewAsst_coor3($(this))">' + g_but_right + '</span>',
			action = g_but_right,
			marks = 0
		;
		if (asst){
			if (asst.part_asst_marks && asst.part_asst_marks[part_id] == 'submitted'){
				marks = 'submitted';

			} else if (asst.part_asst_marks && asst.part_asst_marks[part_id]){
				marks = asst.part_asst_marks[part_id];

			} else {
				marks = '-';	// pending
			}
		}
		var status = getStarsStatus(marks);
/*
		if (asst.part_asst_marks && asst.part_asst_marks[part_id] == 'submitted'){
			// submitted
			status = '<!--2--->' + g_string_submitted;

		} else if (asst.part_asst_marks && !isNaN(asst.part_asst_marks[part_id])){
			status = '<!--1--->' + getStarsStatus(asst.part_asst_marks[part_id]);

		} else {
			// pending
			status = '<!--3--->' + g_string_pending;
		}
*/
		var arr =  [
			part_id,
			imgusername,
			status,
			action,
		];
		dt.row.add(arr);
	}
	dt.draw();

	// associate button with action
	//jtbl.find('.div_but_special').click(function(){
	//	viewAsst_coor3($(this));
	//});

	showActBtnPanel();
	refreshViewAsstTbl(jtbl);
	showDivStar(jdiv);

}

///////////////////////////////////////////////////////////////////

function viewAsst_coor3(jobj){
	var
		jtr = jobj.closest('tr'),
		jtbl = $(jtr.closest('table')),
		jtr2 = jtbl.closest('tr'),
		ass_id = g_curr_ass_id,
		dt = jtbl.DataTable(),
		row = dt.row(jtr),
		cols = row.data(),
		part_id = parseInt(cols[0]),
		part_name = $('<div>' + cols[1] + '</div>').text()
	;
	console.info('viewAsst_coor3', ass_id);

	$('.div_act_tabs').slideUp(400, function(){
		$('#view_act_title_ass, .tbl_ass_tabs').hide();
		showActBtnPanel();
	});

	viewAssessment(ass_id, 'coordinator', part_id, part_name, function(){
		transdiv($('#div_viewass_coor'), 2, function(){
		});
	}, 'viewAsst_coor3');

}
