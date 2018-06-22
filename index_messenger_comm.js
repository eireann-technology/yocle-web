

var
	MSG_TYPE_USR = 1,
	MSG_TYPE_ACT = 2,
	TYPING_INTERVAL = 3000
;
var
	g_messenger_type = 0,
	g_socket = 0,
	g_socket_port = 8090,
	g_recipients = [],
	g_time_emit_typing = 0,
	g_chat_url = '';
;

function initMessenger(){
	console.debug('initMessenger');

	// INPUT
	var jdiv = $('#div_messenger_comm');
	var jinput = $('.msg_input').val('');

	jinput.unbind().keypress(function(e){
		//console.debug(e);
		if (e.which == 13){

			e.preventDefault();
			sendMsg();

		} else {

			var timenow = new Date();
			var delay = 0;
			if (g_time_emit_typing){
				delay = timenow - g_time_emit_typing;
			}

			//console.debug(delay);
			if (!delay || delay > TYPING_INTERVAL){
				g_time_emit_typing = timenow;
				g_socket.emit('sender_typing', {
					user_id: g_user_id,
					user_name: g_user_name,
					recipients: g_recipients,
				});
			} else {
				console.log('prevent too frequent', delay);
			}
		}
	});
	/*
	switch (host){
		case 'yolofolio2.cetl.hku.hk':
		case 'yocle.net':
		case 'www.yocle.net':
			break;
		default:
			console.info('skipped non-production messenger');
			return;
	}
	*/
	// for dev
	var hostname = window.location.hostname;
	var url = 0;
	if (hostname != 'localhost'){
		url = "https://" + hostname + ":" + g_socket_port;
	}
	g_chat_url = url;
}

//////////////////////////////////////////////////////////////////

function connectChatServer(){
	if (g_socket){
		disconnectChatServer();
	}
	if (!g_chat_url){
		return;
	}
	console.debug('connecting...' + g_chat_url);
	g_socket = io.connect(g_chat_url);
	console.debug('connected');

	var jstatus = $('#div_messenger_comm .bodyview_title2');
	g_socket
		////////////////////////////////////////////////////////////////
		// connect
		////////////////////////////////////////////////////////////////
		.on('connect', function(e){
			// onconnected
			g_socket.emit("onconnected", {
				user_id: g_user_id,
				user_name: g_user_name,
			});
		})

		////////////////////////////////////////////////////////////////
		// onrecvmsg
		////////////////////////////////////////////////////////////////
		.on('serverMsg', function (recvobj){
			onRecvMsg(recvobj);
		})

		////////////////////////////////////////////////////////////////
		// onrecvsender
		////////////////////////////////////////////////////////////////
		.on('sender_typing', function (data){
			if (data.user_id != g_user_id){
				switch (g_messenger_type){
					case MSG_TYPE_USR:
						jstatus.html('Typing...');
						break;
					case MSG_TYPE_ACT:
						jstatus.html(data.user_name + ' is typing...');
						break;
				}
				setTimeout(function () {
					jstatus.html('');
				}, TYPING_INTERVAL);
			}
		})

	// show unread message
	showUnreadMessages();
	resizeMessenger();
}

//////////////////////////////////////////////////////////////////////////

function disconnectChatServer(){
	if (g_socket){
		g_socket.disconnect();
		g_socket = 0;
	}
}

//////////////////////////////////////////////////////////////////////////

function getConvID(msg_type, item_id){
	var conv_id = '';
	switch (msg_type){
		case MSG_TYPE_USR: conv_id = 'u' + item_id; break;
		case MSG_TYPE_ACT: conv_id = 'a' + item_id; break;
	}
	return conv_id;
}


////////////////////////////////////////////////////////////////////////

function scrollMsg(){
	var h = 100;
	$('#div_messenger_comm div').each(function(){
		h += $(this).height() + 100;
	})
/*
	//console.debug('scrollMsg', h);
	setTimeout(function(){
		$('#div_messenger_comm .msg_output_container').animate({
			scrollTop: h,
		})
	}, 10);
*/
	$(window).scrollTop(h);
}

