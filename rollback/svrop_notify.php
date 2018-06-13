<?php
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
			send_notification_android($user->token_android, $contents, $url);
		}
		// send to ios
		if (isset($user->token_ios) && $user->token_ios){
			send_notification_ios($user->token_ios, $contents, $url);
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////

function send_notification_android($token, $contents, $url){
	global $notification_title;
	
	// $url = 'https://videoboard.hk:8081/dev/?act_id=60';
	// $url = 'https://www.google.com';
	
	$fields = [
		'registration_ids' => [$token],
		'data' => [
			'message'			=> "$notification_title:::$contents:::$url",	// 1st will show for just a while, then $contents
			'vibrate'			=> 1,
			'sound'				=> 1,
			'largeIcon'		=> 'large_icon',
			'smallIcon'		=> 'small_icon',
		]
	];	
	//print_json($fields);
	wlog("send_notification_android: $token $contents $url " . json_encode($fields));
	
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
	//$followup = check_gcm_result($result, [$token]);
	//print "Follow up actions={$followup}\n\n";
}

////////////////////////////////////////////////////////////////////////////////////////////////

function send_notification_ios($token, $contents, $url){
	global $notification_title;
	// $url = 'https://videoboard.hk:8081/dev/?act_id=60';
	// $url = 'https://www.google.com';
	
	$apns_port = 2195;	//Apple server listening port
	$apns_url = 'gateway.push.apple.com';
	$json = json_encode(['aps' => ['alert' => $contents, 'uri' => "$notification_title:::$contents:::$url", 'sound' => 'default', 'badge' => 0]]);
	$apns_message = chr(0) . chr(0) . chr(32) .	pack('H*', str_replace(' ', '', $token)) . chr(0). chr(strlen($json)) . $json;
	
	wlog("send_notification_ios: $token $contents $url $json");
	//print_json($json);
	//echo $apns_message;
	
	// cert location
	$apns_cert = __DIR__ . '/svrop_notify.pem';
	
	// set stream with cert
	$stream_context = stream_context_create();
	stream_context_set_option($stream_context, 'ssl', 'local_cert', $apns_cert);
	
	// set apns
	$apns = stream_socket_client('ssl://' . $apns_url . ':' . $apns_port, $error, $error_string, 2, STREAM_CLIENT_CONNECT, $stream_context);
	if ($apns){
		$result = fwrite($apns, $apns_message);
	}
	//@socket_close($apns);	// would halt under apache
	@fclose($apns);	
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

//////////////////////////////////////////////////////////////////////////////////////////////

function sendNotify_invitation($coor_name, $token_android, $token_ios, $user_types, $activity){
	global $test_qs;
	$debug = isset($test_qs);
	$debug = 0;
	if ($debug){
		echo "<b>sendNotify_invitation: coor_name=$coor_name, android=$token_android, ios=$token_ios, usertype=$user_types</b>";
	}
	$server = my_server_url();
	$url = "$server/?act_id=$activity->act_id"; 
	$contents = "$coor_name invites you to join \"$activity->title\"!";
	
	// debug to file
	wlog("sendNotify_invitation: $url");
	
	// send to android
	if ($token_android != ''){
		send_notification_android($token_android, $contents, $url);
	}
	// send to ios
	if ($token_ios != ''){
		send_notification_ios($token_ios, $contents, $url);
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
		send_notification_android($token_android, $contents, $url);
	}
	// send to ios
	if ($token_ios != ''){
		send_notification_ios($token_ios, $contents, $url);
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
		send_notification_android($token_android, $contents, $url);
	}
	// send to ios
	if ($token_ios != ''){
		send_notification_ios($token_ios, $contents, $url);
	}	
}

///////////////////////////////////////////////////////////////////////////////////

function sendNotifyTest(){
	$contents = 'this is a testing.';
	$url = 'http://www.google.com';
	////////////////////////
	// ANDROID TEST
	////////////////////////
	// given by android mobile, from token android in database
	$token_android = 'APA91bGmp420_23KF5yU2Zh3gK0INDMWHJY2LVirA_3OD3YeaYBd9F4bY3nysPRCofJW_Tfg3SdsuJQxFGMF-ocV-AylAAp4JJ_s6T2eyJr7iLzeQ3C1jjzYLZHfGwROwU2CGEAtpsUF';
	send_notification_android($token_android, $contents, $url);
	////////////////////////
	// IOS TEST
	////////////////////////
	
}

?>
