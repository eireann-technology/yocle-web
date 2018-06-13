<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">		
  <title>YOCLE - Your Out of Classroom Learning Experience</title>
	
	<link rel="icon" href="/favicon.ico?v=2"/>
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2">
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2">
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2">
	<link rel="manifest" href="/manifest.json">
	<meta name="theme-color" content="#ffffff">

	<script>

<?php

	include "recaptcha.php";
	include "common.php";
	include "database.php";
	
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
	
	//echo "$secret_token $email $pwd"; exit();
	
	$confirmed_email = '';

	if ($reset_pwd != ''){
		//////////////////////////////////////////////////////////////////////
		// RESET_PWD
		//////////////////////////////////////////////////////////////////////
		$confirmed_email = $email;	// $user['email']
		
	} else if ($secret_token != ''){
		//////////////////////////////////////////////////////////////////////
		// CONFIRMED EMAIL
		//////////////////////////////////////////////////////////////////////
		$documents = databaseRead($database, 'users', ['email' => $email]);
		if ($documents && sizeof($documents) > 0){
			$user = json_decode(json_encode($documents[0]), true);
			if ($user['secret_token'] == $secret_token){
				// update value
				$user['confirmed_email'] = 1;
				//unset($user['_id']);
				//var_dump($user);
				// results
				$result = databaseUpdate($database, 'users', ['email' => $email], ['$set' => ['confirmed_email' => 1]]);
				// prepare the cookie
				$confirmed_email = $user['email'];
			}
		}
	}
	$platform = getQs('platform');
	$separate = getQS('separate');
	if (!$separate) $separate = 0;
	
	echo "var g_platform = '$platform';\r\n\r\n";
	echo "var g_siteKey = '".(isset($siteKey)?$siteKey:'')."';\r\n\r\n";
	echo "var confirmed_email = '$confirmed_email';\r\n\r\n";
	echo "var reset_pwd = '$reset_pwd';\r\n\r\n";
	echo "var loginemail = '$loginemail';\r\n\r\n";
	echo "var signupemail = '$signupemail';\r\n\r\n";
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
		
		var
			page = 'a',
			url = window.location.href,
			g_bProduction = url.indexOf('dev') < 0,
			s = getDateString(),
			//s = g_bProduction ? s : '',	// for easier to save files and setting breakpoints when debugging (drawback is risk of cached)
			cssfiles = ''
											+ 'jquery-ui1.css jquery-ui2.css '		
											+ 'toggles.css '
											//+ 'bootstrap-alan.css bootstrap-dialog.css '
											+ 'bootstrap-3.3.7-alan.css bootstrap-dialog-1.35.3.css '
											+ 'font-awesome.css '
											+ 'login.css '											
											//+ 'pace2.css '	// http://github.hubspot.com/pace/docs/welcome/
											
			,commonjsfiles = ''
											+ 'jquery-2.2.4-alan.js '
											+ 'jquery-ui-1.11.4.js '
											+ 'toggles.js '
											//+ 'bootstrap-alan.js bootstrap-dialog.js '
											+ 'bootstrap-3.3.7-alan.js bootstrap-dialog-1.35.3.js '
											+ 'platform.js '
											+ 'interface.js '
											//+ 'pace.min.js '
											
			,myjsfiles = ''
											+ 'login.js login_keyboard.js svg.js lang.js index_common.js birthdate.js svrop.js ',
			arr = []
		;
		//if (!g_bProduction){
		if (g_separate == 1){
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
			arr = [page + '.css ' + page + '.js'];
		}
		
		arr.forEach(function(files){
			if (files){
				files.split(' ').forEach(function(file){
					if (file.indexOf('.css') > 0){
						load_css('./'+file, s);
					} else if (file.indexOf('.js') > 0){
						//alert(file + s);
						load_script('./'+file, s);
					}
				})
			}
		});
		//window.onload = function(){
			//initAll();
		//}
	</script>
	<!--<script src="//www.google.com/recaptcha/api.js"></script>-->
	<!--<script type="text/javascript" src="https://www.google.com/recaptcha/api.js?hl=<?=$lang; ?>"></script>-->	
	<script src="https://www.google.com/recaptcha/api.js?hl=en&onload=initAll&render=explicit" async defer></script>
</head>

<body style="background: #e0e0e0;">

<div id="div_root" class="container-fluid">

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
			<div id="tabs" class="col-sm-12">
				<ul>
					<li><a href="#tab_login" style="text-align:center;">Log-in</a></li>
					<li><a href="#tab_signup" style="text-align:center;">Sign-up</a></li>
				</ul>
				<div id="tab_login">
					<table id="tbl_login" border="0">
					
						<tr>
							<td colspan="2">
								&nbsp;
							</td>
						</tr>
								
						<tr>
							<td>
								 <span class="glyphicon glyphicon-envelope"></span>
							</td>
							<td align="center">
								<input id="login_email" class="nonempty isemail" type="text" placeholder="Email" autocomplete="off" autocorrect="off" autocapitalize="off"/>
							</td>
						</tr>
						
						<tr>
							<td>
								<i class="fa fa-lock" aria-hidden="true"></i>
							</td>
							<td align="center">
								<input id="login_pwd" class="nonempty" type="password" placeholder="Password" autocomplete="off" autocorrect="off" autocapitalize="off"/>
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
				</div>
		</div>
	</div>

	
</div>
			
<div id="dialog-message" title="Error">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>
	<div id="div_errmsg"></div>
</div>

</body>
</html>
