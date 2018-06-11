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
$output = array();

// common
include "common.php";
include "database.php";
include "svrop_xeditable.php";
include "svrop_activity.php";

include "svrop_assessment.php";
include "svrop_impression2.php";
include "svrop_email.php";
include "svrop_img.php";
include "svrop_uploader.php";
include "svrop_notify.php";
include "svrop_peerassessee.php";
include "svrop_messenger.php";
include "svrop_whatsup.php";
include "svrop_peers.php";
include "svrop_user_group.php";
include "svrop_calcgs.php";
include "svrop_import.php";
include "svrop_blog.php";

//echo my_server_url(); exit();
include "svrop_test.php";

if (file_exists('recaptcha.php')){
	// full version
	include "database_templates.php";
	include "recaptcha.php";
	// recaptcha
	require_once __DIR__ . '/recaptcha-master/src/autoload.php';
/*
	// http://stackoverflow.com/questions/29056472/google-recaptcha-2-fatal-error-class-recaptcha-requestmethod-post-not-found
	require_once('/recaptcha-master/src/ReCaptcha/ReCaptcha.php');
	require_once('/recaptcha-master/src/ReCaptcha/RequestMethod.php');
	require_once('/recaptcha-master/src/ReCaptcha/RequestParameters.php');
	require_once('/recaptcha-master/src/ReCaptcha/Response.php');
	require_once('/recaptcha-master/src/ReCaptcha/RequestMethod/Post.php');
	require_once('/recaptcha-master/src/ReCaptcha/RequestMethod/Socket.php');
	require_once('/recaptcha-master/src/ReCaptcha/RequestMethod/SocketPost.php');
*/

}

// WRITE ERROR LOG
ini_set("log_errors", 1);
ini_set("error_log", $logfile);
//error_log( "Hello, errors!" );
//wlog('called');

