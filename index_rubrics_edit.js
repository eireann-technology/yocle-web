


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
		on: true, // is the toggle ON on init
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
	//if (nskill > 1)
	//{
		s += '<tr>'
			+ '<td class="actpage_option_text">'
				+ 'Each skill is to be assessed separately.'
			+ '</td>'
			+ '<td width="10">'
			+ 	'<div class="toggle_sep_skills toggle-light"></div>'
			+ '</td>'
		+ '</tr>';
	//}

	//var nquestion = asst.items.length;
	//if (nquestion > 1)
	switch (asst.method){
		case 'prt':
		case 'blg':
		case 'bl2':
			break;
		default:
			s += '<tr>'
					+ '<td class="actpage_option_text">'
					+ 	'Each question is to be assessed separately.'
					+ '</td>'
					+ '<td width="10">'
						+ '<div class="toggle_sep_questions toggle-light"></div>'
					+ '</td>'
				+ '</tr>'
			break;
	}

	s += '</table>';

	return s;
}

/////////////////////////////////////////////////////////////////////////////////////

function getEditRubricTbl(asst){
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

	// ROWS FOR EACH SKILL
	for (var row_name in asst.skills){
		s += getEditRubricRow(asst, row_name);
	}

	// ROW FOR OVERALL
	s += getEditRubricRow(asst, 'Overall');

	// bottom border
	s += '<tr><td class="head3" style="height:1px; border-bottom-left-radius:8px"></td><td style="height:1px;"></td></tr>';

	s	+= '</table>';

	return s;
}

//////////////////////////////////////////////////////////////////////////////////////

function getEditRubricRow(asst, row_name){

	var rubrics = asst.rubrics;
	//console.log('getEditRubricRow', row_name, asst);
	var s = '', row = 0;

	var row = asst.skills[row_name];

	var row_desc = '';//Ability to integrate learning into your own work experiences and analyze issues with a critical attitude';

	s = '<tr class="tr_rubric_skill" sep_skills="' + (row_name == 'Overall' ? 0 : 1) + '">'
			+ '<td class="head3">'

				+ '<div class="row_name">' + row_name + '</div>'
				+ '<div class="row_desc" contenteditable="true" placeholder="Enter description here...">' + row_desc + '</div>'
				+ '<div class="toggle_enabled_row toggle-light"></div>'
			+ '</td>'
	;
	// for the 5 cells
	var likert = 5;
	for (var i = 0; i < likert; i++){
		s += '<td class="cell" contenteditable="true"></td>';
	}
	s += '<td class="last">&nbsp;</td>'	+ '</tr>';
	return s;

}

////////////////////////////////////////////////////////////////////////

function getEditAsstRubric(asst){
	//console.log('getAsstRubric', asst);
	var s = '', overall = 0;
	for (var i = 0; i < asst.items.length; i++){
		var item = asst.items[i];
		if (item){
			var ques = item.question ? item.question : '';
			s +=
				'<div class="rubrics_item" item_id="' + (i + 1) + '" sep_questions="1">'
				+ '<div class="rubric_question">Q.' + (i + 1) + '. ' + ques + '</div>'
				+ getEditRubricTbl(asst, 'edit', '', RUBRICS_EDIT)
				+ '</div>'
			;
		}
	}
	s += '<div class="rubrics_item" item_id="0" sep_questions="0" style="display:' + (overall?'block':'none') +  '">'
		+ '<div class="rubric_question">Overall</div>'
		+ getEditRubricTbl(asst, 'edit', '', RUBRICS_EDIT)
		+ '</div>'
	;
	return s;
}

///////////////////////////////////////////////////////

function clearEditRubrics(){
	console.info('clearEditRubrics');
///*
	var act = g_saved_activity;
	if (act){
		// FOR EACH ASST
		if (act.assessment.assessments){
			var assts = act.assessment.assessments;
			for (var i = 0; i < assts.length; i++){
				var asst = assts[i];
				asst.rubrics = 0;
			}
		}
		//refreshEditActRubrics(act);
		refreshEditActRubrics(act.assessment.assessments);
	}
//*/

}

/////////////////////////////////////////////////////////////////////////////////////////////////

var g_default_cells = [
	'Poor',
	'Fair',
	'Average',
	'Good',
	'Excellent',
];

