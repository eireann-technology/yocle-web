<html lang="en">
<head>

  <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
	
<?php

ini_set( 'display_errors', 1 );  
error_reporting( E_ALL );  


include "recaptcha.php";
include "common.php";
include "database.php";

// GET FROM QUERY STRING
$loginemail = getQs('loginemail');
$signupemail = getQs('signupemail');
$reset_pwd = getQs('reset_pwd');
$secret_token = getQs('secret_token');
$email = getQs('email');
$pwd = '';
if ($email == ''){
	$email = isset($_COOKIE['email'])?$_COOKIE['email']:'';
	$pwd = isset($_COOKIE['pwd'])?$_COOKIE['pwd']:'';
}
$login = isset($_COOKIE['login']) ? $_COOKIE['login'] : '';
//print_json($reset_pwd); exit();

//$reset_pwd = isset($_COOKIE['reset_pwd']) ? $_COOKIE['reset_pwd'] : '';
//setcookie('reset_pwd', '');

$user = 0;
$confirmed_email = getQs('confirmed_email');
$redirect = 1;

if ($reset_pwd != ''){
	
	//////////////////////////////////////////////////////////////////////
	// CASE 1: RESET_PWD
	//////////////////////////////////////////////////////////////////////
	$confirmed_email = $email;	// $user['email']
	//print_json($email); exit();

} else if ($secret_token != ''){
	
	//////////////////////////////////////////////////////////////////////
	// CASE 2: CONFIRMED EMAIL
	//////////////////////////////////////////////////////////////////////
	$filters = ['email' => $confirmed_email];
	$options = [ 'projection' => ['_id' => 0]];//,  'confirmed_email' => 1, 'pwd' => 1]];
	$documents = databaseRead($database, 'users', $filters, $options);
	if ($documents && sizeof($documents) > 0){
		$user = json_decode(json_encode($documents[0]), false);
		if ($user->secret_token == $secret_token){
			// update value
			$user->confirmed_email = 1;
			// results
			$criteria = ['email' => $email];
			$updates = ['$set' => ['confirmed_email' => 1]];
			$result = databaseUpdate($database, 'users', $criteria, $updates);
			// prepare the cookie
			$confirmed_email = $user->email;
		} else {
			echo "secret code is different";
			exit();
		}
	}
} else if ($email != '' && $pwd != '' && $login == '1'){
	
	/////////////////////////////////////////////////////////////////////////
	// CASE 3: RETRIEVE LOGIN INFORMATION
	/////////////////////////////////////////////////////////////////////////
	// check secret_token
	$filters = ['email' => $email];
	$options = [ 'projection' => ['_id' => 0]];//,  'confirmed_email' => 1, 'pwd' => 1]];
	$documents = databaseRead($database, 'users', $filters, $options);
	//print_json($documents);
	if ($documents && sizeof($documents)){
		$user = json_decode(json_encode($documents[0]), false);
		//$reset_pwd = "";
		if ($reset_pwd != ''){
			if ($user->secret_token != $reset_pwd){
				echo 'invalid password reset';
				exit();
			} else {
				// RESET PASSWORD HERE AND REMOVE SECRET TOKEN
				$criteria = ['email' => $email];
				$updates = ['$set' => ['pwd' => $pwd, 'secret_token' => '']];
				$result = databaseUpdate($database, 'users', $criteria, $updates);
				// continue login
				$redirect = 0;
			}
		} else if ($user->confirmed_email == 0){
			//echo 'account not confirmed yet';
			//exit();
		} else if ($user->pwd == $pwd){
			// login
			$redirect = 0;
		}
	}
}


if ($user){
	$user = json_encode($user);
}

?>

