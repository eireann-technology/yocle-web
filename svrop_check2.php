<?php

// https://github.com/mongodb/mongo-php-driver

/////////////////////////////////////////////////////////
// svrop.php
// type:
//	- image (dataurl)
//	- whb: for multiple bigboard
//	- timeline: for recording and playback
/////////////////////////////////////////////////////////
exit();

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
	$act_peers = hash2numArr_key($act_peers_hash);
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
/*
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
$documents = databaseRead('yolofolio', 'users', $criteria, $options);
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
*/

/*
// 8. generate assessors and allusers
include "svrop_activity.php";

$criteria = [];

$options = [
 'projection' => [
		'_id' => 0,
		'act_id' => 1,
		'title' => 1,
		'coordinator_id' => 1,
		'participants' => 1,
		'impression' => 1,
		'assessment' => 1,
	]
];
$acts = databaseRead('yolofolio', 'activities', $criteria, $options);
foreach ($acts as $act){
	echo "act# $act->act_id $act->title<br/>";
	$assessors = getActAssessors($act);
	$allusers = getAllUsers2($act);
	//print_json($assessors);
	//print_json($allusers);

	// 2. write to activity
	$filters = ['act_id' => $act->act_id];
	$sets = ['assessors' => $assessors, 'allusers' => $allusers];
	databaseUpdate($database, 'activities', $filters, ['$set' => $sets]);
}
*/

// 9. remove unused marks from users
/*
	"assr_asst_completed" : {},
	"part_asst_marks" : {},
	"assr_asst_marks" : {},
*/

/*
// read user
$criteria = [];
$options = [
 'projection' => [
		'_id' => 0,
		'user_id' => 1,
		'profile.activity' => 1,
	]
];
$documents = databaseRead('yolofolio', 'users', $criteria, $options);
forEach ($documents as $doc){

	// for each user
	$user = json_decode(json_encode($doc), false);
	echo "user #$user->user_id<br/>";
	forEach ($user->profile->activity as $uact){

    // for each act
    $act_id = $uact->act_id;
		echo " &nbsp; act #$act_id<br/>";

    // read activity
    $criteria = [
      'act_id' => $act_id,
    ];
    $options = [
     'projection' => [
    		'_id' => 0,
    		'act_id' => 1,
        'title' => 1,
        'img_id' => 1,
    	]
    ];
    $acts = databaseRead('yolofolio', 'activities', $criteria, $options);
    if (sizeof($acts) > 0){
      $act = $acts[0];
      // resume img_id
      $uact->img_id = $act->img_id;
    }
    // remove unused objects
		forEach ($uact->assessments as $asst){
			if (isset($asst->assr_asst_completed)){
				echo "removed assr_asst_completed<br/>";
				unset($asst->assr_asst_completed);
			}
			if (isset($asst->part_asst_marks)){
				echo "removed part_asst_marks<br/>";
				unset($asst->part_asst_marks);
			}
			if (isset($asst->assr_asst_marks)){
				echo "removed assr_asst_marks<br/>";
				unset($asst->assr_asst_marks);
			}
		}
	}
	$filters = ['user_id' => $user->user_id];
	$sets = ['profile.activity' => $user->profile->activity];
	databaseUpdate($database, 'users', $filters, ['$set' => $sets]);
	echo "<br/>";
	//break;
}
*/
//include 'svrop_calcgs.php';
//calcgs_test();

// * find out all the answered items from users->acts->assts for the dummy

////////////////////////////////////////////////////////////
//print_json($uact_new->act_id);
//echo "***************<br/>";
//print_json($uact_new->act_id);

//$uact_new = $uact;

//if ($dummy){
	//$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	//$sets = ['profile.activity.$.dummy' => $dummy];
	//databaseUpdate($database, 'users', $filters, ['$set' => $sets]);

	//$filters = ['act_id' => $act_id];
	//$sets = ['dummy' => $dummy];
	//databaseUpdate($database, 'activities', $filters, ['$set' => $sets]);
//}

//echo " &nbsp; user#$user_id act#$act_id<br/>";
/*
// check hasmedia
forEach ($uact_new->assessments as $asst){
	$ass_id = $asst->ass_id;

	//echo "&nbsp; &nbsp; $user_id $act_id $ass_id <b>asst #$ass_id</b><br/>";
	forEach ($asst->items as $item){
		//echo " &nbsp; &nbsp; asst #$asst->ass_id<br/>";
		//print_json($item);
		$media_id = isset($item->media_id) ? $item->media_id : 0;
		if (!$media_id) continue;
		//echo "#$i. act#$act_id ass#$ass_id user#$user_id media_id=$media_id<br/>";
		$i++;
		$hasmedia = 1;
	}
}
*/
//}

// special
//	if ($uact_new)
//{

//if ($hasmedia){
//  array_push($parts, $user_id);
//}

