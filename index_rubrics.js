
/////////////////////////////////////////////////////////////////////////////////////
var g_toggles_yesno = {
		drag: true, 	// allow dragging the toggle between positions
		click: true, 	// allow clicking on the toggle
		text: {
			on: 'Yes', 	// text for the ON position
			off: 'No' 	// and off
		},
		on: false, // is the toggle ON on init
		animate: 150, // animation time (ms)
		easing: 'swing', // animation transition easing function
		checkbox: null, // the checkbox to toggle (for use in forms)
		clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
		width: 90, // width used if not set in css
		height: 30, // height if not set in css
		type: 'compact' // if this is set to 'select' then the select style toggle will be used
	},
	g_toggles_enable = {
		drag: true, 	// allow dragging the toggle between positions
		click: true, 	// allow clicking on the toggle
		text: {
			on: 'Enabled', 	// text for the ON position
			off: 'Disabled' 	// and off
		},
		on: false, // is the toggle ON on init
		animate: 150, // animation time (ms)
		easing: 'swing', // animation transition easing function
		checkbox: null, // the checkbox to toggle (for use in forms)
		clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
		width: 110, // width used if not set in css
		height: 30, // height if not set in css
		type: 'compact' // if this is set to 'select' then the select style toggle will be used
	}
;

////////////////////////////////////////////////////////////////////////////////////

function getMarkingOptions(asst){
	var nskill = obj_count(asst.skills)
	var s = '<table class="actpage_tbl" border="0">';
	if (nskill > 1)
	{
		s += '<tr>'
			+ '<td class="actpage_option_text">'
				+ 'Each skill is to be assessed separately.'
			+ '</td>'
			+ '<td width="10">'
			+ 	'<div class="toggle_sep_skills toggle-light"></div>'
			+ '</td>'
		+ '</tr>';
	}

	//var nquestion = asst.items.length;
	//if (nquestion > 1)
	if (asst.method != 'prt'){
		s += '<tr>'
				+ '<td class="actpage_option_text">'
				+ 	'Each question is to be assessed separately.'
				+ '</td>'
				+ '<td width="10">'
					+ '<div class="toggle_sep_questions toggle-light"></div>'
				+ '</td>'
			+ '</tr>'
	}

	s += '</table>';

	return s;
}

/////////////////////////////////////////////////////////////////////////////////////

function getRubricTbl(asst, role, uass, editable){
	var name = asst.method == 'prt' ? '' : 'Skills';
	var s = '<table class="tbl_5star_marking">'
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
	for (var row_name in asst.skills){
		s += getRubricRow(asst.skills, row_name, uass, editable);
	}

	// OVERALL
	s += getRubricRow(asst.skills, 'Overall', uass, editable);

	// ADD MARKING COMMENTS
	var comments = ''; //'Good job!';
	if (role != 'edit'){
		s += '<tr>'
				+ '<td class="head4">Comments</td>'
				+ '<td colspan="5">'
					+ '<div class="asspage_open_comments"' + (editable ? ' contenteditable="true"' : '') + '>' + comments + '</div>'
				+ '</td>'
			+ '</tr>'
		;
	} else {
		s += '<tr><td class="head3" style="height:1px; border-bottom-left-radius:8px"></td><td style="height:1px;"></td></tr>';
	}
	s	+= '</table>';

	return s;
}

//////////////////////////////////////////////////////////////////////////////////////

function getRubricRow(rows, row_name, uass, editable){
	var
		row = rows[row_name]
		urow = uass && uass.rows && uass.rows[row_name] ? uass.rows[row_name] : ''
	;
	s = '<tr overall_skill="' + (row_name == 'Overall' ? 1 : 0) + '">'
			+ '<td class="head3"><div class="row_name">' + row_name + '</div>'

	if (editable){
		s += '<div class="toggle_enabled_row toggle-light"></div>';
	}

	s	+= '</td>';
	;


	// for the 5 cells
	var likert = 5;
	var choice = urow && typeof(urow.choice) != 'undefined' ? urow.choice : -1;
	//var choice = Math.floor(Math.random() * likert);	// testing only
	for (var i = 0; i < likert; i++){
		var selected = i == choice ? ' selected' : '';
		var cell_text = row && row.cells && row.cells[i] ? row.cells[i] : '';
		s += '<td class="cell' + selected + '" ' + (editable ? 'contenteditable="true"' : '') + '>' + cell_text
		+ '</td>';
	}
	s += '<td class="last">&nbsp;</td>'
		+ '</tr>'
	;
	return s;
}

