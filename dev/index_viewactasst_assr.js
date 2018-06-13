///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Assessor's Table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var
	g_string_checked = '<span style="font-size:12px; color:red">Checked</span>',
 	g_string_submitted = '<span style="font-size:12px; color:red">Submitted</span>',
	g_string_pending = '<span style="font-size:12px; color:black">Pending</span>'
;

function viewActAsst_assr1(){

	console.log('viewActAsst_assr1');
	var
		jtr = $('#tr_actpage_assessment_assessor'),
		jtbl = jtr.find('[dt_type=assessment_assr1]')
	;
	if (!g_ass_assr){
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
		var assr_id = g_user_id;
		var dt = jtbl.show().DataTable().clear().draw();

		// loop all the assessments
		for (var i in assessments){
			var
				asst = assessments[i];
				ass_id = asst.ass_id,
				ass_name = getAssTitle(asst),
				completed = getCompletedByID(asst, 'assr_asst_completed', assr_id),
				stat = getAsstStat(activity, ass_id),
				asst_assessors = getMyAssessors( asst.panelists, 0, g_user_id)
				peer_assessees = getMyPeerAssessees(ass_id)
			;
      		// check if i may assess this assessment
			if (
				in_array(g_user_id, asst_assessors)
			||
			  peer_assessees.length
			){
				dt.row.add([
					ass_name,
					stat,
					g_but_right,
				]);
			}
		}
		dt.draw();
		jtbl.parent().find('.subsection_header').show();
		refreshViewAsstTbl(jtbl);

	}
}

////////////////////////////////////////////////////

var g_jcurr_stat = 0;

function viewAsst_assr1(ass_id, obj){
	//console.info('viewActAsst_assr2b', ass_id);
	console.info('viewAsst_assr1', ass_id);
	refreshAsstTitle(ass_id);

	g_curr_ass_id = ass_id;
	g_jcurr_stat = $(obj).parent().find('td:nth-child(2)');

	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var activity = g_saved_activity,
		act_id = activity.act_id,
		asst = getAssessmentByAssID(activity, ass_id);

	if (!asst){
		console.error('viewAsst_assr1 not exists');
		return;
	}

	var	method = asst.method,
		title = getActAssTitle(activity, asst);
	;

	// show marked / participants
	refreshAsstMarked();

	var jdiv = $('#div_viewass_assr .div_viewass_viewpart');
	jdiv
		.attr('ass_id', ass_id)
		.find('.viewass_title')
		.html(title)
	;
	// cleear filter
	jdiv.find('.viewass_search').val('');

	var jtbl = jdiv.find('.my_datatable');

	// opts
	// do not order for dummy data
	//var uact = getUact(act_id);
	//if (uact.dummy){
	//	opts.ordering = false;
	//}
	var
		dt = 0,
		dt_opts = {
			ordering: true,	// otherwise, the list is difficult to trace
			order: [[ 2, "asc" ]],	// the user name
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
	var assr_id = g_user_id;

  // find assessess
	//var assessees = [];
	//if (amIPrimaryAssr(activity.coordinator_id, asst.panelists)){
	//	assessees = activity.participants;
	//} else {
	//	assessees = getMyPeerAssessees(ass_id);
	//}
  // remove myself from assessees if i am not an assessor (of myself)
	//if (!amiassessor){
	//	remove_element_from_array(assessees, g_user_id);
	//}
  var assessees = getMyAssessees(asst.panelists, getMyPeerAssessees(ass_id), g_user_id);
	for (var i = 0; i < assessees.length; i++){
		var part_id = assessees[i],
			imgusername = getImgUserName(part_id, g_act_parts),
			action = '<button class="btn btn-primary" style="width:60px">Mark</button>',
			marks = 0
		;
		if (asst){
			if (asst.assr_asst_marks && typeof(asst.assr_asst_marks[assr_id +','+part_id]) != 'undefined'){
				marks = asst.assr_asst_marks[assr_id +','+part_id];
			} else if (asst.part_asst_marks && asst.part_asst_marks[part_id]){
				marks = 'submitted';
			} else {
				marks = '-'; // pending
			}
		}
		var status = getStarsStatus(marks);
/*
		if (asst.assr_asst_marks && typeof(asst.assr_asst_marks[assr_id +','+part_id]) != 'undefined'){
			// marked
			var marks = asst.assr_asst_marks[assr_id +','+part_id];
			status = getStarsStatus(marks);

		} else if (asst.part_asst_marks && asst.part_asst_marks[part_id]){	//} == 'submitted'){
			// submitted
			status = '<!--1--->' + g_string_submitted;

		} else {
			// pending
			status = '<!--3--->' + g_string_pending;
		}
*/
		var arr = [
			part_id,
			imgusername,
			status,
			action,
			g_but_right,
		];
		dt.row.add(arr);
	}
	dt.draw();

	refreshViewAsstTbl(jtbl);
	showDivStar(jdiv);

	transdiv($('#div_viewass_assr'), 1);
}

////////////////////////////////////////////////////
// marking asst
////////////////////////////////////////////////////
var g_jcurr_marks = 0;

function viewAsst_assr2(obj){
	var
		jbut = $(obj),
		jtr = jbut.closest('tr'),
		jtbl = jtr.find('.imgusername'),
		part_id = parseInt(jtbl.attr('user_id')),
		part_name = jtr.find('.imgusername').text(),
		jdiv = jtr.closest('.div_viewass_viewpart'),
		ass_id = parseInt(jdiv.attr('ass_id'))
	;
	g_jcurr_marks = jtr.find('>td:nth-child(2)');

	console.info('viewAsst_assr2', part_id, ass_id);

	$('.div_act_tabs').slideUp(400, function(){
		$('#view_act_title_ass, .tbl_ass_tabs').hide();
   		showActBtnPanel();
	});

	// prepare div
	g_curr_part_id = part_id;
	viewAssessment(ass_id, 'assessor', part_id, part_name, function(){
		transdiv($('#div_viewass_assr'), 2, function(){
		});
	}, 'viewAsst_assr2');
}
