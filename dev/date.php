<?php
include "common.php";
// http://php.net/manual/en/function.date.php
//date_default_timezone_set('Asia/Hong_Kong');
//echo date('l jS \of F Y h:i:s A');
//echo date('Y-m');
//echo date('l jS \of F Y h:i:s A', mktime(0, 0, 0, 7, 1, 2000)) . '<br/>';
//echo date('l jS \of F Y h:i:s A') . '<br/>';
//echo $interval->format('%R%a days') . '<br/>';
//$interval = new DateInterval('P2Y4DT6H8M');
// http://php.net/manual/en/dateinterval.format.php
//echo $interval->format('%y year') . '<br/>';
// http://php.net/manual/en/datetime.diff.php

// testing
$arr = [
	'2016-07-01', '2015-07-01', '2014-07-01', '2013-07-01', '2012-07-01', '2011-07-01', '2010-07-01',
	'2016-08-01', '2015-08-01', '2014-08-01', '2013-08-01', '2012-08-01', '2011-08-01', '2010-08-01',
	'2016-09-01', '2015-09-01', '2014-09-01', '2013-09-01', '2012-09-01', '2011-09-01', '2010-09-01',
	'2016-10-01', '2015-10-01', '2014-10-01', '2013-10-01', '2012-10-01', '2011-10-01', '2010-10-01',

];
foreach ($arr as $key => $s_date){
	echo $s_date . ': schoolyear=' . getSchoolYear($s_date) . ', period=' . getPeriod($s_date) . '<br/>';
}

?>