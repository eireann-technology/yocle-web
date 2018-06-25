
/////////////////////////////////////////////////////////////////

var g_widgetID1 = 0;
var g_recaptcha_response = 0;

function initLogin(){

	//alert(2);

	// get os, platform and screensize
	//getHardwareSpec();
	checkPlatform(1);

	// remove cmenu
	cmenu();

	// hide action bar
	showhideactionbar(0);

	//alert(g_platform);
	var w = 320, h = 520;
	switch (g_platform){
		case 'ios':
		case 'android':
			//$('#div_topmenu').hide();
			//$('#div_title').parent().hide();
			// resize tabs
			w = g_nScreenW;
			h = g_nScreenH - 8;
			$('#tabs_login').css({
				'display': 'block',
				'border-bottom-width': 0,
				'border-radius': 0,
			});
			$('#div_footer').hide();
			break;

		//case 'web':
		default:
			$('#tabs_login').css({
				display: 'inline-block',
				float: 'none',
				width: w,
				height: h,
			});
			break;
	}
	$('#tabs_login').css({
		//'min-width': w,
		'min-height': h,
	});

	$( "#tabs_login" ).tabs();

	$('.toggle_gender')
		.toggles({
			drag: true, // allow dragging the toggle between positions
			click: true, // allow clicking on the toggle
			text: {
				on: 'Female', // text for the ON position
				off: 'Male' // and off
			},
			on: true, // is the toggle ON on init
			animate: 150, // animation time (ms)
			easing: 'swing', // animation transition easing function
			checkbox: null, // the checkbox to toggle (for use in forms)
			clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
			width: 118, // width used if not set in css
			height: 25, // height if not set in css
			type: 'select' // if this is set to 'select' then the select style toggle will be used
			//type: 'compact' // if this is set to 'select' then the select style toggle will be used
		})
		.on('toggle', function(e, active) {
		});//.data('toggles').toggle(true);

	// https://bdhacker.wordpress.com/2010/01/17/free-javascript-birthdate-picker/
	date_populate("signup_birth_date", "signup_birth_month", "signup_birth_year");

	$('input[type=text], input[type=password]').focus(function(e){
		var jobj = $(this);
		//console.info(jobj);
		jobj
			.highlight(0)
		if (jobj.data('ui-tooltip')) {
			jobj
				.tooltip('close')
				.tooltip('destroy')
			jobj
				.attr("title", "")
				.removeProp("title");
		}
	});

	// RECAPTCHA-RESPONSE
	if (g_siteKey){
		g_widgetID1 = grecaptcha.render('div_recaptcha', {
			'sitekey' : g_siteKey,
			//'theme' : 'dark',
			'theme' : 'light',
			'callback': function( response ) {
				console.log( 'g-recaptcha-response: ' + response );
				g_recaptcha_response = response;
			},
		});
	}
	//if (!g_widgetID1){
	//	console.error('recaptcha error', 'sitekey=' + g_siteKey, 'widget='+g_widgetID1);
	//}
	$('#div_recaptcha > div > div > iframe').on('load', function(){
		resizeDivRecaptcha();
	});
	$('input')
		.focus(function(){
			$(this).select();
		})
		.on('touchstart', function(){
			$(this).select();
		})
		.bind("dragstart", function(event) {
			//console.info('dragstart');
			event.preventDefault();
		})
	;

	// login
	$('#but_login').mouseup(function(e){
		goLogIn();
	});

	// signup
	$('#but_signup').mouseup(function(e){
		goSignUp();
	});

	// forgotpwd
	$('#td_forgot_pwd').html('Forgot password').unbind().mouseup(function(e){
		forgotPwd();
	});

	//initKeyboard();

}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function goSignUp(){
	$('#td_signup_error').text('');

	//$('input, button, select').prop('disabled', true);

	if (checkValid(['signup_email', 'signup_pwd', 'signup_name', 'signup_agree'])){
		var
				name 		= $('#signup_name').val().trim(),
				email 	= $('#signup_email').val().trim(),
				pwd 		= $('#signup_pwd').val().trim(),
				gender	= $('#signup_gender').data('toggles').active?1:0,
				birthday = get_birthday("signup_birth_date", "signup_birth_month", "signup_birth_year")
				//resp = g_widgetID1 ? grecaptcha.getResponse(g_widgetID1) : 0	//$('#g-recaptcha-response').text()
		;
		console.info(email, pwd, gender, birthday, g_recaptcha_response);
		openProgress2();
		call_svrop(
			{
				type: 'signup',
				name: name,
				email: email,
				pwd: pwd,
				gender: gender,
				birthday: birthday,
				'g-recaptcha-response': g_recaptcha_response,
			},
			function (obj){
				console.log(obj);
				closeProgress2();

				var error = 0;
				if (typeof(obj.error) == 'string'){
					error = obj.error;
				} else if (typeof(obj.responseText)){
					error = obj.responseText;
				}
				if (error){

					// failure
					$('#td_signup_error').text(error);
					//if (g_widgetID1){
						//grecaptcha.reset(g_widgetID1);
					//}
					grecaptcha.reset();
					resizeDivRecaptcha();
					$('input, button, select').prop('disabled', false);
				} else {

					// success
					if (g_widgetID1) grecaptcha.reset(g_widgetID1);
					$('#td_signup_error').text('');
					//setCookie('email', email, 7);	// last for 7 days only
					//setCookie('pwd', pwd, 7);
					//setCookie('login', 1, 7);
					$('#td_signup_error').html('<span style="color:blue">A confirmation email has been sent to your email account. Please check and follow its instructions.</span>');
					$('input, button, select').prop('disabled', false);
				}
			}

		);
	} else {
		$('input, button, select').prop('disabled', false);
	};
}

