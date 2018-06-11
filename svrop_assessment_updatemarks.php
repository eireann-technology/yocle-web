<?php

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function deleteRubric(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act, $col_usr, $test_qs;

	$assr_id = intval(getQS('assr_id'));
	$part_id = intval(getQS('part_id'));
	$act_id = intval(getQS('act_id'));
	$ass_id = intval(getQS('ass_id'));
	//$item_id = intval(getQs('item_id'));
	$prt_item_id = intval(getQs('prt_item_id'));
	$ass_index = intval($ass_id) - 1;
	//$item_index = intval($item_id) - 1;

	$debug = isset($test_qs);

	// remove assessor comment
	$filters = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
	$updates = ['$pull' => [	'profile.activity.$.assessments.' . $ass_index . '.assessors.' . $assr_id . '.items' => ['prt_item_id' => $prt_item_id] ] ];
	if ($debug){
		print_json([
			'act_id' => $act_id,
			'ass_id' => $ass_id,
			'assr_id' => $assr_id,
			'part_id' => $part_id,
			'ass_index' => $ass_index,
			'prt_item_id' => $prt_item_id,
			'filters' => $filters,
			'updates' => $updates,
		]);
	}
	$documents = databaseUpdate($database, $col_usr, $filters, $updates);
	updateAssrItem($part_id, $act_id, $ass_id, $assr_id);
}

/////////////////////////////////////////////////////////////////////////////////////////////

function eraseAllAssrAsstMarksForThisPart($act_id, $ass_id, $part_id){
	global $database, $error, $col_act, $col_usr, $test_qs;
	$debug = isset($test_qs);
	$ass_index = $ass_id - 1;

	// ERASE ALL THE ASST MARKS FOR THIS PART IN THIS ASSESSMENT IN THE ACT COLLECTION
	$filters_act = ['act_id' => $act_id, 'assessment.assessments.ass_id' => $ass_id];
	$options = [ 'projection' => ['_id' => 0, 'assessment.assessments' => 1] ];
	//print_json($filters_act);
	//print_json($options); exit();

	$acts = databaseRead($database, $col_act, $filters_act, $options);
	if ($acts && sizeof($acts) > 0){
		$act = json_decode(json_encode($acts[0]), true);
		$asst = $act['assessment']['assessments'][$ass_index];
		$assr_asst_marks_obj = isset($asst['assr_asst_marks']) ? $asst['assr_asst_marks'] : [];
		if ($debug){
			echo "<h3>eraseAllAssrAsstMarksForThisPart1...</h3>";
			print_json($assr_asst_marks_obj);
		}

		$update = [];
		if (isset($assr_asst_marks_obj) && obj_count($assr_asst_marks_obj) > 0){
			// FILTER OUT ALL RELATING TO THIS PART_ID
			foreach ($assr_asst_marks_obj as $pair => $marks){
				//echo "$pair: $marks<br/>";
				$arr = explode(",", $pair);
				$assr_id2 = intval($arr[0]);
				$part_id2 = intval($arr[1]);
				if ($part_id2 == $part_id){
					unset($assr_asst_marks_obj[$pair]);
				}
			}
		}
		if ($debug){
			echo "<h3>eraseAllAssrAsstMarksForThisPart2...</h3>";
			print_json($assr_asst_marks_obj);
		}
		// to be updated later
/*
		if (isset($assr_asst_marks_obj) && obj_count($assr_asst_marks_obj) > 0){
			// add
			$update = ['$set' => ['assessment.assessments.$.assr_asst_marks' => $assr_asst_marks_obj] ];
		} else {
			// remove
			$update = ['$unset' => ['assessment.assessments.$.assr_asst_marks' => []] ];
		}
		// WRITE TO ACT COLLECTION
		if ($debug){
			echo "<h3>eraseAllAssrAsstMarksForThisPart2...</h3>";
			print_json($filters_act);
			print_json($update);
		}
		$result = databaseUpdate($database, $col_act, $filters_act, $update);
*/
	}
	return $assr_asst_marks_obj;
}

/////////////////////////////////////////////////////////////////////////////////////

