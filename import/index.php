<!DOCTYPE html>
<html>
<head>
<title>Import users</title>
<script>
	var
		d = '',
		cssfiles = ''
										+ 'font-awesome.css '
										+ 'jquery-ui1.css jquery-ui2.css '
										+ 'jquery.datetimepicker.css index_yocle.css '
										+ 'a.uploader.css '
										+ 'bootstrap.css bootstrap-alan-only.css bootstrap-dialog.css bootstrap-editable-alan.css '
										+ 'bootstrap-editable.css wysiwyg-color.css '
										+ 'bootstrap.icon-large.css '
										+ 'buttons.dataTables.css '
										+ 'jquery.dataTables-alan.css responsive.dataTables-alan.css '


			,commonjsfiles = ''
										+ 'jquery-3.1.1.js '
										+ 'datatables.js '
										+ 'jquery-ui-1.12.1.js '
										+ 'bootstrap-alan.js bootstrap-dialog.js '

			,myjsfiles = ''
										+ 'index_common.js '
										+ 'a.uploader.js resumable-alan.js '
		,
		arr = [cssfiles, commonjsfiles, myjsfiles],
		g_file_name = ''
	;

	function load_script(path, s){
		path = '../dev/' + path;
		if (s) path += '?d=' + s;
		var sNew = document.createElement("script");
		sNew.async = false;
		sNew.src = path;
		document.head.appendChild(sNew);
	}
	function load_css(path, s){
		path = '../dev/' + path;
		if (s) path += '?d=' + s;
		var sNew = document.createElement("link");
		sNew.async = false;
		sNew.href = path;
		sNew.type = "text/css";
		sNew.rel = "stylesheet";
		document.head.appendChild(sNew);
	}
	arr.forEach(function(files){
		if (files){
			files.split(' ').forEach(function(file){
				if (file.indexOf('.css') > 0){
					load_css('./' + file, d);
				} else if (file.indexOf('.js') > 0){
					load_script('./' + file, d);
				}
			})
		}
	});

	window.onload = function(){

		$('#div_input').show();
		$('#div_output').hide();

		// inituploader
		var juploader = $('#uploader_users');
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
				g_file_name = obj.file;
				$('#span_filename').text(g_file_name);

				updateImportUsers(obj);

				$('#div_input').hide();
				$('#div_output').show();
			}
		};
		juploader.uploader(opts);

		// show button
		$('label[for=uploader_users]')
			.css('width', 150)
			.show()
		;

		$('#but_cancel').click(function(){
			$('#div_input').show();
			$('#div_output').hide();
		});

		$('#but_apply').click(function(){
			$.ajax({
				type: 'POST',
				url: 'import_users.php',
				async: true,
				dataType: 'json',
				data: {
					file_name: g_file_name,
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
	}

	///////////////////////////////////////////////////////////////

	function updateImportUsers(obj){
		var 
			users = obj.users,
			creates = obj.creates,
			updates = obj.updates,
			warnings = obj.warnings
		;

		// prepare table
		var jtbl = $('.my_datatable'), dt = 0;
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

		$('#span_created').text(ncreated);
		$('#span_updated').text(nupdated);
		$('#span_same').text(nsame);
		$('#span_total').text(ntotal);
		
		$('#span_users').text(user_ids.join(', '));
		$('#span_creates').html(creates.join('<br/>'));
		$('#span_updates').html(updates.join('<br/>'));
		$('#span_warnings').html(warnings.join('<br/>'));

		if (ncreated || nupdated){
			$('#but_apply').show();
		} else {
			$('#but_apply').hide();			
		}
	}

</script>
<link rel="stylesheet" type="text/css" href="import_users.css">

</head>
<body>

<div id="div_input" style="display:none">
	<table style="width:100%; height:100%">
		<tr>
			<td width="100">
				<input id="uploader_users" class="uploader" type="file" accept=".txt,.csv" data-title="Upload users file"/>
			</td>
		</tr>
	</table>
</div>

<div id="div_output" style="display:none">

	<div id="div_filename">File name: <span id="span_filename"></span></div>
	<table class="my_datatable display nowrap" style="width:100%">
		<thead>
			<td>ID</td>
			<td>email</td>
			<td>name</td>
			<td>gender</td>
			<td>birthday</td>
			<td>status</td>
		</thead>
	</table>

	<div class="div_stat">
		Created: <span id="span_created"></span>
		Updated: <span id="span_updated"></span>
		Same: <span id="span_same"></span>
		Total: <span id="span_total"></span>
	</div>
	
	<br/>
	<div class="div_stat">Users: <span id="span_users"></span></div>

	<br/>
	<div>Creates:</div>
	<div id="span_creates" style="color:black;"></div>

	<br/>
	<div>Updates:</div>
	<div id="span_updates" style="color:blue;"></div>
	
	<br/>
	<div>Warnings:</div>
	<div id="span_warnings" style="color:red;"></div>

	<br/>
	<button id="but_apply" class="btn btn-success">Apply</button>
	<button id="but_cancel" class="btn btn-primary">Cancel</button>
</div>

</body>
</html>