<!doctype html>
	
  <title>YOCLE - Your Out of Classroom Learning Experience</title>
	
	<link rel="icon" href="./favicon.ico?v=2"/>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2">
	<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png?v=2">
	<link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png?v=2">
	<link rel="manifest" href="/manifest.json">
	<meta name="theme-color" content="#ffffff">

	<noscript>Your browser does not support JavaScript!</noscript>
	<script>
		var g_user = 0, g_user_id = '', g_user_name = '';
		function setMyUser(user){
			 g_user = user;
			 g_user_id = g_user ? g_user.user_id : 0;
			 g_user_name = g_user ? g_user.username : '';
		}
	
<?php
	$platform = getQs('platform');
	$separate = getQS('separate');
	//if (!$separate) $separate = 0;
	$nativeapp = getQS('nativeapp');
	$secret_token = getQS('secret_token');
	
	echo "var g_platform = '$platform';\r\n\r\n";
	echo "var g_siteKey = '".(isset($siteKey)?$siteKey:'')."';\r\n\r\n";
	echo "var confirmed_email = '$confirmed_email';\r\n\r\n";
	echo "var secret_token = '$secret_token';\r\n\r\n";	
	echo "var reset_pwd = '$reset_pwd';\r\n\r\n";
	echo "var loginemail = '$loginemail';\r\n\r\n";
	echo "var signupemail = '$signupemail';\r\n\r\n";
	
	echo "var g_redirect = '$redirect';\r\n\r\n";	
	echo "var g_platform = '$platform';\r\n\r\n";	
	echo "var g_separate = '$separate';\r\n\r\n";	
	echo "var g_nativeapp = '$nativeapp';\r\n\r\n";
	echo "var g_secret_token = '$secret_token';\r\n\r\n";
	echo "setMyUser($user);\r\n\r\n";	
