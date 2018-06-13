<?php

$MSG_TYPE_USR = 1;
$MSG_TYPE_ACT = 2;

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function checkUsersActs(){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act, $col_usr, $act_id, $test_qs;
	global $template_uact_ass_item, $template_uact_skill;
	$act_ids = getQs('act_ids');
	$user_ids = getQs('user_ids');

	// convert to hash arr
	$user_ids_hash = [];
	
	if ($user_ids != ""){
		$user_ids_hash = num2hashArr($user_ids);
	}
	//print_json($act_ids);	print_json($user_ids);	exit();
	
	/////////////////////////////////////////////////////////////////////
	// ACTIVITY
	/////////////////////////////////////////////////////////////////////
	$output_acts = [];
	if ($act_ids != ""){
		foreach ($act_ids as $i => $act_id){
			$act_id = intval($act_id);

			
			$criteria = [ 'act_id' => $act_id ];
			$options = [ 'projection' =>
					[
						'_id' => 0, 'img_id' => 1, 'title' => 1, 'desc' => 1,
						'coordinator_id' => 1,
						//'participants' => 1,
						//'impression.panelists.others' => 1,
						//'assessment.assessments' => 1
					]
				];
			$documents = databaseRead($database, $col_act, $criteria, $options);
			if (sizeof($documents) > 0){
				$act = $documents[0];
				
				// add image id and title
				$output_acts[$act_id] = [
					'img_id' => $act->img_id,
					'title' => $act->title,
				];
/*				
				// add coordinator
				$user_ids_hash[$act->coordinator_id] = 1;
				
				// add participants
				foreach ($act->participants as $i => $user_id){
					$user_ids_hash[$user_id] = 1;
				}
				
				// add impression panelists
				$arr = $act->impression->panelists->others;
				for ($j = 0; $j < sizeof($arr); $j++){
					$user_id = $arr[$j];
					if ($user_id){
						$user_ids_hash[$user_id] = 1;
					}
				}				
				
				// add other assessors
				foreach ($act->assessment->assessments as $j => $assessment){
					if (is_array($assessment->panelists->others)){
						foreach ($assessment->panelists->others as $k => $user_id){
							$user_ids_hash[$user_id] = 1;
						}
					}
				}
*/
			}
		}
	}
	$output['acts'] = $output_acts;
	
	//echo 1;
	//print_json($user_ids_hash); exit();
	$user_ids = hash2numArr($user_ids_hash);
	
	//echo 2;
	/////////////////////////////////////////////////////////////////////
	// USER
	/////////////////////////////////////////////////////////////////////
	//print_json($user_ids);
	$output_users = [];	
	if ($user_ids != ""){
		foreach ($user_ids as $key => $user_id){
			$output_user = 0;
			if (gettype($user_id) && strpos($user_id, '@') == FALSE){
				$user_id = intval($user_id);
				// find the user from the database
				$criteria = ['user_id' => $user_id, 'confirmed_email' => 1];
				$options = [ 'projection' =>
					[
						'_id' => 0,
						'img_id' => 1,
						'username' => 1,
					]
				];
				$documents = databaseRead($database, 'users', $criteria, $options);
				if ($documents && sizeof($documents)){
					$user = $documents[0];
					$output_users[$user_id] = [
						'img_id' => $user->img_id,
						'username' => $user->username,
					];
				}
			}
			if ($output_user){
				//var_dump($output_user);
				// is this user already in the output array?
				// check duplicate http://stackoverflow.com/questions/6661530/php-multi-dimensional-array-search				
				$user_id = intval($output_user['user_id']);
				$key = array_search($user_id, array_column($output_users, 'user_id'));
				if ($key === FALSE){
					// no duplication
					array_push($output_users, $output_user);
				}
			}
		}
	}
	$output['users'] = $output_users;
}

/////////////////////////////////////////////////////////////////////////////////////