////////////////////////////////////////////////////////////////////////

function addMyMsg(body, time, msg_id){
	if (!time){
		time = getTimeString();
	}
	time = getDateWithoutSecond(time);

	var s = '';
	s += '<span class="msg_body">' + body + '</span><span class="msg_time">' + time + '</span><span class="msg_delete">&nbsp;</span>';
	$('#div_messenger_comm .msg_output')
		.append('<div class="bubble me" msg_id="' + msg_id + '">' + s + '</div>');
}

////////////////////////////////////////////////////////////////////////

function addTheirMsg(username, body, time, msg_id){
	if (!time){
		time = getTimeString();
	}
	time = getDateWithoutSecond(time);
	var s = '';
	switch (g_messenger_type){

		case MSG_TYPE_USR:
			break;

		case MSG_TYPE_ACT:
			s += '<span class="msg_username">' + username + '</span>';
			break;
	}
	s += '<span class="msg_body">' + body + '</span><span class="msg_time">' + time + '</span><span class="msg_delete">&nbsp;</span>';
	$('#div_messenger_comm .msg_output').append('<div class="bubble them" msg_id="' + msg_id + '">' + s + '</div>');
}


////////////////////////////////////////////////////////////////////
var g_messenger_item_id = 0;

function openMessenger_user(user_id, user_name, msg_arr, users2){

	console.log('openMessenger_user', user_id, user_name);//, msg_arr);

	g_messenger_type = MSG_TYPE_USR;
	g_messenger_item_id = user_id;
	g_recipients = [user_id];

	changeBodyView(PAGE_MESSENGER_COMM);

	var jdiv = $('#div_messenger_comm');
	jdiv.find('.bodyview_title').css('font-size', '16px').html(user_name);
	jdiv.find('.bodyview_title2').html('');
	var user = getUserByID(users2, user_id);
	jdiv.find('.msg_photo2').attr('src', getUserImgSrc(user.img_id));

	// CLEAR THE DIV
	jdiv.find('.msg_output').empty();

	// RESTORE ALL THE ARRAY ELEMENTS
	restoreAllMsgs(msg_arr, users2);
	checkOnResize();

	setTimeout(function(){
		//alert('scroll');
		checkOnResize();
		scrollMsg();
		if (g_platform == 'web'){
			jdiv.find('.msg_input').focus();
		}

	}, 10);

}

/////////////////////////////////////////////////////////////////////////////////

var g_messenger_act = 0;

function openMessenger_act(activity){
	var act_id = parseInt($('#div_activity_view').attr('act_id'));
	console.debug('openMessenger_act', activity.act_id);
	g_messenger_type = MSG_TYPE_ACT;
	g_messenger_item_id = activity.act_id;

	g_messenger_act = activity;

	changeBodyView(PAGE_MESSENGER_COMM);

	var jdiv = $('#div_messenger_comm');
	jdiv.find('.bodyview_title').html(activity.title);
	if (g_platform != 'web'){
		jdiv.find('.bodyview_title').css('font-size', '11px')
	}
	jdiv.find('.bodyview_title2').html('');
	jdiv.find('.msg_photo2').attr('src', getActImgSrc(activity.img_id));

	// CLEAR THE DIV
	jdiv.find('.msg_output').empty();

	//var users_hash = [].concat(activity.participants, [g_user_id, activity.coordinator_id]);
	//g_recipients = hash2numArr_key(num2hashArr_id(users_hash));
	// make sure it is integer
	//for (var i in g_recipients){
	//	g_recipients[i] = parseInt(g_recipients[i]);
	//}
	g_recipients = activity.allusers;
	//console.debug(g_recipients);

	// openProgress
	openProgress2();

	// check with server
	call_svrop(
		{
			type: 'check_users',
			users: g_recipients,
		},
		function (obj){
			closeProgress2();
			var users2 = obj.users;
			//console.debug('users2', users2);

			// RESUME ALL THE ARRAY ELEMENTS
			restoreAllMsgs(activity.messages, users2);

			setTimeout(function(){
				scrollMsg();
				if (g_platform == 'web'){
					jdiv.find('.msg_input').focus();
				}
			}, 10);

		}
	)
}

