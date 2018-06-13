
<title>Yocle download</title>
<script src="platform.js"></script>
<script>
	// https://github.com/bestiejs/platform.js/
	window.onload = function(){
		var
			site1 = 'yolofolio2.cetl.hku.hk:18443',
			site2 = 'videoboard.hk:8081',
			site3 = 'yocle.net',
			site = site3
		;
		var os = platform.os.toString();
		document.writeln('<div style="font-size:100px">');
		document.writeln(os + '<br><br>');
		if (os.indexOf('iOS') >= 0){
			document.writeln('<a href="itms-services://?action=download-manifest&url=https://' + site + '/manifest.plist">Download and Install iOS App</a>');
		} else if (os.indexOf('Android') >= 0){
			document.writeln('<a href="https://' + site + '/Yocle.apk">Download and Install Android App</a>');
		} else {
			document.writeln('<span style="color:red">Not iOS or Android</span>');
		}
		document.writeln('</div>');
	}
</script>
