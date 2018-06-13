/*
function init_tinymce(ta_selector, default_value, onchange, oninit){

	console.log('init_tinymce', ta_selector, typeof default_value);

	tinymce.init({
		selector: ta_selector,
		theme: "modern",
		//inline: true,
		menubar: false,
		relative_urls: false,
		//remove_script_host: true,
		plugins: [
			"contextmenu",
			"autoresize advlist autolink lists link image charmap hr anchor pagebreak",
			"searchreplace wordcount visualblocks visualchars code fullscreen",
			"insertdatetime media nonbreaking save table directionality",
			"emoticons template paste textcolor colorpicker textpattern table media"	// mediaembed
		],
		toolbar1: "bold italic alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link forecolor backcolor emoticons | table image media undo redo",

		//file_browser_callback_types: 'file image media',
		file_browser_callback_types: 'image media',
		file_picker_callback: function(callback, value, meta) {
			var type = meta.filetype;
			console.log(type, meta);

			// recreate
			$('#div_tinymce')
				.html('<input id="upload_tinymce" name="image" type="file" style="display:none" onchange="">');

			// simulate a file upload
			$('#upload_tinymce')
					.trigger('click')
					.on('change', function(){
						var file = this.files[0];
						insert_tinymce_media(file, callback);
					})

		},
		image_advtab: true,
		paste_data_images: true,
		media_live_embeds: true,
		mediaembed_max_width: 450,
		//contextmenu_never_use_native: true,
		init_instance_callback: function (editor){
			console.log('init_instance_callback', typeof default_value);
			if (default_value){
				editor.setContent(default_value);
			}
			editor.on('blur', function (e) {
				//console.log('Editor was blurred!');
				//updateBlg(editor.getContainer());
				var container = editor.getContainer();
				var value = tinyMCE.activeEditor.getContent()
				console.log('tinymce_onchange', container, value);
				onchange && onchange(container, value);
			});
			oninit && oninit(unique_name);
		},
	});

}
*/
/*
						switch (type){

							case 'image':
								// replace by a.uploader
								var reader = new FileReader();
								reader.onload = function(e) {
									var source = e.target.result;
									callback(source, {alt: ''});
								};
								reader.readAsDataURL(file);
								//var source = getMediaFolder() + '1000.png';
								//callback(source, {alt: ''});
								break;

							case 'media':
								console.log('upload now', file);
								insertMedia(file, callback);
								break;
						}
*/

/////////////////////////////////////////////////////////////////////////////
var g_onsave_hash = {};

