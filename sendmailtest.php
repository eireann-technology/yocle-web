<?php
exit(); // remove to be active

set_time_limit (300); //60sec x 5 = 300sec

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once "swiftmailer-5.x/lib/swift_required.php";

try {
	// Create the Transport
	echo 1;
	//$transport = Swift_SmtpTransport::newInstance('smtproam.hku.hk', 25)	// 147.8.145.78
	$transport = Swift_SmtpTransport::newInstance('147.8.145.78', 25)	// 147.8.145.78
		->setUsername('yfolio@hku.hk')
		->setPassword('rnquXky0rn')
	;
	echo 2;

	/*
	You could alternatively use a different transport such as Sendmail or Mail:

	// Sendmail
	$transport = Swift_SendmailTransport::newInstance('/usr/sbin/sendmail -bs');

	// Mail
	$transport = Swift_MailTransport::newInstance();
	*/

	echo 3;
	// Create the Mailer using your created Transport
	$mailer = Swift_Mailer::newInstance($transport);
	$logger = new \Swift_Plugins_Loggers_EchoLogger();
	$mailer->registerPlugin(new \Swift_Plugins_LoggerPlugin($logger));

	echo 4;
	// Create a message
	$message = Swift_Message::newInstance('Wonderful Subject2')
		->setFrom(array('yfolio@hku.hk' => 'Yfolio'))
		->setTo(array('alan829@hku.hk', 'alantypoon@gmail.com' => 'Alan Poon(gmail)'))
		->setBody('Here is a testing of sending email by swiftmaler')
		;

	echo 5;
	// Send the message
	$result = $mailer->send($message);

	echo 6;

} catch(Exception $exception){
    //A big object containing the error message
    print_r($exception);
}
?>