?>
		function load_script(path, s){
			if (s) path += '?d=' + s;
			
			//var t = '<script src="' + path + '" type="text/javascript"><\/script>';
			//document.writeln(t);
			
			var sNew = document.createElement("script");
			sNew.async = false;
			sNew.src = path;
			document.head.appendChild(sNew);			
		}
		function load_css(path, s){
			if (s) path += '?d=' + s;
			
			//var t = '<link href="' + path + '"  type="text/css" rel="stylesheet"\/>';
			//document.writeln(t);
			
			var sNew = document.createElement("link");
			sNew.async = false;
			sNew.href = path;
			sNew.type = "text/css";
			sNew.rel = "stylesheet";
			document.head.appendChild(sNew);
		}

		function getDateString2(){
			var d = new Date();
			return d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
		}
		function mobileAndTabletcheck(){
			var check = false;
			(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
			return check;
		}
		
/*		
		// https://github.com/HubSpot/pace/issues/56
		window.paceOptions = {
			ajax: false,
			elements: false,
			restartOnPushState: false,
			restartOnRequestAfter: false,
			startOnPageLoad: false,
		};
*/		
		var
			page = 'b',
			url = window.location.href,
			g_bProduction = url.indexOf('dev') < 0
		;
		if (g_separate == ''){
			g_separate = g_bProduction ? 0 : 1;
		} else {
			g_separate = parseInt(g_separate);
		}
		var d = g_separate == 0 ? '' : getDateString2(),
			cssfiles = ''
											+ 'index_login.css '
											+ 'font-awesome.css '
											+ 'jquery-ui1.css jquery-ui2.css '
											+ 'jquery.datetimepicker.css index_yocle.css '
											+ 'toggles.css star-rating-svg.css '
											+ 'xeditable_work.css select2.css jquery-labelauty.css '
											+ 'xeditable_activity.css xeditable_education.css xeditable_publication.css xeditable_award.css xeditable_language.css xeditable_interest.css xeditable_limit.css '
											+ 'xeditable_mood.css xeditable_relationship.css '
											+ 'dhtmlxscheduler_flat.css '
											+ 'typeahead.css typeahead_test5.css bootstrap-tokenfield.css tokenfield-typeahead.css '
											+ 'bootstrap-multiselect.css '
											+ 'buttons.dataTables.css '
											+ 'jquery.dataTables-alan.css responsive.dataTables-alan.css '
											+ 'arrow-box.css '	// used in the correct answers of mcq
											+ 'featherlight.css featherlight.gallery-alan.css '
											+ 'a.uploader.css '
											+ 'jquery.bxslider-alan.css '
											+ 'dhtmlxscheduler-responsive.css '
											+ 'bootstrap.css bootstrap-alan-only.css bootstrap-dialog.css bootstrap-editable-alan.css '
											+ 'bootstrap-editable.css bootstrap-wysihtml5-0.0.3.css wysiwyg-color.css '
											+ 'bootstrap.icon-large.css '
											
				,commonjsfiles = ''
											+ 'platform.js '
											+ 'jquery-3.1.1.js '
											+ 'datatables.js buttons.print.js '
											+ 'jquery-ui-1.12.1.js '
											+ 'bootstrap-alan.js bootstrap-dialog.js '
											+ 'jquery.ba-resize.js jquery.datetimepicker.full.js jquery.autogrowtextarea.js autocomplete_combo.js '
											+ 'toggles.js jquery.star-rating-svg.js autosize.js gauge.js '
											+ 'jquery-labelauty.js jquery.easing.1.3.js '
											+ 'dhtmlxscheduler-alan.js dhtmlxscheduler_year_view.js '
											+ 'typeahead.bundle.js bloodhound.js handlebars-v4.0.5.js bootstrap-tokenfield.js typeahead-alan.js jquery.linkedsliders-alan.js '
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
											+ 'bootstrap-editable-alan.js wysihtml5-0.3.0-alan.js bootstrap-wysihtml5-0.0.3-alan.js wysihtml5-0.0.3-alan.js '
											+ 'select2.js '
											+ 'xeditable_activity.js xeditable_work.js xeditable_education.js xeditable_publication.js xeditable_award.js xeditable_language.js xeditable_interest.js xeditable_limit.js '
											+ 'xeditable_mood.js xeditable_relationship.js '
											+ 'waitingfor.js '
											+ 'socket.io.js '
											+ 'typeaheadjs.js '
											+ 'jquery.jscroll.js '
											
				,myjsfiles = ''
											+ 'index_login.js birthdate.js '
											+ 'svg.js database_templates.js lang.js '
											+ 'index.js index_common.js svrop.js '	// 
											+ 'index_profile.js index_peers.js '
											+ 'index_schedule.js index_datatable.js '
											+ 'index_topmenu.js '
											+ 'index_panelists.js '
											+ 'index_home.js index_userpage.js index_uact.js index_uass.js index_datetime.js '	
											+ 'a.uploader.js resumable-alan.js '
											// activity
											+ 'index_activity.js index_activity_create.js index_activity_edit.js index_activity_list.js index_activity_view.js '
											// assessment
											+ 'index_assessment_create.js index_assessment_edit.js index_assessment_view.js '
											+ 'index_skills.js index_skills_chart.js index_skills_breakdown.js '
											// interface
											+ 'interface.js index_method.js '
											+ 'index_method_ref.js index_method_mcq.js index_method_prt.js index_method_abs.js index_method_lcn.js index_method_sur.js index_method_pst.js '
											+ 'index_gsgauge.js '
											+ 'index_viewactasst_all.js index_viewactasst_assr.js index_viewactasst_coor.js index_viewactasst_part.js '
											+ 'index_viewactimpr_all.js index_viewactimpr_assr.js index_viewactimpr_coor.js index_viewactimpr_part.js '
											+ 'index_skills_breakdown.js index_assessment_peer.js '
											+ 'index_assitem_create.js '
											+ 'index_messenger_list.js '
											+ 'index_messenger_comm.js '
											+ 'index_whatsup.js '
			,
			arr = []
		;
		if (g_separate >= 1){
			// 1 = use separated file
			// 2 = use separated file plus reload forcefully
			var text =
				'\r\n'
				+ 'echo ***generating '+page+'.css***\r\n\r\n'
				+ 'call uglifycss ' + cssfiles + ' > ./' + page + '.css\r\n\r\n'
				+ 'echo ***generating '+page+'.js***\r\n\r\n'
				+ 'call uglifyjs ' + commonjsfiles + myjsfiles + ' -o ./' + page + '.js -b ascii_only=true,beautify=false\r\n\r\n'
			;
			console.log(text); // consider writing to a batch file
			arr = [cssfiles, commonjsfiles, myjsfiles];
		} else {
			// use compressed files
			arr = [page + '.css ' + page + '.js'];
		}		
		
		arr.forEach(function(files){
			if (files){
				files.split(' ').forEach(function(file){
					if (file.indexOf('.css') > 0){
						load_css('./' + file, d);
					} else if (file.indexOf('.js') > 0){
						//d = 0;
						load_script('./' + file, g_separate > 1 ? d : 0 );
					}
				})
			}
		});
		window.onload = function(){
			initAll();	// replaced by recaptcha (disabled in mainland, disabled recapcha)
			//openProgress2();
		}
	</script>
	<style type="text/css" media="screen">
		#tbl_root, .dropmenu, .adialog{
			/*display:none;*/
		}
	</style>