function deleteMessage(){
	//echo "deleteMessage";
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act, $col_usr;
	global $MSG_TYPE_USR, $MSG_TYPE_ACT;
	
	$msg_id = intval(getQs('msg_id'));
	$msg_type = intval(getQs('msg_type'));
	
	switch ($msg_type){
		
		case $MSG_TYPE_USR:
			$recipients = getQs('recipients');
			$recipient_id = intval($recipients[0]);
			// read the message from the sender
			$arr = [];
			$criteria = ['user_id' => $user_id];
			$conv_id = getConvID($MSG_TYPE_USR, $recipient_id);
			$options = [ 'projection' => ['_id' => 0, "messages.$conv_id" => 1] ];
			$documents = databaseRead($database, $col_usr, $criteria, $options);
			if ($documents && sizeof($documents) > 0){
				$obj = json_decode(json_encode($documents[0]), true);
				if (!isset($obj['messages'])){
					$obj['messages'] = [];
				}
				if (!isset($obj['messages'][$conv_id])){
					$obj['messages'][$conv_id] = [];
				}
				$arr = $obj['messages'][$conv_id];
				//print_json($arr);
				//unset($arr[$msg_id - 1]);
				//print_json($arr);
				array_splice($arr, $msg_id - 1, 1);
				$msg_id2 = 1;
				foreach ($arr as $index => $ele){
					$arr[$index]['msg_id'] = $msg_id2++;
				}
				$criteria = ['user_id' => $user_id];
				$update = [	'$set' => ["messages.$conv_id" => $arr]];				
				$result = databaseUpdate($database, $col_usr, $criteria, $update);
			}
			break;
			
		case $MSG_TYPE_ACT:
			$act_id = intval(getQs('act_id'));
			$criteria = ['act_id' => $act_id];
			$options = [ 'projection' => ['_id' => 0, "messages" => 1] ];
			$documents = databaseRead($database, $col_act, $criteria, $options);
			if ($documents && sizeof($documents) > 0){
				$obj = json_decode(json_encode($documents[0]), true);
				if (!isset($obj['messages'])){
					$obj['messages'] = [];
				}
				$arr = $obj['messages'];
				//unset($arr[$msg_id - 1]);
				array_splice($arr, $msg_id - 1, 1);
				//print_json($arr);
				$msg_id2 = 1;
				foreach ($arr as $index => $ele){
					$arr[$index]['msg_id'] = $msg_id2++;
				}
				//print_json($arr);
				$criteria = ['act_id' => $act_id];
				$update = [	'$set' => ["messages" => $arr]];
				$result = databaseUpdate($database, $col_act, $criteria, $update);
			}
			break;
	}
}

/////////////////////////////////////////////////////////////////////////////////////

function markReadMsg(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act, $col_usr;
	global $MSG_TYPE_USR, $MSG_TYPE_ACT;
	
	$msg_type = intval(getQs('msg_type'));
	$item_id = intval(getQs('item_id')); 
	$conv_id = getConvID($msg_type, $item_id);
	
	// make sure unread_msgs exist
	$criteria = ['user_id' => $user_id, "unread_msgs.$conv_id" => ['$exists' => true] ];
	$update = [	'$set' => ["unread_msgs.$conv_id.unread_msg" => 0]];
	$result = databaseUpdate($database, $col_usr, $criteria, $update);	
}

///////////////////////////////////////////////////////////////////////////////////////////////
	
function getConvID($msg_type, $item_id){
	global $MSG_TYPE_USR, $MSG_TYPE_ACT;
	return ($msg_type == $MSG_TYPE_USR ? 'u' : 'a') . $item_id;
}

/////////////////////////////////////////////////////////////////////////////////////

