<?php

define('MAX_REDUCED_WIDTH', 800);
define('MAX_REDUCED_HEIGHT', 800);

define('MAX_THUMBNAIL_WIDTH', 156);
define('MAX_THUMBNAIL_HEIGHT', 156);

// common
include "../common.php";
include "../database.php";

function convert($src, $dst){
	$success = 0;
	$dst_thumbnail = $dst . ".mp4";
	// http://stackoverflow.com/questions/15524776/ffmpeg-convert-mov-file-to-mp4-for-html5-video-tag-ie9
	// ffmpeg -i INPUTFILE -b 1500k -vcodec libx264 -vpre baseline -g 30 OUTPUT.mp4
	//exec("ffmpeg -y -i $src -b:v 1500k -vcodec libx264 -preset fast -g 30 $dst.mp4");	// -vpre baseline
	//exec("ffmpeg -y -i $src -b 1500k -vcodec libvpx -acodec libvorbis -ab 160000 -f webm -g 30 $dst.webm");
	//exec("ffmpeg -y -i $src -b 1500k -vcodec libtheora -acodec libvorbis -ab 160000 -g 30 $dst.ogv");

	// http://superuser.com/questions/859010/what-ffmpeg-command-line-produces-video-more-compatible-across-all-devices
	exec('ffmpeg -i "'.$src.'" -c:v libx264 -crf 23 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -ac 2 -strict experimental -b:a 128k -movflags faststart "'.$dst_thumbnail.'"');

	// https://gist.github.com/yellowled/1439610

	// unlock for the right
	if (file_exists($dst_thumbnail)){
		mychmod($dst_thumbnail);
		$success = 1;
	}
	return $success;
}

////////////////////////////////////////////////////////////////
// OUTPUT FOLDER LISTS
////////////////////////////////////////////////////////////////

$test_folders = [
	//'/videoboard/web/uploadertest/media/',														// linux test running on linux
	//'X:\\videoboard\\web\\uploadertest\\media\\',											// linux test running on windows
	//'D:\\GoogleDrive\\___CETL\\YOCLE\\web\\dev\\media\\',							// development server
	//'C:\\Users\\AlanPoon\\Google Drive\\___CETL\\YOCLE\\web\\media\\',	// production server
	'/gdrive/_WEB/yocle/media/',	// yocle
	'/Users/alanpoon/Google Drive/_WEB/yocle/media',	// macos
];
$folders = [];

foreach ($test_folders as $index => $folder){

	//echo $folder . " " . strrpos($folder, '/') . ', ' . (strlen($folder)-1) . "\r\n";
	if (strrpos($folder, '/') != strlen($folder) - 1){
		$folder .= '/';
	}

	if (file_exists($folder)){
		echo "output folder: $folder\r\n\r\n";
		array_push($folders, $folder);
	}
}
//exit();

////////////////////////////////////////////////////////////////////

$debug = 1;
$nfolder = sizeof($folders);
echo "nfolder=$nfolder\n";
//exit();

//convert($folder."21_.mp4", $folder."21__"); exit();	// testing only

