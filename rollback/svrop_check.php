<?php

// https://github.com/mongodb/mongo-php-driver

/////////////////////////////////////////////////////////
// svrop.php
// type:
//	- image (dataurl)
//	- whb: for multiple bigboard
//	- timeline: for recording and playback
/////////////////////////////////////////////////////////

$sPresent = "Present";
$col_usr = 'users';
$col_act = 'activities';

// common
include "common.php";
include "database.php";
/*
// 1. check impression & assessments in activities
$documents = databaseRead('yolofolio', 'users', [], [ 'projection' => ['_id' => 0, 'user_id' => 1, 'profile.activity' => 1 ]]);
for ($i = 0; $i < sizeof($documents); $i++){
	$user = $documents[$i];
	echo "user_id: $user->user_id<br/>";
	
	//print_json($user->profile->activity);
	$acts = $user->profile->activity;
	for ($j = 0; $j < sizeof($acts); $j++){
		$act = $acts[$j];
		if (isset($act->impression->enabled)){
			echo "user_id: $user->user_id ... act_id: $act->act_id ... wrong impression->enabled<br/>";
		}
		if (isset($act->assessment->enabled)){
			echo "user_id: $user->user_id ... act_id: $act->act_id ... wrong assessment->enabled<br/>";
		}
		if (!isset($act->assessments)){
			echo "user_id: $user->user_id ... act_id: $act->act_id ... assessments not exist<br/>";
		} else if (!is_array($act->assessments)){
			echo "user_id: $user->user_id ... act_id: $act->act_id ... assessments not an array <br/>";
		}
	}
}
*/
/*
// 2. 
// - create empty friends array (if none)
// - create networks array by activity
// 
include "svrop_whatsup.php";

$documents = databaseRead('yolofolio', 'users', [],
	[ 'projection' =>
		['_id' => 0,
			'user_id' => 1,
			'confirmed_email' => 1,
			'friends' => 1,
			'networks' => 1
		]
	]
);

for ($i = 0; $i < sizeof($documents); $i++){
	$user = $documents[$i];
	$user_id = $user->user_id;
	if ($user->confirmed_email == 1){
		echo "user_id: $user->user_id<br/>";
			
		$friends = isset($user->friends) ? $user->friends : [];
		$networks = getActUsers($user_id);
		
		print_json($friends);
		print_json($networks);
		
		$filters = ['user_id' => $user_id];
		$sets = ['friends' => $friends, 'networks' => $networks];
		databaseUpdate($database, 'users', $filters, ['$set' => $sets]);
	}
}
*/
/*
// 3. create activity peers
// - so be able to find common activities when browing peers

include "svrop_whatsup.php";

$documents = databaseRead('yolofolio', 'activities', [],
	[ 'projection' =>
		[
			'_id' => 0,
			'act_id' => 1,
		]
	]
);
for ($i = 0; $i < sizeof($documents); $i++){
	$act = $documents[$i];
	$act_id = intval($act->act_id);
	echo "act_id=$act_id<br/>";
	//print_json($act);
	
	// 1. find activity peers from the activity
	$act_peers_hash = [];
	getUserIdsFromAct($act_id, $act_peers_hash, 0);
	$act_peers = hash2numArr($act_peers_hash);
	//print_json($act_peers);
	
	// 2. write to activity
	$filters = ['act_id' => $act_id];
	$sets = ['act_peers' => $act_peers];
	//databaseUpdate($database, 'activities', $filters, ['$unset' => ['activity_peers' => 1]]);	
	databaseUpdate($database, 'activities', $filters, ['$set' => $sets]);	
}
*/

/*
// 4.  set whatsup_ids for each user
// 			- get whatsup_id and user_id (sender) from whatsup
//			- find networks from this user_id
//			- add whatsup_id to each user in networks
$criteria = [];
$options = [
 'projection' => [
		'_id' => 0,
		'whatsup_id' => 1,
		'user_id' => 1,
	]
];
// get whatsup_id and user_id (sender) from whatsup
$documents = databaseRead('yolofolio', 'whatsup', $criteria, $options);
for ($i = 0; $i < sizeof($documents); $i++){
	$whatsup = $documents[$i];
	//print_json($whatsup);
	$whatsup_id = $whatsup->whatsup_id;
	$user_id = $whatsup->user_id;
	echo "whatsup_id=$whatsup_id user_id=$user_id<br/>";
	
	// find networks from this user_id
	$criteria = ['user_id' => $user_id];
	$options = [
	 'projection' => [
			'_id' => 0,
			'networks' => 1,
		]
	];
	$documents2 = databaseRead('yolofolio', 'users', $criteria, $options);
	for ($j = 0; $j < sizeof($documents2); $j++){
		$user = $documents2[$j];
		$networks = $user->networks;
		
		// add whatsup_id to each user in networks
		for ($k = 0; $k < sizeof($networks); $k++){
			$user_id2 = $networks[$k];
			// check if whatsup_id is in the array of whatsup_ids already
			$filters = ['user_id' => $user_id2, 'whatsup_ids' => ['$nin' => [$whatsup_id] ]];
			// add to the array
			$update = ['$push' => [
				'whatsup_ids' => [
					'$each' => [$whatsup_id],
					'$sort' => 1,
				]
			]];
			$result = databaseUpdate($database, 'users', $filters, $update);
			//echo "<br/>";	
		}
	}
}
*/

