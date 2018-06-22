<?php
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

$error = '';
$email_toc = '';
$user_id = intval(getQS('user_id'));
$email_token = getQS('email_token');
//echo "$user_id, $email_token";
// find user from database
$filters = ['user_id' => $user_id];
$options = ['projection' => ['_id' => 0, 'email_toc' => 1, 'email_token' => 1]];
$users = databaseRead($database, 'users', $filters, $options);
$nuser = sizeof($users);
if ($nuser == 0){
	$error = "No such a user";
} else if ($nuser > 1){
	$error = "More than one user";
} else {
	$user = $users[0];
	$email_token2 = $user->email_token;
	if ($email_token2 != $email_token){
		$error = "Token is different";
	} else {
		$email_toc = $user->email_toc;
		$user2 = checkUserExists($email_toc);
		if ($user2){
			$error = "The email is already taken";
		} else {
			// update the new email
			$updates = ['$set' => [
				'email' => $email_toc,
				'email_toc' => '',
				'email_token' => '',
			]];
			$result = databaseUpdate($database, 'users', $filters, $updates);
		}
	}
}
if ($error){
	echo "Error: $error";
} else {
	echo "Your email address is changed to $email_toc.";
}
?>
