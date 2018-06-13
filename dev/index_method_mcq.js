//////////////////////////////////////////////////////////////////////////
// edit
//////////////////////////////////////////////////////////////////////////
function getEditItem_mcq(jtbl, dt, item_id, item){

	var
		question = '',
		choices = [],
		corrects = ''
	;
	if (item){
		question = item.question ? item.question : '';
		choices = item.choices ? item.choices : [];
		corrects = item.correct ? item.correct : '';
	}

	var s =
		'<table class="tbl_choices_mcq" cellspacing="0" cellpadding="0">'
		+ '<tr>'
			+ '<td colspan="3">'
				+ '<table width="100%">'
					+ '<tr>'
						+ '<td><b>Question:</b></td>'
						+ '<td width="1"><button id="but_tinymce_assitem_' + item_id + '" class="btn btn-primary but_edititem">Edit</button></td>'
					+ '</tr>'
				+ '</table>'
			+ '</td>'
			+ '<tr>'
				+ '<td colspan="3" class="editable_parent">'
							//+ '<div data-name="editable_question" data-mode="inline" data-type="wysihtml5" data-title="Enter the question" data-emptytext="(+Question)" data-showbuttons="bottom" data-placement="bottom" data-inputclass="input_wysihtml5" class="editable_assessment_title editable" show_trash="0" data-url="" >' + question + '</div>'
							+ '<div id="div_tinymce_assitem_' + item_id + '"></div>'
				+ '</td>'
			+ '</tr>'
			+ '<tr>'
				+ '<td colspan="2">&nbsp;'
				+ '</td>'
				+ '<td class="td_chkbox" style="width:10px; height:40px; vertical-align:middle;padding:4px;">Correct</td>'
			+ '</tr>'
	;
	for (var i = 1; i <= 5; i++){
			var id = 'radio_' + item_id + '_' + i,
					group_name = 'mcq_question_' + item_id,
					choice = choices[i - 1] ? choices[i - 1] : '',
					letter = String.fromCharCode(64 + i),
					bThisAnswer = corrects.indexOf(letter) >= 0
			;
			//console.debug(i, correct, letter, rightanswer);
			s += '<tr>'
					+ '<td style="width:1px">'
					 + letter
					+ '.</td>'
					+ '<td class="td_mcq_answer">'
						+ '<span data-name="mcq_answer" data-mode="inline" data-type="textarea" data-title="Enter the answer" data-emptytext="(+Answer)" data-showbuttons="bottom" data-placement="bottom" show_trash="0" data-inputclass="editable_mcq_answer" class="editable" data-value="' + choice + '" data-url=""></span>'
					+ '</td>'
					+ '<td class="td_chkbox">'
						+ '<input type="checkbox" name="' + group_name + '" id="' + id + '" value="' + letter + '" style="width:20px; "' + (bThisAnswer?' checked':'') + ' />'
					+ '</td>'
				+ '</tr>'
			;
	}
	s	+= '</table>'

	return s;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_mcq(jtr){
	var
		question = get_tiny_contents2(jtr),
		choices = []
	;
	jtr.find('[data-name=mcq_answer]').each(function(){
		var answer = $(this).editable('getValue', true);
		choices.push(answer);
	});
	var corrects = [];
	jtr.find("input[type=checkbox]:checked").each(function(){
		corrects.push($(this).attr('value'));
	});
	var correct = corrects.join(',');

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
	return getQuestion_general(assessment, act_item);

	//console.info('getQuestion_mcq', act_item.question);
	//var q = act_item.question + ' (' + act_item.weight + '%)';
	//return '<span class="asspage_question">' + q + '</span>';
}

//////////////////////////////////////////////////////////////////////////
var
	//g_mcq_corrects = [],
	g_mcq_marks = 0,

	g_assr_item_marks_hash = {},
	g_assr_asst_marks = 0
;

function getAnswer_mcq(opts, item_id, act_item, uass, uass_item, role, stage){
	//return '<div data-item-id="' + item_id + '" class="asspage_open_answer"' + (perform_editable?' contenteditable="true"':'') + '>' + answer + '</div>';
	var s = '';

	var bAllCorrect = true;
	if (act_item.choices && act_item.correct){
		console.info('getAnswer_mcq', item_id, uass_item);
		var
			choices = act_item.choices,
			corrects = act_item.correct.split(','),
			answers = uass_item.answer ? uass_item.answer.split(',') : 0
		;
		s = '<table class="tbl_mcq_answer">';

		// time period: before, opening, closed
		//
		// 1. answer not preview
		// 2. answer preview
		// 3. answer input (with saved input)
		// 4. answer review
		// 5. answer with marking
		//

		for (var j = 0; j < choices.length; j++){
			var
				letter = String.fromCharCode(65 + j),
				choice = choices[j]
			;
			// with or without choice
			if (choice){

				var
					bThisAnswer = false,
					bThisCorrect = false
				;
				for (var n in answers){
					var answer = answers[n];
					if (answer == letter){
						bThisAnswer = true;
						break;
					}
				}

				for (var n in corrects){
					var correct = corrects[n];
					if (correct == letter){
						bThisCorrect = true;
						break;
					}
				}

				if (
					(bThisAnswer && !bThisCorrect)
				||
					(!bThisAnswer && bThisCorrect)
				){
					bAllCorrect = false;
				}

				s += '<tr>'
					+ '<td class="asspage_mcq_choice">'
				;

				if (corrects.length == 1){
					s += '<input type="radio" name="q' + item_id + '" value="' + letter + '" ' + (opts.bEditAnswer?'':'disabled') + ' ';
				} else {
					s += '<input type="checkbox" name="q' + item_id + '" value="' + letter + '" ' + (opts.bEditAnswer?'':'disabled') + ' ';
				}

				if (bThisAnswer){
					s += 'checked';
				}

				s += '/>'
					+ '</td>'
					+ '<td>'
						+ letter + '. ' + choice
					+ '</td>'
				;

				// correct answer
				if ((opts.bViewMarking || opts.bEditMarking) && answer != ''){
					if (bThisAnswer && bThisCorrect){
						// correct answer
						s += '<td><span class="arrow_box"><span>Correct</span></span><span class="glyphicon glyphicon-ok" style="color:red"></span></td>';
					} else if (bThisAnswer && !bThisCorrect){
						// incorrect answer
						s += '<td><span class="glyphicon glyphicon-remove" style="color:red"></span></td>';
					} else if (!bThisAnswer && bThisCorrect){
						// correct but not answer
						s += '<td><span class="arrow_box"><span>Correct</span></span></td>';
					} else {
						// saved
						s += '<td>&nbsp;</td>';
					}
				}
				s += '</tr>';
			}
		}

		if (opts.bViewMarking || opts.bEditMarking){
			s += '<tr><td colspan="99"><img style="max-width:100%" src="./images/' + (bAllCorrect ? '' : 'in') + 'correct.png"/></td></tr>';
		}
		s += '</table>';
	}
	var assr_item_marks = g_assr_item_marks_hash[item_id] = bAllCorrect ? 5 : 0;
	if (assr_item_marks && !isNaN(assr_item_marks)){
		var item_marks = assr_item_marks * (act_item.weight / 100);
		g_assr_asst_marks += item_marks;
	}
	//console.info('getAnswer_mcq2', s);
	return s;
}

////////////////////////////////////////////////////////////////////////////////////
/*
function getMcqMarks(asst){
	// calculation of mcq marks
	var av_marks = 0;
	for (var i = 0; i < asst.items.length; i++){
		var
			item = asst.items[i],
			item_id = parseInt(i) + 1
		;
		if (g_mcq_corrects[item_id]){
			var ratio = (parseInt(item.weight) / 100);
			av_marks += 5 * ratio;
			console.log(item_id, item.weight, ratio, av_marks);
		}
	}
	g_mcq_marks = av_marks;
	return av_marks;
}
*/
