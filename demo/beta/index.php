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
	'',
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
	$s = '<div class="ui-widget div_skills">' . '<select class="skill_combobox">';
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
											+ 'jquery.datetimepicker.css index.css '
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
											+ 'Trumbowyg-2.1.0/dist/plugins/noembed/trumbowyg.noembed.js '
											+ 'buttons.print.js dataTables.buttons.js '
											
				,jsfiles = ''
											+ 'svg.js data.js lang.js '
											+ 'index.js index_common.js jquery-radar-plus.js '
											+ 'index_home.js index_profile.js index_network.js index_activity_create.js index_activity_search.js Chart.bundle.js RadarChart.js '
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
		<td id="td_topmenu" align="center">
			<table class="center_contents" border="0">
				<tr>
					<td width="130">
						<img src="yocle_logo15_h40.png"/>
					</td>
					<td id="div_search">
						<table cellpadding="0" cellspacing="0">
							<tr>
								<td>
									<input id="inp_search" class="search_box" type="text" placeholder="Search people or activities"/>
								</td>
								<td style="padding-left:2px">
									<div class="svg_container" svg="search" style="position: relative; left: -30px; width:16px; height:16px; border-radius:8px; cursor:pointer; padding-top: 7px; " svgfill="green"></div>
								</td>
								<td style="color:white; text-align:left; font-weight:bold; cursor:pointer" class="text_advanced">
									Advanced
								</td>
							</tr>
						</table>
					</td>
					<td style="color:white" align="right">
						<table>
							<tr>
								<td>
									<img class="person_photo photo_myself2" src="./people/m03.jpg"/>
								</td>
								<td class="name_myself" style="color:white; font-size:14px">
									Samson Chan
								</td>
							</tr>
						</table>
					</td>
					<td align="right" width="300">
						<table cellspacing="0" id="top_panel" border="0">
							<tr>
								<td id="topmenu_settings" class="svg_container topmenu_btn" svg="settings" title="Settings">
								</td>
								<td id="topmenu_todolist" class="svg_container topmenu_btn" svg="pin" title="To do list">
									<div class="balloon"><div class="balloon2"></div></div>
								</td>
								<td id="topmenu_notice" class="svg_container topmenu_btn" svg="notice" title="Notice board">
									<div class="balloon"><div class="balloon2"></div></div>
								</td>
								<td id="topmenu_msg" class="svg_container topmenu_btn" svg="message" title="Message" onclick="openMsg('')">
									<div class="balloon"><div class="balloon2"></div></div>
								</td>
								<td id="topmenu_lang" class="svg_container topmenu_btn" svg="language" title="Language" svgsize="18" style="padding-top:8px" onclick="openDropmenu($(this), 'lang', event);">
									<div class="balloon"><div class="balloon2"></div></div>
								</td>
								<td id="logout" class="svg_container topmenu_btn" svg="logout" title="Log out" onclick="toggleMyUser()">
								</td>
							</tr>
						</table>
					</td>
			 </tr>
			</table>
		</td>
	</tr>
	
	<tr>
		<td align="center">
			<!--tabs-->
			<div id="tabs" class="center_contents">
				<ul>
					<li>
						<a href="#tabs-1">Home</a>
					</li>
					<li>
						<a href="#tabs-2">Profile</a>
					</li>
					<li>
						<a href="#tabs-3">Network</a>
					</li>
					<li>
						<a href="#tabs-8b">Activity</a>
					</li>
					<li>
						<a href="#tabs-6">Post a Project</a>
					</li>
					<li>
						<a href="#tabs-7">GS League Table</a>
					</li>
				</ul>
				
				<!-- HOME -->
				<div id="tabs-1">
					<?php include 'index_home.php'?>
				</div>
				
				<!-- PROFILE -->
				<div id="tabs-2">
					<?php include 'index_profile.php'?>
				</div>
				
				<!-- NETWORK -->
				<div id="tabs-3">
					<?php include 'index_network.php'?>
					<?php include "index_profile_chole.php"?>					
				</div>
						
				<!-- ACTIVITY -->
				<div id="tabs-8a" class="ocla_page ui-tabs-panel ui-widget-content ui-corner-bottom">
					<?php include 'index_activity_create.php'?>
				</div>
				
				<div id="tabs-8b" class="ocla_page ui-tabs-panel ui-widget-content ui-corner-bottom">
					<?php include 'index_activity_search.php'?>
					<?php include 'index_activity_search_dropmenu.php'?>
				</div>

				<div id="tabs-8c" class="ocla_page ui-tabs-panel ui-widget-content ui-corner-bottom">
					<?php include 'index_activity_search_eva.php'?>
				</div>

				
				<!-- POST A PROJECT-->
				<div id="tabs-6">
					<?php //include 'index_postaproject.php'?>
				</div>
				
				<!-- GS LEAGUE TABLE-->
				<div id="tabs-7">
					<?php //include 'index_gsleaguetable.php'?>
				</div>
				
				
			</div>
		</td>
	</tr>
	
