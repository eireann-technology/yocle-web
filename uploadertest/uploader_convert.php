<?php

// common
include "common.php";
include "database.php";

function convert($src, $dst){

	
	// http://stackoverflow.com/questions/15524776/ffmpeg-convert-mov-file-to-mp4-for-html5-video-tag-ie9
	// ffmpeg -i INPUTFILE -b 1500k -vcodec libx264 -vpre baseline -g 30 OUTPUT.mp4
	//exec("ffmpeg -y -i $src -b:v 1500k -vcodec libx264 -preset fast -g 30 $dst.mp4");	// -vpre baseline
	//exec("ffmpeg -y -i $src -b 1500k -vcodec libvpx -acodec libvorbis -ab 160000 -f webm -g 30 $dst.webm");
	//exec("ffmpeg -y -i $src -b 1500k -vcodec libtheora -acodec libvorbis -ab 160000 -g 30 $dst.ogv");
	
	// http://superuser.com/questions/859010/what-ffmpeg-command-line-produces-video-more-compatible-across-all-devices
	exec("ffmpeg -i $src -c:v libx264 -crf 23 -profile:v baseline -level 3.0 -pix_fmt yuv420p -c:a aac -ac 2 -strict experimental -b:a 128k -movflags faststart $dst.mp4");
	
	// https://gist.github.com/yellowled/1439610

	// unlock for the right
	mychmod("$dst.mp4");
}

////////////////////////////////////////////////////////////////
//$folder = '/videoboard/web/uploadertest/media/';
//$folder = 'D:\\GoogleDrive\\___CETL\\YOCLE\\web\\dev\\media\\';
$folders = [
	//'D:\\GoogleDrive\\___CETL\\YOCLE\\web\\media\\',
	'D:\\GoogleDrive\\___CETL\\YOCLE\\web\\dev\\media\\',
	//'/videoboard/web/uploadertest/media/',
	//'X:\\videoboard\\web\\uploadertest\\media\\',
];

//convert($folder."21_.mp4", $folder."21__"); exit();	// testing only

while (1){
	$datetime = getDateTime();
	//db.getCollection('media').find({file_cat:'video', old_file: {$exists: false}})
	// db.getCollection('media').find({file_cat:'video', file_name:{$not: /_/}})
	// db.getCollection('media').find({file_cat:'video', file_name: /_/})
	//$documents = databaseRead($database, 'media', ['file_cat'=>'video', 'file_name'=>['$not'=> new MongoDB\BSON\Regex("_", 'i')]]);
	$documents = databaseRead($database, 'media', ['file_name'=>['$not'=> new MongoDB\BSON\Regex("_", 'i')]]);
	if (!sizeof($documents)){
		echo "$datetime no process\r\n";
	} else {
		foreach ($documents as $key => $document){
		
			$media_id = $document->media_id;
			$file_name = $document->file_name;
			$file_cat = $document->file_cat;
			
			for ($j = 0; $j < sizeof($folders); $j++){
				$folder = $folders[$j];
				$src = "$folder$file_name";
				//echo "$src\r\n";
				
				if (!file_exists($src)){
					//echo "continue\r\n";
					continue;
					
				} else {
				
					//echo "file_cat=$file_cat\r\n";
					$dst = $folder . pathinfo($file_name, PATHINFO_FILENAME) . '_';

					$converted = 0;
					switch ($file_cat){
					
						case 'image':
							// all convert to jpg
							$dst .= '.jpg';
							echo "$datetime \033[31m Converting $src to $dst...(media_id=$media_id)\033[0m\n";	//http://blog.lenss.nl/2012/05/adding-colors-to-php-cli-script-output/
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
								echo "$datetime \033[31m Converting $src to $dst...(media_id=$media_id)\033[0m\n";
								convert($src, $dst);
								$dst .= '.mp4';
								$converted = 1;
							}
							break;
					}
					
					// UPDATE DATABASE
					if ($converted){
						$old_file_name = $file_name;
						$new_file_name = basename($dst);
						$new_file_size = filesize($dst);
						$result = databaseUpdate($database, 'media', ['media_id'=>$media_id], ['$set' => [
							'file_name'=>$new_file_name,
							'file_size'=>$new_file_size,
						]]);
					
						// DELETE THE OLD FILE
						unlink($src);
					}
				}
			}
		}
	}
	sleep(60);
}
?>