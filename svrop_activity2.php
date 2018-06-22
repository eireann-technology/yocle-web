<?php

function saveActivity2(){
	global $database, $error, $type, $email, $pwd, $output, $user_id, $act_id, $test_qs;

	$debug_save = isset($test_qs);
	$debug_save = 0; // testing

	$new_activity = getQS('activity');
	$publish = getQS('publish') == 1 ? 1 : 0;
	if (!$new_activity){

		$error = 'no activity input';

	} else {

		// true will convert assoc array into number array (true use obj[name], false use obj->name)
		$new_activity = json_decode($new_activity, false);

		//print_json($new_activity); exit();
		//if ($debug_save){
		//	echo "<b>save activity</b>"; print_json($new_activity);
		//}

		$act_id = intval($new_activity->act_id);

		$messages = [];	// find the messages in the old record?

		// is it a new activity?
		if (!$act_id){
			// get the new act_id
			$act_id = getNewSequenceID('act_id', 'activities');
			// create the activity
			$new_activity->act_id = $act_id;
			//$result = databaseInsert($database, 'activities', $new_activity);
		} else {

			// act_id is present, not create activity
			$filters = ['act_id' => $act_id];
			$options = [];
			$documents = databaseRead($database, 'activities', $filters, $options);
			if (!sizeof($documents)){
				$error = 'old activity not found';
				return;
			}
			//////////////////////////////////////////////////////////////////////
			// COPYING FROM OLD TO NEW ACTIVITY
			//////////////////////////////////////////////////////////////////////
			// OLD ACTIVITY
			$old_activity = json_decode(json_encode($documents[0]), false);	// convert to -> instead of ['']

			// COPY ASSESSEMENTS
			$new_assts = $new_activity->assessment->assessments;
			$old_assts = $old_activity->assessment->assessments;
			foreach ($old_assts as $index => $old_asst){
				if (isset($new_assts[$index])){
					$new_asst = $new_assts[$index];

					if (isset($old_asst->assr_asst_completed)){
						$new_asst->assr_asst_completed = jsonclone($old_asst->assr_asst_completed);
					}
					if (isset($old_asst->part_asst_marks)){
						$new_asst->part_asst_marks = jsonclone($old_asst->part_asst_marks);
					}
					if (isset($old_asst->assr_asst_marks)){
						$new_asst->assr_asst_marks = jsonclone($old_asst->assr_asst_marks);
					}
					// for participation
					//if (isset($old_asst->selecteds)){
					//	$new_asst->selecteds						= jsonclone($old_asst->selecteds);
					//}
				}
			}

			// COPY IMPRESSION SKILLS
			$new_skills = $new_activity->impression->skills;
			$old_skills = $old_activity->impression->skills;
			foreach ($old_skills as $skill_name => $old_skill){
				if (isset($new_skills->$skill_name)){
					$new_skills->$skill_name = jsonclone($old_skill);
				}
			}

			// COPY MESSAGES
			if (isset($old_activity->messages) && $old_activity->messages != null){
				$messages = jsonclone($old_activity->messages);
			}
			// remove the old activity
			$result = databaseDelete($database, 'activities', ['act_id' => $act_id]);

		}

		if ($publish){
			$new_activity->published = 1;
		}
		// save the message
		$new_activity->messages = $messages;

		// find all the assessors (in ids);
		$new_activity->assessors = getActAssessors($new_activity);
		$new_activity->allusers = getAllUsers2($new_activity);

		$participants_hash = num2hashArr($new_activity->participants);
		$assessors_hash = num2hashArr($new_activity->assessors);

		//print_json($new_activity); exit();
		$result = databaseInsert($database, 'activities', $new_activity);

		$output['act_id'] = $act_id;
		// coordinator uact
		$user_id = intval($new_activity->coordinator_id);

		$uact = setUactToUser($user_id, $new_activity, $participants_hash, $assessors_hash, $publish);
		$output['user_uact'] = $uact;
		$output['user_id'] = $user_id;

		// desc
		$media_desc_hash = getQs('media_desc_hash');
		if ($media_desc_hash != ''){
			saveMediaDesc($media_desc_hash);
		}

		// publish now?
		if ($publish){
			publishActivity2($act_id, $participants_hash, $assessors_hash);
		}
		// debug
		if ($debug_save){
			echo "Coordinator: " . $new_activity->coordinator_id . "<br/>";
			echo "Participants: "; echo implode(', ', $new_activity->participants); echo "<br>";
			echo "Assessors: "; echo implode(', ', $new_activity->assessors); echo "<br>";
			echo "All users: "; echo implode(', ', $new_activity->allusers); echo "<br>";
			print_json($new_activity);
		}
	}
}