</table>

<ul id="dropmenu_activity" class="dropmenu" style="text-align:left">
	<li>
		<a href="#tabs-8a" class="dropmenu-item text_createactivity" nowrap>Create activity</a>
	</li>
	<li>
		<a href="#tabs-8b" class="dropmenu-item text_searchactivity" nowrap>Search activity</a>
	</li>
</ul>	

<!--ACTIVITY-->
<ul id="dropmenu_action" class="dropmenu" style="text-align:left">
	<li>
		<a href="#search_view" class="dropmenu-item text_view_details" nowrap>View details</a>
	</li>
	<li>
		<a href="#search_viewedit" class="dropmenu-item text_viewedit_details" nowrap>View/edit details</a>
	</li>
	<li>
		<a href="#search_sendmsg" class="dropmenu-item text_sendmsg" nowrap>Send message</a>
	</li>
	<li>
		<a href="#search_searchppl" class="dropmenu-item text_searchpeople" nowrap>Search people</a>
	</li>
	<li>
		<a href="#search_gsgrades" class="dropmenu-item text_showgsgrades" nowrap>Show GS grades</a>
	</li>
	<li>
		<a href="#search_asmmarks" class="dropmenu-item text_showasmmarks" nowrap>Show assessment marks</a>
	</li>
</ul>

<!--TASK-->
<ul id="dropmenu_searchact" class="dropmenu" style="text-align:left">
	<li>
		<a href="#search_gs" class="dropmenu-item" nowrap>Evalute generic skills</a>
	</li>
	<li>
		<a href="#search_eva" class="dropmenu-item" nowrap>Assess assessment</a>
	</li>
	<li>
		<a href="#search_asm" class="dropmenu-item" nowrap>Complete assessment</a>
	</li>
	<li>
		<a href="#search_stp" class="dropmenu-item" nowrap>Give Stamps</a>
	</li>
	<li>
		<a href="#search_ntc" class="dropmenu-item" nowrap>Read notice</a>
	</li>
	<li>
		<a href="#search_msg" class="dropmenu-item" nowrap>Reply message</a>
	</li>
	<li>
		<a href="#search_gsgrades" class="dropmenu-item text_showgsgrades" nowrap>Show GS skills grades</a>
	</li>
	<li>
		<a href="#search_asmmarks" class="dropmenu-item text_showgsgrades" nowrap>Show assessment marks</a>
	</li>
	
</ul>	

<!--CREATE ACTIVITY-->

<ul id="dropmenu_import" class="dropmenu" style="width:120px; text-align:left">
	<li>
		<a href="#import_excel" class="dropmenu-item" nowrap>Import by Excel</a>
	</li>
	<li>
		<a href="#import_csv" class="dropmenu-item" nowrap>Import by CSV</a>
	</li>
</ul>	

<ul id="dropmenu_import2" class="dropmenu" style="width:140px; text-align:left">
	<li>
		<a href="#import_template" class="dropmenu-item" nowrap>Import by Template</a>
	</li>
	<li>
		<a href="#import_excel" class="dropmenu-item" nowrap>Import by Excel</a>
	</li>
	<li>
		<a href="#import_csv" class="dropmenu-item" nowrap>Import by CSV</a>
	</li>
</ul>	


