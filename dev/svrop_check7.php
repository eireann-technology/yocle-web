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
include "svrop_activity.php";
//include "svrop_activity2.php";

$database2 = 'yolofolio_2017';
$act_id = 132;
$act_user_ids = [];

// read act from old databse
$filters = ['act_id' => $act_id];
$options = ['projection' => ['_id' => 0]];
$acts = databaseRead($database2, $col_act, $filters, $options);
if ($acts && sizeof($acts)){
  $act = $acts[0];
  // 		$result = databaseUpdate($database, 'users', ['user_id' => $user_id], ['$set' => ['profile.activity' => $activities]]);
  //$acts = databaseUpdateOr($database, $col_act, $filters, $options);
  databaseInsertOrUpdate($database, $col_act, ['act_id' => $act_id], $act);

  // find act_user_ids;
  //$act_users_hash = [];
  //$act_user_ids = hash2numArr_keyint($act_users_hash);
  $act_user_ids = getAllUsers2($act);
  //print_json($act_user_ids);
  //exit();
}

// for each act users
foreach ($act_user_ids as $user_id){

  echo "$user_id<br/>";
  $filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
  $options = ['projection' => ['_id' => 0, 'profile.activity.$' => 1]];

  // read from the old
  $users = databaseRead($database2, $col_usr, $filters, $options);
  if ($users && sizeof($users)){
    $user = $users[0];
    $uact = $user->profile->activity[0];
    //print_json($uact); exit();

    // remove from old
    // insert to new
    databaseUpdateArrayElement($database, $col_usr, ['user_id' => $user_id], 'profile.activity', ['act_id' => $act_id], $uact);

    // users
    //$users = databaseRead($database, $col_usr, $filters, $options);
    //$user = $users[0];
    //$uact = $user->profile->activity[0];
    //print_json($uact); exit();
  }
}
?>
