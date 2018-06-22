<?php

define('WEB_FOLDER',	"/gdrive/_WEB/vb");
define('SRC_FOLDER', 	"/gdrive/_WEB/janus_mjr");
define('CONVERT_MJR',	"/opt/janus/bin/janus-pp-rec");
define('FFMPEG', 	"/usr/bin/ffmpeg2");

/////////////////////////////////////////////////////////////////////
// timeline

function uploadTimeline(){
	global $input, $type, $my_room_id, $user, $output, $error, $def_ext;

	// get param
	$seconds = getQs('seconds');
	$is_dev = getQs('is_dev');

	// the file name
	$now = date_create('Asia/Hong_Kong');
	//$endDateTime = date_format($now, "YmdHis");
	$start = date_sub($now, date_interval_create_from_date_string($seconds . ' secs'));
	$fileName = date_format($start, "YmdHis") . '-' . $seconds;

	// locate paths
	$folder = getFolder($my_room_id, 'timeline', 1);
	$path_tln = $folder . $fileName . '.tln';
	$path_kfr = $folder . $fileName . '.kfr';
	$path_thn = $folder . $fileName . '.' . $def_ext;

	// SAVE THUMBNAIL
	saveThumbnail($path_thn);

	// SAVE TIMENODEARR
	$mjr_arr = [];
	$timeNodeArr = getQs('timeNodeArr');
	if ($timeNodeArr){
		//print_json($timeNodeArr);
		$success = file_put_contents($path_tln, $timeNodeArr);
		mychmod($path_tln);

		// decode the timeline
		$timeNodeArr2 = json_decode($timeNodeArr, true);
		for ($i = 0;  $i < sizeof($timeNodeArr2); $i++){
			$timeNode = $timeNodeArr2[$i];
			$type = $timeNode['type'];
			if ($type == 'av_stream'){
				$rec_id = $timeNode['data']['recordingID'] . '';
				//print_json($rec_id);
				array_push($mjr_arr, $rec_id);
			}
		}
	}

	// SAVE KEYFRAME
	$keyFrameArr = getQs('keyFrameArr');
	if ($keyFrameArr){
		$success = file_put_contents($path_kfr, $keyFrameArr);
		mychmod($path_kfr);
	}

	// CONVERT MJR TO MP4 BY LINUX
	if (sizeof($mjr_arr)){
		//print_json($mjr_arr);
		foreach ($mjr_arr as $index => $rec_id){
			mjr2mp4($my_room_id, $rec_id, $is_dev);
		}
	}

	// OUTPUT
	$output['fileName'] = $fileName;
}

///////////////////////////////////////////////////////////////////

function mjr2mp4($my_room_id, $rec_id, $is_dev){
	return mjr2mp4_rmt($my_room_id, $rec_id, $is_dev);
}

//////////////////////////////////////////////////////////////////////////

function mjr2mp4_rmt($my_room_id, $rec_id, $is_dev){
	set_time_limit(0);
	wlog("mjr2mp4_rmt($my_room_id, $rec_id, $is_dev)");

	// convert by linux
	$server_name = $_SERVER['SERVER_NAME'];
	switch ($server_name){

		//case 'videoboard.hk':
		//	$rv = mjr2mp4_lcl($my_room_id, $rec_id, $is_dev);
		//	break;

		//case 'alanpoon.ddns.net':
		//	$url = "https://192.168.1.40/vb/dev/svrop_record.php";
		//	break;
		//case 'apmac.crabdance.com':
		default:
			$url = "https://alanpoon.ddns.net:444/vb/dev/svrop_record.php";
			break;
	}

	// send the src to the remote server(windows)
	$ch = curl_init($url);
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);	// HTTP://UNITSTEP.NET/BLOG/2009/05/05/USING-CURL-IN-PHP-TO-ACCESS-HTTPS-SSLTLS-PROTECTED-SITES/
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);	// https://stackoverflow.com/questions/20842970/fix-curl-51-ssl-error-no-alternative-certificate-subject-name-matches
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, ['my_room_id' => $my_room_id, 'rec_id' => $rec_id, 'is_dev' => $is_dev]);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	$rv = curl_exec($ch);
	//wlog($rv);
	if (curl_errno($ch)) {
		wlog("Error: " . curl_error($ch));
	} else {
		curl_close($ch);
	}
	return $rv;
}


/////////////////////////////////////////////////////////////////////