function incUnreadMsg_usr($item_id, $sender_id, $recipient_id, $time, $msg){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act, $col_usr;
	global $MSG_TYPE_USR, $MSG_TYPE_ACT;
		
	//echo "incUnreadMsg_usr: $item_id, $sender_id, $recipient_id<br/>";
	$item_id = intval($item_id);
	$recipient_id = intval($recipient_id);
	//$myself = $sender_id == $recipient_id;
	
	//////////////////////////////////
	// FOR RECIPIENT
	//////////////////////////////////
	$criteria = ['user_id' => $recipient_id];
	$options = [ 'projection' => ['_id' => 0, "unread_msgs" => 1] ];
	$documents = databaseRead($database, $col_usr, $criteria, $options);
	
	// FIND IF THERE IS UNREAD_MSGS
	$unread_msgs = 0;
	if ($documents && sizeof($documents) > 0){
		$user = json_decode(json_encode($documents[0]), true);
		if (isset($user['unread_msgs'])){
			$unread_msgs = $user['unread_msgs'];
		}
	}
	
	// IF NONE, CREATE ONE
	if (!$unread_msgs){
		$unread_msgs = [];
	}

	$conv_id = getConvID($MSG_TYPE_USR, $sender_id);
	$unread_msg = 1;
	if (isset($unread_msgs[$conv_id])){
		$unread_msg = $unread_msgs[$conv_id]['unread_msg'] + 1;
	}
	$unread_msgs[$conv_id] = [
			"msg_type" => $MSG_TYPE_USR,
			"item_id" => $sender_id,
			"datetime" => $time,
			"unread_msg" => $unread_msg,
			"last_msg" => $msg,		
	];
		
	//print_json($unread_msgs);
	$criteria = ['user_id' => $recipient_id];
	$update = [ '$set' => ["unread_msgs" => $unread_msgs]];
	$result = databaseUpdate($database, $col_usr, $criteria, $update);
	
	//////////////////////////////////
	// FOR SENDER
	//////////////////////////////////
	$criteria = ['user_id' => $sender_id];
	$options = [ 'projection' => ['_id' => 0, 'unread_msgs' => 1] ];
	$documents = databaseRead($database, $col_usr, $criteria, $options);
	
	// FIND IF THERE IS UNREAD_MSGS
	$unread_msgs = 0;
	if ($documents && sizeof($documents) > 0){
		$user = json_decode(json_encode($documents[0]), true);
		if (isset($user['unread_msgs'])){
			$unread_msgs = $user['unread_msgs'];
		}
	}
	
	// IF NONE, CREATE ONE
	if (!$unread_msgs){
		$unread_msgs = [];
	}

	$conv_id = getConvID($MSG_TYPE_USR, $recipient_id);
	$unread_msg = 0;
	if (isset($unread_msgs[$conv_id])){
		$unread_msg = $unread_msgs[$conv_id]['unread_msg'] + 1;
	} else {
		$unread_msg = 1;
	}
	$unread_msgs[$conv_id] = [
			"msg_type" => $MSG_TYPE_USR,
			"item_id" => $item_id,
			"datetime" => $time,
			"unread_msg" => 0,
			"last_msg" => $msg,		
	];

	//print_json($unread_msgs);
	//$criteria = ['user_id' => $sender_id];
	$update = [ '$set' => ["unread_msgs" => $unread_msgs]];
	$result = databaseUpdate($database, $col_usr, $criteria, $update);	
}

/////////////////////////////////////////////////////////////////////////////////////

