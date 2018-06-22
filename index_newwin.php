<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	
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

	<noscript>Your browser does not support JavaScript!</noscript>
	<script>
<?php
	include 'common.php';
	
	$platform = getQs('platform');
	echo "var g_platform = '$platform';\r\n\r\n";	
	
	$testing = getQs('testing');
	echo "var g_testing = '$testing';\r\n\r\n";	
	
	$separate = getQS('separate')?1:0;
	echo "var g_separate = $separate;\r\n\r\n";	
	
?>	
		function load_script(path, s){
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
		var
			page = 'b',
			url = window.location.href,
			g_bProduction = url.indexOf('dev') < 0,
			s = '',
			//s = getDateString(),
			//s = g_bProduction ? s : '',	// for easier to save files and setting breakpoints when debugging (drawback is risk of cached)
			cssfiles = ''
											+ 'jquery-ui1.css jquery-ui2.css '
											+ 'bootstrap-alan.css bootstrap-dialog.css '
											+ 'bootstrap-editable-alan.css '
											+ 'jquery.datetimepicker.css index.css '
											+ 'toggles.css star-rating-svg.css '
											+ 'bootstrap-wysihtml5-0.0.2.css wysiwyg-color.css '
											+ 'xeditable_work.css select2.css jquery-labelauty.css '
											+ 'xeditable_activity.css xeditable_education.css xeditable_publication.css xeditable_award.css xeditable_language.css xeditable_interest.css xeditable_limit.css '
											+ 'dhtmlxscheduler_flat.css '
											+ 'typeahead.css typeahead_test5.css bootstrap-tokenfield.css tokenfield-typeahead.css '
											+ 'bootstrap-multiselect.css '
											+ 'buttons.dataTables.css '
											+ 'jquery.dataTables-alan.css responsive.dataTables-alan.css '
											+ 'arrow-box.css '	// used in the correct answers of mcq
											+ 'featherlight.css featherlight.gallery-alan.css '
											+ 'a.uploader.css '
											+ 'jquery.bxslider.css '
											+ 'dhtmlxscheduler-responsive.css '
											
				,commonjsfiles = ''
											+ 'platform.js '
											+ 'jquery-3.1.1.js '
											+ 'dataTables.js buttons.print.js '
											+ 'jquery-ui-1.12.1.js '
											+ 'bootstrap-alan.js bootstrap-dialog.js '
											+ 'bootstrap-editable-alan.js '
											+ 'jquery.ba-resize.js jquery.datetimepicker.full.js jquery.autogrowtextarea.js autocomplete_combo.js '
											+ 'toggles.js jquery.star-rating-svg.js autosize.js gauge.js '
											//+ 'jquery.uniform.min.js '
											+ 'jquery-labelauty.js jquery.easing.1.3.js '
											+ 'select2.js '
											+ 'wysihtml5-0.3.0-alan.js bootstrap-wysihtml5-0.0.2-alan.js wysihtml5-alan.js '
											+ 'xeditable_activity.js xeditable_work.js xeditable_education.js xeditable_publication.js xeditable_award.js xeditable_language.js xeditable_interest.js xeditable_limit.js '
											+ 'dhtmlxscheduler-alan.js dhtmlxscheduler_year_view.js '
											+ 'typeahead.bundle.js bloodhound.js handlebars-v4.0.5.js bootstrap-tokenfield.js typeahead-alan.js jquery.linkedsliders.js '
											+ 'bootstrap-multiselect.js '
											+ 'featherlight.js featherlight.gallery.js '
											+ 'moment.js '
											+ 'progressbar.js '
											+ 'jquery.bxslider.js jquery.fitvids.js jquery.dotdotdot.js '
											+ 'jquery.ui.touch-punch.js '	// for mobile touch events
											+ 'Chart.bundle-2.4.0.js '
											+ 'Chart.bundle-2.4.0-alan.js '
											+ 'dataTables.responsive.js '
											+ 'dhtmlxscheduler-responsive.js '
											
				,myjsfiles = ''
											+ 'svg.js database_templates.js lang.js '
											+ 'index.js index_common.js svrop.js '	// 
											+ 'index_profile.js index_network.js '
											+ 'index_schedule.js index_datatable.js '
											+ 'index_topmenu.js '
											+ 'index_activity.js index_activity_edit.js index_activity_list.js '
											+ 'index_panelists.js '
											+ 'index_home.js index_userpage.js index_uact.js index_uass.js index_datetime.js '	
											+ 'a.uploader.js resumable-alan.js '
											// activity
											+ 'index_activity.js index_activity_create.js index_activity_edit.js index_activity_list.js index_activity_view.js '
											// assessment
											+ 'index_assessment_create.js index_assessment_edit.js index_assessment_view.js '
											+ 'index_assessment_view_assessor.js index_assessment_view_coordinator.js index_assessment_view_participant.js '
											// impression
											+ 'index_impression_view.js index_impression_view_assessor.js index_impression_view_coordinator.js index_impression_view_participant.js '
											// skills
											+ 'index_skills.js index_skills_chart.js index_skills_breakdown.js '
											// interface
											+ 'interface.js '
			arr = []
		;
		//alert(g_separate);
		if (g_separate == 1){
			var text =
				'\r\n'
				+ 'echo ***generating '+page+'.css***\r\n\r\n'
				+ 'call uglifycss ' + cssfiles + ' > ./' + page + '.css\r\n\r\n'
				+ 'echo ***generating '+page+'.js***\r\n\r\n'
				+ 'call uglifyjs ' + commonjsfiles + myjsfiles + ' -o ./' + page + '.js -b ascii_only=true,beautify=false\r\n\r\n'
			;
			//console.log(text); // consider writing to a batch file
			arr = [cssfiles, commonjsfiles, myjsfiles];
		} else {
			arr = [page + '.css ' + page + '.js'];
		}	
		//console.info(arr);
		arr.forEach(function(files){
			if (files){
				files.split(' ').forEach(function(file){
					if (file.indexOf('.css') > 0){
						load_css('./'+file, s);
					} else if (file.indexOf('.js') > 0){
						//alert(file+'?'+s);
						load_script('./'+file, s);
					}
				})
			}
		});
										

		///////////////////////////////////////////////////////////////////////////////////////////////////////////////
		var g_curr_return_obj = 0;
		
		window.onload = function(){
			$('html, body').css({
				margin:0,
				padding:0,
				width:'100%',
				//'overflow-y': 'hidden',
				'overflow-x': 'hidden',				
			});
			
			//getHardwareSpec();
			checkPlatform();
			
			if (g_testing){
				
				var o = {
						"jdiv": "\n\n\t<!--TITLE-->\n\t\n\t\t\t\t\t<div class=\"btn btn-primary but_additem\" style=\"font-size:12px\"><span>Add</span></div>\n\t\t\t\t</td><div class=\"section_header section_title\" style=\"padding-top:6px; margin-bottom:16px; font-size:18px; font-weight:bold\">\n\t\tAssessment <span class=\"tmp_assessment\"></span>:\n\t\t<span style=\"font-weight:normal\">\n\t\t\t<span class=\"tmp_title\"></span> (<span class=\"tmp_method\"></span>)\n\t\t</span>\n\t</div>\n\t\n\t<!--PERIOD-->\n\t<div class=\"subsection_header\">Period</div>\n\t<table style=\"padding-left:10px\">\n\t\t<tbody><tr>\n\t\t\t<td nowrap=\"\"class=\"text_start\">\n\t\t\t\tStart:\n\t\t\t</td>\n\t\t\t<td style=\"width:120px\">\n\t\t\t\t<input class=\"event_datetime start_datetime\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t\t<tr>\n\t\t\t<td nowrap=\"\" class=\"text_end\">\n\t\t\t\tEnd:\n\t\t\t</td>\n\t\t\t<td style=\"width:150px\">\n\t\t\t\t<input class=\"event_datetime end_datetime\" value=\"\">\n\t\t\t</td>\n\t\t</tr>\n\t</tbody></table>\n\t\n\t<divclass=\"div_separator\">&nbsp;</div>\n\t\n\n\t<div class=\"subsection_header\">Reflective Questions</div>\n\t<table class=\"tmp_datatable my_datatable display nowrap\" dt_type=\"ref\">\n\t\t<thead>\n\t\t\t<tr>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t\t<td>Question</td>\n\t\t\t\t<td>Word limit</td>\n\t\t\t\t<td>Weight%</td>\n\t\t\t\t<td>&nbsp;</td>\n\t\t\t\t<td>\n\t\t\t</tr>\n\t\t</thead>\n\t</table>\n\n\n\t<div class=\"div_separator\">&nbsp;</div>\n\t\n\t<!--GENERIC SKILLS-->\n\t<div class=\"subsection_header\" style=\"\">GenericSkills</div>\n\t\n\t<div>\n\t\t<table width=\"100%\" border=\"0\" class=\"layout_box lightbar\">\n\t<tbody><tr>\n\t\t<td style=\"padding:4px\">\n\t\t\t<div class=\"scrollable-dropdown-menu\">\n\t\t\t\t<input class=\"my_tokenfield\" tt_type=\"skills\" style=\"width:100%\" type=\"text\" placeholder=\"Generic skills (Use commas to separate; asterisk to list all)\">\n\t\t\t</div>\n\t\t</td>\n\t\t<td align=\"center\" nowrap=\"\"style=\"width:10px\">\n\t\t\t<div class=\"btn btn-primary but_additem\" style=\"font-size:12px\"><span>Add</span></div>\n\t\t</td>\n\t</tr>\n</tbody></table>\n\n<table width=\"100%\" border=\"0\" style=\"background:#ffffff; margin-top:6px; display:none\" class=\"my_datatable display nowrap\" dt_type=\"skills\">\n\t<thead>\n\t\t<tr>\n\t\t\t<td class=\"table_header text_skills\" style=\"width:800px;\">\n\t\t\t\tSkill\n\t\t\t</td>\n\t\t\t<td style=\"width:30px\">\n\t\t\t\t&nbsp;\n\t\t\t</td>\n\t\t</tr>\n\t</thead>\n</table>\n\t</div>\n\t\n\t<div class=\"div_separator\">&nbsp;</div>\n\t\n\t\t<div class=\"subsection_header\">Assessment Panelists</div>\n\t<table class=\"tbl_panelists layout_box\" border=\"0\"> \n\n\t\t<tbody><tr>\n\t\t\t<td>\n\t\t\t\t<input class=\"cb_coordinator\" type=\"checkbox\" checked=\"\">\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t\tCoordinator\n\t\t\t</td>\n\t\t</tr>\n\n\t\t<tr>\n\t\t\t<td>\n\t\t\t\t<input class=\"cb_self\" type=\"checkbox\" checked=\"\">\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t\tSelf\n\t\t\t</td>\n\t\t</tr>\n\n\t\t<tr>\n\t\t\t<td valign=\"top\">\n\t\t\t\t<input class=\"cb_peers\" type=\"checkbox\" checked=\"\">\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t\tPeers\n\t\t\t</td>\n\t\t</tr>\n\t\t\n\t\t<trclass=\"tr_peers\" style=\"display:none\">\n\t\t\t<td>\n\t\t\t\t&nbsp;\n\t\t\t</td>\n\t\t\t<td style=\"padding-left:4px\">\n\t\t\t\t<div class=\"div_num_of_peers\">\n\t\t\t\t\t(Number of peers:\n\t\t\t\t\t<select class=\"select_num_of_peers\"></select>)\n\t\t\t\t</div>\n\t\t\t</td>\n\t\t</tr>\n\n\t\t<tr>\n\t\t\t<td valign=\"top\">\n\t\t\t\t<input class=\"cb_others\" type=\"checkbox\" xchecked=\"\">\n\t\t\t</td>\n\t\t\t<td>\n\t\t\t\tOther assessors\n\t\t\t</td>\n\t\t</tr>\n\t\t\n\t\t<trclass=\"tr_others\">\n\t\t\t<td colspan=\"2\"> \n\t\t\t\t<div class=\"div_assessors\">\n\t\t\t\t\t\n<table width=\"100%\" border=\"0\" class=\"layout_box lightbar\">\n\t<tbody><tr>\n\t\t<td style=\"padding:4px\">\n\t\t\t<input type=\"text\" placeholder=\"User names (enter emails for invitations; use commas to seperate)\" class=\"my_tokenfield\" tt_type=\"users\">\n\t\t</td>\n\t\t<td align=\"center\" style=\"width:40px\">\n\t\t\t<div class=\"btn btn-primary but_additem\" style=\"font-size:12px\"><span>Add</span></div>\n\t\t</td>\n\t\t<td align=\"center\" style=\"width:80px; display:none\">\n\t\t\t<div class=\"btn btn-primary but_users_import\" style=\"font-size:12px\"><span>Import</span></div>\n\t\t</td>\n\t</tr>\n</tbody></table>\n\n\n<table width=\"100%\" border=\"0\" style=\"background:#ffffff; margin-top:6px;\" class=\"my_datatable display\" dt_type=\"users\">\n\t<thead>\n\t\t<tr>\n\t\t\t<td class=\"table_header text_name\">Name</td>\n\t\t\t<td>&nbsp;</td>\n\t\t</tr>\n\t</thead>\n</table>\n\t\t\t\t</div>\n\t\t\t</td>\n\t\t</tr>\n\t</tbody></table>\n\t\n\t<div class=\"div_separator\">&nbsp;</div>\n\t\n\t<table cellspacing=\"10\" align=\"center\">\n\t\t<tbody><tr>\n\t\t\t<td><div class=\"btn_cancel btn btn-primary\"><i class=\"glyphicon glyphicon-ban-circle\"></i> Cancel</div></td>\n\t\t\t<td><div class=\"btn_clear btn btn-primary\"><i class=\"glyphicon glyphicon-remove\"></i> Clear</div></td>\n\t\t\t<td><div class=\"btn_close btn btn-success\"><i class=\"glyphicon glyphicon-ok-circle\"></i> Close</div></td>\n<!--\t\t\t\n\t\t\t<td><div class=\"btn_loadtmp btn btn-primary\"><span>Load template</span></div></td>\n\t\t\t<td><div class=\"btn_savetmp btn btn-primary\"><span>Save template</span></div></td>\n-->\t\t\t\t\t\n\t\t</tr>\n\t</tbody></table>\n",
						
						"platform": "ios",
						
						"callback": "editAssessment2",
						
						"obj": "{\"ass_id\":1,\"method\":\"ref\",\"title\":\"Self Reflective\",\"weight\":30,\"start\":\"2016-10-12 09:00\",\"end\":\"2018-12-13 18:00\",\"skills\":{\"Communication\":{},\"Critical Thinking\":{},\"Teamwork\":{}},\"panelists\":{\"coordinator\":\"0\",\"self\":\"1\",\"peers\":\"3\",\"others\":[\"9\",\"12\",\"15\"]},\"assr_asst_completed\":{\"1\":40},\"part_asst_marks\":{\"1\":90,\"7\":33},\"assr_asst_marks\":{\"1,1\":100,\"1,7\":33,\"7,1\":80,\"8,1\":90,\"9,1\":90},\"items\":[{\"question\":\"<b>Experience:</b>&nbsp;What have you done and contribute? Briefly describe the activity that you want to reflect upon. Consider what happened and what part your played in it.\",\"min\":\"300\",\"max\":\"500\",\"weight\":\"33\"},{\"question\":\"What went well?\",\"min\":\"500\",\"max\":\"1000\",\"weight\":\"33\"},{\"question\":\"<b>Learning:</b> What have you learnt?\",\"min\":\"500\",\"max\":\"1000\",\"weight\":\"34\"}]}"
					};
				setNewWinDiv(o.jdiv, o.platform, o.callback, o.obj);
			}
		}
		
		/////////////////////////////////////////////////////////////////////
		
		function setNewWinDiv(html, platform, callback, sobj){
			//alert('setNewWinDiv: 1='  + html + ', 2=' + platform + ', 3=' + callback + ', 4=' + sobj);
			g_platform = platform;
			if (html){
				var jdiv2 = $('#newwin_div');
				jdiv2.html(html);
			}
			var obj = sobj ? JSON.parse(sobj) : 0;
			newwin_callback(callback, obj);
		}
	</script>

</head>
<body>

<div class="container-fluid">
	<div class="row">
		<div class="col-sm-12">
			<div class="page_margin2">
				<div id="newwin_div">
				</div>
			</div>
		</div>
	</div>
</div>

<?php
	include "index_assessment_edit.php";
	include "index_method.php";
?>

</body>
</html>
