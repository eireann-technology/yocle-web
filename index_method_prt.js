//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EDIT METHOD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var
	g_prt_lvl_arr = ['Excellent',	'Proficient',	'Average', 'Poor', 'Unacceptable']

	,g_prt_rubric = '<div data-name="prt_rubric" data-mode="inline" data-type="text" data-title="Enter the name of the item" data-emptytext="(+Item)" data-showbuttons="bottom" data-placement="right" data-url="" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0"></div>'

	,g_prt_desc = '<div data-name="prt_desc" data-mode="inline" data-type="text" data-title="Enter the description" data-emptytext="(+Desc.)" data-showbuttons="bottom" data-placement="right" data-url="" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0"></div>'
;

function getEditItem_prt(jtbl, dt, item_id, item){
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VIEW METHOD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_prt(jtr){
	var jdiv = jtr.closest('div');
	var likert = parseInt(jdiv.find('.select_likert').val());
	var	item = jtr.find('.editable[data-name=prt_rubric]').editable('getValue', true),	// eq begins with 0
		descs = []
	;
	for (var i = 0; i < likert; i++){
		var jobj = jtr.find('.editable[data-name=prt_desc]').eq(i);// skip num and item
		if (jobj.length){
			descs[i] = jobj.editable('getValue', true);
		}
	}
	return {
		item: item,
		descs: descs,
	};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// VIEW METHOD
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function onChangeLikertScale(obj){
	refreshEditItems();
}

///////////////////////////////////////////////////////////////////////////

function viewActAsst_prt_all(opts, asst, uass, tbody){

	// delete eveything first
	tbody.empty();

	// reverse the structure: assessor -> items
	var bPreviousAssessor = 0;
	for (var assr_id in uass.assessors){

		// show assessor
		if (g_curr_role == 'assessor' && assr_id != g_user_id){
			// skip other assessors
			continue;

		} else {

			// draw separator line
			if (bPreviousAssessor){
				tbody.prepend('<hr/>');
			}
			bPreviousAssessor = 1;

			// SHOW THE LIST OF RUBRICS FOR THIS ASSESSOR
			var
				assessor = uass.assessors[assr_id],
				items = assessor.items,
				assr_asst_marks = assessor.assr_asst_marks,
				date = assessor.date
			;
			items.sort(function(a,b){
				var 
					a1 = a.daterange,
					b1 = b.daterange
				;
				if (a1 == b1){
					return 0;
				} else if (a1 > b1){
					return -1;
				} else {
					return 1;
				}
			});
			//for (var item_index in items){
			//for (var item_index = 0; item_index < items.length; item_index++){
			for (var item_index = items.length - 1; item_index >= 0; item_index--){
				var item = items[item_index];
				viewActAsst_prt(opts, asst, tbody, assr_id, item);
			}

			// ADD ASSESSOR ON TOP
			if (g_curr_role != 'assessor'){
				var s =
						'<tr>'
						+ '<td colspan="100">'
							+ '<table class="tbl_asst_assr" assr_id="' + assr_id + '">'
								+ '<tr>'
									+ '<td>'
										+ getDivStar(0, getImgUserName(assr_id, g_asst_assrs, g_act_parts), 1)
									+ '</td>'
									+ (!date?'':'<td>' + getDateWithoutTime(date) + '</td>')
								+ '</tr>'
							+ '</table>'
						+ '</td>'
					+ '</tr>'
				;
				tbody.prepend(s);
			}
		}
	}

	// show a dummy template when no assessment is made
	if (g_curr_role == 'participant' && !bPreviousAssessor){
		var item_id = 0, uass_item = 0;
		var s = getViewRubricTbl(asst, item_id, uass_item, RUBRICS_VIEW);
		tbody.append(s);
	}

	// DRAW STARS
	for (var assr_id in uass.assessors){
		var assessor = uass.assessors[assr_id];
		if (!isNaN(assessor.assr_asst_marks)){
			var jtbl = tbody.find('.tbl_asst_assr[assr_id=' + assr_id + ']')
			setDivStarValue(jtbl, assessor.assr_asst_marks);
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// uass: {
// 	items: {
//		assessors: {
//		}
// 	}
// }

function viewActAsst_prt(opts, asst, tbody, assr_id, item){
	var prt_item_id = item.prt_item_id;
	if (!prt_item_id){
		prt_item_id = 0;
	}

	console.log('viewActAsst_prt', prt_item_id);

	var rubrics_mode = 0;
	if (opts.bEditAnswer){
		rubrics_mode = RUBRICS_ANSR;
	} else if (opts.bEditMarking){
		rubrics_mode = RUBRICS_MARK;
	} else if (opts.bViewQuestion){
		rubrics_mode = RUBRICS_VIEW;
	}

	// create dummy uass_item for the display
	var uass_item = {
		assessors: {},
	}
	var assessor = uass_item.assessors[assr_id] = jsonclone(item);

	var item_id = 0;

	// prepare text
	// http://www.daterangepicker.com/
	var td_delete = '';
	if (rubrics_mode == RUBRICS_MARK){
		td_delete = '<td width="1">'
			+ '<button type="button" class="btn btn-danger btn-sm btn-list-trash" onclick="deleteRubric(this)">'
				 + '<i class="glyphicon glyphicon-trash"></i>'
			+ '</button>'
		+ '</td>';
	}

	var stars = assessor.assr_item_marks;
	var s =
		'<tr>'
		 + '<td>'
			+ '<table class="tbl_prt_hdr" prt_item_id="' +  prt_item_id + '">'
				+ '<tr>'
					+ '<td><div class="div_item_stars">' + getDivStar(stars, '<b>Score:</b>', 1) + '</div></td>'
					+ '<td>'
						+ '<input class="event_daterange" value="">'
					+ '</td>'
					//+ '<td width="1">&nbsp;</td>'
						+ td_delete
					+ '</tr>'
			+ '</table>'
			+ getViewRubricTbl(asst, item_id, uass_item, rubrics_mode)
		+ '</td>'
	+ '</tr>';

	var jobj = $(s);
	tbody.prepend(jobj);
	showDivStar(tbody.find('.div_item_stars'));

	// daterangepicker
	var opts = {
    locale: {
      format: 'YYYY-MM-DD',
    },
	};
	var daterange = '';
	if (
		uass_item.assessors
	&&
		uass_item.assessors[assr_id]
	&&
		uass_item.assessors[assr_id].daterange
	){
		daterange = uass_item.assessors[assr_id].daterange;
	}
	if (!daterange){
		opts.endDate = moment();
		opts.startDate = moment().subtract(7, 'days');
		daterange = opts.startDate.format('YYYY-MM-DD') + ' - ' + opts.endDate.format('YYYY-MM-DD');
	} else {
		var arr = daterange.split(' - ');
		opts.startDate = arr[0];
		opts.endDate = arr[1];
	}
	console.log('daterange', daterange);
	if (g_curr_role == 'assessor'){
		jobj.find('.event_daterange')
			.daterangepicker(opts)
		;
	} else {
		jobj.find('.event_daterange')
			.val(daterange)
			.prop('disabled', true);
		;
	}
}

////////////////////////////////////////////////////////////////////////////

function deleteRubric(obj){
	confirmDialog('Are you sure you want to delete this?', function(){
		var jobj = $(obj),
			jtbl = jobj.closest('.tbl_prt_hdr'),
			prt_item_id = parseInt(jtbl.attr('prt_item_id')),
			jtr = jtbl.closest('tr'),
			act_id = g_saved_activity.act_id,
			ass_id = g_curr_ass_id,
			asst = getActAssessement(g_saved_activity, ass_id),
			uass = getUserAssessment(g_saved_user_doc, act_id, ass_id),
			assr_id = g_user_id
		;
		console.log('deleteRubric', input, prt_item_id);
		if (prt_item_id > 0){
			var input = {
					type: 'delete_rubric',
					assr_id: g_user_id,
					part_id: g_curr_part_id,
					act_id: act_id,
					ass_id: ass_id,
					prt_item_id: prt_item_id,
				}
			call_svrop(
				input,
				function (obj){
					if (obj.error){
						errorDialog(obj.error);
					} else {
						deleteRubric2(uass, assr_id, prt_item_id, jtr);
					}
				}
			);
		} else {
			deleteRubric2(uass, assr_id, prt_item_id, jtr);
		}
	});
}

///////////////////////////////////////////////////////////////////////////////////

function deleteRubric2(uass, assr_id, prt_item_id, jtr){
	// delete from memory
	if (prt_item_id > 0){
		var assr = uass.assessors[assr_id];
		var items = assr.items;
		for (var i = 0; i < items; i++){
			var item = items[i];
			if (item.prt_item_id == prt_item_id){
				items.splice(i, 1);
				break;
			}
		}
	}
	// delete from interface
	jtr.remove();
}


/////////////////////////////////////////////////////////////////

function addPrtRubrics(){
	var
		opts = {
			bEditMarking: true,
		},
		act_id = g_saved_activity.act_id,
		ass_id = g_curr_ass_id,
		asst = getActAssessement(g_saved_activity, ass_id),
		uass = getUserAssessment(g_saved_user_doc, act_id, ass_id),
		tbody = $('#tr_actpage_assessment_assessor .tbl_asspage_asst[method=prt] > tbody'),
		item_index = tbody.find('.tbl_prt_hdr').length,
		item_id = item_index + 1,
		assr_id = g_user_id
	;
	//////////////////////////////////////
	// create item
	//////////////////////////////////////
	var item = {
		assr_item_marks: 0,
		part_item_marks: 0,
		prt_item_id: 0,
		assr_rubrics_indexes: {}
	}
	// copy rubrics contents
	if (asst.rubrics.items && asst.rubrics.items.length){
		for (var i in asst.rubrics.items[0].rows){
			var skill = asst.rubrics.items[0].rows[i];
			item.assr_rubrics_indexes[skill.row_name] = 0;
		}
	}
	console.log('addPrtRubrics');

	// add to user interface
	viewActAsst_prt(opts, asst, tbody, assr_id, item);

	transdiv_resize();
}
