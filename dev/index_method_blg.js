///////////////////////////////////////////////////////////////////////////////////////////////////

function getEditItemsValues_blg(jtds){
}
//////////////////////////////////////////////////////////////////////////

function getQuestion_blg(assessment, act_item){
	console.info('getQuestion_blg', act_item);
	return '<div class="div_uploader_media"></div>';
}

//////////////////////////////////////////////////////////////////////////

function getAnswer_blg(opts, item_id, act_item, uass, uass_item, role, stage){
	console.info('getAnswer_blg', act_item);
}

//////////////////////////////////////////////////////////////////////////
function viewItem_blg(opts, jprt, assessment, uass, role, tbody, stage, status, act_id, part_id, jdiv){

}

//////////////////////////////////////////////////////////////////////////////////


function deleteBlg(obj){
	console.log('deleteBlg', obj);
	var jobj = $(obj),

		jroot = jobj.closest('.tbl_blog_input')
		jitem = jroot.find('.div_tinymce_blogitem')
		//jtr = jobj.closest('.tbl_blog_input').parent().parent(),
		//jeditable = jtr.find('.editable');
		//item_id = jeditable.length ? parseInt(jtr.find('.editable').attr('data-name').substring(9)) : 0,
		item_id = parseInt(jitem.attr('data-itemid')),
		act_id = g_saved_activity.act_id
	;
	var self = this;
	confirmDialog('Are you sure to delete this?', function(){
		// send to server
		call_svrop(
			{
				type:		'del_blg_item',
				email:	g_user.email,
				pwd:		g_user.pwd,
				user_id: g_user_id,
				act_id:	act_id,
				ass_id:	g_curr_ass_id,
				item_id: item_id,
			},
			function (obj){
				console.info('succeeded', obj);

				// update gui
				jroot.parent().parent().remove();
				refreshBlgItems();

				// update memory
				//console.log(obj.items);
				//$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.items' => $items]];
				var uact = getUact(act_id);
				uact.assessments[g_curr_ass_id - 1].items = obj.items;
			},
			function (obj){
				console.error('failed', obj);
			}
		);
	});
}

///////////////////////////////////////////////////////////////////////////////////////

function refreshBlgItems(){
/*
	var jtbody = $('#div_viewass_part .tbl_asspage_asst > tbody');

	var params = {
			type:			'xeditable',
			url:			'./svrop.php',
			user_id:		g_user_id,
			email:			g_user.email,
			username: 		g_user.username,
			pwd:			g_user.pwd,
			act_id:			g_saved_activity.act_id,
			ass_id:			g_curr_ass_id,
	}
	var
		jeditable = jtbody.find('.tbl_blog_input .editable')
		// item_id = jeditable.length
	;
	// from high to low item_ids
	jeditable.each(function(){

		var
			item_id = parseInt($(this).attr('data-itemid')),
			blog_id = parseInt($(this).attr('data-blogid')),
			params2 = jsonclone(params)
		;
		params2['item_id'] = item_id;
		params2['blog_id'] = blog_id;

		console.log('refreshBlgItems', 'item_id='+item_id, 'blog_id='+blog_id, params2);

		$(this)
			//.attr('item_id', item_id)
			.editable({
				pk: 1,

				//params: params,

				// add params for this element
				params: params2,

				success: function(response, newValue) {

					// place the new item in memory
					console.log('success', response, newValue);
					try {
						response = JSON.parse(response);
					} catch (e){
						console.error('JSON.parse error', response);
					}

					var
						act_id = g_saved_activity.act_id,
						item_id = response.item_id,
						blog_id = response.blog_id,
						uact = getUact(act_id),
						datetime = getDateTimeString(),
						item = {
							"ass_item_id" 	: item_id,
							"answer"		: newValue,
							"performed" 	: datetime,
							"blog_id" 		: blog_id,
						}
					;
					var jobj = jeditable.filter('[data-itemid='+ item_id +']');
					jobj.attr('data-blogid', blog_id);

					if (!item['part_item_mark']) item['part_item_mark'] = '-';
					if (!item['assessors']) item['assessors'] = {};
					var asst = uact.assessments[g_curr_ass_id - 1];
					if (!asst.items){
						asst.items = [];
					}
					asst.items[item_id - 1] = item;
				},
			});
		//console.log('xeditable_blg_item', item_id);
		//item_id--;
	})
	//return item_id;
	return jeditable.length;
*/
/*
	var
		jtbody = $('#div_viewass_part .tbl_asspage_asst > tbody'),
		jeditable = jtbody.find('.tbl_blog_input .editable')
	;
	init_tinymce("#div_viewass_part .editable", '', function(container, value){
		updateBlg(container, value);
	});
*/
	var jitems = $('#div_viewass_part .tbl_asspage_asst > tbody .div_tinymce_blogitem');
	var item_id = jitems.length;
	jitems.each(function(){
		$(this).attr('data-itemid', item_id--);
	});
}

///////////////////////////////////

function getEditItemsValues_blg(){
	return '';
}


///////////////////////////////////////////////////////

