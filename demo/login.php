<?php
$method_arr = Array(
	'Abstract', ///Dissertation/Essay/Reviews',
	'Application',///Report',
	'Blog',
	'Case Study',
	'Concept Map',
	'Journal',///Daily or Weekly Logbooks',
	'Learning contract',
	'MCQ',
	'Participation',
	'Porfolio',
	'Poster',
	'Presentation',
	'Reflective Piece',
	'Survey',
	'Wikis'
);
function getSelectMethod($selected){
	global $method_arr;
	$s = '<div class="ui-widget assessment_method">' . '<select class="assessment_combobox">';
	for ($i = 0; $i < sizeof($method_arr); $i++){
		$name = $method_arr[$i];
		$option_selected = $selected == $name ? ' selected' : ''; 
		$s .= '<option'.$option_selected.'>'.$name.'</option>';
	}
	$s .= '</select></div>';
	return $s;
}

///////////////////////////////////////////////////////////////////////////////

$skill_arr = Array(
	'Collaboration',
	'Communication',
	'Creativity',
	'Critical Thinking',
	'Information Technology',
	'Leadingship',
	'Numeracy',
	'Organization',
	'Problem Solving',
	'Self-management',
	'Study',
	'Teamwork',
);
function getSelectSkill($selected){
	global $skill_arr;
	$s = '<div class="ui-widget assessment_skill">' . '<select class="skill_combobox">';
	for ($i = 0; $i < sizeof($skill_arr); $i++){
		$name = $skill_arr[$i];
		$option_selected = $selected == $name ? ' selected' : ''; 
		$s .= '<option'.$option_selected.'>'.$name.'</option>';
	}
	$s .= '</select></div>';
	return $s;
}

?>

<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>YOCLE - Your Out of Classroom Learning Experience</title>
	<link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
	<link rel="manifest" href="/manifest.json">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="msapplication-TileImage" content="/ms-icon-144x144.png">
	<meta name="theme-color" content="#ffffff">
<!--	<script src="./jquery-2.2.4.js"></script>-->
<!--  <script src="//code.jquery.com/jquery-1.10.2.js"></script>-->
<!--  <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>-->
  <link href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css" type="text/css" rel="stylesheet">
	<link href="//ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/overcast/jquery-ui.css" type="text/css" rel="stylesheet" >
<!--	<link rel="stylesheet" href="./font-awesome-4.6.3/css/font-awesome.css">-->
	<script>
		function load_script(path, s){
			if (path.indexOf('trumbowyg.js') < 0 && s) path += '?d=' + s;
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
		var g_bProduction = window.location.href.indexOf('yolofolio.cetl.hku.hk' ) >= 0;
		var g_bIsMobile = mobileAndTabletcheck();			
		var s = getDateString();
		if (!g_bProduction && !g_bIsMobile)
		{
			s = '';	// testing only
		}
		// Development loader
		var cssfiles = ''
											+ 'jquery.datetimepicker.css login.css '
											+ 'jquery.dataTables.css toggles.css star-rating-svg.css '
											+ 'Trumbowyg-2.1.0/dist/ui/trumbowyg.css Trumbowyg-2.1.0/dist/plugins/colors/ui/trumbowyg.colors.css '
											+ 'uniform.aristo.css font-awesome-4.6.3/css/font-awesome.css '
											+ 'buttons.dataTables.css'
											
				,jqueryfiles = ''
											+ 'jquery-2.2.4.js '
											+ 'jquery-ui-1.11.4.js '
											+ 'jquery.ba-resize.js jquery.datetimepicker.full.js jquery.autogrowtextarea.js autocomplete_combo.js '
											+ 'jquery.dataTables.js toggles.js jquery.star-rating-svg.js autosize.js gauge.js jquery.uniform.min.js '
											+ 'Trumbowyg-2.1.0/dist/trumbowyg.js Trumbowyg-2.1.0/dist/plugins/colors/trumbowyg.colors.js Trumbowyg-2.1.0/dist/plugins/upload/trumbowyg.upload.js ' 
											+ 'Trumbowyg-2.1.0/dist/plugins/pasteimage/trumbowyg.pasteimage.js Trumbowyg-2.1.0/dist/plugins/preformatted/trumbowyg.preformatted.js '
											//+ 'buttons.print.js dataTables.buttons.js '
											
				,jsfiles = ''
											+ 'login.js svg.js lang.js common.js'
		;
		
		[cssfiles, jqueryfiles, jsfiles].forEach(function(files){
			if (files){
				files.split(' ').forEach(function(file){
					if (file.indexOf('.css') > 0){
						load_css('./'+file, s);
					} else if (file.indexOf('.js') > 0){
						load_script('./'+file, s);
					}
				})
			}
		});
		window.onload = function(){
			initAll();
		}
	</script>

	
</head>
<body>

<table id="tbl_root">
	<tr>
		<!--topmenu-->
		<td id="td_topmenu" align="center" colspan="5">
			<table class="center_contents" border="0" width="100%">
				<tr>
					<td width="130">
						<img src="yocle_logo15_h40.png"/>
					</td>
					<td>
						&nbsp;
					</td>
					<td align="right" valign="middle">

					</td>
			 </tr>
			</table>
		</td>
	</tr>
	<tr>
		<td valign="middle" width="50%">
			
			<!--LOGIN-->
			<table align="center" cellspacing="8">
				<tr>
					<td>
						<h3>Your Out of Classroom Experience</h3>
					</td>
				</tr>
				<tr>
					<td align="center">
						<input type="text" placeholder="Email address"/>
					</td>
				</tr>
				<tr>
					<td align="center">
						<input type="password" placeholder="Password"/>
					</td>
				</tr>
				<tr>
					<td align="center">
						<button class="self_button" style="padding:8px">Log In</button>
						&nbsp;
						<button class="self_button" style="padding:8px">Sign up</button>
					</td>
				</tr>
				<tr>
					<td>
						&nbsp;
					</td>
				</tr>
				<tr>
					<td align="center">
						<button class="media_login" style="background:#3A559F">
							<table>
								<tr>
									<td style="vertical-align:middle">
										<span class="svg_container" svg="facebook" svgsize="24" svgcolor="white"></span>
									</td>
									<td style="vertical-align:middle" nowrap>
										Sign in with Facebook
									</td>
								</tr>
							</table>
						</button>
					</td>
				</tr>
				<tr>
					<td align="center">
						<button class="media_login" style="background:#DD4B39">
							<table>
								<tr>
									<td style="vertical-align:middle">
										<span class="svg_container" svg="googleplus" svgsize="24" svgcolor="white"></span>
									</td>
									<td style="vertical-align:middle" nowrap>
										Sign in with Google+
									</td>
								</tr>
							</table>
						</button>
					</td>
				</tr>
				<tr>
					<td align="center">
						<button class="media_login" style="background:#0084B1">
							<table>
								<tr>
									<td style="vertical-align:middle">
										<span class="svg_container" svg="linkedin" svgsize="24" svgcolor="white"></span>
									</td>
									<td style="vertical-align:middle" nowrap>
										Sign in with LinkedIn
									</td>
								</tr>
							</table>
						</button>
					</td>
				</tr>
			</table>
		
		</td>
		
		<!--SIGNUP-->
<!--		
		<td width="50%">
			<table>
				<tr>
					<td>
						abc
					</td>
				</tr>
			</table>
		</td>
-->
		
	</tr>
	
</table>



<div id="dialog-message" title="Error">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>
	<div id="div_errmsg"></div>
</div>

</body>
</html>