<?php
// USER GROUPS
define('USRGRP_PUBLIC', 					1);
define('USRGRP_MYSELF', 					2);
define('USRGRP_ACTPEERS_MYSELF', 	3);
define('USRGRP_MYPEERS_MYSELF',		4);

define('USRGRP_ACTPEERS_SPECIFIC', 100);

define('USRGRP_ACTPEERS', 				5);	// without myself
define('USRGRP_MYPEERS', 					6);	// without myself

///////////////////////////////////////////////////////////

// call from query string
function showUserGroup(){
	$user_id = intval(getQs('user_id'));
	$group = intval(getQs('group'));
	$user_ids = getUserGroup($user_id, $group);
	print_json($user_ids);
}

/////////////////////////////////////////////////////////////////////////////////////////

function getUserGroup($user_id, $group){
	global $database, $error, $type, $email, $pwd, $error, $output, $reset_pwd;

	//echo $group;

	$user_ids = [];

	switch ($group){

		case USRGRP_PUBLIC:	// 1
			$filters = [];
			$options = ['projection' => ['_id' => 0, "user_id" => 1]];
			$documents = databaseRead('yolofolio', 'users', $filters, $options);
			forEach ($documents as $index => $user){
				$user_id = $user->user_id;
				array_push($user_ids, $user_id);
			}
			break;

		case USRGRP_MYSELF:	// 2
			$user_ids = [$user_id];
			break;

		case USRGRP_ACTPEERS:	// 3
		case USRGRP_ACTPEERS_MYSELF:	// 5
			$filters = ['user_id' => $user_id];
			$options = ['projection' => ['_id' => 0, "networks" => 1]];
			//print_json($filters);	print_json($options);
			$documents = databaseRead('yolofolio', 'users', $filters, $options);
			if ($documents && sizeof($documents)){
				$user = $documents[0];
				$user_ids = $user->networks;
			}
			break;

		case USRGRP_MYPEERS:	// 4
		case USRGRP_MYPEERS_MYSELF:	// 6
			$filters = ['user_id' => $user_id];
			$options = ['projection' => ['_id' => 0, "friends" => 1] ];
			$documents = databaseRead('yolofolio', 'users', $filters, $options);
			if ($documents && sizeof($documents)){
				$user = $documents[0];
				$user_ids = $user->friends;
			}
			break;

		default:
			if ($group > USRGRP_ACTPEERS_SPECIFIC){
				$act_id = $group - USRGRP_ACTPEERS_SPECIFIC;
				//echo $act_id;
				$act_peers_hash = [];
				getUserIdsFromAct($act_id, $act_peers_hash, 0);
				$user_ids = hash2numArr_key($act_peers_hash);
			} else {
				$error = 'user group type is missed';
			}
			break;
	}

	// add myself?
	switch ($group){
		case USRGRP_ACTPEERS_MYSELF:
		case USRGRP_MYPEERS_MYSELF:
			if (!in_array($user_id, $user_ids)){
				array_push($user_ids, $user_id);
			}
			break;
	}

	// SORTING
	sort($user_ids);

	//print_json($user_ids); // debug

	return $user_ids;
}

///////////////////////////////////////////////////////////////////////////////////////

function getReceivers($user_id, $receivers){
	global $database, $error, $type, $email, $pwd, $error, $output, $reset_pwd;
	$user_hash = [$user_id => 1];	// must include myself
	//print_json($receivers); exit();
	if (is_array($receivers) && sizeof($receivers) > 0){
		forEach ($receivers as $receiver){
			if ($receiver == 'public'){

				// find all the users from the system
				//echo 'public<br/>';
				$filters = ['confirmed_email' => 1];
				$options = [ 'projection' => ['_id' => 0, 'user_id' => 1]];
				$documents = databaseRead($database, 'users', $filters, $options);
				for ($i = 0; $i < sizeof($documents); $i++){
					$user = $documents[$i];
					$user_hash[$user->user_id] = 1;
				}
				break;	// no need to go on

			} else if ($receiver == 'mypeers'){

				// find all peers for the user
				//echo 'mypeers<br/>';
				$filters = ['user_id' => $user_id];
				$options = [ 'projection' => ['_id' => 0, 'friends' => 1]];
				$documents = databaseRead($database, 'users', $filters, $options);
				if (sizeof($documents)){
					$user = $documents[0];
					forEach ($user->friends as $friend_id){
						$user_hash[$friend_id] = 1;
					}
				}

			} else {

				$index = strpos($receiver, 'a_');
				if ($index == 0){
					$act_id = substr($receiver, 2);
					//echo "act_id=$act_id<br/>";
					getUserIdsFromAct($act_id, $user_hash, 0);	// 0=my_user_id
				}
			}
		}
	}
	$user_ids = hash2numArr_key($user_hash);

	// SORTING
	sort($user_ids);

	$output['size'] = sizeof($user_ids);

	// OUTPUT
	return $user_ids;
}


?>
