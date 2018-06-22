<?php

//define('DEBUG_CALCGS', 0);

function calcgs_test($user_id = 0){
	global $database, $col_usr, $col_act;

	// calcgs for all users
	$filters = [];
	if (!$user_id){
		$user_id = intval(getQs('user_id'));
	}
	if ($user_id){
		$filters = ['user_id' => $user_id];
	}
	$options = ['projection' => ['_id'=> 0,
		'user_id' => 1,
	]];
	$users = databaseRead($database, $col_usr, $filters, $options);
	forEach ($users as $user){
		$user_id = $user->user_id;
		$debug = 0;
		$gs_scores = calcgs_peruser($user_id, $debug);
		echo "User #$user_id<br/>";
		print_json($gs_scores);
	}
}

////////////////////////////////////////////////////////////////////////////////

function calcgs_peruser($user_id, $debug){
	global $database, $col_usr, $col_act;

	$user_gsscore_raw = [];

	// read from database?
	if ($debug){
		echo "<style>.marks{color:red;}.calcgs_skill{display:inline; padding:8px; }</style>";
	}
	$user_id = intval($user_id);
	// loop thru all the assessments in all the activities
	$user = 0;
	$filters = ['user_id' => $user_id];
	$options = ['projection' => ['_id'=> 0,
		'user_id' => 1,
		'username' => 1,
		'skills' => 1,
		'impression.skills' => 1,
		'profile.activity' => 1,
	]];

	$documents = databaseRead($database, $col_usr, $filters, $options);
	if (sizeof($documents)){

		$user = json_decode(json_encode($documents[0]), FALSE);

		// process this user
		if ($debug){
			echo "User #$user_id $user->username <br/>";
		}
		// process activities
		$total_gsscore = 0;
		$uacts = $user->profile->activity;
		forEach ($uacts as $uact){

			$act_id = $uact->act_id;
			if ($debug){
				echo $act_id . "<br/>";
			}

			//if ($act_id != 131 && $act_id != 85 && $act_id != 94) continue; // for dummy data only

			$act_gsscore_hash = [];
			$act_gsscore = getActGsScore($user_gsscore_raw, $act_gsscore_hash, $user_id, $uact, $debug);
			$total_gsscore += $act_gsscore;
			//if ($debug){
				//echo $act_gsscore . "<br/>";
			//}

			// UPDATE DATABASE: user.uact.act_skills & act_gsscore
			$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
			$sets = [
					'profile.activity.$.act_skills' => $act_gsscore_hash,
					'profile.activity.$.act_gsscore' => $act_gsscore,
			];
			databaseUpdate($database, $col_usr, $filters, ['$set' => $sets]);
		}

		// AV. GS SCORE
		$user_gsscore1 = !$uacts ? 0 : round($total_gsscore / count($uacts), 2);
		if ($debug){
			echo "<li>User gsscore1 (calc from the activities) = <b class='marks'>$user_gsscore1</b></li>";
		}
		// EACH SKILL SCORE
		//print_json($user_gsscore_raw);
		$user_gsscore_hash = [];
		$user_gsscore2 = getGsScore($user_gsscore_raw, $user_gsscore_hash);
		//print_json($user_gsscore_hash);

		// DEBUG
		if ($debug){
			echo "<li>User gsscore2 (calculated from the skills) = <b class='marks'>$user_gsscore2</b></li>";
		}
		//print_json($user_gsscore_raw);

		// create new skills
		$old_skills = $user->skills;
		$new_skills = [];
		forEach ($user_gsscore_hash as $skill_name => $skill_stars){
			//print_json($skill_name);
			$new_skills[$skill_name] = [];
			$new_skill_show = 1;	// default is show
			if (isset($old_skills->$skill_name) && isset($old_skills->$skill_name->show) && $old_skills->$skill_name->show == 0){
				$new_skill_show = 0;
			}
			$new_skills[$skill_name]['show'] = $new_skill_show;
			$new_skills[$skill_name]['skill_stars'] = $skill_stars;
			// group by act
			$markings = [];
			forEach ($user_gsscore_raw[$skill_name] as $raw){
				$source = $raw['source'];
				$src_arr = explode('-', $source);
				$act_id = $src_arr[0];
				$raw['ass_id'] = $src_arr[1];
				if (!isset($markings[$act_id])){
					$markings[$act_id] = [];
				}
				array_push($markings[$act_id], $raw);
			}
			$new_skills[$skill_name]['markings'] = $markings;
			// $new_skills[$skill_name]['markers'] = [];
			//print_json($new_skill);
		}
		if ($debug){
			//print_json($new_skills);
		}
		// UPDATE DATABASE: user.skills & usr_final_score & user_gsscore
		$filters = ['user_id' => $user_id];
		$sets = [
				'skills' => $new_skills,
				'user_gsscore' => $user_gsscore2,
		];
		databaseUpdate($database, $col_usr, $filters, ['$set' => $sets]);
	}
	return 	$user_gsscore_raw;
}

