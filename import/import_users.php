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

$dummy_birthday = '1999-01-01';

$sPresent = "Present";
$col_usr = 'users';
$col_act = 'activities';
$output = array();

// common
include "../dev/common.php";
include "../dev/database.php";
include "../dev/database_templates.php";
include "../dev/svrop_import.php";

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


define('MAX_REDUCED_WIDTH', 800);
define('MAX_REDUCED_HEIGHT', 800);

define('MAX_THUMBNAIL_WIDTH', 156);
define('MAX_THUMBNAIL_HEIGHT', 156);

//////////////////////////////////////////////////////////////////////////////////////////
// MEDIA
// 1. uploadMedia
// 2. getMedia
// 3. removeMedia
//////////////////////////////////////////////////////////////////////////////////////////

function getIntId($arr, $name){
	$value = isset($arr[$name]) ?  $arr[$name] : 0;
	if (!is_nan($value)){
		$value = intval($value);
	} else {
		$value = 0;
	}
	return $value;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getFileCat($file_mime){
	$file_type = '';
	if ($file_mime){
		$file_mimearr = explode('/', $file_mime);
		if (sizeof($file_mimearr) == 2){
			$file_type = $file_mimearr[1];
		}
	}
	$file_cat = '';
	switch ($file_type){

		case 'gif':	case 'png':	case 'jpg':	case 'jpeg': case 'bmp': case 'x-ms-bmp':
			$file_cat = 'image';
			break;

		case 'mp4':	case 'x-mpegURL': case 'MP2T': case '3gpp': case 'quicktime': case 'x-msvideo': case 'x-ms-wmv': case 'ogg':
			$file_cat = 'video';
			break;

		case 'aac':	case 'm4a':	case 'wav': case 'mp3':
			$file_cat = 'audio';
			break;

		case 'pdf':
			$file_cat = 'pdf';
			break;

		case 'plain':
		case 'vnd.ms-excel':
		case 'csv':
			$file_cat = 'text';
			break;
	}
	return $file_cat;
}


//////////////////////////////////////////////////////////////////////////////////////////
// uploadMedia from a.uploader.js (for yolofoio)
// by alantypoon 20161024
//////////////////////////////////////////////////////////////////////////////////////////
function rrmdir($dir) {
	if (is_dir($dir)) {
		$objects = scandir($dir);
		foreach ($objects as $object) {
			if ($object != "." && $object != "..") {
				$file_path = $dir . SLASH . $object;
				if (file_exists($file_path)){
					if (filetype($file_path) == "dir") {
						rrmdir($file_path);
					} else if (file_exists($file_path)){
						unlink($file_path);
					}
				}
			}
		}
		reset($objects);
		rmdir($dir);
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// upload the chunk by resumable

function uploadByResumable(){
	wlog('uploadByResumable');

	global $debug_svrop, $input, $output, $error, $database, $test_qs;
	$debug = isset($test_qs);
	$debug = 1;

	$media_id = 0;	// to be returned
	/////////////////////////////////////////////////
	// RESUMABLE
	/////////////////////////////////////////////////
	// GET QUERY STRINGS
	$orig_name = '';
	$output_filepath = '';
	$uniqFileName = '';
	$total_files = 0;
	$total_files_size = 0;

	///$folder = getMediaFolder();
	$folder = getcwd() . SLASH . 'media' . SLASH;
	$resumableIdentifier = getQS('resumableIdentifier');
	$resumableFilename = getQS('resumableFilename');
	$resumableChunkNumber = getQS('resumableChunkNumber');
	$resumableChunkSize = getQS('resumableChunkSize');
	$resumableTotalSize = getQS('resumableTotalSize');
	$resumableFileMime = getQS('resumableFileMime');

	$debug = 1;
	if ($debug){
		wlog("uploadByResumable: $resumableIdentifier $resumableFilename $resumableChunkNumber $resumableChunkSize $resumableTotalSize $resumableFileMime");
	}

	// TESTCHUNKS
	// Check if request is GET and the requested chunk exists or not. this makes testChunks work
	if ($_SERVER['REQUEST_METHOD'] === 'GET'){

		$temp_dir = $folder . $resumableIdentifier;
		$chunk_file = $temp_dir . '/' . $resumableFilename . '.part' . $resumableChunkNumber;
		//
		if ($debug){
			wlog("temp_dir: " . $temp_dir);
			wlog("chunk_file: " . $chunk_file);
		}
		if (file_exists($chunk_file)) {
			if ($debug){
				wlog($chunk_file . " found");
			}
			header("HTTP/1.0 200 Ok");
		} else {
			//wlog($chunk_file . " not found"); header("HTTP/1.0 404 Not Found");	// avoid console.error
			$error = "$chunk_file not found";
		}
	}

	// LOOP THROUGH FILES AND MOVE THE CHUNKS TO A TEMPORARILY CREATED DIRECTORY
	if (!empty($_FILES)){

		foreach ($_FILES as $file){

			// CHECK THE ERROR STATUS
			if ($file['error'] != 0) {
				$error = 'error ' . $file['error'] . ' in file ' . $resumableFilename;
				continue;
			}
			$input_file = $file['tmp_name'];

			// Init the destination file (format <filename.ext>.part<#chunk>
			// the file is stored in a temporary directory
			$temp_dir = $folder . $resumableIdentifier;
			$dest_file = $temp_dir . SLASH . $resumableChunkNumber;
			if ($debug){
				wlog('temp_dir='.$temp_dir);
				wlog('dest_file='.$dest_file);
			}
			// create the temporary directory
			if (!is_dir($temp_dir)){
				if ($debug){
					wlog("mkdir: " . $temp_dir);
				}
				if (!file_exists($temp_dir)){
					try {
						$success = mkdir($temp_dir, 0777, true);
					} catch (Exception $e) {}
				}
			}
			// MOVE FILE
			$success = move_uploaded_file($input_file, $dest_file);

			// MOVE THE TEMPORARY FILE
			if ($debug){
				wlog("move_uploaded_file: " . $input_file . "," . $dest_file . "...success=" . $success);
			}
			if ($success){

				// check if all the parts present, and create the final destination file
				// cannot create the destination file: C:\_Eroom\Websites\myhome\dv\upload\Jerusalem.mp4
				// createFileFromChunks($folder, $temp_dir, $_REQUEST['resumableFilename'], $_REQUEST['resumableChunkSize'], $_REQUEST['resumableTotalSize']);
				//$fileName = getQS('resumableFilename');
				//$chunkSize = getQS('resumableChunkSize');
				//$totalSize = getQS('resumableTotalSize');

				// count all the parts of this file
				foreach (array_slice(scandir($temp_dir), 2) as $file){
					$tempfilesize = filesize($temp_dir . SLASH . $file);
					if ($tempfilesize > 0){
						$total_files_size += $tempfilesize;
						$total_files++;
						if ($debug){
							wlog("foreach: ". $temp_dir . SLASH . $file . " size=" . $tempfilesize .	" file=" . $total_files . " total_file_size=" . $total_files_size);
						}
					}
				}

				// check that all the parts are present
				// If the Size of all the chunks on the server is equal to the size of the file uploaded.
				if ($total_files_size >= $resumableTotalSize){

					// get extension
					$ext = pathinfo($resumableFilename, PATHINFO_EXTENSION);
					$ext = strtolower($ext); // in case of JPG, MP4, etc,

					// generate unique filename
					//$media_id = getNewSequenceID('media_id', 'media');
					//$uniqFileName = $media_id . '.' . $ext;	// uniqid(), not uniqId*()
					$media_id = 0;
					$uniqFileName = $resumableFilename;

					// create the final destination file
					$output_filepath = $folder . $uniqFileName;	// chinese chars

					// http://www.365mini.com/page/php-access-chinese-file-error.htm
					// http://tacoballblog.blogspot.hk/2011/07/php.html
					//if (substr($_ENV["OS"], 0, 7) == 'Windows'){
					if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
						$output_filepath = iconv('UTF-8', 'Big5', $output_filepath);
					}
					// WRITE TO THE OUTPUT FILE
					$fp = fopen($output_filepath, 'w');
					if ($fp !== false){
						for ($i = 1; $i <= $total_files; $i++) {
							if ($debug){
								wlog('writing chunk '.$i);
							}
							fwrite($fp, file_get_contents($temp_dir . SLASH . $i));
						}
						fclose($fp);

						// CHANGE MOD
						if ($debug){
							wlog("createFileFromChunks: size=" . $resumableTotalSize . " files=" . $total_files);
						}
						mychmod($output_filepath);

						// RENAME THE TEMPORARY DIRECTORY
						// (to avoid access from other concurrent chunks uploads) and then delete it
						if ($debug){
							wlog("rename and remove folder: ".$temp_dir . '_UNUSED');
						}
						if (file_exists($temp_dir)){
							if (rename($temp_dir, $temp_dir . '_UNUSED')){
								rrmdir($temp_dir.'_UNUSED');
							} else {
								rrmdir($temp_dir);
							}
						}

						// IS IT EXISTED?
						$existed = file_exists($output_filepath);
						if ($debug){
							wlog("output_file: ".$output_filepath."...existed=".($existed?1:0));
						}
						if ($existed){
							$orig_name = $resumableFilename;
							$output['file'] = $uniqFileName;

							//convert_video($output_filepath);

						} else {
							$error = 'cannot find the file';
						}
					} else {
						$error = 'cannot create the destination file: ' . $output_filepath;
					}
				}
			}
		}
	}
	return [
		'media_id' 					=> $media_id,
		'total_files_size' 	=> $total_files_size,
		'resumableFileMime' => $resumableFileMime,
		'orig_name'					=> $orig_name,
		'output_filepath' 	=> $output_filepath,
		'uniqFileName'			=> $uniqFileName,
	];
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. UPLOAD MEDIA
////////////////////////////////////////////////////////////////////////////////////////////////////

// https://gist.github.com/jaywilliams/119517
// convert_ascii

function convert_ascii($string){

  $search[]  = chr(160);
	$replace[] = " ";

  // Replace Single Curly Quotes
  $search[]  = chr(226).chr(128).chr(152);
  $replace[] = "'";
  $search[]  = chr(226).chr(128).chr(153);
  $replace[] = "'";
  // Replace Smart Double Curly Quotes
  $search[]  = chr(226).chr(128).chr(156);
  $replace[] = '"';
  $search[]  = chr(226).chr(128).chr(157);
  $replace[] = '"';
  // Replace En Dash
  $search[]  = chr(226).chr(128).chr(147);
  $replace[] = '--';
  // Replace Em Dash
  $search[]  = chr(226).chr(128).chr(148);
  $replace[] = '---';
  // Replace Bullet
  $search[]  = chr(226).chr(128).chr(162);
  $replace[] = '*';
  // Replace Middle Dot
  $search[]  = chr(194).chr(183);
  $replace[] = '*';
  // Replace Ellipsis with three consecutive dots
  $search[]  = chr(226).chr(128).chr(166);
  $replace[] = '...';
  // Apply Replacements
  $string = str_replace($search, $replace, $string);
  // Remove any non-ASCII Characters
  $string = preg_replace("/[^\x01-\x7F]/","", $string);
  return $string;
}

function mytrim($str) {
	return trim($str);
}

function cmp($a, $b){
	return strcmp($a[0], $b[0]);
}

function import_users($users, $apply){
	global $dummy_birthday;

	$users2 = [];

	$creates = [];
	$updates = [];
	$warnings = [];
	$user_ids = [];

	//usort($users, 'cmp');

	foreach ($users as $line){

		$line = convert_ascii($line);

		$arr = explode(',', $line);

		$user_id = 0;
		$gender = '';

		$ncol = sizeof($arr);
		//echo $ncol;

		$error = 0;

		switch ($ncol){
			case 1:
				///////////////////////////////////////////////////
				// email only, general default fields (e.g. Malaysia)
				$email = $line;
				$username = explode('@', $line)[0];
				$line = "$email,$username,M,$dummy_birthday";
				$arr = explode(',', $line);
				break;

			case 4:
				// standard format
				//
				// 1264325183@qq.com,Wong Ho Yan,F,1997-10-28
				// 1264325183@qq.com, Wong Ho Yan, F, 1997-10-28
				//
				// 0: email
				// 1: username
				// 2: gender
				// 3: birthday
				break;

			case 10:
			case 11:
			case 12:
				// Group,Position,Institution,Surname,First name,Sex,Year,Faculty/ Programme,Phone,Email
				$grp_id = $arr[0];
				if (!is_numeric($grp_id)){
					// skip the header
					array_push($warnings, "<b>skip header</b>: $line");
					$error = 1;
				} else {
					$email = mytrim($arr[9]);
					$surname = mytrim($arr[3]);
					$firstname = mytrim($arr[4]);
					$gender = mytrim($arr[5]);
					$birthday = $dummy_birthday;
					$arr = [$email, "$surname $firstname ($grp_id)", $gender, $birthday];
				}
				break;

			case 18:
			case 19:
			case 20:
			case 21:
			case 22:
			case 23:
				// Group,Position,Institution,Surname,First name,Sex,Year,Faculty/ Programme,Phone,Email
				$grp_id = $arr[3];
				if (!is_numeric($grp_id)){
					// skip the header
					array_push($warnings, "<b>skip group ID</b>: $line ($grp_id)");
					$error = 1;
				} else {
					$email = mytrim($arr[15]);
					$fullname = mytrim($arr[10]);
					$gender = mytrim($arr[11]);
					$birthday = $dummy_birthday;
					$arr = [$email, "$fullname ($grp_id)", $gender, $birthday];
				}
				break;

			default:
				array_push($warnings, "<b>invalid format</b>: $line ($ncol)");
				$error = 1;
				break;
		}

		if (!$error && $gender != 'F' && $gender != 'M'){
			array_push($warnings, "<b>invalid gender</b>: $line ($ncol)");
			$error = 1;
		}
		if (!$error){
			$email = mytrim($arr[0]);
			$email_arr = explode('@', $email);
			if (sizeof($email_arr) != 2){
				array_push($warnings, "<b>invalid email</b>: $line");
				continue;
			}
			$pwd = '1234';
			$username = mytrim($arr[1]);
			if ($username == ''){
				array_push($warnings, "<b>invalid username</b>: $line");
				continue;
			}
			$gender = mytrim($arr[2]);
			$birthday = mytrim($arr[3]);
			if ($birthday == ''){
				$birthday = $dummy_birthday;
			}
			$user = checkUserExists($email);

			// not exist or not confirmed
			$secret_token = '';

			if (gettype($user) != 'object'){ // $user == 0;
				if ($apply){
					$user_id = createUser($email, $pwd, $username, $gender, $birthday, 1, $secret_token);
				}
				$status = CREATEUSER_CREATED;
				array_push($creates, "<b>created</b>: $line");

			} else {
				$status = CREATEUSER_UPDATED;
				$user_id = $user->user_id;

				// don't change the password
				if ($user->pwd != ''){
					$pwd = $user->pwd;
				}
				if ($user->birthday != ''){
					$birthday = $user->birthday;
				}

				if (
						!strcmp($user->username, $username)
					&&
						!strcmp($user->gender, $gender)
					&&
						!strcmp($user->birthday, $birthday)
				){
					$status = CREATEUSER_SAME;

				} else {

					if (strcmp($user->username, $username)){
						array_push($updates, "<b>$user->username($user_id) updated username</b>: $username");
					}

					if (strcmp($user->gender, $gender)){
						array_push($updates, "<b>$user->username($user_id) updated gender</b>: $user->gender -> $gender");
					}

					if (strcmp($user->birthday, $birthday)){
						array_push($updates, "<b>$user->username($user_id) updated birthday</b>: $user->birthday -> $birthday");
					}

					if ($apply){
						$user_id = updateUser($user, $email, $pwd, $username, $gender, $birthday, $secret_token);
					}
				}
			}

			array_push($users2, [
				'user_id' => $user_id,
				'email'=>$email,
				'username'=>$username,
				'gender'=>$gender,
				'birthday'=>$birthday,
				'status'=>$status,
			]);
		}
	}

	$output = [
		'users' => $users2,
		'creates' => $creates,
		'updates' => $updates,
		'warnings' => $warnings,
		'apply' => $apply,
	];
	//print_json($output);

	return $output;
}


//////////////////////
// STARTS HERE
//////////////////////
$folder = getcwd() . SLASH . 'media' . SLASH;
$apply = getQs('apply') == 1 ? 1 : 0;
if (!$apply){
	$robj = uploadByResumable();
	$media_id 					= $robj['media_id'];
	$total_files_size		= $robj['total_files_size'];
	$output_filepath 		= $robj['output_filepath'];
	$resumableFileMime 	= $robj['resumableFileMime'];
	$orig_name					= $robj['orig_name'];
	$file_name 					= $robj['uniqFileName'];
} else {
	$file_name = getQs('file_name');
}

$path = $folder . $file_name;
$users = file($path, FILE_IGNORE_NEW_LINES);

$output = import_users($users, $apply);
$output['file'] = $file_name;
//print_json($output);
echo json_encode($output);

?>
