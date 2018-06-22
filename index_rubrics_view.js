var
	RUBRICS_NONE = 0,
	RUBRICS_EDIT = 1,
	RUBRICS_ANSR = 2,
	RUBRICS_MARK = 3,
	RUBRICS_VIEW = 4,
	RUBRICS_MULT = 5
;

function anyEnabledRubrics(asst){
	var bAny = false;
	if (asst && asst.rubrics && asst.rubrics.items){
		var
			rubrics = asst.rubrics,
			sep_skills = rubrics.sep_skills,
			sep_questions = rubrics.sep_questions
			items = rubrics.items
		;
		for (var i in items){
			var item = items[i];
			for (var r in item.rows){
				var row = item.rows[r];
				if (!sep_skills && row.row_name != 'Overall'){
					// skip skills
				} else if (!sep_questions && i != 0){
					// skip questions
				} else if (row.enabled){
					bAny = true;
					break;
				}
			}
			if (bAny){
				break;
			}
		}
	}
	return bAny;
}

/////////////////////////////////////////////////////////////////////////////////////
function getViewRubricTbl(asst, item_id, uass_item, rubrics_mode){

	if (!anyEnabledRubrics(asst)){
		console.log('no any rubrics');
		return '';
	}

	//if (!asst.rubrics) return '';	// backward compatibility
	var
		method = asst.method,
		name = method == 'prt' ? '' : 'Skills'
	;

	// PREPARE THE COMMENTS
	var assr_rubrics_indexes = {}, comments = '';
	switch (rubrics_mode){

		case RUBRICS_MARK:
			if (!uass_item.assessors){
				uass_item.assessors = {};
			}
			if (!uass_item.assessors[g_user_id]){
				uass_item.assessors[g_user_id] = {};
			}
			if (!uass_item.assessors[g_user_id].assr_rubrics_indexes){
				uass_item.assessors[g_user_id].assr_rubrics_indexes = [];
			}
			var my_marking = uass_item.assessors[g_user_id];
			assr_rubrics_indexes = my_marking.assr_rubrics_indexes;
			comments = my_marking && my_marking.comments ? my_marking.comments : ''; //'Good job!';
			break;

		case RUBRICS_VIEW:
		case RUBRICS_MULT:
			var obj = uass_item.assessors;
			if (obj_count(obj) == 1){
				var assessor = obj[Object.keys(obj)[0]];
				var counter = {};
				for (var skill_name in assessor.assr_rubrics_indexes){
					if (!assr_rubrics_indexes[skill_name]){
						assr_rubrics_indexes[skill_name] = 0;
					}
					assr_rubrics_indexes[skill_name] += assessor.assr_rubrics_indexes[skill_name];
					counter[skill_name]++;
				}
				if (assessor.comments){
					comments = '<span class="span_comments">' + assessor.comments + '</span>';
				}
			}
			break;

	}

	var s = '';

	if (method != 'mcq'){
		
		// non-prt, assessor or marked: show item score
		//if (method != 'prt' && method != 'blg' && method != 'bl2' && (g_curr_role == 'assessor' || obj_count(uass_item.assessors))){	// has its own div_item_stars
		//	s += '<div class="div_item_stars">' + getDivStar(uass_item.part_item_marks, '<b>Item score:</b>', 1) + '</div>';
		//}
		
		if (method == 'prt'){
		} else if ((method == 'blg' || method != 'bl2') && g_curr_role != 'assessor'){
		//} else if (!obj_count(uass_item.assessors)){
		} else if (g_curr_role != 'assessor'){
			var part_item_marks = obj_count(uass_item.assessors) ? uass_item.part_item_marks : 0;
			s += '<div class="div_item_stars">' + getDivStar(part_item_marks, '<b>Item score:</b>', 1) + '</div>';
		} else if (g_curr_role == 'assessor'){
			var assr_item_marks = uass_item && uass_item.assessors && uass_item.assessors[g_user_id] ? uass_item.assessors[g_user_id].assr_item_marks : 0;
			s += '<div class="div_item_stars">' + getDivStar(assr_item_marks, '<b>Item score:</b>', 1) + '</div>';
		}
		s +=

			'<table class="tbl_5star_marking" item_id="' + item_id + '">'

			+ '<tr>'
				+ '<td class="head1">' + name + '</td>'	// corner
				+ '<td class="head1" colspan="6">Markings</td>'
			+ '</tr>'

			+ '<tr>'
				+ '<td class="head3">&nbsp;</td>'	// corner
				+ '<td class="head2">Poor<br/><img src="./images/starsx1.png"/></td>'
				+ '<td class="head2">Fair<br/><img src="./images/starsx2.png"/></td>'
				+ '<td class="head2">Average<br/><img src="./images/starsx3.png"/></td>'
				+ '<td class="head2">Good<br/><img src="./images/starsx4.png"/></td>'
				+ '<td class="head2">Excellent<br/><img src="./images/starsx5.png"/></td>'
				+ '<td class="last"></td>'
			+ '</tr>'
		;


		// EACH SKILL
		s += getViewRubricRow(item_id, asst, uass_item, assr_rubrics_indexes, rubrics_mode);

		// ADD MARKING COMMENTS
		s += '<tr>'
				+ '<td class="head4">Comments</td>'
				+ '<td colspan="5">'
					+ '<div class="asspage_open_comments"' + (rubrics_mode == RUBRICS_MARK ? ' contenteditable="true"' : '') + '>' + comments + '</div>'
				+ '</td>'
			+ '</tr>'
		;
		s += '</table>';

	} else if (rubrics_mode == RUBRICS_MARK || (rubrics_mode == RUBRICS_VIEW && comments != '')){
		////////////////////////////////////
		// mcq
		////////////////////////////////////
		s +=
		
			'<div class="div_item_stars" style="text-align:right">' 
				+ getDivStar(
				g_assr_item_marks_hash[item_id],
				'<b>Item score:</b>', 1) + '</div>'

			+ '<table class="tbl_mcq_comments">'
				+ '<tr>'
					+ '<td class="head4">Comments</td>'
				+ '</tr>'
				+ '<tr>'
					+ '<td colspan="5">'
						+ '<div class="asspage_open_comments"' + (rubrics_mode == RUBRICS_MARK ? ' contenteditable="true"' : '') + '>' + comments + '</div>'
					+ '</td>'
				+ '</tr>'
			+ '</table>'
		;
	}
	return s;
}

