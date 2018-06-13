var USRGRP_ACTPEERS_SPECIFIC = 100;

function initWhatsup(){
	
	// SET UPLOADER
	var
		jdiv = $('#div_whatsup'),
		jbut = jdiv.find('.uploader'),
		jgallery = jdiv.find('.uploader_gallery')
	;

	initUploader(jbut, jgallery, 'whatsup', {user_id: g_user_id}
		,function(media_arr, media_id_arr){
			console.info('onUpdate', media_id_arr);
			//g_user.profile.media = media_id_arr;
			createWhatsup(media_id_arr);
		}
	);

	jdiv.find('.span_uploader_label label').html('<img width="20" src="./images/whatsup_photo.png">&nbsp;Add').width(80);

	jdiv.find('.btn_send').click(function(){
		sendWhatsup();
	});

}

/////////////////////////////////////////////////////////////////////////////

function createWhatsup(media_id_arr){
	console.debug('createWhatsup', media_id_arr);
	
	var jdiv = $('#div_whatsup');	
	jdiv.find('.tbl_whatsup_output').hide();
	jdiv.find('.tbl_whatsup_input, .btn_send').show();
	jdiv.find('.leftarrow').unbind().click(function(){
		openWhatsup();
	});
	
	var jdiv1 = jdiv.find('.div_bodyview_header .span_uploader_label label');
	var jdiv2 = jdiv.find('.tbl_whatsup_input .span_uploader_label');
	if (jdiv1.length){
		jdiv2.append(jdiv1);
	}
	
	// set receivers
	var jdiv = $('#div_whatsup_receivers');
	var jtbl = $(
		'<table><tbody>'
		+ '<tr><td class="td_checkbox"><input type="checkbox" value="public" class="chkbox_public"></td><td>Public (everyone in this system)</td></tr>'
		+ '<tr><td class="td_checkbox"><input type="checkbox" value="mypeers" class="chkbox_mypeers"></td><td>My peers (your selection)</td></tr>'
		+ '</tbody></table>'
	);
	jdiv.empty().append(jtbl);
	var jtbody = jtbl.find('tbody');

	if (g_user.profile.activity && g_user.profile.activity.length){
		
		jtbody.append('<tr><td colspan="2"><b>Activity groups</b> '
			+ '<button class="btn btn-primary btn_selectall">Select all</button> '
			+ '<button class="btn btn-primary btn_unselectall">Unselect all</button>'
			+ '</td></tr>');
			
		for (var i in g_user.profile.activity){
			var act = g_user.profile.activity[i];
			jtbody.append('<tr><td class="td_checkbox"><input type="checkbox" class="chkbox_whatsup_act" value="a_' + act.act_id +'" class="chkbox_act"></td><td>' + act.title + '</td></tr>');
			//if (i == 5) break;	// testing only, save screen
		}
	}
	
	// button events
	jdiv.find('.btn_selectall').click(function(){
		console.debug('selectall');
		jdiv.find('.chkbox_whatsup_act').prop('checked', true);
	});
	jdiv.find('.btn_unselectall').click(function(){
		console.debug('unselectall');
		jdiv.find('.chkbox_whatsup_act').prop('checked', false);
	});
	
	// checkbox events
	jdiv.find('.chkbox_public').click(function(){
		var checked = $(this).prop('checked');
		console.debug(checked);
		jdiv.find('.chkbox_mypeers, .chkbox_whatsup_act').prop('disabled', checked);
	});
	
	//jdiv.find('.chkbox_mypeers').click(function(){
	//	var checked = $(this).prop('checked');
	//	console.debug(checked);
	//});
	//jdiv.find('.chkbox_whatsup_act').click(function(){
	//	var checked = $(this).prop('checked');
	//	console.debug(checked);
	//});
	
	//clearWhatsup();
}

/////////////////////////////////////////////////////////////////////////////

