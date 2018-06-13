<?php
$debug_svrop = 0;

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
	//ini_set('date.timezone', 'Asia/Hong_Kong');
	//date_default_timezone_set('Asia/Hong_Kong');
	return date('Y-m-d H:i:s', time());
}

/////////////////////////////////////////////////////////////////////

function sendEmail($senders, $recipients, $subject, $body){
	// send confirmation email
	$transport = Swift_SmtpTransport::newInstance('smtproam.hku.hk', 25)
		->setUsername('yfolio@hku.hk')
		->setPassword('rnquXky0rn')
	;
	// Create the Mailer using your created Transport
	$mailer = Swift_Mailer::newInstance($transport);
	//$logger = new \Swift_Plugins_Loggers_EchoLogger(); $mailer->registerPlugin(new \Swift_Plugins_LoggerPlugin($logger));	// testing only
	$message = Swift_Message::newInstance($subject)
		->setFrom($senders)
		->setTo($recipients)
		->setBody($body)
	;
	// Send the message
	$result = $mailer->send($message);
	return $result;
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
	if (!in_array($_SERVER['SERVER_PORT'], [80, 443])) {
			$port = ":$_SERVER[SERVER_PORT]";
	} else {
			$port = '';
	}
	if (!empty($_SERVER['HTTPS']) && (strtolower($_SERVER['HTTPS']) == 'on' || $_SERVER['HTTPS'] == '1')) {
			$scheme = 'https';
	} else {
			$scheme = 'http';
	}
	$path = $_SERVER['REQUEST_URI']; // e.g. /dev/phpinfo.php
	$arr = explode('/', $path);
	//echo "$arr[0] $arr[1] $arr[2]";
	if (sizeof($arr) <= 1){
		return $scheme.'://'.$server_name.$port;
	} else {
		return $scheme.'://'.$server_name.$port.'/'.$arr[1];
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

$method_arr = Array(
	'Abstract', ///Dissertation/Essay/Reviews',
	'Application',///Report',
	'Blog',
	'Case Study',
	'Concept Map',
	'Journal',///Daily or Weekly Logbooks',
	'Learning contract',
	'MCQ',
	'Participation',
	'Porfolio',
	'Poster',
	'Presentation',
	'Reflective Piece',
	'Survey',
	'Wikis'
);
///////////////////////////////////////////////////////////////////////////////

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

///////////////////////////////////////////////////////////////////////

function jsonclone($obj){
	return json_decode( json_encode($obj), true);
}

function getQS($name){
	//global $error;
	if (isset($_REQUEST[$name])){
		return $_REQUEST[$name];
	} else {
		//echo "missed $name<br/>";
		return '';
	}
	//return isset($_REQUEST[$name]) ? $_REQUEST[$name] : '';
}
?>