// DEBUGGING
$debug_svrop = 2;
if ($debug_svrop >= 3){
	echo "*****<br/>";
	echo "METHOD=".var_export($_SERVER['REQUEST_METHOD'], true)."<br>";
	echo "GET=".var_export($_GET, true)."<br>";
	echo "POST=".var_export($_POST, true)."<br>";
	echo "*****"."<br>";
} else if ($debug_svrop >= 2){
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

	$act_id = getQS('act_id');
	if ($act_id){
		$act_id = intval($act_id);
	}
	$user_id = getQS('user_id');
	if ($user_id){
		$user_id = intval($user_id);
	}
	$email = getQS('email');
	$pwd = getQS('pwd');
	$reset_pwd = getQS('reset_pwd');

	if ($debug_svrop){
		wlog($user . ',' . $type . '...start');
	}

	$error = '';
	$nooutput = 0;
	switch ($type){
		//case 'find_doc':						findDoc();									break;	// dangerous

		case 'login':
		case 'check_login':					checkLogIn();								break;
		case 'signup':							signUp(); 									break;
		case 'xeditable':						xEditable();								break;
		case 'dl_img':							$nooutput = downloadImg();	break;
		case 'ul_img':							uploadImg();	 							break;
		case 'profile_order':				profileOrder();							break;
		case 'activity_sharing':		activitySharing();					break;
		case 'new_sequence':				newSequence();							break;
		case 'find_field':					find_field();								break;
		case 'check_users':					checkUsers();								break;

		case 'get_userdoc':					getUserDoc();								break;
		case 'reset_pwd':						resetPwd();									break;
		//case 'get_ntwk':						get_ntwk();									break;

		// MEDIA
		case 'ul_media':							uploadMedia();							break;
		//case 'get_media':						getMedia();									break;
		case 'get_gallery_media':			getGalleryMedia();									break;
		case 'remove_media':					removeMedia();							break;

		// ACTIVITY
		case 'save_activity':					saveActivity();							break;
		case 'get_activity':					getActivity();							break;
		case 'delete_activity':				deleteActivity();						break;
		//case 'publish_activity':		publishActivity();					break;	// deprecated by savecactivity2() with getQS('publish') == 1;

		// WORK-FLOW
		case 'save_peerassessors':		savePeerAssessors();				break;
		case 'save_assessment':				saveAssessment();						break;
		case 'submit_impression':			submitImpression();					break;
		case 'submit_impression2':		submitImpression2();					break;

		// NOTIFICATION
		case 'notify_token':					notifyToken();							break;
		case 'send_notify':						sendNotify();								break;

		// PEER ASSESSMENT
		case 'get_peerassessees_arr':	getMyPeerAssesseesArr();					break;
		case 'get_actdesc':						getActDesc();								break;

		// MSG
		case 'save_message':				saveMessage();							break;
		case 'delete_message':			deleteMessage();						break;

		case 'mark_readmsg': 				markReadMsg();							break;
		case 'check_users_acts':		checkUsersActs();						break;

		case 'save_media_desc':
			$media_desc_hash = getQs('media_desc_hash');
			saveMediaDesc($media_desc_hash);											break;

		case 'read_whatsup':				$nooutput = read_whatsup();	break;
		case 'write_whatsup':				write_whatsup();						break;
		case 'write_whatsup2':			write_whatsup2();						break;
		case 'del_whatsup':					del_whatsup();							break;

		case 'add_peer':						add_peer();									break;
		case 'rm_peer':							rm_peer();									break;

		case 'show_user_grp':				showUserGroup();						break;

		case 'add_whatsup_comment':	addWhatsupComment();				break;
		case 'toggle_whatsup_like': toggleWhatsupLike();				break;
		case 'del_whatsup_comment': delWhatsupComment();				break;

		// blog
		case 'del_blg_item':				deleteBlgItem();						break;
		case 'read_blog': 					$nooutput = read_blog();		break;
		case 'toggle_blog_like':		toggleBlogLike();						break;
		case 'add_blog_comment':		addBlogComment();						break;
		case 'del_blog_comment':		delBlogComment();						break;

		case 'get_impr_comment':		getImprComment();						break;
		case 'update_blg':					updateBlg();								break;

		// TESTS
		case 'sendemailtest':
			sendEmail_confirmation('Alan Poon', 'alantypoon@gmail.com', '12345');
			break;

		case 'sendnotifytest':
			sendNotifyTest();
			break;

		case 'importusers':
		case 'importuserstest':
			importUsersFromFile();
			break;

		case 'getreceiverstest':
			$user_id = 1;
			//$receivers = [];
			$receivers = ['mypeers', 'a_118'];
			$user_ids = getReceivers($user_id, $receivers);
			print_json($user_ids);
			break;

		case 'calcgstest':
			calcgs_test();
			break;

		case 'duplicate_act':
			duplicate_act();
			break;

		case 'resubmit_ass':
			resubmit_ass();
			break;

		case 'delete_rubric':
			deleteRubric();
			break;

		case 'show_skill':					showSkill();							break;
		case 'show_act':						showAct();								break;

		default:
			$error = 'wrong type';
			break;
	}

	//$output['1'] = md5(1);	$output['2'] = md5(2);	$output['3'] = md5(3);
	if ($nooutput == 0){
		$output['server_time'] = getDateTime();
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

function checkLogIn(){
	global $database, $error, $type, $email, $pwd, $error, $output, $reset_pwd, $test_qs;
	$debug = isset($test_qs);

	//print_json($reset_pwd);
	if ($email == ''){
		$error = 'user is not defined';

	} else if ($pwd == ''){
		$error = 'password is not defined';

	} else {

		// find user from database
		$filters = ['email' => $email];
		$documents = databaseRead($database, 'users', $filters);

		if ($debug){
			echo $database;
			print_json($filters);
			print_json($documents);
		}

		$found = sizeof($documents);
		if (!$found){

			$error = 'The email is not found.';

		} else if ($found > 1){

			$error = 'The email has more than one occurrence.';	// IMPOSSIBLE!

		} else {

			// user
			$user = json_decode(json_encode($documents[0]), true);


			if ($reset_pwd == ''){
				////////////////////////////////////////////
				// CASE 1: CHECK CONFIRMATION
				////////////////////////////////////////////
				$secret_token = getQs('secret_token');
				if ($secret_token != '' && $user['secret_token'] == $secret_token){
					// update memory
					$user['confirmed_email'] = 1;
					$user['secret_token'] = '';
					$updates = ['$set' => [
							'confirmed_email' => 1,
							'secret_token' => '',
							'confirmed_time' => getDateTime()
						]
					];
					$result = databaseUpdate($database, 'users', $filters, $updates);
				}

				// SEND CONFIRMATION AGAIN
				if ($user['confirmed_email'] == 0){	// still not confirmed yet
					$username = $user['username'];
					$email = $user['email'];
					$error = 'This email is not confirmed yet.';

				} else if ($user['pwd'] != $pwd){

					// CHECK NORMAL LOGIN PASSWORD
					$error = 'Wrong password.';
					//$error = 'Wrong password. ' . $user['pwd'] . ' ' . $pwd;
				}

			} else { //if ($reset_pwd != ''){
				////////////////////////////////////////////
				// CASE 2: CHECK RESET PASSWORD
				////////////////////////////////////////////
				// check if it equal to secret_token
				$secret_token = $user['secret_token'];
				if ($secret_token != $reset_pwd){
					$error = "Invalid reset password. You may request it again.";
					//$error = "$secret_token / $reset_pwd";
				} else {
					// successful after reset password, update password now
					$updates = ['$set' => ['secret_token' => '', 'pwd' => $pwd, 'next_send_confirm' => '']];
					$result = databaseUpdate($database, 'users', $filters, $updates);
				}
			}
			if (!$error){
				$output['user'] = $user;
			}
		}
	}
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
	global $database, $error, $user_id, $email, $pwd, $error, $output, $debug_svrop, $sPresent;
	// update position and locaiton for the latest data
	//$criteria = ['email' => $email];
	$filters = ['user_id' => $user_id];
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
			$result = databaseUpdate($database, 'users', $filters, $update);
			$output['position'] = $pos;
			$output['location'] = $loc;
			break;
	}
}

/////////////////////////////////////////////////////

function profileOrder(){
	global $database, $error, $type, $email, $pwd, $error, $output, $debug_svrop;
	$order = getQS('order');
	if (!$order) $order = '0';
	//isset($_REQUEST['order']) ? $_REQUEST['order'] : '0';
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
	global $database, $error, $type, $email, $pwd, $error, $output, $user_id, $col_usr;
	$act_id = intval($_REQUEST['act_id']);
	$sharing = $_REQUEST['sharing'];
	$criteria = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$update = ["profile.activity.$.sharing" => $sharing];
	$output['sharing'] = $sharing;
	$res = databaseUpdate($database, $col_usr, $criteria, ['$set' => $update]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function find_field(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$arr = array();
	//$collection = isset($_REQUEST['collection']) ? $_REQUEST['collection'] : '';
	//$searchkey = isset($_REQUEST['q']) ? $_REQUEST['q'] : '';
	//$searchkey = 'hku';
	$collection = getQs('collection');
	$searchkey = getQs('q');

	//$searchkey = 'tlerg';

	if ($searchkey != ''){
		$manager = new MongoDB\Driver\Manager(MONGODB_URL);
		//if (!checkDatabase($manager, $database)) && !checkCollection($manager, $database, $collection))
		{
			//echo "databaseRead: $database, $collection";
			$documents = 0;
			switch ($collection){

				case 'skills':
					$arr = databaseFind($manager, $database, $collection, 'names', '^'.$searchkey);
					break;

				case 'users':
				case 'users_activities':
///*
					//////////////////////////////////
					// USERS
					//////////////////////////////////
					$collection1 = 'users';
					if (strpos($searchkey, '@') === false){
						// NORMAL SEARCH
						$documents = databaseFind($manager, $database, $collection1, 'username', '^'.$searchkey);
						if (!$documents){
							$documents = databaseFind($manager, $database, $collection1, 'email', $searchkey);
						}
					} else {
						// EMAIL SEARCH
						$documents = databaseFind($manager, $database, $collection1, 'email', $searchkey);
					}
					foreach ($documents as $key => $value){
						array_push($arr,
							array(
/*
								'user_id' => $value->user_id,
								'img_id' => $value->img_id,
								'username' => $value->username,
								'email' => $value->email
*/
								'type' 		=> 'users',
								'id' 			=> $value->user_id,
								'img_id' 	=> $value->img_id,
								'username' 	=> $value->username,
								'email'			=> $value->email,
							)
						);
					}
//*/
					//////////////////////////////////
					// ACTIVITIES
					//////////////////////////////////
///*
					if ($collection == 'users_activities'){
						$collection2 = 'activities';
						// NORMAL SEARCH
						$documents = databaseFind($manager, $database, $collection2, 'title', $searchkey);
						foreach ($documents as $key => $value){
							array_push($arr,
								array(
									'type' 		=> 'activities',
									'id' 			=> $value->act_id,
									'img_id'	=> $value->img_id,
									'title' 	=> $value->title,
								)
							);
						}
					}
					break;
//*/
			}
		}
		$output['results'] = $arr;
	}
}

////////////////////////////////////////////////////////////////////////////

function getUserDoc(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$user_id = intval(getQS('user_id'));
	$options = getQS('options');
	if (!$user_id){
		$error = "no user_id";
	} else {
		if (!$options){
			$options = [];
		}
		$documents = databaseRead($database, 'users', ['user_id' => $user_id], $options);
		if ($documents && sizeof($documents) > 0){
			$output['user'] = $documents[0];
		} else {
			$error = "no such a user";
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


/////////////////////////////////////////////////////////////////////////////////////////////////////
/*
	"impression" : {
			"panelists" : {
					"peer_assessors" : [
							2,
							3,
							8,
							15
					]
			},

*/

function savePeerAssessors(){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $test_qs;
	$act_id = intval(getQS('act_id'));
	$ass_id = intval(getQS('ass_id'));	// if = 0, impression
	$selected = getQS('selected');
	if (gettype($selected) == 'string'){
		$selected = json_decode($selected, true);
	}
	$selected = makeArrayNumbers($selected);

	$collection = "users";
	$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	if ($ass_id == 0){
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// impression (ass_id=0) (done)
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$updates = ['$set' => ['profile.activity.$.impression.panelists.peer_assessors' => $selected ] ];
		// testing
		//$documents = databaseRead($database, $collection, $filters, [ 'projection' => ['_id' => 0, 'profile.activity.$.impression.panelists.peer_assessors' => 1 ] ]);
		//$output['users'] = json_decode(json_encode($documents), true);

	} else {
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// assessment (done)
		// http://stackoverflow.com/questions/14855246/multiple-use-of-the-positional-operator-to-update-nested-arrays
		// https://pythonolyk.wordpress.com/2016/01/17/mongodb-update-nested-array-using-positional-operator/
		// db.getCollection('users').update(
		//    { user_id:1, 'profile.activity.act_id':4},
		//    { $set:{ 'profile.activity.$.assessments.0.panelists.peer_assessors' : [1,2,3]}}
		// ))
		//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		$index = $ass_id - 1;
		$updates = ['$set' => ['profile.activity.$.assessments.'.$index.'.panelists.peer_assessors' => $selected ] ];
	}

	if (isset($test_qs)){
		print_json([
				'act_id'=> $act_id,
				'ass_id'=> $ass_id,
				'user_id'=> $user_id,
				'selected'=> $selected,
				'filters'=> $filters,
				'updates'=> $updates,
		]);
		//exit();
	}
	$result = databaseUpdate($database, $collection, $filters, $updates);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getUserByID($users, $user_id){
	$user = 0;
	if (is_array($users)){
		for ($i = 0; $i < sizeof($users); $i++){
			$user2 = $users[$i];
			$user_id2 = $user2['user_id'];
			if ($user_id == $user_id2){
				$user = $user2;
				break;
			}
		}
	} else if (isset($users[$user_id])){
		$user = $users[$user_id];
	}
	return $user;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getActivityByID($activities, $act_id){
	$activity = 0;
	if (is_array($activities)){
		for ($i = 0; $i < sizeof($activities); $i++){
			$activity2 = $activities[$i];
			$act_id2 = $activity2['act_id'];
			if ($act_id == $act_id2){
				$activity = $activity2;
				break;
			}
		}
	} else if (isset($$activities[$act_id])){
		$activity = $$activities[$act_id];
	}
	return $activity;
}

/////////////////////////////////////////////////////////////////////

function signUp(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_usr;
	$username = ''; $gender = ''; $birthday = ''; $resp = ''; $captcha = 0;
	$resp = getQs('g-recaptcha-response');
	if ($resp == ''){

		$error = 'reCaptcha is not set';

	} else {

		// RECAPTCHA
		if ($secret != ''){
			$recaptcha = new \ReCaptcha\ReCaptcha($secret);
			$remote_addr = $_SERVER['REMOTE_ADDR'];
			$result = $recaptcha->verify($resp, $remote_addr);
			$success = $result->isSuccess();
		} else {
			$success = 1;
		}
		//$success = 1;
		if (!$success){

			$error = 'reCaptcha is failed: ' . $remote_addr;

		} else {

			// CHECK OTHER PARAMS
			$username = getQs('name');
			$gender = getQs('gender');
			$birthday = getQs('birthday');

			if ($username == ''){

				$error = 'username is not defined';

			} else if ($email == ''){

				$error = 'user is not defined';

			} else if ($pwd == ''){

				$error = 'password is not defined';

			} else if ($gender == ''){

				$error = 'gender is not defined';

			} else if ($birthday == ''){

				$error = 'birthday is not defined';

			} else {

				$user = checkUserExists($email);
				if ($user && $user->confirmed_email){

					//$error = 'User is confirmed';
					$error = "This email has already been registered";

				} else {

					// not exist or not confirmed
					$secret_token = '';
					if ($user && $user->secret_token != ''){
						$secret_token = $user->secret_token;
					} else {
						$secret_token = create_guid();
					}
					if (!$user){
						createUser($email, $pwd, $username, $gender, $birthday, 0, $secret_token);
					} else {
						updateUser($user, $email, $pwd, $username, $gender, $birthday, $secret_token);
					}

					// send confirmation
					sendEmail_confirmation($username, $email, $secret_token);
				}
			}
		}
	}
}

/////////////////////////////////////////////////////////////////////////////////////

function getActDesc(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $col_act;
	//$username = ''; $gender = ''; $birthday = ''; $resp = ''; $captcha = 0;
	$act_id = intval(getQs('act_id'));
	// READ THE IMAGE
	$documents = databaseRead($database, $col_act,
		[ 'act_id' => $act_id ],
		[ 'projection' => ['_id' => 0, 'desc' => 1]]
	);
	if (sizeof($documents) > 0)
	{
		$output['desc'] = $documents[0]->desc;
	}
}

///////////////////////////////////////////////////////////////////////////////////////////

function resetPwd(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user;
	$username = getQS('email');
	if ($email == ''){
		$error = 'user is not defined';
	} else {
		$filters = ['email' => $email];
		$options = [ 'projection' => ['_id' => 0, 'confirmed_email' => 1, 'secret_token' => 1, 'next_send_confirm' => 1, 'username' => 1, 'email' => 1]];
		$documents = databaseRead($database, 'users', $filters, $options);
		$size = $documents ? sizeof($documents) : 0;
		$output['num_of_users'] = $size;
		if ($size == 0){
			$error = "We cannot find the email <b>$email</b> in our accounts.";
		} else {
			$user = $documents[0];
			if ($size > 1){
				$error = 'More than one of this email has been registered. Please contact system administrator';
			} else if ($user->confirmed_email == 0){
				$error = 'The email has not been confirmed yet.';
			} else {
				$user = json_decode(json_encode($documents[0]), true);

				//print_json($user);

				// CHECK next_send_confirm
				$next_send_confirm = isset($user['next_send_confirm']) ? $user['next_send_confirm'] : 0;
				if ($next_send_confirm && $next_send_confirm < getDateTime()){
					$next_send_confirm = 0;
				}
				//$next_send_confirm = 0;	// testing

				if (!$next_send_confirm){

					// generate a token
					$secret_token = !isset($user['secret_token']) || $user['secret_token'] == '' ? create_guid() : $user['secret_token'];

					// Send Email
					$result = sendEmail_forgotpwd($user['username'], $user['email'], $secret_token);

					if ($result > 0){

						// UPDATE USER INFORMATION
						$result = databaseUpdate($database,	'users',	['email' => $email], ['$set' =>
							[
								'secret_token' => $secret_token,
								'next_send_confirm' => getNextSendConfirm(),
							]
						]);
					}
				}	else {
					// TRY AGAIN LATER
					$error = "Your request was just sent earlier. Please try again after $next_send_confirm.";
				}
			}
		}
	}
}

/////////////////////////////////////////////////////////////////////////////////////

function getNextSendConfirm(){
	$datetime = new DateTime(getDateTime());
	date_add($datetime, date_interval_create_from_date_string('1 hour'));
	$next_send_confirm = date_format($datetime, 'Y-m-d H:m:s');
	return $next_send_confirm;
}

////////////////////////////////////////////////////////////////////////////

function showSkill(){
	global $database, $error, $type, $email, $pwd, $error, $output, $user_id;
	//print_r($_REQUEST);
	$label = getQS('label');
	$show = getQS('show') == 1 ? 1 : 0;
	$field = "skills.$label.show";
	//echo "$field=>$show";
	//$res = databaseUpdate($database, 'users', ['email' => $email], ['$set' => [$field => $show]]);
	$res = databaseUpdate($database, 'users', ['user_id' => $user_id], ['$set' => [$field => $show]]);
}

////////////////////////////////////////////////////////////////////////////

function showAct(){
	global $database, $error, $type, $email, $pwd, $error, $output, $user_id;
	//print_r($_REQUEST);
	$act_id = intval(getQS('act_id'));
	$show = getQS('show') == 1 ? 1 : 0;
	$criteria = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$update = ['$set' => ['profile.activity.$.show' => $show]];
	$res = databaseUpdate($database, 'users', $criteria, $update);
}

?>
