<?php

function read_blog(){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $user_id, $g_media_url, $col_usr;

	$filter = getQS('filter');
	$page = getQs('page');
	if ($page == '') $page = 1;
	$limit = getQs('limit');
	if ($limit == '') $limit = 5;
	$skip = ($page - 1) * $limit;
	$width = intval(getQs('width'));
	if ($width == '' || $width > 300) $width = 300;

	// find blog_ids
	$blog_ids = [];
	$criteria = ['user_id' => $user_id];
	$options = ['projection' => ['_id' => 0, 'blog_ids' => 1]];
	$users = databaseRead($database, 'users', $criteria, $options);
	if ($users && sizeof($users)){
		$user = $users[0];
		if (isset($user->blog_ids)){
			$blog_ids = $user->blog_ids;
		}
	}
	//print_json($blog_ids);

	// find with criteria
	$criteria = ['blog_id' => ['$in' => $blog_ids]];
	$options = [
		"sort" => ["performed" => -1],
		"skip" => intval($skip),
		"limit" => intval($limit),
		'projection' => ['_id' => 0],
	];
	$stamp = getDateTimeStamp();
	$blogs = databaseRead($database, 'blog', $criteria, $options);

	foreach ($blogs as $blog){

		//print_json($blog);
		$path = 'profile.activity.$.assessments.'.($blog->ass_id-1).'.items.'.($blog->item_id-1);
		$users2 = databaseRead($database, 'users',
			['user_id' => $blog->user_id, 'profile.activity.act_id' => $blog->act_id],
			['projection'=>['_id'=>0, 'img_id'=>1, 'username'=>1, $path=>1]]
		);

		//print_json($users2);
		if ($users2 && sizeof($users2)){
			$user2 = $users2[0];
			$act = $user2->profile->activity[0];
			
			if (!isset($act->assessments[$blog->ass_id-1])||!isset($act->assessments[$blog->ass_id-1]->items[$blog->item_id-1])){
				continue;
			}

			$item = $act->assessments[$blog->ass_id-1]->items[$blog->item_id-1];

			// get item's html
			$s = '';
			if ($filter == '' || stripos($user2->username, $filter) !== false || stripos($act->title, $filter) !== false){
				$s = get_blog_item($blog->user_id, $blog->act_id, $blog->ass_id, $blog->item_id, $act, $user2, $item, $user_id);
			}

			// for the next scroll (except for the last one)
			//if ($blog->blog_id != $blog_ids[0]){
			//	$s .= '<a class="jscroll-next" curr="'.($blog->blog_id).'" last="'.($blog_ids[0]).'" href="./svrop.php?type=read_blog&filter='.$filter.'&user_id='.$user_id.'&page='.($page+1).'&limit='.$limit.'&width='.$width.'"></a>';
			//}
			$s .= '<a class="jscroll-next" href="./svrop.php?type=read_blog&filter='.$filter.'&user_id='.$user_id.'&page='.($page+1).'&limit='.$limit.'&width='.$width.'"></a>';

			echo $s;
		}

	}

/*
	$criteria = ['user_id' => $user_id];
	$options = ['projection' => ['_id' => 0, 'friends' => 1, 'networks' => 1]];
	$users = databaseRead($database, $col_usr, $criteria, $options);
	if ($users && sizeof($users)){
		$user = $users[0];

		// find all the users
		$hash = [];
		num2hashArr2($user->networks, $hash);
		num2hashArr2($user->friends, $hash);
		$users2 = hash2NumArr_key($hash);

		//print_json($users2);
		foreach ($users2 as $user_id2){
			//$user_id = $user2->user_id;
			$criteria = ['user_id' => $user_id2];
			$options = ['projection' => ['_id' => 0, 'user_id' => 1, 'img_id' => 1, 'username' => 1, 'profile.activity' => 1]];
			$users3 = databaseRead($database, $col_usr, $criteria, $options);
			if ($users3 && sizeof($users3)){
				$user3 = $users3[0];
				//print_json($user3); exit();
				//$user3 = json_decode(json_encode($users3[0]), true);
				//print_json($user3);
				// search all activities
				foreach ($user3->profile->activity as $act){
					//print_json($act);
					// search all assessment for the method blg
					foreach ($act->assessments as $asst){
						//print_json($asst);
						if ($asst->method == 'blg'){
							//print_json($asst);
							foreach ($asst->items as $item){
								if (isset($item->performed) && isset($item->answer)){
									print_blog_item($user_id2, $act->act_id, $asst->ass_id, $item->ass_item_id, $act, $user3, $item, $user_id);
								}
							}
						}
					}
				}
			}
		}
	}
*/

	return 1;
}


/////////////////////////////////////////////////

