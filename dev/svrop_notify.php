<?php

if (!defined('ENABLE_NOTIFICATION_SENDING')){
	if (strpos($_SERVER['HTTP_HOST'], 'yocle.net') === FALSE){
		define('ENABLE_NOTIFICATION_SENDING', 0);
	} else {
		define('ENABLE_NOTIFICATION_SENDING', 1);
	}
}
//echo ENABLE_NOTIFICATION_SENDING; exit();

// https://yocle.net/svrop.php?type=sendnotifytest

$notification_title = "Yocle";
// create by Tom 20170705
define('ANDROID_LEGACY_SERVER_KEY', 'AIzaSyB_ZvzsTcJ1OpkAHglqt91hM3_CmO_7QmU');
define('ANDROID_SENDER_ID', 'AAAAQtslsrU:APA91bGEga44a8zPI90HWnyE_ZeHA2CxFzTBui7ydjfos6cAmkvJKO67WqssWjDi6s3pU3di-mUQJrkBvXbjVKYTF7XACpVYsUNbYl-VtfGNg9GJ0vlVYBtFxN1WeEnRtqn0QgTkLou2');	// unused

///////////////////////////////////////////////////////////////////////////////

function notifyToken(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_usr, $col_act;
	$platform = getQs('platform');
	$token = getQs('token');
	if (!$user_id){
		$error = "invalid user_id";
	} else if (!$token){
		$error = "invalid token: $token";
	} else if ($platform != 'ios' && $platform != 'android'){
		$error = "invalid platform: $platform";
	} else {
		$filters = ['user_id' => $user_id];
		$set = [ "token_$platform" => $token];
		$update = ['$set' => $set ];
		$result = databaseUpdate($database, $col_usr, $filters, $update);
	}
}

///////////////////////////////////////////////////////////////////////////////
// sendNotify
// - title
// - contents
// - url
///////////////////////////////////////////////////////////////////////////////

