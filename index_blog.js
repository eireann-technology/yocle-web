var USRGRP_ACTPEERS_SPECIFIC = 100;

function initBlog(){
	$('.inp_blog_search').keyup(function(){
		openBlog();
	});
}

/////////////////////////////////////////////////////////////////////////////

var g_jscroll_blog = 0;

function openBlog(){
	console.info('openBlog');

	clearBlog();

	changeBodyView(PAGE_BLOG);

	var jdiv = $('#div_blog');

	if (g_jscroll_whatsup){
		g_jscroll_whatsup.jscroll.destroy();
		g_jscroll_whatsup = 0;
	}
	if (g_jscroll_blog){
		g_jscroll_blog.jscroll.destroy();
		g_jscroll_blog = 0;
	}

	var jscroll = g_jscroll_blog = $('.div_blog_output'); 


	// create new one
	var
		w = g_nScreenW - 100,
		limit = 2,
		filter = $('.inp_blog_search').val(),
		shtml = '<a class="jscroll-next" href="./svrop.php?type=read_blog&filter=' + filter + '&user_id=' + g_user_id + '&limit=' + limit + '&width=' + w + '"></a>'
	;
	jscroll
		.show()
		//.height(g_nScreenH - 206)
		//.empty()
		.html(shtml)
	;
	// remove previous one https://github.com/pklauzinski/jscroll/issues/6

	jscroll
		.jscroll({
			debug: true,
			autoTrigger: true,
			//autoTriggerUntil: 100,
			//loadingHtml: '<img src="./images/jscroll_loading.gif" alt="Loading"/> Loading...',
			loadingHtml: '',
			nextSelector: '.jscroll-next',
			contentSelector: '',
			padding: 20,
			triggerEl: $(document.body),
			callback: function(a){
				// tooltip
				var jdiv = jscroll.find('.blog_tooltip');
				jdiv.tooltip({html: true});

				// autogrow
				jscroll.find('.blog_mycomments').autoGrow().unbind().keypress(function(e){
					//console.debug(e.which, e);
					if (e.which == 13 && !e.shiftKey){
						addBlogComment(this);
						e.stopPropagation();
						return false;
					}
				});

				// like action
				jscroll.find('.blog_img_likes').unbind().click(function(){
					//console.debug('like');
					toggleBlogLike(this);
				});
		},
	});

	jdiv.find('.btn_send').hide();
	checkOnResize();
}

//////////////////////////////////////////////////////////////////////////////

function closeBlog(){
	console.debug('closeBlog');
	changeBodyView(-1);	// go to previous page
}

//////////////////////////////////////////////////////////////////////////////

function deleteBlog(blog_id, jobj){
	console.info('deleteBlog', blog_id);
	confirmDialog('Are you sure you want to delete this?', function(){
		jobj.closest('.tbl_blog_item').remove();
		call_svrop(
			{
				type: 'del_blog',
				blog_id: blog_id,
			},
			function (obj){
				console.info('del_blog succeeded', 'blog_id='+blog_id, jobj);
			}
		);
	});
}

//////////////////////////////////////////////////////////////////////////////

function clearBlog(){
	console.debug('clearBlog');
	var jdiv = $('#div_blog');

	var jgallery = jdiv.find('.uploader_gallery');
	jgallery.empty();

	jdiv.find('.uploader_desc').html('');
	jdiv.find('#inp_blog_location').val('');
	//jdiv.find('#sel_blog_user_group').val(1);
	jdiv.find('.chkbox_mypeers, .chkbox_blog_act').prop('disabled', false);
	jdiv.find('[type=checkbox]').removeProp('checked');
}

//////////////////////////////////////////////////////////////////////////////