function updateAssrItem($part_id, $act_id, $ass_id, $assr_id){
	global $database, $error, $col_act, $col_usr, $test_qs, $output;
	$debug = isset($test_qs);

	if ($debug){
		echo "updateAssrItem: part_id=$part_id act_id=$act_id ass_id=$ass_id assr_id=$assr_id<br/>";
	}

	// 1. ERASE ALL ASSR ASST MARKS FROM ACT FIRST
	$assr_asst_marks_obj = eraseAllAssrAsstMarksForThisPart($act_id, $ass_id, $part_id);

	// 2. SET LOCAL VARIABLES
	$part_asst_marks = 0;
	$ass_index = $ass_id - 1;
	$filters_usr = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
	$filters_act = ['act_id' => $act_id, 'assessment.assessments.ass_id' => $ass_id];

	// 3. FIND ALL ASSR MARKS BY ITEM MARKS
	$total_assr_marks = 0;
	$assr_count = 0;
	$options = [ 'projection' => ['_id' => 0, 'profile.activity.$' => 1]];
	$users = databaseRead($database, $col_usr, $filters_usr, $options);
	if ($users && sizeof($users) > 0){
		$user = json_decode(json_encode($users[0]), false);
		$ass = $user->profile->activity[0]->assessments[$ass_index];

		// FIND THE AVERAGE OF ALL ASSESSOR
		$assessors = $ass->assessors;
		$my_assr_asst_marks = 0;
		foreach ($assessors as $assr_id2 => $assessor){
			if ($debug){
				echo "assr_id: $assr_id2 <br/>";
			}
			// find the average of all items
			$total_item_marks = 0;
			$item_count = 0;
			foreach ($assessor->items as $item_index => $item){
				if (isset($item->assr_item_marks)){
					// item_marks
					$assr_item_marks = $item->assr_item_marks;
					//$assr_item_marks = getTruncatedScore($assr_item_marks);	// useless, already done
					if ($debug){
						echo "&nbsp;&nbsp;&nbsp;assr_item_marks: $assr_item_marks <br/>";
					}
					$total_item_marks += $assr_item_marks;
				}
				$item_count++;
			}
			if ($item_count){
				// MARKED NOW
				$assr_asst_marks = getTruncatedScore($total_item_marks / $item_count);
				if ($debug){
					echo "&nbsp;&nbsp;&nbsp;***assr_asst_marks: $assr_asst_marks <br/><br/>";
				}
				$total_assr_marks += $assr_asst_marks;
				$assr_count++;

				// UPDATE THE ASST MARKS IN THE USER COLLECTION
				if ($assr_id2 == $assr_id){
					// update to usr
					$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.assessors.' . $assr_id . '.assr_asst_marks' => $assr_asst_marks] ];
					databaseUpdate($database,  $col_usr, $filters_usr, $update);
					// update to client
					$my_assr_asst_marks = $assr_asst_marks;
				}
				$assr_asst_marks_obj[$assr_id2 . ',' . $part_id] = $assr_asst_marks;
			}
		}

		// UPDATE THE ASST MARKS IN THE ACT COLLECTION
		if (!obj_count($assr_asst_marks_obj)){
		//	$update = ['$unset' => ['assessment.assessments.$.assr_asst_marks' => ''] ];
		} else {
			$update = ['$set' => ['assessment.assessments.$.assr_asst_marks' => $assr_asst_marks_obj] ];
			if ($debug){
				echo "<h3>update assr_asst_marks in act...</h3>";
				print_json($filters_act);
				print_json($update);
			}
			$result = databaseUpdate($database, $col_act, $filters_act, $update);
		}

		// UPDATE TO CLIENT
		$output['my_assr_asst_marks'] = $my_assr_asst_marks;

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		// SUMARY OF MARKS
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		if (!$assr_count){
			///////////////////////////
			// NONE OF ASSESSOR
			///////////////////////////
			// remove all the assessors from the usr collection
			$update = ['$unset' => ['profile.activity.$.assessments.' . $ass_index . '.assessors' => '' ] ];
			$result = databaseUpdate($database, $col_usr, $filters_usr, $update);

			// remove past_asst_marks from the act collection
			$update = ['$unset' => ['assessment.assessments.$.part_asst_marks.' . $part_id => '' ] ];
			$result = databaseUpdate($database, $col_act, $filters_act, $update);

		} else {
			///////////////////////////
			// ANY ASSR
			///////////////////////////
			// FIND PART_ASST_MARKS
			$part_asst_marks = getTruncatedScore($total_assr_marks / $assr_count);
			if ($debug){
				echo "***part_asst_marks: $total_assr_marks/$assr_count = $part_asst_marks <br/>";
			}
			// UPDATE PART MARKS
			$update = ['$set' => [ 'assessment.assessments.$.part_asst_marks.' . $part_id => $part_asst_marks ] ];
			$result = databaseUpdate($database, $col_act, $filters_act, $update);
		}
		$output['part_asst_marks'] = $part_asst_marks;

	}
}

//////////////////////////////////////////////////////////////////////////////////