function incUnreadMsg_act($item_id, $sender_id, $recipient_id, $time, $msg){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act, $col_usr;
	global $MSG_TYPE_USR, $MSG_TYPE_ACT;
	
	$sender_id = intval($sender_id);
	$recipient_id = intval($recipient_id);	
	$myself = $sender_id == $recipient_id;
		
	// FOR EACH RECIPIENT
	$criteria = ['user_id' => $recipient_id];
	$options = [ 'projection' => ['_id' => 0, "unread_msgs" => 1, "token_android" => 1, "token_ios" => 1] ];
	$documents = databaseRead($database, $col_usr, $criteria, $options);
	
	// FIND IF THERE IS UNREAD_MSGS
	$unread_msgs = 0;
	$user = 0;
	if ($documents && sizeof($documents) > 0){
		$user = json_decode(json_encode($documents[0]), true);
		if (isset($user['unread_msgs'])){
			$unread_msgs = $user['unread_msgs'];
		}
	}
	// IF NONE, CREATE ONE
	if (!$unread_msgs){
		$unread_msgs = [];
	}
	// FIND UNREAD_MSGS
	$conv_id = getConvID($MSG_TYPE_ACT, $item_id);
	if ($myself){
		$unread_msg = 0;
	} else if (isset($unread_msgs[$conv_id])){
		$unread_msg = intval($unread_msgs[$conv_id]['unread_msg']) + 1;
	} else {
		$unread_msg = 1;
	}
	$unread_msgs[$conv_id] = [
			"msg_type" => $MSG_TYPE_ACT,
			"item_id" => $item_id,
			"user_id" => $sender_id,
			"datetime" => $time,
			"unread_msg" => $unread_msg,
			"last_msg" => $msg,		
	];
	
	//print_json($unread_msgs);
	$criteria = ['user_id' => $recipient_id];
	$update = [ '$set' => ["unread_msgs" => $unread_msgs]];
	$result = databaseUpdate($database, $col_usr, $criteria, $update);
	
	return $user;
}

///////////////////////////////////////////////////////////////////////////////////////////////