function addBlogItem(opts, jdiv, assessment, uass, item){
	console.info('addBlogItem');

	var bEditItemNow = !opts;

	var
		method = assessment ? assessment.method : g_saved_activity.assessment.assessments[g_curr_ass_id-1].method,
		datetime = item ? getDateWithoutSecond(item.performed) : getDateTimeString(),
		answer = item ? item.answer : '',
		item_id = item ? item.ass_item_id : 0,
		blog_id = item ? item.blog_id : 0
	;

	// find item_id for this new item
	if (!item_id){
		var jitems = $('#div_viewass_part .tbl_asspage_asst > tbody .div_tinymce_blogitem');
		item_id = jitems.length + 1;
	}
	if (!jdiv){
		jdiv = $('#div_viewass_part');
	}

	var
		jtbody = jdiv.find('.tbl_asspage_asst > tbody'),
		s =
		'<tr><td><table class="tbl_blog_input">' +
			'<tr>' +
				'<td class="blg_datetime">' +
					datetime +
				'</td>'
	;
	var rubrics_mode = 0;

	if (opts && (opts.bViewMarking || opts.bEditMarking)){

		if (opts.bEditMarking){
			rubrics_mode = RUBRICS_MARK;
		} else if (!assessment.performed  && (method == 'blg' || method == 'bl2')){
			rubrics_mode = RUBRICS_VIEW;
		} else if (opts.bViewQuestion){
			rubrics_mode = RUBRICS_VIEW;
		}
		s += '</tr>' +
			 '<tr>' +
					'<td colspan="3" class="blg_body">' +
						answer +
					'</td>' +
			'</tr>'
		;

		if (item && item.comments){
			s += '<tr><td>';
			for (var i in item.comments){
				var comment = item.comments[i];
				s += '<div class="blog_comments">' +
						'<b>' +
							getImgUserName(comment.user_id, g_asst_assrs, g_act_parts) +
						'</b> ' +
							comment.comment +
						' <span class="blog_datetime">(' +
							getDateWithoutSecond(comment.time) +
						')</span>' +
					'</div>'
				;
			}
			s += '</td></tr>';
		}

	} else if (!opts || opts.bEditAnswer){
		s +=
			'<td class="blg_panel">' +
				'<table>' +
					'<tr>' +
						'<td>' +
							'<button id="but_tinymce_blogitem_' + item_id + '" class="btn btn-primary but_edititem">Edit</button></td>' +
						'</td>' +
						'<td>' +
							'<button type="button" class="btn btn-danger" onclick="deleteBlg(this)">Delete</button>' +
						'</td>' +
					'</tr>' +
				'</table>' +
			'</td>' +
		'</tr>' +
		'<tr>' +
			'<td colspan="3" class="blg_body">' +
				'<div id="div_tinymce_blogitem_' + item_id + '" class="div_tinymce_blogitem" data-itemid="' + item_id + '" data-blogid="' + blog_id + '"></div>' +
			'</td>' +
		'</tr>' +
		'</table></td></tr>';

	} else {

		s += '</tr>' +
			 '<tr>' +
				'<td colspan="3" class="blg_body">' +
					answer +
				'</td>' +
			'</tr>';

		if (!assessment.performed){//}  && (method == 'blg' || method == 'bl2')){
			rubrics_mode = RUBRICS_VIEW;
		}
	}

	if (rubrics_mode){

		var uass_item = uass.items[item_id - 1];

		switch (rubrics_mode){

			case RUBRICS_VIEW:
				s += getViewMarking(assessment, item_id, uass_item);
				break;

			case RUBRICS_MARK:
				s += '<tr>' +
						'<td colspan="100">' +
							getViewRubricTbl(assessment, item_id, uass_item, rubrics_mode) +
						'</td>' +
					'</tr>'
				;
				break;
		}
	}
	s += '</table></td></tr>';

	// 1. original for author
	jtbody.prepend(s);

	// show stars
	showDivStar(jtbody);

	init_tinymce_editable('blogitem_' + item_id, answer, function(unique_name, value){
		var jitem = $('#div_tinymce_' + unique_name);
		updateBlg(jitem, value);
	},function(unique_name){
		if (bEditItemNow){
			open_tinymce(unique_name);
		}
	});

	// ui
	var item_id = refreshBlgItems();
	transdiv_resize();
	return item ? item.part_item_marks : 0;
}
/////////////////////////////////////////////////////////////

function updateBlg(jitem, value){
	var
		user_id = g_user_id,
		act_id = g_saved_activity.act_id,
		ass_id = g_curr_ass_id,
		item_name = g_curr_method == 'blg' ? 'blg_item' : 'bl2_item';
		item_id = parseInt(jitem.attr('data-itemid')),
		blog_id = parseInt(jitem.attr('data-blogid'))
		//value = tinyMCE.activeEditor.getContent()
	;
	console.log('updateBlg', item_name, user_id, act_id, ass_id, item_id, blog_id);

	openProgress2();

	call_svrop(
		{
			type: 'update_blg',
			user_id: user_id,
			act_id: act_id,
			ass_id: ass_id,
			item_id: item_id,
			blog_id: blog_id,
			name: item_name,
			value: value,
		},
		function (response){

			// place the new item in memory
			console.log('updateBlg success', response);

			var
				item_id = response.item_id,
				blog_id = response.blog_id,
				uact = getUact(act_id),
				datetime = getDateTimeString(),
				item = {
					"ass_item_id" 	: item_id,
					"answer"				: value,
					"performed" 		: datetime,
					"blog_id" 			: blog_id,
				}
			;
			jitem.attr('data-blogid', blog_id);

			if (!item['part_item_mark']) item['part_item_mark'] = '-';
			if (!item['assessors']) item['assessors'] = {};

			// undate memory
			var asst = uact.assessments[g_curr_ass_id - 1];
			if (!asst.items){
				asst.items = [];
			}
			asst.items[item_id - 1] = item;

			var method_name = 'blog';
			if (g_curr_method == 'bl2'){
				method_name = 'daily journal';
			}

			closeProgress2();
			refreshBlgItems();
			transdiv_resize();
			//notifyDialog('Your ' + method_name + ' is updated.');
		}
	);

}
