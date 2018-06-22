	<?php

include "svrop_activity2.php";	// 20170718
include "svrop_activity_duplicate.php";	// 20170912

//////////////////////////////////////////////////////////////

function saveActivity(){

	// revised version?
	if (function_exists('saveActivity2')){
		saveActivity2();
		return;
	}
	global $database, $error, $type, $email, $pwd, $error, $output, $user_id, $act_id, $test_qs;

	$debug_save = isset($test_qs);
	$debug_save = 0; // testing

	$new_activity = getQS('activity');
	$publish = getQS('publish') == 1;
	if (!$new_activity){

		$error = 'no activity';

	} else {

		$new_activity = json_decode(getQS('activity'), false);	// true will convert assoc array into number array (true use obj[name], false use obj->name)

		if ($debug_save){
			echo "<b>save activity</b>"; print_json($new_activity);
		}
		$act_id = intval($new_activity->act_id);
		if ($act_id){
			$documents = databaseRead($database, 'activities', ['act_id' => $act_id]);
			if (!$documents || !sizeof($documents)){
				$error = 'activity not found';
			} else {

				// COPY MARKS FROM OLD TO NEW ACTIVITY
				$new_assts = $new_activity->assessment->assessments;

				// OLD ONES
				$old_activity = json_decode(json_encode($documents[0]), false);

				$old_assts = $old_activity->assessment->assessments;

				foreach ($old_assts as $index => $old_asst){

					if (isset($new_assts[$index])){
						$new_asst = $new_assts[$index];
						if (isset($old_asst->assr_asst_completed)){
							$new_asst->assr_asst_completed 	= $old_asst->assr_asst_completed;
						}
						if (isset($old_asst->part_asst_marks)){
							$new_asst->part_asst_marks 			= $old_asst->part_asst_marks;
						}
						if (isset($old_asst->assr_asst_marks)){
							$new_asst->assr_asst_marks			= $old_asst->assr_asst_marks;
						}
						// for participation
						if (isset($old_asst->selecteds)){
							$new_asst->selecteds						= $old_asst->selecteds;
						}
						// for saved, performed or marked
						if (isset($old_asst->saved)){
							$new_asst->saved						= $old_asst->saved;
						}
						if (isset($old_asst->performed)){
							$new_asst->performed				= $old_asst->performed;
						}
						if (isset($old_asst->marked)){
							$new_asst->marked						= $old_asst->marked;
						}
						// for blg and bl2 (or others)
						if (isset($old_asst->items)){
							foreach ($old_asst->items as $index2 => $item){
								if (isset($new_asst->items[$index2])){
									$new_asst->items[$index2] = jsonclone($item);
								}
							}
						}
					}
				}
				// remove the activity
				$result = databaseDelete($database, 'activities', ['act_id' => $act_id]);

				// reinsert the activity
				$new_activity->act_id = $act_id;
				$result = databaseInsert($database, 'activities', $new_activity);
			}
		} else if (!$act_id){
			// get the new act_id
			$act_id = getNewSequenceID('act_id', 'activities');
			// create the activity
			$new_activity->act_id = $act_id;
			$result = databaseInsert($database, 'activities', $new_activity);
		}
		if (!$error){
			// coordinator
			$user_id = intval($new_activity->coordinator_id);
			updateActivityToUser($user_id, $new_activity, 'coordinator');//, 1, 0, 0);
			$output['user_id'] = $user_id;
		}
		if ($publish){
			publishActivity($act_id);
		}
		$output['act_id'] = $act_id;

		// desc
		$media_desc_hash = getQs('media_desc_hash');
		if ($media_desc_hash != ''){
			saveMediaDesc($media_desc_hash);
		}
	}
}


////////////////////////////////////////////////////////////////////////////

