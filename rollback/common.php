<?php
$debug_svrop = 0;
/*
function getSelectMethod($selected){
	global $method_arr;
	$s = '<div class="ui-widget assessment_method">' . '<select class="assessment_combobox">';
	for ($i = 0; $i < sizeof($method_arr); $i++){
		$name = $method_arr[$i];
		$option_selected = $selected == $name ? ' selected' : ''; 
		$s .= '<option'.$option_selected.'>'.$name.'</option>';
	}
	$s .= '</select></div>';
	return $s;
}

/////////////////////////////////////////////////////////////////////

function getSelectSkill($selected){
	global $skill_arr;
	$s = '<div class="ui-widget div_skills">' . '<select class="skill_combobox">';
	for ($i = 0; $i < sizeof($skill_arr); $i++){
		$name = $skill_arr[$i];
		$option_selected = $selected == $name ? ' selected' : ''; 
		$s .= '<option'.$option_selected.'>'.$name.'</option>';
	}
	$s .= '</select></div>';
	return $s;
}
*/
///////////////////////////////////////////////////////////////////////////////
// make sure the parent folder is grant full control for everyone (Windows)
///////////////////////////////////////////////////////////////////////////////
function wlog($str) {
	global $logfile, $debug_svrop;;
	//if ($debug_svrop == 1){
	
	//	echo $str.'<br/>';
		
	//} else 
	{
	
		// log to the output
		$log_str = getDateTime() . " {$str}\r\n";
		if (($fp = fopen($logfile, 'a+')) !== false) {
			fputs($fp, $log_str);
			fclose($fp);
		} else {
			echo 'error in wlog';
		}
	}
}

/////////////////////////////////////////////////////////////////////

function mychmod($path){
	global $error;
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
	$arr = explode('/', $path);	// for /dev
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
		
	if (sizeof($arr) <= 2){
		return $host;
	} else {
		return $host.'/'.$arr[1];
	}
}

$database = "yolofolio";

define('SLASH', DIRECTORY_SEPARATOR);

date_default_timezone_set('Asia/Hong_Kong');
$user = get_current_user();
$logfile = getcwd() . SLASH . 'svrop.log';
//echo $logfile;
//chown($logfile, $user);
//mychmod($logfile);
//$rv = fileowner($logfile);
//echo $rv;
//$def_ext = 'png';

$def_ext = 'jpg';
$jpg_quality = 94;



///////////////////////////////////////////////////////////////////////////////
/*
$skill_arr = Array(
	'',
	'Collaboration',
	'Communication',
	'Creativity',
	'Critical Thinking',
	'Information Technology',
	'Leadingship',
	'Numeracy',
	'Organization',
	'Problem Solving',
	'Self-management',
	'Study',
	'Teamwork',
);
*/
///////////////////////////////////////////////////////////////////////

function jsonclone($obj){
	//return json_decode( json_encode($obj), true);
	return json_decode( json_encode($obj));
}

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

function hash2numArr($hasharr){
	if (!isset($hasharr)){
		return [];
	//} else if (is_array($hasharr)){
	//	return $hasharr;
	} else if (!count($hasharr)){
		return [];
	} else {
		$numarr = [];
		foreach ($hasharr as $id => $value){
			array_push($numarr, $id);
		}
		sort($numarr);
		return $numarr;
	}
}

///////////////////////////////////////////////////////////////////////////////////////

function hash2numArr2($hasharr){
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
?>

