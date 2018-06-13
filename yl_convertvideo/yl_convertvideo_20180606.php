<?php

include "../common.php";
include "../database.php";

//define('WEB_FOLDER',	"/gdrive/_WEB/vb");
//define('SRC_FOLDER', 	"/gdrive/_WEB/janus_mjr");
//define('CONVERT_MJR',	"/opt/janus/bin/janus-pp-rec");

$OS = strtoupper(substr(PHP_OS, 0, 3));
$cmp = strcmp($OS, 'WIN');
//echo $OS == 'WIN'?1:0; exit();
if ($cmp == 0) {
	define('BASE_PATH', "D:\\");
	define('FFMPEG', 	"C:\\ffmpeg\\bin\\ffmpeg.exe");
} else {
	define('BASE_PATH', "/");
	define('FFMPEG', 	"/usr/bin/ffmpeg2");
}

/////////////////////////////////////////////////////

function convert_video($src, $tgt){
	global $database;

	// D:\gdrive\_WEB\yocle\media\1012.mp4
	wlog2("convert_video: src=$src tgt=$tgt");
	if (file_exists(FFMPEG)){

		// update video path
		$src_name = getFileNameWithoutParent($src);
		$tgt_name = getFileNameWithoutParent($tgt);
		$src_media = getFileNameWithoutExt($src_name);
		$media_id = intval($src_media);
		//wlog2("src_name: " . $src_name);
		wlog2("\r\n\r\nProcessing media_id: " . $media_id . "...");
		//wlog2("tgt_name: " . $tgt_name);

		$filters = ['media_id' => $media_id];

		// check if the media exist in the database
		$options = [ 'projection' => ['_id' => 0]];//,  'confirmed_email' => 1, 'pwd' => 1]];
		$medias = databaseRead($database, 'media', $filters, $options);
		if ($medias && sizeof($medias) > 0){
			$media = json_decode(json_encode($medias[0]), false);
			//print_json($media);

			// convert now
			$s = FFMPEG . " -hide_banner -loglevel info -y -i \"$src\" -c:v libx264 -b:v 750k -c:a libfdk_aac -b:a 64k -r 25 -threads 1 \"$tgt\"";
			wlog2($s);
			shell_exec($s);

			$updates = ['$set' => [
				'file_name' => $tgt_name,
			]];
			$result = databaseUpdate($database, 'media', $filters, $updates);
			wlog2('***Done');

		} else {
			// not found remove this file (rename to xxx first)
			rename($src, $src . ".xxx");
		}
		//exit();

	} else {
		wlog2(FFMPEG . ' not found');
	}
}

/////////////////////////////////////////////////////

function check_folders(){
	global $database;
	// loop the status files
	$media_folder = BASE_PATH . "gdrive" . SLASH . "_WEB" . SLASH . "yocle" . SLASH . "media" . SLASH;
	wlog2("checking folders...".$media_folder."\r\n");
	foreach (glob($media_folder."*.mp4") as $video_filepath){

		if (strpos($video_filepath, '(') !== false){	// no bracket
			// skipped

		} else if (strpos($video_filepath, '_.mp4.mp4') !== false){
			////////////////////////////////////////////////////
			// rename to proper names
			////////////////////////////////////////////////////
			$video_filename = getFileNameWithoutParent($video_filepath);
			$media_id = getFileNameWithoutExt($video_filename);
			$media_id = getFileNameWithoutExt($media_id);
			$media_id = intval($media_id);
			$video_filepath2 = $media_id . "_.mp4";
			wlog2("rename: media_id=$media_id filepath=$video_filepath2");

			// update database
			$media_id = intval($video_filename);
			$filters = ['media_id' => $media_id];
			$updates = ['$set' => [
				'file_name' => $video_filepath2,
			]];
			$result = databaseUpdate($database, 'media', $filters, $updates);

			// update file system
			rename($video_filepath, $media_folder . $video_filepath2);

		} else {
			////////////////////////////////////////////////////
			// convert video
			////////////////////////////////////////////////////
			$video_filename1 = getFileNameWithoutExt($video_filepath);
			if (substr($video_filename1, -1) != '_'){ // not ending with _
				$video_filename2 = $media_folder . $video_filename1 . '_.mp4';
				if (!file_exists($video_filename2)){ // not existing
					echo $video_filepath . "\r\n";
					convert_video($video_filepath, $video_filename2);
				}
			}
		}
	}
}

/////////////////////////////////////////////////////
// the main program
/////////////////////////////////////////////////////
$sleep = 60;
while (1){
	check_folders();
	//wlog2("sleeping ".$sleep."s...");
	Sleep($sleep);
}
?>
