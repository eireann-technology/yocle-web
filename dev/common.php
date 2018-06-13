<?php

//define('EMPTY_OBJ', json_encode (json_decode ("{}")));
//define('EMPTY_OBJ', ['null'=>'null']);

$debug_svrop = 0;

///////////////////////////////////////////////////////////////////////////////
// make sure the parent folder is grant full control for everyone (Windows)
///////////////////////////////////////////////////////////////////////////////
function wlog($str) {
	global $logfile, $debug_svrop;
	//return;
	// log to the output
	$log_str = getDateTime() . " {$str}\r\n";
	if (($fp = fopen($logfile, 'a+')) !== false) {
		fputs($fp, $log_str);
		fclose($fp);
	} else {
		echo 'error in wlog';
	}
}

/////////////////////////////////////////////////////////////////////

function mychmod($path){
	global $error;
	//return;

	//echo "chmod $path"; exit();
	try {
		//chmod($path, 0755);
		if (is_dir($path)){
			$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
			foreach($iterator as $item){
				chmod($item, 0777);
			}
		} else if (file_exists($path)){
			chmod($path, 0777);
		}
	} catch (Exception $e) {
		//wlog('Caught exception: '.$path.' '.$e->getMessage().' \n');
		$error = 'Caught exception: '.$path.' '.$e->getMessage();
		wlog($error);
	}
}

/////////////////////////////////////////////////////////////////////

function getDateTime(){
	return date('Y-m-d H:i:s', time());
}

///////////////////////////////////////////////////////////////////////////////////////

function getDateTimeStamp(){
	return date('YmdHis', time());
}

///////////////////////////////////////////////////////////////////////////
// find schoolyear

function getSchoolYear($s_date){
	$schoolyear = "";
	$datetime1 = new DateTime($s_date);
	$datetime2 = new DateTime();	// now
	$interval = $datetime1->diff($datetime2);
	$days = intval($interval->format('%R%a'));
	$years = 0;
	//echo "$days day(s)<br/>";	// testing only
	if ($days > 0){
		$years = $days / 365;
		if ($years > intval($years)){
			$years = intval($years) + 1;
		}
		$schoolyear = ", Year $years";
	}
	return $schoolyear;
}

///////////////////////////////////////////////////////////////////////////
// find period

