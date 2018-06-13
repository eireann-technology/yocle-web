<?php

///////////////////////////////////////////////////////////////////

if ($_SERVER['REQUEST_URI'].strpos('/dev/', 0) === false){
	$g_media_url = "./media/";
} else {
	$g_media_url = "../media/";
}

///////////////////////////////////////////////////////////////////

function read_whatsup(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $g_media_url;
	$whatsup_id = intval(getQs('whatsup_id'));
	$width = intval(getQs('width'));
	if ($width == '' || $width > 300) $width = 300;

	if ($whatsup_id){

		$criteria = [ 'whatsup_id' => $whatsup_id ];
		$options = [];

	} else {

		$page = getQs('page');
		if ($page == '') $page = 1;
		$limit = getQs('limit');
		if ($limit == '') $limit = 5;
		$skip = ($page - 1) * $limit;

		//echo "user_id=$user_id page=$page skip=$skip limit=$limit";

		////////////////////////////////////////////////////////////
		// find the user_ids from the related activites
		////////////////////////////////////////////////////////////
		//$user_ids = getUserGroup($user_id, USRGRP_ACTPEERS_MYSELF);
		//$user_ids = getUserGroup($user_id, USRGRP_MYPEERS);

		//print_json($user_ids); exit();

		// db.getCollection('whatsup').find({ '$or': [ { 'user_id': 2 }, { 'user_id': 3 } ] });
		//$or_arr = [];

		//foreach ($user_ids as $index => $user_id2){
		//	array_push($or_arr, ['user_id' => $user_id2 ]);
		//}
		//if (!sizeof($or_arr)){
		//	$error = 'no users to read';
		//	return 1;
		//}
		// $criteria = [ '$or' => $or_arr ];

		// find whatsup_ids
		$whatsup_ids = [];
		$criteria = ['user_id' => $user_id];
		$options = ['projection' => ['_id' => 0, 'whatsup_ids' => 1]];
		$documents2 = databaseRead($database, 'users', $criteria, $options);
		if ($documents2 && sizeof($documents2)){
			$user = $documents2[0];
			if (isset($user->whatsup_ids)){
				$whatsup_ids = $user->whatsup_ids;
			}
		}

		// db.getCollection('whatsup').find({}).sort( { time: 1 } ).skip( 1 ).limit( 2 )
		$criteria = ['whatsup_id' => ['$in' => $whatsup_ids]];
		$options = [
			"sort" => ["time" => -1],
			"skip" => intval($skip),
			"limit" => intval($limit),
		];
	}

	/////////////////////////////////////////////////////////////////////////////////
	// print out decorated html for this page
	/////////////////////////////////////////////////////////////////////////////////
	//print_json($criteria); print_json($options); exit();	// testing

	$stamp = getDateTimeStamp();
	$documents1 = databaseRead($database, 'whatsup', $criteria, $options);
	for ($i = 0; $i < sizeof($documents1); $i++){
		$whatsup = $documents1[$i];
		$whatsup_id2 = $whatsup->whatsup_id;
		$whatsup_desc = $whatsup->desc;

		//echo "$whatsup_id<br/>"; continue;
		$user_id3 = $whatsup->user_id;

		// resolve user name and img_id
		$img_id = 0;
		$username = '';
		$documents2 = databaseRead($database, 'users', ['user_id' => $user_id3], ['projection'=>['_id'=>0, 'username'=>1, 'img_id'=>1]]);
		if ($documents2 && sizeof($documents2)){
			$user = $documents2[0];
			//print_json($doc2);
			$img_id = $user->img_id;
			$username = $user->username;
		}

		$s = '<table class="tbl_whatsup_item" whatsup_id="' . $whatsup_id2 . '">';

		// add user photo and name
		$s .=
				'<tr>'
				. '<td>'
					. '<span><img class="whatsup_photo" src="./svrop.php?type=dl_img&img_id=' . $img_id . '&d=' . $stamp . '" img_id="' . $img_id . '" style="visibility: visible;"><span>'
					. '<span class="whatsup_username" onclick="openUserPage(' . $user_id3 . ')">' . $username . '</span>'
				. '</td>'
			. '</tr>'
		;

		// add desc
		if ($whatsup_desc){
			$s .=
					'<tr>'
					. '<td style="padding-left:45px">'
						. $whatsup_desc
					. '</td>'
				. '</tr>'
			;
		}

		// show the media
		if (is_array($whatsup->media_ids)){
			for ($j = 0; $j < sizeof($whatsup->media_ids); $j++){
				$media_id = intval($whatsup->media_ids[$j]);
				//echo "$media_id<br>";

				$documents3 = databaseRead($database, 'media',
												['media_id' => $media_id],
												['projection'=>['_id'=>0, 'media_desc'=>1, 'file_name'=>1, 'file_cat' => 1]]);

				if ($documents3 && sizeof($documents3)){
					$media = $documents3[0];
					//print_json($media);	// testing
					$file_name = isset($media->file_name)?$media->file_name:'';
					$file_cat = isset($media->file_cat)?$media->file_cat:'';
					$media_desc = isset($media->media_desc)?$media->media_desc:'';
					$s .=
						'<tr>'
							. '<td class="whatsup_td">'
					;
					//echo $file_cat;

					switch ($file_cat){
						case 'image':			$s .= '<img class="whatsup_image" src="' . $g_media_url . $file_name . '" style="width:'.$width.'"/>';		break;
						case 'video':			$s .= '<video class="whatsup_video" src="' . $g_media_url . $file_name . '" style="width:'.$width.'" controls></video>';	break;
					}
					$s .= '</td>'
						. '</tr>'
					;
					if ($media_desc){
						$s .= '<tr>'
								. '<td class="whatsup_td">'
									. $media_desc
								. '</td>'
							.'</tr>'
						;
					}
				}
			}
		}

		// add location
		$location = isset($whatsup->location)?$whatsup->location:'';
		if ($location){
			$s .= '<tr>'
					. '<td class="whatsup_td" style="padding:10px; padding-left:42px">'
						. '<img src="./images/profile_location.png"/> '
						. $location
					. '</td>'
				.'</tr>'
			;
		}

		// add time
		$time = getDateWithoutSecond($whatsup->time);
		$s .= '<tr>'
					. '<td class="whatsup_td whatsup_time" style="padding:10px; padding-left:42px">'
						. $time;

		// add delete
		if ($whatsup_id == '' && $user_id3 == $user_id){
			$s .= ' <span class="whatsup_delete" onclick="deleteWhatsup(' . $whatsup_id2 . ', $(this))">Delete</span>';
		}

		// add likes
		$likes = [];
		$my_like = 0;
		if (isset($whatsup->likes)){
			// is myself inside likes?
			forEach ($whatsup->likes as $user_id2){
				if ($user_id2 == $user_id){
					$my_like = 1;
				}
				$username = getUserNameFromDb($user_id2);
				if ($username != ''){
					array_push($likes, $username);
				}
			}
		}
		$nlike = count($likes);
		$heart_color = $my_like ? 'red' : 'grey';
		$s .= ' &nbsp;<span class="whatsup_tooltip" data-placement="bottom" title="' . join('<br>', $likes)
			. '"><img class="whatsup_img_likes" src="images/heart_' . $heart_color . '.png" my_like="'.$my_like.'"/> <span class="nlike">' . $nlike . '</span></span>';

		// add comments
		$comments = [];
		$my_comment = 0;
		if (isset($whatsup->comments)){
			forEach ($whatsup->comments as $comment){
				$user_id2 = $comment->user_id;
				$datetime2 = getDateWithoutSecond($comment->time);
				$t = '<div class="whatsup_comment"><b>' . getUserNameFromDb($user_id2)
							. '</b> <span class="whatsup_datetime">(' . $datetime2 . ')</span>: '
							. $comment->comment
				;
				// is myself inside likes?
				if ($user_id2 == $user_id){
					$my_comment = 1;
					$t .= '<span class="whatsup_del_comment" onclick="delWhatsupComment(' . $whatsup_id2 . ',' . $comment->comment_id . ', this)">Delete</span>';
				}
				$t .= '</div>';
				array_push($comments, $t);
			}
		}
		$ncomment =  count($comments);

		// is myself inside comments
		$comment_color = $my_comment ? 'green' : 'grey';
		$s .= ' &nbsp;<span><img class="whatsup_img_comments" src="images/comment_' . $comment_color . '.png"/> <span class="ncomment">' . $ncomment . '</span></span>';
		if (!$ncomment){
			$s .= '<div class="whatsup_comments" style="display:none"></div>';
		} else {
			$s .= '<div class="whatsup_comments">' . join('', $comments) . '</div>';
		}
		$s .= '<textarea class="whatsup_mycomments" placeholder="Your comments here..."></textarea>';
		$s .=	'</td>'
			. '</tr>'
		;

		$s .= '<tr><td><hr style="width:95%"/></td></tr>';
		$s .= '</table>';

		// for next page
		//echo "*$whatsup_id*";
		//if ($whatsup_id == ''){
		//	$s .= '<a class="jscroll-next" href="./svrop.php?type=read_whatsup&user_id='.$user_id.'&page='.($page+1).'&limit='.$limit.'&width='.$width.'"></a>';
		//}
		$total = sizeof($whatsup_ids);
		$half = $total / 2;
		$last_index = $half == intval($half) ? 1 : 0;

		//if ($whatsup_id == '' && $whatsup_id2 != $whatsup_ids[$last_index]){
		if ($whatsup_id == ''){
			$s .= '<a class="jscroll-next" curr="'.($whatsup_id2).'" last="'.($whatsup_ids[$last_index]).'" total="'.$total.'" href="./svrop.php?type=read_whatsup&user_id='.$user_id.'&page='.($page+1).'&limit='.$limit.'&width='.$width.'"></a>';
		}

		// show the contents
		echo $s;
	}
	return 1;
}

