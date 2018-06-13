var
	g_peers_tab = 0,
	PEERTAB_FRIENDS = 1,
	PEERTAB_NETWORKS = 2,
	PEERTAB_FIND = 3
;

/////////////////////////////////////////////////////////////////
var g_peers_users = [], g_timer_peers = 0, g_last_searchkey = '', g_peers_matches = [];

function initPeers(){
	var jdiv = $('#div_ntwk_users');
		
	// keyboard filter input
	$('#inp_peers_filter')
		.on('focus', function(e){
			this.select();
		})
		.on('keyup change', function(e){	//  change
			var searchkey = $('#inp_peers_filter').val().toLowerCase();
			if (searchkey == g_last_searchkey){
				console.debug(e.type, searchkey, 'skipped');
				return;
			} 
			console.debug(e.type, searchkey);
			g_last_searchkey = searchkey;
			
			clearTimeout(g_timer_peers);
			var delay = 100;
			switch (g_peers_tab){
				
				case PEERTAB_FRIENDS:
				case PEERTAB_NETWORKS:
					g_timer_peers = setTimeout(function(){
						var matches = [];
						for (var i in g_peers_users){
							var user = g_peers_users[i];
							var username = user.username.toLowerCase()
							if (username.indexOf(searchkey) >= 0){
								matches.push(user);
							}
						}
						g_peers_matches = matches;
						createUserList(jdiv, matches, '', g_peers_tab);
					}, delay);
					break;
					
				case PEERTAB_FIND:
					if (searchkey == ''){
						jdiv.empty();
					} else {
						g_timer_peers = setTimeout(function(){
							checkPeerUsers(-1, searchkey);
						}, delay);
					}
					break;
			}
		});
}

/////////////////////////////////////////////////////////////////

function openPeers(tab){
	console.info('openPeers');
	
	changeBodyView(TAB_PEERS);
	$('#tab_peers, #div_peers').show();

	updatePeerStat();
	
	// show tab
	if (!tab){ tab = PEERTAB_FRIENDS};
	
	showPeerTab(tab);
}

//////////////////////////////////////////////////////

function showPeerTab(tab, searchkey){
	console.debug('showPeerTab', tab);
	
	var
		networks = g_user.networks,
		friends = g_user.friends
	;
	var jdiv = $('#div_ntwk_users');
	
	// clear filter
	$('#inp_peers_filter').val('');
	g_last_searchkey = '';

	// clear data
	jdiv.empty();
	
	g_peers_tab = tab;
	var placeholder = '', user_ids = [];
	
	switch (tab){
		
		case PEERTAB_FRIENDS:
			placeholder = 'Filter my peers';
			user_ids = friends;
			break;
			
		case PEERTAB_NETWORKS:
			placeholder = 'Filter activity peers';
			user_ids = networks;
			break;
			
		case PEERTAB_FIND:
			placeholder = 'Find peers';
			user_ids = 0;
			break;
	}

	// select tab
	$('.tbl_tab_bar .div_peers_tab').removeClass('selected');
	$('.tbl_tab_bar .div_peers_tab').eq(tab - 1).addClass('selected');;
	
	// placeholder
	$('#inp_peers_filter').attr('placeholder', placeholder);
	
	//return;
	// load users
	if (user_ids && user_ids.length){
		setTimeout(function(){
			checkPeerUsers(user_ids);
		}, 100);
	}

	if (g_platform == 'web'){
		setTimeout(function(){
			$('#inp_peers_filter').focus();
		}, 100);
	}
}

///////////////////////////////////////////////////////////////////////////////////////////

function checkPeerUsers(user_ids, searchkey){	
		
	var jdiv = $('#div_ntwk_users');
	
	call_svrop(
		{
			type:		'check_users',
			users:	user_ids,
			my_user_id: g_user_id,
			searchkey: searchkey?searchkey:0,
			common_acts: 1,
		},
		function (obj){
			g_peers_users =
			g_peers_matches = obj.users; 
			createUserList(jdiv, g_peers_users, '', g_peers_tab);
		}
	);
}

/////////////////////////////////////////////////////////////////

function remove_element_from_array(array, value){
	for(var i = array.length - 1; i >= 0; i--) {
		if (array[i] === value) {
			array.splice(i, 1);
		}
	}
}

/////////////////////////////////////////////////////////////////

function in_array(a, arr){
	var bFound = 0;
	if ($.isArray(a)){
		// array?
		for (var i = 0; i < a.length - 1; i++){
			var b = a[i];
			if ($.inArray(b, arr) >= 0){
				bFound = 1;
				break;
			}
		}
	} else if ($.inArray(a, arr) >= 0){
		// string or number?
		bFound = 1;
	}
	return bFound;
}

//////////////////////////////////////////////////////////////////////////////////
var 
	but_add_peer = '<button class="btn btn-success btn-peers add_peer" onclick="add_peer(this)"><i class="glyphicon glyphicon-plus-sign"></i> Peer</button>',
	
	but_rm_peer = '<button class="btn btn-warning btn-peers rm_peer" onclick="rm_peer(this)"><i class="glyphicon glyphicon-minus-sign"></i> Peer</button>',
	
	but_message = '<button class="btn btn-primary btn-peers peer_msg" onclick="openMessenger_peers(this)"><i class="glyphicon glyphicon-envelope"></i> Message</button>',
	
	separator = '<div style="height:8px"></div>';