function refreshEditActRubrics(assts){
	console.log('refreshEditActRubrics', assts);

	var debug = 0;

	//var assts = act.assessment.assessments;
	var s = '';

	////////////////////////////////////////////////////
	// DRAW THE EMPTY FRAMESET
	////////////////////////////////////////////////////
	for (var a = 0; a < assts.length; a++){
		var
			asst = assts[a],
			method = asst.method
		;

		// loading default rubrics
		if (!asst.rubrics || !obj_count(asst.rubrics)){
			setDefaultRubrics(asst);
		}
		s +=
			'<div class="div_editact_asst_rubrics" ass_id="' + asst.ass_id + '">'
				+ '<div class="div_editact_title">Asst#' + asst.ass_id + '. ' + getAssTitle(asst) + '</div>'
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

	// update row_desc
	for (var a = 0; a < assts.length; a++){
		var
			asst = assts[a];
			ass_id = asst.ass_id,
			rubrics = asst.rubrics
		;
		for (var i = 0; i < rubrics.items.length; i++){
			var
				item = rubrics.items[i],
				item_id = item.item_id
			;
			for (var r = 0; r < item.rows.length; r++){
				var
					row = item.rows[r],
					row_desc = row.row_desc
				;
				//console.log(row, row.row_desc);
				var selector = '.div_editact_asst_rubrics[ass_id=' + ass_id + '] .rubrics_item[item_id=' + item_id + '] .tr_rubric_skill';
				var jdesc = jdiv.find(selector).eq(r).find('.row_desc');
				jdesc.html(row_desc);
			}
		}
	}

	////////////////////////////////////////////////////
	// SET TOGGLES AND EVENTS
	////////////////////////////////////////////////////
	jdiv.find('.toggle_sep_skills').toggles(
		g_toggles_yesno
	).on('toggle', function(e, active) {
		var ass_id = $(this).closest('.div_editact_asst_rubrics').attr('ass_id');
		showSepSkills(ass_id, active);
	});

	jdiv.find('.toggle_sep_questions').toggles(
		g_toggles_yesno
	).on('toggle', function(e, active) {
		var ass_id = $(this).closest('.div_editact_asst_rubrics').attr('ass_id');
		showSepQuestions(ass_id, active);
	});

	jdiv.find('.toggle_enabled_row').toggles(
		g_toggles_enable
	).on('toggle', function(e, active) {
		// handle the status
		var jtr = $(this).closest('tr');
		jtr.find('.cell')
			.css({color:active?'':'#c0c0c0'})
			.prop('contenteditable', active?true:false)

	});

	////////////////////////////////////////////////////
	// SET TOGGLES CONTENTS
	////////////////////////////////////////////////////
	// for each asst, load values
	for (var a = 0; a < assts.length; a++){
		var
			asst = assts[a],
			method = asst.method,
			ass_id = asst.ass_id,
			jasst = jdiv.find('.div_editact_asst_rubrics[ass_id=' + ass_id + ']'),
			rubrics = asst.rubrics,
			sep_skills = rubrics.sep_skills,
			sep_questions = rubrics.sep_questions
		;
		if (debug){
			console.log('\r\nSETTTING RUBRICS...ass_id=' + ass_id);
		}

		// SET OPTIONS
		var
			jt1 = jasst.find('.toggle_sep_skills'),
			jt2 = jasst.find('.toggle_sep_questions')
		;
		if (asst && asst.rubrics){
			if (jt1.length)
				jt1.data('toggles').toggle(sep_skills ? true : false);
			if (jt2.length)
				jt2.data('toggles').toggle(sep_questions ? true : false);
		}
		//////////////////////////////////////////////////////
		// HIDE/SHOW SKILLS QUESTIONS
		//////////////////////////////////////////////////////
		showSepSkills(ass_id, sep_skills);
		showSepQuestions(ass_id, sep_questions);

		if (method == 'mcq'){
			jasst
				.find('*:not(.div_editact_title)')
				.hide()
			;
			jasst
				.find('.div_mcq_msg')
				.remove()
			;
			jasst
				.append('<div class="div_mcq_msg">MCQ has no rubrics</div>')
			;
		}
		//////////////////////////////////////////////////////
		// SET EACH VISIBLE ITEMS
		//////////////////////////////////////////////////////
		for (var i = 0; i < rubrics.items.length; i++){
			var
				item = rubrics.items[i],
				item_id = item.item_id,	// data item_id
				jitem = jasst.find('.rubrics_item[item_id=' + item_id + ']')	// element
			;
			if (debug){
				console.log('item_id=' + item_id, !item_id ? '(overall)':'');
			}

			// SET EACH ROW
			for (var r = 0; r < item.rows.length; r++){
				var row = item.rows[r];
				var jrow = jitem
					//.find('[sep_skills=' + sep_skills + ']')
					.find('[sep_skills]')	//:visible')
					.eq(r)
				;
				if (jrow.length){

					// SET ENABLE/DISABLE
					jrow
						.find('.toggle_enabled_row')
						.data('toggles')
						.toggle(row.enabled ? true : false)
					;
					var row_name = jrow.find('.row_name').text().trim();
					var s = row_name + ' ' + row.enabled + ': ';

					// SET EACH COLUMN TEXT
					for (var col = 0; col < row.cells.length; col++){
						var cell_text = row.cells[col];
						//console.log(cell_text)
						//s += cell_text + ', ';
						var jcell = jrow.find('.cell').eq(col);
						jcell
							.text(cell_text)
							.prop('contenteditable', row.enabled == 1 ? true : false)
							.css('color', row.enabled == 1 ? 'blue' : '#c0c0c0')
						;
					}
					if (debug){
						console.log(row_name, row.enabled, row.cells.join(','));
					}
				}
			}
		}
		//continue;
	}

}

///////////////////////////////////////////////////////////////////////////////////

function getEditRubricsData(ass_id, debug){
	//console.log('getEditRubricsData', ass_id);
	var rubrics = {}

	// options
	var jdiv = $('.div_editact_asst_rubrics[ass_id=' + ass_id + ']');
	if (jdiv.length){
		var
			t1 = jdiv.find('.toggle_sep_skills'),
			t2 = jdiv.find('.toggle_sep_questions')
		;
		var sep_skills = t1.length && t1.data('toggles').active ? 1 : 0;
		var sep_questions = t2.length && t2.data('toggles').active ? 1 : 0;

		// rubrics
		rubrics.sep_skills = sep_skills;
		rubrics.sep_questions = sep_questions;
		rubrics.items = [];
		if (debug){
			console.log('\r\nGETTING RUBRICS...ass_id=' + ass_id,
				'sep_skills=' + sep_skills,
				'sep_questions=' + sep_questions
			);
		}
		jdiv.find('.rubrics_item').each(function(){
			var
			 	jdiv = $(this),
				item_id = parseInt(jdiv.attr('item_id')), //element item_id
				jtbl = jdiv.find('.tbl_5star_marking'),
				rows = []
			;

			if (debug){
				console.log('item_id=' + item_id, !item_id ? '(overall)':'');
			}

			// each row
			var jtrs = jtbl.find('.tr_rubric_skill');
			jtrs.each(function(){
				var
					jtr = $(this),
					row_name = jtr.find('.row_name').text().trim(),
					row_desc = jtr.find('.row_desc').text().trim(),
					jtds = jtr.find('.cell')
				;
				if (row_name != ''){
					var row = {
						row_name: row_name,
						row_desc: row_desc,
						cells: [],
						//sep_skills: sep_skills,
						//sep_questions: sep_questions,
					};
					var jtoggle = jtr.find('.toggle_enabled_row');
					if (jtoggle.length){
						// case 1: toggle
						row.enabled = jtoggle.data('toggles').active ? 1 : 0;
					}
					// each column text
					for (var i = 0; i < jtds.length; i++){
						var text = jtds.eq(i).text();
						row.cells[i] = text;
					}
					if (debug){
						console.log(row_name, row.enabled, row.cells.join(','));
					}
					rows.push(row);
				}
			});
			rubrics.items.push({
				item_id: item_id,
				rows: rows,
			});
		});
		rubrics.items.sort(function(a, b){
			return a.item_id - b.item_id;
		})
	}
	return rubrics;
}

/////////////////////////////////////////////////

function showSepSkills(ass_id, sep_skills){
	var jasst = $('.div_editact_asst_rubrics[ass_id=' + ass_id + ']');
	if (sep_skills){
		jasst.find('[sep_skills=1]').show();
		jasst.find('[sep_skills=0]').show();
	} else {
		jasst.find('[sep_skills=1]').hide();
		jasst.find('[sep_skills=0]').show();
	}
}

/////////////////////////////////////////////////

function showSepQuestions(ass_id, sep_questions){
	var jasst = $('.div_editact_asst_rubrics[ass_id=' + ass_id + ']');
	if (sep_questions){
		jasst.find('[sep_questions=1]').show();
		jasst.find('[sep_questions=0]').hide();
	} else {
		jasst.find('[sep_questions=0]').show();
		jasst.find('[sep_questions=1]').hide();
	}
}

/////////////////////////////////////////////////

function updateRubrics(){
	console.log('updateRubrics');
	for (var i = 0; i < g_assessments.length; i++){
		var ass_id = i + 1;
		g_assessments[i].rubrics = getEditRubricsData(ass_id);
	}
}

/////////////////////////////////////////////////

function setDefaultRubrics(asst){
	asst.rubrics = {
		sep_skills: 0,
		sep_questions: 0,
		items: [],
	};
	for (var i = 0; i <= asst.items.length; i++){
		var item2 = {
			item_id: i < asst.items.length ? i + 1 : 0,	// o = overall
			rows: [],
		};
		var rows2 = jsonclone(asst.skills);
		rows2['Overall'] = {
			act_asst_scores: {},
		};
		// ADD ROWS
		for (var skill_name in rows2){
			var row = {
				row_name: 	skill_name,
				cells: 		g_default_cells,
				enabled: 1,
			}
			item2.rows.push(row);
		}
		asst.rubrics.items.push(item2);
	}
	//console.info('*', asst.rubrics);
	return asst.rubrics;
}
