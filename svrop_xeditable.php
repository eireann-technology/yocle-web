<?php
///////////////////////////////////////////////////////////////////////////////////////////////////////
$debug_svrop = 0;

function xEditable(){
	//echo "xEditable";

	global $database, $error, $type, $user_id, $email, $pwd, $error, $output, $debug_svrop, $sPresent, $template_uact_ass_item, $col_usr;
	$pk = getQS('pk');	// unused
	$name = getQS('name');
	$value = getQS('value');
	$email = getQS('email');
	$username = getQS('username');

	//$filters = ['email' => $email];

	$filters = ['user_id' => $user_id];

	$item_id = intval(getQS('item_id'));
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

			case 'email':

				// check if it exists already
				$new_email = $value;
				$user = checkUserExists($new_email);
				if ($user){//} && $user->confirmed_email){

					//print_json($user);
					$error = 'This email already exists';

				} else {

					// generate secret token
					$email_token = create_guid();
					$updates = ['$set' => [
						'email_toc' => $new_email,
						'email_token' => $email_token,
					]];
					$result = databaseUpdate($database, 'users', $filters, $updates);

					// send change email
					sendEmail_changeemail($username, $user_id, $new_email, $email_token);

					// the output email
					$output[$name] = $new_email;
				}
				break;

			case 'bl2_item':
			case 'blg_item':

				$act_id = intval(getQS('act_id'));
				$ass_id = intval(getQS('ass_id'));
				$item_id = intval(getQS('item_id'));
				$blog_id = intval(getQS('blog_id'));
				$ass_index = intval($ass_id) - 1;
				$item_index = intval($item_id) - 1;

				// find new blog_id
				if ($name == 'blg_item' && !$blog_id){
					$blog_id = intval(databaseFindAndInc($database, 'sequences', 'blog_id'));
				}

				$time_now = getDateTime();
				$new_item = jsonclone($template_uact_ass_item);
				$new_item->ass_item_id = $item_id;
				$new_item->performed = $time_now;
				$new_item->answer = $value;
				$new_item->blog_id = $blog_id;

				// update user's assessment
				$filters_user = [ 'user_id' => $user_id, 'profile.activity.act_id' => $act_id];
				$path = 'profile.activity.$.assessments.' . $ass_index . '.items';
				$old_item = ['ass_item_id' => $item_id];
				if ($debug_svrop){
					wlog("xeditable*: user_id=$user_id type=$type name=$name act_id=$act_id ass_id=$ass_id item_id=$item_id");
					//print_json($filters_user);
					//print_json($path);
					//print_json($old_item);
					//print_json($new_item);
				}
				databaseUpdateArrayElement($database, $col_usr,
					$filters_user, $path,
					$old_item, $new_item);

				if ($name == 'blg_item'){
					// update collection blog
					$blog = [
						"user_id" => $user_id,
						"act_id" => $act_id,
						"ass_id" => $ass_id,
						"item_id" => $item_id,
						"performed" => $time_now,
					];
					$result = databaseInsertOrUpdate($database, 'blog', ['blog_id' => $blog_id], $blog);
					// add to user's blog_ids
					addBlogIdToUsersPeers($user_id, $blog_id);
				}

				// output to javascript
				$output['item_id'] = $item_id;
				$output['blog_id'] = $blog_id;
				break;

			default:
/*
				// addBlogItem
				if (strpos($name, 'blg_item_') !== false){

					$item_id = intval(substr($name, 9));

					$act_id = intval(getQS('act_id'));
					$ass_id = intval(getQS('ass_id'));
					$ass_index = intval($ass_id) - 1;
					$item_index = intval($item_id) - 1;
					$blog_id = intval(getQS('blog_id'));

					// find new blog_id
					if (!$blog_id){
						$blog_id = intval(databaseFindAndInc($database, 'sequences', 'blog_id'));
					}

					$time_now = getDateTime();
					$new_item = jsonclone($template_uact_ass_item);
					$new_item->ass_item_id = $item_id;
					$new_item->performed = $time_now;
					$new_item->answer = $value;
					$new_item->blog_id = $blog_id;

					// update user's assessment
					$filters_user = [ 'user_id' => $user_id, 'profile.activity.act_id' => $act_id];
					$path = 'profile.activity.$.assessments.' . $ass_index . '.items';
					$old_item = ['ass_item_id' => $item_id];
					if ($debug_svrop){
						wlog("xeditable*: user_id=$user_id type=$type name=$name act_id=$act_id ass_id=$ass_id item_id=$item_id");
						//print_json($filters_user);
						//print_json($path);
						//print_json($old_item);
						//print_json($new_item);
					}
					databaseUpdateArrayElement($database, $col_usr,
						$filters_user, $path,
						$old_item, $new_item);

					// update collection blog
					$blog = [
						"user_id" => $user_id,
						"act_id" => $act_id,
						"ass_id" => $ass_id,
						"item_id" => $item_id,
						"performed" => $time_now,
					];
					$result = databaseInsertOrUpdate($database, 'blog', ['blog_id' => $blog_id], $blog);

					// add to user's blog_ids
					addBlogIdToUsersPeers($user_id, $blog_id);

					// output to javascript
					$output['item_id'] = $item_id;
					$output['blog_id'] = $blog_id;

				} else
*/
				{

					// update of non-group field, e.g. name, pos, loc
					if ($debug_svrop)
					{
						wlog("xeditable: user_id=$user_id $email type=$type name=$name value=$value");
					}
					$result = databaseUpdate($database, 'users', $filters, ['$set' => [$name => $value]]);
					$output[$name] = $value;
				}
				break;
		}
	}
	return $result;
}