///////////////////////////////////////////////////////////////

function getActMarks($user_id, $act){
	$marks = 0;
	forEach ($act->assessment->assessments as $asst){
		if (isset($asst->part_asst_marks->$user_id)){
			$marks += $asst->part_asst_marks->$user_id * $asst->weight / 100;
		}
	}
	return $marks;
}

///////////////////////////////////////////////////////////////

function addSkillScore(&$gs_hash, $skill, $weight, $marks, $stars, $source){
	if (!isset($gs_hash[$skill])){
		$gs_hash[$skill] = [];
	}
	if ($marks && !$stars){
		$stars = $marks;
	}
	if ($stars > 5){
		$stars = 5;
	}
	$hash = [
		'source' => $source,
		'weight' => $weight,
		'stars' => $stars,
	];
	if ($marks){
		$hash['marks'] = $marks;
	}
	//print_json($hash);
	array_push(
		$gs_hash[$skill],
		$hash
	);
}

///////////////////////////////////////////////////////////////

function getPartAsstMarks($act, $ass_id, $part_id){
	$marks = 0;
	if (isset($act->assessment->assessments[$ass_id - 1])){
		$asst = $act->assessment->assessments[$ass_id - 1];
		//print_json($asst);
		if (isset($asst->part_asst_marks) && isset($asst->part_asst_marks->$part_id)){
			$marks = $asst->part_asst_marks->$part_id;
		}
	}
	return $marks;
}

///////////////////////////////////////////////////////////////

