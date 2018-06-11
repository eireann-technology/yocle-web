<?php
// swiftmailer
require_once "swiftmailer-5.x/lib/swift_required.php";

if (!defined('ENABLE_EMAIL_SENDING')){
	if (strpos($_SERVER['HTTP_HOST'], 'yocle.net') === FALSE){
		define('ENABLE_EMAIL_SENDING', 0);
	} else {
		define('ENABLE_EMAIL_SENDING', 1);
	}
}
$CR = "<br/>";
define('EMAIL_SENDER_ADRS', 'noreply@yocle.net');
define('EMAIL_SENDER_NAME', 'Yocle Team');
//$email_sender = [EMAIL_SENDER_ADRS => EMAIL_SENDER_ADRS];
//$email_sender = [EMAIL_SENDER_ADRS => EMAIL_SENDER_NAME];
//$email_sender = EMAIL_SENDER_ADRS;

function sendEmail($email_sender, $recipients, $subject, $body){

	if (ENABLE_EMAIL_SENDING == 0){
		wlog("skipped sendEmail: $subject");
		return;
	}

	global $test_qs, $CR;
	$result = 0;
	$debug = isset($test_qs);
	$debug = 0;

	//$debug = 1;	// for testing only

	$server = my_server_url();
	//echo $server;

	$email_host = '';
	$email_username = '';
	$email_password = '';
	switch ($server){
		default:
			$email_host = 'gmail';
			$email_username = 'yocle.help@gmail.com'; $email_password = 'btrtmr20170913'; //$email_password = 'Yocle@Yocle100';
			break;
	}
	if ($debug){
		echo "server=$server<br/>emailhost=$email_host<br/>email_username=$email_username<br/>email_password=$email_password<br/>";
	}

	if ($email_host && $email_username && $email_password){
/*
		// send confirmation email
		$port = 25; $options = '';
		if ($email_host == 'gmail'){
			//$email_host = "smtp.gmail.com";
			$email_host = "173.194.65.108";
			$port = 465;
			$options = 'ssl';
		}
*/
		//$transport = Swift_SmtpTransport::newInstance($email_host, $port, $options);
		//$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 'tls', 587);
		$transport = Swift_SmtpTransport::newInstance('smtp.gmail.com', 465, 'ssl');

		// transport
		$transport
			->setUsername($email_username)
			->setPassword($email_password)
		;
		if ($debug){
			echo "sender=$email_sender<br/> recipients=$recipients2<br/> body=$body<br/>";
		}

		// resolve array to string (emails delimited by comma)
//		$recipients2 = '';
//		if (is_array($recipients)){
//			$recipients2 = implode(';', $recipients);
//		} else {
//			$recipients2 = $recipients;
//		}

		// Create the Mailer using your created Transport
		$mailer = Swift_Mailer::newInstance($transport);
		//$logger = new \Swift_Plugins_Loggers_EchoLogger(); $mailer->registerPlugin(new \Swift_Plugins_LoggerPlugin($logger));	// testing only
		//  @return int The number of successful recipients. Can be 0 which indicates failure
		$message = Swift_Message::newInstance($subject)
			->setFrom($email_sender)
			// Set the To addresses with an associative array (setTo/setCc/setBcc)
			// ->setTo(['receiver@domain.org', 'other@domain.org' => 'A name'])
			->setTo($recipients)	// may input as array
			->setBody($body, "text/html")
		;
		// Send the message
		$result = $mailer->send($message);
	}

	// debug
	//$tmp = "sendEmail: server=$server sender=$email_sender recipients=$recipients2 subject=$subject body=$body";
	//if ($debug){
	//	echo "$tmp<br><br>";
	//} else {
		//wlog($tmp);
	//}
	return $result;
}

/////////////////////////////////////////////////////////////////////

