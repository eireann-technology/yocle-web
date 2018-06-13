<?php
// test link: http://localhost/yocle/dev/confirm_resubmit.php?act_id=5&ass_id=1&user_id=2&part_id=1&resubmit_token=54321&action=reject

ini_set( 'display_errors', 1 );
error_reporting( E_ALL );
set_time_limit(600); // 10 mins
// https://github.com/mongodb/mongo-php-driver

/////////////////////////////////////////////////////////
// svrop.php
// type:
//	- image (dataurl)
//	- whb: for multiple bigboard
//	- timeline: for recording and playback
/////////////////////////////////////////////////////////

$sPresent = "Present";
$col_usr = 'users';
$col_act = 'activities';

// common
include "common.php";
include "database.php";
include "svrop_email.php";
require_once "swiftmailer-5.x/lib/swift_required.php";

$error = '';
$user_id = intval(getQS('user_id'));
$act_id = intval(getQS('act_id'));
$ass_id = intval(getQS('ass_id'));
$ass_index = $ass_id - 1;
$part_id = intval(getQS('part_id'));
$action = getQs('action');
$resubmit_token = getQS('resubmit_token');

$error = 0;

if (!$error){
	//echo "$user_id, $email_token";
	// find user from database
	$user_username = '';
	$part_username = '';
	$part_email = '';
	$uact_title = '';
	$uass_title = '';

	// time now
	$datetime_now = getDateTime();

	// get grantor
	$filters = ['user_id' => $user_id];
	$options = ['projection' => ['_id' => 0, 'username' => 1]];
	$users = databaseRead($database, 'users', $filters, $options);
	if (sizeof($users) > 0){
		$user = $users[0];
		$user_username = $user->username;
	}

	// get participant
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
		//print_json($part); exit();

		// check token
		$old_ass = $part->profile->activity[0]->assessments[$ass_index];

		// properties
		$part_username = $part->username;
		$part_email = $part->email;
		$uact = $part->profile->activity[0];
		$uact_title = $uact->title;
		//print_json($act);

		$uass = $uact->assessments[$ass_id - 1];
		$uass_title = $uass->title;
		$uass_performed = isset($uass->performed) ? $uass->performed : '';
		$uass_marked = isset($uass->marked) ? $uass->marked : '';
		//print_json($uass);

		if (!$resubmit_token){
			$error = "No token1 (impossible)";
		} else if (!isset($old_ass->resubmit_token) || $old_ass->resubmit_token == ''){
			$error = "There is no request to resubmit for this user's assessment now."; //"No token2";
		} else if ($old_ass->resubmit_token != $resubmit_token){
			$error = "Wrong token";
		}

		if (!$error){			// update the assessment in the database
			$doc_path = 'profile.activity.$.assessments.' . $ass_index . '.';
			$filters = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
			$updates = ['$set' => [
				$doc_path.'resubmit_resp_time' => $datetime_now,
				$doc_path.'resubmit_grant_user_id' => $user_id,
				$doc_path.'resubmit_action' => $action,
				$doc_path.'resubmit_token' => '',
			]];
			if ($action == 'accept'){
				$updates['$set'][$doc_path.'performed'] = '';
				$updates['$set'][$doc_path.'marked'] = '';
			}
			//print_json($filters); print_json($updates);
			databaseUpdate($database, 'users', $filters, $updates);
		}
	}
}

// SHOW TO THE ACTION USER
$tabs = '<span style="padding-left:10px"></span>';
$s =
	"<br/>A system message from Yocle:".
	"<br/><br/>You have just <b>" . $action . "ed</b> ".$part_username."'s request to resubmit the following assessment:<br/><br/>".
		$tabs."Participant: $part->username (ID=$part_id)<br/>".
		$tabs."Activity: $uact_title (ID=$act_id)<br/>".
		$tabs."Assessment #$ass_id: $uass_title<br/>".
		$tabs."Last submitted: $uass_performed<br/><br/>"
;
echo $s;

if ($error){

	echo '<span style="color:red">Error: '.$error.'<div>';

} else {

	// EMAIL TO THE REQUEST USER
	$recipients = $part_email;
	$subject = 'Yocle: Response to your request to resubmit an assessment';
	$body = "Dear $part_username,\r\n\r\n" .
			"Regarding the request to resubmit the following assessment:\r\n\r\n" .
			"\tParticipant: $part->username (ID=$part_id)\r\n".
			"\tActivity: $uact->title (ID=$act_id)\r\n".
			"\tAssessment #$ass_id: $uass_title\r\n"
	;
	if ($uass_performed){
		$body .= "\tLast submitted: $uass_performed\r\n";
	}
	if ($uass_marked){
		$body .=	"\tLast marked: $uass_marked\r\n";
	}
	$body .=	"\r\n".
			"Your request is ".$action."ed by $user_username at $datetime_now.\r\n".
			"\r\n".
			"Best regards,\r\n".
			"Yocle Team\r\n"
	;
	//echo $recipient $subject $body;
	sendEmail(EMAIL_SENDER_ADRS, $recipients, $subject, $body);
	echo "<b>An email is sent to the applicant's email address($part_email).</b><br/><br/>";
}
?>
