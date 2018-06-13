<title>uploader test</title>
<script>
function load_script(path, s){
	if (s) path += '?d=' + s;
	s = '<script src="' + path + '" type="text/javascript"><\/script>';
	document.writeln(s);
}
function load_css(path, s){
	if (s) path += '?d=' + s;
	s = '<link href="' + path + '"  type="text/css" rel="stylesheet"\/>';
	document.writeln(s);
}
function getDateString(){
	var d = new Date();
	return d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
}

function mobileAndTabletcheck(){
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
}
var s = getDateString();
var bIsMobile = mobileAndTabletcheck();			
if (!bIsMobile)
{
	s = '';	// testing only
}

// Development loader
var cssfiles			= 'a.uploader.css featherlight.css featherlight.gallery.css ';
var commonjsfiles	= 'jquery-1.12.3-alan.js jquery-ui.js resumable-alan.js progressbar.js featherlight.js '; //featherlight.gallery.js ';
var myjsfiles			=	'a.uploader.js svrop.js ';
var myroom = '';

[cssfiles, commonjsfiles, myjsfiles].forEach(function(files){
	files.split(' ').forEach(function(file){
		if (file.indexOf('.css') > 0){
			load_css(file, s);
		} else {
			load_script(file, s);
		}
	})
});

////////////////////////////////////////////////////////////////////////

window.onload = function(){
	initAll();
}


////////////////////////////////////////////////////////////////////////
// http://stackoverflow.com/questions/36229123/return-only-matched-sub-document-elements-within-a-nested-array/36230475#36230475
// But the analysis should show you why you "probably" should not do this, and instead just filter the array in code.
////////////////////////////////////////////////////////////////////////

function initAll(){

	// 1. USER MEDIA
	initUploader($('.uploader1'), $('.gallery1'), 	'user', 		{user_id: 23}, function(media_arr){//, media_id_arr){
		// UPDATE TO READ ONLY
		if ($('.gallery1r.uploader_init').length){
			$('.gallery1r').uploader('loadGallery', media_arr);
		}
	});
	initUploader($('.gallery1r'),	$('.gallery1r'), 	'user',			{user_id: 23});

	// 2. ACTIVITY
	initUploader($('.uploader2'),	$('.gallery2'), 	'activity', 	{act_id: 1});
	
	// 3. ASSESSMENT
	initUploader($('.uploader3'),	$('.gallery3'), 	'assessment', 	{act_id: 1, ass_id:1});

	// 4. ASSESSMENT ITEM 
	initUploader($('.uploader4'),	$('.gallery4'), 	'item', 				{act_id: 1, ass_id:1, ass_item_id:1}); 
}

</script>

<style>
body{
	font-family: sans-serif;
	margin:10px;
	padding:10px;
}
label.uploader_label{
	padding: 25px;
	font-size: 26px;
}
</style>

<table border="0" width="100%">

	<tr>
		<td>
			User:
		</td>
		<td align="right" style="width:10px">
			<input class="uploader1" type="file" accept="*/*" data-title="Add"> <!--image/*; video/*; capture=camcorder-->
		</td>
	</tr>
	<tr>
		<td colspan="2" width="100%">
			<div class="gallery1"></div>
		</td>
	</tr>
	<tr>
		<td colspan="2" width="100%">
			<div class="gallery1r"></div>
		</td>
	</tr>
	
	<tr>
		<td>
			Activity:
		</td>
		<td align="right" style="width:10px">
			<input class="uploader2" type="file" accept="*/*" data-title="Add"> <!--image/*; video/*; capture=camcorder-->
		</td>
	</tr>
	<tr>
		<td colspan="2" width="100%">
			<div class="gallery2"></div>
		</td>
	</tr>
	
	<tr>
		<td>
			Assessment:
		</td>
		<td align="right" style="width:10px">
			<input class="uploader3" type="file" accept="*/*" data-title="Add"> <!--image/*; video/*; capture=camcorder-->
		</td>
	</tr>
	<tr>
		<td colspan="2" width="100%">
			<div class="gallery3"></div>
		</td>
	</tr>
	
	<tr>
		<td>
			Assessment Items:
		</td>
		<td align="right" style="width:10px">
			<input class="uploader4" type="file" accept="*/*" data-title="Add"> <!--image/*; video/*; capture=camcorder-->
		</td>
	</tr>
	<tr>
		<td colspan="2" width="100%">
			<div class="gallery4"></div>
		</td>
	</tr>
	
</table>