function getActivity(){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_usr, $col_act;
	$act_id = getQS('act_id');
	if (!$act_id){
		$error = "no act_id";
	} else {
		$act_id = intval($act_id);
		$filters = ['act_id' => intval($act_id)];
		$options = ['projection' => ['_id' => 0]];
		$documents = databaseRead($database, $col_act, $filters, $options);
		if ($documents && sizeof($documents) > 0){
			$act_doc = $documents[0];

			// add coordinator's username
			$user_id = $act_doc->coordinator_id;
			$filters = ['user_id' => intval($user_id)];
			$options = ['projection' => ['_id' => 0, 'username' => 1]];
			$documents = databaseRead($database, $col_usr, $filters, $options);
			if ($documents && sizeof($documents) > 0){
				$usr_doc = $documents[0];
				$act_doc->coordinator_username = $usr_doc->username;
			}

			// output by json
			$output['activity'] = $act_doc;

		} else {
			$error = "no such an activity $act_id";
		}
	}
}

/////////////////////////////////////////////////////

function deleteActivity(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$act_id = getQS('act_id');
	if (!$act_id){
		$error = "no act_id";
	} else {
		$act_id = intval($act_id);
		$output['act_id'] = $act_id;
		$documents = databaseRead($database, 'activities', ['act_id' => $act_id]);
		if ($documents && sizeof($documents) > 0){
			// remove from users
			removeActivityFromUser($act_id);
			// remove from activities
			databaseDelete($database, 'activities', ['act_id' => $act_id]);

		} else {
			$error = "no such an activity";
		}
	}
}

///////////////////////////////////////////////////////////////

function removeActivityFromUser($act_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $template_user_activity;
	$act_id = intval($act_id);

	// METHOD 1: READ ALL THE USERS
	$documents = databaseRead($database, 'users', []);
	$users = [];
	for ($i = 0; $i < sizeof($documents); $i++){
		$user = json_decode(json_encode($documents[$i]), true);
		$activities = $user['profile']['activity'];

		// LOOP THRU ALL THE ACTIVITIES
		foreach ($activities as $index => $activity){
			$act_id2 = intval($activity['act_id']);
			if ($act_id2 == $act_id){
				$user_id = intval($user['user_id']);

				// FOR LOGGING PURPOSE
				array_push($users, $user_id);

				// REMOVE DOCUMENT FROM THE ARRAY WORK
				$criteria = ['user_id' => $user_id];
				$update = ['$pull' =>
					[
						"profile.activity" =>
							[
								'act_id' => $act_id
							]
					]
				];
				$result = databaseUpdate($database, 'users', $criteria, $update);
				break;
			}
		}
	}
	$output['users'] = join(', ', $users);

	// METHOD 2: FIND ALL THE RELATED USERS FROM THE ACTIVITY (USE LESS RESOURCES)

	// 2.1 RECALC THE SKILLS.$.USR_FINAL_SCORE BASE ON ITS UACT
}


/////////////////////////////////////////////////////////////////////////////