//////////////////////////////////////////////////////////////////////////////////////
//assessment, 'assessor', uass_item, rubrics_mode

function getViewRubricRow(item_id, asst, uass_item, my_indexes, rubrics_mode){

	console.log('getViewRubricRow', item_id, asst, uass_item);
	var
		s = '',
		rubrics = asst.rubrics,
		sep_skills = rubrics ? rubrics.sep_skills : 0,
		sep_questions = rubrics ? rubrics.sep_questions : 0,
		method = asst.method,
		item = 0,
		rubrics_item = 0
	;
	if (method == 'mcq'){

		return '<tr><td>MCQ has no rubrics</td></tr>';

	} else if (method == 'blg' || method == 'bl2' || method == 'prt'){

		// always the same rubrics for all the items
		item = 0;
		rubrics_item = rubrics.items[0];

	} else if (rubrics && rubrics.items){
		item = item_id > 0 ? asst.items[item_id - 1] : 0;
		if (!sep_questions){
			rubrics_item = rubrics.items[0];
		} else {
			//rubrics_item = item_id > 0 ? rubrics.items[item_id - 1] : rubrics.items[rubrics.items.length - 1];
			rubrics_item = rubrics.items[item_id];
		}
	}
	if (!rubrics_item){

		console.error('no rubrics_item');

	} else {

		console.info(rubrics_item);

		{
			for (var r = 0; r < rubrics_item.rows.length; r++){
				var
					row = rubrics_item.rows[r],
					row_name = row.row_name
				;
				//if (sep_skills && row_name == 'Overall'){
					//continue; // skip overall skills
				//} else
				if (!sep_skills && row_name != 'Overall'){
					continue; // skip skills breakdown
				}

				if (row.enabled){

					var row_desc = row.row_desc;

					// testing
					//row_desc = 'Ability to integrate learning into your own work experiences and analyze issues with a critical attitude';

					var div_row_desc = !row_desc ? '' : '<div class="row_desc">' + row_desc + '</div>';
					s += '<tr sep_skills="' + (!item_id ? 0 : 1) + '">'
							+ '<td class="head3">'
								+ '<div class="row_name">' + row_name + '</div>'
								+ div_row_desc
							+ '</td>'
					;
					var index = my_indexes && typeof(my_indexes[row_name]) != 'undefined' ? my_indexes[row_name] : -1;
					for (var c = 0; c < row.cells.length; c++){
						var cell_text = row.cells[c];
						var selected = '', events = '';
						if (rubrics_mode == RUBRICS_MARK){
							if (method == 'mcq' && item){
								if (
									(item.correct == uass_item.answer && c == 4)
								||
									(item.correct != uass_item.answer && c == 0)
								){
									selected = ' rubrics_selected';
								}
								selected += ' rubrics_noselect';
							} else {
								events = ' onclick="toggleRubrics($(this))" onmouseover="onMouseOverRubrics($(this))" onmouseout="onMouseOutRubrics($(this))" ';
							}
						}
						if (method != 'mcq' && c == index - 1){
							selected = ' rubrics_selected';
						}
						if (rubrics_mode != RUBRICS_MARK){
							selected += ' rubrics_noselect';
						}
						s += '<td class="cell' + selected + '" ' + events + '>' + cell_text + '</td>';
					}
					s += '</tr>';
				}
			}
		}
	}
	return s;
}