function sendEmail_confirmation($username, $email, $secret_token){
	global $test_qs, $CR;
	$recipients = $email;
	$server = my_server_url();
	$url = "$server/?confirmed_email=$email&secret_token=$secret_token";
	$url = '<a href="' . $url . '">' . $url . '</a>';
	$subject = 'Yocle Account Confirmation';
	$body = "Dear $username,$CR$CRThank you for signing up with Yocle. Please click the following link to continue:$CR$CR $url $CR$CR Best regards,$CR$CR Yocle Team";
	return sendEmail(EMAIL_SENDER_ADRS, $recipients, $subject, $body);
}

/////////////////////////////////////////////////////////////////////

function sendEmail_forgotpwd($username, $email, $secret_token){
	global $test_qs, $CR;
	$recipients = $email;
	$server = my_server_url();
	$url = "$server/?confirmed_email=$email&reset_pwd=$secret_token";
	$url = '<a href="' . $url . '">' . $url . '</a>';
	$subject = 'Yocle Reset Password Request';
	$body = "Dear $username,$CR$CR We have received a request to reset your password. " .
					"Please click the following link to continue:$CR".
					"&nbsp;&nbsp;&nbsp;$url$CR$CR".
					"In case if the request is not made by you, please ignor it or contact us.$CR$CR".
					"Best regards,$CR Yocle Team";
	return sendEmail(EMAIL_SENDER_ADRS, $recipients, $subject, $body);
}

////////////////////////////////////////////////////////////////////////////////

function sendEmail_invitation($coor_name, $confirmed_email, $user_email, $user_types, $activity){
	global $test_qs;
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $CR;
	$debug = isset($test_qs);
	$debug = 0;
	if ($debug){
		echo "sendEmail_invitation: $user_email<br><br>";
	}

	$server = my_server_url();
	if (!$confirmed_email){
		$url = "$server/?signupemail=$user_email";
	} else {
		$url = "$server/?act_id=$activity->act_id";
	}
	$url = '<a href="' . $url . '">' . $url . '</a>';

	$subject = "Yocle Invitation: $activity->title";
	$body = "Hello,$CR$CR"
					."$coor_name would like to invite you to be $user_types in the activity named:$CR$CR"
					."     $activity->title .$CR$CR"
					."Please check this out at:$CR$CR"
					."&nbsp;&nbsp;&nbsp;$url $CR$CR"
					."$CR$CR"
					."Best regards,$CR$CR"
					."Yocle Team";

	sendEmail(EMAIL_SENDER_ADRS, $user_email, $subject, $body);
}

/////////////////////////////////////////////////////////////////////

function sendEmail_changeemail($username, $user_id, $email, $email_token){
	global $test_qs, $CR;;
	$recipients = $email;
	$server = my_server_url();
	$url = "$server/confirm_email.php?user_id=$user_id&email_token=$email_token";
	$url = '<a href="' . $url . '">' . $url . '</a>';
	$subject = 'Yocle Account Confirmation';
	$body = "Dear $username,$CR$CR Please click the following link to confirm the change of email: ".
		"&nbsp;&nbsp;&nbsp;$CR $url $CR $CR Best regards,$CR$CR Yocle Team";
	return sendEmail(EMAIL_SENDER_ADRS, $recipients, $subject, $body);
}

////////////////////////////////////////////////////////////////////////////////

function sendEmail_invitation2($coor_name, $email_arr, $act){
	global $test_qs;
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $CR;
	$debug_email = 1;

	$nemail = sizeof($email_arr);
	$server = my_server_url();
	$url = "$server/?act_id=$act->act_id";
	$url = '<a href="' . $url . '">' . $url . '</a>';
	$subject = "Yocle Invitation: $act->title";
	$body = "Hello,$CR$CR"
					."$coor_name would like to invite you to join the activity named:$CR$CR"
					."     $act->title .$CR$CR"

					."Please check this out at: $CR$CR"
					."&nbsp;&nbsp;&nbsp;$url $CR$CR"

					."$CR$CR"
					."Best regards,$CR$CR"
					."Yocle Team";

	return sendEmail(EMAIL_SENDER_ADRS, $email_arr, $subject, $body);
}

?>
