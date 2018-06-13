<?php
///////////////////////////////////////////////////////////////////////////////////////////////////////
$debug_svrop = 1;

function xEditable(){
	//echo "xEditable";
	
	global $database, $error, $type, $user_id, $email, $pwd, $error, $output, $debug_svrop, $sPresent;
	$pk = getQS('pk');	// unused
	$name = getQS('name');
	$value = getQS('value');
	//$filters = ['email' => $email];
	
	$filters = ['user_id' => $user_id];
	
	$item_id = getQS('item_id');
	if (!$item_id) $item_id = '0';
	$result = 0;
	
	if ($name == ''){
	
		$error = 'empty name';
		
	} else {
		
		switch ($name){
			case 'interest':
			case 'objectives':
			
				if ($debug_svrop){
					wlog("xeditable*: user_id=$user_id type=$type name=$name item_id=$item_id");
				}
				$result = databaseUpdate($database, 'users', $filters, ['$set' => ["profile.$name" => $value]]);
				$output[$name] = $value;
				break;
		
			case 'profile_work':
			case 'profile_education':
			case 'profile_publication':
			case 'profile_language':
			case 'profile_award':
				$type = explode("_", $name)[1];
				$item_id = intval($item_id);
				if ($value != ""){
					if ($debug_svrop){
						wlog("xeditable: email=$email type=$type name=$name item_id=$item_id (new/edit)");
					}
					// FIND NEXT ITEM_ID
					if ($item_id == -1){
						$documents = databaseRead($database, 'users', $filters);
						if ($documents && sizeof($documents) > 0){
							$user = json_decode(json_encode($documents[0]), true);
							$item_id = count($user['profile'][$type]);
						}
					}
					
					// NEW/EDIT DOCUMENT IN THE ARRAY 
					if (gettype($value) == 'array'){
						$profile = "profile.$type.$item_id";
						$fields = array($profile . '.item_id' => $item_id);
						foreach ($value as $key => $keyval){
							$fields[$profile . '.' . $key] = $keyval;
						}
						$update = ['$set' => $fields];
						$result = databaseUpdate($database, 'users', $filters, $update);
					}
									
					// read from database
					$documents = databaseRead($database, 'users', $filters);
					$user = json_decode(json_encode($documents[0]), true);
					$item_arr = $user['profile'][$type];
					
					// SORT NOW
					$sort_func = '';
					switch ($type){
						case 'language': 	$sort_func = 'lang_sort'; break;
						case 'awards':		$sort_func = 'date_sort'; break;
						default:					$sort_func = 'item_sort'; break;
					}
					usort($item_arr, $sort_func);
					for ($i = 0; $i < sizeof($item_arr); $i++){
						$item_arr[$i]['item_id'] = $i;
					}
					//print_r($item_arr);
					
					// UPDATE TO DATABASE
					$update = ['$set' => ["profile.$type" => $item_arr]];
					$result = databaseUpdate($database, 'users', $filters, $update);
					updatePosLoc($type, $user);
					
					$output['item_arr'] = $item_arr;
					
				} else {
				
					//wlog("xeditable: user_id=$user_id type=$type name=$name item_id=$item_id (delete)");
					
					// REMOVE DOCUMENT FROM THE ARRAY WORK
					$update = 
						['$pull' => 
							[
								"profile.$type" =>
									[
										'item_id' => $item_id
									]
							]
					];
					$result = databaseUpdate($database, 'users', $filters, $update);
					
					// read from database
					$documents = databaseRead($database, 'users', $filters);
					$user = json_decode(json_encode($documents[0]), true);
					updatePosLoc($type, $user);
					// output
					$output['position'] = $user['position'];
					$output['location'] = $user['location'];
					$output[$name] = $user[$name];
				}
				break;
				
			default:
				// update of non-group field, e.g. name, pos, loc
				if ($debug_svrop)
				{
					wlog("xeditable: user_id=$user_id $email type=$type name=$name value=$value");
				}
				$result = databaseUpdate($database, 'users', $filters, ['$set' => [$name => $value]]);
				$output[$name] = $value;
				break;
		}
	}
	return $result;
}
?>