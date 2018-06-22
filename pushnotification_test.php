<?php
// send_alan.php
// for alan's ios and androdi
//include "common.php";
//include "database.php";
//include 'svrop_notify.php';
//include 'pushnotification.php';

//////////////////////////////////////////////////////////////////////////////////////////////////////////

function send_mobile_notification_request($user_mobile_info, $payload_info)
{
    //Default result
    $result = -1;
    //Change depending on where to send notifications - either production or development
//    $pem_preference = "development";
    //$pem_preference = "production";
    $user_device_type = $user_mobile_info['user_device_type'];
    $user_device_key = $user_mobile_info['user_mobile_token'];

    if ($user_device_type == "iOS") {

			//$apns_url = NULL;
			//$apns_cert = NULL;
			//Apple server listening port
			$apns_port = 2195;

			//if ($pem_preference == "production") {
			//		$apns_url = 'gateway.push.apple.com';
//            $apns_cert = __DIR__.'/cert-prod.pem';
			//		$apns_cert = __DIR__.'/pushcert.pem';
					
			//}	//develop .pem
			//else {
			//		$apns_url = 'gateway.sandbox.push.apple.com';
			//		$apns_cert = __DIR__.'/dev_pa_yocle.pem';
			//}
			$apns_url = 'gateway.push.apple.com';
			$apns_cert = __DIR__ . '/svrop_notify.pem';

			$stream_context = stream_context_create();
			stream_context_set_option($stream_context, 'ssl', 'local_cert', $apns_cert);
			$apns = stream_socket_client('ssl://' . $apns_url . ':' . $apns_port, $error, $error_string, 2, STREAM_CLIENT_CONNECT, $stream_context);
			$apns_message = chr(0) . chr(0) . chr(32) . pack('H*', str_replace(' ', '', $user_device_key)) . chr(0) . chr(strlen($payload_info)) . $payload_info;
			
			echo "send_notification_ios: " . $payload_info;
			
			if ($apns) {
				$result = fwrite($apns, $apns_message);
			}
			echo "closed1";
			//@socket_close($apns);
			echo "closed2";
			@fclose($apns);
			echo "closed3";
			
    } else if ($user_device_type == "Android") {

        // API access key from Google API's Console
        define('API_ACCESS_KEY', 'AIzaSyAODhFg4DMXNpevhd9J42NKDenHSuo5A1E');

        // prep the bundle
        $msg = array
        (
            'message' 	=> json_decode($payload_info)->aps->uri,
            'title'		=> 'This is a title. title',
            'subtitle'	=> 'This is a subtitle. subtitle',
            'tickerText'=> 'Ticker text here...Ticker text here...Ticker text here',
            'vibrate'	=> 1,
            'sound'		=> 1,
            'largeIcon'	=> 'large_icon',
            'smallIcon'	=> 'small_icon'
        );
        $fields = array
        (
//            'registration_ids' 	=> array($user_device_key),
            'registration_ids' 	=> $user_device_key,
            'data' => $msg
        );

        $headers = array
        (
            'Authorization: key=' . API_ACCESS_KEY,
            'Content-Type: application/json'
        );

        $ch = curl_init();
        curl_setopt( $ch,CURLOPT_URL, 'https://android.googleapis.com/gcm/send' );
        curl_setopt( $ch,CURLOPT_POST, true );
        curl_setopt( $ch,CURLOPT_HTTPHEADER, $headers );
        curl_setopt( $ch,CURLOPT_RETURNTRANSFER, true );
        curl_setopt( $ch,CURLOPT_SSL_VERIFYPEER, false );
				
				print_json($fields);
				
        curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
        $result = curl_exec($ch);
				$followup = check_gcm_result($result, $user_device_key);
				print "Follow up actions={$followup}\n\n";
        curl_close($ch);
    }
    return $result > 0;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

//Create json file to send to Apple/Google Servers with notification request and body
function create_payload_json($message) {
	//Badge icon to show at users ios app icon after receiving notification
	$badge = "0";
	$sound = 'default';

	$appname = strtok($message, ":::");
	$title = strtok(":::");
	$uri = strtok(":::");

	$payload = array();
	$payload['aps'] = array('uri' => $message, 'alert' => $title, 'badge' => intval($badge), 'sound' => $sound);
	return json_encode($payload);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////

$payload = create_payload_json('Yocle:::Invitation:::https://videoboard.hk:8081/dev/?act_id=1');

////////////////////////////////////////////////////////////
// android sedning
////////////////////////////////////////////////////////////
$user_mobile_info = [
	'user_device_type' => "Android",
	'user_mobile_token' => [
		'APA91bGx1n6kvbagyQXHtClczDJBfvWo1TqiAQ-6AXOIdI2wC5B5O-RxL8STtGKzASwbT6i88JMDiuO-fX447xDKIYvB-zRjORgPz4p2seEqjLweawdlp9uT-hcVi1i6uo2qk_-_UyXI',
		//'1112'
	]
];
//send_mobile_notification_request($user_mobile_info, $payload); echo "<br><br>android request are sent successessfull";

////////////////////////////////////////////////////////////
// ios sending
////////////////////////////////////////////////////////////
$user_mobile_info = [
	'user_device_type'=>"iOS",
	'user_mobile_token' => 'e5e03b6886debad9f6226a77f68f153422fe67d1b5573e5d4df0c6aae2e846c4',
];
send_mobile_notification_request($user_mobile_info, $payload); echo "<br>ios request are sent successessfull";


?>
