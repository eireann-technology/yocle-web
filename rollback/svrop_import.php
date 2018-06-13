<?php

define('CREATEUSER_NONE', 			'');
define('CREATEUSER_CONFIRMED', 	'confirmed');
define('CREATEUSER_CREATED', 		'created');
define('CREATEUSER_UPDATED', 		'updated');

function createOrUpdateUser($email, $pwd, $username, $gender, $birthday, &$user_id){
	$status = CREATEUSER_NONE;
	
	$user = checkUserExists($email);
	//$user->confirmed_email = 0;
	if ($user && $user->confirmed_email){
		
		$status = CREATEUSER_CONFIRMED;	// already confirmed
		$user_id = $user->user_id;
		
	} else {
		
		// not exist or not confirmed
		$secret_token = '';
		if (!$user){
			
			$user_id = createUser($email, $pwd, $username, $gender, $birthday, 1, $secret_token);
			$status = CREATEUSER_CREATED;
			
		} else {
			
			$user_id = updateUser($user, $email, $pwd, $username, $gender, $birthday, $secret_token);
			$status = CREATEUSER_UPDATED;
			
		}
	}
	return $status;
}

/////////////////////////////////////////////////////////////////////////////////////

function createUser($email, $pwd, $username, $gender, $birthday, $confirmed_email, $secret_token){
	global $database, $col_usr, $template_user;
	//$success = 0;
	// create a new user
	$user = jsonclone($template_user);
	$user->user_id = getNewSequenceID('user_id', 'users');
	// update user information
	//$user->user_id_md5 = md5($user_id);
	$user->email = $email;
	$user->pwd = $pwd;
	$user->username = $username;
	$user->gender = $gender;
	$user->birthday = $birthday;
	$user->confirmed_email = $confirmed_email ? 1 : 0;
	if (!$confirmed_email){
		$user->confirmed_time = '';
	} else {
		$user->confirmed_time = getDateTime();
	}
	$user->secret_token = $secret_token;
	$user->next_send_confirm = getNextSendConfirm();
	$result = databaseInsert($database, $col_usr, $user);
	return $user->user_id;
}

/////////////////////////////////////////////////////////////////////////////////////

function updateUser($user, $email, $pwd, $username, $gender, $birthday, $secret_token){
	global $database, $col_usr;
	$success = 0;
	$filters = ['email' => $email];	
	$sets = ['$set' =>
		[
			'pwd' => $pwd,
			'username' => $username,
			'gender' => $gender,
			'birthday' => $birthday,
			'secret_token' => $secret_token
		]
	];
	$result = databaseUpdate($database, $col_usr, $filters, $sets);
	return $user->user_id;
}

///////////////////////////////////////////////////////////////////////

function importUsers($users){
	
	if (gettype($users) == 'array'){
		
		$user_ids = [];
		$line = 0;
		
		foreach ($users as $user){
			
			$arr = explode(',', $user);

			// 1264325183@qq.com,Wong Ho Yan,F,1997-10-28
			// 1264325183@qq.com, Wong Ho Yan, F, 1997-10-28
			$user_id = 0;
			if (sizeof($arr) != 4){
				echo "invalid input: line $line";
				print_json($arr);
			} else {
				$email = trim($arr[0]);
				//$email_arr = explode('@', $email);
				$pwd = '1234';
				$username = trim($arr[1]);
				$gender = trim($arr[2]);
				$birthday = trim($arr[3]);
				if ($birthday == '') $birthday = "2017-07-10";
				$status = createOrUpdateUser($email, $pwd, $username, $gender, $birthday, $user_id);
				if ($status == CREATEUSER_CONFIRMED){
					echo "$user_id: $email => $status<br/><br/>";
				} else {
					echo "$user_id: $email,$pwd,$username,$gender,$birthday => $status<br/><br/>";
				}
				array_push($user_ids, $user_id);
				$line++;
			}
		}
		sort($user_ids);
		//print_json($user_ids);
		echo "<br><br>" . implode(', ', $user_ids) . "<br><br>";
		
	} else {
		
		$error = "users not an array";
		
	}
	
	
}

///////////////////////////////////////////////////////////////////////

function importUsersTest(){
	global $error;
	$file_name = getQs('file_name');
	$path = getcwd() . DIRECTORY_SEPARATOR . $file_name;
	if (file_exists($path)){
		$users = file($path, FILE_IGNORE_NEW_LINES);
		print_json($users);
		importUsers($users);
	} else {
		$error  = "$path not found";
	}
}

?>