///////////////////////////////////////////////////////

function toggleRubrics(jobj){
	if (jobj.hasClass('rubrics_selected')){
		jobj.removeClass('rubrics_selected');
	} else {
		jobj.closest('tr').find('.rubrics_selected').removeClass('rubrics_selected');
		jobj.addClass('rubrics_selected');
	}

	// check asst
	var asst = getAssessmentByAssID(g_saved_activity, g_curr_ass_id);
	var input = getAssessmentInput();

	// check item size
	switch (g_curr_method){
		case 'prt':
		case 'pst':
		case 'blg':
		case 'bl2':
			break;

		default:
			if (asst.items && asst.items.length != input.length){
				console.error('wrong input size', asst.items.length, input.length);
				return;
			}
			break;
	}


	// update av. marks for this rubrics
	var
		jtbl = jobj.closest('.tbl_5star_marking'),
		jroot = jtbl.closest('.tbl_asspage_asst'),
		item_index = jroot.find('.tbl_5star_marking').index(jtbl),
		item = input[item_index],
		stars = item.assr_item_marks,
		//jstars = jtbl.parent().closest('table').find('.div_item_stars')
		jstars = jtbl.prev('.div_item_stars')
	;
	if (!jstars.length){
		// prt?
		jstars = jtbl.prev().find('.div_item_stars');
	}
	setDivStarValue(jstars, stars);

	// update asst marks
	var
		stars = getAssrAsstMarks(asst, input),
		jdiv = $('.div_viewass_' + g_curr_role + ' .div_asst_view .div_asst_stars')
	;
	setDivStarValue(jdiv, stars);

}

///////////////////////////////////////////////////////

function onMouseOverRubrics(jobj){
	if (!jobj.hasClass('rubrics_over')){
		jobj.addClass('rubrics_over');
	}
}

///////////////////////////////////////////////////////

function onMouseOutRubrics(jobj){
	if (jobj.hasClass('rubrics_over')){
		jobj.removeClass('rubrics_over');
	}
}