function openWhatsup(whatsup_id){
	console.info('openWhatsup');
	
	clearWhatsup();
	
	changeBodyView(PAGE_WHATSUP);
	 
	var jdiv = $('#div_whatsup');
	jdiv.find('.bodyview_title').html('What\'s up');
	
	jdiv.find('.tbl_whatsup_output').show();
	jdiv.find('.tbl_whatsup_input, .btn_send').hide();
	jdiv.find('.leftarrow').unbind().click(function(){
		closeWhatsup();
	});
	
	var jdiv1 = jdiv.find('.div_bodyview_header .span_uploader_label');
	var jdiv2 = jdiv.find('.tbl_whatsup_input .span_uploader_label label');
	if (jdiv2.length){
		jdiv1.append(jdiv2);
	}

	// remove previous one https://github.com/pklauzinski/jscroll/issues/6
	if ($('.tbl_whatsup_output').find('.tbl_whatsup_item').length){
		$('.tbl_whatsup_output').jscroll.destroy();
	}
	
	// create new one
	var w = g_nScreenW - 100;
	var limit = 2, jobj = $('.tbl_whatsup_output');
	var shtml = 
		whatsup_id ?
			'<a class="jscroll-next" href="./svrop.php?type=read_whatsup&whatsup_id=' + whatsup_id + '&width=' + w + '"></a>'
		:
			'<a class="jscroll-next" href="./svrop.php?type=read_whatsup&user_id=' + g_user_id + '&limit=' + limit + '&width=' + w + '"></a>'
	;
	//console.info(shtml);
	jobj
		.height(g_nScreenH - 76)
		.empty()
		.html(shtml)
		.jscroll({
			//debug: true,
			autoTrigger: true,
			loadingHtml: '<img src="./images/jscroll_loading.gif" alt="Loading"/> Loading...',
			nextSelector: '.jscroll-next',
			contentSelector: '',
			padding: 20,
			callback: function(a){
				//console.debug('jscroll callback', a);
				// tooltip
				var jdiv = jobj.find('.whatsup_tooltip');
				jdiv.tooltip({html: true});
				
				// autogrow
				jobj.find('.whatsup_mycomments').autoGrow().unbind().keypress(function(e){
					//console.debug(e.which, e);
					if (e.which == 13 && !e.shiftKey){
						addWhatsupComment(this);
						e.stopPropagation();
						return false;
					}
					
				});
				
				// like action
				jobj.find('.whatsup_img_likes').unbind().click(function(){
					//console.debug('like');
					toggleWhatsupLike(this);
				});
		},
	});

	setTimeout(function(){
		jobj.scrollTop(0);
	}, 1000);

	jdiv.find('.btn_send').hide();
}

//////////////////////////////////////////////////////////////////////////////

function closeWhatsup(){
	console.debug('closeWhatsup');
	changeBodyView(-1);	// go to previous page	
}

//////////////////////////////////////////////////////////////////////////////

function deleteWhatsup(whatsup_id, jobj){
	console.info('deleteWhatsup', whatsup_id);
	confirmDialog('Are you sure you want to delete this?', function(){
		jobj.closest('.tbl_whatsup_item').remove();
		call_svrop(
			{
				type: 'del_whatsup',
				whatsup_id: whatsup_id,
			},
			function (obj){
				console.info('del_whatsup succeeded', 'whatsup_id='+whatsup_id, jobj);
			}
		);	
	});
}

//////////////////////////////////////////////////////////////////////////////

function clearWhatsup(){
	console.debug('clearWhatsup');
	var jdiv = $('#div_whatsup');
	
	var jgallery = jdiv.find('.uploader_gallery');
	jgallery.empty();
	
	jdiv.find('.uploader_desc').html('');
	jdiv.find('#inp_whatsup_location').val('');
	//jdiv.find('#sel_whatsup_user_group').val(1);
	jdiv.find('.chkbox_mypeers, .chkbox_whatsup_act').prop('disabled', false);
	jdiv.find('[type=checkbox]').removeProp('checked');
}

//////////////////////////////////////////////////////////////////////////////

function toggleWhatsupLike(obj){
	var jobj = $(obj);
	var my_like = jobj.attr('my_like') == 1 ? 0 : 1;
	var jtooltip = jobj.parent();
	var whatsup_id = parseInt(jobj.closest('.tbl_whatsup_item').attr('whatsup_id'));

	console.debug('toggleWhatsupLike', whatsup_id, my_like);	
	
	// toggle heart
	var jimg = jtooltip.find('.whatsup_img_likes');
	jimg.attr('my_like', my_like);
	var heart_color = my_like ? 'red' : 'grey';
	jimg.attr('src', 'images/heart_' + heart_color + '.png');
	
	// update tooltip title
	var title = jtooltip.attr('data-original-title');
	var likes = title == '' ? [] : title.split('<br>');
	//console.debug('bfr', likes);
	var presence = $.inArray(g_user_name, likes) >= 0;
	if (my_like){
		if (!presence && g_user_name != ""){
			likes.push(g_user_name);
		}
	} else {
		if (presence){
			remove_element_from_array(likes, g_user_name);
		}
	}
	likes.sort();
	
	// show number
	var nlike = likes.length;
	jtooltip.find('.nlike').text(nlike);	

	// show tooltip
	jtooltip
		.tooltip("destroy")
		.attr('data-original-title', '')
		.attr('title', likes.join('<br>'))
		.tooltip({html: true})
	;
	removeAllTooltips();	
	if (g_platform != 'web'){
		jtooltip.tooltip("show");
	}
	
	// send to server
	var sendinput = {
		type: 'toggle_whatsup_like',
		user_id: g_user_id,
		whatsup_id: whatsup_id,
		my_like: my_like,
	};

	//setTimeout(function(e){
		// RETRIEVE FROM DB
		call_svrop(
			// INPUT VARIABLES
			sendinput
			// ON SUCCESS
			//,function (obj){
			//}
		);
	//}, 10);
}

