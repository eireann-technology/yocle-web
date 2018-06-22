<?php

include_once ('pushnotification.php');


$payload = create_payload_json('YOCLE:::You have new assessor:::http://www.google.com');

$user_mobile_info = ['user_device_type'=>"Android", 'user_mobile_token'=>['APA91bHxPwqQTf3G4z4tpfKQyypSEBOlo59DvxYaq6aH6MpXCm-h1ImAFH9cyQ5ERW5j0bLkSyY0QRPq0x5c1q-BwK_Z49quHJ_bCap-ccYfbvX2HATHaiRHTLTrZfFIw7kOrPl6HLh8','1112']];

//$user_mobile_info = ['user_device_type'=>"iOS", 'user_mobile_token'=>'7dca070980a014e7463c4df931b69d33510b92c8dde6d1f520c7f5f77807364c'];

send_mobile_notification_request($user_mobile_info, $payload);




?>