<ul id="dropmenu_lang" class="dropmenu" style="text-align:left">
	<li>
		<a href="#lang_ENG" class="dropmenu-item" nowrap>English</a>
	</li>
	<li>
		<a href="#lang_THA" class="dropmenu-item" nowrap>ไทย (Thai)</a>
	</li>
</ul>	

<div id="dialog-confirm" class="adialog" title="Delete this item?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>
		Are you sure?
</div>

<div id="dialog_eva" class="adialog" title="Assess Assessment">
	<?php include "./search_eva.php"?>
</div>

<div id="dialog_gs" class="adialog" title="Generic Skills">
	<?php include "./search_gs.php"?>
</div>

<div id="dialog_asm" class="adialog" title="Complete Assessment">
	<?php include "./search_asm.php"?>
</div>

<div id="dialog_ntc" class="adialog" title="Notice">
	<?php include "./search_ntc.php"?>
</div>

<div id="dialog_msg" class="adialog" title="Message">
	<?php include "./search_msg.php"?>
</div>


<div id="dialog_people" class="adialog" title="People">
	<?php include "./search_people.php"?>
</div>

<div id="dialog_gsgrades" class="adialog" title="People">
	<?php include "./search_gsgrades.php"?>
</div>

<div id="dialog_asmmarks" class="adialog" title="People">
	<?php include "./search_asmmarks.php"?>
</div>

<div id="#dialog_assessment" class="adialog" title="Assessment">
	I applied for a summer institute program that was organized by my university, which required me to go to Taiwan for 2 weeks, and South Korea for another 2. For most people, applying for something probably is not that big of a deal. All it requires is a scanner or good ol’ Fedex to submit your paperwork, right? Well no, not for me. The mere process of applying took a while, as I was really overwhelmed by the idea of taking flight – quite literally in my case. There were talks of needing to find a roommate and all that circulated in my head was, Roommate?! I finally worked up the courage to leave my bubble and now you’re telling me I have to live with a stranger?! I have heard terrible and unfortunate accounts of roommates not getting along, from questionable music tastes on loudspeaker, to dishes that get piled for weeks on end. Just to reiterate, I REALLY (in bold, italics, underline, and caps) did not want to go.

The day of doom finally came, where I had to drag my suitcases and my sorry self to the trip. I begged my mother to be online every day so that I could be reminded that I was not completely lonely.

When I got to Taiwan, I was awed by the friendly atmosphere and the hustle and bustle of the city life, much like Hong Kong. My classmates and I learned about the Taiwanese political parties by visiting their headquarters, and we got a chance to write our wishes on sky lanterns as well. Similarly in South Korea, I was intrigued by their vibrant culture through my time at the teahouses, and even got to visit the demilitarized zone, which essentially is a border between South and North Korea. They have a ‘safe house’ in the very middle of the border, and it is only in this box where you get to hop freely between the two Koreas – how many people get to say, “I have stood precisely between the North and the South”? Not many!

I was blessed with a program coordinator who organized a memorable curriculum, which had a balance of education (in the forms of lectures), and application as well as exposure (through field visits that complemented the lecture content). And to everyone’s surprise, I was actually having fun.

Did I have to fight for the showers with my roommate? It just so happened that my roommate, Apple (who is now one of my best friends) was also terrified before going on the trip. For the first couple of days, we were very awkward – “You can shower first.” “No you go ahead.” but soon enough, we went from polite (and boring) exchanges to spending literally every waking moment with each other. Apple and I both realized on our last day that we only really called our family once or twice a week, because we were busy enjoying the program, and making the most out of the moment.

My point? Go. Take any opportunity your school offers to go abroad – I promise, it will change your life. Joining this program was the best experience I had in my three years at university. If your school does not offer such programs, adventures do not need to start somewhere in another continent; venture outside of your everyday route, and you would be surprised by what the world outside of your bubble has to offer. In the words of Helen Keller, “Security is mostly a superstition. It does not exist in nature, nor do the children of men as a whole experience it. Avoiding danger is no safer in the long run than outright exposure. Life is either a daring adventure, or nothing.” So choose adventure.
</div>

<div id="dialog-message" title="Error">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>
	<div id="div_errmsg"></div>
</div>

</body>
</html>