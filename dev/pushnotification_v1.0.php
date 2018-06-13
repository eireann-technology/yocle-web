<?php

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function send_mobile_notification_request($user_mobile_info, $payload_info){
    //Default result
    $result = -1;
    //Change depending on where to send notifications - either production or development
    $pem_preference = "development";
    $user_device_type = $user_mobile_info['user_device_type'];
    $user_device_key = $user_mobile_info['user_mobile_token'];

    if ($user_device_type == "iOS") {

        $apns_url = NULL;
        $apns_cert = NULL;
        //Apple server listening port
        $apns_port = 2195;

        if ($pem_preference == "production") {
            $apns_url = 'gateway.push.apple.com';
            $apns_cert = __DIR__.'/cert-prod.pem';
        }
        //develop .pem
        else {
            $apns_url = 'gateway.sandbox.push.apple.com';
            $apns_cert = __DIR__.'/dev_pa_yocle.pem';
        }

        $stream_context = stream_context_create();
        stream_context_set_option($stream_context, 'ssl', 'local_cert', $apns_cert);
echo 1;
        $apns = stream_socket_client('ssl://' . $apns_url . ':' . $apns_port, $error, $error_string, 2, STREAM_CLIENT_CONNECT, $stream_context);
echo 2;
        $apns_message = chr(0) . chr(0) . chr(32) . pack('H*', str_replace(' ', '', $user_device_key)) . chr(0) . chr(strlen($payload_info)) . $payload_info;
echo 3;
        if ($apns) {
						echo("<br>apns_url=$apns_url <br>");
						echo("<br>apns_port=$apns_port <br>");
						echo("<br>error=$error <br>");
						echo("<br>error_string=$error_string <br>");
						echo("<br>stream_context=$stream_context <br>");
						echo("<br>apns_message=$apns_message <br><br>");
            $result = fwrite($apns, $apns_message);
        }
echo 4;
        @socket_close($apns);
echo 5;
        @fclose($apns);
echo 6;

    }
    else if ($user_device_type == "Android") {

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
        curl_setopt( $ch,CURLOPT_POSTFIELDS, json_encode( $fields ) );
        $result = curl_exec($ch);
				$followup = check_gcm_result($result, $user_device_key);
				print "Follow up actions={$followup}\n\n";
        curl_close($ch);
    }
    return $result > 0;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function check_gcm_result($result, $devicelist) {
	$r = json_decode($result);
//	print "success={$r->success}\n";

  $rv = array();
	$count = -1;
	foreach ($r->results as $val) {
		$count++;
		if(isset($val->message_id)) {
		//	print "Message id={$val->message_id}\n";
			if(isset($val->registration_id)) {					
					// need to update db the android device id
					array_push($rv, array('action' => 'update', 'id' => $devicelist[$count], 'newid' => $val->registration_id));					
					print "Need to update id '{$devicelist[$count]}' to '{$val->registration_id}'\n";
			}
			else {
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

?>
