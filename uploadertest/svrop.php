<?php


// https://github.com/mongodb/mongo-php-driver

/////////////////////////////////////////////////////////
// svrop.php
// type:
//	- image (dataurl)
//	- whb: for multiple bigboard
//	- timeline: for recording and playback
/////////////////////////////////////////////////////////

$sPresent = "Present";
//$debug_svrop = 2;

// common
include "common.php";
include "database.php";
include "svrop_media.php";

if (file_exists('recaptcha.php')){
	// full version

	include "database_templates.php";
	include "recaptcha.php";
	// recaptcha
	require_once __DIR__ . '\recaptcha-master\src\autoload.php';
	// swiftmailer
	require_once "swiftmailer-5.x/lib/swift_required.php";
}

// ERROR HANDLING
ini_set('display_errors', 1);
error_reporting(E_ALL);

// WRITE ERROR LOG
ini_set("log_errors", 1);
ini_set("error_log", $logfile);
//error_log( "Hello, errors!" );

// DEBUGGING
$debug_svrop = 2;
if ($debug_svrop >= 2){
	wlog('*****');
	wlog("METHOD=".var_export($_SERVER['REQUEST_METHOD'], true));
	wlog("GET=".var_export($_GET, true));
	wlog("POST=".var_export($_POST, true));
	wlog('*****');
}

$type = getQS('type');
if (!$type){

	echo('no type');

} else {

	$email = getQS('email');
	$pwd = getQS('pwd');
	$reset_pwd = getQS('reset_pwd');

	if ($debug_svrop){
		wlog($user . ',' . $type . '...start');
	}
	$output = array();
	$error = '';
	$nooutput = 0;
	switch ($type){
		case 'login':								logIn();										break;
		case 'signup':							signUp(); 									break;
		case 'xeditable':						xEditable();								break;
		case 'dl_img':							$nooutput = downloadImg();	break;
		case 'ul_img':							uploadImg();	 							break;
		case 'show_skills':					showSkills();								break;
		case 'profile_order':				profileOrder();							break;
		case 'activity_sharing':		activitySharing();					break;
		case 'new_sequence':				newSequence();							break;
		case 'find_field':					find_field();								break;
		case 'check_users':					checkUsers();								break;
		case 'get_userdoc':					getUserDoc();								break;
		case 'get_actdoc':					getActDoc();								break;
		case 'del_actdoc':					delActDoc();								break;
		case 'save_activity':				saveActivity();							break;
		case 'reset_pwd':						resetPwd();									break;
		//case 'find_doc':						findDoc();									break;	// dangerous
		case 'get_ntwk':						getNtwk();							break;

		// MEDIA
		case 'ul_media':						uploadMedia();					break;
		case 'get_media':						getMedia();							break;
		case 'remove_media':				removeMedia();					break;

		default:
			$error = 'wrong type';
			break;
	}
	//$output['1'] = md5(1);	$output['2'] = md5(2);	$output['3'] = md5(3);

	if ($nooutput == 0){
		$output['error'] = $error;
		echo json_encode($output);
	}
	if ($debug_svrop){
		wlog($user.','.$type.'...finish');
	}
}


/////////////////////////////////////////////////////////

function getFolder($room, $type, $createIfNone){
	global $room;

	// GET CURRENT DIRECTORY
	$folder = getcwd() . SLASH . 'rooms';
	if (!is_dir($folder) && $createIfNone){
		mkdir($folder, 0777, true);
		chmod($folder, 0777);
	}

	// ADD ROOM
	if ($room){
		$folder .= SLASH . $room;
		if (!is_dir($folder) && $createIfNone){
			mkdir($folder, 0777, true);
			chmod($folder, 0777);
		}
	}

	// ADD TYPE
	if ($type){
		$folder .= SLASH . $type;
		if (!is_dir($folder)){
			mkdir($folder, 0777, true);
			chmod($folder, 0777);
		}
	}

	// ADD FINAL SLASH
	$folder .= SLASH;
	return $folder;
}

/////////////////////////////////////////////////////////
// without creation
function getFolder2($room, $type){
	global $room;
	$folder = getcwd()
		. SLASH . 'rooms'
		. SLASH . $room
		. SLASH . $type
		. SLASH;
	return $folder;
}

/////////////////////////////////////////////////////////////////////

function getLeadingZero($index, $total){
	$s = $index . '';
	$size = strlen($total);
	while (strlen($s) < $size){
		$s = "0" . $s;
	}
	return $s;
}

/////////////////////////////////////////////////////////////////////

