
var method_arr = {
		ref: 'Reflection',				// Reflective Piece
		mcq: 'MCQ',
		prt: 'Participation',
		abs: 'Report/ Essay', 		// Dissertation/Essay/Reviews',
		lcn: 'Learning Contract',	// Learning contract
		sur: 'Survey',
		pst: 'Poster',
		blg: 'Blog',
		bl2: 'Daily Journal',

//	app: 'Application',// Report',
//	css: 'Case Study',
//	map: 'Concept Map',
//	jor: 'Journal', // Daily or Weekly Logbooks',
//	por: 'Porfolio',
//	prs: 'Presentation',
//	wik: 'Wikis',
};


////////////////////////////////////////////////////////////////////////////////////////

function getMediaOptions(){

	// buttons
	var s =
		'<b>Media:</b>'
		+ '<div class="media_div">'
			+ '<table width="100%">'
				+ '<tr>'
					+ '<td>&nbsp;'
					+ '</td>'
					+ '<td>'
						+ '<table class="media_panel">'
							+ '<tr>'
								+ '<td>'
									+ '<table>'
										+ '<tr>'
											+ '<td>'
												+ '<button class="btn btn-primary"> + image <img src="./images/icon_img.png"/></button>'
											+ '</td>'
											+ '<td>'
												+ '<button class="btn btn-primary"> + audio <img src="./images/icon_mic.png"/></button>'
											+ '</td>'
											+ '<td>'
												+ '<button class="btn btn-primary"> + video <img src="./images/icon_vid.png"/></button>'
											+ '</td>'
										+ '</tr>'
									+ '</table>'
								+ '</td>'
							+ '</tr>'
						+ '</table>'
					+ '</td>'
				+ '</tr>'
			+ '</table>'
	;

	// container
	s += '<table class="media_table">';

	s += '<tr>'
				+ '<td>'
					+ '<img class="media_photo" src="./media/happy.jpg"/>'
				+ '</td>'
				+ '<td class="media_desc" contenteditable="true">'
					+ 'Description of photo (2018-02-13)'
				+ '</td>'
				+ '<td class="media_trash">'
					+ '<button type="button" class="btn btn-danger btn-sm btn-list-trash" onclick="deleteMedia(this)"><i class="glyphicon glyphicon-trash"></i></button>'
				+ '</td>'
			+ '</tr>'

	s += '<tr>'
				+ '<td>'
					+ '<video controls class="media_video" src="./media/wonder.mp4"></video>'
				+ '</td>'
				+ '<td class="media_desc" contenteditable="true">'
					+ 'Description of video (2018-02-13)'
				+ '</td>'
				+ '<td class="media_trash">'
					+ '<button type="button" class="btn btn-danger btn-sm btn-list-trash" onclick="deleteMedia(this)"><i class="glyphicon glyphicon-trash"></i></button>'
				+ '</td>'
			+ '</tr>'

	s += '<tr>'
				+ '<td>'
					+ '<audio controls class="media_audio"><source src="./media/bruce.mp3"/></audio>'
				+ '</td>'
				+ '<td class="media_desc" contenteditable="true">'
					+ 'Description of audio (2018-02-13)'
				+ '</td>'
				+ '<td class="media_trash">'
					+ '<button type="button" class="btn btn-danger btn-sm btn-list-trash" onclick="deleteMedia(this)"><i class="glyphicon glyphicon-trash"></i></button>'
				+ '</td>'
			+ '</tr>'

	s += '</table>'

	s += '</div>'
	;
	return s;
}

/////////////////////////////////////////////////////

// for multi assessors
/*
					if (role == 'assessor'){
						// assessor's presentation
						s += '<tr>'
									+ '<td>'
										+ marks
										+ '&nbsp;&nbsp;' + comments + ' (' + assessor.date + ')'
									+ '</td>'
								+ '</tr>'
						;
					} else {
						// viewers' presentation
						s += '<tr>'
									+ '<td colspan="99">'
										+ '<b>' + imgusername + '</b> (' + date + '): '
										 + comments
										 + '&nbsp;&nbsp;'
										 + marks
									+ '</td>'
								+ '</tr>'
						;
					}
*/

///////////////////////////////////////////////////////////////////////////////////////////////////

