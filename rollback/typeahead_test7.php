<html>
<head>
<link href="bootstrap-alan.css" rel="stylesheet">
<link href="typeahead_test5.css" rel="stylesheet">
<link href="bootstrap-tokenfield.css" rel="stylesheet">
<link href="tokenfield-typeahead.css" rel="stylesheet">

<script src="jquery-1.12.4.js"></script>
<script src="bootstrap.js"></script>
<script src="typeahead.bundle.js"></script>
<script src="bloodhound.js"></script>
<script src="handlebars-v4.0.5.js"></script>
<script src="typeahead-alan.js"></script>
<script src="bootstrap-tokenfield.js"></script>
<script src="index_common.js"></script>

<script>
$(window).load(function(){
	initTypeahead('#inp_typeahead1');
	initTypeahead_tokenfield_users('#inp_typeahead2');
});
	
</script>
</head>

<body>
<div style="margin-left:100px; margin-top:100px; width:500px">
	<input id="inp_typeahead1" placeholder="Find participants...">
	<input id="inp_typeahead2" placeholder="Find participants...">
</div>
</body>
</html>