function init_tinymce_editable(unique_name, default_value, onsave, oninit){// oncanc){
	console.log('init_tinymce_editable', unique_name, typeof default_value);
	if (typeof default_value != 'string'){
		default_value = '';
	}
	var
		ta_edit = 'ta_tinymce_' + unique_name,
		ta_edit_id = '#' + ta_edit,
		jbut_edit = $('#but_tinymce_' + unique_name),
		jparent = $('#div_tinymce_' + unique_name),
		jtiny = tinyMCE.get(ta_edit)
	;
	g_onsave_hash[unique_name] = onsave;

	if (!jbut_edit.hasClass('div_tinymce_edit')){
		jbut_edit.addClass('div_tinymce_edit');
	}

	if (jparent.find('.div_tinymce_view').length){
		// DOM EXISTS
		jtiny && jtiny.setContent(default_value);
		oninit && oninit(unique_name);

		var jdiv_view = jparent.find('.div_tinymce_view').html(default_value).show();
		close_tinymce(unique_name);

	} else {
		// DOM DOES NOT EXIST
		jtiny && jtiny.remove();
		jparent.html(
			'<div>' +
				'<div class="div_tinymce_view"></div>' +
				'<div class="div_tinymce_edit"><textarea id="' + ta_edit + '"></textarea></div>' +
				'<div class="div_tinymce_btnpanel">' +
					'<button class="btn btn-primary btn-sm editable-submit but_save"><i class="glyphicon glyphicon-ok"></i></button> &nbsp; ' +
					'<button class="btn btn-default btn-smeditable-cancel but_canc"><i class="glyphicon glyphicon-remove"></i></button>' +
				'</div>' +
			'</div>'
		);

		var jdiv_view = jparent.find('.div_tinymce_view').html(default_value).show();
		var jdiv_edit = jparent.find('.div_tinymce_edit');
		var jbut_save = jparent.find('.but_save');
		var jbut_canc = jparent.find('.but_canc');
		close_tinymce(unique_name);

		$(ta_edit_id)
			.addClass('ta_tinymce')
			.attr('unique_name', unique_name)
		;
		//init_tinymce(ta_edit_id, default_value, function(container, value){
		//	console.log('onchange', container, value);
			//current_value = value;
		//}, onsave, oninit);

		// init tinymce
		tinymce.init({
			selector: ta_edit_id,
			theme: "modern",
			//inline: true,
			menubar: false,
			relative_urls: false,
			//remove_script_host: true,
			plugins: [
				"contextmenu",
				"autoresize advlist autolink lists link image charmap hr anchor pagebreak",
				"searchreplace wordcount visualblocks visualchars code fullscreen",
				"insertdatetime media nonbreaking save table directionality",
				"emoticons template paste textcolor colorpicker textpattern table media"	// mediaembed
			],
			toolbar1: "bold italic alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link forecolor backcolor emoticons | table image media undo redo",

			//file_browser_callback_types: 'file image media',
			file_browser_callback_types: 'image media',
			file_picker_callback: function(callback, value, meta) {
				var type = meta.filetype;
				console.log(type, meta);

				var accept_media = '';
				switch (type){
					case 'image':
						accept_media = 'image/*';
						break;
					case 'media':
						accept_media = 'video/*';
						break;
				}

				// recreate
				$('#div_tinymce')
					.html('<input id="upload_tinymce" name="image" type="file" style="display:none" accept="' + accept_media + '" capture=camcorder" onchange="">');

				// simulate a file upload
				$('#upload_tinymce')
						.trigger('click')
						.on('change', function(){
							var file = this.files[0];
							insert_tinymce_media(file, callback);
						})

			},
			image_advtab: true,
			paste_data_images: true,
			media_live_embeds: true,
			mediaembed_max_width: 450,
			//contextmenu_never_use_native: true,
			setup: function(ed){
			    ed.on('init', function() {
			        $(ed.getWin()).bind('resize', function(e){
			            console.log('Editor window resized!');
									transdiv_resize();
			        })
			    });
			},

			init_instance_callback: function (editor){
				console.log('init_instance_callback', typeof default_value);
				if (default_value){
					editor.setContent(default_value);
				}
				editor.on('blur', function (e) {
					var container = editor.getContainer();
					var value = tinyMCE.activeEditor.getContent()
					console.log('tinymce_onchange', container, value);
					onchange && onchange(container, value);
				});

				oninit && oninit(unique_name);

				jbut_edit.click(function(){
					console.log('edit', ta_edit);
					open_tinymce(unique_name);
					var value = jdiv_view.html();
					tinyMCE.get(ta_edit).setContent(value);
				});
				jbut_save.click(function(){
					console.log('save', ta_edit);
					close_tinymce(unique_name, 1);
				})
				jbut_canc.click(function(){
					console.log('canc', ta_edit);
					close_tinymce(unique_name, 0);
				});

			},
		});
	}


}
////////////////////////////////////

function clear_tinymce_edit(){
	$('.div_tinymce_edit').prop('disabled', false);
}

//////////////////////////////////////////////////////

function open_tinymce(unique_name){

	close_tinymce_all(1);

	var
		ta_edit = 'ta_tinymce_' + unique_name,
		ta_edit_id = '#' + ta_edit,
		jbut_edit = $('#but_tinymce_' + unique_name),
		jparent = $('#div_tinymce_' + unique_name),
		jtiny = tinyMCE.get(ta_edit),
		jdiv_view = jparent.find('.div_tinymce_view'),
		jdiv_edit = jparent.find('.div_tinymce_edit'),
		jbut_save = jparent.find('.but_save'),
		jbut_canc = jparent.find('.but_canc'),
		jpanel = jparent.find('.div_tinymce_btnpanel')
	;

	jdiv_view.hide();
	jdiv_edit.show();
	jbut_edit.prop('disabled', true);
	jbut_save.show();
	jbut_canc.show();
	jpanel.show();

	scroll2Element(jdiv_edit, function(){
		transdiv_resize();
	});
}

//////////////////////////////////////////////////////

function close_tinymce(unique_name, save_edit_value){
	var
		ta_edit = 'ta_tinymce_' + unique_name,
		ta_edit_id = '#' + ta_edit,
		jbut_edit = $('#but_tinymce_' + unique_name),
		jparent = $('#div_tinymce_' + unique_name),
		jtiny = tinyMCE.get(ta_edit),
		jdiv_view = jparent.find('.div_tinymce_view'),
		jdiv_edit = jparent.find('.div_tinymce_edit'),
		jbut_save = jparent.find('.but_save'),
		jbut_canc = jparent.find('.but_canc'),
		jpanel = jparent.find('.div_tinymce_btnpanel')
	;

	if (save_edit_value && jdiv_edit.is(":visible")){
		var value = tinyMCE.get(ta_edit).getContent();
		jdiv_view.html(value);
		if (g_onsave_hash[unique_name]){
			g_onsave_hash[unique_name](unique_name, value);
		}
	}
	jdiv_view.show();
	jdiv_edit.hide();
	jbut_edit.prop('disabled', false);
	jbut_save.hide();
	jbut_canc.hide();
	jpanel.hide();
}