</head>
<body style="display:none">

<div id="div_login" class="container-fluid">

	<div id="div_topmenu" class="row">
		<table class="col-sm-12" border="0" width="100%">
			<tr>
				<td id="td_logo" width="130">
					<img style="padding:10px" src="yocle_logo15_h40.png"/>
				</td>
				<td>
					&nbsp;
				</td>
		 </tr>
		</table>
	</div>

	<div class="row">
		<div id="div_title" class="col-sm-12">
			Your Out of Classroom Experience
		</div>
	</div>
	
	<div class="row" style="text-align:center">
			<div id="tabs_login" class="col-sm-12" style="background: #c9c9c9 url(images/ui-bg_inset-soft_50_c9c9c9_1x100.png) 50% bottom repeat-x;">
				<ul>
					<li><a href="#tab_login" style="text-align:center;">Log-in</a></li>
					<li><a href="#tab_signup" style="text-align:center;">Sign-up</a></li>
				</ul>
				<div id="tab_login">
					<!--<form onsubmit="return false">-->
					
						<table id="tbl_login" border="0">
						
							<tr>
								<td colspan="2">
									&nbsp;
									<!--  fake fields are a workaround for chrome/opera autofill getting the wrong fields -->
									<input style="display:none" type="text" name="fakeusernameremembered">
									<input style="display:none" type="password" name="fakepasswordremembered">								
								</td>
							</tr>
									
							<tr>
								<td>
									 <span class="glyphicon glyphicon-envelope"></span>
								</td>
								<td align="center" id="td_login_email">
									<input id="login_email" class="nonempty isemail" type="text" placeholder="Email" autocorrect="off" autocapitalize="off" autocomplete="nope"/>
								</td>
							</tr>
							
							<tr>
								<td>
									<i class="fa fa-lock" aria-hidden="true"></i>
								</td>
								<td align="center" id="td_login_pwd">
									<input id="login_pwd" class="nonempty" type="password" placeholder="Password" autocorrect="off" autocapitalize="off" autocomplete="new-password"/>
								</td>
							</tr>
							
							<tr>
								<td colspan="2">
									&nbsp;
								</td>
							</tr>

							<tr>
								<td id="td_remember" align="center" colspan="2">
									<input id="login_remember" type="checkbox"/>																	
									<label>
										Remember me?
									</label>
								</td>
							</tr>
							
							<tr>
								<td colspan="2">
									&nbsp;
								</td>
							</tr>

							<tr>
								<td align="center" colspan="2">
									<button id="but_login" class="self_button" style="padding:8px">Log In</button>
								</td>
							</tr>
							
							<tr>
								<td colspan="2">
									&nbsp;
								</td>
							</tr>
							
							<tr>
								<td id="td_forgot_pwd" align="center" style="padding-top: 10px;" colspan="2">
									Forgot password?
								</td>
							</tr>
							
							<tr>
								<td id="td_login_error" class="err_msg" colspan="2">&nbsp;</td>
							</tr>
							
						</table>
						
					</div>
					<div id="tab_signup" style="padding:0px">
					
						<table id="tbl_signup">
							
							<tr>
								<td>
									 <span class="glyphicon glyphicon-envelope"></span>
								</td>
								<td>
									<input id="signup_email" class="nonempty isemail" type="text" placeholder="Email"/>
								</td>
							</tr>

							<tr>
								<td>
									<i class="fa fa-lock" aria-hidden="true"></i>
								</td>
								<td>
									<input id="signup_pwd" class="nonempty" type="password" placeholder="Password"/>
								</td>
							</tr>

							<tr>
								<td>
									 <span class="glyphicon glyphicon-user"></span>
								</td>
								<td>
									<input id="signup_name" class="nonempty" type="text" placeholder="Name"/>
								</td>
							</tr>
							
							<tr style="display:none">
								<td style="vertical-align: middle; height: 50px;">
									<i class="fa fa-venus-mars" aria-hidden="true"></i>
								</td>
								<td id="td_signup_gender">
									<div id="signup_gender" class="toggle_gender toggle-light"></div>
								</td>
							</tr>

							<tr>
								<td style="vertical-align: middle; height: 50px;">
									<i class="fa fa-birthday-cake" aria-hidden="true"></i>
								</td>
								<td style="padding-left: 10px">
									<table style="width:100px;">
										<tr>
											<td>
												<select class="sel_birthday" id="signup_birth_date" name="dd"></select>
											</td>
											<td>
												<select class="sel_birthday" id="signup_birth_month" name="mm"></select>
											</td>
											<td>
												<select class="sel_birthday" id="signup_birth_year" name="yyyy"></select>
											</td>
										</tr>
									</table>
								</td>
							</tr>
				
							<tr style="displayx:none; padding:0px;">
								<td colspan="2">
									<div id="div_recaptcha"></div>
								</td>
							</tr>
												
							<tr>
								<td style="font-size:12px; text-align:center; font-weight:normal;" colspan="2">
									By clicking Sign up, you agree to Yocle's User Agreement and Privacy Policy.
								</td>
							</tr>
							
							<tr>
								<td colspan="2" style="text-align:center; width:100%;">
									<button id="but_signup" class="self_button" style="padding:8px">Sign up</button>
								</td>
							</tr>

							<tr>
								<td id="td_signup_error" class="err_msg" style="width:; text-align:center" colspan="2">&nbsp;</td>
							</tr>
							
						</table>
					<!--</form>-->
				</div>
		</div>
	</div>
