var g_imported_user_ids = [];

function init_import_users(){
	var jdiv = $('#div_import_users'),
		jdiv_input = jdiv.find('.div_input'),
		jdiv_output = jdiv.find('.div_output')
	;

	jdiv_input.show();
	jdiv_output.hide();

	// inituploader
	var juploader = jdiv.find('.uploader_users');

	// CREATE UPLOADER
	var opts = {
		target: 				'./import_users.php',
		upload_query: 	{type: 'ul_media'},
		allowtext: 			1,
		onUploaderSuccess: function(file, output){
			var obj = 0;

			try {
				obj = JSON.parse(output);
			} catch (e){}

			if (!obj){
				errorDialog('parse error');
			} else if (obj.error){
				errorDialog(obj.error);
				return;
			}

			console.log('onUploaderSuccess', obj);
			g_import_file = obj.file;
			jdiv.find('.span_filename').text(g_import_file);

			updateImportUsers(obj);

			jdiv_input.hide();
			jdiv_output.show();
		}
	};
	juploader.uploader(opts);

	// show button
	$('label[for=uploader_users]')
		.css('width', 150)
		.show()
	;

	jdiv.find('.but_back').click(function(){
		jdiv_input.show();
		jdiv_output.hide();
	});

	jdiv.find('.but_apply').click(function(){
		$.ajax({
			type: 'POST',
			url: 'import_users.php',
			async: true,
			dataType: 'json',
			data: {
				file_name: g_import_file,
				apply: 1,
			},
			success: function (obj){
				console.log('success', obj);
				updateImportUsers(obj);
				notifyDialog('The changes have been applied.');
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.error('error', jqXHR, textStatus, errorThrown);
				errorDialog('Error in applying.');
			},
		});
	});
	jdiv.find('.but_cancel').click(function(){
		if (parent){
			parent.window.$.featherlight.current().close();
		}
	});

	jdiv.find('.but_select').click(function(){
		if (parent){
			parent.window.onselect_importusers(g_imported_user_ids);
			parent.window.$.featherlight.current().close();
		}
	});
}

///////////////////////////////////////////////////////////////

function updateImportUsers(obj){
	var
		jdiv = $('#div_import_users'),
		users = obj.users,
		creates = obj.creates,
		updates = obj.updates,
		warnings = obj.warnings
	;

	// prepare table
	var jtbl = jdiv.find('.my_datatable'), dt = 0;
	if (!jtbl.hasClass('dataTable')){
		dt = jtbl.DataTable({
			ordering: true,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				//{	targets: [ 0 ],	orderable: false,	},
			],
			"order": [[ 1, "asc" ]],
		});
	} else {
		dt = jtbl.show().DataTable().clear().draw();
	}

	var ncreated = 0, nupdated = 0, nsame = 0, ntotal = 0, user_ids = [];
	if (users){
		for (var i = 0; i < users.length; i++){
			var user = users[i];
			console.log(user);
			dt.row.add([
				user.user_id,
				user.email,
				user.username,
				user.gender,
				user.birthday,
				user.status
			]);
			switch (user.status){
				case 'created': ncreated++; break;
				case 'updated': nupdated++;	break;
				case 'same': nsame++;	break;
			}
			ntotal++;
			if (user.user_id){
				user_ids.push(user.user_id);
			}
		}
		dt.draw();
	}

	user_ids.sort(function(a,b){return a-b});
	g_imported_user_ids = user_ids;

	jdiv.find('.span_created').text(ncreated);
	jdiv.find('.span_updated').text(nupdated);
	jdiv.find('.span_same').text(nsame);
	jdiv.find('.span_total').text(ntotal);

	jdiv.find('.span_users').text(user_ids.join(', '));
	jdiv.find('.span_creates').html(creates.join('<br/>'));
	jdiv.find('.span_updates').html(updates.join('<br/>'));
	jdiv.find('.span_warnings').html(warnings.join('<br/>'));

	if (ncreated || nupdated){
		jdiv.find('.but_apply').show();
	} else {
		jdiv.find('.but_apply').hide();
	}
}
