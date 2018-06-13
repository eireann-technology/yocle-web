<?php

function saveAssessment(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_usr, $col_act, $template_uact_ass_item, $test_qs;

	$debug = isset($test_qs);
	
	$act_id = intval(getQS('act_id'));
	$ass_id = intval(getQS('ass_id'));	// if = 0, impression
	$ass_index = $ass_id - 1;
	$role = getQS('role');
	$method = getQS('method');
	//exit($method);
	
	$input = getQS('input');
	$assr_asst_marks = intval(getQS('assr_asst_marks'));
	
	$submitted = getQS('submitted');
	$datetime_now = getDateTime();
	if (gettype($input) == 'string'){
		$input = json_decode($input, true);
	}
	$filters_user = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$filters_act = [ 'act_id' => $act_id, 'assessment.assessments.ass_id' => $ass_id];
	
	switch ($role){
		
		case 'participant':
			$part_id = intval($user_id);
			//////////////////////////////////////////////////////////////////////////////////
			// 0. save date and status
			//		=> user_doc.profile.activity.$.assessments.$.performed
			//////////////////////////////////////////////////////////////////////////////////
			if ($submitted == 1){
				$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.performed' => $datetime_now ] ];
			} else {
				$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.saved' => $datetime_now ] ];
			}
			$result = databaseUpdate($database, $col_usr, $filters_user, $update);
			
			//////////////////////////////////////////////////////////////////////////////////
			// 1. set answers
			//////////////////////////////////////////////////////////////////////////////////
			if ($input){
				
				// clear the previous items
				$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.items' => []]];
				$result = databaseUpdate($database, $col_usr, $filters_user, $update);
			
				// push one by one the new items (answer with media)
				foreach ($input as $ass_item_id => $my_item){
					//print_json($my_item);
					
					$ass_item_index = intval($ass_item_id) - 1;
					$item = jsonclone($template_uact_ass_item);
					$item->ass_item_id = $ass_item_id;
					// 1. ANSWER
					if (isset($my_item['answer'])){
						$item->answer = $my_item['answer'];
					}
					// 2. MEDIA_ID_ARR
					if (isset($my_item['media_id_arr'])){
						$media_id_arr = $my_item['media_id_arr'];
						foreach ($media_id_arr as $index => $media_id){
							$media_id_arr[$index] = intval($media_id);
						}
						$item->media_id_arr = $media_id_arr;
					}
					// 3. MEDIA_ID
					$media_id = 0;
					if (isset($my_item['media_id'])){
						$media_id = intval($my_item['media_id']);
						$item->media_id = $media_id;
					}
					
					// 4. MEDIA_DESC
					if ($media_id && isset($my_item['media_desc'])){
						// FOR PST ONLY
						$media_desc = $my_item['media_desc'];
						$media_desc_hash = [$media_id => $media_desc];
						//$item->media_desc = $media_desc;
						
					} else if (isset($my_item['media_desc_hash'])){
						// FOR REPORT/ESSAY OR ACTIVITY
						$media_desc_hash = $my_item['media_desc_hash'];
					}
					$update = ['$push' => ['profile.activity.$.assessments.' . $ass_index . '.items' => $item]];
					
					if ($debug){
						print_json($filters_user);
						print_json($update);
					}
					
					$result = databaseUpdate($database, $col_usr, $filters_user, $update);
					
					// 3. MEDIA_DESC_HASH
					if (isset($media_desc_hash)){
						saveMediaDesc($media_desc_hash);
					}					
				}
			}
/*
			// save media
			$media_descs = getQs('media_descs');
			//print_json($media_descs);
			foreach ($media_descs as $media_id => $desc){
				$sets = ['$set' => ['desc' => $desc ] ];
				$result = databaseUpdate($database, 'media', ['media_id' => $media_id], $sets);
			}
*/
			break;
			
		case 'assessor':
			$part_id = intval($user_id);
			$assr_id = intval(getQS('assr_id'));
			
			//////////////////////////////////////////////////////////////////////////////////
			// 0. set submitted date
			//		=> user_doc.profile.activity.$.assessments.$.marked
			//////////////////////////////////////////////////////////////////////////////////
			if ($submitted == 1){
				$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.marked' =>  $datetime_now] ];
				$result = databaseUpdate($database, $col_usr, $filters_user, $update);
			}
			////////////////////////////////////////////////////////////////////////////////////////////////////
			// I. UPDATE COLLECTION: USER
			////////////////////////////////////////////////////////////////////////////////////////////////////
			if ($input){
				
				if ($debug){
					//print_json($input);
				}
				
				foreach ($input as $ass_item_id => $marking){

					if ($debug){
						print_json($marking);
					}				
					$set_arr = ['date' => $datetime_now];
					if ($method == 'prt'){
						
						$ass_item_index = intval($ass_item_id) - 1;
						//echo "item_id=$ass_item_id selected=$marking<br/>";
						//
						// selected = directly from client side
						// => user_doc.profile.activity.$.assessments.$.items.$.assessors.$.selected
						//
						$set_arr['selected'] = $marking;
						
					} else if (isset($marking['assr_item_marks'])){
						//
						// assr_item_marks = directly from client side
						// 		=> user_doc.profile.activity.$.assessments.$.items.$.assessors.$.assr_item_marks
						//
						$ass_item_index = intval($ass_item_id) - 1;
						$set_arr['assr_item_marks'] = intval($marking['assr_item_marks']);
						$set_arr['comments'] = $marking['comments'];
					}
					$update = ['$set' => [
											'profile.activity.$.assessments.' . $ass_index . '.items.' . $ass_item_index . '.assessors.' . $assr_id => $set_arr
										]];
					if ($debug){
						print_json($update);
					}
					$result = databaseUpdate($database, $col_usr, $filters_user, $update);
				}
			}
			////////////////////////////////////////////////////////////////////////////////////////////////////
			// UPDATE COLLECTION: ACTIVITY
			////////////////////////////////////////////////////////////////////////////////////////////////////
			if ($method == 'prt'){
				$update = ['$set' => [	'assessment.assessments.$.selecteds.' . $assr_id . ',' . $part_id => $marking ] ];
				$result = databaseUpdate($database, $col_act, $filters_act, $update);
				return;
			}
			//
			// other methods...
			////////////////////////////////////////////////////////////////////////////////////////////////////
			// 2. assr_asst_marks = sum of weighted assr_item_marks	(directly from client side)
			//		=> act_doc.assessment.assessments.$.assr_part.$.assr_asst_marks	
			////////////////////////////////////////////////////////////////////////////////////////////////////
			$update = ['$set' => [	'assessment.assessments.$.assr_asst_marks.' . $assr_id . ',' . $part_id => $assr_asst_marks ] ];
			$result = databaseUpdate($database, $col_act, $filters_act, $update);
			$output['assr_asst_marks'] = $assr_asst_marks;
		
			////////////////////////////////////////////////////////////////////////////////////////////////////
			// read activity from the database
			////////////////////////////////////////////////////////////////////////////////////////////////////
			$options = [ 'participants' => 1, 'assessment.assessments.$' => 1];
			$documents = databaseRead($database, $col_act, $filters_act, $options);
			if ($documents && sizeof($documents) > 0){
				$act_doc = json_decode(json_encode($documents[0]), true);
				
				// find participants
				$num_of_participants = sizeof($act_doc['participants']);
				
				//////////////////////////////////////////////////////////////////////////////////////////
				// 3. assr_asst_completed = marked/participants
				// 		=> act_doc.assessment.assessments.$.assessors.$.assr_asst_completed	
				//////////////////////////////////////////////////////////////////////////////////////////
				//echo '<br><br>3<br>';
				$num_of_marked = 0;
				$assessment = $act_doc['assessment']['assessments'][$ass_index];
				if (isset($assessment['assr_asst_marks'])){
					$marks_arr = $assessment['assr_asst_marks'];
					foreach ($marks_arr as $pair => $marks){
						$arr = explode(",", $pair);
						$assr_id2 = intval($arr[0]);
						$part_id2 = intval($arr[1]);
						if ($assr_id2 == $assr_id){
							$num_of_marked++;
						}
					}
					$assr_asst_completed = intval(100 * $num_of_marked / $num_of_participants);
					if ($assr_asst_completed > 100) $assr_asst_completed = 100;
					// WRITE TO ACTIVITY
					$update =  [ '$set'   => [	'assessment.assessments.$.assr_asst_completed.' . $assr_id => $assr_asst_completed ] ];
					$result = databaseUpdate($database, $col_act, $filters_act, $update);
					$output['assr_asst_completed'] = $assr_asst_completed;
				}
				
				//////////////////////////////////////////////////////////////////////////////////////////
				// 4. part_item_marks
				// 		=> user_doc.profile.activity.$.assessments.$.items.$.part_item_marks
				//////////////////////////////////////////////////////////////////////////////////////////
				//echo '<br><br>4<br>';
				$options = [ 'participants' => 1, 'assessment.assessments.$' => 1];
				// read from users
				$documents = databaseRead($database, $col_usr, $filters_user, $options);
				
				if ($documents && sizeof($documents) > 0){
					$user_doc = json_decode(json_encode($documents[0]), true);
					$activity = getActivityByID($user_doc['profile']['activity'], $act_id);
					$items = $activity['assessments'][$ass_index]['items'];
					//echo "<br><br>***$act_id,$ass_index***<br><br>";
					for ($i = 0; $i < sizeof($items); $i++){
						$item = $items[$i];
						$assessors = $item['assessors'];
						// calc total item_marks
						$total_item_marks = 0; $total_item_markers = 0;
						//for ($j = 0; $j < sizeof($assessors); $j++){
							//$assessor = $assessors[$j];
						foreach ($assessors as $assr_id => $assessor){
							//print_r($assessor);
							if (isset($assessor['assr_item_marks'])){
								$total_item_marks += $assessor['assr_item_marks'];
								$total_item_markers++;
							}
						}
						// write to users
						if ($total_item_markers > 0){
							$part_item_marks = intval($total_item_marks / $total_item_markers);
							$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.items.' . $i . '.part_item_marks' => $part_item_marks]];
							$result = databaseUpdate($database, $col_usr, $filters_user, $update);
						}
					}
				}
				
				////////////////////////////////////////////////////////////////////////////
				// 5. part_asst_marks
				//		=> act_doc.assessment.assessments.$.part_asst_marks.$part_id
				// 		find average of all assr_asst_marks
				////////////////////////////////////////////////////////////////////////////
				//echo '<br><br>5<br>';
				$total_marks = 0;	$total_markers = 0;
				$assessment = $act_doc['assessment']['assessments'][$ass_index];
				if (isset($assessment['assr_asst_marks'])){
					$marks_arr = $assessment['assr_asst_marks'];
					foreach ($marks_arr as $pair => $marks){
						$arr = explode(",", $pair);
						$assr_id2 = intval($arr[0]);
						$part_id2 = intval($arr[1]);
						if ($part_id2 == $part_id){
							$total_marks += intval($marks);
							$total_markers++;
						}
					}
					$part_asst_marks = 0;
					if ($total_markers > 0){
						$part_asst_marks = intval($total_marks / $total_markers);
					}
					// write to activity
					$update = ['$set' => [ 'assessment.assessments.$.part_asst_marks.' . $part_id => $part_asst_marks ] ];
					$result = databaseUpdate($database, $col_act, $filters_act, $update);
					$output['part_asst_marks'] = $part_asst_marks;
				}
			} else {
				$error = 'cannot read assessment';
				
			}
			break;
	}
	//exit();
}

