var sur_arr = [
	['Yes', 'No'],
	['Agree', 'Disagree'],
	['1', '2', '3'],
	['1', '2', '3', '4', '5'],
	['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
	['Always', 'Often', 'Sometimes', 'Occasionally', 'Rarely', 'Never'],
	[],	// open comments
];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItem_sur(jtbl, dt, item_id, item){
	var weight = 0, question = '', min = '', max = '';
	if (item){
		question = item.question ? item.question : ''; //item[0];
		sur_type = item.sur_type ? parseInt(item.sur_type) : 0;
	}
	var s =
			'<div class="div_edit_item">'
				+ '<table width="100%">'
					+ '<tr>'
						//+ '<td><b>Question:</b></td>'
						+ '<td>'
							+ '<table width="100%">'
								+ '<tr>'
									+ '<td><b>Question:</b></td>'
									+ '<td width="80"><button id="but_tinymce_assitem_' + item_id + '" class="btn btn-primary but_edititem">Edit</button></td>'
								+ '</tr>'
							+ '</table>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ '<div class="editable_parent">'
								//+ '<div data-name="editable_question" data-mode="inline" data-type="wysihtml5" data-title="Enter the question" data-emptytext="(+Question)" data-showbuttons="bottom" data-placement="bottom" data-inputclass="input_wysihtml5" class="editable_assessment_title editable" show_trash="0" data-url="" >' + question + '</div>'
								+ '<div id="div_tinymce_assitem_' + item_id + '"></div>'
							+ '</div>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ '<b>Survey type:</b>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ getSurType(sur_type)
						+ '</td>'
					+ '</tr>'
				+ '</table>'
			+ '</div>'
	;
	return s;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getSurType(value){
	return '<select class="sel_surtype">'
					+ '<option value="0"' + getSurType2(0,value) + '>Yes / no</option>'
					+ '<option value="1"' + getSurType2(1,value) + '>Agreed / disagreed</option>'
					+ '<option value="2"' + getSurType2(2,value) + '>1,2,3</option>'
					+ '<option value="3"' + getSurType2(3,value) + '>1,2,3,4,5</option>'
					+ '<option value="4"' + getSurType2(4,value) + '>Strongly agree / disagree</option>'
					+ '<option value="5"' + getSurType2(5,value) + '>Frequency</option>'
					+ '<option value="6"' + getSurType2(6,value) + '>Open comments</option>'
				+ '</select>'
;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getSurType2(a, b){
	return a == b ? ' selected' : '';
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_sur(jtr){
	//var question = jtr.find('.editable_assessment_title').editable('getValue', true);	// eq begins with 0
	var question = get_tiny_contents2(jtr);
	var sur_type = parseInt(jtr.find('.sel_surtype').val());
	return {
		question: question,
		sur_type: sur_type,
	};
}
//////////////////////////////////////////////////////////////////////////

function getQuestion_sur(assessment, act_item){
	return getQuestion_general(assessment, act_item);
	//console.info('getQuestion_ref', act_item.question);
	//var q = act_item.question;
	//return '<span class="asspage_question">' + q + '</span>';
}

//////////////////////////////////////////////////////////////////////////

function getAnswer_sur(opts, item_id, act_item, uass, uass_item, role, stage){

	//console.info('getAnswer_sur', opts, item_id, act_item, uass, uass_item, role, stage);

	var answer = uass_item && uass_item.answer ? uass_item.answer : '';

	var s = '';

	if (opts.bEditAnswer || opts.bViewAnswer){
		// show survey options
		var sur_type = act_item.sur_type?act_item.sur_type:0;
		var options = sur_arr[sur_type];
		if (options.length){
			// construct select
			if (opts.bEditAnswer){
				s += '<select>';
			} else {
				s += '<select disabled>';
			}
			for (var i = 0; i < options.length; i++){
				s += '<option value="' + i + '"' + (answer==i?' selected':'') + '>' + options[i];
			}
			s += '</select>';

		} else {

			// construct open answer
			if (opts.bEditAnswer){
				s += '<div class="asspage_open_answer" data-placement="bottom" contenteditable="true">' + answer + '</div>';
			} else {
				s += '<div class="asspage_open_answer">' + answer + '</div>';

			}
		}

	}

	return s;
}