function create_guid(){
	//if (function_exists('com_create_guid')){
	//	return com_create_guid();
	//} else
	{
		mt_srand((double)microtime()*10000);//optional for php 4.2.0 and up.
		$charid = strtoupper(md5(uniqid(rand(), true)));
		$hyphen = chr(45);// "-"
		$uuid =
				//chr(123)// "{"
				substr($charid, 0, 8)//.$hyphen
				.substr($charid, 8, 4)//.$hyphen
				.substr($charid,12, 4)//.$hyphen
				.substr($charid,16, 4)//.$hyphen
				.substr($charid,20,12)
				//.chr(125);// "}"
		;
		return $uuid;
	}
}

/////////////////////////////////////////////////////////////////////

function logIn(){
	global $database, $error, $type, $email, $pwd, $error, $output, $reset_pwd;
	if ($email == ''){
		$error = 'user is not defined';
	} else if ($pwd == ''){
		$error = 'password is not defined';
	} else {
		// find user from database
		$documents = databaseRead($database, 'users', ['email'=>$email]);
		$found = sizeof($documents);
		if (!$found){
			$error = 'The email is not found.';
		} else if ($found > 1){
			$error = 'The email has more than one occurence.';
		} else {
			$user = json_decode(json_encode($documents[0]), true);
			if ($user['confirmed_email'] == 0){
				//print_r($documents);	// debug
				$error = 'This account is not confirmed yet.';
				// check last send time
				$send_confirm = 0;
				$last_send_confirm = '';
				$now = getDateTime();
				if (isset($user['last_send_confirm'])){
					$last_send_confirm = $user['last_send_confirm'];
					$next_send_confirm = new DateTime($last_send_confirm);
					date_add($next_send_confirm, date_interval_create_from_date_string('1 hour'));
					$next_send_confirm2 = date_format($next_send_confirm, 'Y-m-d H:m:s');
					//echo $now . '+' . $next_send_confirm2;
					if ($now > $next_send_confirm2){
						$send_confirm = 1;
					}
				} else {
					$send_confirm = 1;
				}
				if ($send_confirm){

					// UPDATE THE SEND TIME
					$result = databaseUpdate($database, 'users', ['email' => $email], ['$set' => ['last_send_confirm' => $now]]);

					// RESEND EMAIL
					$error .= ' A confirmation email is resent.';
					$username = $user['username'];
					$email = $user['email'];
					$secret_token = $user['secret_token'];
					sendConfirmEmail($username, $email, $secret_token);

				} else {
					$error .= ' Your confirmation email was sent on ' . $last_send_confirm . ' and resend can only be processed 1 hour after this time.';
				}
			}	else if ($reset_pwd != ""){

				// check if it equal to secret_token
				if ($user['secret_token'] != $reset_pwd){
					$error = 'Invalid reset password. You may request it again.';
				} else {

				}
			} else if ($user['pwd'] != $pwd){
				$error = 'Wrong password.';
				//$error = 'Wrong password. ' . $user['pwd'] . ' ' . $pwd;
			}
		}
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function showSkills(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	//print_r($_REQUEST);
	$label = $_REQUEST['label'];
	$show = $_REQUEST['show'] == 1 ? 1:0;
	$field = "skills.$label.show";
	//echo "$field=>$show";
	$res = databaseUpdate($database, 'users', ['email' => $email], ['$set' => [$field => $show]]);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function xEditable(){
	global $database, $error, $type, $email, $pwd, $error, $output, $debug_svrop, $sPresent;
	$pk = isset($_REQUEST['pk']) ? $_REQUEST['pk'] : '';
	$name = isset($_REQUEST['name']) ? $_REQUEST['name'] : '';
	$value = isset($_REQUEST['value']) ? $_REQUEST['value'] : '';
	$criteria = ['email' => $email];
	$item_id = isset($_REQUEST['item_id']) ? $_REQUEST['item_id'] : '0';
	//wlog('xeditable: pk=' . $pk . ' email=' . $email . ' name=' . $name . ' value=' . $value) ;

	$result = 0;
	if ($name == ''){

		$error = 'empty name';

	} else {

		switch ($name){
			case 'interest':
			case 'objectives':
			//case 'profile_interest':
			//case 'profile_objectives':
					if ($debug_svrop){
						wlog("xeditable*: email=$email type=$type name=$name item_id=$item_id");
					}
					$result = databaseUpdate($database, 'users', ['email' => $email], ['$set' => ["profile.$name" => $value]]);
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
						$documents = databaseRead($database, 'users', ['email'=>$email]);
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
						$result = databaseUpdate($database, 'users', $criteria, $update);
					}

					// read from database
					$documents = databaseRead($database, 'users', ['email'=>$email]);
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
					$result = databaseUpdate($database, 'users', $criteria, $update);

					// check results
					//$documents = databaseRead($database, 'users', ['email'=>$email]);
					//$user = json_decode(json_encode($documents[0]), true);
					//print_r($user);
					$output['item_arr'] = $item_arr;

					updatePosLoc($type, $user);

				} else {

					wlog("xeditable: email=$email type=$type name=$name item_id=$item_id (delete)");

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
					$result = databaseUpdate($database, 'users', $criteria, $update);

					// read from database
					$documents = databaseRead($database, 'users', ['email'=>$email]);
					$user = json_decode(json_encode($documents[0]), true);
					updatePosLoc($type, $user);
				}
				break;

			default:
				// update of non-group field, e.g. name, pos, loc
				if ($debug_svrop){
					wlog('xeditable: email=' . $email . ' name=' . $name . ' value=' . $value);
				}
				$result = databaseUpdate($database, 'users', ['email' => $email], ['$set' => [$name => $value]]);
				break;
		}
	}
	return $result;
}

/////////////////////////////////////////////////////

function lang_sort($a, $b){
	return -strcmp($a["language"], $b["language"]);
}
function date_sort($a, $b){
	return strcmp($a["language"], $b["language"]);
}
/////////////////////////////////////////////////////

function updatePosLoc($type1, $user){
	global $database, $error, $email, $pwd, $error, $output, $debug_svrop, $sPresent;
	// update position and locaiton for the latest data
	$criteria = ['email' => $email];
	$pos = ''; $loc ='';
	switch ($type1){
		case 'work':
		case 'education':
			$arr = ['work', 'education'];
			foreach ($arr as $type2){
				$item_arr = $user['profile'][$type2];
				//foreach ($item_arr as $key => $item){
				for ($i = sizeof($item_arr) - 1; $i >= 0 ; $i--){	// reverse order (latest first);
					$item = $item_arr[$i];
					//print_r($item);
					if ($item['end'] == $sPresent){

						switch ($type2){

							case 'work':
								// calculate the period (this will be false information when time is passed)
								//$period = getPeriod($item['start'] . '-01');
								//$pos = $item['title'] . $period;
								$pos = $item['title'];
								$loc = $item['company'];
								if (isset($item['location']) && $item['location']){
									$loc .= ', ' . $item['location'];
								}
								break;

							case 'education':
								// calculate the year (assume the school year begin in sept)
								$year = getSchoolYear($item['start'] . '-09-01');
								$pos = $item['degree'];
								if (isset($item['field']) && $item['field']){
									$pos .= ', ' . $item['field'];
								}
								$pos .= $year;
								$loc = $item['school'];
								//if (isset($item['location']) && $item['location']){
								//	$loc .= ', ' . $item['location'];
								//}
								break;

						}
						break;
					}
				}
				if ($pos != '' || $loc != ''){
					break;
				}
			}
			// even if no pos and loc, update them to empty in database
			$update = ['$set' => ["position" => $pos, "location" => $loc]];
			$result = databaseUpdate($database, 'users', $criteria, $update);
			$output['position'] = $pos;
			$output['location'] = $loc;
			break;
	}
}

/////////////////////////////////////////////////////

function profileOrder(){
	global $database, $error, $type, $email, $pwd, $error, $output, $debug_svrop;
	$order = isset($_REQUEST['order']) ? $_REQUEST['order'] : '0';
	//$order = json_decode($order, true);
	//print_r($order);
	$criteria = ['email' => $email];
	$update = ['$set' => ["profile.order" => $order]];
	$result = databaseUpdate($database, 'users', $criteria, $update);
	$output['order'] = $order;
}


///////////////////////////////////////////////////////////////////////////////////////////////////////
/*
db.getCollection('users').update(
    {
        'email': 'alantypoon@gmail.com', 'profile.activity.act_id': 1
    },
    {
        '$set': {
            'profile.activity.$.sharing': '1'
        }
    }
);
*/

///////////////////////////////////////////////////////////////////////////////////////////////////////

function activitySharing(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$act_id = intval($_REQUEST['act_id']);
	$sharing = $_REQUEST['sharing'];
	$criteria = ['email' => $email, 'profile.activity.act_id' => $act_id];
	$update = ["profile.activity.$.sharing" => $sharing];
	$output['sharing'] = $sharing;
	$res = databaseUpdate($database, 'users', $criteria, ['$set' => $update]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function find_field(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$arr = array();
	$collection = isset($_REQUEST['collection']) ? $_REQUEST['collection'] : '';
	$searchkey = isset($_REQUEST['q']) ? $_REQUEST['q'] : '';
	//$searchkey = 'hku';
	if ($searchkey != ''){
		$manager = new MongoDB\Driver\Manager("mongodb://mongodb:27017");
		if (!checkDatabase($manager, $database) && !checkCollection($manager, $database, $collection)){

			//echo "databaseRead: $database, $collection";
			$documents = 0;
			switch ($collection){

				case 'skills':
					$arr = datadbaseFind($manager, $database, $collection, 'names', '^'.$searchkey);
					break;

				case 'users':
				case 'users_activities':

					//////////////////////////////////
					// USERS
					//////////////////////////////////
					$collection1 = 'users';
					if (strpos($searchkey, '@') === false){
						// NORMAL SEARCH
						$documents = datadbaseFind($manager, $database, $collection1, 'username', '^'.$searchkey);
						if (!$documents){
							$documents = datadbaseFind($manager, $database, $collection1, 'email', $searchkey);
						}
					} else {
						// EMAIL SEARCH
						$documents = datadbaseFind($manager, $database, $collection1, 'email', $searchkey);
					}
					foreach ($documents as $key => $value){
						array_push($arr,
							array(
								'user_id' => $value->user_id,
								'img_id' => $value->img_id,
								'username' => $value->username,
								'email' => $value->email
							)
						);
					}
					//////////////////////////////////
					// ACTIVITIES
					//////////////////////////////////
					if ($collection == 'users_activities' && !$documents){
						$collection1 = 'activities';
						// NORMAL SEARCH
						$documents = datadbaseFind($manager, $database, $collection1, 'title', $searchkey);
						foreach ($documents as $key => $value){
							array_push($arr,
								array(
									'act_id' => $value->act_id,
									'img_id' => $value->img_id,
									'title' => $value->title,
									//'email' => $value->email
								)
							);
						}
					}

					break;
			}
		}
		$output['results'] = $arr;
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////

function uploadImg(){
	global $database, $error, $type, $email, $pwd, $error, $output;

	//$email = $img_id = 'alantypoon@gmail.com'; $file = 'batman.jpg'; // testing only
	$result = 0;
	//if (!isset($_REQUEST['img_id'])){
	//	$error = "img_id is missed";
	//} else
	if (!isset($_FILES['file'])){
		$error = "no file";
	} else if (!isset($_FILES['file']['error'])){
		$error = "no file error";
	} else {

		$user_id = isset($_REQUEST['user_id']) ? intval($_REQUEST['user_id']) : 0;
		$act_id = isset($_REQUEST['act_id']) ? intval($_REQUEST['act_id']) : 0;
		$img_id = isset($_REQUEST['img_id']) ? intval($_REQUEST['img_id']) : 0;
		if ($img_id == ''){
			$img_id = 0;
		} else if ($img_id != '' && is_numeric($img_id)){
			$img_id = intval($img_id);
		}
		// GENERATE NEW IMG ID
		if (!$img_id){
			//$img_id = datadbaseFindAndInc($database, 'sequences', 'img_id');
			$img_id = getNewSequenceID('img_id', 'images');
		}
		$email = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';

		// GET FILE PATH
		$file = $_FILES['file']['tmp_name'];
		if (!$file){
			$error = "No file";
		}

		// CHECK FILE ERROR
		if (!$error){
			switch ($_FILES['file']['error']) {
					case UPLOAD_ERR_OK:						break;
					case UPLOAD_ERR_NO_FILE: 			$error = "No file sent";							break;
					case UPLOAD_ERR_INI_SIZE:
					case UPLOAD_ERR_FORM_SIZE:		$error = "Exceeded filesize limit";		break;
					default:											$error = "Unknown error";							break;
			}
		}
		// CHECK FILE SIZE
		if (!$error){
			//$filesizelimit = 16000000;	// 16MB
			$filesizelimit = 0; // unlimited
			if ($filesizelimit && $_FILES['file']['size'] > $filesizelimit) {
				$error = "Exceeded filesize limit $filesizelimit";
			}
		}
		// CHECK MIME_TYPE
		$ext = '';
		if (!$error){
			// DO NOT TRUST $_FILES['file']['mime'] VALUE !! Check MIME Type by yourself. extension=php_fileinfo.dll
			$finfo = new finfo(FILEINFO_MIME_TYPE);
			$ext = array_search(
				$finfo->file($file), array(
					'jpg' => 'image/jpeg',
					'png' => 'image/png',
					'gif' => 'image/gif',
				), true
			);
			if ($ext === false){
				$error = "Invalid file format";
			}
		}
		if (!$error){
			// resize to default size
			$IMG_SIZE = 156;
			$im = new imagick(realpath($file).'[0]');
			$w = $im->getImageWidth();
			$h = $im->getImageHeight();
			//$r = $w / $h;
			//$output['width'] = $w;
			//$output['height'] = $h;
			//$output['ratio'] = $r;
			//echo $w . 'x' . $h . ' ' . $r;
			if ($user_id){
				/////////////////////////////////
				// USER: CROP TO SQUARE
				// PRESERVE COLORFUL BACKGROUND
				/////////////////////////////////
				if ($w > $h){
					$im->cropImage($h, $h, ($w - $h)/2, 0);
				} else if ($h > $w){
					$im->cropImage($w, $w, 0, ($h - $w)/2);
				}
				if ($w != $IMG_SIZE){
					$im->resizeImage($IMG_SIZE, $IMG_SIZE, 1, 0);
				}
				$data = $im->getImageBlob();
			} else {
				//////////////////////////////////
				// ACTIVITY: ENLARGE WITH CANVAS
				// PRESERVE MOST OF DETAILS
				//////////////////////////////////
				//echo "$file $ext $w x $h";
				$canvas = new Imagick();
				$x = 0; $y = 0;
				if ($w > $h){
					$canvas->newImage($w, $w, new ImagickPixel('white'));
					$y = ($w - $h) / 2;
				} else {//if ($h > $w){
					$canvas->newImage($h, $h, new ImagickPixel('white'));
					$x = ($h - $w) / 2;
				}
				$canvas->setImageFormat($ext);
				$canvas->compositeImage($im, imagick::COMPOSITE_OVER, $x, $y);
				$data = $canvas->getImageBlob();
			}
			$img_bson = new MongoDB\BSON\Binary($data, MongoDB\BSON\Binary::TYPE_GENERIC);
			$result = databaseInsertOrUpdate($database, 'images', ['img_id' => $img_id], ['image' => $img_bson]);
			if ($user_id){
				$result = databaseInsertOrUpdate($database, 'users', ['user_id' => $user_id], ['img_id' => $img_id]);
			}
			if ($act_id){
				$result = databaseInsertOrUpdate($database, 'activities', ['act_id' => $act_id], ['img_id' => $img_id]);
			}
			$output['user_id'] = $user_id;
			$output['img_id'] = $img_id;
			$output['file'] = $file;
		}
	}
	return $result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function downloadImg(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$nooutput = 0;
	if (!isset($_REQUEST['img_id'])){
		$error = "img_id is missed";
	} else {
		$img_id = intval($_REQUEST['img_id']);
		$documents = databaseRead($database, 'images', ['img_id' => $img_id]);
		if (sizeof($documents) > 0){
			$root = $documents[0]->image->getData();
			$data = $root;
		} else {
			$im = new imagick(realpath("./images/new_user.png").'[0]');
			$data = $im->getImageBlob();
		}
		ob_clean();	// remove unwanted buffer before
		header('Content-Type: image/jpg');	// or png (it doesn't really matter);
		echo $data;
		$nooutput = 1;
		//{
		//	ob_clean();	// remove unwanted buffer before
		//	header('Content-Type: image/jpg');	// or png (it doesn't really matter);
		//	echo $data;
		//	$nooutput = 1;
		//} //else {
		//	$error = "img_id=$img_id not found";
		//}
	}
	return $nooutput;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function checkUsers(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	if (!isset($_REQUEST['users'])){
		$error = "no users";
	} else {
		$users1 = $_REQUEST['users'];
		//print_r($users1);
		//$users1 = array(1,2,3, 'alan@gmail.com');
		$users2 = array();
		foreach ($users1 as $key => $value){
			//echo "$value<br/>";
			$user_id = 0;
			$documents = 0;
			if (gettype($value) && strpos($value, '@') == FALSE){
				// non-email (user_id)
				$documents = databaseRead($database, 'users', ['user_id' => intval($value)]);
			} else {
				// email
				$documents = databaseRead($database, 'users', ['email' => $value]);
				if (!$documents || !sizeof($documents)){
					array_push($users2,
						array('email' => $value, 'position' => '(Unregistered)')
					);
				}
			}
			if (!$user_id && $documents && sizeof($documents) > 0){
				$user = $documents[0];
				$user_id = intval($user->user_id);
				// check duplicate http://stackoverflow.com/questions/6661530/php-multi-dimensional-array-search
				$key = array_search($user_id, array_column($users2, 'user_id'));
				//echo "$user_id=$key, ";
				if ($key === FALSE){
					array_push($users2,
						array(
							'user_id' 	=> $user_id,
							'img_id' 		=> $user->img_id,
							'username' 	=> $user->username,
							'email' 		=> $user->email,
							'position' 	=> isset($user->position)?$user->position:'',
							'location' 	=> isset($user->location)?$user->location:'',
						)
					);
				}
			}
		}
		$output['users'] = $users2;
	}
}

////////////////////////////////////////////////////////////////////////////

function getUserDoc(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	if (!isset($_REQUEST['user_id'])){
		$error = "no user_id";
	} else {
		$user_id = intval($_REQUEST['user_id']);
		$documents = databaseRead($database, 'users', ['user_id' => $user_id]);
		if ($documents && sizeof($documents) > 0){
			$output['user'] = $documents[0];
		} else {
			$error = "no such a user";
		}
	}
}

////////////////////////////////////////////////////////////////////////////

function getActDoc(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	if (!isset($_REQUEST['act_id'])){
		$error = "no act_id";
	} else {
		$act_id = intval($_REQUEST['act_id']);
		$documents = databaseRead($database, 'activities', ['act_id' => $act_id]);
		if ($documents && sizeof($documents) > 0){
			$output['activity'] = $documents[0];
		} else {
			$error = "no such an activity";
		}
	}
}

/////////////////////////////////////////////////////
// fixed for various type of input 20161009

function item_sort($a, $b){
	global $sPresent;
	if (isset($a['end'])){
		if ($a['end'] == $sPresent && $b['end'] != $sPresent){
			return 1;
		} else if ($a['end'] != $sPresent && $b['end'] == $sPresent){
			return -1;
		}
	}
	// both present or both not present
	if (isset($a['start'])){
		return strcmp($a["start"], $b["start"]);
	} else if (isset($a['date'])){
		return strcmp($a["date"], $b["date"]);
	} else {
		return 0;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function updateActivityToUser($user_id, $activity, $position){
	global $database, $error, $type, $email, $pwd, $error, $output, $template_user_activity;
	$act_id = intval($activity['act_id']);
	//$act_id = 1;
	// update the coordinator with this activity
	$documents = databaseRead($database, 'users', ['user_id' => $user_id]);
	if ($documents && sizeof($documents) > 0){
		$user = json_decode(json_encode($documents[0]), true);
		$activities = $user['profile']['activity'];
		$user_activity = 0;
		$index = -1;
		foreach ($activities as $index_temp => $activity_temp){
			if ($activity_temp['act_id'] == $act_id){
				$index = intval($index_temp);
				// CREATE WITH THE TEMPLATE
				$user_activity = $activity_temp;
				break;
			}
		}
		if (!$user_activity){
			$user_activity = $template_user_activity;
		}
		// UPDATE DATA
		$user_activity['act_id']		= $act_id;
		$user_activity['title']			= $activity['title'];
		$user_activity['act_type']	= $activity['act_type'];
		$user_activity['position']	= $position;
		$user_activity['start']			= $activity['start'];
		$user_activity['end']				= $activity['end'];

		if ($index == -1){
			array_push($activities, $user_activity);			// CREATE
		} else {
			$activities[$index] = $user_activity;					// EDIT
		}
		$result = databaseUpdate($database, 'users', ['user_id' => $user_id], ['$set' => ['profile.activity' => $activities]]);
		$output['index'] = $index;
	} else {
		$error = "no user_id";
	}
}

/////////////////////////////////////////////////////

function delActDoc(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	if (!isset($_REQUEST['act_id'])){
		$error = "no act_id";
	} else {
		$act_id = intval($_REQUEST['act_id']);
		$output['act_id'] = $act_id;
		$documents = databaseRead($database, 'activities', ['act_id' => $act_id]);
		if ($documents && sizeof($documents) > 0){
			// remove from users
			removeActivityFromUser($act_id);
			// remove from activities
			databaseDelete($database, 'activities', ['act_id' => $act_id]);
		} else {
			$error = "no such an activity";
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////

function removeActivityFromUser($act_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $template_user_activity;
	$act_id = intval($act_id);
	$documents = databaseRead($database, 'users', []);
	$users = [];
	for ($i = 0; $i < sizeof($documents); $i++){
		$user = json_decode(json_encode($documents[$i]), true);
		$activities = $user['profile']['activity'];
		foreach ($activities as $index => $activity){
			$act_id2 = intval($activity['act_id']);
			if ($act_id2 == $act_id){
				$user_id = intval($user['user_id']);
				// FOR LOGGING PURPOSE
				array_push($users, $user_id);
				// REMOVE DOCUMENT FROM THE ARRAY WORK
				$criteria = ['user_id' => $user_id];
				$update =
					['$pull' =>
						[
							"profile.activity" =>
								[
									'act_id' => $act_id
								]
						]
				];
				$result = databaseUpdate($database, 'users', $criteria, $update);
				break;
			}
		}
	}
	$output['users'] = join(', ', $users);
}

//////////////////////////////////////////////////////////////

function saveActivity(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	if (!isset($_REQUEST['activity'])){
		$error = 'no activity';
		return;
	}
	$activity = $_REQUEST['activity'];
	//print_r($activity); var_dump($activity);
	$act_id = intval($activity['act_id']);
	if ($act_id){
		$documents = databaseRead($database, 'activities', ['act_id' => $act_id]);
		if (!$documents){
			$error = 'activity not found';
		} else {
			// remove the activity
			$result = databaseDelete($database, 'activities', ['act_id' => $act_id]);
			// reinsert the activity
			$activity['act_id'] = $act_id;
			$result = databaseInsert($database, 'activities', $activity);
		}
	} else if (!$act_id){
		// get the new act_id
		$act_id = getNewSequenceID('act_id', 'activities');
		// create the activity
		$activity['act_id'] = $act_id;
		$result = databaseInsert($database, 'activities', $activity);
	}
	if (!$error){
		// coordinator
		$user_id = intval($activity['coordinator']);
		updateActivityToUser($user_id, $activity, 'coordinator');//, 1, 0, 0);
		$output['user_id'] = $user_id;
	}
	$output['act_id'] = $act_id;
}

/////////////////////////////////////////////////////////////////////

function signUp(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user;
	$username = ''; $gender = ''; $birthday = ''; $resp = ''; $captcha = 0;
	if (isset($_REQUEST['g-recaptcha-response'])){
		$resp = $_REQUEST['g-recaptcha-response'];
	}
	if ($resp == ''){

		$error = 'reCaptcha is not set';

	} else {

		$recaptcha = new \ReCaptcha\ReCaptcha($secret);

		$result = $recaptcha->verify($resp, $_SERVER['REMOTE_ADDR']);
		//if (!$result->isSuccess()){
			//$error = 'reCaptcha is failed: ' . $_SERVER['REMOTE_ADDR'];
		//} else
		{
			if (isset($_REQUEST['name'])){
				$username = $_REQUEST['name'];
			}
			if (isset($_REQUEST['gender'])){
				$gender = $_REQUEST['gender'];
			}
			if (isset($_REQUEST['birthday'])){
				$birthday = $_REQUEST['birthday'];
			}
			if ($username == ''){

				$error = 'username is not defined';

			} else if ($email == ''){

				$error = 'user is not defined';

			} else if ($pwd == ''){

				$error = 'password is not defined';

			} else if ($gender == ''){

				$error = 'gender is not defined';

			} else {

				$documents = databaseRead($database, 'users', ['email'=>$email]);
				$found = sizeof($documents);
				if ($found){

					$error = 'This email has already been signed up.';

				} else {

					// found a unique id
					// http://stackoverflow.com/questions/1352671/unique-ids-with-mongodb
					//$user_id = datadbaseFindAndInc($database, 'sequences', 'user_id');
					$user_id = getNewSequenceID('user_id', 'users');

					// insert to the database
					$secret_token = create_guid();
					$datetime = getDateTime();
					$user = jsonclone($template_user);
					$user['user_id'] = $user_id;
					//$user['user_id_md5'] = md5($user_id);
					$user['email'] = $email;
					$user['pwd'] = $pwd;
					$user['username'] = $username;
					$user['gender'] = $gender;
					$user['birthday'] = $birthday;
					$user['confirmed_email'] = 0;
					$user['secret_token'] = $secret_token;
					$user['last_send_confirm'] = $datetime;

					$result = databaseInsert($database, 'users', $user);

					// Send Email
					sendConfirmEmail($username, $email, $secret_token);
				}
			}
		}
	}
}

/////////////////////////////////////////////////////////////////////

function sendConfirmEmail($username, $email, $secret_token){
	$sender = array('yfolio@hku.hk' => 'Yolofolio');
	$recipients = $email;
	//$server = $_SERVER['HTTP_HOST'];
	//$url = "http://$server/login.php?secret_token=$secret_token";
	$server = my_server_url();
	// fix redirection
	if ($server == 'http://yolofolio2.cetl.hku.hk:3389'){
		$server = 'https://yolofolio2.cetl.hku.hk:18443';
	}
	$url = "$server/login.php?secret_token=$secret_token";
	$subject = 'Yolofolio Account Confirmation';
	$body = "Dear $username,\r\n\r\nThank you for signing up with Yolofolio. Please click the following link to continue:\r\n\t$url\r\n\r\nBest regards,\r\n\r\nYolofolio Team";
	sendEmail($sender, $recipients, $subject, $body);
}

/////////////////////////////////////////////////////////////////////

function sendResetPwdEmail($username, $email, $secret_token){
	$sender = array('yfolio@hku.hk' => 'Yolofolio');
	$recipients = $email;
	$server = my_server_url();
	//echo $server;
	// fix redirection
	if ($server == 'http://yolofolio2.cetl.hku.hk:3389'){
		$server = 'https://yolofolio2.cetl.hku.hk:18443';
	}
	$url = "$server/login.php?reset_pwd=$secret_token&email=$email";
	$subject = 'Yolofolio Reset Password Request';
	$body = "Dear $username,\r\n\r\nWe have received a request to reset your password. " .
					"Please click the following link to continue:\r\n\t$url\r\n\r\n".
					"In case if the request is not made by you, please contact us.\r\n\r\n".
					"Best regards,\r\n Yolofolio Team";
	sendEmail($sender, $recipients, $subject, $body);
}

///////////////////////////////////////////////////////////////////////////////////////////

function resetPwd(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user;
	if (isset($_REQUEST['email'])){
		$username = $_REQUEST['email'];
	}
	if ($email == ''){
		$error = 'user is not defined';
	} else {
		$documents = databaseRead($database, 'users', ['email'=>$email]);
		$size = $documents ? sizeof($documents) : 0;
		$output['num_of_users'] = $size;
		//echo $size;
		if ($size == 0){
			$error = "We cannot find the email <b>$email</b> in our accounts.";
		} else if ($size > 1){
			$error = 'More than one of this email has been registered. Please contact system administrator';
		} else {

			$user = json_decode(json_encode($documents[0]), true);

			$now = getDateTime();

			$send_confirm = 0;
			$send_confirm = 1;	// for testing only
			if (isset($user['last_send_confirm'])){
				$last_send_confirm = $user['last_send_confirm'];
				$next_send_confirm = new DateTime($last_send_confirm);
				date_add($next_send_confirm, date_interval_create_from_date_string('1 hour'));
				$next_send_confirm2 = date_format($next_send_confirm, 'Y-m-d H:m:s');
				//echo $now . '+' . $next_send_confirm2;
				if ($now > $next_send_confirm2){
					$send_confirm = 1;
				}
			} else {
				$send_confirm = 1;
			}
			if ($send_confirm){

				// UPDATE THE SEND TIME
				$result = databaseUpdate($database, 'users', ['email' => $email], ['$set' => ['last_send_confirm' => $now]]);

				// INSERT TO THE DATABASE
				$secret_token = create_guid();
				$result = databaseUpdate($database,	'users',	['email' => $email], ['$set' => ['secret_token' => $secret_token]]);
				// Send Email
				sendResetPwdEmail($username, $email, $secret_token);

			} else {
				$error .= ' The last email was sent on ' . $last_send_confirm . ' and resend can only be processed 1 hour after this time.';
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////
// findDoc (dangerous)
// - find mongodb sub document thru the find function
//
// http://stackoverflow.com/questions/15081463/how-to-write-mongo-query-to-find-sub-document-with-condition
// https://docs.mongodb.com/v3.2/reference/method/db.collection.find/#examples
// http://php.net/manual/en/class.mongodb-driver-query.php
// - $options = [ 'projection' => ['_id' => 0],];
// e.g. db.getCollection('users').find({user_id:1}, {_id:0, 'profile.education':1}) // query, projection
// https://github.com/mongodb/mongo-php-driver/issues/238
////////////////////////////////////////////////////////////////////////////////////////////////
function findDoc(){
	global $debug_svrop, $input, $output, $error, $database;
	$collection = isset($_REQUEST['collection']) ? $_REQUEST['collection'] : '';
	$key_field = isset($_REQUEST['key_field']) ? $_REQUEST['key_field'] : '';
	$key_value = isset($_REQUEST['key_value']) ? $_REQUEST['key_value'] : '';
	$path =  isset($_REQUEST['path']) ? $_REQUEST['path'] : '';

	$criteria = [$key_field => intval($key_value)];
	$options = [];
	if ($path != ''){
		$options = [ 'projection' => ['_id' => 0, $path => 1] ];
	}
	$documents = databaseRead($database, $collection, $criteria, $options);
	if ($documents && sizeof($documents) > 0){
		$output['doc'] = json_decode(json_encode($documents[0]), true);
	}
	$output['items'] = sizeof($documents);
	$output['debug'] = "collection=$collection key_field=$key_field key_value=$key_value path=$path";
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function newSequence(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$field = getQS('field');
	$new_seq = datadbaseFindAndInc($database, 'sequences', $field);
	$output['new_seq'] = $new_seq;
}

///////////////////////////////////////////////////////////////////////////////////////////

function getNewSequenceID($id_name, $collection){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$new_id = 0;
	$retry = 1000;
	while ($retry-- > 0){
		// generate a new id
		$new_id = intval(datadbaseFindAndInc($database, 'sequences', $id_name));
		if (is_nan($new_id) || $new_id == 0){
			// impossible
			$new_id = 0;
		} else {
			// check if this is used already
			$documents = databaseRead($database, $collection, [$id_name => $new_id]);
			if (!$documents || !sizeof($documents)){
				// not used yet
				wlog("generate new $id_name=$new_id on $database $collection");
				break;
			} else {
				wlog("WARNING duplicate $id_name=$new_id from $database $collection");
			}
		}
	}
	return intval($new_id);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////

function getNtwk(){
	global $debug_svrop, $input, $output, $error, $database;
	//$user_id = getQS('user_id');
	$arr = [];
	$documents = databaseRead($database, 'users', [], [ 'projection' => ['_id' => 0, "user_id" => 1, "username" => 1, "position" => 1, "location" => 1, 'img_id' => 1 ] ]);
	$doc = json_decode(json_encode($documents), true);
	//print_r($doc);
	//foreach ($doc as $key => $value){
	//	array_push($arr, intval($value['user_id']));
	//}
	//sort($arr);
	//$output['users'] = $arr;
	$output['users'] = $doc;
}

?>