function sendNotify(){
	global $database, $error, $type, $email, $pwd, $error, $output, $user_id;

	// read query string
	$title = getQs('title');
	$contents = getQs('contents');
	$url = getQs('url');

	// read database
	$options = ['projection' => ['_id'=> 0, 'token_ios' => 1, 'token_android' => 1]];
	$documents = databaseRead($database, 'users', ['user_id' => $user_id], $options);
	if ($documents && sizeof($documents) > 0){
		$user = $documents[0];		//print_json($user);

		// send to android
		if (isset($user->token_android) && $user->token_android){
			send_notification_android2($user->token_android, $contents, $url);
		}
		// send to ios
		if (isset($user->token_ios) && $user->token_ios){
			send_notification_ios2($user->token_ios, $contents, $url);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////

function check_gcm_result($result, $devicelist) {
	$r = json_decode($result);
//	print "success={$r->success}\n";
  $rv = array();
	$count = -1;
	foreach ($r->results as $val) {
		$count++;
		if (isset($val->message_id)) {
		//	print "Message id={$val->message_id}\n";
			if(isset($val->registration_id)) {
				// need to update db the android device id
				array_push($rv, array('action' => 'update', 'id' => $devicelist[$count], 'newid' => $val->registration_id));
				print "Need to update id '{$devicelist[$count]}' to '{$val->registration_id}'\n";
			}	else {
				print "Sucessfully sent to device id '{$devicelist[$count]}'\n";
			}
		}
		else if(isset($val->error)) {
		//	print "Error={$val->error}\n";
			if($val->error=="InvalidRegistration") {
				// need to remove this id from db
				array_push($rv, array('action' => 'delete', 'id' => $devicelist[$count]));
				print "Error - Need to remove device id '{$devicelist[$count]}' from db\n";
			}
			else {
				// may need to resend to this id
				array_push($rv, array('action' => 'resend', 'id' => $devicelist[$count]));
				print "Error - Need to resend to device id '{$devicelist[$count]}'\n";
			}
		}
	}
	return json_encode($rv);
}

/////////////////////////////////////////////////////////////////////////////////

function sendNotify_invitation2($coor_name, $is_ios, $token_arr, $act){
	global $test_qs;
	$debug = isset($test_qs);
	$debug = 0;
	//if ($debug){
		//echo "<b>sendNotify_invitation: coor_name=$coor_name, android=$token_android, ios=$token_ios, usertype=$user_types</b>";
	//}
	$server = my_server_url();
	$url = "$server/?act_id=$act->act_id";
	$contents = "\"$act->title\" invited by $coor_name";

	if ($is_ios){
		send_notification_ios2($token_arr, $contents, $url);
	} else {
		send_notification_android2($token_arr, $contents, $url);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////

function sendNotify_messenger($msg_type, $item_id, $msg, $token_android, $token_ios){
	global $test_qs, $user_id;
	$debug = isset($test_qs);
	$debug = 0;
	//if ($debug){
	//	echo "<b>sendNotify_messenger: msg_type=$msg_type item_id=$item_id msg=$msg android=$token_android ios=$token_ios</b>";
	//}
	$server = my_server_url();
	$url = "$server/?msg_type=$msg_type&item_id=$item_id";
	$contents = $msg;
	wlog($url);

	// send to android
	if ($token_android != ''){
		send_notification_android2($token_android, $contents, $url);
	}
	// send to ios
	if ($token_ios != ''){
		send_notification_ios2($token_ios, $contents, $url);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function sendNotify_whatsup($whatsup_id, $msg, $token_android, $token_ios){
	global $test_qs, $user_id;
	$debug = isset($test_qs);
	$debug = 0;
	//if ($debug){
	//	echo "<b>sendNotify_messenger: msg_type=$msg_type item_id=$item_id msg=$msg android=$token_android ios=$token_ios</b>";
	//}
	$server = my_server_url();
	$url = "$server/?whatsup_id=$whatsup_id";//&user_id=$user_id";
	$contents = $msg;
	//wlog($url);

	// send to android
	if ($token_android != ''){
		send_notification_android2($token_android, $contents, $url);
	}
	// send to ios
	if ($token_ios != ''){
		send_notification_ios2($token_ios, $contents, $url);
	}
}


///////////////////////////////////////////////////////////////
// http://www.b2cloud.com.au/tutorial/ios-push-notifications-in-php/
// https://stackoverflow.com/questions/1642411/sending-multiple-iphone-notifications

function send_notification_ios2($tokens, $contents, $url){

	if (ENABLE_NOTIFICATION_SENDING == 0){
		wlog("skipped send_notification_ios2");
		return;
	}

	global $notification_title;

	$debug_ios = 1;

	$apns_port = 2195;	//Apple server listening port
	$apns_url = 'gateway.push.apple.com';

	// check if it is just 1 token
	if (!is_array($tokens)){
		$tokens = [$tokens];
	}

	// https://stackoverflow.com/questions/6307748/what-is-the-maximum-length-of-a-push-notification-alert-text
	$MAX_LEN_CONTENTS = 125;
	//$MAX_LEN_CONTENTS = 62;
	$len = strlen($contents);
	//wlog($len);
	if ($len > $MAX_LEN_CONTENTS){
		$contents = substr($contents, 0, $MAX_LEN_CONTENTS) . '...';
	}

	// The payload must not exceed 256 bytes and must not be null-terminated.
	$payload = json_encode(
		[
			'aps' => [
				//'uri' => "$notification_title:::$contents:::$url",
				//'sound' => 'default',
				//'badge' => 0,
				'alert' => $contents,
				'uri' => "::::::$url",
				'sound' => 'default',
			]
		]
	);

	// set stream with cert
	$stream_context = stream_context_create();
	$apns_cert = __DIR__ . '/svrop_notify_2018.pem';	// cert location
	if (!file_exists($apns_cert)){
		echo "wrong path for apns_cert: $apns_cert";
		exit();
	}
	stream_context_set_option($stream_context, 'ssl', 'local_cert', $apns_cert);

	// set apns
	$apns = stream_socket_client('ssl://' . $apns_url . ':' . $apns_port, $error, $error_string, 2, STREAM_CLIENT_CONNECT, $stream_context);

	foreach ($tokens as $token){

		$apns_message = chr(0) . chr(0) . chr(32) .
			pack('H*', str_replace(' ', '', $token)) .
			chr(0) . chr(strlen($payload)) . $payload;

		if ($debug_ios){
			wlog('');
			wlog("send_notification_ios2: $token $contents $url $apns_message");
			wlog('');
		}

		fwrite($apns, $apns_message);
	}

	//@socket_close($apns);	// would halt under apache
	@fclose($apns);
}

//////////////////////////////////////////////////////////

function send_notification_android2($tokens, $contents, $url){
	if (ENABLE_NOTIFICATION_SENDING == 0){
		wlog("skipped send_notification_android2");
		return;
	}

	global $notification_title;

	if (!is_array($tokens)){
		$tokens = [$tokens];
	}
	$debug_android = 1;

	// $url = 'https://videoboard.hk:8081/dev/?act_id=60';
	// $url = 'https://www.google.com';

	$fields = [
		'registration_ids' => $tokens,
		'data' => [
			'message'			=> "$notification_title:::$contents:::$url",	// 1st will show for just a while, then $contents
			'vibrate'			=> 1,
			'sound'				=> 1,
			'largeIcon'		=> 'large_icon',
			'smallIcon'		=> 'small_icon',
		]
	];
	//print_json($fields);
	if ($debug_android){
		wlog('');
		wlog("send_notification_android2: $contents $url " . json_encode($fields));
		wlog('');
	}
	$ch = curl_init();
	curl_setopt( $ch, CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
	curl_setopt( $ch, CURLOPT_POST, true );
	curl_setopt( $ch, CURLOPT_HTTPHEADER, [
		'Authorization: key=' . ANDROID_LEGACY_SERVER_KEY, //AIzaSyAODhFg4DMXNpevhd9J42NKDenHSuo5A1E',
		'Content-Type: application/json',
	]);
	curl_setopt( $ch, CURLOPT_RETURNTRANSFER, true );
	curl_setopt( $ch, CURLOPT_SSL_VERIFYPEER, false );
	curl_setopt( $ch, CURLOPT_POSTFIELDS, json_encode( $fields ));
	$result = curl_exec($ch);
	curl_close($ch);
	//$followup = check_gcm_result($result, $token_arr);
	//print "Follow up actions={$followup}\n\n";
}

?>
