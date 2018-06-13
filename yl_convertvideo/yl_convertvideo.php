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
	// windows
	define('BASE_PATH', "D:\\");
	define('FFMPEG', 	"C:\\ffmpeg\\bin\\ffmpeg.exe");
} else if (file_exists('/Users/alanpoon')){
	// macos
	define('BASE_PATH', "/Users/alanpoon/");
	define('FFMPEG', 	"/usr/bin/ffmpeg2");
} else {
	// linux
	define('BASE_PATH', "/");
	define('FFMPEG', 	"/usr/bin/ffmpeg2");
}
//$media_folder = BASE_PATH . "gdrive" . SLASH . "_WEB" . SLASH . "yocle" . SLASH . "media" . SLASH;
define('MEDIA_FOLDER', BASE_PATH . "gdrive" . SLASH . "_WEB" . SLASH . "yocle" . SLASH . "media" . SLASH);

/////////////////////////////////////////////////////

function check_photos(){

	global $database;

	// loop the status files
	wlog2("checking photos..." . MEDIA_FOLDER . "\r\n");

	// check videos
	foreach (glob(MEDIA_FOLDER . "*_.jp*") as $filepath){
	//foreach (glob(MEDIA_FOLDER . "test.jpg") as $filepath){
	//foreach (glob(MEDIA_FOLDER . "1262_.jpeg") as $filepath){

		//echo $filepath . "\r\n";
		if (strpos($filepath, '(') !== false){	// no bracket

		} else {

			// read an image to imagick
			$im = new imagick();

			// approach 1: may from url too
			//$handle = fopen($filepath, 'rb');
			//$im->readImageFile($handle);
			$im->readImage($filepath);

			// process image
			$bfr = $im->getImageOrientation();
			if ($bfr && $bfr != imagick::ORIENTATION_TOPLEFT){

				// rotate image
				autoRotateImage($im);
				$aft = $im->getImageOrientation();
				wlog2($filepath . " orientation: $bfr -> $aft");

				// write image
				$im->writeImage($filepath);
			}
		}
	}
	wlog2("completed photos.\r\n");

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
			//rename($src, $src . ".xxx");
		}
		//exit();

	} else {
		wlog2(FFMPEG . ' not found');
	}
}

/////////////////////////////////////////////////////

function check_videos(){
	global $database;

	// loop the status files
	wlog2("checking videos..." . MEDIA_FOLDER . "\r\n");

	// check videos
	foreach (glob(MEDIA_FOLDER . "*.{mp4,mov}", GLOB_BRACE) as $filepath){
	//foreach (glob(MEDIA_FOLDER . "1295.{mp4,mov}", GLOB_BRACE) as $filepath){	// from iphone
	//foreach (glob(MEDIA_FOLDER . "1272.{mp4,mov}", GLOB_BRACE) as $filepath){	// test rotation
		//$rotate = getVideoRotate($filepath);
		//wlog2("$filepath rotate=$rotate\r\n"); continue;
		//continue;
///*
		if (strpos($filepath, '(') !== false){	// no bracket
			// skipped

		} else if (strpos($filepath, '[Conflict]') !== false){	// no bracket
				// skipped

		} else if (strpos($filepath, '_.mp4.mp4') !== false){
			// no repeated
			////////////////////////////////////////////////////
			// rename to proper names
			////////////////////////////////////////////////////
			$video_filename = getFileNameWithoutParent($filepath);
			$media_id = getFileNameWithoutExt($video_filename);
			$media_id = getFileNameWithoutExt($media_id);
			$media_id = intval($media_id);
			$filepath2 = $media_id . "_.mp4";
			wlog2("rename: media_id=$media_id filepath=$filepath2");

			// update database
			$media_id = intval($video_filename);
			$filters = ['media_id' => $media_id];
			$updates = ['$set' => [
				'file_name' => $filepath2,
			]];
			$result = databaseUpdate($database, 'media', $filters, $updates);

			// update file system
			rename($filepath, MEDIA_FOLDER . $filepath2);

		} else {
			////////////////////////////////////////////////////
			// convert video
			////////////////////////////////////////////////////
			$video_filename1 = getFileNameWithoutExt($filepath);
			if (substr($video_filename1, -1) != '_'){ // not ending with _
				$video_filename2 = MEDIA_FOLDER . $video_filename1 . '_.mp4';
				if (!file_exists($video_filename2)){ // not existing
					echo $filepath . "\r\n";
					convert_video($filepath, $video_filename2);
				}
			}
		}
//*/
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
// getVideoRotate
// https://github.com/PHP-FFMpeg/PHP-FFMpeg
// https://github.com/PHP-FFMpeg/PHP-FFMpeg/wiki/How-to-rotate-video-based-on-smartphone-rotate-meta-tag
// https://addpipe.com/blog/mp4-rotation-metadata-in-mobile-video-files/
// https://stackoverflow.com/questions/11000107/detect-orientation-of-video-and-auto-rotate-if-needed
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
require 'vendor/autoload.php';

function getVideoRotate($filepath){
	$rotate = 0;
	//$config = array();
	$ffmpeg = FFMpeg\FFMpeg::create();
	// get file
	$video = $ffmpeg->open($filepath);
	//print_json($video->get('tags'));

	// get stream
	$videostream = $ffmpeg
		->getFFProbe()
		->streams($filepath)
		->videos()
		->first()
	;
	if (! $videostream instanceof FFMpeg\FFProbe\DataMapping\Stream){
		//throw new \Exception('No stream given');
		//wlog2('no stream');
	} else if (!$videostream->has('tags')) {
		//wlog2('no tag');
	} else {
		$tags = $videostream->get('tags');
		//print_json($tags);
		if (! isset($tags['rotate'])) {
			//wlog2('no rotate');
		} else if ($tags['rotate'] == 0) {
			//wlog2('rotate=0');
		} else {
			$rotate = $tags['rotate'];
			//wlog2("rotate=$rotate");
		}
	}
	return $rotate;
}
*/

/////////////////////////////////////////////////////
// the main program
/////////////////////////////////////////////////////
$sleep = 60;
while (1){
	check_videos();
	//check_photos();
	//wlog2("sleeping ".$sleep."s...");
	Sleep($sleep);
}
?>
