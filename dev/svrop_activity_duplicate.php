<?php
	function duplicate_act(){

		global $debug_svrop, $input, $output, $error, $database, $user_id,
		 			$col_usr, $col_act, $template_uact_ass_item, $template_uact_skill, $test_qs
		;
		$act_id = intval(getQs('act_id'));

		// find the activity
		$filters = ['act_id' => $act_id];
		$options = ['projection' => ['_id'=> 0]];
		$acts = databaseRead($database, 'activities', $filters, $options);
		if (!sizeof($acts)){

			$error = 'activity not found';

		} else {

			// new act
			$act = $acts[0];
			//print_json($act->title);
			// generate new ids
			$new_act_id = intval(databaseFindAndInc($database, 'sequences', 'act_id'));
			//print_json($act);

			// use new act_id
			$act->act_id = $new_act_id;
			// misc
			$act->coordinator_id = $user_id;
			$act->published = 0;

			// generate another image
			$old_img_id = intval($act->img_id);
			$new_img_id = 0;
			if ($old_img_id > 0){
				$new_img_id = intval(databaseFindAndInc($database, 'sequences', 'img_id'));
				$act->img_id = $new_img_id;
				$imgs = databaseRead($database, 'images', ['img_id' => $old_img_id]);
				if (sizeof($imgs) > 0){
					$img = $imgs[0];
					databaseInsert($database, 'images', ['img_id' => $new_img_id, 'image' => $img->image]);
				}
			}
			//echo "user_id=$user_id<br/>act_id=$new_act_id<br/>old_img_id=$old_img_id new_img_id=$new_img_id";

			/////////////////////////////////////////////////////////
			// clear the unneed data
			/////////////////////////////////////////////////////////
			// participants
			$act->participants = [];

			// skills
			forEach ($act->impression->skills as $skill){
				$skill->act_part_scores = new stdClass();
				$skill->act_assr_scores = new stdClass();
				$skill->act_assr_completeds = new stdClass();
			}

			// assessments
			forEach ($act->assessment->assessments as $ass){
				//forEach ($ass->items as item){
				//}
				$ass->assr_asst_completed = new stdClass();
				$ass->part_asst_marks = new stdClass();
				$ass->assr_asst_marks = new stdClass();
			}

			// media
			$act->media = [];

			// message
			$act->messages = [];

			// allusers
			$act->allusers = getAllUsers2($act);

			// insert the activity
			databaseInsert($database, 'activities', $act);

			////////////////////////////////////////////////////////////////////////
			// copy UACT to client side
			////////////////////////////////////////////////////////////////////////
			$uact = [
				'act_id' => $new_act_id,
				'img_id' => $new_img_id,
				'title' => $act->title,
				'act_type' => $act->act_type,
				'start' => $act->start,
				'end' => $act->end,
				'assessments' => [],
				'impression' => new stdClass(),
				'act_gsscore' => 0,
			];
			$uact = json_decode(json_encode($uact, false));	// convert to avoid non-object error for -> instead of ['']

			//print_json($uact);
			//print_json(jsonclone($act->assessment->assessments));
			$uact->assessments = jsonclone($act->assessment->assessments);;

			// FOR EACH ASST
			foreach ($uact->assessments as $index => $new_asst){
				// remove unneeded
				if (isset($new_asst->start)){
					unset($new_asst->start);
				}
				if (isset($new_asst->end)){
					unset($new_asst->end);
				}
				if (isset($new_asst->desc)){
					unset($new_asst->desc);
				}
				if (isset($new_asst->assr_asst_completed)){
					unset($new_asst->assr_asst_completed);
				}
				if (isset($new_asst->part_asst_marks)){
					unset($new_asst->part_asst_marks);
				}
				if (isset($new_asst->assr_asst_marks)){
					unset($new_asst->assr_asst_marks);
				}
				if (isset($new_asst->saved)){
					unset($new_asst->saved);
				}
			}

			///////////////////////////////////
			// COPY IMPRESSION
			///////////////////////////////////
			// FOR EACH SKILL
			$uact->impression = jsonclone($act->impression);
			foreach ($act->impression->skills as $skill_name => $skill){
				//if (!isset($uact->impression->skills->$skill_name)){
					$uact->impression->skills->$skill_name = jsonclone($template_uact_skill);
				//}
			}
			// set roles
			$assessors_hash = num2hashArr($act->assessors);
			$uact->uact_coordinator = ($act->coordinator_id == $user_id ? 1 : 0);
			$uact->uact_assessor = (isset($assessors_hash[$user_id]) ? 1 : 0);
			$uact->uact_participant = 0;
			$uact->published = 0;

			//print_json($uact);

			// update to the database
			$filters = ['user_id' => $user_id];
			$updates = ['$push' => ['profile.activity' => $uact]];
			//print_json($filters);
			//print_json($updates);
			databaseUpdate($database, 'users', $filters, $updates);

			// return to the client
			$output['new_uact'] = $uact;
		}
	}
?>
