<?php

// common
include "common.php";
include "database.php";

function convert($src, $dst){
	$success = 0;
	$dst2 = $dst . ".mp4";
	// http://stackoverflow.com/questions/15524776/ffmpeg-convert-mov-file-to-mp4-for-html5-video-tag-ie9
	// ffmpeg -i INPUTFILE -b 1500k -vcodec libx264 -vpre baseline -g 30 OUTPUT.mp4
	//exec("ffmpeg -y -i $src -b:v 1500k -vcodec libx264 -preset fast -g 30 $dst.mp4");	// -vpre baseline
	//exec("ffmpeg -y -i $src -b 1500k -vcodec libvpx -acodec libvorbis -ab 160000 -f webm -g 30 $dst.webm");
	//exec("ffmpeg -y -i $src -b 1500k -vcodec libtheora -acodec libvorbis -ab 160000 -g 30 $dst.ogv");
	
	// http://superuser.com/questions/859010/what-ffmpeg-command-line-produces-video-more-compatible-across-all-devices
	exec('ffmpeg -i "'.$src.'" -c:v libx264 -crf 23 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -ac 2 -strict experimental -b:a 128k -movflags faststart "'.$dst2.'"');
	
	// https://gist.github.com/yellowled/1439610

	// unlock for the right
	if (file_exists($dst2)){
		mychmod($dst2);
		$success = 1;
	}
	return $success;
}

////////////////////////////////////////////////////////////////
// OUTPUT FOLDER LISTS
////////////////////////////////////////////////////////////////

$test_folders = [
	'/videoboard/web/uploadertest/media/',														// linux test running on linux
	'X:\\videoboard\\web\\uploadertest\\media\\',											// linux test running on windows
	'D:\\GoogleDrive\\___CETL\\YOCLE\\web\\dev\\media\\',							// development server
	'C:\\Users\\AlanPoon\\Google Drive\\___CETL\\YOCLE\\web\\media\\',	// production server
];
$folders = [];

foreach ($test_folders as $index => $folder){
	if (file_exists($folder)){
		echo "output folder: $folder\r\n\r\n";
		array_push($folders, $folder);
	}
}
////////////////////////////////////////////////////////////////////

$debug = 1;
//convert($folder."21_.mp4", $folder."21__"); exit();	// testing only

while (1){
	$datetime = getDateTime();
	//echo "$datetime reading...\r\n";
	$documents = databaseRead($database, 'media', ['file_name'=>['$not'=> new MongoDB\BSON\Regex("_", 'i')]]);
	//echo "$datetime reading completed. size=" . sizeof($documents) . "\r\n";
	if (!sizeof($documents)){
		echo "$datetime no process\r\n";
	} else {
		// read thru all the documents
		foreach ($documents as $key => $document){
		
			$media_id = $document->media_id;
			$file_name = $document->file_name;
			$file_cat = $document->file_cat;
			//echo "$media_id $file_name $file_cat\r\n";
			
			for ($j = 0; $j < sizeof($folders); $j++){
				$folder = $folders[$j];
				$src = "$folder$file_name";
				if ($debug){
					//echo "$src\r\n";
				}
				if (!file_exists($src)){
					echo "$datetime file not found: $src\r\n";
					continue;
					
				} else {
					//if ($debug){
					//	echo "$datetime file_cat=$file_cat\r\n";
					//}
					$dst = $folder . pathinfo($file_name, PATHINFO_FILENAME) . '_';

					$converted = 0;
					switch ($file_cat){
					
						case 'image':
							//http://blog.lenss.nl/2012/05/adding-colors-to-php-cli-script-output/
							// all convert to jpg
							$dst .= '.jpg';
							//echo "$datetime \033[31m Converting $src to $dst...(media_id=$media_id)\033[0m\n";
							echo "$datetime Converting $src to $dst...(media_id=$media_id)\n";
							try {
								$im = new Imagick(); 
								$im->readImage($src);
								$im->setImageFormat('jpg');
								$im->setImageCompression(Imagick::COMPRESSION_LZW);
								$im->setImageCompressionQuality(80);					
								$im->writeImage($dst);
								$converted = 1;
							} catch (Exception $e){
								echo "...failed\n";
							}
							break;
							
						case 'video':

							if (file_exists($dst.'.mp4')){
								$dst .= '.mp4';
								echo "$datetime $dst is probably already converting (by client request)\r\n";
								$converted = 1;
								
							} else {
								//echo 1;
								//http://blog.lenss.nl/2012/05/adding-colors-to-php-cli-script-output/
								//echo "$datetime \033[31m Converting $src to $dst...(media_id=$media_id)\033[0m\n";
								echo "$datetime Converting $src to $dst.mp4...\n\n\n";
								if (convert($src, $dst)){
									$dst .= '.mp4';
									$converted = 1;
								} else {
									echo "...failed\n";
								}
							}
							break;
					}
					
					// UPDATE DATABASE
					if ($converted){
						if ($debug){
							echo "updating database...\r\n";
						}
						$old_file_name = $file_name;
						$new_file_name = basename($dst);
						$new_file_size = filesize($dst);
						$result = databaseUpdate($database, 'media', ['media_id'=>$media_id], ['$set' => [
							'file_name'=>$new_file_name,
							'file_size'=>$new_file_size,
						]]);
					
						// DELETE THE OLD FILE
						unlink($src);
						if ($debug){
							echo "updated database...\r\n";
						}
					}
				}
			}
		}
	}
	sleep(60);
}
?>