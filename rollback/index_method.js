
var method_arr = {
		ref: 'Reflection',	// Reflective Piece
		mcq: 'MCQ',
		prt: 'Participation',
		abs: 'Report/ Essay', // Dissertation/Essay/Reviews',
		lcn: 'Learning Contract',	// Learning contract
		sur: 'Survey',
		pst: 'Poster',

//	app: 'Application',// Report',
//	blg: 'Blog',
//	css: 'Case Study',
//	map: 'Concept Map',
//	jor: 'Journal', // Daily or Weekly Logbooks',
//	por: 'Porfolio',
//	prs: 'Presentation',
//	wik: 'Wikis',
};
///////////////////////////////////////////////////////////////////////////////////////////////////

function viewItem(opts, assessment, uass, stage, status, tbody, role, item_id, part_id){

	var marks = 0;	// output
	
	var
		ass_id = assessment.ass_id
		,method = assessment.method
		,index = parseInt(item_id) - 1
		,act_item = 0
		,s = ''
	;

	if (!uass.items[index]){
		uass.items[index] = {};
	}
	var uass_item = uass.items[index];
	if (method == 'pst'){
		var count = uass.items.length;
		var w = 0;
		if (item_id < count){
			w = parseInt(100/count);
		} else {
			var total = 100;
			for (var j in uass.items){
				if (j < count - 1){
					total -= parseInt(uass.items[j].weight);
				}
			}
			w = total;
		}
		uass_item.weight = w;
		
		act_item = {
			media_id: uass_item.media_id,
			weight: w,
		}
	} else {
		act_item = assessment.items ? assessment.items[index] : 0
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	// ITEM NUM & QUESTION PART
	///////////////////////////////////////////////////////////////////////////////////////////////
	
	// embrace item qna with a table
	
	s += '<table class="tbl_ass_item" item_id="' + item_id + '"><tr><td>';
	
	if (opts.bViewQuestion){
		s += '<tr>' +
						'<td style="width:1%">' + 
							// ITEM NUM
							'<span class="asspage_itemnum">' + item_id + '</span>' +
						'</td>' + 
						'<td style="width:99%">' + 
							// QUESTION
							eval('getQuestion_' + method)(assessment, act_item) +
						'</td>'
					'</tr>'
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// ANSWER PART
	///////////////////////////////////////////////////////////////////////////////////////////////
	if (opts.bViewAnswer){
		s += '<tr>'
						+ '<td colspan="2">'
							// ANSWER
							+ eval('getAnswer_' + method)(opts, item_id, act_item, uass, uass_item, role, stage)
						+ '</td>'
					+ '</tr>'
		;
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	// MARKINGS AND COMMENTS
	///////////////////////////////////////////////////////////////////////////////////////////////
	if (opts.bEditMarking)
	{
		
		/////////////////////////////////////////////////
		// case 1: editable markings
		/////////////////////////////////////////////////
		$('.asspage_marks').show();

		if (!uass_item.assessors){
			uass_item.assessors = {};
		}
		
		var
			assr_id = g_user_id,
			assessor = getUserByID(uass_item.assessors, assr_id)
		;
		// if no assessor yet, create it for the first time
		if (!assessor){
			assessor = jsonclone(template_assessor);
			assessor.assr_item_marks = '-';
			assessor.comments = '';
			uass_item.assessors[g_user_id] = assessor;
		}
		
		var
			assr_item_marks = getMarksByID(assessor, 'assr_item_marks'),
			comments = assessor.comments ? assessor.comments : ''
		;
		if (!assr_item_marks || assr_item_marks == '-') assr_item_marks = 0;
		
		//var mark_editable = (uass.performed && stage >= TIMESTAGE_OPENING && stage < TIMESTAGE_CLOSED);
		var mark_editable = 1;
		s += '<tr>'
					+ '<td colspan="2">'
						+ '<table width="100%" cellspacing="0" cellpadding="0" class="tbl_asspage_marking" data-item-id="' + item_id + '">';
							
		// add marking slider
		if (method == 'mcq'){
			if (act_item.correct == uass_item.answer && uass_item.answer != ''){
				assr_item_marks = parseInt(act_item.weight);
				marks += assr_item_marks;
			}
			s += '<tr style="display:none"><td class="assr_item_marks">' + assr_item_marks + '</td></tr>';
			
		} else {
			s +=
			'<tr>'
				+ '<td><span class="span_marks"></span></td>'
			+ '</tr>'
			+ '<tr>'
				+ '<td>'
					+ '<table width="100%">'
						+ '<tr>'
								+ '<td class="asspage_slider">'
									+ '<div class="slider ' + (mark_editable?'':'slider_disabled') + '" marks="' + assr_item_marks + '" weight="' + act_item.weight + '">'
										//+ '<div class="custom-handle ui-slider-handle"></div>'
									+ '</div>'
								+ '</td>'
								+ '<td width="1">'
									+ '<button class="but_left btn btn-sm"><i class="glyphicon glyphicon-chevron-left"></i></button>'
								+ '</td>'
								+ '<td width="1">'
									+ '<button class="but_right btn btn-sm"><i class="glyphicon glyphicon-chevron-right"></i></button>'
								+ '</td>'
						+ '</tr>'
					+ '</table>'
				+ '</td>'
			+ '</tr>';
			marks = assr_item_marks * parseInt(act_item.weight) / 100;
		}

		// add marking comments
		s += 
			'<tr>'
				+ '<td class="asspage_text_comments">Comments:</td>'
			+ '</tr>'
			+ '<tr>'
				+ '<td style="padding:0px">'
					+ '<div class="asspage_open_comments"' + (mark_editable ? ' contenteditable="true"' : '') + '>' + comments + '</div>'
				+ '</td>'
			+ '</tr>'
				+ '</table>'
			+ '</td>'
		+ '</tr>'
		;
		
	} else if (opts.bViewMarking){
		
		/////////////////////////////////////////////////
		// case 2: view only markings
		/////////////////////////////////////////////////
		
		$('.asspage_marks').show();
		var
			part_item_marks = getMarksByID(uass_item, 'part_item_marks'),
			assessors = uass_item.assessors,
			num_of_assessors = getObjCount(assessors)
		;		
		s += '<tr>'
					+ '<td colspan="2">'
						+ '<table width="100%" cellspacing="0" cellpadding="0" class="tbl_asspage_marking">'

		;
		if (role != 'assessor'){
			
			s +=
									'<tr>'
									+ '<td>'			
											+	'<span class="asspage_marks1">' + part_item_marks + ' marks</span>'
											+ '<span class="asspage_marks_expand"><button><i class="glyphicon glyphicon-plus"></i></button></span>'
										+ '</td>'
									+ '</tr>'
									+ '<tr>'
										+ '<td>'
											+ '<div class="div_asspage_marking" style="display:none">'
												+ '<table width="100%" class="tbl_ass_marking" border="0">'

			;
		}

		var assr_marks = 0;
		for (var assr_id in assessors){
			
			if (role == 'assessor' && assr_id != g_user_id){

				continue;

			} else {
				
				var
					 assessor = assessors[assr_id],
					 imgusername = getImgUserName(assr_id, g_curr_assessment_assessors),
					 date = getDateWithoutTime(assessor.date),
					 assr_item_marks = 0
				;

				assr_item_marks = getMarksByID(assessor, 'assr_item_marks')

				if (role == 'assessor'){
					
					s += '<tr>'
								+ '<td>'
									+ '<span class="asspage_marks1">' + assr_item_marks + ' marks</span><br/><br/>' + assessor.comments + ' (' + assessor.date + ')'
								+ '</td>'
							+ '</tr>'
					;
					
				} else {
					
					s += '<tr>'
								+ '<td>'
									+ '<b>' + imgusername + '</b> (' + date + '): ' + assessor.comments + '<span class="asspage_marks2">(' + assr_item_marks + ' marks)</span>'
								+ '</td>'
							+ '</tr>'
					;
				}

				if (method == 'mcq'){
					marks = assr_item_marks;
				} else {
					marks = assr_item_marks * parseInt(act_item.weight) / 100;
				}
				
			}
		}
		if (role != 'assessor'){
			s += 		 '</table>'
						+ '</div>'
					+ '</td>'
				+ '</tr>'
			;
		}
		s +=	'</table>'
			+ '</td>'
		+ '</tr>';
	} else {
		/////////////////////////////////////////////////
		// case 3: no marks and comments
		/////////////////////////////////////////////////
		$('.asspage_marks').hide();
	}
	
	s += '</td></tr></table>';
	
	// APPEND NOW
	var jobj = $(s);
	tbody.append(jobj);
	
	////////////////////////////////////////////////////////////////
	// POST INITIALIZATION
	////////////////////////////////////////////////////////////////
	// init uploader for activity
	var act_id = g_saved_activity.act_id;

	tbody.find('.answer_attachments').each(function(){
		var item_id = parseInt($(this).attr('item_id'));
		var index = parseInt(item_id) - 1
		var uass_item = uass.items[index];		
		var bEditable = opts.bEditAnswer ? 1 : 0;

		var jobj = $(this);
		var juploader = jobj.find('.answer_uploader');
		var jgallery = jobj.find('.answer_gallery');

		console.debug('item_media', jobj, opts, act_id, ass_id, item_id);
		
		initUploader(juploader, jgallery, 'item_media',
			{part_id: part_id, act_id: act_id, ass_id: ass_id, item_id: item_id},
			function(media_arr, media_id_arr){
				console.info('onUpdate', media_id_arr);
				//g_saved_activity.media = media_id_arr;
			},
			0,
			bEditable
		);
	});
	
	//console.info(jobj);
/*	
	tbody.find('.slider').on('slide slidechange', function(ev, ui){
		var jtbl = $(this).closest('.tbl_asspage_marking');
		var jspan = jtbl.find('.span_marks');
		jspan.html(ui.value + ' marks');
	});
	// add increase by 1%
	tbody.find('.but_left').click(function(){
		var jslider = $(this).closest('tr').find('.ui-slider');
		var value = jslider.slider('value');
		value--; if (value < 0) value = 0;
		jslider.slider('value', value);
		jslider.find('div').html(value);
	});		

	// add decrease by 1%
	tbody.find('.but_right').click(function(){
		var jslider = $(this).closest('tr').find('.ui-slider');
		var value = jslider.slider('value');
		value++; if (value > 100) value = 100;
		jslider.slider('value', value);
		jslider.find('div').html(value);
	});
	
	// add expand marks breakdown and each assessors' comments
	var expand = $('.asspage_marks_expand');
	if (expand.length){
		expand.unbind().click(function(e){
			var
				jobj2 = $(this),
				jdiv = jobj2.closest('tbody').find('>tr:nth-child(2)').find('.div_asspage_marking'),
				jtr = jdiv.parent().parent()
			;
			//console.info('click', jtr.css('display'));
			if (jdiv.css('display') == 'none'){
				jobj2.find('i').removeClass('glyphicon-plus').addClass('glyphicon-minus');
				jtr.show();
				jdiv.hide().slideDown();
			} else {
				jobj2.find('i').removeClass('glyphicon-minus').addClass('glyphicon-plus');
				jdiv.slideUp("", function(){
					jtr.hide();
				});
			}
			e.stopPropagation();
		});
	}
*/	

	return marks;
}
