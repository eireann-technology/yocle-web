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
			loadingHtml: '<img src="./images/jscroll_loading.gif" alt="Loading"/> Loading...',
			nextSelector: '.jscroll-next',
			contentSelector: '',
			padding: 20,
			callback: function(){
				console.debug('callback');
			},
		});
		//alert(2);
	}
</script>
<style>
.whatsup_photo{
	width:28px;
	border-radius:8px;
}
.whatsup_media{
	width:300px;
	border-radius:8px;
}
.whatsup_td2, .whatsup_td3{
	padding-left:30px;
}
</style>
</head>

<body>

<div class="jscroll" style="height:100%; overflow-y:scroll">
	<a class="jscroll-next" href="./svrop.php?type=read_whatsup&g_user_id=3&page=1&limit=2"></a>
</div>

</body>
</html>