function getActGsScore(&$user_gsscore_raw, &$act_gsscore_hash, $user_id, $uact, $debug){
	global $database, $col_usr, $col_act;

	$act_gsscore_raw = [];

	$act_gsscore = 0;

	//print_json($uact);
	$act_id = intval($uact->act_id);

	// read act for assessment and impression
	$filters = ['act_id' => $act_id];
	$options = ['projection' => ['_id'=> 0,
		'title' => 1,
		'assessment' => 1,
		'impression' => 1]
	];
	$documents = databaseRead($database, $col_act, $filters, $options);
	if (sizeof($documents)){
		$act = json_decode(json_encode($documents[0]), FALSE);
		// fix the weight
		if (!isset($act->assessment->weight)){ $act->assessment->weight = 50;}
		if (!isset($act->impression->weight)){ $act->impression->weight = 50;}

		$act_marks = getActMarks($user_id, $act);

		// ACTIVITY
		if ($debug){
			echo '<ul>';
			echo "<li><b>Act #$act_id. $act->title</li>";
			// ACTIVITY ITEMS
			echo '<ul>';
		}
		// 1. ASSESSMENTS
		if ($act->assessment->weight > 0){
			if ($debug){
				echo "<li>Assessments (".$act->assessment->weight."%)</li>";
			}
			forEach ($act->assessment->assessments as $asst){
				$ass_id = $asst->ass_id;
				if ($asst->weight > 0){
					//echo '<ul>';
					$asst_marks = isset($asst->part_asst_marks->$user_id) ? $asst->part_asst_marks->$user_id : 0;
					$skills = [];
					if (!isset($asst->skills)){
						$asst->skills = [];
					}
					forEach ($asst->skills as $skill_name => $stars){
						$weight = $act->assessment->weight * $asst->weight / 10000;
						$marks = getPartAsstMarks($act, $ass_id, $user_id);
						if ($debug){
							echo "weight=" . $act->assessment->weight . " * " . $asst->weight . "=" . $weight . " part_asst_marks=" . $marks ."<br/>";
						}
						addSkillScore($act_gsscore_raw, $skill_name, $weight, $marks, 0, $act_id.'-'.$ass_id);
						addSkillScore($user_gsscore_raw, $skill_name, $weight, $marks, 0, $act_id.'-'.$ass_id);
						array_push($skills, $skill_name);
					}
					//echo implode(', ', $skills);
					//echo '</ul>';
					$skills2 = count($skills) ? '(' . implode(', ', $skills) . ')' : '';
					if ($debug){
						echo "<div style='padding-right:10px;'>$ass_id. $asst->title ($asst->weight%) "
							. $skills2
							. " <span class='marks'>$asst_marks marks</span></div>";
					}
				}
			}
		}

		// 2. IMPRESSION
		if ($act->impression->weight > 0){
			if ($debug){
				echo "<li>Impression (".$act->impression->weight."%)</li>";
			}
			$skills = [];
			forEach ($act->impression->skills as $skill_name => $stars){
				$weight = $act->impression->weight / 100;
				//print_json($stars);
				$stars2 = getActPartstars($stars, $user_id);
				//echo "$weight%: $stars2<br/>";
				addSkillScore($act_gsscore_raw, $skill_name, $weight, 0, $stars2, $act_id.'-0');
				addSkillScore($user_gsscore_raw, $skill_name, $weight, 0, $stars2, $act_id.'-0');
				//echo "<span class='calcgs_skill'>$skill_name: <span class='marks'>$stars2 stars</span></span>";
				//array_push($skills, $skill_name);
				$skills[$skill_name] = $stars2;
			}
			if ($debug){
				print_json($skills);
			}
		}

		if (count($act_gsscore_raw) > 0){
			// ACTIVITY GENERIC SKILLS (FOR THIS ACT)
			if ($debug){
				echo "<li>Activity Generic Skills:</li>";
			}
			$act_gsscore = getGsScore($act_gsscore_raw, $act_gsscore_hash);
			if ($debug){
				print_json($act_gsscore_hash);
				// ACT GS SCORE
				echo "<li>Activity GS score: <span class='marks'>$act_gsscore stars</span></li>";
			}
		}
		if ($debug){
			echo '</ul>';
			echo '</ul>';
		}
	}
	return $act_gsscore;
}

///////////////////////////////////////////////////////////////

function getActPartstars($stars, $part_id){
	$stars2 = 0;
	//print_json($stars);
	//echo $part_id;
	if (isset($stars->act_part_scores) && isset($stars->act_part_scores->$part_id)){
		$stars2 = $stars->act_part_scores->$part_id;
	}
	return $stars2;
}

/////////////////////////////////////////////////////////////////

function getGsScore(&$gs_hash, &$gs_hash2){
	$gs_hash2 = [];
	$total_gs_score = 0; $num_of_skills = 0;
	forEach ($gs_hash as $skill_name => $skill){
		$total_weight = 0;
		forEach ($skill as $index => $hash){
			$weight = $hash['weight'];
			$total_weight += $weight;
		}
		$mean_stars = 0;
		$used_weight = 0;
		$iMarking = 0;
		$nMarking = count($skill);
		forEach ($skill as $index => $hash){
			$stars = $hash['stars'];
			$weight = $hash['weight'];
			$weight_pc = $weight / $total_weight;
			if ($iMarking++ < $nMarking - 1){
				$weight_pc = intval(100 * $weight / $total_weight);
				$used_weight += $weight_pc;
			} else {
				$weight_pc = 100 - $used_weight;
			}
			$gs_hash[$skill_name][$index]['weight_pc'] = $weight_pc;
			//print_json($gs_hash2);
			$mean_stars += ($stars * $weight_pc / 100);
		}
		$mean_stars2 = round($mean_stars, 2);
		//$mean_stars2 = $mean_stars;
		$gs_hash2[$skill_name] = $mean_stars2;

		// calc average gs score for this activity
		$total_gs_score += $mean_stars2;
		$num_of_skills++;
	}
	// AV GS SCORE
	$act_gsscore = 0;
	if ($num_of_skills > 0){
		$act_gsscore1 = $total_gs_score / $num_of_skills;
		$act_gsscore = round($act_gsscore1, 2);
	}
	return $act_gsscore;
}
?>