</div>

<div id="div_main" style="display:none">

	<!--BODYVIEW 1-->
	<div id="bodyview_1" class="bodyview container">
		<div class="row">
		
			<!--TOPMENU-->
			<div id="div_topmenu" class="col-sm-12">
				<table id="tbl_topmenu">
					<?php include "index_topmenu.php"?>
				</table>
			</div>

			<div id="tabs" class="col-sm-12" style="padding-top: 4px;">
				<!--TABS-->
				<ul>
					<li><a href="#tab_home">Home</a></li>
					<li><a href="#tab_profile">Profile</a></li>
					<li><a href="#tab_activity">Activity</a></li>
					<li><a href="#tab_peers">Peers</a></li>
					<li><a href="#tab_schedule">Schedule</a></li>
				</ul>
				
				<!-- HOME -->
				<div id="tab_home" class="bodyview_lvl1">
					<?php include 'index_home.php'?>
				</div>
				
				<!-- PROFILE -->
				<div id="tab_profile" class="bodyview_lvl1">
					<?php include 'index_profile.php'?>
				</div>
				
				<!-- PEERS -->
				<div id="tab_peers" class="bodyview_lvl1">
					<?php include 'index_peers.php'?>
				</div>
				
				<!-- ACTIVITY -->
				<div id="tab_activity" class="bodyview_lvl1">
					<?php include 'index_activity_list.php'?>			
				</div>
				
				<!-- SCHEDULE -->
				<div id="tab_schedule" class="bodyview_lvl1">
					<?php include 'index_schedule.php'?>
				</div>
			</div>
		</div>
	</div>

	<!--BODYVIEW 2-->
	<div id="bodyview_2" class="bodyview container">
		<?php include 'index_skills_breakdown.php'?>
		<?php include 'index_activity_edit.php'?>
		<?php include 'index_activity_view.php'?>
		<?php include 'index_userpage.php'?>
	</div>

	<!--BODYVIEW 3-->
	<div id="bodyview_3" class="bodyview container">
		<?php include 'index_assessment_edit.php'?>
		<?php include 'index_assessment_view.php'?>	
	</div>	

	<!--BODYVIEW 4-->
	<div id="bodyview_4" class="bodyview container">
		<?php include 'index_messenger_list.php'?>
	</div>

	<!--BODYVIEW 5-->
	<div id="bodyview_5" class="bodyview container">
		<?php include 'index_messenger_comm.php'?>
	</div>

	<!--BODYVIEW 6-->
	<div id="bodyview_6" class="bodyview container">
		<?php include 'index_whatsup.php'?>
	</div>

	<!--IMPORT BY THIRD PARTY FILE-->
	<ul id="dropmenu_import2" class="dropmenu" style="width:140px; text-align:left">
		<li>
			<span menuitem="import_template" class="dropmenu-item" nowrap>Import by Template</span>
		</li>
		<li>
			<span menuitem="import_excel" class="dropmenu-item" nowrap>Import by Excel</span>
		</li>
		<li>
			<span menuitem="import_csv" class="dropmenu-item" nowrap>Import by CSV</span>
		</li>
	</ul>	

	<!--LANGUAGE SELECTION-->
	<ul id="dropmenu_lang" class="dropmenu" style="text-align:left">
		<li>
			<span menuitem="lang_ENG" class="dropmenu-item" nowrap>English</span>
		</li>
		<li>
			<span menuitem="lang_THA" class="dropmenu-item" nowrap>ไทย (Thai)</span>
		</li>
	</ul>	

	<!--CONFIRM DIALOG-->
	<div id="dialog-confirm" class="adialog" title="Delete this item?">
		<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>
			Are you sure?
	</div>

	<!--ERROR MESSAGE-->
	<div id="dialog-message" title="Error">
		<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>
		<div id="div_errmsg"></div>
	</div>

	<!--SPLASH SCREEN-->
	<div style="display:none">
		<div class="splash card">
			<br>
			<div role="spinner">
				<div class="spinner-icon"></div>
			</div>
			<p class="lead" style="text-align:center">Please wait...</p>
			<div class="progress">
				<div class="mybar" role="bar"></div>
			</div>
		</div>
	</div>
</div>

<!--FOOTER-->
<div id="div_footer" class="col-sm-12">
	<hr>
	<table id="tbl_footer" cellspacing="4" align="center">
		<tr>
			<td>About</td>
			<td>Help</td>
			<td>Feedback</td>
			<td>Privacy</td>
			<td>Terms</td>
		</tr>
		<tr>
			<td colspan="5" align="center"><span style="color:gray">YOCLE &copy; 2017</span></td>
		</tr>
	</table>
</div>

<?php
	include "index_method.php";
?>

<!--
<script src="https://www.google.com/recaptcha/api.js?hl=en&onload=initAll&render=explicit" async defer></script>
-->

<script src="https://www.google.com/recaptcha/api.js?hl=en&render=explicit" async defer></script>

</body>
</html>