///////////////////////////////////////////////////////////////////

function write_whatsup(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user;

	// add media desc
	$media_desc_hash = getQs('media_desc_hash');
	if ($media_desc_hash != ''){
		saveMediaDesc($media_desc_hash);
	}

	// add to whatsup
	$whatsup_id = intval(databaseFindAndInc($database, 'sequences', 'whatsup_id'));
	//$whatsup_id = 1;
	$user_id = intval(getQs('user_id'));
	$user_name = getQs('user_name');
	$desc = getQs('desc');
	$location = getQs('location');
	$media_ids = getQs('media_ids');
	$user_group = intval(getQs('user_group'));

	$datetime = getDateTime();

	// numerize $media_ids
	forEach ($media_ids as $index => $media_id){
		$media_ids[$index] = intval($media_id);
	}

	//print_json($media_ids);
	$whatsup = [
		'whatsup_id' => $whatsup_id,
		'user_id' => $user_id,
		'time' => $datetime,
		'desc' => $desc,
		'location' => $location,
		'media_ids' => $media_ids,
		'user_group' => $user_group,
	];
	$result = databaseInsertOrUpdate($database, 'whatsup', ['whatsup_id' => $whatsup_id], $whatsup);

	///////////////////////////////////////////////////////////////////////////////////
	// notification to user_ids
	///////////////////////////////////////////////////////////////////////////////////

	// prepare message
	$msg = $user_name . " updated What's up.";

	// find from user group
	$reader_ids = getUserGroup($user_id, $user_group);

	// for each reader
	for ($i = 0; $i < sizeof($reader_ids); $i++){

		// find the reader
		$reader_id = intval($reader_ids[$i]);

		// 1. add to each user's whatsups array
		$criteria = [ 'user_id' => $reader_id ];
		$update = [ '$push' => [	"whatsup_ids" =>	$whatsup_id] ];
		$result = databaseUpdate($database, 'users', $criteria, $update);

		// 2. send notification
		if ($reader_id != $user_id){
			// find token for the mobiles
			$criteria = [ 'user_id' => $reader_id ];
			$options = [ 'projection' => ['_id' => 0, 'token_android' => 1, 'token_ios' => 1]];
			$documents0 = databaseRead($database, 'users', $criteria, $options);
			if ($documents0 && sizeof($documents0)){
				$user = $documents0[0];
				//echo "$user->token_android, $user->token_ios";
				$token_android = isset($user->token_android) ? $user->token_android : '';
				$token_ios = isset($user->token_ios) ? $user->token_ios : '';
				sendNotify_whatsup($whatsup_id, $msg, $token_android, $token_ios);
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////

function getActUsers($user_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act;
	$user_ids = [];
	$user_ids_hash = [];

	//if ($include_myself){
		//$user_ids_hash[$user_id] = 1;
	//	addUserIdsHash($user_id, $user_ids_hash, 0);
	//}

	$criteria = [ 'user_id' => intval($user_id) ];
	$options = [ 'projection' => ['_id' => 0, 'profile.activity' => 1, 'confirmed_email' => 1] ];
	//print_json($criteria); print_json($options);
	$documents0 = databaseRead($database, 'users', $criteria, $options);
	if ($documents0 && sizeof($documents0)){
		$user = $documents0[0];
		if ($user->confirmed_email == 1){
			$arr = $user->profile->activity;
			for ($j = 0; $j < sizeof($arr); $j++){
				$act = $arr[$j];
				$act_id = $act->act_id;
				getUserIdsFromAct($act_id, $user_ids_hash, $user_id);	// do not include myself
			}
		}
	}

	// make it an array of numbers
	$user_ids = hash2numArr_key($user_ids_hash);

	// make them numbers
	for ($i = 0; $i < sizeof($user_ids); $i++){
		$user_ids[$i] = intval($user_ids[$i]);
	}

	//print_json($user_ids_hash);	print_json($user_ids); return;
	return $user_ids;
}

//////////////////////////////////////////////////////////////////////////////////////////////
// when $my_user_id is present, skip this

function getUserIdsFromAct($act_id, &$user_ids_hash, $my_user_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_act;

	$criteria = [ 'act_id' => intval($act_id) ];
	$options = [ 'projection' =>
		[
			'_id' => 0,
			'coordinator_id' => 1,
			'participants' => 1,
			'impression.panelists.others' => 1,
			'assessment.assessments' => 1
		]
	];
	//print_json($criteria); print_json($options);

	$documents = databaseRead($database, $col_act, $criteria, $options);
	if (sizeof($documents) > 0){
		$act = $documents[0];

		// add coordinator
		addUserIdsHash($act->coordinator_id, $user_ids_hash, $my_user_id);
		// add participants
		foreach ($act->participants as $i => $user_id){
			//print_json($user_id);
			addUserIdsHash($user_id, $user_ids_hash, $my_user_id);
		}

		// add impression panelists
		$arr = $act->impression->panelists->others;
		//print_json($arr);
		for ($j = 0; $j < sizeof($arr); $j++){
			$user_id = $arr[$j];
			if ($user_id){
				addUserIdsHash($user_id, $user_ids_hash, $my_user_id);
			}
		}

		// add other assessors
		foreach ($act->assessment->assessments as $k => $assessment){
			if (is_array($assessment->panelists->others)){
				foreach ($assessment->panelists->others as $k => $user_id){
					addUserIdsHash($user_id, $user_ids_hash, $my_user_id);
				}
			}
		}
		//print_json($user_ids_hash);
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////

function addUserIdsHash($user_id, &$user_ids_hash, $my_user_id){

//	$user_ids_hash[$user_id] = 1;	// normal practice
	$user_id = intval($user_id);
	if ($user_id == $my_user_id){

		// skip adding myself here

	} else {
		$documents = databaseRead('yolofolio',
			'users',
				['user_id' => $user_id],
				[ 'projection' =>
					['_id' => 0, 'user_id' => 1, 'confirmed_email' => 1]
				]
		);
		if ($documents && sizeof($documents)){
			$user = $documents[0];
			$user_id = $user->user_id;
			//print_json($user_id);
			if ($user->confirmed_email == 1){
				$user_ids_hash[$user_id] = 1;
			}
		}
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////
function del_whatsup(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user;

	// whatsup_id
	$whatsup_id = intval(getQs('whatsup_id'));
	//echo $whatsup_id;

	// read from whatsup
	$criteria = ['whatsup_id' => $whatsup_id];
	$options = ['projection' => ['_id' => 0, 'media_ids' => 1]];
	$documents1 = databaseRead($database, 'whatsup', $criteria, $options);
	//print_json($documents1);

	if (sizeof($documents1)){
		$whatsup = $documents1[0];
		//print_json($whatsup);

		$media_ids = $whatsup->media_ids;
		forEach ($media_ids as $index => $media_id){
			$media_ids[$index] = intval($media_id);
		}
		//print_json($media_ids);

		if (sizeof($media_ids)){

			// remove file
			$folder = getMediaFolder();
			forEach ($media_ids as $index => $media_id){
				//echo $media_id;
				$criteria = ['media_id' => intval($media_id)];
				$options = ['_id' => 0, 'file_name'];
				$documents2 = databaseRead($database, 'media', $criteria, $options);
				if (sizeof($documents2)){
					$media = $documents2[0];
					$file_name = $media->file_name;
					$media_file = $folder . $file_name;
					//print_json($media_file);
					unlink($media_file);
				}
			}

			// remove from collection
			$criteria = ['media_id' => ['$in' => $media_ids]];
			//print_json($criteria);
			$result = databaseDelete($database, 'media', $criteria);
		}
	}

	// delete from users
	$filters = [];
	$update = ['$pull' => [	'whatsup_ids' => $whatsup_id ] ];
	$documents = databaseUpdate($database, 'users', $filters, $update);

	// delete from whatsup
	$result = databaseDelete($database, 'whatsup', ['whatsup_id' => $whatsup_id]);
}

////////////////////////////////////////////////////////////////////////////////////////////////////

function getUserNameFromDb($user_id){
	global $database;
	// resolve user name and img_id
	//$img_id = 0;
	$username = '';
	$documents2 = databaseRead($database, 'users', ['user_id' => $user_id], ['projection'=>['_id'=>0, 'username'=>1, 'img_id'=>1]]);
	if ($documents2 && sizeof($documents2)){
		$user = $documents2[0];
		//print_json($doc2);
		//$img_id = $user->img_id;
		$username = $user->username;
	}
	return $username;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function toggleWhatsupLike(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$whatsup_id = intval(getQs('whatsup_id'));
	$user_id = intval(getQs('user_id'));
	$my_like = intval(getQs('my_like'));

	$filters = ['whatsup_id' => $whatsup_id];
	if ($my_like == 1){
		$update = ['$push' =>
								[	'likes' =>
									[
										'$each' => [ $user_id ],
										'$sort' => 1,
									]
								]
							];
	} else {
		$update = ['$pull' =>
								[	'likes' => $user_id ]
							];
	}
	//print_json($filters); print_json($update);
	$result = databaseUpdate($database, 'whatsup', $filters, $update);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function addWhatsupComment(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$whatsup_id = intval(getQs('whatsup_id'));
	$user_id = intval(getQs('user_id'));
	$comment = getQs('comment');
	$datetime = getDateTime();
	$comment_id = intval(databaseFindAndInc($database, 'sequences', 'whatsup_comment_id'));

	$filters = ['whatsup_id' => $whatsup_id];
	$update = ['$push' =>
		[	'comments' => [
				'comment_id' => $comment_id,
				'user_id' => $user_id,
				'comment' => $comment,
				'time' => $datetime
			]
		]
	];
	//print_json($filters); print_json($update);
	$result = databaseUpdate($database, 'whatsup', $filters, $update);

	$output['comment_id'] = $comment_id;
}

/////////////////////////////////////////////////////////////////////////////////

function delWhatsupComment(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$whatsup_id = intval(getQs('whatsup_id'));
	$user_id = intval(getQs('user_id'));
	$comment_id = intval(getQs('comment_id'));

	$filters = ['whatsup_id' => $whatsup_id];
	$update = ['$pull' =>
		[	'comments' => [	'comment_id' => $comment_id] ]
	];
	//print_json($filters); print_json($update);
	$result = databaseUpdate($database, 'whatsup', $filters, $update);

}

///////////////////////////////////////////////////////////////////

function write_whatsup2(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user;

	// add media desc
	$media_desc_hash = getQs('media_desc_hash');
	if ($media_desc_hash != ''){
		saveMediaDesc($media_desc_hash);
	}

	// add to whatsup
	$whatsup_id = intval(databaseFindAndInc($database, 'sequences', 'whatsup_id'));
	//$whatsup_id = 1;
	$user_id = intval(getQs('user_id'));
	$user_name = getQs('user_name');
	$desc = getQs('desc');
	$location = getQs('location');
	$media_ids = getQs('media_ids');
	$receivers = getQs('receivers');

	$datetime = getDateTime();

	// numerize $media_ids
	forEach ($media_ids as $index => $media_id){
		$media_ids[$index] = intval($media_id);
	}

	//print_json($media_ids);
	$whatsup = [
		'whatsup_id' => $whatsup_id,
		'user_id' => $user_id,
		'time' => $datetime,
		'desc' => $desc,
		'location' => $location,
		'media_ids' => $media_ids,
		//'user_group' => $user_group,
		'receivers' => json_encode($receivers),	// for reference only
	];
	$result = databaseInsertOrUpdate($database, 'whatsup', ['whatsup_id' => $whatsup_id], $whatsup);

	///////////////////////////////////////////////////////////////////////////////////
	// notification to user_ids
	///////////////////////////////////////////////////////////////////////////////////

	// prepare message
	$msg = $user_name . " updated What's up.";

	// find from user group
	//$reader_ids = getUserGroup($user_id, $user_group);
	$reader_ids = getReceivers($user_id, $receivers);

	// for each reader
	for ($i = 0; $i < sizeof($reader_ids); $i++){

		// find the reader
		$reader_id = intval($reader_ids[$i]);

		// 1. add to each user's whatsup array
		$criteria = [ 'user_id' => $reader_id ];
		$update = [ '$push' => [	"whatsup_ids" =>	$whatsup_id] ];
		$result = databaseUpdate($database, 'users', $criteria, $update);

		// 2. send notification
		if ($reader_id != $user_id){
			// find token for the mobiles
			$criteria = [ 'user_id' => $reader_id ];
			$options = [ 'projection' => ['_id' => 0, 'token_android' => 1, 'token_ios' => 1]];
			$documents0 = databaseRead($database, 'users', $criteria, $options);
			if (sizeof($documents0)){
				$user = $documents0[0];
				$token_android = isset($user->token_android) ? $user->token_android : '';
				$token_ios = isset($user->token_ios) ? $user->token_ios : '';
				sendNotify_whatsup($whatsup_id, $msg, $token_android, $token_ios);
			}
		}
	}
}


?>