while (1){
	$datetime = getDateTime();

	//echo "$datetime reading...\r\n";
	$filters = ['file_name'=>['$not'=> new MongoDB\BSON\Regex("_", 'i')]];
	//$filters = []; // converting all the media

	$documents = databaseRead($database, 'media', $filters);

	//echo "$datetime reading completed. size=" . sizeof($documents) . "\r\n";
	if (!sizeof($documents)){

		//echo "$datetime no process\r\n";

	} else {

		// read thru all the documents
		foreach ($documents as $key => $document){

			$media_id = $document->media_id;

			$file_name = $document->file_name;
			$file_name = str_replace('__', '_', $file_name);	// remove redundant underscores
			$orig_file_name = str_replace('_', '', $file_name);	// remove redundant underscores

			$file_cat = $document->file_cat;
			if ($debug){
				//echo "$media_id $file_name $file_cat\r\n";
			}
			for ($j = 0; $j < $nfolder; $j++){
				$folder = $folders[$j];
				$src = "$folder$orig_file_name";
				//echo "$src\r\n"; exit();

				if (!file_exists($src)){

					//echo "$datetime file not found: $src\r\n";
					continue;

				} else {

					//if ($debug){
					//	echo "$datetime file_cat=$file_cat\r\n";
					//}
					if ($debug){
						//echo "$datetime: $src ($file_cat)\r\n";
					}
					$file_name2 = pathinfo($file_name, PATHINFO_FILENAME);
					$file_name2 = str_replace('_', '', $file_name2);
					$dst_filename = $folder . $file_name2;

					$converted = 0;
					switch ($file_cat){

						case 'image':
							// phrased out
							//http://blog.lenss.nl/2012/05/adding-colors-to-php-cli-script-output/
							// all convert to jpg
							$dst_reduced = $dst_filename . '_.jpg';
							$dst_thumbnail = $dst_filename . '_t.jpg';

							//echo "$datetime \033[31m Converting $src to $dst...(media_id=$media_id)\033[0m\n";
							$src2 = basename($src);
							$dst_reduced2 = basename($dst_reduced);
							$dst_thumbnail2 = basename($dst_thumbnail);
							echo "$datetime Reducing $src2 to $dst_reduced2 & $dst_thumbnail2...\r\n";

							try {

								// read file
								$im1 = new Imagick();
								$im1->readImage($src);
								$d = $im1->getImageGeometry();
								$w0 = $d['width'];
								$h0 = $d['height'];
								$im2 = clone $im1;

								// convert to jpeg
								$im1->setImageFormat('jpg');
								$im1->setImageCompression(Imagick::COMPRESSION_LZW);
								$im1->setImageCompressionQuality(80);

								// generate reduced
								//if (!file_exists($dst_reduced))
								{
									$size_reduced = reduceImageSize($w0, $h0, MAX_REDUCED_WIDTH, MAX_REDUCED_HEIGHT);
									$im1->resizeImage($size_reduced['w'], $size_reduced['h'], Imagick::FILTER_LANCZOS, 1);
									$im1->writeImage($dst_reduced);
								}

								// generate thumbnails
								//if (!file_exists($dst_thumbnail))
								{
									$size_thumbnail = reduceImageSize($w0, $h0, MAX_THUMBNAIL_WIDTH, MAX_THUMBNAIL_HEIGHT);
									$im2->resizeImage($size_thumbnail['w'], $size_thumbnail['h'], Imagick::FILTER_LANCZOS, 1);
									$im2->writeImage($dst_thumbnail);
								}
								$converted = 1;
							} catch (Exception $e){
								echo "...failed\n";
							}
							break;

						case 'video':
							$dst_reduced = $dst_filename . '_.mp4';
							if (file_exists($dst_reduced)){
								echo "$datetime $dst is probably already converting (by client request)\r\n";
								$converted = 1;

							} else {
								//echo 1;
								//http://blog.lenss.nl/2012/05/adding-colors-to-php-cli-script-output/
								//echo "$datetime \033[31m Converting $src to $dst...(media_id=$media_id)\033[0m\n";
								echo "$datetime Converting $src to $dst_reduced...\n\n\n";
								if (convert($src, $dst_reduced)){
									$converted = 1;
								} else {
									echo "...failed\n";
								}
							}
							break;

					}
					// UPDATE DATABASE
					//$converted = 0;
					if ($converted)
					{
						if ($debug){
							echo "updating database...$dst_reduced\r\n";
						}
						//$old_file_name = $file_name;
						$new_file_name = basename($dst_reduced);
						$new_file_size = filesize($dst_reduced);
						$result = databaseUpdate($database, 'media', ['media_id' => $media_id], ['$set' => [
							'file_name' => $new_file_name,
							'file_size' => $new_file_size,
						]]);
						// DELETE THE OLD FILE
						//unlink($src);	// never delete a uploaded file

						if ($debug){
							echo "updated database...\r\n";
						}
					}
				}
			}
		}
	}
	echo "wait for 1 min...\r\n";
	sleep(60);
}
?>
