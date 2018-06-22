//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EDIT METHOD

function getEditItem_abs(jtbl, dt, item_id, item){
	var question = '', min = '', max = '', attachments;
	if (item){
		question = item.question ? item.question : ''; //item[0];
		min = item.min ? item.min : '';
		max = item.max ? item.max : '';
		attachments = item.attachments ? item.attachments : 0;
	}
	var s =
				'<div class="div_edit_item">'
				+ '<table width="100%">'
					+ '<tr>'
						+ '<td>'
							+ '<table width="100%">'
								+ '<tr>'
									+ '<td><b>Question:</b></td>'
									+ '<td width="80"><button id="but_tinymce_assitem_' + item_id + '" class="btn btn-primary but_edititem">Edit</button></td>'
								+ '</tr>'
							+ '</table>'
						+ '<td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td>'
							+ '<div class="editable_parent">'
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
					+ '<tr>'
						+ '<td>'
							+ '<input type="checkbox" ' + (attachments?' checked':'') + '/> Attach material'
						+ '</td>'
					+ '</tr>'

				+ '</table>'
			+'</div>'
	;
	return s;
}
///////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_abs(jtr){
	//var question = jtr.find('[data-name=editable_question]').editable('getValue', true);	// isSingle Bool whether to return just value of single element
	var question = get_tiny_contents2(jtr);
	var limit = jtr.find('[data-name=editable_limit]').editable('getValue', true);
	var attachments = jtr.find('input[type=checkbox]').is(':checked')? 1: 0;
	return {
		question: question,
		min: limit.min,
		max: limit.max,
		attachments: attachments,
	};
}

///////////////////////////////////////////////////////////////////////////////////////////////////
// VIEW METHOD
//////////////////////////////////////////////////////////////////////////

function getQuestion_abs(assessment, act_item){
	return getQuestion_general(assessment, act_item);
}

//////////////////////////////////////////////////////////////////////////

function getAnswer_abs(opts, item_id, act_item, uass, uass_item, role, stage){
	
	var 
		answer = uass_item && uass_item.answer ? uass_item.answer : '',
		s = '<div data-item-id="' + item_id + '" class="asspage_open_answer"  data-placement="bottom"' + (opts.bEditAnswer?' contenteditable="true"':'') + '>'
		+ answer
		+ '</div>'
	;

	if (act_item.attachments == 1){
		s +=
			'<table class="answer_attachments" item_id="' + item_id + '">'
				+ '<tr ' + (opts.bEditAnswer?'':' style="display:none"') + '>'
					+ '<td>Attach Material <div class="div_material_hdr">File formats: png, mp4, bmp, gif, jpg, mp3, pdf</div></td>'
					+ '<td>'
						+ '<input class="answer_uploader" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">'
					+ '</td>'
				+ '</tr>'
				+ '<tr>'
					+ '<td class="answer_gallery" colspan="2"></td>'
				+ '</tr>'
			+ '</table>'
		;
	}

	return s;
}
