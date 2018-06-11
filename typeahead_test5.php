<html>
<head>
<link href="//getbootstrap.com/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
<script src="//getbootstrap.com/dist/js/bootstrap.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.10.4/typeahead.bundle.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/typeahead.js/0.10.4/bloodhound.js"></script>
<script src="handlebars-v4.0.5.js"></script>
<link href="typeahead_test5.css" rel="stylesheet">
<script>

var image_url = 'svrop.php?type=dl_img&img_id=';

function initTypeahead(){
	// Instantiate the Bloodhound suggestion engine
	var blood = new Bloodhound({
			datumTokenizer: function (datum) {
				return Bloodhound.tokenizers.whitespace(datum.value);
			},
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
					url: 'typeahead_svrop5.php?q=%QUERY',
					filter: function (items){
						console.info('filter', items);
						return $.map(items.results, function (item){
							return {
								username: 						item.username,
								email: 								item.email,
							};
						});
					}
			}
	});

	// Initialize the Bloodhound suggestion engine
	blood.initialize();

	// Instantiate the Typeahead UI
	$('.typeahead').typeahead(
	{
		hint: true,
		highlight: true,
		minLength: 1,
		change: function(){
			console.info('test');
		}
	},
	{
		displayKey: 'username',
		source: blood.ttAdapter(),
		templates: {
			suggestion: Handlebars.compile(
				'<table class="typeahead_res"><tr><td rowspan="2"><img src="' + image_url + '{{email}}"/></td><td><b>{{username}}</b></td></tr><tr><td>{{email}}</td></tr></table>'
			),
			footer: Handlebars.compile('<b style="padding:6px">Searched for "{{query}}"</b>')
		}
	});
}

$(window).load(function(){
	initTypeahead();
});

</script>
</head>

<body>
<div style="margin-left:100px; margin-top:100px; width:500px">
	<input class="typeahead" placeholder="Find participants...">
</div>
</body>
</html>