///////////////////////////////////

function publishActivity2($act_id, $participants_hash, $assessors_hash){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act, $col_usr, $user_id, $test_qs;
	global $template_uact_ass_item, $template_uact_skill;

	$debug_publish = isset($test_qs);
	$debug_publish = 0;
	if ($debug_publish){
		echo "<b>publishActivity: </b><br/>";
	}
	//exit();

	// 1. read activity
	$filters = ['act_id' => $act_id];
	$options = [];
	$documents = databaseRead($database, $col_act, $filters, $options);
	if ($documents && sizeof($documents) > 0){
		$act = json_decode(json_encode($documents[0]), false);
	} else {
		$error = "cannot find activity act_id=$act_id";
		return;
	}

	// 2. read coordinator
	$coor_id = intval($act->coordinator_id);

	// find all skills
	$act_skills = getActSkills($act);
	if ($debug_publish){
		//print_json($act_skills);
		echo "Skills: "; echo implode(', ', $act_skills); echo "<br><br>";
	}
	//print_json($act); exit();

	// loop thru for all related users
	//$participants_hash = num2hashArr($act->participants);
	//$assessors_hash = num2hashArr($act->assessors);
	$iamparticipant = isset($participants_hash[$user_id]) ? 1 : 0;
	$iamassessor = isset($assessors_hash[$user_id]) ? 1 : 0;

	// UPDATE EACH USER IN DATABASE
	//$act->allusers = [25];	// testing alantypoon 20180602
	foreach ($act->allusers as $user_id2){
		if ($user_id2 != $coor_id){
			$uact = setUactToUser($user_id2, $act, $participants_hash, $assessors_hash, 1);
		}
		// return my uact to client side
		//if ($user_id2 == $coor_id){
		//	$output['user_uact'] = $uact;
		//}
	}

	////////////////////////////////////////////////
	// TO BE DONE
	// 6. update other assessors in activity panelists
	// - replace email to id in panelists
	////////////////////////////////////////////////
	$converted = 0;
	if (convertEmailToUserID($act->impression->panelists->others)){
		$converted = 1;
	}
	foreach ($act->assessment->assessments as $index => $assessment){
		if (convertEmailToUserID($assessment->panelists->others)){
			$converted = 1;
		}
	}

	// ***UPDATE ACTIVITY
	unset($act->_id);
	$act->published = 1;
	$criteria = ['act_id' => $act_id];
	$sets = ['$set' => $act];
	databaseUpdate($database, $col_act, $criteria, $sets);

	///////////////////////////////////////////
	// SEND EMAIL/NOTIFICATION?
	///////////////////////////////////////////

	// prepare arrays
	$email_hash = [];
	$android_hash = [];
	$ios_hash = [];

	//print_json($act->allusers);
	foreach ($act->allusers as $j => $user_id2){	// all $v equal to 1
		//wlog($user_id2);
		$user_id2 = intval($user_id2);

		// skip coordinator
		//if ($user_id2 == $coor_id){
			//wlog("skipped coordinator $coor_id");	// coordinator needs no invitation
			//continue;
		//}

		//print_json($user_id);
		$documents1 = databaseRead($database, $col_usr,
			['user_id' => $user_id2, 'profile.activity.act_id' => $act_id],
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

			// SEND INVITATION OR NOTIFICATION
			$uact = $user->profile->activity[0];

			// Has it been notified before?
			if (!isset($uact->notified_invitation)|| $uact->notified_invitation == 0){
				wlog("invitation to $user_id2: added");

				$token_android = !isset($user->token_android) ? '' : $user->token_android;
				$token_ios = !isset($user->token_ios) ? '' : $user->token_ios;

				// 8. not registred yet or no mobile => send email
				if (
					!$user->confirmed_email
						||
					($token_android == '' && $token_ios == '')
				){
					//array_push($email_arr, $user->email);
					$email_hash[$user->email] = 1;
				}
				if ($token_android != ''){
					//array_push($android_arr, $token_android);
					$android_hash[$token_android] = 1;
				}
				if ($token_ios != ''){
					//array_push($ios_arr, $token_ios);
					$ios_hash[$token_ios] = 1;
				}
				// 10. write the notified flag
				$filters = ['user_id' => $user_id2, 'profile.activity.act_id' => $act_id];
				$sets = ['profile.activity.$.notified_invitation' => 1];
				databaseUpdate($database, 'users', $filters, ['$set' => $sets]);

			} else {
				//wlog("inviation to $user_id2: already notified");
			}
		}
	}
	// prepare arrays
	$email_arr = hash2numArr_key($email_hash);
	$android_arr = hash2numArr_key($android_hash);
	$ios_arr = hash2numArr_key($ios_hash);

	wlog(
		"invitation of act $act_id:" .
			" email=".sizeof($email_arr).
			" android=".sizeof($android_arr).
			" ios=".sizeof($ios_arr)
	);

	// GET COORDINATOR'S NAME (BY USER_ID)
	$coor_name = '';
	$filters = ['user_id' => $coor_id];
	$options = ['projection' => ['_id' => 0, "username" => 1]];
	$documents1 = databaseRead($database, $col_usr, $filters, $options);
	if (sizeof($documents1) > 0){
		$coor = $documents1[0];
		$coor_name = $coor->username;
	}
	if (sizeof($email_arr)){
		wlog("email: " . implode(',', $email_arr));
		sendEmail_invitation2($coor_name, $email_arr, $act);
	}
	if (sizeof($android_arr)){
		wlog("android: " . implode(',', $android_arr));
		sendNotify_invitation2($coor_name, 0, $android_arr, $act);
	}
	if (sizeof($ios_arr)){
		wlog("ios: " . implode(',', $ios_arr));
		sendNotify_invitation2($coor_name, 1, $ios_arr, $act);
	}
}

