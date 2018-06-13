
function getEditItem_ref(jtbl, dt, item_id, item){
	var question = '', min = '', max = '';
	if (item){
		question = item.question ? item.question : ''; //item[0];
		min = item.min ? item.min : '';
		max = item.max ? item.max : '';
	}	
	var s = 
				'<div class="div_edit_item">'
				+ '<table width="100%">'
					+ '<tr>'
						+ '<td><b>Question:</b></td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ '<div class="editable_parent">'
								+ '<div data-name="editable_question" data-mode="inline" data-type="wysihtml5" data-title="Enter the question" data-emptytext="(+Question)" data-showbuttons="bottom" data-placement="bottom" data-inputclass="input_wysihtml5" class="editable_assessment_title editable" show_trash="0" data-url="" >' + question + '</div>'
							+ '</div>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ '<b>Word limit:</b>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td style="padding-left:10px">'
							+ '<div class="editable_parent">'
								+ '<div data-name="editable_limit" data-mode="inline" data-type="limit" data-title="Word Limit" data-emptytext="N/A" data-showbuttons="bottom" data-placement="top" data-inputclass="editable_normal" class="editable_normal editable" show_trash="0" data-url="" data-min="' + min + '" data-max="' + max + '"></div>'
							+ '</div>'
						+ '</td>'
					+ '</tr>'
				+ '</table>'
			+ '</div>'
	;
	return s;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_ref(jtr){
	var question = jtr.find('[data-name=editable_question]').editable('getValue', true);	// isSingle Bool whether to return just value of single element
	var limit = jtr.find('[data-name=editable_limit]').editable('getValue', true);
	return {
		question: question,
		min: limit.min,
		max: limit.max,
	};
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getQuestion_ref(assessment, act_item){
	console.info('getQuestion_ref', act_item.question);
	var q = act_item.question;
	if (act_item.min && act_item.max){
		q += ' (' + act_item.min + ' - ' + act_item.max + ' words, ' + act_item.weight + '%)';
	} else if (act_item.min){
		q += ' (minimum ' + act_item.min + ' words, ' + act_item.weight + '%)';
	} else if (act_item.max){
		q += ' (maximum ' + act_item.max + ' words, ' + act_item.weight + '%)';
	} else {
		q += ' (' + act_item.weight + '%)';
	}
	return '<span class="asspage_question" data-min="' + act_item.min + '" data-max="' + act_item.max + '">' + q + '</span>';
}

//////////////////////////////////////////////////////////////////////////

function getAnswer_ref(opts, item_id, act_item, uass, uass_item, role, stage){
	var answer = uass_item && uass_item.answer ? uass_item.answer : '';
	return '<div data-item-id="' + item_id + '" class="asspage_open_answer" data-placement="bottom"' + (opts.bEditAnswer?' contenteditable="true"':'') + '>' + answer + '</div>';
}
