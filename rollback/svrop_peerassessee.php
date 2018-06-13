<?php

function getPeerAssessee(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_act, $col_usr;
	
	$debug = 1;
	
	$results = [
		'impression' => [],
		'assessments' => [],
	];
	$act_id = intval(getQs('act_id'));	
	
	// 1. read activity
	$documents = databaseRead($database, $col_act, ['act_id' => $act_id]);
	if ($documents && sizeof($documents) > 0){
		$activity = json_decode(json_encode($documents[0]), false);
	} else {
		$error = "cannot find activity act_id=$act_id";
		return;
	}
	//print_json($activity);	exit();
	
	// 2. find participants
	$participants = $activity->participants;
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
		
		$documents = databaseRead($database, $col_usr, $filters, $options);
		if ($documents && sizeof($documents) > 0){
			$part_arr[$part_id] = json_decode(json_encode($documents[0]), false);
		} else {
			$error = "cannot find participant part_id=$part_id";
			return;
		}
	}
	
	// 3. for impression
	//		- for each particiant
	//		- check if there is my user_id
	foreach ($part_arr as $part_id => $part){
		
		// find the only activity
		if (isset($part->profile->activity[0])){
			$act = $part->profile->activity[0];
			$act_id = $act->act_id;
			
			//////////////////////////////////////////////////////////////////////
			// 1. check impression assessors
			//////////////////////////////////////////////////////////////////////
			if (isset($act->impression->panelists->peer_assessors)){
				$assessors = $act->impression->panelists->peer_assessors;
				if (in_array($user_id, $assessors)){
					// add to results
					array_push($results['impression'], $part_id);
				}
			}
			
			//////////////////////////////////////////////////////////////////////
			// 2. check assessment assessors
			//////////////////////////////////////////////////////////////////////
			foreach ($act->assessments as $ass_index => $ass){
				if (!isset($ass->ass_id)){
					wlog('error no ass_id');
					continue;
				}
				// IS IT SUBMITTED(PERFORMED)?
				if (isset($ass->performed) && $ass->performed != '')
				{

					$ass_id = $ass->ass_id;
										
					if (isset($ass->panelists->peer_assessors)){
						
						// assessors
						$assessors = $ass->panelists->peer_assessors;	// sometimes the peer_assessors is string
						
						// convert string to number
						foreach ($assessors as $index2 => $assr_id2){
							$assessors[$index2] = intval($assr_id2);
						}
						
						// add to results
						if (in_array($user_id, $assessors)){
							if (!isset($results['assessments'][$ass_id])){
								$results['assessments'][$ass_id] = [];
							}
							array_push($results['assessments'][$ass_id], $part_id);
						}
					}
				}
			}
		}
	}
	//print_json($results);
	$output['results'] = $results;
}

?>