////////////////////////////////////////////////////////////////////////////////////////////////

function forgotPwd(){
	console.info('forgot pwd');
	BootstrapDialog.show({
		type: BootstrapDialog.TYPE_PRIMARY,
		cssClass: 'login-dialog',
		title: 'Find your password',
		closable: true,
		closeByBackdrop: true,
		closeByKeyboard: true,
		message:
						'<div>'
						+ 'The email address you used to signup.'
						+ '</div><br/>'
						+ '<div style="width:100%; text-align:center;">'
							+ '<input id="forgotpwd_email" class="nonempty isemail" type="text" placeholder="Email" autocomplete="off"/>'
						+ '</div>'
		,
		//onshow: function(){
		//},
		onshown: function(){
			//$('.bootstrap-dialog .btn-default').focus();	// set the focus
			$('#forgotpwd_email').focus();
		},
		buttons: [
			{
				icon: 'glyphicon glyphicon-ban-circle',
				label: 'Cancel',
				action: function(dialog){
					 dialog.close();
				}
			},
			{
				icon: 'glyphicon glyphicon-envelope',
				label: 'Send notification email',
				action: function(dialog){
					if (checkValid(['forgotpwd_email'])){
						var jobj = $('#forgotpwd_email');
						var email = jobj.val().trim();
						$('input, button, select').prop('disabled', true);
						console.info('Sending to server...', email);
						// call_svrop
						call_svrop(
							{
								type: 'reset_pwd',
								email: email,
							},
							function (obj){
								console.info('output', obj);

								// resume box
								$('input, button, select').prop('disabled', false);
								dialog.close();

								//console.error('failed', obj);
								var error = '', msg = '', msg_type = '';
								if (typeof(obj.error) == 'string' && obj.error != ''){
									msg_type = BootstrapDialog.TYPE_WARNING;
									msg = '<span class="glyphicon glyphicon-warning-sign"></span> &nbsp;&nbsp; <span style="color:red">' + obj.error + '</span>';
								} else {
									msg_type = BootstrapDialog.TYPE_PRIMARY;
									msg = 'An email has been sent to your mailbox. Please check it and continue.';
								}
								//$('#div_forgotpwd_status').text(error);
								// SHOW NEW DIALOG
								BootstrapDialog.show({
									type: msg_type,
									title: 'Reset password',
									message: msg,
									buttons:[{
										label: 'Close',
										action: function(dialog){
											dialog.close();
										},
									}],
								});
							}
						);
					}
				}
			},
		]
	});
}

////////////////////////////////////////////////////////////////

function resizeDivRecaptcha(){
	//console.info('recaptcha loaded');
	$('#div_recaptcha > div').width(0);
	$('#div_recaptcha > div > div > iframe').css({
		'transform': 'scale(.82)',
		'transform-origin': '0px',
		'border-radius': '6px',
		//'zoom': 0.85,
	});
	//alert(4);
}


///////////////////////////////////////////////////////////////////////////////

