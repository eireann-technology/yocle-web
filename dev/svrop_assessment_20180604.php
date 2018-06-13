<?php
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
/*
				////////////////////////////////////////////////////////////////////////////
				// 5. part_asst_marks
				//		=> act_doc.assessment.assessments.$.part_asst_marks.$part_id
				// 		find average of all assr_asst_marks
				////////////////////////////////////////////////////////////////////////////
				if ($debug){
					echo "<b>calculating part_asst_marks...</b><br/><br/>";
				}
				$part_asst_marks = 0; $total_marks = 0;	$total_markers = 0;

				// find from activity assr_asst_marks
				$assessment = $act_doc['assessment']['assessments'][$ass_index];
				if (isset($assessment['assr_asst_marks'])){
					$marks_arr = $assessment['assr_asst_marks'];
					//print_json($marks_arr);
					foreach ($marks_arr as $pair => $marks){
						$arr = explode(",", $pair);
						$assr_id2 = intval($arr[0]);
						$part_id2 = intval($arr[1]);
						if ($part_id2 == $part_id){
							if ($debug){
								echo "$assr_id2,$part_id2: $marks<br/>";
							}
							$total_marks += $marks;
							$total_markers++;
						}
					}
				}

				// what if find from user's assr_asst_marks??

				// calc the average
				if ($total_markers > 0){
					$part_asst_marks = getTruncatedScore($total_marks / $total_markers);
				}
				// write to activity
				if ($debug){
					echo "part_asst_marks: $part_asst_marks<br/>";
				}
				$update = ['$set' => [ 'assessment.assessments.$.part_asst_marks.' . $part_id => $part_asst_marks ] ];
				$result = databaseUpdate($database, $col_act, $filters_act, $update);
				$output['part_asst_marks'] = $part_asst_marks;

*/

include "svrop_assessment_resubmit.php";	// 20170912
include "svrop_assessment_updatemarks.php"; //	20180507