// echo "user#$user_id copied act#$uact_old->act_id to act#$uact_new->act_id<br/>";
// copy assessments
/*
if ($uact_old){
	forEach ($uact_new->assessments as $asst_index => $asst_new){
		if (isset($uact_old->assessments[$asst_index])){
			$asst_old = $uact_old->assessments[$asst_index];
			$asst_new2 = jsonclone($asst_old);
			$asst_new2->performed =
			$asst_new2->marked = $datetime_now;
			$uact_new->assessments[$asst_index] = $asst_new2;
		}
	}
	// copy impression
	$uact_new->impression = jsonclone($uact_old->impression);
} else
*/

/////////////////////////////////////////////////////
// checkpoint: 20170910
// random generator for marks
/////////////////////////////////////////////////////
/*
define('DUMMY_ACT_ID', 131);

function isDummyAct($act_id){
	return $act_id < 118 || $act_id == DUMMY_ACT_ID ? 1 : 0;
}

function getRandomMarks(){
  return rand(70, 100);
}

function getRandomStars(){
  return rand(6, 10)/2;
}

//////////////////////////////////////////////////

function generateRandomScores($act_id){
	global $database;
	$act_id = intval($act_id);

	// read dummy act
	if (!$act_id){
		$criteria = [];
	} else {
		$criteria = ['act_id' => $act_id];
	}
	$options = [
	 'projection' => [
			'_id' => 0,
		]
	];
	$acts = databaseRead($database, 'activities', $criteria, $options);
	forEach ($acts as $act){
		generateRandomScores2($act);
	}
}

//////////////////////////////////////////////////////////////

function generateRandomScores2($dummy_act){
	global $database;
	$this_act_id = $dummy_act->act_id;
	// clear assessments
	//print_json($dummy_act);
	$assr_id = 2;
	$datetime_now = getDateTime();

	$dummy_assts = $dummy_act->assessment->assessments;
	forEach ($dummy_assts as $asst){
	  $asst->assr_asst_completed = new stdClass();  // for objects
	  $asst->part_asst_marks = new stdClass();
	  $asst->assr_asst_marks = new stdClass();
		if (!isset($asst->skills) || is_array($asst->skills)){
			$asst->skills = new stdClass();
		}
	  forEach ($asst->skills as $skill2){

	  }
	}

	// clear skills
	if (!isset($dummy_act->impression->skills) || is_array($dummy_act->impression->skills)){
		$dummy_act->impression->skills = new stdClass();
	}
	$dummy_skills = $dummy_act->impression->skills;
	forEach ($dummy_skills as $skill){
	  $skill->act_part_scores = new stdClass();
	  $skill->act_assr_scores = new stdClass();
	  $skill->act_assr_completeds = new stdClass();
	  unset($skill->act_assr_score);
	  //print_json($skill);
	}
	//print_json($dummy_skills);
	//exit();

	// read user
	$criteria = [];
	$options = [
	 'projection' => [
			'_id' => 0,
			'user_id' => 1,
			'profile.activity' => 1,
		]
	];
	$parts = [];
	$i = 1;
	$users = databaseRead('yolofolio', 'users', $criteria, $options);
	forEach ($users as $user1){

		// for each user
		$user = json_decode(json_encode($user1), false);

		//echo "user #$user->user_id<br/>";
	  $user_id = intval($user->user_id);
		if ($user_id != 640){
		//	continue;
		}
	  if (!in_array($user_id, $dummy_act->participants)){
	    //echo "skip $user_id<br/>";
	    continue;
	  }
	  echo "user# $user_id<br/>";

	  $hasspecial = 0;
	  $uact_old = 0;
	  $uact_new = 0;

	  $hasmedia = 0;

		// test
		//forEach ($user->profile->activity as $uact){
	  // $act_id = $uact->act_id;
		//	echo "check uact#$act_id<br/>";
		//}
		//return;

		forEach ($user->profile->activity as $uact_new){

	    // for each act
	    $act_id = $uact_new->act_id;

	    //if ($user_id == 204){
	      //echo "user#$user_id act#$act_id<br/>";
	    //}

	    // dummy rule
	    //$dummy = isDummyAct($act_id);

	    // special rule
	    //if (!$dummy && $act_id != $this_act_id) $uact_old = $uact;
	    //if ($act_id == $this_act_id) $uact_new = $uact;

			if ($act_id != $this_act_id) continue;	// not this activity

			echo "work on uact#$act_id<br/>";

			//print_json($uact_new->act_id);
			{
				// update the status and time
				forEach ($uact_new->assessments as $asst_index => $asst_new){
	        $uact_new->assessments[$asst_index]->performed =
					$uact_new->assessments[$asst_index]->marked = $datetime_now;
		    }
			}
			//print_json($uact_new->act_id);

	    // for each asst
	    forEach ($uact_new->assessments as $asst_index => $asst_new){

	      //$dummy_act->assessment->assessments[$asst_index]->part_asst_marks = new stdClass();
	      //$dummy_act->assessment->assessments[$asst_index]->assr_asst_marks = new stdClass();

	      // give part_item_marks
	      $part_asst_marks = 0;
	      $act_asst = $dummy_act->assessment->assessments[$asst_index];
	      //print_json($act_asst); exit();

	      // for each item
	      //echo "user#$user_id #ass$asst_index " . sizeof($asst_new->items) . "<br/>";
	      $nitem = sizeof($asst_new->items);
				if (!$nitem){
					$part_asst_marks = getRandomMarks();
				} else {
		      $item_weight = $nitem ? 100 / $nitem : 0; // weight for poster(pst) as item will be added only after user input
		      forEach ($asst_new->items as $item_index => $item){

		        $marks = getRandomMarks();
		        $item->part_item_marks = $marks;
		        if (!isset($item->assessors) || is_array($item->assessors)){
		          $item->assessors = new stdClass();
		        }
		        $item->assessors->$assr_id = [
		          'assr_item_marks' => $marks,
		          'comments' => 'Good job!',
		          'date' => $datetime_now,
		        ];
		        //print_json($item); exit();

		        if (isset($act_asst->items[$item_index]->weight)){
		          $item_weight = $act_asst->items[$item_index]->weight;
		        }
		        // if ($nitem == 1)
		         //echo "item#$item_index part_item_marks: $item->part_item_marks ($item_weight%)<br/>";
		        $part_asst_marks += ($marks * $item_weight / 100);
		      }
				}
	      $part_asst_marks = intval($part_asst_marks);

	       //if ($user_id == 204){
	        //echo " ass#$asst_index nitem=" . $nitem . " -> part_asst_marks: $part_asst_marks<br/><br/>";
	      //}
	      $dummy_act->assessment->assessments[$asst_index]->assr_asst_completed = [$assr_id => $nitem];
	      $dummy_act->assessment->assessments[$asst_index]->part_asst_marks->$user_id = $part_asst_marks;
	      $pair = "$assr_id,$user_id";
	      $dummy_act->assessment->assessments[$asst_index]->assr_asst_marks->$pair = $part_asst_marks;
	    }
			//print_json($uact_new->act_id);

	    // give skill stars
	    forEach ($uact_new->impression->skills as $skill_name => $skill){

	      //echo "$skill_name<br/>";
	      $usr_part_score = getRandomStars();

	      $uact_new->impression->skills->$skill_name =
	      [
	        'usr_part_score' => $usr_part_score,
	        'assessors' => [
	          $assr_id  => [
	            'usr_assr_score' => $usr_part_score,
	            'comments' => 'Well done!',
	            'date' => $datetime_now,
	          ],
	        ],
	      ];

				// create for empty
				if (!isset($dummy_act->impression)){
					$dummy_act->impression = new stdClass();
				}
				if (!isset($dummy_act->impression->skills)){
					$dummy_act->impression->skills = new stdClass();
				}
				if (!isset($dummy_act->impression->skills->$skill_name)){
					$dummy_act->impression->skills->$skill_name = new stdClass();
				}
	      $dummy_skill = $dummy_act->impression->skills->$skill_name;

	      // act_part_scores
				if (!isset($dummy_skill->act_part_scores)){
					$dummy_skill->act_part_scores = new stdClass();
				}
	      $dummy_skill->act_part_scores->$user_id = $usr_part_score;

	      // act_assr_score
	      $pair = "$assr_id,$user_id";
				if (!isset($dummy_skill->act_assr_scores)){
					$dummy_skill->act_assr_scores = new stdClass();
				}
	      $dummy_skill->act_assr_scores->$pair = [
	        'act_assr_score' => $usr_part_score,
	        'comments' => 'Well done!',
	        'date' => $datetime_now,
	      ];

	      // act_assr_completeds
	      $dummy_skill->act_assr_completeds = [
	        $assr_id => sizeof($dummy_act->participants),
	      ];
	    }
			//print_json($uact_new->act_id);

	    //print_json($uact_new);
	    //print_json($dummy_skill);
	    //exit();

	    // update to database
	    $filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	  	$sets = ['profile.activity.$' => $uact_new];
	    databaseUpdate($database, 'users', $filters, ['$set' => $sets]);

	  }
	}
	// update activity
	//print_json($dummy_act);
	//print_json($dummy_act->assessment);
	//print_json($dummy_act->impression);

	// update to database
	$filters = ['act_id' => $this_act_id];
	$sets = [
	  'assessment' => $dummy_act->assessment,
	  'impression' => $dummy_act->impression,
	];
	databaseUpdate($database, 'activities', $filters, ['$set' => $sets]);

	// perfromt calcgs
	//include "svrop_calcgs.php";
	echo "generateRandomScores: $this_act_id...done<br/>";
}


//generateRandomScores(118);
//generateRandomScores(119);
//generateRandomScores(120);
//generateRandomScores(121);
//generateRandomScores(130);
//generateRandomScores(131);

generateRandomScores(0);
//generateRandomScores(118);

include "svrop_calcgs.php";
calcgs_test();
//calcgs_peruser(2, 1);
//calcgs_peruser(640, 1);
*/

?>