function mjr2mp4_lcl($my_room_id, $rec_id, $is_dev){
	set_time_limit(0);
	wlog("mjr2mp4_lcl($my_room_id, $rec_id, $is_dev)");

	$success = 0;

	$audio 	= SRC_FOLDER . "/rec-$rec_id-audio.mjr";
	$video 	=	SRC_FOLDER . "/rec-$rec_id-video.mjr";
	$nfo 		= SRC_FOLDER . "/$rec_id.nfo";

	if (!file_exists($audio)){
		wlog("audio not exist: $audio", 1);
	} else if (!file_exists($video)){
		wlog("video not exist: $video", 1);
	} else {
		wlog("convert_video $my_room_id $rec_id...", 1);
	}

	// create folder if not exist
	$tgt_folder = WEB_FOLDER . ($is_dev ? '/dev' : '') . "/rooms/$my_room_id/video";
	if (!file_exists($tgt_folder)){
		wlog("mkdir...$tgt_folder");
		mkdir($tgt_folder, 0777, true);
		mychmod($tgt_folder);
	}

	// define output file
	$tgt_file = "$tgt_folder/$rec_id.mp4";
	mychmod($tgt_file);

	// temp files
	//$opus = "$tgt_folder/temp.opus";
	//$webm = "$tgt_folder/temp.webm";
	$temp_folder = "/etc/temp";
	if (!file_exists($temp_folder)){
		wlog("mkdir...$temp_folder");
		mkdir($temp_folder, 0777, true);
		mychmod($temp_folder);
	}
	$opus = "$temp_folder/temp.opus";
	$webm = "$temp_folder/temp.webm";

	// delete before execute
	if (file_exists($opus)){
		wlog("unlink $opus");
		unlink($opus);
	}
	if (file_exists($webm)){
		wlog("unlink $webm");
		unlink($webm);
	}
	if (file_exists($tgt_file)){
		wlog("unlink $tgt_file");
		unlink($tgt_file);
	}

	// conver audio from mjr to opus
	//wlog("generating audio opus...$opus", 0);
	$s = CONVERT_MJR . " $audio $opus";
	wlog($s);
	shell_exec($s);
	//var_dump(shell_exec($s));
	$opus_okay = file_exists($opus)?1:0;
	//wlog($s . " ok=$opus_okay", 0);
	wlog("generating audio opus...$opus $opus_okay");

	// convert video from mjr to webm
	//wlog("generating video webm...$webm", 0);
	$s = CONVERT_MJR . " $video $webm";
	wlog($s);
	shell_exec($s);
	//var_dump(shell_exec($s));
	$webm_okay = file_exists($webm)?1:0;
	wlog("generating video webm...$webm $webm_okay");

	//$s = "ffmpeg -version";	var_dump(shell_exec($s)); exit();
	if ($opus_okay || $webm_okay){

		// generating mp4
		wlog("generating mp4...$tgt_file", 0);
		$files = "";
		if ($opus_okay){
			$files .= " -i $opus";
		}
		if ($webm_okay){
			$files .= " -i $webm";
		}
		//$s = FFMPEG . " " . $files . " -c:v libx264 -b:v 500k -c:a libfdk_aac -b:a 64k -r 25 -threads 1 $tgt_file";
		$s = FFMPEG . " " . $files . " -c:v libx264 -b:v 750k -c:a libfdk_aac -b:a 64k -r 25 -threads 1 $tgt_file";
		wlog($s, 0);
		shell_exec($s);

		// removing old files
		if ($opus_okay){
			unlink($opus);
		}
		if ($webm_okay){
			unlink($webm);
		}
		$exists = file_exists($tgt_file);
		$filesize = filesize($tgt_file);
		wlog("generated $tgt_file exist=$exists size=" . $filesize, 1);
		if ($exists && $filesize > 0)
		{
			wlog("removing old files...", 0);
			unlink($audio);
			unlink($video);
			unlink($nfo);
			$success = 1;
		}

	}
	return $success;
}

/////////////////////////////////////////////////////////////////////

function downloadTimelineList(){
	global $input, $type, $my_room_id, $user, $output, $error;
	//if (checkLogin())
	{
		$folder = getFolder2($my_room_id, 'timeline');
		$files = array_reverse(glob($folder.'*'));
		$file_arr = [];
		foreach ($files as $path){
			if (strrpos($path, '.tln') > 0){// === false){
				$tln_name = basename($path);
				// check txt for status
				$tln_status_file = $folder . $tln_name . ".status";
				$tln_status = '',
				if (file_exists($tln_status_file)){
					$tln_status = file_get_contents($tln_status_file);
				}
				array_push($file_arr, [
					'name' => $tln_name,
					'status' => $tln_status,
				);
			}
		}
		$output['file_arr'] = $file_arr;
	}
}

/////////////////////////////////////////////////////////////////////

function downloadTimeline(){
	global $input, $type, $my_room_id, $user, $output, $error, $def_ext;

	$fileName = getQs('fileName');

	// locate paths
	$folder = getFolder($my_room_id, 'timeline', 1);
	$path_tln = $folder . $fileName . '.tln';
	$path_kfr = $folder . $fileName . '.kfr';
	$path_thn = $folder . $fileName . '.' . $def_ext;

	if (file_exists($path_tln)){
		$output['timeNodeArr'] = file_get_contents($path_tln);	// de-serialize
	}
	if (file_exists($path_kfr)){
		$output['keyFrameArr'] = file_get_contents($path_kfr);	// de-serialize
	}
}

if (!function_exists('wlog')){
	//set_time_limit(600);	// max 10 mins
	ini_set('display_errors', 1);
	error_reporting(E_ALL);
	include "common.php";

	$my_room_id = getQs('my_room_id');
	$rec_id = getQs('rec_id');
	$is_dev = getQs('is_dev');

	if (!$my_room_id){
		$my_room_id = 'adialeung';
		$rec_id = '8444830097924836';
		$is_dev =	0;
	}
	$rv = mjr2mp4_lcl($my_room_id, $rec_id, $is_dev);
	echo $rv;
}


?>