//////////////////////////////////////////////////////////////////////////////////////////

function restoreAllMsgs(msg_arr, users2){
	//console.debug('restoreAllMsg1', msg_arr);
	if (msg_arr){
		var old_date = '';
		for (var i in msg_arr){
			var msg = msg_arr[i];
			var user_id = msg.user_id;
			var datetime = msg.time;
			var date = datetime.split(' ')[0];
			var time = datetime.split(' ')[1];
			if (date != old_date){
				//console.debug('new date', date);
				$('#div_messenger_comm .msg_output')
					.append('<div class="msg_date2"><div class="msg_date1">' + date + '</div></div>');
					//.append('<br/>' + date + '<br/>');
				old_date = date;
			}
			if (user_id == g_user_id){
				addMyMsg(msg.body, time, msg.msg_id);
			} else {
				var user = getUserByID(users2, user_id);
				addTheirMsg(user.username, msg.body, time, msg.msg_id);
			}
		}
	}
	openMessenger_msg_delete($('#div_messenger_comm .msg_delete'));
	//return;

	// call server to mark read
	var item_id = g_messenger_item_id;
	var conv_id = getConvID(g_messenger_type, item_id);
	var msg = g_user.unread_msgs[conv_id];
	if (msg){
		call_svrop(
			{
				type:				'mark_readmsg',
				msg_type:		g_messenger_type,
				item_id:		item_id,
				user_id:		g_user_id,
			},
			function (obj){
				// reset unread in memory
				msg.unread_msg = 0;
				// update the unread
				showUnreadMessages();
			}
		)
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function openMessenger_msg_delete(jobj){
	jobj
		.css("backgroundImage", "url(./images/delete_over_24.png)")
		.unbind()
		.hover(function(e){
			$(this).css("backgroundImage", "url(./images/delete_down_24.png)");
			//$(this).css("color", "transparent");
		})
		.on('mouseout mouseleave mouseup', function(){
			$(this).css("backgroundImage", "url(./images/delete_over_24.png)");
			//$(this).css("color", "transparent");
		})
		.on('mousedown', function(e){
			//$(this).css("color", "transparent");
		})
		.click(function(e){
			var jobj = $(this).parent();
			var msg_id = parseInt(jobj.attr('msg_id'));
			//console.debug('delete', msg_id);
			if (confirm('Are you sure to delete this message?')){
				deleteMessage(msg_id, jobj);
			}
		})
	;
}

/////////////////////////////////////////////////////////////////////////////////

function deleteMessage(msg_id, jobj){
	//msg_id = jobj.parent().find('.bubble').index(jobj) + 1;
	console.debug('deleteMessage', msg_id, jobj);

	var sendobj = {
		type: 			'delete_message',
		msg_type:		g_messenger_type,
		msg_id:			msg_id,
		user_id:		g_user_id,
		user_name:	g_user_name,
		recipients: g_recipients,
	};

	switch (g_messenger_type){

		case MSG_TYPE_USR:
			break;

		case MSG_TYPE_ACT:
			sendobj['act_id'] =	g_messenger_act.act_id;
			break;
	}

	call_svrop(
		sendobj,
		function (recvobj){
			console.info('succeeded', recvobj);

			// reorder msg_id
			var msg_id2 = 1;
			$('#tbl_message_comm .msg_output .bubble').each(function(){
				//console.debug($(this));
				$(this).attr('msg_id', msg_id2++);
			});

			// update the memory
			switch (g_messenger_type){

				case MSG_TYPE_USR:
					var messages = g_user.messages;
					var item_id = g_recipients[0];
					var conv_id = getConvID(MSG_TYPE_USR, item_id);
					var msg_arr =  messages[conv_id];
					msg_arr.splice(msg_id - 1, 1);
					jobj.remove();
					break;

				case MSG_TYPE_ACT:
					var msg_arr = g_messenger_act.messages;
					msg_arr.splice(msg_id - 1, 1);
					jobj.remove();
					break;
			}

		}
	);
}

////////////////////////////////////////////////////////////////////

function updateMessengerList(msg_type, user_id, item_id, time, msg, inc_unread){
	if (!inc_unread) inc_unread = 0;
	var jtbl = $('#tbl_message_list');
	var jtr = jtbl.find('tr[msg_type='+msg_type+'][item_id='+item_id+']');
	if (jtr.length){
		jtr.find('.td_time').html(getMsgTime(time));
		jtr.find('.td_body').html(msg);
		var unread = parseInt(jtr.find('.balloon2').text());
		//console.debug('updateMessengerList', msg_type, user_id, item_id, inc_unread, unread);
		if (inc_unread) unread += inc_unread;
		jtr.find('.balloon2').text(unread);
		if (!unread){
			jtr.find('.balloon3').hide();
		} else {
			jtr.find('.balloon3').show();
		}
		//console.debug(jtr.outerHTML());
	}
}

//////////////////////////////////////////////////////////////////////////////////////////

function openMessenger_userid(user_id){
	//showhideactionbar(0);	// cannot run when it is called by notification
	//return;
	// check with server
	call_svrop(
		{
			type: 'check_users_acts',
			user_ids: [user_id],
			//act_ids: act_ids,
		},
		function (obj){
			//console.debug('check_users_acts', obj.users, obj.acts);
			g_messenger_users = obj.users;
			//g_messenger_acts = obj.acts;

			var user = getUserByID(g_messenger_users, user_id);
			var conv_id = getConvID(MSG_TYPE_USR, user_id);
			if (!g_user.messages){
				g_user.messages = [];
			}
			if (!g_user.messages[conv_id]){
				g_user.messages[conv_id] = [];
			}
			var msg_arr = g_user.messages[conv_id];
			openMessenger_user(user_id, user.username, msg_arr, g_messenger_users);
		}
	);
}

//////////////////////////////////////////////////////////////////////////////////////////

function openMessenger_actid(act_id){
	//showhideactionbar(0);	// cannot run when it is called by notification

	call_svrop(
		{
			type: 'get_activity',
			act_id: act_id,
		},
		function (obj){
			openMessenger_act(obj.activity);
		}
	);
}

////////////////////////////////////////////////////////////////////////

function sendMsg(msg){

	if (typeof(msg) == 'undefined'){
		msg = $('.msg_input').val();
	}
	if (!msg || msg == ''){
		return;
	}
	var item_id = g_messenger_item_id;
	//switch (g_messenger_type){
	//	case MSG_TYPE_USR: item_id = g_user_id; break;
	//	case MSG_TYPE_ACT: item_id = g_messenger_act.act_id; break;
	//}

	// add to message box
	var msg_id = $('#tbl_message_comm .msg_output .bubble').length + 1;
	console.debug('msg_id', msg_id);
	addMyMsg(msg, 0, msg_id);

	// show delete button
	openMessenger_msg_delete($('#div_messenger_comm .msg_delete:last-child'));

	// scroll to bottom
	scrollMsg();

	// clear input
	//$(':focus').blur();
	var jinput = $('#tbl_message_comm .msg_input');
	jinput.val('').focus();

	//setTimeout(function(){
		//jinput;
	//}, 10);

	// prepare sendobj
	var sendobj = {
		type:					'save_message',
		msg_type:			g_messenger_type,
		item_id:			item_id,
		sender_id:		g_user_id,
		sender_name:	g_user_name,
		recipients: 	g_recipients,
		msg: 					msg,
	};
	console.debug('sendMsg', sendobj);
	//return;

	// send to nodejs
	g_socket.emit("clientMsg", sendobj);

	// send to https svrop to save to database
	call_svrop(
		sendobj,

		function (sendobj2){
			console.info('sendobj2', sendobj2);

			var msg = sendobj2.new_msg;

			// update the memory
			switch (g_messenger_type){

				case MSG_TYPE_USR:
					if (!g_user.messages){
						g_user.messages = {}
					}
					var messages = g_user.messages;
					var item_id2 = g_recipients[0];
					var conv_id = getConvID(MSG_TYPE_USR, item_id2);
					var msg_arr =  messages[conv_id];
					msg_arr.push(msg);
					break;

				case MSG_TYPE_ACT:
					if (!g_messenger_act.messages){
						g_messenger_act.messages = [];
					}
					var msg_arr = g_messenger_act.messages;
					msg_arr.push(msg);
					break;
			}
			// update UnreadMsg
			sendobj.time = sendobj2.server_time;
			updateUnreadMsg(sendobj, item_id, 0);

			// update lists
			updateMessengerList(g_messenger_type, g_user_id, item_id, msg.time, msg.body, 1);
		}
	);
}

//////////////////////////////////////////////////////////////////////////////////////

function onRecvMsg(recvobj){
	var msg_type = recvobj.msg_type;
	if (msg_type == MSG_TYPE_USR){
		recvobj.item_id = recvobj.sender_id;
	}
	var item_id = recvobj.item_id;
	console.debug('onRecvMsg', item_id, recvobj);

	var conv_id = getConvID(msg_type, item_id);
	if (!g_user.messages){
		g_user.messages = {};
	}
	if (!g_user.messages[conv_id]){
		g_user.messages[conv_id] = [];
	}
	// ADD TO THE MESSAGE ARRAY
	var sender_id = parseInt(recvobj.user_id);
	var new_msg = {
		msg_id: 	g_user.messages[conv_id].length + 1,
		user_id: 	sender_id,
		body: 		recvobj.msg,
		time: 		recvobj.time,
	};
	g_user.messages[conv_id].push(new_msg);
	var arr = g_user.messages[conv_id];
	for (var i = 0; i < arr.length; i++){
		arr[i].msg_id = i + 1;
	}

	// update UnreadMsg
	updateUnreadMsg(recvobj, item_id, 1);

	// update lists
	updateMessengerList(recvobj.msg_type, sender_id, recvobj.item_id, recvobj.time, recvobj.msg, 1);

	// add message
	if (sender_id == g_user_id){
		addMyMsg(recvobj.msg, getMsgTime(recvobj.time), recvobj.msg_id);
	} else {
		addTheirMsg(recvobj.sender_name, recvobj.msg, recvobj.msg_id);
	}
	openMessenger_msg_delete($('#div_messenger_comm .msg_delete:last-child'));
	scrollMsg();


	// refresh page
	if (g_curr_page == PAGE_MESSENGER_LIST){
		openMessengerList2();
	}
}

/////////////////////////////////////////////////////////////////////////////

function updateUnreadMsg(obj, item_id, inc_unread){ // item = user_id or act_id
	console.debug('updateUnreadMsg', obj, item_id);

	var conv_id = getConvID(obj.msg_type, item_id);

	// ADD TO UNREAD MSGS
	if (!g_user.unread_msgs){
		g_user.unread_msgs = {};
	}
	var unread = inc_unread;
	var unread_msgs = g_user.unread_msgs;
	if (unread_msgs[conv_id] && unread_msgs[conv_id]['unread_msg']){
		unread += unread_msgs[conv_id]['unread_msg'];
	}
	unread_msgs[conv_id] = {
		msg_type:		obj.msg_type,
		item_id:		obj.item_id,
		datetime:		obj.time,
		last_msg:		obj.msg,
		unread_msg: 	unread,
	};

	// calc unread
	showUnreadMessages();

	// sort the list
	//openMessengerList2();
}

////////////////////////////////////////////////////////////////////

function showUnreadMessages(){
	var unread = 0;
	var unread_msgs = g_user.unread_msgs
	for (var index in unread_msgs){
		var msg = unread_msgs[index];
		unread += msg.unread_msg;
	}
	console.info('showUnreadMessages', unread);
	if (unread > 0){
		$('#topmenu_msg .balloon').show();
		$('#topmenu_msg .balloon2').html(unread);
	} else {
		$('#topmenu_msg .balloon').hide();
	}
}