function openLogin(){
	var email = '' , pwd = '', remember = 0;
	if (confirmed_email){

		$('#login_email').prop('disabled', true);
		email = confirmed_email;
	} else if (signupemail){

		$("#tabs_login").tabs("option", "active", 1);
		$('#signup_email').val(signupemail).prop('disabled', true);

	} else if (loginemail){

		$('#login_email').prop('disabled', true);
		email = loginemail;

	} else {

		$('#login_email').prop('disabled', false);
		remember = getCookie('remember') == 1 ? 1 : 0;
		if (remember != 1){
			setCookie('email', '');
			setCookie('pwd', '');
		}
		//setCookie('login', 0);
		email = getCookie('email');
		pwd = getCookie('pwd');
	}
	//alert(email);

	// refill the inputs
	$('#login_email').val(email);
	$('#login_pwd').val(pwd);
	$('#login_remember').prop('checked', remember ? true : false);

	var s = '';
	if (g_secret_token != ''){
		s = '<span style="color:blue">Your email address is confirmed. Please enter your password to login.</span>';
	} else if (reset_pwd != ''){
		s = '<span style="color:blue">Please enter the new password above.</span>';
	}
	$('#td_login_error').html(s);

	// show and hide
	$('#div_login').show();
	$('#div_main').hide();
	$('.ui-tabs-nav').show();

	resetUserData();

	//$('#login_email').focus();
	switch (g_platform){
		case 'ios':
		case 'android':
			$('html, body').css('overflow-y', 'hidden');
			break;
		case 'web':
			$('html, body').css('overflow-y', 'auto');
			break;
	}
	checkOnResize();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function openMain(){
	$('#login_pwd')
		.attr('placeholder', 'Password')
		.val('');
	$('#td_login_error').html('');
	$('#div_login').hide();
	$('#div_main').show();
	$('html, body').css('overflow-y', 'auto');
	if (g_platform != 'web' && g_nativeapp == 1){
		$('.ui-tabs-nav').hide();
	}

	if (g_user_id == 2 && g_platform == 'web'){
		$('.but_import').show();
	} else {
		$('.but_import').hide();
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////

function goLogIn(){
	$('#td_login_error').text('');
	// disable input
	$('input, button, select, #tabs_login').prop('disabled', true);

	if (checkValid(['login_email', 'login_pwd'])){
		var email = $('#login_email').val().trim(),
				pwd = $('#login_pwd').val().trim(),
				remember = $('#login_remember').prop('checked')?1:0
		;
		console.info(email, pwd, remember, reset_pwd);

		openProgress2();
		//return;
		//console.info(reset_pwd, typeof(reset_pwd));
		call_svrop(
			{
				type: 'check_login',
				email: email,
				pwd: pwd,
				reset_pwd: reset_pwd,
				remember: remember,
				secret_token: g_secret_token,
			},
			function (obj){

				// close progress
				closeProgress2();

				// reset things
				reset_pwd = '';
				$('#td_forgot_pwd').css('cursor', 'pointer').html('Forgot password').unbind().mouseup(function(e){
					forgotPwd();
				});

				// remove disable
				$('input, button, select, #tabs_login').prop('disabled', false);

				// login now
				if (obj.error){
					$('#td_login_error').text(obj.error);
				} else {
					//console.log(obj);
					$('#td_login_error').text('');

					// reset one-time variable
					g_secret_token = '';
					confirmed_email = '';
					reset_pwd = '';
					loginemail = '';
					signupemail = '';

					// remember
					setCookie('email', email, 7);	// last for 7 days only
					setCookie('pwd', pwd, 7);
					setCookie('reset_pwd', reset_pwd, 7);
					setCookie('remember', remember, 7);
					setCookie('login', 1, 7);
					storeLogonSession();

					// forward to index.php
					$('#td_login_error').text('');
					setMyUser(obj.user);

					// connect to chat server
					connectChatServer();

					// open interface
					openMain();
					openHome();

					checkOnResize();
					//setTimeout(function(){
					//	checkOnResize();
					//}, 200);
				}
			},
			function (obj){
				//console.info(obj);
				$('#td_login_error').text(obj.error);
				$('input, button, select, #tabs_login').prop('disabled', false);
			}
		);
	} else {
		$('input, button, select').prop('disabled', false);
	};
}

//////////////////////////////////////////////////////////////////////

function goLogOut(){
	confirmDialog('Are you sure to log out?', function(){
		console.info('logout');

		//$('.myinfo_photo').attr('src', './images/new_user.png');

		// log out from the app
		var jsonstr = "{\"status\":\"1\",\"uri\":\"\",\"name\":\"\"}";
		changeprofile(jsonstr);

		// disconnect from server
		disconnectChatServer();

		// store cookie
		setCookie('login', 0);
		storeLogonSession();

		// change interface
		openLogin();
	});
}

//////////////////////////////////////////////////////////////

function resetUserData(){
	$('.myinfo_photo').attr('src', './images/new_user.png');
	$('.myinfo_username,.myinfo_birthday,.myinfo_position,.myinfo_location,.myinfo_mood,.myinfo_relationship').html('');
	$('#tbl_skills_home>tbody>tr').remove();
	$('canvas').each(function(){
			var
				canvas = $(this)[0],
				context = canvas.getContext('2d');
			;
			context.clearRect(0, 0, canvas.width, canvas.height);
	});
	$('.div_gauge1,.userstat_data').html('');
	$('#iframe_pdf').attr('src', 'about:blank');
	$('#inp_search_activity').val('');
}