function viewItem(opts, assessment, uass, stage, status, tbody, role, item_id, part_id){

	console.log('***viewItem', item_id);

	var item_marks = 0,
		ass_id = assessment.ass_id
		,method = assessment.method
		,index = !item_id ? 0 : parseInt(item_id) - 1
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
	if (method == 'prt'){


	} else {

		s += '<table class="tbl_ass_item" item_id="' + item_id + '"><tr><td>';

		if (opts.bViewQuestion){
			s += '<tr>' +
						'<td>' +
							// ITEM NUM
							'<span class="asspage_itemnum">' + item_id + '</span>' +
						'</td>' +
						'<td>' +
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
	}

	if (!uass_item.assessors){
		uass_item.assessors = {};
	}

	///////////////////////////////////////////////////////////////////////////////////////////////
	// MARKINGS AND COMMENTS
	///////////////////////////////////////////////////////////////////////////////////////////////
	if (opts.bEditMarking){

		/////////////////////////////////////////////////
		// case 1: editable markings
		/////////////////////////////////////////////////
		$('.asspage_marks').show();

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

		var assr_item_marks = getMarksByID(assessor, 'assr_item_marks');
		marks = assr_item_marks * parseInt(act_item.weight) / 100;

		console.log('assr_item_marks', assr_item_marks, marks);

		///////////////////////////////////////////////////////////
		// MARKING METHOD 2: RUBRICS
		///////////////////////////////////////////////////////////
		var rubrics_mode = 0;
		if (opts.bEditAnswer){
			rubrics_mode = RUBRICS_ANSR;
		} else if (opts.bEditMarking){
			rubrics_mode = RUBRICS_MARK;
		} else if (opts.bViewQuestion){
			rubrics_mode = RUBRICS_VIEW;
		}
		s +=
				'<tr>'
				+ '<td colspan="100">'
					+ getViewRubricTbl(assessment, item_id, uass_item, rubrics_mode)
				+ '</td>'
			+ '</tr>'
		;

	} else if (opts.bViewMarking){

		/////////////////////////////////////////////////
		// case 2: view only markings
		/////////////////////////////////////////////////
		//var obj = getViewMarking(assessment, item_id, uass_item);
		//s += obj.s;
		//item_marks = obj.item_marks;

		s += getViewMarking(assessment, item_id, uass_item)
				+ '</table>'
				+ '</td>'
			+ '</tr>'
		;

	//} else if (method != 'sur'){
	} else {
		/////////////////////////////////////////////////
		// case 3: no marks and comments
		/////////////////////////////////////////////////
		$('.asspage_marks').hide();

		s +=
				'<tr>'
				+ '<td colspan="100">'
					+ getViewRubricTbl(assessment, item_id, 0, RUBRICS_VIEW)
				+ '</td>'
			+ '</tr>'
		;

	}

	s += '</td></tr></table>';

	// APPEND NOW
	var jobj = $(s);
	tbody.append(jobj);
	showDivStar(tbody);

	////////////////////////////////////////////////////////////////
	// POST INITIALIZATION
	////////////////////////////////////////////////////////////////
	var act_id = g_saved_activity.act_id;
///*
	var jparent = jobj.find('.answer_attachments');
	jparent.each(function(){

		var
			jtbl = $(this),
			item_id = parseInt(jtbl.attr('item_id')),
			index = parseInt(item_id) - 1,
			uass_item = uass.items[index],
			bEditable = opts.bEditAnswer ? 1 : 0
		;

		console.log('*******viewItem attachment', jtbl, 'item_id='+item_id, 'attachment='+jparent.index(jtbl));

		var jobj = $(this);
		var juploader = jobj.find('.answer_uploader');
		var jgallery = jobj.find('.answer_gallery');

		console.info('item_media', jobj, opts, act_id, ass_id, item_id);

		// init uploader for activity
		var mediaFolder = getMediaFolder();
		initUploader(juploader, jgallery, 'item_media',
			{part_id: part_id, act_id: act_id, ass_id: ass_id, item_id: item_id},
			function(media_arr, media_id_arr){
				console.info('onUpdate', media_id_arr);
				//g_saved_activity.media = media_id_arr;
				transdiv_resize();
			},
			0,
			bEditable,
			mediaFolder
		);
		//var media_id = uass_item.media_id_arr.length ? uass_item.media_id_arr[0] : 0;
		//if (media_id == 1172){
		//	console.trace('*****loadGallery');
		//}
		juploader.uploader('loadGallery', uass_item.media_id_arr);
	});
//*/

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

	//return item_marks;
}

//////////////////////////////////////////////////////////////

function getViewMarking(asst, item_id, uass_item){

	var
		s = '',
		item_marks = 0,
		total_marks = 0,
		assessor_count = uass_item ? obj_count(uass_item.assessors) : 0
	;

	if (assessor_count > 0){
		s +=
			'<tr>'
				+ '<td colspan="100" style="text-align:right">'
					+ getDivStar(uass_item.part_item_marks, '<b>Item score:</b>', 1)
				+ '</td>'
			+ '</tr>'
		;
		if (asst.method != 'mcq'){

			for (var assr_id in uass_item.assessors){
				var
					 assessor = uass_item.assessors[assr_id],
					 imgusername = getImgUserName(assr_id, g_asst_assrs, g_act_parts),
					 date = getDateWithoutTime(assessor.date),
					 assr_item_marks = getMarksByID(assessor, 'assr_item_marks'),
					 comments = assessor.comments ? assessor.comments : ''
					 //item_marks = getStarsStatus(assr_item_marks)
				;
				// sum up the marks
				total_marks += assr_item_marks;

				if (g_curr_role == 'assessor'){
					if (assr_id != g_user_id){
						// skip showing other assesors' rubrics
						continue;
					} else {
						// SINGLE VIEW
						s += '<tr>'
								+ '<td colspan="100">'
									+ getViewRubricTbl(asst, item_id, uass_item, RUBRICS_VIEW)
								+ '</td>'
							+ '</tr>'
						;
					}
				} else {
					// MULTI VIEW
					var uass_item2 = {
						assessors: {}
					}
					uass_item2.assessors[assr_id] = jsonclone(assessor);
					s +=
							'<tr>'
							+ '<td colspan="100">'
								+ '<table class="tbl_asst_assr" assr_id="' + assr_id + '">'
									+ '<tr>'
										+ '<td>'
											+ getDivStar(assessor.assr_item_marks, getImgUserName(assr_id, g_asst_assrs, g_act_parts), 1)
										+ '</td>'
										+ (!date?'':'<td>' + getDateWithoutTime(date) + '</td>')
									+ '</tr>'
								+ '</table>'
							+ '</td>'
						+ '</tr>'
							+ '<tr>'
								+ '<td colspan="100" style="padding-bottom:10px">'
									+ getViewRubricTbl(asst, item_id, uass_item2, RUBRICS_MULT)
								+ '</td>'
							+ '</tr>'
					;
				}
			}
		}
	}
	return s;
}
//av_marks += assr_item_marks * parseInt(weight) / 100;

//////////////////////////////////////////////////////////////////////////

function getQuestion_general(asst, act_item){
	console.info('getQuestion_general', act_item.question);
	var
		q = act_item.question,
		weight = act_item.weight,
		remarks = ''
	;
	if (asst.weight == 0 || weight == 0){
		weight = '';
	} else {
		weight = ', ' + weight + '%';
	}
	if (act_item.min && act_item.max){
		remarks = ' (' + act_item.min + ' - ' + act_item.max + ' words' + weight + ')';
	} else if (act_item.min){
		remarks = ' (minimum ' + act_item.min + ' words' + weight + ')';
	} else if (act_item.max){
		remarks = ' (maximum ' + act_item.max + ' words' + weight + ')';
	} else if (weight != ''){
		remarks = ' (' + act_item.weight + '%)';
	}
	//return '<span class="asspage_question" data-min="' + act_item.min + '" data-max="' + act_item.max + '">' + q + '</span>';
	var s =
		'<table class="tbl_question">' +
			'<tr>' +
				'<td>' +
					'<span class="asspage_question" data-min="' + act_item.min + '" data-max="' + act_item.max + '">' + q + '</span>' +
				'</td>' +
				'<td class="td_question_remarks">' +
					remarks +
				'</td>' +
			'</tr>' +
		'</table>'
	;
	return s;
}