//////////////////////////////////////////////////////////////////////////////

function addWhatsupComment(obj){
	var
		jobj = $(obj),
		comment = jobj.val()
	;

	var whatsup_id = parseInt(jobj.closest('.tbl_whatsup_item').attr('whatsup_id'));	
	
	if (comment == ''){
		console.debug('empty comment');
	} else {
		console.debug('addWhatsupComment', comment);
			
		// clear textarea
		jobj.val('');
	
		// send to server
		var sendinput = {
			type: 'add_whatsup_comment',
			whatsup_id: whatsup_id,
			user_id: g_user_id,			
			comment: comment,
		};
	
		// RETRIEVE FROM DB
		call_svrop(
			// INPUT VARIABLES
			sendinput,
			// ON SUCCESS
			function (obj){
				
				// add to comment area (memory)
				var jdiv = jobj.parent().find('.whatsup_comments').show();
				
				var datetime = getDateWithoutSecond(obj.server_time);
				
				var s = '<div class="whatsup_comment"><b>' + g_user_name + '</b> <span class="whatsup_datetime">(' 
					+ datetime + ')</span>: ' + comment;
				
				// add deletion
				s += '<span class="whatsup_del_comment" onclick="delWhatsupComment(' + whatsup_id + ',' + obj.comment_id + ', this)">Delete</span>';
				
				s += '</div>';
				jdiv.append(s);
				
				// ncomment
				var ncomment = jdiv.find('.whatsup_comment').length;
				jdiv.closest('.whatsup_td').find('.ncomment').text(ncomment);
				
				// make it colorful
				var jimg = jdiv.closest('.tbl_whatsup_item').find('.whatsup_img_comments');
				jimg.attr('src', 'images/comment_green.png');
			}
		);	
	}
}

//////////////////////////////////////////////////////////////////////////////

function delWhatsupComment(whatsup_id, comment_id, obj){
	
	console.info('deleteWhatsupItem', whatsup_id, comment_id);
	
	confirmDialog('Are you sure you want to delete this?', function(){
		
		var jobj = $(obj);
		
		call_svrop(
			{
				type: 'del_whatsup_comment',
				whatsup_id: whatsup_id,
				comment_id: comment_id,
			},
			function (obj){
				console.info('del_whatsup_comment succeeded', 'whatsup_id=' + whatsup_id, 'comment_id=' + comment_id);
				var jcomment = jobj.closest('.whatsup_comment');
				var jcomments = jcomment.parent();
				jcomment.remove();
				
				var ncomment = jcomments.find('.whatsup_comment').length;
				// hide if empty
				if (!ncomment){
					jcomments.hide();
					var jimg = jcomments.closest('.tbl_whatsup_item').find('.whatsup_img_comments');
					jimg.attr('src', 'images/comment_grey.png');
				}
				// show comments
				jcomments.closest('.whatsup_td').find('.ncomment').text(ncomment);
			}
		);	
	});
}

///////////////////////////////////////////////////////////////////////////////////////

function sendWhatsup(){
	
	var receivers = getWhatsupReceivers();
	
	// may share only to myself
	//if (!receivers.length){
		//showErrDialog('Error', 'Please choose at least 1 option share with.');		
		//return;
	//}
	
	var
		jdiv = $('#div_whatsup'),
		jbut = jdiv.find('.uploader')
		//jgallery = jdiv.find('.uploader_gallery')
	;	
	var media_id_arr = jbut.uploader('getMediaIDArr');
	var media_desc_hash = jbut.uploader('getMediaDescHash');	
	
	console.info('send whatsup', media_id_arr, media_desc_hash, receivers);
	
	//return; // testing

	// RETRIEVE FROM DB
	openProgress2();
	call_svrop(
		{
			type: 'write_whatsup2',
			user_id: g_user_id,
			user_name: g_user_name,
			desc: $('.uploader_desc').html(),
			location: $('#inp_whatsup_location').val(),
			//user_group: $('#sel_whatsup_user_group').val(),
			receivers: receivers,
			media_ids: media_id_arr,
			media_desc_hash: media_desc_hash,
		},
		function (obj){
			closeProgress2();
			openWhatsup();
			notifyDialog('What\'s up is submitted.');
		}
	);
}

///////////////////////////////////////////////////////////////////////////

function getWhatsupReceivers(){
	var jdiv = $('#div_whatsup');	
	var receivers = [];
	// checkbox events
	var public_checked = jdiv.find('.chkbox_public:checked').length?1:0;
	if (public_checked){
		receivers.push(jdiv.find('.chkbox_public').val());
	} else {
		jdiv.find('[type=checkbox]:checked').each(function(){
			receivers.push($(this).val());
		});
	}
	return receivers;
}