function updateItemAssr($part_id, $act_id, $ass_id, $assr_id, $act_ass_items){
	global $database, $error, $col_act, $col_usr, $test_qs, $output;
	$debug = isset($test_qs);

	if ($debug){
		echo "<b>updateItemAssr: part_id=$part_id  act_id=$act_id  ass_id=$ass_id  assr_id=$assr_id</b><br/>";
		print_json($act_ass_items);
	}

	// 1. ERASE ALL ASSK ASST MARKS FROM ACT FIRST
	$assr_asst_marks_obj = eraseAllAssrAsstMarksForThisPart($act_id, $ass_id, $part_id);

	// 2. SET LOCAL VARIABLES
	$part_asst_marks = 0;
	$ass_index = $ass_id - 1;
	$filters_usr = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
	$filters_act = ['act_id' => $act_id, 'assessment.assessments.ass_id' => $ass_id];

	// 3. FIND ALL ASSR MARKS BY ITEM MARKS
	$options = [ 'projection' => ['_id' => 0, 'profile.activity.$.assessment.assessments' => 1] ];
	$users = databaseRead($database, $col_usr, $filters_usr, $options);
	if ($users && sizeof($users) > 0){
		$user = json_decode(json_encode($users[0]), true);

		// find uact
		$uact = getActivityByID($user['profile']['activity'], $act_id);

		// FIND ASSESSMENT ITEM
		$items = $uact['assessments'][$ass_index]['items'];

		///////////////////////////////////////////////////////////
		// LOOP1: ADDING NEW INPUT TO THE DATABASE
		//////////////////////////////////////////////////////////
		if ($debug){
			echo "<h1>Loop 1: adding new input to user...</h1>";
		}
		$total_item_marks = 0;
		$item_count = 0;
		$ass_item_id = 1;
		for ($i = 0; $i < sizeof($items); $i++){
			$item = $items[$i];
			if (!isset($item['ass_item_id'])){
				if ($debug){
					echo "old notation1: forget it<br/>";
					print_json($item);
				}
				continue;
			}
			// new notation:
			$item['ass_item_id'] = $ass_item_id;
			$ass_item_index = $ass_item_id - 1;

			if ($debug){
				echo "<b>Loop 1.$i updating uact item_id=$ass_item_id item_index=$ass_item_index...</b>";
				print_json($item);
			}
			if (!isset($item['assessors'])){
				$item['assessors'] = [];
			}
			$assessors = $item['assessors'];

			// FOR EACH ASSESSOR
			$total_assr_marks = 0;
			$assr_count = 0;

			// assessors
			if (isset($assessors)){
				foreach ($assessors as $assr_id2 => $assessor){
					// CALC TOTAL ITEM_MARKS
					if (isset($assessor['assr_item_marks'])){
						$assr_item_marks = $assessor['assr_item_marks'];
						$assr_item_marks = getTruncatedScore($assr_item_marks);
						//if ($debug){
						//	echo "&nbsp;&nbsp;&nbsp;$assr_id: $assr_item_marks<br/>";
						//}
						$total_assr_marks += $assr_item_marks;
					}
					$assr_count++;
				}
			}
			// UPDATE USER
			if (!$assr_count){
				// NONE OF ASSESSOR: remove all the assessors from the user collection
				$update = ['$unset' => ['profile.activity.$.assessments.' . $ass_index . '.items.' . $ass_item_index . '.assessors' => '']];
			}	else {
				// UPDATE PART MARKS IN USER COLLECTION
				$part_item_marks = $total_assr_marks / $assr_count;
				$part_item_marks = getTruncatedScore($part_item_marks);
				//if ($debug){
				//	echo "&nbsp;&nbsp;&nbsp;part_item_marks: $part_item_marks<br/>";
				//}
				$total_item_marks += $part_item_marks;
				$item_count++;
				$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.items.' . $ass_item_index . '.part_item_marks' => $part_item_marks]];
			}
			if ($debug){
				print_json($filters_usr);
				print_json($update);
			}
			$result = databaseUpdate($database, $col_usr, $filters_usr, $update);
			$ass_item_id++;
		}

		///////////////////////////////////////////////////////////
		// LOOP2: REORDER TO ASSESSOR->ITEM FOR ASSR_ASST_MARKS
		//////////////////////////////////////////////////////////
		if ($debug){
			echo "<h1>Loop 2: Reorder item->assessor to assessor->item for assr_asst_marks</h1>";
			print_json($items);
		}
		$new_assessors = [];
		$ass_item_id = 1;
		for ($i = 0; $i < sizeof($items); $i++){
			$item = $items[$i];
			if (!isset($item['ass_item_id'])){
				if ($debug){
					echo "old notation2: forget it<br/>";
					print_json($item);
				}
				continue;
			}
			$ass_item_index = $ass_item_id - 1;
			if ($debug){
				echo "<b>LOOP#2.$i: item_id: $ass_item_id item_index: $ass_item_index</b><br/>";
				echo "item->assessor<br/>";
				print_json($item);
			}
			if (!isset($item['assessors'])){
				$item['assessors'] = [];
			}
			$assessors = $item['assessors'];
			foreach ($assessors as $assr_id2 => $assessor){
				if (!isset($new_assessors[$assr_id2])){
					$new_assessors[$assr_id2] = [
						'items' => [],
					];
				}
				if (isset($item['assessors'][$assr_id2])){
					$item2 = jsonclone($item['assessors'][$assr_id2]);
					$item2->ass_item_id = $ass_item_id;
					array_push($new_assessors[$assr_id2]['items'], jsonclone($item2));
				}
				if ($debug){
					echo "assessor->item<br/>";
					print_json($new_assessors[$assr_id2]);
				}
			}
			$ass_item_id++;
		}
		if ($debug){
			echo "<b>new_assessors</b><br/>";
			print_json($new_assessors);
		}

		// reading the weights from act

		// ACT_MARKS_OBJ
		$assr_asst_marks = 0;
		$my_assr_asst_marks = 0;
		foreach ($new_assessors as $assr_id2 => $new_assessor){
			$nitem = sizeof($new_assessor['items']);
			foreach ($new_assessor['items'] as $item){
				if ($debug){
					print_json($item);
				}
				if (!isset($item->assr_item_marks)){
					$item->assr_item_marks = 0;
				}
				$ass_item_id = intval($item->ass_item_id);
				$ass_item_index = $ass_item_id - 1;

				// calc weight
				if (isset($act_ass_items[$ass_item_index]) && isset($act_ass_items[$ass_item_index]['weight'])){
					$ass_item_weight = intval($act_ass_items[$ass_item_index]['weight']) / 100;
				} else {
					$ass_item_weight = 1 / $nitem;
				}
				$assr_item_marks = floatval($item->assr_item_marks);
				$assr_item_marks = getTruncatedScore($assr_item_marks);
				$item_marks = $assr_item_marks * $ass_item_weight;
				$assr_asst_marks += $item_marks;
				if ($debug){
					echo "item_marks (with weight): $assr_item_marks * $ass_item_weight = $item_marks<br>";
				}
			}
			$assr_asst_marks = getTruncatedScore($assr_asst_marks);
			$assr_asst_marks_obj[$assr_id2 . ',' . $part_id] = $assr_asst_marks;
			if ($assr_id2 == $assr_id){
				$my_assr_asst_marks = $assr_asst_marks;
			}
			if ($debug){
				echo "<b>assr_asst_marks: $assr_asst_marks</b><br>";
			}

		}

		// UPDATE THE ASST MARKS IN THE ACT COLLECTION
		//echo "haha";
		//print_json($assr_asst_marks_obj);
		if (!obj_count($assr_asst_marks_obj)){
			//$update = ['$unset' => ['assessment.assessments.$.assr_asst_marks' => ''] ];
		} else {
			$update = ['$set' => ['assessment.assessments.$.assr_asst_marks' => $assr_asst_marks_obj] ];
			if ($debug){
				echo "<h3>update assr_asst_marks in act...</h3>";
				print_json($filters_act);
				print_json($update);
			}
			$result = databaseUpdate($database, $col_act, $filters_act, $update);
		}

		// UPDATE TO CLIENT (USED CLIENT'S ONE)
		$output['my_assr_asst_marks'] = $my_assr_asst_marks;

		////////////////////////////////////////////////////////////////////////////////////////////////////////
		// SUMARY OF MARKS
		////////////////////////////////////////////////////////////////////////////////////////////////////////
		$part_asst_marks = 0;
		if (!$item_count){
			// REMOVE PART ASST MARKS
			$update = ['$unset' => ['assessment.assessments.$.part_asst_marks.' . $part_id => '' ] ];
		} else {
			// UPDATE PART ASST MARKS
			$part_asst_marks = $total_item_marks/$item_count;
			$part_asst_marks = getTruncatedScore($part_asst_marks);
			if ($debug){
				echo "***part_asst_marks: $total_item_marks (total_item_marks) / $item_count (item_count) = $part_asst_marks <br/>";
			}
			$update = ['$set' => [ 'assessment.assessments.$.part_asst_marks.' . $part_id => $part_asst_marks ] ];
		}
		if ($debug){
			echo "<h3>update part_asst_marks in act...</h3>";
			print_json($filters_act);
			print_json($update);
		}
		$result = databaseUpdate($database, $col_act, $filters_act, $update);
		$output['part_asst_marks'] = $part_asst_marks;
	}
}
?>