function saveAssessment(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_usr, $col_act, $template_uact_ass_item, $test_qs;

	$debug = isset($test_qs);
	//$debug = 0;

	$act_id = intval(getQS('act_id'));
	$ass_id = intval(getQS('ass_id'));	// if = 0, impression
	$ass_index = $ass_id - 1;
	$role = getQS('role');
	$method = getQS('method');
	$input = getQS('input');
	$assr_asst_marks = floatval(getQS('assr_asst_marks'));

	$submitted = getQS('submitted');
	$datetime_now = getDateTime();
	if (gettype($input) == 'string'){
		$input = json_decode($input, true);
	}
	$filters_usr = [ 'user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$filters_act = [ 'act_id' => $act_id, 'assessment.assessments.ass_id' => $ass_id];

	if ($debug){
		print_json([
			'act_id' => $act_id,
			'user_id' => $user_id,
			'ass_id' => $ass_id,
			'role' => $role,
			'method' => $method,
			'input' => $input,
			'assr_asst_marks' => $assr_asst_marks,
			'submitted' => $submitted,
		]);
	}

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
			$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

			//////////////////////////////////////////////////////////////////////////////////
			// 1. set answers
			//////////////////////////////////////////////////////////////////////////////////
			if ($input){

				// clear the previous items
				$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.items' => []]];
				$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

				// push one by one the new items (answer with media)
				foreach ($input as $ass_item_id => $my_item){
					//print_json($my_item);

					$ass_item_index = !$ass_item_id ? 0 : intval($ass_item_id) - 1;
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
						print_json($filters_usr);
						print_json($update);
					}
					$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

					// 3. MEDIA_DESC_HASH
					if (isset($media_desc_hash)){
						saveMediaDesc($media_desc_hash);
					}
				}
			}

			// save submitted status to part_asst_marks
			if ($submitted == 1){
				$update = ['$set' => [ 'assessment.assessments.$.part_asst_marks.' . $part_id => 'submitted' ] ];
				$result = databaseUpdate($database, $col_act, $filters_act, $update);
			}
			break;

		case 'assessor':
			$part_id = intval($user_id);
			$assr_id = intval(getQS('assr_id'));

			//////////////////////////////////////////////////////////////////////////////////
			// 1. set submitted date
			//		=> user_doc.profile.activity.$.assessments.$.marked
			//////////////////////////////////////////////////////////////////////////////////
			if ($submitted == 1){
				$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.marked' =>  $datetime_now] ];
				$result = databaseUpdate($database, $col_usr, $filters_usr, $update);
			}

			////////////////////////////////////////////////////////////////////////////////////////////////////
			// 2. UPDATE COLLECTION: USER
			////////////////////////////////////////////////////////////////////////////////////////////////////
			// FOR THE INPUT
			if (obj_count($input)){

				if ($method == 'prt'){
					////////////////////////////////////////////
					// PARTICIPATION
					////////////////////////////////////////////
					// generate unique prt_item_ids
					//foreach ($input as $item_index => $item){
					//foreach ($input as $ass_item_id => $marking){
					for ($i =0; $i < sizeof($input); $i++){
						$item = $input[$i];
						$prt_item_id = 0;
						if (!isset($item['prt_item_id']) || !$item['prt_item_id']){
							$prt_item_id = $input[$i]['prt_item_id'] = intval(databaseFindAndInc($database, 'sequences', 'prt_item_id'));
						}
						// ass_item_id correct the datatype to intval
						$ass_item_id = 0;
						if (isset($item['ass_item_id'])){
							$ass_item_id = $input[$i]['ass_item_id'] = intval($input[$i]['ass_item_id']);
						}

						if ($debug){
							echo "<b>ass_item_id=$ass_item_id prt_item_id=$prt_item_id</b><br/>";
							print_json($item);
						}
					}


					//print_json($input);
					// prepare dummy assessor
					$assessor = [
						'items' => $input,
						'assr_asst_marks' => $assr_asst_marks,
						'date' => $datetime_now,
					];
					$update = ['$set' => [
						'profile.activity.$.assessments.' . $ass_index . '.assessors.' . $assr_id => $assessor
					]];
					//if ($debug){
					//	print_json($filters_usr);
					//	print_json($update);
					//}
					$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

				} else {

					////////////////////////////////////////////
					// OTHER METHODS
					////////////////////////////////////////////

					//foreach ($input as $ass_item_id => $marking){
					for ($i =0; $i < sizeof($input); $i++){
						$item = $input[$i];
						if (!isset($item['ass_item_id'])){
							continue;
						}
						$ass_item_id = intval($item['ass_item_id']);
						$ass_item_index = $ass_item_id - 1;
						if ($debug){
							echo "<b>Updating ass_item_id=$ass_item_id for user...</b><br/>";
							print_json($item);
						}
						$set_arr = [
							'date' => $datetime_now
						];
						// write to partcipant's document
						if ($method != 'mcq'){
							// ADD RUBRICS FOR METHODS OTHER THAN MCQ & PRT (& SUR?)
							$assr_rubrics_indexes = isset($item['assr_rubrics_indexes']) ? $item['assr_rubrics_indexes'] : [];
							foreach ($assr_rubrics_indexes as $index => $value){
								$assr_rubrics_indexes[$index] = intval($value);
							}
							$set_arr['assr_rubrics_indexes'] = $assr_rubrics_indexes;
						}
						$set_arr['comments'] = isset($item['comments']) ? $item['comments'] : '';
						$set_arr['assr_item_marks'] = isset($item['assr_item_marks']) ? floatval($item['assr_item_marks']) : '';
						$update = ['$set' => [
							'profile.activity.$.assessments.' . $ass_index . '.items.' . $ass_item_index . '.assessors.' . $assr_id => $set_arr
						]];
						if ($debug){
							print_json($filters_usr);
							print_json($update);
						}
						$result = databaseUpdate($database, $col_usr, $filters_usr, $update);
					}
				}
			}

			////////////////////////////////////////////////////////////////////////////////////////////////////
			// 3. UPDATING ASSR_ASST_MARKS
			//		assr_asst_marks = sum of weighted assr_item_marks	(directly from client side)
			//		=> act_doc.assessment.assessments.$.assr_part.$.assr_asst_marks
			////////////////////////////////////////////////////////////////////////////////////////////////////
			//$update = ['$set' => [	'assessment.assessments.$.assr_asst_marks.' . $assr_id . ',' . $part_id => $assr_asst_marks ] ];
			//$result = databaseUpdate($database, $col_act, $filters_act, $update);
			//$output['assr_asst_marks'] = $assr_asst_marks;

			////////////////////////////////////////////////////////////////////////////////////////////////////
			// 4. Read activity from the database
			////////////////////////////////////////////////////////////////////////////////////////////////////
			//$options = [ 'participants' => 1, 'assessment.assessments.$' => 1];
			$options = [ 'projection' => ['_id' => 0, 'participants' => 1, 'assessment.assessments' => 1] ];
			$documents = databaseRead($database, $col_act, $filters_act, $options);
			if ($documents && sizeof($documents) > 0){
				$act_doc = json_decode(json_encode($documents[0]), true);

				// find participants
				$num_of_participants = sizeof($act_doc['participants']);

				//////////////////////////////////////////////////////////////////////////////////////////
				// 5. assr_asst_completed = marked/participants
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
					//$assr_asst_completed = intval(100 * $num_of_marked / $num_of_participants);
					//if ($assr_asst_completed > 100) $assr_asst_completed = 100;
					$assr_asst_completed = $num_of_marked;
					// WRITE TO ACTIVITY
					$update =  [ '$set'   => [	'assessment.assessments.$.assr_asst_completed.' . $assr_id => $assr_asst_completed ] ];
					$result = databaseUpdate($database, $col_act, $filters_act, $update);
					$output['assr_asst_completed'] = $assr_asst_completed;
					$output['nassessee'] = $num_of_participants;
				}

				//////////////////////////////////////////////////////////////////////////////////////////
				// 6. part_item_marks and assr_asst_marks
				// 		=> user_doc.profile.activity.$.assessments.$.items.$.part_item_marks
				//////////////////////////////////////////////////////////////////////////////////////////
				if ($method == 'prt'){
					updateAssrItem($part_id, $act_id, $ass_id, $assr_id);
				} else {
					$act_ass_items = isset($assessment['items']) ? $assessment['items'] : [];
					updateItemAssr($part_id, $act_id, $ass_id, $assr_id, $act_ass_items);
				}
				// calcgs
				if ($submitted == 1){
					calcgs_peruser($part_id, 0);	// alantypoon 20170811
				}
			} else {
				$error = 'cannot read assessment';

			}
			break;
	}
	//exit();
	//$update = ['$set' => [	'assessment.assessments.$.assr_asst_marks.' . $assr_id . ',' . $part_id => $assr_asst_marks ] ];
	//$result = databaseUpdate($database, $col_act, $filters_act, $update);
	//$output['assr_asst_marks'] = $assr_asst_marks;

	////////////////////////////////////////////////
	// read uass to the client side
	////////////////////////////////////////////////
	$options = [ 'projection' => ['_id' => 0, 'profile.activity.$.assessment.assessments' => 1] ];
	$users = databaseRead($database, $col_usr, $filters_usr, $options);
	if ($users && sizeof($users) > 0){
		$user = json_decode(json_encode($users[0]), true);
		$uass = $user['profile']['activity'][0]['assessments'][$ass_index];
		//print_json($uass);
		$output['uass'] = $uass;
	}
}

?>