function getActSkills($activity){
	$skills = [];
	// get from impression
	$impression_skills = $activity->impression->skills;
	//print_json($impression_skills);
	foreach ($impression_skills as $skill_name => $x){
		$skills[$skill_name] = 1;
	}
	// get from assessment
	foreach ($activity->assessment->assessments as $i => $x){
		//getSkills($assessment['skills'], $skills);
		foreach ($x->skills as $skill_name => $y){
			$skills[$skill_name] = 1;
		}
	}
	//print_json($skills);
	return hash2numArr_key($skills);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
/*
//
// for post-delete activity
//
function calcUsrFinalScore($usr_doc, $skill_name){
	$total_final_scores = 0; $total_final_scorers = 0; $score = 0;
	$acts = $usr_doc['profile']['activity'];
	foreach ($acts as $index => $act){
		$skill = getJsonPath($act, ['impression', 'skills', $skill_name]);
		if (isset($skill['usr_part_score'])){
			$score = $skill['usr_part_score'];
		} else {
			$score = 0;
		}
		$total_final_scores += floatval($score);
		$total_final_scorers++;
	}
	$usr_final_score = 0;
	if ($total_scorers){
		$usr_final_score = doubleval(intval(10 * $total_final_scores / $total_final_scorers) / 10.0);
	}
	// method 1: update only the usr_final_score
	$update =  [ '$set' => [ 'skills.' . $skill_name . '.usr_final_score' => $usr_final_score ] ];
	$result = databaseUpdate($database, $col_usr, $filters_usr, $update);
}
*/

//////////////////////////////////////////////////////////

function convertEmailToUserID(&$others){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act, $col_usr, $act_id, $test_qs;
	$converted = 0;
	//print_json($others);
	//var_dump($others); return;

	if (isset($others) && is_array($others)){
		foreach ($others as $index => $user_id){
			if (strpos($user_id, '@') === false){
			} else {
				// this is an email
				$user_email = $user_id;
				// find this user from users
				$documents = databaseRead($database, $col_usr, ['email' => $user_email], ['projection'=>['_id'=>0, 'user_id'=>1]]);
				if ($documents && sizeof($documents) > 0){
					$user = $documents[0];
					$others[$index] = $user->user_id;
					$converted = 1;
				}
			}
		}
		if ($converted){
			sort($others);
		}
	}
	return $converted;
}

/////////////////////////////////////////////////////////

function getActAssessors($activity){
	$assessors = [];
	// get hash array from impression
	getAssessors($activity, $activity->impression->panelists, $assessors);

	// get hash array from assessment
	foreach ($activity->assessment->assessments as $index => $assessment){
		getAssessors($activity, $assessment->panelists, $assessors);
	}
	return hash2numArr_key($assessors);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getAssessors($activity, $panelists, &$assessors){
	if ($panelists->coordinator == 1){
		$coor_id = intval($activity->coordinator_id);
		$assessors[$coor_id] = 1;
	}
	//echo "add panelists: "; print_r($panelists['others']); echo "<br><br>";
	if (gettype($panelists->others) == 'array'){
		foreach ($panelists->others as $index => $user_id){
			//echo $user_id;
			$assessors[$user_id] = 1;
		}
	}
	//echo "<b>HASH panelists:</b>"; print_r($assessors); echo "<br><br>";
}

////////////////////////////////////////////////////////////////////

function getActAssessees($activity){
	$assessees = [];
	//return $assessees;

	// get hash array from impression
	getAssessees($activity, $activity->impression->panelists, $assessees);

	// get hash array from assessment
	foreach ($activity->assessment->assessments as $index => $assessment){
		getAssessees($activity, $assessment->panelists, $assessees);
	}
	return hash2numArr_key($assessees);

}

///////////////////////////////////////////////////////////////////

function getAssessees($activity, $panelists, &$assessees){
	if ($panelists->coordinator == 1){
		$coor_id = intval($activity->coordinator_id);
		$assessees[$coor_id] = 1;
	}
	if (gettype($panelists->others) == 'array'){
		foreach ($panelists->others as $index => $user_id){
			//echo $user_id;
			$assessees[$user_id] = 1;
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// CHECKINVITEUSER
// - CREATE A USER
// - SEND EMAIL IF IT DOES NOT EXIST
// - SEND NOTIFICATION
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getInvitedUser($user_id, $iamassessor, $iamparticipant, $activity){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act, $col_usr, $act_id, $test_qs, $template_user;
	$debug = isset($test_qs);
	$debug = 0;
	if ($debug){
		//echo "getInvitedUser($user_id, $iamassessor, $iamparticipant)<br/>";
	}

	// find user types (assessor or participant?)
	$user = 0;
	if ($iamassessor || $iamparticipant){

		if (strpos($user_id, '@') !== false){

			//////////////////////////////////////////////////////
			// case 1: user_id is email
			//////////////////////////////////////////////////////
			$user_email = $user_id;
			$filters = ['email' => $user_email];
			$documents = databaseRead($database, $col_usr, $filters);
			if (!$documents || !sizeof($documents)){
				// case 1A: no dummy user, create a new user
				$user = jsonclone($template_user);
				$user_id =
				$user->user_id = getNewSequenceID('user_id', 'users');
				$user->email = $user_email;
				// create user
				$result = databaseInsert($database, $col_usr, $user);
				if ($debug){
					echo "<b>getInvitedUser(case 1A: create a new user):</b> email=$user_email user_id=$user_id <br/>";
				}
			} else {
				// case 1B: already have a dummy user
				$user = $documents[0];
				$user_id = $user->user_id;
				if ($debug){
					echo "<b>getInvitedUser(case 1B: follow the old user):</b> email=$user_email user_id=$user_id <br/>";
				}
			}
		} else if ($user_id != 0){
			//////////////////////////////////////////////////////
			// case 2: user_id is number, it is an exisiting user
			//////////////////////////////////////////////////////
			$user_id = intval($user_id);
			$documents = databaseRead($database, 'users', ['user_id' => $user_id]);
			if ($documents && sizeof($documents) > 0){
				$user = $documents[0];
				$user_email = $user->email;
			}

			if ($debug){
				echo "<b>getInvitedUser(case 2: exisiting user):</b> user_id=$user_id <br/>";
			}
		} else {
			$error = "No such a user: user_id=0";
		}
	}
	return $user;
}

//////////////////////////////////////////////////////////////////////////////////

function getUserActFromDB($act_id, $user_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act, $col_usr, $act_id, $test_qs;
	global $template_uact_ass_item, $template_uact_skill;

	// CHECK IF UACT ALREADY EXISTS
	$documents2 = databaseRead($database, 'users',
		['user_id' => $user_id, 'profile.activity.act_id' => $act_id],
		[ 'projection' => ['_id' => 0, 'profile.activity.$' => 1 ]]
	);
	$old_uact = 0;
	if ($documents2 && sizeof($documents2) > 0){
		$old_user = json_decode(json_encode($documents2[0]), false);
		$old_uact = $old_user->profile->activity[0];
		//echo "<b>act_id=$act_id user_id=$user_id</b><br>";
		//print_json($old_uact);
	}
	return $old_uact;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getAllUsers($act){

	//print_json($act);

	// ADD FROM COORDINATOR
	$hash_arr = [$act['coordinator_id'] => 1];

	// ADD FROM PARTICIPANTS
	setHashArr($act['participants'], $hash_arr);

	// ADD FROM IMPRESSION
	$others = $act['impression']['panelists']['others'];
	setHashArr($others, $hash_arr);

	// ADD FROM ASSESSMENT
	$assessments = $act['assessment']['assessments'];
	foreach ($assessments as $index => $ass){
		$others = $ass['panelists']['others'];
		setHashArr($others, $hash_arr);
	}
	$num_arr = hash2numArr_key($hash_arr);
	//echo "***";
	//print_json($num_arr);
	return $num_arr;
}

/////////////////////////////////////////////////////////////////////

function setHashArr($num_arr, &$hash_arr){
	if (is_array($num_arr)){
		foreach ($num_arr as $index => $user_id){
			$user_id = intval($user_id);
			$hash_arr[$user_id] = 1;
		}
	}
}

////////////////////////////////////////////////////////

function updateActivityToUser($user_id, $activity, $role){
	global $database, $error, $type, $email, $pwd, $error, $output, $template_user_activity;
	$act_id = intval($activity->act_id);
	//$act_id = 1;

	// UPDATE THE COORDINATOR WITH THIS ACTIVITY
	$documents = databaseRead($database, 'users', ['user_id' => $user_id]);
	if ($documents && sizeof($documents) > 0){
		$user = json_decode(json_encode($documents[0]), false);
		$activities = $user->profile->activity;	// is an array
		$user_activity = 0;
		$index = -1;

		// UPDATE ACTIVITIES
		foreach ($activities as $index_temp => $activity_temp){
			if ($activity_temp->act_id == $act_id){
				$index = intval($index_temp);
				// CREATE WITH THE TEMPLATE
				$user_activity = $activity_temp;
				break;
			}
		}
		if (!$user_activity){
			//$user_activity = jsonclone($template_user_activity);
			$user_activity = new stdClass();
			$user_activity->assessments = new stdClass();
			$user_activity->impression = new stdClass();
			$user_activity->impression->skills = new stdClass();
			$user_activity->published = 0;
		}

		// UPDATE USER ACTIVITY
		$user_activity->act_id		= $act_id;
		$user_activity->title			= $activity->title;
		$user_activity->act_type	= $activity->act_type;
		$user_activity->start			= $activity->start;
		$user_activity->end				= $activity->end;

		//$act_skills = getActSkills($activity);
		$impression_skills = $activity->impression->skills;
		foreach ($impression_skills as $skill_name => $x){
			//print_json($user_activity->impression->skills);
			//echo $skill_name;
			$user_activity->impression->skills->$skill_name = [
				'usr_part_score' => 0,
				'assessors' => new stdClass(),
			];
		}
		if ($index == -1){
			array_push($activities, $user_activity);			// CREATE
		} else {
			$activities[$index] = $user_activity;					// EDIT
		}
		$result = databaseUpdate($database, 'users', ['user_id' => $user_id], ['$set' => ['profile.activity' => $activities]]);
		$output['index'] = $index;

		// UPDATE USER STAT
	} else {
		$error = "no user_id";
	}
}

//////////////////////////////////////////////////////////////
// http://php.net/manual/en/function.json-decode.php
// https://github.com/codeguy/php-the-right-way/issues/479
//////////////////////////////////////////////////////////////
// only to be called after saveactivity

function publishActivity(){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act, $col_usr, $act_id, $test_qs;
	global $template_uact_ass_item, $template_uact_skill;

	$debug_publish = isset($test_qs);
	$debug_publish = 0;
	if ($debug_publish){
		echo "<b>publishActivity: </b><br/>";
	}

	// 1. read activity
	$act_id = intval($act_id);
	$documents = databaseRead($database, $col_act, ['act_id' => $act_id]);
	if ($documents && sizeof($documents) > 0){
		$activity = json_decode(json_encode($documents[0]), false);
	} else {
		$error = "cannot find activity act_id=$act_id";
		return;
	}

	// 2. read coordinator
	$coor_id = intval($activity->coordinator_id);
	$documents = databaseRead($database, $col_usr,
		[
			'user_id' => $coor_id,
			"profile.activity.act_id" => $act_id],
			[
				'projection' => ['_id' => 0, "profile.activity.$" => 1]
			]
	);

	if ($documents && sizeof($documents) > 0){
		$coordinator = json_decode(json_encode($documents[0]), false);
	} else {
		$error = "cannot find coordinator user_id=$coor_id";
		return;
	}
	//if ($debug_publish){
		//echo "<b>publish coordinator</b>"; print_json($coordinator);
		//echo "<b>publish activity</b>"; print_json($activity);
	//}

	// 3. update coordinator's user document
	$coor_uact = $coordinator->profile->activity[0];

	// update published
	$coor_uact->published = 1;

	// find all the assessors (in ids);
	$assessors = getActAssessors($activity);
	$unique_assessors = num2hashArr($assessors);	// unique assessors

	// find all the assessees (in ids);
	$assessees = getActAssessees($activity);
	$unique_assessees = num2hashArr($assessees);	// unique assessees

	if ($debug_publish){
		echo "Assessors: "; echo implode(', ', $assessors); echo "<br>";
		echo "Assessees: "; echo implode(', ', $assessees); echo "<br>";
	}

	// find all the participants (in ids)
	$participants = $activity->participants;
	$unique_participants = num2hashArr($participants);
	if ($debug_publish){
		echo "Participants: "; echo implode(', ', $participants); echo "<br>";
	}

	// find all skills
	$act_skills = getActSkills($activity);
	if ($debug_publish){
		echo "Skills: "; echo implode(', ', $act_skills); echo "<br><br>";
	}

	///////////////////////////////////////////////////////
	// find all users from 3 types
	///////////////////////////////////////////////////////
	$all_users = [$coor_id => 1];
	foreach ($unique_assessors as $user_id => $v){
		$all_users[$user_id] = 1;
	}
	foreach ($unique_participants as $user_id => $v){
		$all_users[$user_id] = 1;
	}
	if ($debug_publish){
		echo "All users: "; echo implode(', ', hash2numArr_key($all_users)); echo "<br>";
	}

	// loop thru for all related users
	$user = 0;
	$user_id = 0;

	foreach ($all_users as $user_id => $v){

		// for each user
		$user_id = intval($user_id);

		// FIND OLD UACT FROM DATABASE
		//echo "$user_id<br/>";
		$old_uact = getUserActFromDB($act_id, $user_id);

		// COPY UACT FROM THE COORDINATOR'S
		$new_uact = jsonclone($coor_uact);
		//echo "coor_uact: "; print_json($new_uact);

		/////////////////////////////////////////////////////////////////
		// COORDINATOR, ASSESSOR, PARTICIPANT ROLES
		/////////////////////////////////////////////////////////////////
		$iamcoordinator = 0; $iamassessor = 0; $iamparticipant = 0;
		if ($coor_id == $user_id){
			$iamcoordinator = 1;
		}
		if (isset($unique_assessees[$user_id])){
			$iamassessor = 1;
		}
		if (isset($unique_participants[$user_id])){
			$iamparticipant = 1;
		}

		// GET NEW ASSESSMENTS
		$new_uact->assessments = jsonclone($activity->assessment->assessments);

		// FOR EACH ASSESSMENT ITEM
		foreach ($new_uact->assessments as $index => $new_asst){
			$index = intval($index);

			// PANALISTS
			$new_asst->panelists->peer_assessors = [];

			// FOR EACH ITEM
			foreach ($new_asst->items as $j => $item){
				$new_asst->items[$j] = jsonclone($template_uact_ass_item);
				$new_asst->items[$j]->ass_item_id = $j + 1;
			}

			// FIND OLD ASSESSMENT
			//print_json($old_uact);
			if ($old_uact && isset($old_uact->assessments)){

				if (!is_array($old_uact->assessments)){
					$old_uact->assessments = []; // correct to array type
				}

				if (isset($old_uact->assessments[$index])){
					$old_asst = $old_uact->assessments[$index];
					//print_json($old_asst);

					// COPY OLD VALUES
					if (isset($old_asst->panelists) && isset($old_asst->panelists->peer_assessors)){
						$new_asst->panelists->peer_assessors = jsonclone($old_asst->panelists->peer_assessors);
					}
					if (isset($old_asst->saved)){
						$new_asst->saved = $old_asst->saved;
					}
					if (isset($old_asst->performed)){
						$new_asst->performed = $old_asst->performed;
					}
					if (isset($old_asst->marked)){
						$new_asst->marked = $old_asst->marked;
					}
					foreach ($new_asst->items as $j => $item){
						if (isset($old_asst->items) && isset($old_asst->items[$j])){
							$new_asst->items[$j] = jsonclone($old_asst->items[$j]);
						}
					}
				}
			}
			//echo "$new_asst->method index=$index<br>"; print_json($new_asst);
		}

		/////////////////////////////////////////////////////////////////
		// PARTICIPANTS
		/////////////////////////////////////////////////////////////////
		if (isset($unique_participants[$user_id])){
			$iamparticipant = 1;

			// ADD PEER ASSESSORS FOR IMPRESSION
			if (!isset($new_uact->impression->panelists)){
				$new_uact->impression->panelists = new stdClass();
			}
			$new_uact->impression->panelists->peer_assessors = [];

			// ADD UACT SKILLS
			foreach ($new_uact->impression->skills as $skill_name => $x){
				if ($old_uact && isset($old_uact->impression->skills) && isset($old_uact->impression->skills->$skill_name)){
					$old_uact->impression->skills->$skill_name = jsonclone($old_uact->impression->skills->$skill_name);
				} else {
					$new_uact->impression->skills->$skill_name = jsonclone($template_uact_skill);
				}
			}
		}

		// UACT ROLES
		$new_uact->uact_coordinator	= $iamcoordinator;
		$new_uact->uact_assessor 		= $iamassessor;
		$new_uact->uact_participant	= $iamparticipant;

		//*** CHECKINVITEUSER
		$user = getInvitedUser($user_id, $iamassessor, $iamparticipant, $activity);
		//print_json($user);
		if (isset($user) && isset($user->user_id)){
			$user_id = intval($user->user_id);
			//echo "***$user_id<br>";

			if ($iamassessor){
				$unique_assessors[$user_id] = 1;
			}
			if ($iamparticipant){
				$unique_participants[$user_id] = 1;
			}
			// DEBUG
			if ($debug_publish){
				//echo "<b>uact(act_id=$act_id user_id=$user_id coor=$iamcoordinator assr=$iamassessor part=$iamparticipant):</b> ";	print_json($new_uact);	echo "<br><br>";
			}

			// update UACT to database
			databaseUpdateArrayElement($database, $col_usr, ['user_id' => $user_id], 'profile.activity', ['act_id' => $act_id], $new_uact);

			// return my uact to client side
			if ($user_id == $coor_id){
				$output['user_uact'] = $new_uact;
			}

			// update network
			$networks = getActUsers($user_id);
			$filters = ['user_id' => $user_id];
			$sets = ['networks' => $networks];
			databaseUpdate($database, 'users', $filters, ['$set' => $sets]);
		} else {
			//echo "$user_id not found";
		}
	}
	//return;

	// resume the assessors and the participants to the activity
	$activity->published = 1;
	$activity->participants = hash2numArr_nonemail($unique_participants);

	////////////////////////////////////////////////
	// TO BE DONE
	// 6. update other assessors in activity panelists
	// - replace email to id in panelists
	////////////////////////////////////////////////
	$converted = 0;
	if (convertEmailToUserID($activity->impression->panelists->others)){
		$converted = 1;
	}
	foreach ($activity->assessment->assessments as $index => $assessment){
		if (convertEmailToUserID($assessment->panelists->others)){
			$converted = 1;
		}
	}
	//print_json($activity); exit();

	// 7. update activity
	//		- update publish status

//	if ($converted){
//		unset($activity->_id);
//		$result = databaseUpdate($database, $col_act, ['act_id' => $act_id], [
//			'$set' => $activity,
//		]);
//	} else {
//		$result = databaseUpdate($database, $col_act, ['act_id' => $act_id], [
//			'$set' => [
//				'published' => 1,
//				'participants' => $activity->participants,
//			]
//		]);
//	}

	// set published flag
//	$activity->published = 1;

	unset($activity->_id);

	// update activity peers
	$act_peers_hash = [];
	getUserIdsFromAct($act_id, $act_peers_hash, 0);
	$act_peers = hash2numArr_key($act_peers_hash);

	$criteria = ['act_id' => $act_id];
	$sets = ['$set' => $activity];
	$result = databaseUpdate($database, $col_act, $criteria, $sets);

	// 8. GET COORDINATOR'S NAME (BY USER_ID)
	$coor_name = '';
	$documents1 = databaseRead($database, $col_usr, ['user_id' => $coor_id]);
	if (sizeof($documents1) > 0){
		$coor = $documents1[0];
		$coor_name = $coor->username;
	}
	//print_json($all_users);

	// 9. SEND EMAIL/NOTIFICATION?
	foreach ($all_users as $user_id => $v){	// all $v equal to 1
		$user_id = intval($user_id);
		//print_json($user_id);

		$documents1 = databaseRead($database, $col_usr,
			['user_id' => $user_id, 'profile.activity.act_id' => $act_id],
			['projection' =>
				[	'_id' => 0,
					'email' => 1,
					'confirmed_email' => 1,
					'token_ios' => 1,
					'token_android' => 1,
					'profile.activity.$' => 1,
				]
			]
		);
		if (sizeof($documents1) > 0){
			$user = json_decode(json_encode($documents1[0]), false);

			// FIND USER TYPES
			$user_types = '';
			if ($iamassessor){
				$user_types .= 'an assessor';
			}
			if ($iamparticipant){
				if ($user_types != ''){
					$user_types .= ' and ';
				}
				$user_types .= 'a participant';
			}
			//echo "$user_types<br><br>";

			// SEND INVITATION OR NOTIFICATION
			if ($user_types != ''){
				if (!isset($user->token_android)){
					$user->token_android = '';
				}
				if (!isset($user->token_ios)){
					$user->token_ios = '';
				}
				// Has it been notified before?
				//echo "$user->email: notified=".$user->profile->activity[0]->notified_invitation . "<br/>";

				if (
						!isset($user->profile->activity[0]->notified_invitation)
					||
						$user->profile->activity[0]->notified_invitation != 1
				){

					// 8. not registred yet or no mobile => send email
					if (!$user->confirmed_email || ($user->token_android != '' || $user->token_ios != ''))
					{
						sendEmail_invitation($coor_name, $user->confirmed_email, $user->email, $user_types, $activity);
					}

					// 9. send notification to the activiy page
					if ($user->token_android != '' || $user->token_ios != '')
					{
						sendNotify_invitation($coor_name, $user->token_android, $user->token_ios, $user_types, $activity);
					}

					// 10. write the notified flag
					$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
					$sets = ['profile.activity.$.notified_invitation' => 1];
					databaseUpdate($database, 'users', $filters, ['$set' => $sets]);

					wlog("sent invitation to user $user_id for activity $act_id");
				}
			}
		}
	}
}

?>