/////////////////////////////////////////////////////////////////////////////////

function setUactToUser($user_id, $act, $participants_hash, $assessors_hash, $publish){
	global $test_qs;
	$debug = isset($test_qs);
	$debug = 0;
/*
	// testing only
	if ($user_id == 2 && $act->act_id == 138){
		$debug = 1;
	} else {
		return;
	}
*/
	//if ($debug){
	//	echo "<b>setUactToUser $user_id</b><br/>";
	//	print_json($participants_hash);
	//	print_json($assessors_hash);
		//exit();
	//}

	global $database, $error, $type, $email, $pwd, $error, $output, $col_usr, $template_uact_ass_item, $template_uact_skill;

	$act_id = intval($act->act_id);
	$uact_img_id = $act->img_id;	// alantypoon 20170810
	$uact_title = $act->title;
	$uact_act_type = $act->act_type;
	$uact_start = $act->start;
	$uact_end = $act->end;
	$uact_coordinator = ($act->coordinator_id == $user_id ? 1 : 0);
	$uact_assessor = (isset($assessors_hash[$user_id]) ? 1 : 0);
	$uact_participant = (isset($participants_hash[$user_id]) ? 1 : 0);

	//$iamassessor = isset($assessors_hash[$user_id]) ? 1 : 0;
	//echo "setUactToUser user_id=$user_id act_id=$act_id iamparticipant=$iamparticipant<br/>";

	// CREATE USER IF NEEDED
	$user = getInvitedUser2($user_id);	// not used

	// READ THE USER
	$uact = 0;
	$criteria = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$options = [ 'projection' => ['_id' => 0, 'profile.activity.$' => 1]];
	$users = databaseRead($database, 'users', $criteria, $options);
	//print_json($documents);

	// CASE 1: GET OLD UACT
	if (sizeof($users)){
		$user = json_decode(json_encode($users[0]), false);
		$uact = $user->profile->activity[0];
	}

	// CASE 2: CREATE NEW UACT
	if (!$uact){
		$uact = [
				'assessments' =>  [],
				'impression' => [
				'skills' => new stdClass(),
				'act_gsscore' => 0,
			],
			'notified_invitation' => 0,
		];
		$uact = json_decode(json_encode($uact), false);
	}

	// update propreties
	$uact->act_id = $act_id;	// alantypoon 20170810
	$uact->img_id = $uact_img_id;	// alantypoon 20170810
	$uact->title = $uact_title;
	$uact->act_type = $uact_act_type;
	$uact->start = $uact_start;
	$uact->end = $uact_end;
	$uact->uact_coordinator = $uact_coordinator;
	$uact->uact_assessor = $uact_assessor;
	$uact->uact_participant = $uact_participant;
	$uact->published = $publish;
	///////////////////////////////////
	// COPY ASSESSMENTS
	///////////////////////////////////
	$old_uassts = jsonclone($uact->assessments);	// in case it is an object
	//print_json($old_uassts);

	$nolduasst = sizeof($old_uassts);
	//echo "user_id=$user_id nolduasst=$nolduasst<br/>";

	$act_assts = jsonclone($act->assessment->assessments);
	//$uact->assessments = jsonclone($act->assessment->assessments);

	// brand new ASSESSEMENTS
	$uact->assessments = [];
	//print_json($old_uassts); exit();

	//print_json($act_assts);
	// FOR EACH ASST
	foreach ($act_assts as $index => $act_asst){

		$new_uasst = jsonclone($act_asst);	// INCLUDING RUBRICS?
		unset($new_uasst->rubrics);

		$ass_id = $index + 1;

		// find old uasst
		if ($index < $nolduasst){
			$old_uasst = $old_uassts[$index];
		} else {
			$old_uasst = 0;
		}

		// testing
		//if ($debug && $ass_id == 1){
		//	echo "old_usasst user_id=$user_id";
		//	print_json($old_uasst);
		//}

		// remove unneeded
		unset($new_uasst->start);
		unset($new_uasst->end);
		unset($new_uasst->desc);
		unset($new_uasst->assr_asst_completed);
		unset($new_uasst->part_asst_marks);
		unset($new_uasst->assr_asst_marks);

		// FOR PARTICIPANTS ONLY: CREATE NEW ITEMS OR COPY THE OLD ITEMS
		//echo $uact_participant . "<br/>";

		if ($uact_participant){

			// CREATE EMPTY PANELISTS
			$new_uasst->panelists = [
				'peer_assessors' => [],
			];

			// CREATE NEW ITEMS FOLLOWING THE ACT ASST ITEMS
			//foreach ($act_assts->items as $j => $it){
			$nitem = sizeof($act_asst->items);
			//echo $nitem;
			for ($j = 0; $j < $nitem; $j++){
				$new_uasst->items[$j] = jsonclone($template_uact_ass_item);
				$new_uasst->items[$j]->ass_item_id = $j + 1;
			}

			//////////////////////////////////
			// COPY FROM OLD UASST
			//////////////////////////////////
			if ($old_uasst){

				// COPY PANELISTS
				if (isset($old_uasst->panelists->peer_assessors)){
					$new_uasst->panelists['peer_assessors'] = jsonclone($old_uasst->panelists->peer_assessors);
				}
				// COPY ASSESSOR (PRT ONLY)
				//"assessors" : {
				//    "22" : {
				//        "items" : [
				if (isset($old_uasst->assessors)){
					$new_uasst->assessors = jsonclone($old_uasst->assessors);
				}

				// CHECK AND COPY ITEMS
				if (isset($old_uasst->items)){
					foreach ($old_uasst->items as $j => $old_item){
						$copy = 0;
						switch ($act_asst->method){

							case 'prt':
							case 'pst':
							case 'blg':
								$copy = 1;	// copy all user items for blog and posters
								break;

							default:
								if (isset($new_uasst->items[$j]) && isset($old_item->ass_item_id)){
									$copy = 1;
								}
								break;
						}
						if ($copy == 1){
							//echo "copying index=$j<br/>"; print_json($old_item);
							$new_uasst->items[$j] = jsonclone($old_item);
						}
					}
				}

				// copy dates
				if (isset($old_uasst->saved)){
					$new_uasst->saved = $old_uasst->saved;
				}
				if (isset($old_uasst->performed)){
					$new_uasst->performed = $old_uasst->performed;
				}
				if (isset($old_uasst->marked)){
					$new_uasst->marked = $old_uasst->marked;
				}
			}
			//if ($debug && $ass_id == 1){
			//	echo "new_usasst user_id=$user_id";
			//	print_json($new_uasst);
			//}
		}
		$uact->assessments[$index] = $new_uasst;
	}

	///////////////////////////////////
	// COPY IMPRESSION
	///////////////////////////////////
	// FOR EACH SKILL
	//print_json($uact->impression);
	if (is_array($uact->impression->skills)){
		$uact->impression->skills = new stdClass();
	}
	foreach ($act->impression->skills as $skill_name => $x){
		if (!isset($uact->impression->skills->$skill_name)){
			$uact->impression->skills->$skill_name = jsonclone($template_uact_skill);
		}
	}
	// remove if it does not exist anymore
	foreach ($uact->impression->skills as $skill_name => $x){
		if (!isset($act->impression->skills->$skill_name)){
			unset($uact->impression->skills->$skill_name);
		}
	}

	// *** UPDATE USER
	$filters = ['user_id' => $user_id];
	$path = "profile.activity";
	$criteria = ['act_id' => $act_id];

	//if ($debug){
	//	print_json($filters);
	//	print_json($criteria);
		//print_json($uact);
	//}
	databaseUpdateArrayElement($database, $col_usr, $filters, $path, $criteria, $uact);

	// *** UPDATE NETWORK (ACT PEERS)
	$filters = ['user_id' => $user_id];
	$sets = ['$set' => ['networks' => getActUsers($user_id)]];
	//if ($debug)
	//if ($user_id == 22)
	//{
	//	print_json($filters);
	//	print_json($sets);
	//}
	databaseUpdate($database, $col_usr, $filters, $sets);	// testing alantypoon 20180602

	//print_json($uact);
	return $uact;
}

