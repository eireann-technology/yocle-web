<?php

// test link: http://localhost/yocle/dev/svrop.php?type=resubmit_ass&act_id=5&ass_id=1&user_id=1

function resubmit_ass(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $col_usr, $col_act, $template_uact_ass_item, $test_qs, $CR;
	//$error = "testing";
	$user_id = intval(getQS('user_id'));
	$part_id = $user_id;
	$act_id = intval(getQS('act_id'));
	$ass_id = intval(getQS('ass_id'));
	$ass_index = $ass_id - 1;

	// CHECK IF IT IS REQUESTED
	$filters = [
		'user_id' => $part_id,
	 	'profile.activity.act_id' => $act_id,
	];
	$options = ['projection' =>
		[
			'_id' => 0, 'username' => 1, 'email' => 1,
			"profile.activity.$" => 1,
		]
	];
	$parts = databaseRead($database, 'users', $filters, $options);
	$npart = sizeof($parts);
	if ($npart == 0){
		$error = "No such a participant";
	} else if ($npart > 1){
		$error = "More than one participant";
	} else {
		$part = $parts[0];
		$part = json_decode(json_encode($part), false);
		// check token
		$uact = $part->profile->activity[0];
		$uass = $uact->assessments[$ass_index];

		//print_json($old_ass); exit();
		if (isset($uass->resubmit_token) && $uass->resubmit_token != ''){
			$error = "Already requested on " . $uass->resumibt_request_time;
		}
	}

	///////////////////////////
	// UPDATE PARTICIPANT NOW
	///////////////////////////

	if (!$error){
		$resubmit_token = create_guid();
		
		// time now
		$datetime_now = getDateTime();

		///////////////////////////
		// SEND EMAIL TO GRANTOR
		///////////////////////////
		// get act by act_id
		// find the activity
		$filters = ['act_id' => $act_id];
		$options = ['projection' => ['_id'=> 0, 'act_id'=> 1, 'coordinator_id' => 1]];
		$acts = databaseRead($database, 'activities', $filters, $options);
		if (!sizeof($acts)){
			$error = 'activity not found';
		} else {
			// new act
			$act = $acts[0];

			// get grantor from act
			$grant_user_id = intval($act->coordinator_id);
			$filters = ['user_id' => $grant_user_id];
			$options = ['projection' => ['_id'=> 0, 'username' => 1, 'email' => 1]];
			$users = databaseRead($database, 'users', $filters, $options);
			if (!sizeof($users)){

				$error = 'grantor not found';

			} else {
				
				// new act
				$grantor = $users[0];

				// get email from grantor
				$recipients = $grantor->email;

				// send email
				$subject = 'Yocle: Request to resubmit an assessment';
				$body = "Dear $grantor->username,$CR$CR" .
						"There is a request to resubmit the following assessment:$CR$CR" .
						"\tParticipant: $part->username (ID=$part_id)$CR".
						"\tActivity: $uact->title (ID=$act_id)$CR".
						"\tAssessment #$ass_id: $uass->title$CR".
						"\tLast submitted: $uass->performed$CR";
				;
				if (isset($uass->marked)){
					$body .=	"\tLast marked: $uass->marked$CR";
				}
				$server = my_server_url();
				$url = "$server/confirm_resubmit.php?act_id=$act_id&ass_id=$ass_id&user_id=$grant_user_id&part_id=$user_id".
							"&resubmit_token=$resubmit_token&action="
				;
				$url1 = $url . 'accept';
				$url2 = $url . 'reject';
				
				$url1 = '<a href="' . $url1 . '">' . $url1 . '</a>';
				$url2 = '<a href="' . $url2 . '">' . $url2 . '</a>';
				
				$body .=	"$CR".
						"Please choose one of the following actions:$CR".
							"\t1) Accept the request: " . $url1 . "$CR$CR".
							"\t2) Reject the request: " . $url2 . "$CR$CR".
						"$CR".
						"Best regards,$CR".
						"Yocle Team$CR"
				;
				//print_json($recipients); echo "$subject $body<br/><br/>";
				$result = sendEmail(EMAIL_SENDER_ADRS, $recipients, $subject, $body);
				// @return int The number of successful recipients. Can be 0 which indicates failure
				if ($result > 0){
					// generate a resubmit_token
					$doc_path = 'profile.activity.$.assessments.' . $ass_index . '.';
					$filters = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
					$updates = ['$set' => [
						$doc_path.'resubmit_token' => $resubmit_token,
						$doc_path.'resumibt_request_time' => $datetime_now,
					]];
					//print_json($filters); print_json($updates);
					databaseUpdate($database, 'users', $filters, $updates);					
				}
			}
		}
	}

}

?>
