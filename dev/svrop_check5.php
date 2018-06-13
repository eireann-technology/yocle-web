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

// sort blog with blog_id

function sort_blog($user_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $g_media_url, $col_usr;

  $blog_arr = [];
  //$blog_arr2 = [];

	$criteria = ['user_id' => $user_id];
	$options = ['projection' => ['_id' => 0, 'friends' => 1, 'networks' => 1]];
	$users2 = databaseRead($database, $col_usr, $criteria, $options);
	if ($users2 && sizeof($users2)){
		$user2 = $users2[0];

		// find all the users
		$hash = [];
		num2hashArr2($user2->networks, $hash);
		num2hashArr2($user2->friends, $hash);
		$users3 = hash2NumArr_key($hash);

		//print_json($users2);
		foreach ($users3 as $user_id3){
			//$user_id = $user2->user_id;
			$criteria = ['user_id' => $user_id3];
			$options = ['projection' => ['_id' => 0, 'user_id' => 1, 'img_id' => 1, 'username' => 1, 'profile.activity' => 1]];
			$users4 = databaseRead($database, $col_usr, $criteria, $options);
			if ($users4 && sizeof($users3)){
				$user4 = $users4[0];
        $user_id4 = $user4->user_id;
				//print_json($user3); exit();
				//$user3 = json_decode(json_encode($users3[0]), true);
				//echo "<b>user_id=$user3->user_id</b><br/>";
				// search all activities
				foreach ($user4->profile->activity as $act){
					//print_json($act->act_id);
          //echo "act_id=$act->act_id<br/>";
					// search all assessment for the method blg
					foreach ($act->assessments as $asst){
						//print_json($asst->ass_id);
						if ($asst->method == 'blg'){
              //echo "asst_id=$asst->ass_id<br/>";
							//print_json($asst);
							foreach ($asst->items as $item){
								if (isset($item->performed)){//} && isset($item->answer)){
                  $blog = [
                    "user_id" => $user_id4,
                    "act_id" => $act->act_id,
                    "ass_id" => $asst->ass_id,
                    "item_id" => $item->ass_item_id,
                    "performed" => $item->performed,
                    //"item" => jsonclone($item),
                  ];
                  array_push($blog_arr, jsonclone($blog));
                  //array_push($blog_arr2, $item->performed);
                  //print_json($blog);
								}
							}
						}
					}
				}
			}
		}
    usort($blog_arr, "cmp_item");
    //usort($blog_arr2, "cmp_item2");

    $blog_id = 1;
    foreach ($blog_arr as $index => $blog){
			
			$blog_arr[$index]->blog_id = $blog_id;

      // UPDATE BLOG_ID
      $filters = ['user_id' => $blog->user_id, 'profile.activity.act_id' => $blog->act_id];
    	$path = 'profile.activity.$.assessments.'.($blog->ass_id-1).'.items.'.($blog->item_id-1).'.blog_id';
      $update = ['$set' => [$path => $blog_id]];
    	$result = databaseUpdate($database, $col_usr, $filters, $update);

			// SAVE THE BLOG_ID TO COLLECTION BLOG
			$result = databaseInsertOrUpdate($database, 'blog', ['blog_id' => $blog_id], $blog);

			// ADD TO ALL PEERS
			addBlogIdToUsersPeers($blog->user_id, $blog_id);

			// blog_id
			$blog_id++;
    }
    print_json($blog_arr);
	}
	return 1;
}


///////////////////////////////////////////////////////////

function cmp_item($a, $b){
  $a = isset($a->performed) ? $a->performed : 0;
  $b = isset($b->performed) ? $b->performed : 0;
  if ($a == $b) {
    return 0;
  } else {
    return ($a < $b) ? -1 : 1;
  }
}

///////////////////////////////////////////////////////////
/*
function cmp_item2($a, $b){
  //$a = isset($a->item->performed) ? $a->item->performed : 0;
  //$b = isset($b->item->performed) ? $b->item->performed : 0;
  if ($a == $b) {
    return 0;
  } else {
    return ($a < $b) ? -1 : 1;
  }
}
*/
///////////////////////////////////////////////////////////

sort_blog(2);
?>
