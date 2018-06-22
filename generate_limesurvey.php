<?php

// curl --insecure  -O -u username:password -v
/*
$url = "https://www2.cetl.hku.hk/questionaire/index.php/admin/authentication/sa/login"
$url = "https://www2.cetl.hku.hk/questionaire/index.php/admin/export/sa/survey/action/exportstructuretsv/surveyid/916913";

// send the src to the remote server(windows)
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);	// HTTP://UNITSTEP.NET/BLOG/2009/05/05/USING-CURL-IN-PHP-TO-ACCESS-HTTPS-SSLTLS-PROTECTED-SITES/
curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);	// https://stackoverflow.com/questions/20842970/fix-curl-51-ssl-error-no-alternative-certificate-subject-name-matches
curl_setopt($ch, CURLOPT_POST, 1);
//curl_setopt($ch, CURLOPT_POSTFIELDS, ['my_room_id' => $my_room_id, 'rec_id' => $rec_id, 'is_dev' => $is_dev]);
//curl_setopt($ch, CURLOPT_POSTFIELDS, ['my_room_id' => $my_room_id, 'rec_id' => $rec_id]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$rv = curl_exec($ch);
//wlog($rv);
if (curl_errno($ch)) {
	wlog("Error: " . curl_error($ch));
} else {
	curl_close($ch);
}
*/

include "./common.php";

$file = './limesurvey_survey_916913.txt';
$contents = file_get_contents($file);

echo $contents; exit();

$lines = explode("\n", $contents);
//echo sizeof($lines);
//print_json($lines);
for ($i = 2; $i < sizeof($lines); $i++){
	$line = $lines[$i];
	$tabs = explode("\\t", $line);
	//echo $i . ". " . $line . "<br>";
	for ($j = 0; $j < sizeof($tabs); $j++){
		$tab = $tabs[$j];
		//echo $j . ". " . $tab . "<br>";;
	}
	break;
}
print_json($lines);
?>
