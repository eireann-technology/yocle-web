<?php
function calcgs($user_id){
	global $database, $col_usr;
	
	// read from database?
	echo "<style>.marks{color:red;}</style>";
	
	$user_id = intval($user_id);
	
	// loop thru all the assessments in all the activities
	$user = 0;
	$filters = ['user_id' => $user_id];
	$options = ['projection' => ['_id'=> 0,
		'user_id' => 1,
		'username' => 1,
		'impression.skills' => 1,
		'profile.activity' => 1,
	]];
	$documents = databaseRead($database, $col_usr, $filters, $options);
	if (sizeof($documents)){
		
		// process users
		$user = json_decode(json_encode($documents[0]), false);
		echo "user_id=$user_id $user->username <br/>";
		
		// process activities
		$acts = $user->profile->activity;
		forEach ($acts as $act){
			echo '<p style="padding-left:10px">';	
			$act_marks = getActMarks($user_id, $act);
			echo "ACT #$act->act_id. $act->title <span class='marks'>$act_marks marks</span><br/>";
			
			// process assessments
			echo '<p style="padding-left:20px">';
			echo "<b>Assessments</b><br/>";
			echo '</p>';			
			
			forEach ($act->assessments as $asst){
				echo '<p style="padding-left:30px">';
				$asst_marks = isset($asst->part_asst_marks->$user_id) ? $asst->part_asst_marks->$user_id : 0;
				echo "ASST #$asst->ass_id. $asst->title ($asst->weight%) <span class='marks'>$asst_marks marks</span> <br/>";
				
				forEach ($asst->skills as $skill => $scores){
					echo '<p style="padding-left:40px;">';
						echo "$skill<br/>";
					echo '</p>';					
				}
				echo '</p>';
			}
			echo '</p>';
		}

		// calcgs_imp
		echo '<p style="padding-left:20px; line-height:20px">';
		echo "<b>Impression</b><br/>";
		echo '</p>';
		
		forEach ($act->impression->skills as $skill => $scores){
			echo '<p style="padding-left:30px; line-height:20px">';
			echo "$skill<br/>";
			echo '</p>';					
		}
		// write back to database
	}
	echo "<br/><br/>";
}

///////////////////////////////////////////////////////////////

function getActMarks($user_id, $act){
	$marks = 0;
	forEach ($act->assessments as $asst){
		if (isset($asst->part_asst_marks->$user_id)){
			$marks += $asst->part_asst_marks->$user_id * $asst->weight / 100;
		}
	}	
	return $marks;
}

?>