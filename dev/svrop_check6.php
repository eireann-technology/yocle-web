<?php

//exit();

ini_set( 'display_errors', 1 );
error_reporting( E_ALL );
set_time_limit(600); // 10 mins

// https://github.com/mongodb/mongo-php-driver

/////////////////////////////////////////////////////////
// svrop.php
// type:
//	- image (dataurl)
//	- whb: for multiple bigboard
//	- timeline: for recording and playback
/////////////////////////////////////////////////////////

$sPresent = "Present";
$col_usr = 'users';
$col_act = 'activities';

// common
include "common.php";
include "database.php";
include "svrop_calcgs.php";

// sort blog with blog_id
//calcgs_peruser(920, 1);
//calcgs_peruser(920, 1);
calcgs_test(0);

?>