////////////////////////////////////////////////////

function close_tinymce_all(save_edit_value){
	// close all others
	$('.ta_tinymce').each(function(){
		var
			unique_name = $(this).attr('unique_name'),
			jdiv_edit = $(this).closest('.div_tinymce_edit')
		;
		if (jdiv_edit.is(':visible')){
			close_tinymce(unique_name, save_edit_value); // no onsave though
		}
	})
}

////////////////////////////////////////////////////
// insertmedia

function insert_tinymce_media(file, callback){

	console.log('insert_tinymce_media', file);

	var	uid = 1;
	////////////////////////////////////////////////
	// CREATE RESUMABLE
	////////////////////////////////////////////////
	var r = new Resumable({
		target: './svrop.php',
		query: {
			type: "ul_media",
			//data_type: "blog",
			//ids: {blog_id: 0},
			data_type: "tinymce",
			ids: {tinymce_id: 0},
		},
		testChunks: 0,	// overwrite everytime
	});
	r.added = 0;
	r.uid = uid;

	console.log('resumable', uid, r);

	// EVENTS
	r.on('fileAdded', function(file){

		var robj = this;	// resumable obj

		//////////////////////////////////////////////////////////
		// ONFILEADDED
		//////////////////////////////////////////////////////////
		// FIND THE LOCAL FILE
		var
			uid = robj.uid,
			file_id = file.uniqueIdentifier,
			file_name = file.fileName,
			file_cat = mime2cat(file.file.type),
			blob_url = URL.createObjectURL(file.file)
		;
		console.log('fileAdded uid=' + uid);

		////////////////////////////////////////////////////////////
		// ADD PREVIEW (=DESTINATION)
		////////////////////////////////////////////////////////////
		if (!file_cat || file_cat == ''){
			r.removeFile(file);
		} else {
			robj.upload();
		}
	});

	///////////////////////////////////////////////////////////////////////////////////////////////////////

	r.on('fileProgress', function(file){
		var robj = this;
		var progress = file.progress();
		console.log('fileProgress uid=' + uid, progress);
		//debugger;
		if (file.pbar){
			file.pbar.set(progress);	// (0-1, 1=100%)
		} else {
			//console.error('file.pbar not created yet');
		}
	});

	///////////////////////////////////////////////////////////////////////////////////////////////////////
	// right after a file is uploaded

	r.on('fileSuccess', function(file, message){
		var robj = this;
		var jdiv = file.jdiv,
			//jsvg = jdiv.find('svg'),
			file_cat = mime2cat(file.file.type);
			error = file.error ? file.error : 0,
			media_id = file.media ? file.media.media_id : 0,
			file_name = file.media ? file.media.file_name : '',
			file_id = file.uniqueIdentifier,
			file_size = file.size,
			root = g_parent_url
		;
		if (root.indexOf('/dev') > 0){
			root = root.replace('/dev', '');
		}
		var url = root + 'media/' + file_name;

		// conplete the pbar
		if (file.pbar){
			file.pbar.set(1);	// (0-1, 1=100%)
		}

		// add media_id
		if (jdiv){
			jdiv
				.attr('media_id', media_id)
				.attr('file_name', file_name)
				.attr('file_id', 0);
			;
		}
		// remove file_id
		var file = r.getFromUniqueIdentifier(file_id);
		r.removeFile(file);

		// debug
		console.log('fileSuccess uid=' + uid, 'media_id='+media_id, url);

		// callback
		callback(url);
	});

	///////////////////////////////////////////////////////////////////////////////////////////////////////

	r.on('complete', function(){
		var robj = this;
		console.info('auploader complete', robj.uid);
		robj.cancel();	// restart
		robj.added = 0;
	});

	///////////////////////////////////////////////////////////////////////////////////////////////////////

	r.on('fileError', function(file, message){
		var robj = this;
		r.removeFile(file);
		alert('resumable file error', message);
	});

	r.addFile(file);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function get_tiny_contents(unique_name){
	return get_tiny_contents2($('#div_tinymce_' + unique_name));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function get_tiny_contents2(jparent){
	return jparent.find('.div_tinymce_view').html();
}
