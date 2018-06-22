<?php

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


////////////////////////////////////////////////////////////////////////////////////////////////////
// REMOVEMEDIA
////////////////////////////////////////////////////////////////////////////////////////////////////

function removeMedia(){

	global $debug_svrop, $input, $output, $error, $database;
	$user_id = getQS('user_id');
	$media_id = getQS('media_id');
	$folder = getMediaFolder();

	// FIND THE FILE_NAME
	$file_name = '';
	$data_type = '';
	$ids = [];
	$documents = databaseRead($database, 'media', ['media_id' => intval($media_id)]);
	if ($documents && sizeof($documents) > 0){
		$media = json_decode(json_encode($documents[0]), true);
		$file_name 	= $media['file_name'];
		$data_type 	= $media['data_type'];
		$ids 				= $media['ids'];
	}
	//////////////////////////////////////////////////////////////////////
	// 1. remove from the file system
	//////////////////////////////////////////////////////////////////////
	if ($file_name != ''){
		$file_path = $folder . $file_name;
		if (file_exists($file_path)){
			if (unlink($file_path)){
				$output['file_path'] = $file_path;
			} else {
				$output['warn'] = "unlink failed $file_path";
			}
		} else {
			$output['warn'] = "not found $file_path";
		}
	} else {
		$output['warn'] = "media not found $media_id";
	}

	//////////////////////////////////////////////////////////////////////
	// 2. remove from the media
	//////////////////////////////////////////////////////////////////////
	$result = databaseDelete($database, 'media', ['media_id' => intval($media_id)]);

	//////////////////////////////////////////////////////////////////////
	// 3. remove from the media path
	//////////////////////////////////////////////////////////////////////
	// db.getCollection('users').update({user_id: 1}, {$pull: {'profile.media': 19}});
	setDocMedia($data_type, $ids, '$pull', $media_id);

	// output the media_id as the result
	$output['media_id'] = $media_id;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////
// upload the chunk by resumable

function uploadByResumable(){
	//wlog('uploadByResumable');
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

	$folder = getMediaFolder();
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
					$media_id = getNewSequenceID('media_id', 'media');
					$uniqFileName = $media_id . '.' . $ext;	// uniqid(), not uniqId*()

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

function uploadMedia(){
	global $debug_svrop, $input, $output, $error, $database, $test_qs;


	$robj = uploadByResumable();
	$media_id 					= $robj['media_id'];
	$total_files_size		= $robj['total_files_size'];
	$output_filepath 		= $robj['output_filepath'];
	$resumableFileMime 	= $robj['resumableFileMime'];
	$orig_name					= $robj['orig_name'];
	$uniqFileName				= $robj['uniqFileName'];

	$debug = isset($test_qs);
	//$debug = 1;
	if ($debug){
		wlog("uploadMedia: $media_id $total_files_size $output_filepath $resumableFileMime $orig_name $uniqFileName");
	}
/*
	if (!$debug){
		$robj = uploadByResumable();
		$media_id 					= $robj['media_id'];
		$total_files_size		= $robj['total_files_size'];
		$output_filepath 		= $robj['output_filepath'];
		$resumableFileMime 	= $robj['resumableFileMime'];
		$orig_name					= $robj['orig_name'];
		$uniqFileName				= $robj['uniqFileName'];
	} else {
		$media_id 					= 40;
		$total_files_size		= 101;
		$output_filepath 		= "D:\\GoogleDrive\\___CETL\\YOCLE\\web\\dev\\media\\41.png";
		$resumableFileMime 	= "";
		$orig_name					= "test";
		$uniqFileName				= "41.png";
	}
*/
	// stores only in production folder (because using the same database)
	//$output_filepath = str_replace('/dev', '', $output_filepath);

	// FILE SAVED, NOW WRITE TO DB
	if ($media_id > 0){

		$data_type = getQS('data_type');
		$ids = getQS('ids');
		$desc = getQS('desc');

		if (!$data_type || !$ids){

			 $error = "data_type or ids not found";

		} else {

			/////////////////////////////////////////////////////////////////////
			// 1. SAVE TO COLLECTION MEDIA
			/////////////////////////////////////////////////////////////////////
			// DEBUG LOG
			if ($debug){
				wlog("1. SAVE TO COLLECTION MEDIA: media_id=$media_id $data_type=$data_type ids=$ids desc=$desc");
			}
			$ids = json_decode($ids, true);

			// remove the media first
			$result = databaseDelete($database, 'media', ['medai_id' => $media_id]);

			$file_size = $total_files_size;

			// find category by client side mime
			$server_mime = '';
			$file_cat = getFileCat($resumableFileMime);
			if ($file_cat == ''){
				// find category by server side mime
				$server_mime = mime_content_type($output_filepath);
				$file_cat = getFileCat($server_mime);
			}
			if ($file_cat == ''){

				$error = "File mime unsupported: client=$resumableFileMime, $server_mime";
				wlog($error);

			} else {

				// reinsert media_id
				$media = [
					'media_id' 		=> $media_id,
					'data_type'		=> $data_type,
					'ids'					=> $ids,
					'orig_name' 	=> $orig_name,
					'file_name' 	=> $uniqFileName,
					'file_cat'		=> $file_cat,
					'file_size'		=> $file_size,
					'upload_date' => getDateTime(),
				];
				if ($desc != ''){
					$media['desc'] = $desc;
				}
				//print_json($media);
				// databaseInsertOrUpdate($database, $collection, $filters, $sets, $options = []){
				$result = databaseInsertOrUpdate($database, 'media', ['media_id' => $media_id], $media);

				wlog("uploadmedia: $uniqFileName $file_cat $file_size");

				// save thumbnail
				switch ($file_cat){

					case 'image':
						$dot_index = strrpos($uniqFileName, '.');
						if ($dot_index > 0){

							// 1. find the parameters
							$part_file = substr($uniqFileName, 0, $dot_index);
							$part_ext = substr($uniqFileName, $dot_index);	// including the dot
							$src = $output_filepath;

							$src_index = strrpos($src, DIRECTORY_SEPARATOR);
							$dir = substr($src, 0, $src_index + 1);

							$src2 = $dir . $part_file . $part_ext;
							if ($src2 != $src){
								rename($src, $src2);
								$src = $src2;
							}
							$dst_reduced = $dir . $part_file . '_' . $part_ext;
							$dst_thumbnail = $dir . $part_file . '_t' . $part_ext;
							//eceho "$dst_reduced\r\n";
							//echo "$dst_thumbnail\r\n";
							//exit();

							// read to imagickd
							$im1 = new Imagick();
							$im1->readImage($src);

							// rotate image: added by alantypoon 20180606
							autoRotateImage($im1);

							// get dimension and clone
							$d = $im1->getImageGeometry();
							$w0 = $d['width'];
							$h0 = $d['height'];
							$im2 = clone $im1;

							// 2. for reduced
							$size_reduced = reduceImageSize($w0, $h0, MAX_REDUCED_WIDTH, MAX_REDUCED_HEIGHT);
							wlog('resize1: ' . $size_reduced['w'] . 'x' . $size_reduced['h']);
							$im1->resizeImage($size_reduced['w'], $size_reduced['h'], Imagick::FILTER_LANCZOS, 1);
							$im1->writeImage($dst_reduced);	// _

							// 3. for thumbnail
							$size_thumbnail = reduceImageSize($w0, $h0, MAX_THUMBNAIL_WIDTH, MAX_THUMBNAIL_HEIGHT);
							wlog('resize1: ' . $size_thumbnail['w'] . 'x' . $size_thumbnail['h']);
							$im2->resizeImage($size_thumbnail['w'], $size_thumbnail['h'], Imagick::FILTER_LANCZOS, 1);
							$im2->writeImage($dst_thumbnail);	// _t

							// update database for this
							//$old_file_name = $file_name;
							$new_file_name = basename($dst_reduced);
							$new_file_size = filesize($dst_reduced);
							$result = databaseUpdate($database, 'media', ['media_id' => $media_id], ['$set' => [
								'file_name' => $new_file_name,
								'file_size' => $new_file_size,
							]]);
						}
						break;

					case 'video':
						//convert_video($output_filepath);
						break;
				}

				/////////////////////////////////////////////////////////////////////
				// 2. SAVE TO COLLECTION USERS
				/////////////////////////////////////////////////////////////////////
				switch ($data_type){
					//case 'item_media':
					//	break;

					case 'poster2':
						break;

					default:
						setDocMedia($data_type, $ids, '$pull', $media_id);	// avoid repetition
						setDocMedia($data_type, $ids, '$push', $media_id);
						break;
				}
				/////////////////////////////////////////////////////////////////////
				// 3. RETURN THE MEDIA ARRAY
				/////////////////////////////////////////////////////////////////////
				$output['media'] = $media;
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function setDocMedia($data_type, $ids, $action, $media_id){
	global $debug_svrop, $input, $output, $error, $database, $col_usr;

	if ($debug_svrop >= 1){
		wlog("setDocMedia data_type=$data_type media_id=$media_id action=$action ids=" . json_encode($ids));
	}

	switch ($data_type){

		case 'user':
			$user_id = getIntId($ids, 'user_id');
			if ($user_id){
				wlog("user_id:$user_id");
				$result = databaseUpdate($database, 'users',
					['user_id' => $user_id],
					[$action => ['profile.media' => intval($media_id)] ]);
			}
			break;

		case 'activity':
			$act_id = getIntId($ids, 'act_id');
			if ($act_id){
				$result = databaseUpdate($database, 'activities',
					['act_id' => $act_id],
					[$action => ['media' => intval($media_id)] ]);
			}
			break;

		case 'assessment':
			$act_id = getIntId($ids, 'act_id');
			$ass_id = getIntId($ids, 'ass_id');
			if ($act_id){
				$result = databaseUpdate($database, 'activities',
					['act_id' => $act_id],
					[$action => ['assessment.assessments.'.($ass_id-1).'.media' => intval($media_id)] ]);
			}
			break;
/*
		case 'item':
			$act_id = getIntId($ids, 'act_id');
			if ($act_id){
				$ass_id = getIntId($ids, 'ass_id');
				$ass_item_id = getIntId($ids, 'ass_item_id');
				$filters = ['act_id' => $act_id];
				$update = [$action => ['assessment.assessments.'.($ass_id - 1).'.items.'.($ass_item_id - 1).'.media' => intval($media_id)] ];
				$result = databaseUpdate($database, 'activities', $filters, $update);
			}
			break;
*/
		case 'poster':
			$act_id = getIntId($ids, 'act_id');
			$ass_id = getIntId($ids, 'ass_id');
			$user_id = getIntId($ids, 'user_id');
			if ($act_id && $ass_id && $user_id){
				//echo "haha";
				$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
				$update = [$action => ['profile.activity.$.assessments.'.($ass_id-1).'.media' => intval($media_id)]];
				//print_json($filters);	print_json($update);
				$result = databaseUpdate($database, $col_usr, $filters, $update);
			}
			break;

	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 2. GETMEDIA
// https://alanpoon.ddns.net:8081/dev/uploadertest/svrop.php?type=get_media&data_type=user&ids={%22user_id%22:23}
// https://alanpoon.ddns.net:8081/dev/uploadertest/svrop.php?type=get_media&data_type=activity&ids={%22act_id%22:1}
// https://alanpoon.ddns.net:8081/dev/uploadertest/svrop.php?type=get_media&data_type=assessment&ids={%22act_id%22:1,%22ass_id%22:1}
// https://alanpoon.ddns.net:8081/dev/uploadertest/svrop.php?type=get_media&data_type=item&ids={%22act_id%22:1,%22ass_id%22:1,%20,%22ass_item_id%22:1}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
function getMedia(){
	global $debug_svrop, $input, $output, $error, $database;

	$data_type = getQS('data_type');
	$ids = getQS('ids');
	if ($data_type == 'item_media'){

		$media_arr = [];
		$media_id_arr = getDocMedia('media_id_arr', $ids);
		//print_json($media_id_arr);
		if (is_array($media_id_arr) && sizeof($media_id_arr) > 0){
		//if ($media_id_arr && sizeof($media_id_arr) > 0){
			$documents = databaseRead($database, 'media', ['media_id' => ['$in' => $media_id_arr ]], [ 'projection' => ['_id' => 0]]);
			$media_arr = $documents;
		}
		$output['media_arr'] = $media_arr;

	} else {

		$media_id_arr = getQS('media_id_arr');
		if ($media_id_arr){

			// CONVERT ASSOCIATIVE ARRAY INTO INDEXED ARRAY
			$media_id_arr2 = [];
			foreach ($media_id_arr as $key => $value){
				array_push($media_id_arr2, intval($value));
			}
			$media_id_arr = $media_id_arr2;

		} else {

			$ids = getQS('ids');
			$doc = getDocMedia($data_type, $ids);
			//print_r($doc);
			//var_dump($doc);
			// GET THE ARRAY
			$media_id_arr = $doc;	// $media_id have to be int32
			//echo gettype($media_id_arr);
			//print_r($media_id_arr);
			//echo "<br>".is_array($media_id_arr)."<br>".sizeof($media_id_arr);
		}

		//print_r($doc); exit();

		if ($media_id_arr){

			// FIND THE CORRESPONDING ITEMS IN COLLECTION MEDIA
			// db.getCollection('media').find({media_id: {$in: [7,8]}})
			$documents = databaseRead($database, 'media', ['media_id' => ['$in' => $media_id_arr ]], [ 'projection' => ['_id' => 0]]);

			//wlog("getMedia2: ".var_export($documents, true));
			$output['media_arr'] = $documents;
		}
	}
}
*/

function getGalleryMedia(){
	global $debug_svrop, $input, $output, $error, $database;


	$media_arr = [];
	$input_arr = getQS('input_arr');
	$data_type = getQS('data_type');
	//print_json($input_arr);
	//echo(gettype($input_arr[0])); exit();

	if (isset($input_arr) && sizeof($input_arr)){

		//
		// GET MEDIA_ID_ARR FROM ACTIVITY
		//
		if ($debug_svrop){
			//echo "input_arr1";  print_json($input_arr);
		}
		if (isset($input_arr['act_id']) && isset($input_arr['ass_id']) && isset($input_arr['user_id'])){
			$act_id = $input_arr['act_id'];
			$ass_id = $input_arr['ass_id'];
			$user_id = $input_arr['user_id'];
			$input_arr = getDocMedia($data_type, ['act_id' => $act_id, 'ass_id' => $ass_id, 'user_id' => $user_id]);

		} else if (isset($input_arr['act_id']) && isset($input_arr['ass_id']) ){
			$act_id = $input_arr['act_id'];
			$ass_id = $input_arr['ass_id'];
			$input_arr = getDocMedia($data_type, ['act_id' => $act_id, 'ass_id' => $ass_id]);

		} else if (isset($input_arr['act_id'])){
			$act_id = $input_arr['act_id'];
			$input_arr = getDocMedia($data_type, ['act_id' => $act_id]);
		}
		if ($debug_svrop){
			//echo "input_arr2";  print_json($input_arr);
		}

		//
		// FROM MEDIA_ID_ARR TO MEDIA_ARR
		//
		if (isset($input_arr[0])){

			$input_type = gettype($input_arr[0]);
			if ($input_type == 'string'){
				$input_arr2 = [];
				foreach ($input_arr as $value){
					array_push($input_arr2, intval($value));
				}
				$input_arr = $input_arr2;
			}
			//echo "input_arr";  print_json($input_arr);

			$input_type = gettype($input_arr[0]);
			if ($input_type == 'integer'){
				$media_arr = databaseRead($database, 'media', ['media_id' => ['$in' => $input_arr ]], [ 'projection' => ['_id' => 0]]);
			} else if (gettype($input_arr[0]) == 'object'){	// actually no need
				$media_arr = $input_arr;
			}
		}
	}
	$output['media_arr'] = $media_arr;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getDocMedia($data_type, $ids){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $test_qs;

	$debug = isset($test_qs);
	//$debug = 0;

	if (gettype($ids) == 'string'){
		$ids = json_decode($ids, true);
	}
	if ($debug){
		echo "getDocMedia data_type=$data_type ids=" . json_encode($ids) . "<br>";
	}
	$doc = 0;
	$path = 0;
	$criteria = 0;
	$collection = 0;
	$act_id = 0;
	$ass_id = 0;
	$user_id = 0;

	switch ($data_type){

		case 'user':
			$user_id = getIntId($ids, 'user_id');
			if ($user_id){
				$collection = 'users';
				$criteria = ['user_id' => $user_id];
				$path = 'profile.media';
			}
			break;

		case 'activity':
			$act_id = getIntId($ids, 'act_id');
			if ($act_id){
				$collection = 'activities';
				$criteria = ['act_id' => $act_id];
				$path = 'media';
			}
			break;

		case 'assessment':
			$act_id = getIntId($ids, 'act_id');
			$ass_id = getIntId($ids, 'ass_id');
			if ($act_id && $ass_id){
				$collection = 'activities';
				//$criteria = ['act_id' => $act_id];//, 'assessment.assessments.ass_id' => $ass_id];
				//$criteria = ['act_id' => $act_id, 'assessment.assessments.'.($ass_id-1).'.ass_id' => $ass_id];
				//$path = 'assessment.assessments.'.($ass_id-1).".media";
				$criteria = ['act_id' => $act_id, 'assessment.assessments.ass_id' => $ass_id];
				$path = 'assessment.assessments';
			}
			break;

		case 'poster':
			$act_id = getIntId($ids, 'act_id');
			$ass_id = getIntId($ids, 'ass_id');
			$user_id = getIntId($ids, 'user_id');
			if ($act_id && $ass_id){
				$collection = 'users';
				$criteria = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
				$path = "profile.activity.$.assessments.".($ass_id-1).".media";
			}
			break;

		case 'media_id_arr':
			$part_id = getIntId($ids, 'part_id');
			$act_id = getIntId($ids, 'act_id');
			$ass_id = getIntId($ids, 'ass_id');
			$item_id = getIntId($ids, 'item_id');
			if ($act_id && $ass_id && $item_id){
				$collection = 'users';
				$criteria = ['user_id' => $part_id, 'profile.activity.act_id' => $act_id];
				$path = "profile.activity.$.assessments.".($ass_id-1).".items.".($item_id-1).".media_id_arr";
			}
			break;
	}
	$options = [];
	if ($path){
		$options = [ 'projection' => ['_id' => 0, $path => 1] ];
	} else {
		$options = [ 'projection' => ['_id' => 0] ];
	}

	// READ THE DOCUMENT
	if ($debug){
		echo "***database=$database collection=$collection path=$path<br>";
		echo "criteria: <br/>";
		print_json($criteria);
		echo "options: <br/>";
		print_json($options);
	}
	$documents = databaseRead($database, $collection, $criteria, $options);
	if ($documents){
		$doc = json_decode(json_encode($documents[0]), true);
	}
	if ($debug){
		//echo "output: <br/>"; print_json($doc);
	}
	//////////////////////////////////////////////////////////////////////////////////////
	// FILTER THE RESULTS
	//////////////////////////////////////////////////////////////////////////////////////
	if ($doc){

		switch ($data_type){

			case 'assessment':
				// FILTER OTHER ASSESSMENTS
				$ass_id = getIntId($ids, 'ass_id');
				foreach ($doc['assessment']['assessments'] as $key => $value){
					$ass = $value;
					$ass_id2 = intval($ass['ass_id']);
					if ($ass_id2 != $ass_id){
						unset($doc['assessment']['assessments'][$key]);
					}
				}
				$path = 'assessment.assessments.0.media';
				break;

			case 'poster':
				$act_id = getIntId($ids, 'act_id');
				$ass_id = getIntId($ids, 'ass_id');
				//echo "ass_id=$ass_id<br>";
				if ($act_id && $ass_id){
					$path = "profile.activity.0.assessments.".($ass_id-1).'.media';
				}
				break;

/*
			case 'item':
				// FILTER OTHER ASSESSMENTS
				$ass_id = getIntId($ids, 'ass_id');
				foreach ($doc['assessment']['assessments'] as $key => $value){
					$ass = $value;
					$ass_id2 = intval($ass['ass_id']);
					if ($ass_id2 != $ass_id){
						unset($doc['assessment']['assessments'][$key]);
					}
				}
				// FILTER OTHER ITEMS
				$ass_item_id = getIntId($ids, 'ass_item_id');
				foreach ($doc['assessment']['assessments'][0]['items'] as $key => $value){
					$item = $value;
					$ass_item_id2 = intval($item['ass_item_id']);
					if ($ass_item_id2 != $ass_item_id){
						unset($doc['assessment']['assessments'][0]['items'][$key]);
					}
				}
				$path = 'assessment.assessments.0.items.0.media';
				break;
*/
			case 'item_media':
/*
				// FILTER OTHER ASSESSMENTS
				$ass_id = getIntId($ids, 'ass_id');
				foreach ($doc['assessment']['assessments'] as $key => $value){
					$ass = $value;
					$ass_id2 = intval($ass['ass_id']);
					if ($ass_id2 != $ass_id){
						unset($doc['assessment']['assessments'][$key]);
					}
				}
				// FILTER OTHER ITEMS
				$ass_item_id = getIntId($ids, 'ass_item_id');
				foreach ($doc['assessment']['assessments'][0]['items'] as $key => $value){
					$item = $value;
					$ass_item_id2 = intval($item['ass_item_id']);
					if ($ass_item_id2 != $ass_item_id){
						unset($doc['assessment']['assessments'][0]['items'][$key]);
					}
				}
				$path = 'assessment.assessments.0.items.0.media';
*/
				break;

		}
	}

	// READ THE MEDIA_ID
	if ($path){
		if ($debug){
			echo "path=$path<br>before filter...<br>";
			//print_json($doc);
		}
		$arr = explode('.', $path);
		foreach ($arr as $key => $value){
			if ($debug){
				echo "<b>Traversing path: key=$key value=$value...</b><br>";
			}
			if ($value == '$') $value = 0;
			if (isset($doc[$value])){
				$doc = $doc[$value];
				if ($debug){
					//print_json($doc);
				}
			} else {
				$doc = [];
			}
		}
	}

	// CONVERT MEDIA_IDS FROM STRING TO INT32
	if (is_array($doc)){
		if (isset($doc['length']) && $doc['length'] == 0){
			// no element
			$doc = 0;
		} else {
			foreach ($doc as $key => $value){
				//if ($debug){
					//echo "array1[$key]: "; print_json($value);
				//}
				if (is_numeric($value)){
					$doc[$key] = intval($value);
				}
			}
		}
	}
	if ($debug){
		echo "path=$path<br>after filter...<br>";
		print_json($doc);
	}
	return $doc;
}

/////////////////////////////////////////////////////////////////////////////////////

function saveMediaDesc($media_desc_hash){
	global $debug_svrop, $input, $output, $error, $database, $user_id, $test_qs, $col_usr;
	foreach ($media_desc_hash as $media_id => $media_desc){
		$filters = ['media_id' => $media_id];
		$update = ['$set' => ['media_desc' => $media_desc]];
		$result = databaseUpdate($database, 'media', $filters, $update);
	}
}

/////////////////////////////////////////////////////////////////////////////////////

if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
	define('FFMPEG', 	"C:\\ffmpeg\\bin\\ffmpeg.exe");
} else {
	define('FFMPEG', 	"/usr/bin/ffmpeg2");
}
/*
function convert_video($path){
	// D:\gdrive\_WEB\yocle\media\1012.mp4
	wlog("convert_video: $path");
	if (file_exists(FFMPEG)){
		$tmp_file = $path . ".tmp";
		rename($path, $tmp_file);
		$s = FFMPEG . " -i $tmp_file -c:v libx264 -b:v 750k -c:a libfdk_aac -b:a 64k -r 25 -threads 1 $path";
		wlog($s);
		shell_exec($s);
		unlink($tmp_file);
	} else {
		wlog(FFMPEG . ' not found');
	}
}
*/
?>
