<?php

function getMyPeerAssesseesArr(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_act, $col_usr, $test_qs;

	$debug = isset($test_qs);;

	$arr = [];
	$act_id = intval(getQs('act_id'));

	// 1. read activity
	$acts = databaseRead($database, $col_act, ['act_id' => $act_id]);
	if ($acts && sizeof($acts) > 0){
		$act = json_decode(json_encode($acts[0]), false);
	} else {
		$error = "cannot find activity act_id=$act_id";
		return;
	}
	//print_json($act);	exit();

	// 2. find participants
	$participants = $act->participants;
	//print_json($participants);

	// 3. find part array
	$part_arr = [];
	foreach ($participants as $index => $part_id){
		$part_id = intval($part_id);
		$filters = [
			'user_id' => $part_id,
			'profile.activity.act_id' => $act_id,
		];
		$options = [
			'projection' => [
				'_id' => 0,
				'profile.activity.$' => 1
			],
		];
		// read particiant
		$users = databaseRead($database, $col_usr, $filters, $options);
		if ($users && sizeof($users) > 0){
			$part_arr[$part_id] = json_decode(json_encode($users[0]), false);
		} else {
			$error = "cannot find participant part_id=$part_id with act_id=$act_id";
			//return;
		}
	}

	//if ($debug){
		//print_json($act->impression->panelists->peers);
		//print_json($part_arr);
	//}

	/////////////////////////////////////////////////////////////////////
	// 4. for impression
	/////////////////////////////////////////////////////////////////////
	if (strcmp($act->impression->panelists->peers, "all") == 0){

		// check from act
		$arr[0] = jsonclone($participants);

	} else {

		$arr[0] = [];

		// check from uact
		foreach ($part_arr as $part_id => $part){
			if (isset($part->profile->activity[0])){
				$uact = $part->profile->activity[0];
				//print_json($uact);
				$uact_id = $uact->act_id;
				// add assesseees id to result
				if (isset($uact->impression->panelists->peer_assessors)){
					$assessors = $uact->impression->panelists->peer_assessors;
					if (in_array($user_id, $assessors)){
						array_push($arr[0], intval($part_id));
					}
				}
			}
		}
	}

	/////////////////////////////////////////////////////////////////////
	// 5. for assessments
	/////////////////////////////////////////////////////////////////////
	foreach ($act->assessment->assessments as $ass_index => $asst){
		$ass_id = intval($asst->ass_id) + '';
		if (strcmp($asst->panelists->peers, "all") == 0){
			$arr[$ass_id] = jsonclone($participants);
		} else {
			// add assesseees id to result
			$arr[$ass_id] = [];
			foreach ($part_arr as $part_id => $part){
				if (isset($part->profile->activity[0])){
					$uact = $part->profile->activity[0];
					if (isset($uact->assessments) && isset($uact->assessments[$ass_index])){
						$uasst = $uact->assessments[$ass_index];
						if (isset($uasst->panelists->peer_assessors)){
							$assessors = $uasst->panelists->peer_assessors;	// sometimes the peer_assessors is string
							if (in_array($user_id, $assessors)){
								array_push($arr[$ass_id], intval($part_id));
							}
						}
					}
				}
			}
		}
	}
	//print_json($act->assessment->assessments);
	//exit();
	if ($debug){
		print_json($arr);
	}
	$output['arr'] = $arr;
}

?>