/////////////////////////////////////////////////////////////////////////

function getInvitedUser2($user_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act, $col_usr, $act_id, $test_qs, $template_user;
	$debug = isset($test_qs);
	$debug = 0;

	// find user types (assessor or participant?)
	$user = 0;

	if (strpos($user_id, '@') !== false){
		//////////////////////////////////////////////////////
		// case 1: user_id is email
		//////////////////////////////////////////////////////
		$user_email = $user_id;
		$filters = ['email' => $user_email];
		$options = [ 'projection' => ['_id' => 0, 'user_id' => 1, 'email' => 1]];
		$documents = databaseRead($database, $col_usr, $filters, $options);
		if (!sizeof($documents)){
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
		$filters = ['user_id' => $user_id];
		$options = [ 'projection' => ['_id' => 0, 'user_id' => 1, 'email' => 1]];
		$documents = databaseRead($database, 'users', $filters, $options);
		if (sizeof($documents) > 0){
			$user = $documents[0];
			$user_email = $user->email;
		}

		if ($debug){
			echo "<b>getInvitedUser(case 2: exisiting user):</b> user_id=$user_id <br/>";
		}
	} else {
		$error = "No such a user: user_id=0";
	}
	return $user;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// -> version, json_decode( false)
//////////////////////////////////////

function getAllUsers2($act){

	//print_json($act);

	// ADD FROM COORDINATOR
	$hash_arr = [$act->coordinator_id => 1];

	// ADD FROM PARTICIPANTS
	setHashArr($act->participants, $hash_arr);

	// ADD FROM IMPRESSION
	$others = $act->impression->panelists->others;
	setHashArr($others, $hash_arr);

	// ADD FROM ASSESSMENT
	$assessments = $act->assessment->assessments;
	foreach ($assessments as $index => $ass){
		$others = $ass->panelists->others;
		setHashArr($others, $hash_arr);
	}
	$num_arr = hash2numArr_key($hash_arr);
	return $num_arr;
}

?>
