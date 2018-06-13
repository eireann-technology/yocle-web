<?php

/////////////////////////////////////////////////////////////////////////////////////

function checkUsers(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	
	$debug_checkuser = 0;
	
	$common_acts = getQs('common_acts');
	$my_user_id = intval(getQs('my_user_id'));
	
	$users1 = getQs('users');
	if ($users1 == ''){
		
		$error = "no users";
		
	} else {
		
		if ($users1 == -1){	// peertab_find
			/////////////////////////////////////////////////////////
			// SEARCH BY KEY
			/////////////////////////////////////////////////////////
			
			// find users
			$searchkey = getQs('searchkey');
			$manager = new MongoDB\Driver\Manager(MONGODB_URL);
			$collection = 'users';
			if (!checkDatabase($manager, $database) && !checkCollection($manager, $database, $collection)){
				
				$options = [ 'projection' => ['_id' => 0, 'user_id' => 1, 'confirmed_email' => 1] ];
				$users2 = databaseFind($manager, $database, $collection, 'username', '' . $searchkey, $options);
				$users1 = [];
				foreach ($users2 as $key => $user){
					if ($user->confirmed_email == 1){
						$user_id2 = $user->user_id;
						if ($user_id2 != $my_user_id){
							array_push($users1, $user_id2);
						}
					}
				}
				//print_json($users1); exit(); // testing
			}			
		} else if (gettype($users1) == 'string'){
			/////////////////////////////////////////////////////////
			// GIVEN THE USERS
			/////////////////////////////////////////////////////////
			$users1 = json_decode($users1, true);
		}		
		
		////////////////////////////////////////////////////////////////////////
		// PREPARE OUTPUT USERS
		////////////////////////////////////////////////////////////////////////
		//$users1 = array(1,2,3, 'alan@gmail.com');
		$output_user = 0;
		$output_users = [];
		
		foreach ($users1 as $key => $value){
			
			// FOR EACH INPUT VALUE
			$user_id = 0;
			$documents = 0;
			$options = [ 'projection' =>
				['_id' => 0,
					'user_id' => 1,
					'img_id' => 1,		
					'username' => 1,
					'email' => 1,
					'position' => 1,
					'location' => 1,
					'profile.activity.act_id' => 1,
					'profile.activity.title' => 1,
				]
			];
			if (gettype($value) && strpos($value, '@') == FALSE){
				////////////////////////////////////////////////////////////////////////////////////
				// case 1: it is not an email: i.e. user_id
				////////////////////////////////////////////////////////////////////////////////////
				$user_id = intval($value);
				if ($debug_checkuser){
					echo "case 1: user_id=$user_id<br/>";
				}
				// find the user from the database
				$documents = databaseRead($database, 'users', ['user_id' => $user_id], $options);
				if ($documents && sizeof($documents)){
					$user = $documents[0];
					$output_user = array(
						'user_id' 	=> $user_id,
						'img_id' 		=> $user->img_id,
						'username' 	=> $user->username,
						'email' 		=> $user->email,
						'position' 	=> isset($user->position)?$user->position:'',
						'location' 	=> isset($user->location)?$user->location:'',
					);
				}
			} else {
				
				// case 2: it is an email
				$documents = databaseRead($database, 'users', ['email' => $value], $options);
				if ($documents && sizeof($documents)){
					////////////////////////////////////////////////////////////////////////////////////
					// case 2A: the email already exists, find its user_id
					////////////////////////////////////////////////////////////////////////////////////
					$user = $documents[0];
					//print_json($user);
					$user_id = intval($user->user_id);
					if ($debug_checkuser){
						echo "case 2A: email=$value user_id=$user_id<br/>";
					}
					$output_user = array(
						'user_id' 	=> $user_id,
						'img_id' 		=> $user->img_id,
						'username' 	=> $user->username,
						'email' 		=> $user->email,
						'position' 	=> isset($user->position)?$user->position:'',
						'location' 	=> isset($user->location)?$user->location:'',
					);
				} else {
					////////////////////////////////////////////////////////////////////////////////////
					// case 2B: it doesn't exists
					////////////////////////////////////////////////////////////////////////////////////
					if ($debug_checkuser){
						echo "case 2B: new email=$value<br/>";
					}
					// give an empty user with only an email 
					$output_user = array(
						'user_id' => 0,
						'username' => $value,
						'email' => $value,
						'position' => '(Unregistered)'
					);
				}
			}
			// no id
			if ($output_user){
				
				//var_dump($output_user);
				
				// is this user already in the output array?
				// check duplicate http://stackoverflow.com/questions/6661530/php-multi-dimensional-array-search				
				$user_id = intval($output_user['user_id']);

				// find all its activities
				if ($common_acts == 1 && sizeof($documents)){
					$user = $documents[0];
					$acts = $user->profile->activity;
					// add all the act ids
					$act_ids = [];
					forEach ($acts as $act){
						array_push($act_ids, $act->act_id);
					}
					sort($act_ids);
					$output_user['act_ids_hash'] = num2hashArr($act_ids);
				}
				
				$key = array_search($user_id, array_column($output_users, 'user_id'));
				if ($key === FALSE){
					// no duplication
					array_push($output_users, $output_user);
				}
			}
		}
		// sort output users alphabetically
		usort($output_users, 'usort_username');
		
		/////////////////////////////////////////////////////////////
		// FIND COMMON ACTS
		/////////////////////////////////////////////////////////////
		if ($common_acts == '1'){
			
			// find my activity in hash
			$my_act_ids_hash = [];
			$filters = ['user_id' => $my_user_id];
			$options = [ 'projection' =>
				['_id' => 0,
					'profile.activity.act_id' => 1,
					'profile.activity.title' => 1,
				]
			];
			$documents = databaseRead($database, 'users', $filters, $options);
			if (sizeof($documents)){
				$user = $documents[0];
				
				//print_json($user);
				$acts = $user->profile->activity;
				
				// add all the act ids
				$act_ids = [];
				forEach ($acts as $act){
					if (isset($act->title) && $act->title != ''){
						array_push($act_ids, $act->act_id);
					}
				}
				sort($act_ids);
				
				//print_json($act_ids);
				$my_act_ids_hash = num2hashArr($act_ids);
				//print_json($my_act_ids_hash);
				
				forEach ($acts as $index => $act){
					$act_id = $act->act_id;
					//print_json($act);
					if (isset($act->title) && $act->title != ''){
						$my_act_ids_hash[$act_id] = $act->title;
					}
				}
				//print_json($my_act_ids_hash);
			}
			
			// FOR EACH USERS
			for ($i = 0; $i < sizeof($output_users); $i++){
				$user = $output_users[$i];
				$act_ids_hash = $user['act_ids_hash'];
				//print_json($act_ids_hash);

				// find all the common acts
				$titles = [];
				forEach ($my_act_ids_hash as $act_id => $title){
					//echo "$act_id: $title<br/>";
					if (isset($act_ids_hash[$act_id])){
						$title2 = '<span class="common_act" act_id="'.$act_id.'">'.$title.'</span>';
						array_push($titles, $title2);
					}
				}
				//if (sizeof($titles)) print_json($titles);
				$output_users[$i]['common_acts'] = join(', ', $titles);
			}
		}
		
		// output array
		$output['users'] = $output_users;
	}
}

///////////////////////////////////////////////////

function usort_username($a, $b){
	$c = $a['username'];
	$d = $b['username'];
	if ($c < $d){
		return -1;
	} else if ($c > $d){
		return 1;
	} else {
		return 0;
	}
}

///////////////////////////////////////////////////

function add_peer(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$user_id = intval(getQs('user_id'));
	$friend_id = intval(getQs('friend_id'));
	$filters = ['user_id' => $user_id];
	$update = ['$push' => 
							[	'friends' => 
								[
									'$each' => [$friend_id],
									'$sort' => 1,
								]
							] 
						];
	//print_json($filters);
	//print_json($update);
	$result = databaseUpdate($database, 'users', $filters, $update);
	
}

///////////////////////////////////////////////////

function rm_peer(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$user_id = intval(getQs('user_id'));
	$friend_id = intval(getQs('friend_id'));
	$filters = ['user_id' => $user_id];
	$update = ['$pull' => 
							[	'friends' => $friend_id] 
						];
	$result = databaseUpdate($database, 'users', $filters, $update);
}


?>

