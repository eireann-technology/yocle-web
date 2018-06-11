<?php
include "common.php";
/*
// TEST 1: THE DIFFERENCE OF [] & stdClass
$arrays = [
	'number'=> [],
	'hash'=> new stdClass(),
];
print_json($arrays);


// TEST 2: THE DIFFERENCE IN JSON DECODE 2ND PARAM
$string = '{"act_id":47,"img_id":0,"act_type":"OCL-X","start":"2016-12-09 09:00","end":"2016-12-10 18:00","title":"test act","desc":"","published":0,"coordinator_id":1,"participants":[],"impression":{"enabled":1,"skills":{},"panelists":{"coordinator":1,"self":0,"peers":0,"others":0}},"assessment":{"enabled":1,"assessments":[{"ass_id":1,"method":"ref","title":"test ref","weight":100,"start":"2016-12-09 09:00","end":"2016-12-10 18:00","skills":{},"panelists":{"coordinator":1,"self":0,"peers":0,"others":0},"items":[{"question":"q1","min":"","max":"","weight":100}],"assr_asst_completed":{},"part_asst_marks":{},"assr_asst_marks":{}}]},"media":[]}';

//$string = '{"assr_asst_marks":{}}';
$activity1 = json_decode($string, true);
$activity2 = json_decode($string, false);
echo $string;
print_json($activity1);
print_json($activity2);
*/

/*
$string = '{"assr_asst_marks":{"1":"yes"}}';
$activity1 = json_decode($string, true);
$activity2 = json_decode($string, false);
echo $string;
print_json($activity1);
print_json($activity2);
*/

// TEST 3: ACCESS STDCLASS PATH
// http://stackoverflow.com/questions/804850/get-php-class-property-by-string
$string = '{"assr_asst_marks":{"tests":[1,2,3]}}';
$activity2 = json_decode($string, false);
print_json($activity2);
$name = 'tests';
echo $activity2->assr_asst_marks->{$name}[2];

?>