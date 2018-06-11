var
	g_messenger_users = 0,
	g_messenger_acts = 0,
	MSG_TYPE_USR = 1,
	MSG_TYPE_ACT = 2
;

function openMessengerList(){
	console.debug('openMessengerList', g_user.messages);

	var users_hash = {}, act_ids = [];

	// Find all the users and acts in unread_msgs
	var unread_msgs = g_user.unread_msgs;
	for (var i in unread_msgs){
		var msg = unread_msgs[i];
		switch (msg.msg_type){
			case MSG_TYPE_USR:
				users_hash[msg.item_id] = 1;
				break;
			case MSG_TYPE_ACT:
				act_ids.push(msg.item_id);
				break;
		}
	}
/*
	// find friends
	if (g_user.friends){
		for (var i in g_user.friends){
			var user_id = g_user.friends[i];
			console.debug(user_id);
			users_hash[user_id] = 1;
		}
	}
*/
	// convert it to number array
	var user_ids = hash2numArr_keyint(users_hash);
/*
	// find all the users in joined activities
	for (var i in g_user.profile.activity){
		var act = g_user.profile.activity[i];
		act_ids.push(act.act_id);
	}
*/
	//console.debug(users);
	openProgress2();

	// check with server
	call_svrop(
		{
			type: 		'check_users_acts',
			user_ids: 	user_ids,
			act_ids:	act_ids,
		},
		function (obj){
			//console.debug('check_users_acts', obj.users, obj.acts);
			g_messenger_users = obj.users;
			g_messenger_acts = obj.acts;

			closeProgress2();

			changeBodyView(PAGE_MESSENGER_LIST);

			var jdiv = $('#div_messenger_list');
			jdiv.find('.bodyview_title').css('font-size', '18px').html('Messages');
			jdiv.find('.bodyview_title2').html('');

			openMessengerList2();
		}
	)
}

//////////////////////////////////////////////////////////////////////////////////////////////

