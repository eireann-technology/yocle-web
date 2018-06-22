<?php
function submitImpression2(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_usr, $col_act, $test_qs;

	$act_id = intval(getQS('act_id'));
	$assr_id = intval(getQS('assr_id'));
	$part_id = intval(getQS('part_id'));
	
	$skills = getQS('skills');
	$comments = getQS('comments');
	$datetime_now = getDateTime();
	
/*
	print_json($act_id);
	print_json($assr_id);
	print_json($part_id);
	print_json($skills);
	print_json($comments);
*/
	// READ USER
	$filters = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
	$options = ['projection' => ['_id' => 0, 'profile.activity.$.impression.skills' => 1]];
	$users = databaseRead($database, $col_usr, $filters, $options);
	if ($users && sizeof($users) > 0){
		$user = json_decode(json_encode($users[0]), true);
		$skills2 = $user['profile']['activity'][0]['impression']['skills'];

		// ADD COMMENTS
		$filters = ['impr_comment_id' => "$act_id,$assr_id,$part_id"];
		$set = ['comments' => $comments, 'datetime' => $datetime_now];
		databaseInsertOrUpdate($database, 'impr_comments', $filters, $set);

		// WRITE ASSESSORS'S USR_ASSR_SCORE
		$assr_total  = 0; $assr_count = 0;
		foreach ($skills as $skill_name => $score){

			// 1. SAVE EACH ASSESSOR'S SCORE
			$skills2[$skill_name]['assessors'][$assr_id] = [
				'usr_assr_score' => floatval($score),
				'date' => $datetime_now,
				//'impr_comment_id' => $impr_comment_id,
			];

			// 2. FOR THIS SKILL BY THIS ASSESSOR (act_assr_scores)
			$assr_total += $score;
			$assr_count++;
		}
		$act_assr_score = !$assr_count ? 0 : floatval(getDecPlace($assr_total / $assr_count, 2));

		// CALC AVERAGE USR_PART_SCORE
		$act_total  = 0; $act_count = 0;
		// for each skill in this activity
		foreach ($skills2 as $skill_name => $skill2){
			$skill_total = 0;	$skill_count = 0;

			// 2. FOR EACH ASSESSOR FOR THIS SKILL
			foreach ($skill2['assessors'] as $assessor){
				$skill_total += floatval($assessor['usr_assr_score']);
				$skill_count++;
			}
			$skill_score = !$skill_count ? 0 : floatval(getDecPlace($skill_total / $skill_count, 2));
			$skills2[$skill_name]['usr_part_score'] = $skill_score;

			// 3. FOR ALL THE SKILL IN THIS ACTIVITY
			$act_total += $skill_score;
			$act_count++;
		}
		$act_part_score = !$act_count ? 0 : floatval(getDecPlace($act_total / $act_count, 2));

		// UPDATE USER
		//echo $total.'/'.$count.'='.$skills2[$skill_name]['usr_part_score'].'</br>';
/*
	profile.
		activity[5]
				"impression" : {
					"skills" : {
							"Appreciation for others" : {
									"usr_part_score" : 3,
									"assessors" : {
											"2" : {
													"usr_assr_score" : 3,
													"comments" : "Well done!",
													"date" : "2017-09-09 01:42:59"
											}
									}
							},
							"Communication" : {
									"usr_part_score" : 3.5,
									"assessors" : {
											"2" : {
													"usr_assr_score" : 3.5,
													"comments" : "Well done!",
													"date" : "2017-09-09 01:42:59"
											}
									}
							},
*/
		$filters = [
			'user_id' => $part_id,
			'profile.activity.act_id' => $act_id,
		];
		$update = ['$set' => [
			"profile.activity.$.impression.skills" => $skills2,
			// "profile.activity.$.impression.usr_assr_scores.$assr_id,$part_id" => $act_assr_score,
		]];
		
		//print_json($filters);print_json($update);exit();
		databaseUpdate($database, $col_usr, $filters, $update);

		// UPDATE ACT
/*
    "impression" : {
        "enabled" : 1,
        "skills" : {
            "Communication" : {
                "act_part_scores" : {
                    "1" : 3
                },
                "act_assr_scores" : {
                    "2,1" : {
                        "act_assr_score" : 3,
                        "comments" : "Well done!",
                        "date" : "2017-09-09 01:42:59"
                    }
                },
                "act_assr_completeds" : {
                    "2" : 1
                }
            }
        },
*/

		// find act_part_score for activity
		$filters = ['act_id' => $act_id];
		$update = ['$set' => [
			"impression.act_part_scores.$part_id" => $act_part_score,
			"impression.act_assr_scores.$assr_id,$part_id" => $act_assr_score,
		]];
		databaseUpdate($database, $col_act, $filters, $update);

		// RETURN
		$output['skills'] = $skills2;
		$output['act_assr_score'] = $act_assr_score;
	}

/*
	$act_id = intval(getQS('act_id'));
	$assr_id = intval(getQS('assr_id'));
	$skill_name = getQS('skill_name');
	$markings = getQS('markings');
	if (gettype($markings) == 'string'){
		$markings = json_decode($input, true);
	}
	$debug = isset($test_qs);

	$datetime_now = getDateTime();
	$filters_act = [ 'act_id' => $act_id];
	$path_usr = 'profile.activity.$.impression.skills.' . $skill_name;
	$path_act = 'impression.skills.'.$skill_name;

	// READ ACTIVITY
	$documents = databaseRead($database, $col_act, $filters_act, [ 'participants' => 1, $path_act => 1]);
	if ($documents && sizeof($documents) > 0){
		$act_doc = json_decode(json_encode($documents[0]), true);

		// find participants
		$num_of_participants = sizeof($act_doc['participants']);
		//echo "num_of_participants: $num_of_participants";
		//print_r($markings); exit();

		foreach ($markings as $part_id => $marking){
			$part_id = intval($part_id);
			//echo "user_id=$part_id, act_id=$act_id <br><br>";
			$filters_usr = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];

			/////////////////////////////////////////////////////////////////////////////////////////////////////
			// (1) usr_assr_score
			/////////////////////////////////////////////////////////////////////////////////////////////////////
			$marking1 = [
				"usr_assr_score" => $marking['act_assr_score'],
				"comments" => $marking['comments'],
				"date" => $datetime_now
			];
			$update = ['$set' => [$path_usr . '.assessors.' . $assr_id => $marking1 ] ];
			if ($debug) echo "1<br>";
			$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

			/////////////////////////////////////////////////////////////////////////////////////////////////////
			// (2) act_assr_score
			/////////////////////////////////////////////////////////////////////////////////////////////////////
			$marking2 = [
				"act_assr_score" => $marking['act_assr_score'],
				"comments" => $marking['comments'],
				"date" => $datetime_now
			];
			$update = ['$set' => [$path_act . '.act_assr_scores.' . $assr_id . ',' . $part_id => $marking2 ] ];
			if ($debug) echo "2<br>";
			$result = databaseUpdate($database, $col_act, $filters_act, $update);
			//exit();
			// update memory for (3)
			$pair = $assr_id.','.$part_id;
			$act_doc['impression']['skills'][$skill_name]['act_assr_scores'][$pair] = $marking2;

		}

		/////////////////////////////////////////////////////////////////////////////////////////////////////
		// (3) act_assr_completeds
		/////////////////////////////////////////////////////////////////////////////////////////////////////
		$num_of_scored = 0;
		$act_skill = $act_doc['impression']['skills'][$skill_name];
		//print_r($act_skill);
		if (isset($act_skill['act_assr_scores'])){
			$scores_arr = $act_skill['act_assr_scores'];
			foreach ($scores_arr as $pair => $marking){
				$arr = explode(",", $pair);
				$assr_id2 = intval($arr[0]);
				$part_id2 = intval($arr[1]);
				$score = doubleval($marking['act_assr_score']);
				$comments = $marking['comments'];
				if ($assr_id2 == $assr_id){//} && ($score != 0 || $comments != '')){
					//echo "$score,$comments***<br><br>";
					$num_of_scored++;
				}
			}
			//$act_assr_completed = intval(100 * $num_of_scored / $num_of_participants);
			//echo $act_assr_completed;
			//if ($act_assr_completed > 100) $act_assr_completed = 100;
			$act_assr_completed = $num_of_scored;

			// WRITE TO ACTIVITY
			$update =  [ '$set' => [ $path_act	. '.act_assr_completeds.' . $assr_id => $act_assr_completed ] ];
			if ($debug) echo "3<br>";
			$result = databaseUpdate($database, $col_act, $filters_act, $update);

			// return to client
			$output['act_assr_completed'] = $act_assr_completed;
		}

		//////////////////////////////////////////////////////
		// READ USER FOR GENERAL VARIABLES
		//////////////////////////////////////////////////////
		foreach ($markings as $part_id => $marking){
			$part_id = intval($part_id);

			//echo "user_id=$part_id, act_id=$act_id <br><br>";
			$filters_usr = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
			$documents = databaseRead($database, $col_usr, ["user_id" => $part_id]);//, [ 'projection' => ['skills.' . $skill_name => 1, 'profile.activity.$'=>1]]);
			if ($documents && sizeof($documents) > 0){
				$usr_doc = json_decode(json_encode($documents[0]), true);

				/////////////////////////////////////////////////////////////////////////////////////////////////////
				// (4) usr_part_score
				/////////////////////////////////////////////////////////////////////////////////////////////////////
				$act = getActivityByID($usr_doc['profile']['activity'], $act_id);

				// FIND AV OF ALL USR_ASSR_SCORES IN THIS ACTIVITY
				if (!$act){
					//echo "cannot find activity user_id=$part_id act_id=$act_id<br><br>"; //print_r($usr_doc['profile']);	//exit();

				} else {

					$skill = getJsonPath($act, ['impression', 'skills', $skill_name]);
					if (!isset($skill['assessors'])){
						$skill['assessors'] = [];
					}
					$assessors = $skill['assessors'];
					$total_scores = 0; $total_scorers = 0;
					foreach ($assessors as $assr_id => $assessor){
						if (isset($assessor['usr_assr_score'])){
							$score = $assessor['usr_assr_score'];
							$total_scores += $score;
							$total_scorers++;
						}
					}
					$usr_part_score = 0;
					if ($total_scorers){
						$usr_part_score = doubleval(intval(10 * $total_scores / $total_scorers) / 10.0);
					}
					//echo $usr_part_score;
					//$update = ['$set' => ['profile.activity.$.impression.skills.' . $skill_name . '.usr_part_score' => $usr_part_score ] ];
					$update = ['$set' => [ $path_usr . '.usr_part_score' => $usr_part_score ] ];
					if ($debug) echo "4<br>";
					$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

					// save for (7) usr_final_score calculation
					$this_act_usr_part_score = $usr_part_score;

					/////////////////////////////////////////////////////////////////////////////////////////////////////
					// (5) act_part_scores
					/////////////////////////////////////////////////////////////////////////////////////////////////////
					$act_part_score = $usr_part_score;
					$update =  [ '$set' => [ $path_act	. '.act_part_scores.' . $part_id => $act_part_score ] ];
					if ($debug) echo "5<br>";
					$result = databaseUpdate($database, $col_act, $filters_act, $update);

					/////////////////////////////////////////////////////////////////////////////////////////////////
					// (6) usr_final_score in:
					//	- av. of all (4)s of a skill for ME ONLY
					//	- usr_doc.skills.$.usr_final_score
					/////////////////////////////////////////////////////////////////////////////////////////////////
					$total_final_scores = 0; $total_final_scorers = 0;
					$acts = $usr_doc['profile']['activity'];
					foreach ($acts as $index => $act){
						$skill = getJsonPath($act, ['impression', 'skills', $skill_name]);
						// check for any assessors under this skill
						if (isset($skill['assessors']) && count($skill['assessors']) > 0){
							if ($act['act_id'] == $act_id){
								// get the previous saved part_score
								$score = $this_act_usr_part_score;
							} else if (isset($skill['usr_part_score'])){
								$score = $skill['usr_part_score'];
							} else {
								$score = 0;
							}
							$total_final_scores += floatval($score);
							$total_final_scorers++;
						}
					}
					$usr_final_score = 0;
					if ($total_scorers){
						$usr_final_score = doubleval(intval(10.0 * $total_final_scores / $total_final_scorers) / 10.0);
					}
					if ($debug){
						echo "$total_final_scores / $total_final_scorers = $usr_final_score";
					}


					// method 1: update only the usr_final_score
					$update =  [ '$set' => [ 'skills.' . $skill_name . '.usr_final_score' => $usr_final_score ] ];
					if ($debug){
						echo "6<br>";
						print_json($filters_usr);
						print_json($update);
					}
					$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

					// method 2: update the entire tree
					//$skill = getJsonPath($usr_doc, ['skills', $skill_name]);
					//$skill['usr_part_score'] = $usr_final_score;
					//$update =  [ '$set' => [ 'skills.' . $skill_name => $skill ] ];
					//$result = databaseUpdate($database, $col_usr, ['user_id'=>$part_id], $update);

					// new approach: reusable function calcUsrFinalScore($usr_doc, $skill_name)

					/////////////////////////////////////////////////////////////////////////////////////////////////////
					// (7) skills_combined_score
					//		 av. of all (6)s of a user
					//		(to be done in client side)
					/////////////////////////////////////////////////////////////////////////////////////////////////////

					// calcgs
					calcgs_peruser($part_id, 0);	// alantypoon 20170811

					//////////////////////////////////////////////////
					// (8) return to client (multiple users)
					//////////////////////////////////////////////////
					if (!isset($output['scores'])){
						$output['scores'] = [];
					}
					// actually only my part_id is needed
					//if ($part_id == $assr_id)
					{
						$output['scores'][$part_id] = [
							'usr_part_score' => $usr_part_score,
							'usr_final_score' => $usr_final_score,
						];
					}
				}
			}
		}
	}
*/
}