function getPeriod($s_date){
	$datetime1 = new DateTime($s_date);
	$datetime2 = new DateTime();
	$interval = $datetime1->diff($datetime2);
	$period = "";
	$days = intval($interval->format('%R%a'));
	$years = $interval->format('%y');
	$months = $interval->format('%m');
	//echo "$months month(s)<br/>";	// testing only
	if ($days < 31){
		// no month yet
	} else {
		// year(s) month(s)
		if ($years > 0){
			$period = $interval->format('%y year');
			if ($years > 1){
				$period .= 's';
			}
		}
		if ($months > 0){
			if ($period != ""){
				$period .= " ";
			}
			$period .= $interval->format('%m month');
			if ($months > 1){
				$period .= 's';
			}
		}
		$period = " ($period)";
	}
	return $period;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// http://stackoverflow.com/questions/7431313/php-getting-full-server-name-including-port-number-and-protocol

function my_server_url(){
	$server_name = $_SERVER['SERVER_NAME'];
	$path = $_SERVER['REQUEST_URI']; // e.g. /dev/phpinfo.php
	//$arr = explode('/', $path);	// for /dev
	$host = '';
	if ($server_name == 'yolofolio2.cetl.hku.hk'){
		// special forwarding
		$host = 'https://yolofolio2.cetl.hku.hk:18443';
	} else {
		// other server
		if (!empty($_SERVER['HTTPS']) && (strtolower($_SERVER['HTTPS']) == 'on' || $_SERVER['HTTPS'] == '1')) {
				$scheme = 'https';
		} else {
				$scheme = 'http';
		}
		if (!in_array($_SERVER['SERVER_PORT'], [80, 443])) {
				$port = ":$_SERVER[SERVER_PORT]";
		} else {
				$port = '';
		}
		$host = $scheme.'://'.$server_name.$port;
	}

	//if (sizeof($arr) <= 2){
	//	return $host;
	//} else {
	//	return $host.'/'.$arr[1];
	//}
	$index = strpos($path, "/dev/");
	if ($index > 0){
		//$host .= "/dev";
		// copy string up to /dev/
		$host .= substr($path, 0, $index) . "/dev";
	}
	return $host;
}

$database = "yolofolio";

define('SLASH', DIRECTORY_SEPARATOR);

date_default_timezone_set('Asia/Hong_Kong');
$user = get_current_user();
$logfile = getcwd() . SLASH . 'svrop.log';
$def_ext = 'jpg';
$jpg_quality = 94;

///////////////////////////////////////////////////////////////////////

function jsonclone($obj){
	//return json_decode( json_encode($obj), true);
	return json_decode( json_encode($obj));
}

///////////////////////////////////////////////////////////////////////////////////////

function getQS($name){
	global $test_qs;
	if (isset($test_qs)){
		if (isset($test_qs[$name])){
			return $test_qs[$name];
		} else {
			return '';
		}
	} else if (isset($_REQUEST[$name])){
		return $_REQUEST[$name];
	} else {
		//echo "missed $name<br/>";
		return '';
	}
	//return isset($_REQUEST[$name]) ? $_REQUEST[$name] : '';
}

///////////////////////////////////////////////////////////////////////////////////////

function getJsonPath(&$doc, $arr){
	if (!$doc){
		echo "Error in null doc<br><br>";
		print_r($arr);
	}
	$path = '$doc';
	//	echo gettype($doc).", ".$doc."<br><br>";
	//print_r($doc); echo "<br><br>";
	foreach ($arr as $key => $value){
		$path .= "['".$value."']";
		//echo "$path<br><br>";
		$test = eval('return isset('.$path.')?1:0;');
		if (!$test){
			//echo "$path<br><br>";
			eval("$path=[];");
		}
	}
	//print_r($doc['skills']['Communication']['assessors']); echo "<br><br>";
	return eval('return '.$path.';');
}

///////////////////////////////////////////////////////////////////////////////////////

function print_json($json){
	echo "<pre>".json_encode($json, JSON_PRETTY_PRINT)."</pre>";
}

///////////////////////////////////////////////////////////////////////////////////////

function objclone($obj){
	unserialize(serialize($obj));
}

///////////////////////////////////////////////////////////////////////////////////////

function getDateWithoutSecond($s){
///*
	$len = strlen($s);
	if (!$len){
		return '';
	} else if ($len >= 16){
		// yyyy-mm-dd hh:mm:ss
		//return s.substring(0, 16);
		return substr($s, 0, 16);
	} else if ($len == 8){
		//return s.substring(0, 5);
		return substr($s, 0, 5);
	} else {
		return $s;
	}
//*/
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function reduceImageSize($w0, $h0, $w1, $h1){	// w1xh1 => max size
	$w = $w0;
	$h = $h0;
	$r = $w0 / $h0;
	if ($w > $w1){
		$w = $w1;
		$h = intval($w / $r);
		wlog('reduceImageSize1: ' . $w0 . 'x' . $h0 . ' =>' . $w . 'x' . $h);
	} else if ($h > $h1){
		$h = $h1;
		$w = intval($h * $r);
		wlog('reduceImageSize2: ' . $w0 . 'x' . $h0 . ' => ' . $w . 'x' . $h);
	} else {
		wlog('reduceImageSize0: ' . $w0 . 'x' . $h0 . ' < ' . $w1 . 'x' . $h1);
	}
	return [
		'w' => $w,
		'h' => $h,
	];
}

///////////////////////////////////////////////////////////////////////////////////

function toggleTimer($time_bfr){
	$time_now = microtime(true);
	if (!isset($time_bfr)){
		return $time_now;
	} else {
		echo ($time_now - $time_bfr) . ' ms';
	}
}

///////////////////////////////////////////////////////////////////////////////////////

function hash2numArr_key($hasharr){
	//if (is_array($hasharr)){
	//	return $hasharr;
	//} else
	if (!isset($hasharr) || !count($hasharr)){
		return [];
	} else {
		$numarr = [];
		foreach ($hasharr as $key => $value){
			array_push($numarr, $key);
		}
		sort($numarr);
		return $numarr;
	}
}

///////////////////////////////////////////////////////////////////////////////////////

function hash2numArr_value($hasharr){
	//if (is_array($hasharr)){
	//	return $hasharr;
	//} else
	if (!isset($hasharr)){
		return [];
	//} else if (is_array($hasharr)){
	//	return $hasharr;
	} else if (!count($hasharr)){
		return [];
	} else {
		$numarr = [];
		foreach ($hasharr as $key => $value){
			array_push($numarr, $value);
		}
		sort($numarr);
		return $numarr;
	}
}

///////////////////////////////////////////////////////////////////////////////////////

function hash2numArr_nonemail($hasharr){
	$numarr = [];
	foreach ($hasharr as $id => $value){
		if (strpos($id, '@') === false){
			// filter email, only numbers
			array_push($numarr, $id);
		}
	}
	sort($numarr);
	return $numarr;
}


///////////////////////////////////////////////////////////////////////////////////////

function num2hashArr($numarr){
	if (!is_array($numarr)){
		return $numarr;
	} else {
		$hasharr = [];
		foreach ($numarr as $index => $value){
			$hasharr[$value] = 1;
		}
		return $hasharr;
	}
}

///////////////////////////////////////////////////////////////////////////////////////

function num2hashArr2($numarr, &$hasharr){
	if (is_array($numarr)){
		foreach ($numarr as $index => $value){
			$hasharr[$value] = 1;
		}
	}
}

///////////////////////////////////////////////////////////////////////////////////////

function getDecPlace($number, $dp){
	return number_format((float)$number, $dp, '.', '');
}

///////////////////////////////////////////////

function wlog2($s){
	echo $s . "\r\n";
	wlog($s);
}

/////////////////////////////////////////////////////////////////////////////////

function unlink2($file){
	if (file_exists($file)){
		wlog("unlink: $file");
		unlink($file);
	}
}

////////////////////////////////////////////////

function file_exists2($path){
	//echo $path . "\r\n";
	$list = glob($path);
	//print_json($list);
	return sizeof($list) > 0;
}
///////////////////////////////////////////////////////////////////////////////////////
// pathinfo ( string $path, [
// 		int $options = PATHINFO_DIRNAME | PATHINFO_BASENAME | PATHINFO_EXTENSION | PATHINFO_FILENAME ] )
/*
print_r(pathinfo("/mnt/files/abc.mp3"));
Array
(
    [dirname] => /mnt/files
    [basename] => abc.mp3
    [extension] => mp3
    [filename] => abc
)
*/
function getFileNameWithoutParent($file_path){
	$index = strrpos($file_path, SLASH);
	if ($index >= 0){
		$file_path = substr($file_path, $index + 1);
	}
	return $file_path;
}

function getFileNameWithoutExt($file_path){
	return pathinfo($file_path, PATHINFO_FILENAME);
}
function getFileExt($file_path){
	return pathinfo($file_path, PATHINFO_EXTENSION);
}
/////////////////////////////////////////////////////////////////////////////////////
// dont need /dev/, keep only the prod as db has records
/////////////////////////////////////////////////////////////////////////////////////

function getMediaFolder(){
	$folder = getcwd();
	$folder = str_replace(SLASH.'dev', '', $folder);
	$folder .= SLASH.'media'.SLASH;
	wlog('getMediaFolder: ' . $folder);
	return $folder;
}

/////////////////////////////////////////////////////////////////////////////////////

function makeArrayNumbers($arr){
	// make them numbers
	for ($i = 0; $i < sizeof($arr); $i++){
		$arr[$i] = intval($arr[$i]);
	}
	return $arr;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
	So, mathematically, regarding the decimal x,
	0.00  <= x < 0.25  => x = 0.00
	0.25  <= x < 0.75  => x = 0.50
	0.75  <= x < 1.00  => x = 1.00
*/
function getTruncatedScore($score){
	$score_float = floatval($score);
	$score = $score_int = intval($score);
	$x = $score_float - $score_int;
	if ($x >= 0.25 && $x < 0.75){
		$score += .5;
	} else if ($x >= 0.75){
		$score += 1;
	}
	return getDecPlace($score, 1);
}

//////////////////////////////////////////

function obj_count($obj){
	return count($obj);
}

///////////////////////////////////////////////////////////////////////////////////////
// https://stackoverflow.com/questions/24658365/img-tag-displays-wrong-orientation
///////////////////////////////////////////////////////////////////////////////////////

// Note: $image is an Imagick object, not a filename! See example use below.
function autoRotateImage($im){
  $orientation = $im->getImageOrientation();
  switch ($orientation) {
		case imagick::ORIENTATION_BOTTOMRIGHT:
			$im->rotateimage("#000", 180); // rotate 180 degrees
			break;

		case imagick::ORIENTATION_RIGHTTOP:
			$im->rotateimage("#000", 90); // rotate 90 degrees CW
			break;

		case imagick::ORIENTATION_LEFTBOTTOM:
			$im->rotateimage("#000", -90); // rotate 90 degrees CCW
			break;
  }

  // Now that it's auto-rotated, make sure the EXIF data is correct in case the EXIF gets saved with the image!
  $im->setImageOrientation(imagick::ORIENTATION_TOPLEFT);
}

?>