function openMessengerList2(){

	// FOR MY UNREAD MSGS
	if (!g_user.unread_msgs){
		g_user.unread_msgs = {};
	}
	var unread_msgs = g_user.unread_msgs;

	// FIND LIST_ARR
	var list_arr = [];
	var list_hash = {};

	// LOOP FOR UNREAD MSGS
	for (var conv_id in unread_msgs){
		var	msg = unread_msgs[conv_id],
			msg_time = getMsgTime(msg.datetime)
		;
		if (!msg.item_id){
			console.error('undefined unread_msgs', conv_id, msg);
			continue;
		}
		var conv_id = getConvID(msg.msg_type, msg.item_id);
		list_hash[conv_id] = 1;
		list_arr.push({
			msg_type: msg.msg_type,
			item_id: msg.item_id,
			datetime: msg.datetime,
			last_msg: msg.last_msg,
			unread_msg: msg.unread_msg,
		});
	}

	// ADD OTHER USERS
	for (var user_id in g_messenger_users){
		var user = g_messenger_users[user_id];
		var conv_id = getConvID(MSG_TYPE_USR, user_id);
		if (!list_hash[conv_id]){
			list_arr.push({
				msg_type: MSG_TYPE_USR,
				item_id: user_id,
				item_name: user.username,
			});
		}
	}
	// ADD OTHER ACTS
	for (var act_id in g_messenger_acts){
		var act = g_messenger_acts[act_id];
		var conv_id = getConvID(MSG_TYPE_ACT, act_id);
		if (!list_hash[conv_id]){
			list_arr.push({
				msg_type: MSG_TYPE_ACT,
				item_id: act_id,
				item_name: act.title,
			});
		}
	}
	//console.debug(unread_msgs, list_arr);

	// READ FOR NAME AND IMG_ID FROM THE SERVER
	for (var i in list_arr){
		var	list = list_arr[i];
		switch (list.msg_type){

			case MSG_TYPE_USR:
				var	user = g_messenger_users[list.item_id];
				if (user){
					list.item_name = user.username;
					list.img_id = user.img_id;
				}
				break;

			case MSG_TYPE_ACT:
				var act = g_messenger_acts[list.item_id];
				if (act){
					list.item_name = act.title;
					list.img_id = act.img_id;
				}
				break;
		}
		if (!list.datetime) list.datetime = '';
		if (!list.unread_msg) list.unread_msg = 0;
		if (!list.last_msg) list.last_msg = '';
	}
	//console.debug('bfr', list_arr);

	// SORT BY ORDER
	list_arr.sort(function(a, b){
		if (a.unread_msg && !b.unread_msg){
			return -1;
		} else if (!a.unread_msg && b.unread_msg){
			return 1;
		//} else if (a.unread_msg && b.unread_msg){
		//	return a.unread_msg - b.unread_msg？-1 :１;
		} else if (a.datetime && b.datetime && a.datetime > b.datetime){
			return -1;
		} else if (a.datetime && b.datetime && a.datetime < b.datetime){
			return 1;
		} else if (a.datetime && !b.datetime){
			return -1;
		} else if (!a.datetime && b.datetime){
			return 1;
		} else if (a.item_name > b.item_name){
			return 1;
		} else if (a.item_name < b.item_name){
			return -1;
		} else {
			return 0;
		}
	});
	//console.debug('aft', list_arr);

	// DRAW TO THE TABLE
	$('#tbl_message_list tbody').empty();
	for (var i in list_arr){
		var
			list = list_arr[i],
			msg_time = getMsgTime(list.datetime)
		;
		//console.debug(list);
		if (list.msg_type == MSG_TYPE_USR && list.item_id == g_user_id){
			continue;
		} else if (!list.item_name){
			console.error('skipped undefined name', list.item_id);
			continue;
		}

		var jtr = $('<tr msg_type="' + list.msg_type + '" item_id="' + list.item_id + '" item_name="' + list.item_name + '">'
					+ '<td class="td_photo">'
						+ '<img class="msg_photo" src="' + (list.msg_type == MSG_TYPE_USR ? getUserImgSrc(list.img_id) : getActImgSrc(list.img_id)) + '"/>'
					+ '</td>'
					+ '<td class="td_userbody">'
						+ '<span class="td_username">' + list.item_name + '</span><br/>'
						+ '<span class="td_body">' + list.last_msg + '</span>'
					+ '</td>'
					+ '<td class="td_right">'
						+ '<table class="tbl_unread">'
							+ '<tr><td class="td_time">' + msg_time + '</td></tr>'
							+ '<tr><td class="td_unread">'
								+ '<div class="balloon3" style="display:' + (list.unread_msg > 0 ? 'block' : 'none') + '">'
									+ '<div class="balloon2">' + list.unread_msg + '</div>'
								+ '</div>'
							+ '</td></tr>'
						+ '</table>'
					+ '</td>'
				+ '</tr>')
		;
		$('#tbl_message_list>tbody').append(jtr);

		// ADD INTERACTION
		jtr.click(function(){
			var
				jtr = $(this),
				msg_type = parseInt(jtr.attr('msg_type')),
				item_id = parseInt(jtr.attr('item_id')),
				item_name = jtr.attr('item_name')
			;
			var conv_id = getConvID(msg_type, item_id);
			switch (msg_type){

				case MSG_TYPE_USR:
					var user_id = item_id,
						user = g_messenger_users[conv_id]
					;
					if (!g_user.messages){
						g_user.messages = [];
					}
					if (!g_user.messages[conv_id]){
						g_user.messages[conv_id] = [];
					}
					msg_arr = g_user.messages[conv_id];
					openMessenger_user(user_id, item_name, msg_arr, g_messenger_users);
					break;

				case MSG_TYPE_ACT:
					var act_id = item_id;
					openProgress2();

					call_svrop(
						{
							type: 'get_activity',
							act_id: act_id,
						},
						function (obj){
							console.info('succeeded', obj);
							if (!obj.activity){
								console.error('return no activity', 'act_id='+act_id);
							} else {
								var	activity = obj.activity;
								openMessenger_act(activity);
							}
							closeProgress2();
						}
					);
					break;
			}
		});

	}
	//setTimeout(function(){
	//	checkOnResize();
	//}, 100);
}


/////////////////////////////////////////////////////////////////

function getMsgTime(msg_time){
	if (msg_time){
		var
			date1 = g_server_time.split(' ')[0],
			time1 = g_server_time.split(' ')[1],
			date2 = msg_time.split(' ')[0],
			time2 = msg_time.split(' ')[1]
		;
		if (date1 == date2){
			msg_time = getDateWithoutSecond(time2);
		} else {
			msg_time = date2;
		}
	}
	return msg_time;
}