//////////////////////////////////////////////////

function getImprComment(){

	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_usr, $col_act, $test_qs;

	$act_id = intval(getQS('act_id'));
	$assr_id = intval(getQS('assr_id'));
	$part_id = intval(getQS('part_id'));

	$output['comments'] =
	$output['datetime'] = '';

	$filters = ['impr_comment_id' => "$act_id,$assr_id,$part_id"];
	$options = ['projection' => ['_id' => 0]];
	$comments = databaseRead($database, 'impr_comments', $filters, $options);
	if ($comments && sizeof($comments) > 0){
		$comment = json_decode(json_encode($comments[0]), true);
		$output['comments'] = $comment['comments'];
		$output['datetime'] = $comment['datetime'];
		$output['assr_id'] = $assr_id;
	}
}

/*
usr_doc.profile.activity.$.impression.skills
=============================================
"Communication" : {
	(4) "usr_part_score": 4.5, *
	"assessors": {
		"1" : {
			(1) "usr_assr_score" : 4, *
					"comments" : "Well done!",
					"date" : "2016-11-16 10:00",

act_doc.impression.skills
=========================
"Communication" : {
	(5) "act_part_scores" : {
		"1" : 4.5
	...
	"act_assr_scores": {
		"1,1": {
			(2) "act_assr_score" : 4,
					"comments" : "Well done!",
					"date" : "2016-11-16 10:00",
	...
	(3) "act_assr_completeds" : {
		"1" : 100

usr_doc.skills
===============
"Communication" : {
	"show" : 1,
	(6) "usr_final_score" : 4.8 *

(* has return value to return to the client side)
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
[coordinator]
	L1. skill=1
		L2. part_id=1			(5) act_part_score = (4)													=> act_doc.impression.skills.$.act_part_scores.$part_id
			L3. assr_id=1		(2) act_assr_score																=> act_doc.impression.skills.$.act_assr_scores.$assr_id,$part_id

[assessor]
	L1. skill=1					(3) act_assr_completed = marked (2)/participants	=> act_doc.impression.skills.$.assr_asst_completeds.$assr_id
		L2. part_id=1			(2) act_assr_score = (1)													=> act_doc.impression.skills.$.act_assr_scores.$assr_id,$part_id
											(1) usr_assr_score = directly from marking				=> usr_doc.profile.activity.$.impression.skills.$.assessors.$assr_id

[participant]
	L1. skill=1					(4) usr_part_score = av of all assrs' (1)					=> usr_doc.profile.activity.$.impression.skills.$.usr_part_scores
		L2. assr_id=1			(1) usr_assr_score																=> usr_doc.profile.activity.$.impression.skills.$.assessors.$assr_id

[skills]
	(6) usr_final_score		= av. of all (4)s of a skill for a user					=> usr_doc.skills.$.usr_final_score
	(7) combined_score			= av. of all (6)s of a user
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(1) usr_assr_score			= directly from marking
(2) act_assr_score			= (1)
(3) act_assr_completed	= marked/participants
(4) usr_part_score 			= usr_part_score = av of all assrs' (1)
(5) act_part_score			= (4)
(6) usr_final_score			= av. of all (4)s of a skill for a user
(7) combined_score			= av. of all (6)s of a user
*/


?>