;

function createUserList(jdiv, users, title, peers_tab){
	console.info('createUserList', peers_tab);

	if (!users){
		console.error('createUserList: no users');
		return;
	}	
	
	jdiv.empty();
	if (title){
		jdiv.append('<div class="tbl_user_list_title">' + title + '</div>');
	}
	// loop thru all the users
	for (var i in users){
		var user = users[i];
		var user_id = user.user_id;
		var s = '<table class="tbl_user_list">';
		s +=			'<tr>' +
								'<td style="width:1px">' +
									'<img class="peer_user_photo" img_id="' + user.img_id + '"/>' +
								'</td>' +
								'<td class="peer_desc">' +
									'<div onclick="openUserPage(' + user_id + ')">' + user.username + '</div>'
		;
		if (user.position){
			s += '<div>' + user.position + '</div>';
		}
		if (user.location){
			s += '<div>' + user.location  + '</div>';
		}
		if (user.common_acts){
			s += '<br/><div>Common: <span class="common_act_title">' + user.common_acts  + '</span></div>';
		}
		
		s += '</td>';

		////////////////////////////////////////////////////////////
		// PEERS ONLY
		////////////////////////////////////////////////////////////
		if (peers_tab){
			
			var friends = g_user.friends || [];
			var networks = g_user.networks || [];
			s += '<td align="right" user_id="'+user_id+'">';
			switch (peers_tab){
				
				case PEERTAB_FRIENDS:
					s += but_rm_peer + separator + but_message;
					break;
					
				case PEERTAB_NETWORKS:
				case PEERTAB_FIND:
					if (in_array(user_id, friends)){
						s += but_rm_peer + separator + but_message;
					} else {
						s += but_add_peer + separator + but_message;
					}
					break;
			}
			s += '</td>';
		}
		s += '</td>'
				'</tr>' +
			'</table>';
		jdiv.append(s);
	}
	
	// photos
	jdiv.find('img.peer_user_photo').each(function(){
		updateImgPhoto($(this), $(this).attr('img_id'), 'user');
	});
	
	// common_acts
	jdiv.find('.common_act').click(function(){
		var act_id = parseInt($(this).attr('act_id'));
		viewActivity(act_id);
	});
	
	bindPeerBtnClick();
}

//////////////////////////////////////////////////////////////////////////////////

function add_peer(obj){
	var jobj = $(obj);
	var friend_id = parseInt(jobj.closest('td').attr('user_id'));
	call_svrop(
		{
			type:				'add_peer',
			user_id: 		g_user_id,
			friend_id:	friend_id,
		},
		function (obj){
			if (!g_user.friends){
				g_user.friends = [];
			}
			g_user.friends.push(friend_id);
			g_user.friends.sort(function(a, b){return a-b});
			console.info('add_peer succeeded', friend_id, g_user.friends);
			
			// change button
			jobj.replaceWith(but_rm_peer);
			bindPeerBtnClick();
			
			// update stat
			updatePeerStat();
		}
	);	
}

//////////////////////////////////////////////////////////////////////////////////

function rm_peer(obj){
	var jobj = $(obj);
	var friend_id = parseInt(jobj.closest('td').attr('user_id'));
	call_svrop(
		{
			type:				'rm_peer',
			user_id:		g_user_id,
			friend_id:	friend_id,
		},
		function (obj){
			if (!g_user.friends){
				g_user.friends = [];
			}
			remove_element_from_array(g_user.friends, friend_id);
			console.info('rm_peer succeeded', friend_id, g_user.friends);
			
			// change button
			jobj.replaceWith(but_add_peer);
			bindPeerBtnClick();
			
			updatePeerStat();

			// refresh list
			switch (g_peers_tab){
				case PEERTAB_FRIENDS:
					//remove_element_from_array(g_peers_matches, friend_id);
					for (var i in g_peers_matches){
						var user = g_peers_matches[i];
						if (user.user_id == friend_id){
							g_peers_matches.splice(i, 1);
							break;	// assuem only one
						}
					}
					createUserList($('#div_ntwk_users'), g_peers_matches, '', g_peers_tab);
					break;
			}
		}
	);
}

//////////////////////////////////////////////////////////////////////////////////////

function openMessenger_peers(obj){
	var jobj = $(obj);
	var user_id = parseInt(jobj.closest('td').attr('user_id'));
	openMessenger_userid(user_id);
}

//////////////////////////////////////////////////////////////////////////////////////

function updatePeerStat(){
	// show stat
	var friends = g_user.friends || [];
	var networks = g_user.networks || [];
	$('.peers_tab_data.friends').text(friends.length);
	$('.peers_tab_data.networks').text(networks.length);
}

//////////////////////////////////////////////////////////////////////////////////////

// https://stackoverflow.com/questions/9712376/jquery-click-doesnt-work-after-html-has-been-changed
function bindPeerBtnClick(){
/*	
	setTimeout(function(){
		console.debug('bindPeerBtnClick');
		var jdiv = $('#div_peers');
		jdiv.find('.add_peer').unbind().click(function(){
			add_peer(this);
		});
		jdiv.find('.rm_peer').unbind().click(function(){
			rm_peer(this);
		});
		jdiv.find('.peer_msg').unbind().click(function(){
			openMessenger_peers(this);
		});
	}, 100);// allow some dom processing
*/
	
}