/*

Terminolofy
	assr = assessor
	part = participant
	asst = assessment

user_doc.
profile.
activity.$.
"assessments" : [ 
	{
			"items" : [ 
					{
							"ass_item_id" : 1,
							"part_item_marks" : 80,
							"answer" : "This is a testing answer 1.",
							"assessors" : {
									'4' : {
											"assr_item_marks" : "70"
											"comments" : "GOOD.",
											"date" :... 

act_doc.
"assessment" : {
	"assessments" : [ 
			{
					"ass_id" : 1,
					"assr_asst_completed" : { 
							"1" : 100,
					},
					"part_asst_marks" : {
							"1" : 99
					},
					"assr_asst_marks" : {
							"1,2" : 88
					},

	coordinator
		L1. ass=1
		
			L2. part_id=1			5. part_asst_marks = av. assr_asst_marks...(2)	=> act_doc.assessment.assessments.$.part_asst_marks.$part_id
			
				L3. item_id=0		4. part_item_marks = av. assr_item_marks...(1)	=> user_doc.profile.activity.$.assessments.$.items.$.part_item_marks
					 - assr_id=1	1. assr_item_marks
			
	assessor
		L1. ass=1						3. assr_asst_completed = marked/participants		=> act_doc.assessment.assessments.$.assr_asst_completed.$assr_id
		
			L2. part_id=1			2. assr_asst_marks = sum of w. assr_item_marks	=> act_doc.assessment.assessments.$.assr_asst_marks.$assr_id,$part_id
			
				L3. item_id=1		1. assr_item_marks = directly from markings			=> user_doc.profile.activity.$.assessments.$.items.$.assessors.$assr_id.assr_item_marks
					
	participant
		L1. ass=1						5. part_asst_marks
			L2. item_id=1			4. part_item_marks
				L3. assr_id=1		1. assr_item_marks
		
*/
?>