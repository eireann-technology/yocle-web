///////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_pst(jtds){
}
//////////////////////////////////////////////////////////////////////////

function getQuestion_pst(assessment, act_item){
	console.info('getQuestion_pst', act_item);
	return '<div class="div_uploader_media"></div>';
}

//////////////////////////////////////////////////////////////////////////

function getAnswer_pst(opts, item_id, act_item, uass, uass_item, role, stage){
	console.info('getAnswer_pst', act_item);
}

//////////////////////////////////////////////////////////////////////////
function viewActAsst_pst(opts, jprt, assessment, uass, role, tbody, stage, status, act_id, part_id, jdiv){
	//var toloadgallery = 0;
	var media_id_arr = [];
	
	var bEditable = opts.bEditAnswer;
	//if (role == 'participant' && stage == TIMESTAGE_OPENING && (g_multi_perform || !uass.performed)){
	if (bEditable){
		
		//////////////////////////////////////////////////////////////////////////////////////
		// COORDINATOR OR PARTICIPANT
		//////////////////////////////////////////////////////////////////////////////////////
		tbody.append('<tr><td><div class="uploader_gallery"></div></td></tr>');
		//if (uass.saved || uass.performed)
		{
			for (var i in uass.items){
				var item = uass.items[i];
				var media_id = item.media_id;
				media_id_arr.push(media_id);
			}
		}
		var jdiv = $('#div_assessment_view');
		var juploader = jdiv.find('.uploader');
		var jgallery = jdiv.find('.uploader_gallery');
		initUploader(juploader, jgallery, 'poster2', {
				act_id: act_id, ass_id: uass.ass_id, user_id: g_user_id
			},
			function (media_arr, media_id_arr){
				console.info('onUpdate', media_id_arr);
				//g_saved_activity.media = media_id_arr;
			},
			'.tbl_ass_item',
			bEditable
		);
		
	} else {
		
		//////////////////////////////////////////////////////////////////////////////////////
		// ASSESSOR ONLY
		//////////////////////////////////////////////////////////////////////////////////////
		var total_marks = 0;
		for (var i = 0; i < uass.items.length; i++){
			var item_id = i + 1;
			var item = uass.items[i];

			// add media_id
			var media_id = parseInt(item.media_id);
			media_id_arr.push(media_id);

			total_marks += viewItem(opts, assessment, uass, stage, status, tbody, role, item_id, part_id);
		}
		g_assr_asst_marks =
		total_marks = Math.ceil(total_marks);
		$('.asspage_marks').text(total_marks + ' marks');
		
		var jdiv = $('#div_assessment_view');
		var juploader = jdiv.find('.uploader');
		var jgallery = jdiv.find('.uploader_gallery');
		initUploader(juploader, jgallery, 'poster2', {
				act_id: act_id, ass_id: uass.ass_id, user_id: g_user_id
			},
			function (media_arr, media_id_arr){
				console.info('onUpdate', media_id_arr);
				//g_saved_activity.media = media_id_arr;
			},
			'.tbl_ass_item',
			bEditable
		);		
		//onGotMedia(juploader, media_id_arr, 0);
	}
	onGotMedia(juploader, media_id_arr, bEditable);
	juploader.parent().find('.uploader_label').css('visibility', bEditable?'visible':'hidden');
	//return media_id_arr;
}