////////////////////////////////////////////////////////////////////////

function getEditAsstRubric(asst){
	//console.log('getAsstRubric', asst);
	var s = '', overall = 0;
	if (asst.method == 'prt'){
		overall = 1;
	} else {
		for (var i = 0; i < asst.items.length; i++){
			var item = asst.items[i];
			if (item){
				s +=
					'<div class="rubrics_item" item_id="' + (i + 1) + '" overall_ques="0">'
					+ '<div class="rubric_question">Q.' + (i+1) + '. ' + item.question + '</div>'
					+ getRubricTbl(asst, 'edit', '', 1)
					+ '</div>'
				;
			}
		}
	}
	s += '<div class="rubrics_item" item_id="0" overall_ques="1" style="display:' + (overall?'block':'none') +  '">'
		+ '<div class="rubric_question">Overall</div>'
		+ getRubricTbl(asst, 'edit', '', 1)
		+ '</div>'
	;
	return s;
}


/////////////////////////////////////////////////////////////////////////////////////////////////
var g_default_cells = [
	'Poor',
	'Fair',
	'Average',
	'Good',
	'Excellent',	
];

function refreshEditActRubrics(act){
	console.log('refreshEditActRubrics', act);

	var s = '';

	// LOAD FROM INTERFACE
	//var act = getEditActivity();

	// LOAD FROM DATABASE
	//var act = g_saved_activity;

	// FOR EACH ASST
	var assts = act.assessment.assessments;
	for (var a = 0; a < assts.length; a++){
		var asst = assts[a];

		// loading default rubrics
		if (!asst.rubrics || !obj_count(asst.rubrics)){
			asst.rubrics = {
				sep_skills: 1,
				sep_questions: 1,
				items: [],
			};
			for (var i = 0; i < asst.items.length; i++){
				//var item = asst.items[i];

				var item2 = {
					item_id: i + 1,
					rows: []
				};
				var rows2 = jsonclone(asst.skills);
				rows2['Overall'] = {
					act_asst_scores: {},
				};
				
				// add row
				for (var skill_name in rows2){
					var row = {
						row_name: 	skill_name,
						cells: 		g_default_cells,
						enabled: 1,
					}
					item2.rows.push(row);
				}
				// add item
				asst.rubrics.items.push(item2);

			}
			console.info('*', asst.rubrics);
		}

		//console.info(asst.ass_id, asst.title);
		s +=
			'<div class="div_editact_asst" ass_id="' + asst.ass_id + '">'
				+ '<div class="div_editact_title">Asst#' + asst.ass_id + '. ' + getAssessmentName(asst) + '</div>'
				+ getMarkingOptions(asst)
				+ getEditAsstRubric(asst)
			+ '</div>'
		;

		if (i < assts.length - 1){
			s += '<hr class="editact_asst_separator"/>';
		}
	}

	//console.log(s);
	var jdiv = $('#div_editact_rubrics');
	jdiv.html(s);

	jdiv.find('.toggle_sep_skills').toggles(
		g_toggles_yesno
	).on('toggle', function(e, active) {
		var ass_id = $(this).closest('.div_editact_asst').attr('ass_id');
		//console.info(ass_id, 'gs', active);
		$('.div_editact_asst[ass_id=' + ass_id + '] .tbl_5star_marking tr[overall_skill=0]').css('display', active?'table-row':'none');
		//$('.div_editact_asst[ass_id=' + ass_id + '] .tbl_5star_marking tr[overall_skill=0]').css('display', active?'table-row':'none');
	});

	jdiv.find('.toggle_sep_questions').toggles(
		g_toggles_yesno
	).on('toggle', function(e, active) {
		var ass_id = $(this).closest('.div_editact_asst').attr('ass_id');
		//console.info(ass_id, 'question', active);
		$('.div_editact_asst[ass_id=' + ass_id + '] div[overall_ques=0]').css('display', active?'block':'none');
		$('.div_editact_asst[ass_id=' + ass_id + '] div[overall_ques=1]').css('display', !active?'block':'none');
	});

	jdiv.find('.toggle_enabled_row').toggles(
		g_toggles_enable
	).on('toggle', function(e, active) {
		// handle the status
		var jtr = $(this).closest('tr');
		//console.info(jtr);
		jtr.find('.cell')
			.css({color:active?'':'#c0c0c0'})
			.prop('contenteditable', active?true:false)

	});

	// for each asst, load values
	for (var a = 0; a < assts.length; a++){
		var
			asst = assts[a],
			jasst = jdiv.find('[ass_id=' + asst.ass_id + ']'),
			rubrics = asst.rubrics
		;
		//console.log('asst', asst.ass_id, asst);

		// loading options
		var
			jt1 = jasst.find('.toggle_sep_skills'),
			jt2 = jasst.find('.toggle_sep_questions')
		;
		if (!asst || !asst.rubrics || !jt1.length || !jt2.length){
			//debugger;
		} else {
			console.info('seq', rubrics.sep_skills, rubrics.sep_questions);
			jt1.data('toggles').toggle(rubrics.sep_skills?true:false);
			jt2.data('toggles').toggle(rubrics.sep_questions?true:false);
		}		

		// loading items
		//if (!rubrics.items){
		//	console.log(asst.rubrics);
		//	console.log(asst);
		//	console.log(assts);
		//	console.log(act);
		//	debugger;
		//}
		for (var i = 0; i < rubrics.items.length; i++){
			var item = rubrics.items[i];
			var jitem = jasst.find('.rubrics_item').eq(i);
			//console.log('item', i, item);

			// loading rows
			for (var r = 0; r < item.rows.length; r++){
				//console.log('row', r);
				var row = item.rows[r];
				var jrow = jitem.find('[overall_skill]').eq(r);

				//console.info(row, row.enabled);

				jrow.find('.toggle_enabled_row').data('toggles').toggle(
					row.enabled ? true : false
				);

				// loading cells
				for (var c = 0; c < row.cells.length; c++){
					var cell = row.cells[c];
					var jcell = jrow.find('.cell').eq(c);
					//console.log('cell', c, cell);
					jcell
						.text(cell)
						.prop('contenteditable', row.enabled == 1 ? true : false)
						.css('color', row.enabled == 1 ? 'blue' : '#c0c0c0')
					;
				}
			}
		}

	}

}