/////////////////////////////////////////////////////////////////////////////////////

function deleteBlgItem(){

	//echo 'haha';

	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act, $col_usr;
	global $MSG_TYPE_USR, $MSG_TYPE_ACT;

	$item_id = intval(getQs('item_id'));
	$act_id = intval(getQS('act_id'));
	$ass_id = intval(getQS('ass_id'));
	$ass_index = intval($ass_id) - 1;
	$item_index = intval($item_id) - 1;

	// read the message from the sender
	$filters = [ 'user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$options = [ 'projection' => ['_id' => 0, 'profile.activity.$.assessments.' . $ass_index . '.items' => 1, 'friends' => 1, 'networks' => 1] ];
	//print_json($filters);	print_json($options);

	$documents = databaseRead($database, $col_usr, $filters, $options);
	//print_json($documents);
	if ($documents && sizeof($documents) > 0){
		$user = json_decode(json_encode($documents[0]), true);
		$asst = $user['profile']['activity'][0]['assessments'][$ass_index];
		$method = $asst['method'];
		if ($method != 'blg' && $method != 'bl2'){
			$error = 'Wrong type';
		} else {
			$items = $asst['items'];
			//print_json($items);

			$old_size = sizeof($items);
			if ($old_size <= $item_index){

				$error = "Wrong size $item_id, $old_size";

			} else {

				$item = $items[$item_index];
				$old_item_id = $item['ass_item_id'];
				if ($old_item_id != $item_id){

					$error = "Wrong item_id $item_id, $old_item_id ";

				} else {

					$blog_id = isset($item['blog_id']) ? $item['blog_id'] : 0;

					// remove the item
					array_splice($items, $item_index, 1);
					//print_json($items);

					// sort the items
					$ass_item_id = 1;
					foreach ($items as $i => $item){
						$items[$i]['ass_item_id'] = $ass_item_id++;
					}
					//print_json($items);

					// output to database
					$update = ['$set' => ['profile.activity.$.assessments.' . $ass_index . '.items' => $items]];
					//print_json($filters); print_json($update);
					$result = databaseUpdate($database, $col_usr, $filters, $update);

					if ($blog_id != 0){

						// remove from all the users
						$hash = [$user_id => 1];
						num2hashArr2($user['networks'], $hash);
						num2hashArr2($user['friends'], $hash);
						$users2 = hash2NumArr_key($hash);

						// add blog_id to their blog_ids
						foreach ($users2 as $user_id2){
							$filters = ['user_id' => $user_id2];
							$update = ['$pull' => ['blog_ids' => $blog_id]];
							$result = databaseUpdate($database, $col_usr, $filters, $update);
						}

						// remove from blog
						$result = databaseDelete($database, 'blog', ['blog_id' => $blog_id]);

					}

					// output to client
					$output['items'] = $items;
				}
			}
		}
	} else {
		$error = 'not found';
	}
}

?>