/*
// 5. reverse-find activity participants in users
function checkActParticipants($act_id){
	// read activity
	$criteria = ['act_id' => $act_id];
	$options = [
	 'projection' => [
			'_id' => 0,
			'act_id' => 1,
			'title' => 1,
			'participants' => 1,
		]
	];
	// get whatsup_id and user_id (sender) from whatsup
	$documents = databaseRead('yolofolio', 'activities', $criteria, $options);
	$act0 = $documents[0];
	$act_title = $act0->title;
	$arr0 = $act0->participants;
	$arr1 = [];

	// read user
	$criteria = [];
	$options = [
	 'projection' => [
			'_id' => 0,
			'user_id' => 1,
			'profile.activity' => 1,
		]
	];
	// get whatsup_id and user_id (sender) from whatsup
	$documents = databaseRead('yolofolio', 'users', $criteria, $options);
	for ($i = 0; $i < sizeof($documents); $i++){
		$user = $documents[$i];
		$user_id = $user->user_id;
		//print_json($user);
		$acts = $user->profile->activity;
		for ($j = 0; $j < sizeof($acts); $j++){
			$act = $acts[$j];
			//print_json($act->uact_participant);
			if (!isset($act->uact_participant)){
				echo "user $user_id missing act $act->act_id uact_participant<br/>";
				print_json($act);
				$act->uact_participant = 0;
			}
			if ($act->uact_participant == 1 && $act->act_id == $act_id){
				array_push($arr1, $user_id);
			}
		}
	}
	// display results
	sort($arr0);
	sort($arr1);
	echo "act: $act_id $act_title<br/>";
	echo "old: [" . join(', ', $arr0) . "]<br/>(total: " . sizeof($arr0) . ')<br/><br/>';
	echo "new: [" . join(', ', $arr1) . "]<br/>(total: " . sizeof($arr1) . ')<br/><br/>';

	echo "The two arrays are : " . ($arr0 == $arr1 ? 'identical' : 'different') . "<br/><hr>";
}

checkActParticipants(118);
checkActParticipants(119);
*/

/*
// 6. check duplicate user with the same email address
// read user
$criteria = [];
$options = [
 'projection' => [
		'_id' => 0,
		'user_id' => 1,
		'username' => 1,
		'email' => 1,
	]
];
// get whatsup_id and user_id (sender) from whatsup
$documents = databaseRead('yolofolio', 'users', $criteria, $options);
for ($i = 0; $i < sizeof($documents); $i++){
	$user1 = $documents[$i];
	//$user_id1 = $user1->user_id;
	//$username1 = $user1->username;
	//$email = $user1->email;

	// check for this email
	$criteria = ['email' => $user1->email, 'user_id' => ['$ne' => $user1->user_id] ];
	$options = [
	 'projection' => [
			'_id' => 0,
			'user_id' => 1,
			'username' => 1,
			'email' => 1,
		]
	];
	$documents2 = databaseRead('yolofolio', 'users', $criteria, $options);
	for ($j = 0; $j < sizeof($documents2); $j++){
		$user2 = $documents2[$j];
		if ($user1->user_id < $user2->user_id){
			echo "clashed email: $user1->user_id $user2->user_id $user1->email $user1->username";
			if ($user1->email != $user2->email){
				echo " $user2->email";
			}
			if ($user2->username != $user2->username){
				echo " $user2->username";
			}
			echo "<br/>";
		}
	}
}
*/

// 7. set notified_invitation=1
// read user
$criteria = [];
$options = [
 'projection' => [
		'_id' => 0,
		'user_id' => 1,
		'profile.activity' => 1,
	]
];
// get whatsup_id and user_id (sender) from whatsup
$documents = databaseRead('yolofolio', 'users', $criteria, $options);
//for ($i = 0; $i < sizeof($documents); $i++){
forEach ($documents as $doc){
	// for each user
	$user = json_decode(json_encode($doc), false);
	echo "user #$user->user_id<br/>";
	forEach ($user->profile->activity as $act){
		// for each act
		echo " &nbsp; act #$act->act_id<br/>";
		$filters = ['user_id' => $user->user_id, 'profile.activity.act_id' => $act->act_id];
		$sets = ['profile.activity.$.notified_invitation' => 1];
		databaseUpdate($database, 'users', $filters, ['$set' => $sets]);
	}
	echo "<br/>";
}

?>
