<?php


// define allow flag
define('ENABLE_NOTIFICATION_SENDING', 1);
define('ENABLE_EMAIL_SENDING', 1);

include "common.php";
include "svrop_notify.php";
include "svrop_email.php";

///////////////////////////////////////////////////////////////////////////////////

function sendNotifyTest(){
	$contents = 'this is a testing.';
	$url = 'http://www.google.com';

	$contents = '"Ho Man Tin Government Secondary School July 2017- Have, U Can Programme 全能有情教育工作坊" invited by Cecilia Chan';
	$url = "https://yocle.net/?act_id=2";

	////////////////////////
	// ANDROID TEST
	////////////////////////
	echo "<h2 style='color:red'>Performing android notification test...</h2><br/>";
	// given by android mobile, from token android in database
	//$token_android = 'APA91bGmp420_23KF5yU2Zh3gK0INDMWHJY2LVirA_3OD3YeaYBd9F4bY3nysPRCofJW_Tfg3SdsuJQxFGMF-ocV-AylAAp4JJ_s6T2eyJr7iLzeQ3C1jjzYLZHfGwROwU2CGEAtpsUF';
	$token_android ='APA91bFQ4dczgGCZwYucri_V9dyheV7DRaSPkL_iPNi_0Fu7nX1uZHFll4nzg4gSLnRv9v6LglRTBmdclafRy_zYhLB1lr67DG2nTQfpuU6SM6Vy843EjaJLX4ehnCD4ky_kB5KnlXLc';
	send_notification_android2($token_android, $contents, $url);
	//send_notification_android2([$token_android, $token_android], $contents, $url);

	////////////////////////
	// IOS TEST
	////////////////////////
	echo "<h2 style='color:red'>Performing ios notification test...</h2><br/>";
	//$token_ios = '3a344e04e802c951e2ba789e906effd728002a01f4ee3a2548b76d47323be162';	// ???
	$token_ios = '25558d72b3161a5a3dcb01e11f46c9d8b3c8b314cd0cd96441453bc718c15ad1';	// ipad pro
	//$contents = 'Ho Man Tin Government Secondary School July 2017- Have, U Can Programme 全能有情教育工作坊 - Cecilia Chan'; // not okay
	//$contents = 'Ho Man Tin Government Secondary School July 2017- Have, U Can Programme - Cecilia Chan'; // not okay
	$contents = '全能有情教育工作坊'; // okay
	send_notification_ios2($token_ios, $contents, $url);
	//send_notification_ios2([$token_ios, $token_ios], $contents, $url);

	////////////////////////
	// EMAIL TEST
	////////////////////////
	//echo "<h2 style='color:red'>Performing email notification test...</h2><br/>";
	//$emails = ['alantypoon@gmail.com', 'alan829@hku.hk'];
	//$emails = ['alantypoon@gmail.com' => 'Alan Poon', 'alan829@hku.hk' => 'Alan HKU'];
	//$emails = ['alantypoon@gmail.com'];
	//sendEmail(EMAIL_SENDER_ADRS, $emails, 'testing subject', 'testing body');
}

sendNotifyTest();


?>
