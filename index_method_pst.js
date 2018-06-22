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

/*
	//if (bEditable)
	{

		//////////////////////////////////////////////////////////////////////////////////////
		// COORDINATOR OR PARTICIPANT
		//////////////////////////////////////////////////////////////////////////////////////
		//tbody.append('<tr><td><div id="gallery_pst" class="uploader_gallery"></div></td></tr>');
		//if (uass.saved || uass.performed)
		{
			for (var i in uass.items){
				var item = uass.items[i];
				var media_id = item.media_id;
				media_id_arr.push(media_id);
			}
		}
		// juploader = jdiv.find('.uploader');
		//var jgallery = jdiv.find('.uploader_gallery');
		initUploader($('#uploader_viewass_specific'), $('#gallery_pst'), 'poster2', {
				act_id: act_id,
				ass_id: uass.ass_id,
				user_id: g_user_id,
			},
			function (media_arr, media_id_arr){
				console.info('onUpdate', media_id_arr);
				transdiv_resize();
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
		g_ass_asst_marks =
		total_marks = Math.ceil(total_marks);
		/$('.asspage_marks').text(total_marks + ' marks');
	}
*/


function viewActAsst_pst(opts, asst, uass, role, tbody, stage, status, act_id, part_id){

	var bEditable = opts.bEditAnswer;

	var media_id_arr = [];
	for (var i in uass.items){
		var item = uass.items[i];
		var media_id = item.media_id;
		media_id_arr.push(media_id);
	}
	
	// initUploader	
	var jdiv = $('.div_viewass_' + role + ' .div_asst_view');
	var juploader = jdiv.find('.uploader_viewass_pst');
	var jgallery = jdiv.find('.gallery_viewass_pst');

	initUploader(
		juploader,
		jgallery,
		'poster2',
		{
			act_id: act_id,
			ass_id: uass.ass_id,
			user_id: g_user_id,
		},
		function (media_arr, media_id_arr){
			console.info('onUpdate', media_id_arr);
			transdiv_resize();
		},
		'.tbl_ass_item',
		bEditable
	);


	// ADD BUTTON?
	if (role == 'participant' && bEditable){
		showBtnOnBar(juploader, 1);
	} else {
		showBtnOnBar(juploader, 0);
	}

	juploader
		// RESET QUERY		
		.uploader('set_query_ids', {
			act_id: act_id,
			ass_id: uass.ass_id,
			user_id: g_user_id,
		})
		// LOAD GALLERY
		.uploader('loadGallery', media_id_arr, bEditable, function(){
			// for assessor: Adding marking box

			var jitems = jgallery.find('.div_gallery_item');
			var item_id = 1;

			// INSERT RUBRICS
			jitems.each(function(){

				// ADD IMAGE #
				var s = '<div class="div_prt_imgid">Image ' + item_id + '</div>';
				$(s).insertBefore(this);

				// CHECK IF CREATION IS NEEDED
				var s = '';
				var index = item_id - 1;
				if (!uass.items[index]){
					uass.items[index] = {};
				}
				var uass_item = uass.items[index];

				// ADD RUBRICS BOX
				if (role == 'assessor'){
					s = getViewRubricTbl(asst, item_id++, uass_item, RUBRICS_MARK) + '<br/><hr/>';
				} else if (uass.performed){
					s = getViewRubricTbl(asst, item_id++, uass_item, RUBRICS_VIEW) + '<br/><hr/>';				
				} else if (role == 'coordinator'){
					s = getViewRubricTbl(asst, item_id++, uass_item, RUBRICS_VIEW) + '<br/><hr/>';									
				}

				$(s).insertAfter(this);
			});

			var jstars = jdiv.find('.div_item_stars'); 
			showDivStar(jstars);
		})
	;
}