function get_blog_item($user_id, $act_id, $ass_id, $item_id, $act, $user3, $item, $my_user_id){
	//print_json($my_user_id);

	$stamp = getDateTimeStamp();

	$imgusername = 		// add user photo and name
		'<span><img class="blog_photo" src="./svrop.php?type=dl_img&img_id=' . $user3->img_id . '&d=' . $stamp . '" img_id="' .
		  $user3->img_id . '" style="visibility: visible;"><span>' .
		'<span class="blog_username" onclick="openUserPage(' . $user_id . ')">' . $user3->username . '</span>'
	;
	//$imgacttitle = getImgActTitle($act);
	$imgacttitle = $act->title;
	$s =
		'<div class="div_blg_item" user_id="'.$user_id.'" act_id="'.$act_id.'" ass_id="'.$ass_id.'" item_id="'.$item_id.'">'.
			'<table class="tbl_blg_item" user_id="'.$user_id.'" act_id="'.$act_id.'" ass_id="'.$ass_id.'" item_id="'.$item_id.'">'.
				'<tr>'.
				//'<td class="tbl_blg_item_user">'.$imgusername.' ('.$imgacttitle.')</td>'.
				//'<td class="tbl_blg_item_time">'.$item->performed.'</td>'.
				'<td>' .
					'<table width="100%">' .
						'<tr>' .
							'<td rowspan="2" class="tbl_blg_item_user">' .
								$imgusername .
							'</td>' .
							'<td align="right">' .
								$imgacttitle .
							'</td>'.
						'</tr>' .
						'<tr>' .
							'<td class="tbl_blg_item_time" align="right">'.
								 (isset($item->performed) ? getDateWithoutSecond($item->performed) : '') .
							'</td>' .
						'</tr>' .
					'</table>' .

				'</tr>' .
				'<tr>' .
					'<td class="tbl_blg_answer" colspan="2">'.$item->answer.'</td>' .
				'</tr>' .
			'</table>'
	;

	// add delete
	//if ($blog_id == '' && $user_id3 == $user_id){
	//	$s .= ' <span class="blog_delete" onclick="deleteWhatsup(' . $blog_id2 . ', $(this))">Delete</span>';
	//}

	// add likes
	$likes = [];
	$my_like = 0;
	if (isset($item->likes)){
		// is myself inside likes?
		forEach ($item->likes as $user_id2){
			if ($user_id2 == $my_user_id){
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
	$s .= ' &nbsp;<span class="blog_tooltip" data-placement="bottom" title="' . join('<br>', $likes)
		. '"><img class="blog_img_likes" src="images/heart_' . $heart_color . '.png" my_like="'.$my_like.'"/> <span class="nlike">' . $nlike . '</span></span>';

	// add comments
	$comments = [];
	$my_comment = 0;
	if (isset($item->comments)){
		forEach ($item->comments as $comment){
			$user_id2 = $comment->user_id;
			$datetime2 = getDateWithoutSecond($comment->time);
			$t = '<div class="blog_comment"><b>' . getUserNameFromDb($user_id2)
						. '</b> <span class="blog_datetime">(' . $datetime2 . ')</span>: '
						. $comment->comment
			;
			// is myself inside likes?
			if ($user_id2 == $my_user_id){
				$my_comment = 1;
				$t .= '<span class="blog_del_comment" onclick="delBlogComment(' . $comment->comment_id . ', this)">Delete</span>';
			}
			$t .= '</div>';
			array_push($comments, $t);
		}
	}
	$ncomment = count($comments);

	// is myself inside comments
	$comment_color = $my_comment ? 'green' : 'grey';
	$s .= ' &nbsp;<span><img class="blog_img_comments" src="images/comment_' . $comment_color . '.png"/> <span class="ncomment">' . $ncomment . '</span></span>';
	if (!$ncomment){
		$s .= '<div class="blog_comments" style="display:none"></div>';
	} else {
		$s .= '<div class="blog_comments">' . join('', $comments) . '</div>';
	}
	$s .= 		'<textarea class="blog_mycomments" placeholder="Your comments here..."></textarea>'.
					'</td>'.
				'</tr>'.
				'<tr><td><hr style="width:95%"/></td></tr>'.
			'</table>'.
		'</div>'
	;

	//echo $s;
	return $s;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function toggleBlogLike(){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_usr;
	$user_id = intval(getQs('user_id'));
	$act_id = intval(getQs('act_id'));
	$ass_id = intval(getQs('ass_id'));
	$item_id = intval(getQs('item_id'));
	$my_user_id = intval(getQs('my_user_id'));

	$my_like = intval(getQs('my_like'));
	$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$path = 'profile.activity.$.assessments.'.($ass_id-1).'.items.'.($item_id-1).'.likes';
	if ($my_like == 1){
		$update = ['$push' =>
								[	$path =>
									[
										'$each' => [ $my_user_id ],
										'$sort' => 1,
									]
								]
							];
	} else {
		$update = ['$pull' =>
								[	$path => $my_user_id ]
							];
	}
	//print_json($filters); print_json($update);
	$result = databaseUpdate($database, $col_usr, $filters, $update);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function addBlogComment(){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_usr;
	$user_id = intval(getQs('user_id'));
	$act_id = intval(getQs('act_id'));
	$ass_id = intval(getQs('ass_id'));
	$item_id = intval(getQs('item_id'));
	$my_user_id = intval(getQs('my_user_id'));

	$comment = getQs('comment');
	$datetime = getDateTime();
	$comment_id = intval(databaseFindAndInc($database, 'sequences', 'blog_comment_id'));

	$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$path = 'profile.activity.$.assessments.'.($ass_id-1).'.items.'.($item_id-1).'.comments';
	$update = ['$push' =>
		[	$path => [
				'comment_id' => $comment_id,
				'user_id' => $my_user_id,
				'comment' => $comment,
				'time' => $datetime
			]
		]
	];
	//print_json($filters); print_json($update);
	$result = databaseUpdate($database, $col_usr, $filters, $update);
	$output['comment_id'] = $comment_id;
}

/////////////////////////////////////////////////////////////////////////////////

function delBlogComment(){
	global $database, $error, $type, $email, $pwd, $error, $output, $col_usr;
	$user_id = intval(getQs('user_id'));
	$act_id = intval(getQs('act_id'));
	$ass_id = intval(getQs('ass_id'));
	$item_id = intval(getQs('item_id'));
	$my_user_id = intval(getQs('my_user_id'));
	$comment_id = intval(getQs('comment_id'));
	$filters = ['user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$path = 'profile.activity.$.assessments.'.($ass_id-1).'.items.'.($item_id-1).'.comments';
	$update = ['$pull' =>
		[	$path => [	'comment_id' => $comment_id] ]
	];
	//print_json($filters); print_json($update);
	$result = databaseUpdate($database, $col_usr, $filters, $update);
}
/*
///////////////////////////////////////////////////////////////////////////////////////////////////

function getActImgSrc($img_id){
	$image_url = 'svrop.php?type=dl_img&img_id=';
	return $img_id ? $image_url . $img_id . '&d=' . getDateTimeStamp() : './images/new_activity.png';
}

///////////////////////////////////////////////////////////////////////////////////////////////////

function getImgActTitle($act){
	$s = '<!--' . $act->title . '-->'
		. '<table class="tbl_imgactitle imgusername" onclick="viewActivity(' . $act->act_id . ')">'
			. '<tr>'
				. '<td style="width:1px" valign="top">'
					. '<img class="activity_photo" src="' . getActImgSrc($act->img_id) . '"/>'
				. '</td>'
				. '<td>'
					. $act->title
				. '</td>'
			. '</tr>'
		. '</table>';
	return $s;
}
*/

function updateBlg(){

	global $type, $template_uact_ass_item, $database, $user_id, $debug_svrop, $col_usr, $output;

	$name = getQS('name');
	$value = getQS('value');
	$act_id = intval(getQS('act_id'));
	$ass_id = intval(getQS('ass_id'));
	$item_id = intval(getQS('item_id'));
	$blog_id = intval(getQS('blog_id'));
	$ass_index = intval($ass_id) - 1;
	$item_index = intval($item_id) - 1;

	// find new blog_id
	if (!$blog_id){
		$blog_id = intval(databaseFindAndInc($database, 'sequences', 'blog_id'));
	}

	$time_now = getDateTime();
	$new_item = jsonclone($template_uact_ass_item);
	$new_item->ass_item_id = $item_id;
	$new_item->performed = $time_now;
	$new_item->answer = $value;
	$new_item->blog_id = $blog_id;

	// update user's assessment
	$filters_user = [ 'user_id' => $user_id, 'profile.activity.act_id' => $act_id];
	$path = 'profile.activity.$.assessments.' . $ass_index . '.items';
	$old_item = ['ass_item_id' => $item_id];
	//if ($debug_svrop)
	{
		wlog("update_blg: user_id=$user_id type=$type name=$name act_id=$act_id ass_id=$ass_id item_id=$item_id");
		//print_json($filters_user);
		//print_json($path);
		//print_json($old_item);
		//print_json($new_item);
	}
	databaseUpdateArrayElement($database, $col_usr,
		$filters_user, $path,
		$old_item, $new_item);

	if ($name == 'blg_item'){
		// update collection blog
		$blog = [
			"user_id" => $user_id,
			"act_id" => $act_id,
			"ass_id" => $ass_id,
			"item_id" => $item_id,
			"performed" => $time_now,
		];
		$result = databaseInsertOrUpdate($database, 'blog', ['blog_id' => $blog_id], $blog);
		// add to user's blog_ids
		addBlogIdToUsersPeers($user_id, $blog_id);
	}

	// output to javascript
	$output['item_id'] = $item_id;
	$output['blog_id'] = $blog_id;

}

?>