///////////////////////////////////////////////////////////////////////////////////

function getEditRubricsData(jdiv, debug){

	// options
	var
		t1 = jdiv.find('.toggle_sep_skills'),
		t2 = jdiv.find('.toggle_sep_questions')
	;
	var sep_skills = t1.length && t1.data('toggles').active ? 1 : 0;
	var sep_questions = t2.length && t2.data('toggles').active ? 1 : 0;
	var rubrics = {
		sep_skills: sep_skills,
		sep_questions: sep_questions,
		items: [],
	};

	jdiv.find('.rubrics_item').each(function(){
		var
		 	jdiv = $(this),
			item_id = parseInt(jdiv.attr('item_id')),
			jtbl = jdiv.find('.tbl_5star_marking')
		;
		var rows = [];
		jtbl.find('[overall_skill]').each(function(){
			var
				jtr = $(this),
				row_name = jtr.find('.row_name').text().trim(),
				jtds = jtr.find('.cell')
			;
			if (row_name){
				//console.info(row_name);
				var row = {
					row_name: row_name,
					cells: [],
				};
				var jtoggle = jtr.find('.toggle_enabled_row');
				if (jtoggle.length){
					// case 1: toggle
					row.enabled = jtoggle.data('toggles').active ? 1 : 0;
				} else {
					// case 2: slider?
				}
				for (var i = 0; i < jtds.length; i++){
					//console.log(i, jtds.eq(i + 1).text());
					row.cells[i] = jtds.eq(i).text();
				}
				rows.push(row);
			}
		});
		rubrics.items.push({
			item_id: item_id,
			rows: rows,
		});
	});
	//if (debug){
	//	console.info(rubrics);
	//}
	return rubrics;
}

///////////////////////////////////////////////////////

function clearEditRubrics(){
	console.info('clearEditRubrics')
	var act = g_saved_activity;
	// FOR EACH ASST
	if (g_saved_activity && g_saved_activity.assessment.assessments){
		var assts = act.assessment.assessments;
		for (var i = 0; i < assts.length; i++){
			var asst = assts[i];
			asst.rubrics = 0;
		}	
		refreshEditActRubrics(act);
	}
}