function saveMessage(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act, $col_usr;
	global $MSG_TYPE_USR, $MSG_TYPE_ACT;
	
	//echo "haha"; exit();
	
	// add the message to the sender
	$msg = getQs('msg');
	$time = getDateTime();
	
	$msg_type = intval(getQs('msg_type'));
	$item_id = intval(getQs('item_id'));
	
	$sender_id = intval(getQs('sender_id'));
	$sender_name = getQs('sender_name');

	$time = getDateTime();
	$new_msg = [
		'msg_id' => 0,
		'user_id' => $sender_id,
		'body' => $msg,
		'time' => $time,
	];
	
	switch ($msg_type){
		
		case $MSG_TYPE_USR:
		
			//echo "msg_type=$msg_type item_id=$item_id send_id=$sender_id sender_name=$sender_name";	print_json($new_msg);
			
			$recipients = getQs('recipients');
			
			// for each recipient	
			foreach ($recipients as $recipient_id){

				$recipient_id = intval($recipient_id);
				
				//echo "recipient_id: $recipient_id<br/>";

				///////////////////////////////////////////////////////////////////////////////////////////
				// 1. add the message to the sender
				///////////////////////////////////////////////////////////////////////////////////////////
				
				// read the message from the sender
				$arr = [];
				$criteria = ['user_id' => $sender_id];
				$conv_id = getConvID($MSG_TYPE_USR, $recipient_id);
				$options = [ 'projection' => ['_id' => 0, "messages.$conv_id" => 1, "token_android" => 1, "token_ios" => 1] ];
				$documents = databaseRead($database, $col_usr, $criteria, $options);
				$user = 0;
				if ($documents && sizeof($documents) > 0){
					$user = json_decode(json_encode($documents[0]), true);
					if (isset($user['messages']) && isset($user['messages'][$conv_id])){
						$arr = $user['messages'][$conv_id];
					}
				}
				$msg_len = sizeof($arr);
				
				// write the message to the sender
				$new_msg['msg_id'] = $msg_len + 1;
				//$criteria = ['user_id' => $sender_id];
				$update = ['$push' => [	"messages.$conv_id" =>	$new_msg]];
				$result = databaseUpdate($database, $col_usr, $criteria, $update);

				// send notification(if not active? how to check?)
				//if ($user['token_android'] != '' || $user['token_ios'] != ''){
				//	sendNotify_messenger($msg_type, $recipient_id, $msg, $user['token_android'], $user['token_ios']);
				//}
				
				///////////////////////////////////////////////////////////////////////////////////////////
				// 2. add the message to the recipients
				///////////////////////////////////////////////////////////////////////////////////////////
				// read the message from the sender
				$arr = [];
				//$conv_id = getConvID($MSG_TYPE_USR, $item_id);
				$criteria = ['user_id' => $recipient_id];
				$conv_id = getConvID($MSG_TYPE_USR, $sender_id);
				$options = [ 'projection' => ['_id' => 0, "messages.$conv_id" => 1, "token_android" => 1, "token_ios" => 1] ];
				$documents = databaseRead($database, $col_usr, $criteria, $options);
				if ($documents && sizeof($documents) > 0){
					$user = json_decode(json_encode($documents[0]), true);
					if (isset($user['messages']) && isset($user['messages'][$conv_id])){
						$arr = $user['messages'][$conv_id];
					}
				}
				$msg_len = sizeof($arr);
				
				// write the message to the sender
				$new_msg['item_id'] = $sender_id;
				$new_msg['msg_id'] = $msg_len + 1;
				$criteria = ['user_id' => $recipient_id];
				$update = ['$push' => [	"messages.$conv_id" => $new_msg]];
				$result = databaseUpdate($database, $col_usr, $criteria, $update);
				
				// send notification(if not active? how to check?)
				$token_android = isset($user['token_android']) ? $user['token_android'] : '';
				$token_ios = isset($user['token_ios']) ? $user['token_ios'] : '';
				if ($token_android != '' || $token_ios != ''){
					$msg2 = $sender_name . ': ' . $msg;
					sendNotify_messenger($msg_type, $sender_id, $msg2, $token_android, $token_ios);
				}
				
				/////////////////////////////////////////////////////////////////////////
				// ADD ONE TO UNREAD
				/////////////////////////////////////////////////////////////////////////
				incUnreadMsg_usr($item_id, $sender_id, $recipient_id, $time, $msg);
			}
			break;
		
		case $MSG_TYPE_ACT:
			//$ct_id = intval(getQs('item_id'));
			$conv_id = getConvID($MSG_TYPE_ACT, $item_id);
			
			// read the message from the sender
			$arr = [];
			$criteria = ['act_id' => $item_id];
			$options = [ 'projection' => ['_id' => 0, 'coordinator_id' => 1, "impression" => 1, "assessment" => 1, "messages" => 1, "unread_msgs" => 1, "participants" => 1] ];
			$documents = databaseRead($database, $col_act, $criteria, $options);
			$act = 0;
			if ($documents && sizeof($documents) > 0){
				$act = json_decode(json_encode($documents[0]), true);
				if (isset($obj['messages'])){
					$arr = $obj['messages'];
				}				
			}
			if (!isset($act)){
				$error = "activity not found";
				return;
			}
			$msg_len = sizeof($arr);
			
			// write the message to the sender
			$new_msg['msg_id'] = $msg_len + 1;
			//$criteria = ['act_id' => $item_id];
			$update = ['$push' => [	"messages" =>	$new_msg]];
			$result = databaseUpdate($database, $col_act, $criteria, $update);
			
			/////////////////////////////////////////////////////////////////////////
			// ADD ONE TO UNREAD
			/////////////////////////////////////////////////////////////////////////
			$msg2 = $sender_name . ': ' . $msg;
			
			// FIND ALL USERS
			$users = [];
			if ($act){
				$users = getAllUsers($act);
			}
			//print_json($users);
			// UPDATE THEM
			foreach ($users as $i => $recipient_id){
				//echo "$recipient_id<br>";
				$user = incUnreadMsg_act($item_id, $sender_id, $recipient_id, $time, $msg);
				// send notification(if not active? how to check?)
				$token_android = isset($user['token_android']) ? $user['token_android'] : '';
				$token_ios = isset($user['token_ios']) ? $user['token_ios'] : '';
				if ($recipient_id != $sender_id && $user && ($token_android || $token_ios)){
					sendNotify_messenger($msg_type, $item_id, $msg2, $token_android, $token_ios);
				}
			}
			break;
	}
	$output['new_msg'] = $new_msg;
}

?>
