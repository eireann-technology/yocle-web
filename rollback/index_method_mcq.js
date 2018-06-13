//////////////////////////////////////////////////////////////////////////
// edit
//////////////////////////////////////////////////////////////////////////
function getEditItem_mcq(jtbl, dt, item_id, item){
	
	var question = '', choices = [], correct = 'A';
	if (item){
		question = item.question ? item.question : '';
		choices = item.choices ? item.choices : [];
		correct = item.correct ? item.correct : 'A';
	}
		
	var s =
		'<div class="div_edit_item">'
		+ '<div class="editable_parent" style="margin-right:10px;">'
			+ '<div data-name="mcq_question" data-mode="inline" data-type="wysihtml5" data-title="Enter the question" data-emptytext="(+Question)" data-showbuttons="bottom" data-placement="bottom" show_trash="0" data-inputclass="editable_mcq_question" class="editable" data-value="' + question + '" data-url="" style="padding:6px"></div>'
		+ '</div>'
		
		+	'<table class="tbl_choices_mcq" cellspacing="0" cellpadding="0">'
	;
	
	for (var i = 1; i <= 5; i++){
			var id = 'radio_' + item_id + '_' + i,
					group_name = 'mcq_question_' + item_id,
					choice = choices[i-1] ? choices[i-1] : '',
					letter = String.fromCharCode(64 + i),
					rightanswer = letter == correct
			;
			//console.debug(i, correct, letter, rightanswer);
			s += '<tr>'
					+ '<td style="width:1px">'
					 + letter
					+ '.</td>'
					//+ '<td class="td_mcq_answer" style="font-weight:' + (rightanswer?'bold':'') + '">'
					+ '<td class="td_mcq_answer">'
						+ '<span data-name="mcq_answer" data-mode="inline" data-type="textarea" data-title="Enter the answer" data-emptytext="(+Answer)" data-showbuttons="bottom" data-placement="bottom" show_trash="0" data-inputclass="editable_mcq_answer" class="editable" data-value="' + choice + '" data-url=""></span>'
					+ '</td>'
					+ '<td style="width:1px; padding-top:4px">'
						+ '<input type="radio" name="' + group_name + '" id="' + id + '" value="' + letter + '" style="width:20px; "' + (rightanswer?' checked':'') + ' />'
					+ '</td>'
					+ '<td style="width:1px; padding-top:4px; visibility:' + (rightanswer?'visible':'hidden') + '">'
						+ '<label for="' + id + '"><span class="arrow_box"><span>Correct</span></span></label>'
					+ '</td>'
				+ '</tr>'
			;
	}
	s	+= '</table>'
		//+ '</div>'
	
	return s;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_mcq(jtr){
	var question = jtr.find('[data-name=mcq_question]').editable('getValue', true),
		choices = []
	;
	jtr.find('[data-name=mcq_answer]').each(function(){
		var answer = $(this).editable('getValue', true);
		choices.push(answer);
	});
	var correct = jtr.find("input[type=radio]:checked").val();
	
	return {
		question: question,
		choices: choices,
		correct: correct,
	};
}

//////////////////////////////////////////////////////////////////////////
// view
//////////////////////////////////////////////////////////////////////////

function getQuestion_mcq(assessment, act_item){
	console.info('getQuestion_mcq', act_item.question);
	var q = act_item.question + ' (' + act_item.weight + '%)';
	return '<span class="asspage_question">' + q + '</span>';
}

//////////////////////////////////////////////////////////////////////////

function getAnswer_mcq(opts, item_id, act_item, uass, uass_item, role, stage){
	//return '<div data-item-id="' + item_id + '" class="asspage_open_answer"' + (perform_editable?' contenteditable="true"':'') + '>' + answer + '</div>';
	
	console.info('getAnswer_mcq', item_id, uass_item); //act_item, uass_item, perform_editable);
	
	var
		s = '<table class="tbl_mcq_answer">',
		choices = act_item.choices,
		correct = act_item.correct,
		answer = uass_item.answer
	;
	// time period: before, opening, closed

	//
	// 1. answer not preview
	// 2. answer preview
	// 3. answer input (with saved input)
	// 4. answer review
	// 5. answer with marking
	// 
	//var bDisabled = role != 'participant' || stage < TIMESTAGE_OPENING || uass.marked || uass.performed;
	//var bShowAnswer = uass.saved||uass.performed||uass.marked;
	
	for (var j = 0; j < choices.length; j++){
		var
			letter = String.fromCharCode(65 + j),
			choice = choices[j]
		;
		// with or without choice
		if (choice){
			
			s += '<tr>'
				+ '<td class="asspage_mcq_choice">'
					+ '<input type="radio" name="q' + item_id + '" value="' + letter + '" ' + (opts.bEditAnswer?'':'disabled') + ' ' + (letter == answer?'checked':'') + '/>'
				+ '</td>'
				+ '<td>'
					+ letter + '. ' + choice
				+ '</td>';

			// correct answer
			if ((opts.bViewMarking || opts.bEditMarking) && answer != ''){
				if (letter == answer){
					// already performed
					if (letter == correct){
						// right answer
						s += '<td><span class="arrow_box"><span>Correct</span></span><span class="glyphicon glyphicon-ok" style="color:red"></span></td>';
					} else {
						// wrong answer
						s += '<td><span class="glyphicon glyphicon-remove" style="color:red"></span></td>';
					}
				} else if (letter == correct){	// but not chosen
					s += '<td><span class="arrow_box"><span>Correct</span></span></td>';
				}
			} else {
				// saved
				s += '<td>&nbsp;</td>';
			}
			s += '</tr>';
		}
	}
	s += '</table>';
	//console.info('getAnswer_mcq2', s);
	return s;
}
