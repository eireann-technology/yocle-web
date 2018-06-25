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
		g_import_file = ''
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
		init_import_users();
	}

</script>
<link rel="stylesheet" type="text/css" href="import_users.css">
<script src="./import_users.js"></script>
</head>
<body>

<div id="div_import_users">
	<div class="div_input" style="display:none">
		<table style="width:100%; height:100%">
			<tr>
				<td>
					<b>Import users by file (including user registration)</b><br/>
					Require a text file with multiple lines in the following format:<br/>
					[email],[name],[gender],[birthday: yyyy-mm-dd]
				</td>
			</tr>
			<tr>
				<td>
					<input class="uploader_users" class="uploader" type="file" accept=".txt,.csv" data-title="Upload users file"/>
				</td>
			</tr>
		</table>
	</div>

	<div class="div_output" style="display:none">

		<div>File name: <span class="span_filename"></span></div>
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
			Created: <span class="span_created"></span>
			Updated: <span class="span_updated"></span>
			Same: <span class="span_same"></span>
			Total: <span class="span_total"></span>
		</div>

		<br/>
		<div class="div_stat">Users: <span class="span_users"></span></div>

		<br/>
		<div>Creates:</div>
		<div class="span_creates" style="color:black;"></div>

		<br/>
		<div>Updates:</div>
		<div class="span_updates" style="color:blue;"></div>

		<br/>
		<div>Warnings:</div>
		<div class="span_warnings" style="color:red;"></div>

		<br/>
		<button class="but_cancel btn btn-warning">Cancel</button>
		<button class="but_back btn btn-primary">Back</button>
		<button class="but_apply btn btn-primary">Apply</button>
		<button class="but_select btn btn-success">Select</button>
	</div>
</div>

</body>
</html>
