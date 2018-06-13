<html>
<head>
<!--
<link rel="stylesheet" type="text/css" href="./jscroll.css" />
-->
<!--
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
<script src="https://jscroll.com/jquery.jscroll.min.js"></script>
-->
<script src="./jquery-3.1.1.js"></script>
<script src="./jquery.jscroll.js"></script>

<script>
	window.onload = function(){
		//alert(1);
		var jobj = $('.jscroll');
		//console.debug(jobj);
		jobj.jscroll({
			debug: true,
			autoTrigger: true,
			loadingHtml: '<img src="loading.gif" alt="Loading"/> Loading...',
			nextSelector: '.next a:last',
			contentSelector: '.contents',
			padding: 20,
		});
		//alert(2);
	}
</script>
<style>
</style>
</head>

<body>

<div class="jscroll" style="height:100%; overflow-y:scroll">
	<div class="next"><a href="./example-page1.html">next page</a></div>
</div>

</body>
</html>