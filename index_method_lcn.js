
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItem_lcn(jtbl, dt, item_id, item){
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
			+'</div>'
	;
	return s;
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_lcn(jtr){
	//var question = jtr.find('[data-name=editable_question]').editable('getValue', true);	// isSingle Bool whether to return just value of single element
	var question = get_tiny_contents2(jtr);
	var limit = jtr.find('[data-name=editable_limit]').editable('getValue', true);
	return {
		question: question,
		min: limit.min,
		max: limit.max,
	};
}

//////////////////////////////////////////////////////////////////////////

function getQuestion_lcn(assessment, act_item){
	return getQuestion_general(assessment, act_item);
}

//////////////////////////////////////////////////////////////////////////


function getAnswer_lcn(opts, item_id, act_item, uass, uass_item, role, stage){
	var answer = uass_item && uass_item.answer ? uass_item.answer : '';
	return '<div data-item-id="' + item_id + '" class="asspage_open_answer"' + (opts.bEditAnswer?' contenteditable="true"':'') + '>' + answer + '</div>';
}