function toggleBlogLike(obj){
	var
		jobj = $(obj),
		my_like = jobj.attr('my_like') == 1 ? 0 : 1,
		jtooltip = jobj.parent(),
		jitem = jobj.closest('.div_blg_item'),
		user_id = parseInt(jitem.attr('user_id')),
		act_id = parseInt(jitem.attr('act_id')),
		ass_id = parseInt(jitem.attr('ass_id'))
		item_id = parseInt(jitem.attr('item_id'))
	;
	console.log('toggleBlogLike', user_id, act_id, ass_id, item_id, my_like);

	// send to server
	var sendinput = {
		type: 'toggle_blog_like',
		my_user_id: g_user_id,
		user_id: user_id,
		act_id: act_id,
		ass_id: ass_id,
		item_id: item_id,
		//blog_id: blog_id,
		my_like: my_like,
	};

	//setTimeout(function(e){
	// RETRIEVE FROM DB
	call_svrop(

		// INPUT VARIABLES
		sendinput,

		// ON SUCCESS
		function (obj){

			// toggle heart
			var jimg = jtooltip.find('.blog_img_likes');
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

		}
	);
	//}, 10);
}

//////////////////////////////////////////////////////////////////////////////

function addBlogComment(obj){
	var
		jobj = $(obj),
		jitem = jobj.closest('.div_blg_item'),
		user_id = parseInt(jitem.attr('user_id')),
		act_id = parseInt(jitem.attr('act_id')),
		ass_id = parseInt(jitem.attr('ass_id'))
		item_id = parseInt(jitem.attr('item_id')),
		comment = jobj.val()
	;
	console.log('addBlogComment', user_id, act_id, ass_id, item_id, comment);

	if (comment == ''){
		console.debug('empty comment');
	} else {
		console.debug('addBlogComment', comment);

		// clear textarea
		jobj.val('');

		// send to server
		var sendinput = {
			type: 'add_blog_comment',
			//blog_id: blog_id,
			my_user_id: g_user_id,
			user_id: user_id,
			act_id: act_id,
			ass_id: ass_id,
			item_id: item_id,
			comment: comment,
		};

		// RETRIEVE FROM DB
		call_svrop(
			// INPUT VARIABLES
			sendinput,
			// ON SUCCESS
			function (obj){

				// add to comment area (memory)
				var jdiv = jobj.parent().find('.blog_comments').show();

				var datetime = getDateWithoutSecond(obj.server_time);

				var s = '<div class="blog_comment"><b>' + g_user_name + '</b> <span class="blog_datetime">('
					+ datetime + ')</span>: ' + comment;

				// add deletion
				s += '<span class="blog_del_comment" onclick="delBlogComment(' + obj.comment_id + ', this)">Delete</span>';

				s += '</div>';
				jdiv.append(s);

				// ncomment
				var ncomment = jdiv.find('.blog_comment').length;
				jdiv.closest('.blog_td').find('.ncomment').text(ncomment);

				// make it colorful
				var jimg = jdiv.closest('.tbl_blog_item').find('.blog_img_comments');
				jimg.attr('src', 'images/comment_green.png');
			}
		);
	}
}

//////////////////////////////////////////////////////////////////////////////

function delBlogComment(comment_id, obj){

	var
		jobj = $(obj),
		jitem = jobj.closest('.div_blg_item'),
		user_id = parseInt(jitem.attr('user_id')),
		act_id = parseInt(jitem.attr('act_id')),
		ass_id = parseInt(jitem.attr('ass_id'))
		item_id = parseInt(jitem.attr('item_id'))
	;
	console.log('delBlogComment', user_id, act_id, ass_id, item_id);

	confirmDialog('Are you sure you want to delete this?', function(){

		call_svrop(
			{
				type: 'del_blog_comment',
				user_id: user_id,
				act_id: act_id,
				ass_id: ass_id,
				item_id: item_id,
				comment_id: comment_id,
			},
			function (obj){
				console.info('del_blog_comment succeeded', 'comment_id=' + comment_id);
				var
					jcomment = jobj.closest('.blog_comment'),
					jcomments = jcomment.parent()
				;
				jcomment.remove();

				var ncomment = jcomments.find('.blog_comment').length;
				// hide if empty
				if (!ncomment){
					jcomments.hide();
					var jimg = jcomments.closest('.tbl_blog_item').find('.blog_img_comments');
					jimg.attr('src', 'images/comment_grey.png');
				}
				// show comments
				jcomments.closest('.blog_td').find('.ncomment').text(ncomment);

				// sort the order of the items
				var total_items = $('#div_viewass_part .editable').length;
				$('#div_viewass_part .editable').each(function(){
					$(this).attr('data-itemid', total_items--);
				});
			}
		);
	});
}
