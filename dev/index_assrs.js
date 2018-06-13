//var g_all_assrs, selected_assrs

function initAssrs(jdiv){

}

//////////////////////////////////////////////////////////////

var
	g_pa_unselected = [],
	g_pa_unselected_arr = [],
	g_pa_unselected = 0,
	g_pa_selected = 0,
	g_pa_required = 0,
	g_act_panelists = 0,
	g_usr_panelists = 0,
	g_pa_jtbl = 0;
;

function updatePanelists(jparent, act_panelists, usr_panelists, part_id, bPeerAsstEditable, callback){

	//console.trace('updatePanelists');
	console.log('updatePanelists');
	var
		act = g_saved_activity,
		act_id = act.act_id,
		selected_arr = [],
		unselected_arr = [],
		required = 0,
		jdiv = jparent.find('.div_asspage_assessors'),
		jtbl1 = jparent.find('.dt_peer_asst'),
		jmsg = jparent.find('.td_message'),
		jbutton = jparent.find('button.btn_select')
	;
	// FIND NUM OF REQUIRED PEER ASSESSORS
	if (act_panelists.peers == 0){

		//////////////////////////////////////////////////
		// CASE 1: NO PEER ASSESSMENT
		//////////////////////////////////////////////////
		jparent.find('.div_peer_assessment').hide();
		jparent.find('.tr_peer_asst_others').hide();
		jparent.find('.tr_peer_asst_all').hide();
		jtbl1.hide();
		jbutton.hide();

	} else if (act_panelists.peers == 'all'){

		//////////////////////////////////////////////////
		// CASE 2: ALL AVAILABLE PEERS
		//////////////////////////////////////////////////
		jparent.find('.div_peer_assessment').show();
		jparent.find('.tr_peer_asst_all').show();
		jparent.find('.tr_peer_asst_others').hide();
		jtbl1.hide();
		jbutton.hide();
		//selected_arr = act.participants;
		//remove_element_from_array(selected_arr, part_id);
		//required = selected_arr.length;

	} else {

		//////////////////////////////////////////////////////
		// FIND AVAILABLE SELECTION
		// unselected_arr = participants - selected panelists
		//////////////////////////////////////////////////////
		// find selected peer assessors
		if (is_array(usr_panelists.peer_assessors)){
			selected_arr = jsonclone(usr_panelists.peer_assessors);
		}
		// find unselected peer assessors
		var primary_assessors = getMyAssessors(
			act_panelists,
			0,
			part_id
		);
		// loop for each participant
		for (var i = 0; i < act.participants.length; i++){
			var
				user_id = act.participants[i],
				bFound = 0;
			;
			// check to skip myself
			if (user_id == g_user_id){
				continue;
			}
			// check if it is already in panelist
			for (var j in primary_assessors){
				var user_id2 = primary_assessors[j];
				if (user_id2 == user_id){
					bFound = 1;
					break;
				}
			}
			if (!bFound){
				unselected_arr.push(user_id);
			}
		}
		// required
		required = parseInt(act_panelists.peers);
		if (required > unselected_arr.length){
			required = unselected_arr.length;
		}

		if (act_panelists.peers > 0 && !bPeerAsstEditable && !selected_arr.length){
			//////////////////////////////////////////////////
			// CASE 3: VIEW ONLY AND NO SELECTION
			//////////////////////////////////////////////////
			jparent.find('.div_peer_assessment').show();
			jparent.find('.tr_peer_asst_all').hide();
			jparent.find('.tr_peer_asst_others').show();
			jtbl1.hide();
			jbutton.hide();

		} else {

			//////////////////////////////////////////////////
			// CASE 4: SELECT PEER ASSESSORS
			//////////////////////////////////////////////////
			jparent.find('.div_peer_assessment').show();
			jparent.find('.tr_peer_asst_all').hide();
			jparent.find('.tr_peer_asst_others').show();
			jtbl1.show();
			// SELECT BUTTON & MSG TO SHOW IT IN RED?
			if (!bPeerAsstEditable){
				jmsg.hide();
				jbutton.hide();
			} else {
				jmsg.show();
				if (selected_arr.length != required){
					// not meeting the requirment yet
					jmsg.css('color', 'red');
				} else {
					// met the requirment
					jmsg.css('color', '');
				}
				// prepare the select button
				jbutton
					.show()
					.unbind()
					.click(function(){
						selectPeerAssrs(jparent);
					});
			}
		}
	}
	// SET THE MESSAGE (WILL BE NEEDED LATER)
	jparent.find('.span_peers').text(required);
	jparent.find('.span_participants').text(unselected_arr.length);


	// remember global variables
	g_act_panelists 		= act_panelists;
	g_usr_panelists 		= usr_panelists;

	g_pa_required 			= required;
	g_pa_selected_arr 	= selected_arr;
	g_pa_unselected_arr = unselected_arr;
	g_pa_selected 			= selected_arr.length;
	g_pa_unselected 		= unselected_arr.length;
	g_pa_jtbl 					= jtbl1;

	// DRAW THE SELECTED PEER ASSESSORS
	actpage_addUsers(selected_arr, jtbl1, 0, function(){

		// DRAW ALL THE ASSESSORS
		var jtbl2 = jparent.find('.dt_all_assrs').show();
		var	all_assessors = getMyAssessors(
			act_panelists,
			usr_panelists,
			part_id
		);
		actpage_addUsers(all_assessors, jtbl2, 0,
			function(database_users){
				g_asst_assrs = database_users;
				if (!all_assessors.length){
					jparent.find('.ass_primaryassessors').hide();
					jtbl2.hide();
				}
				transdiv_resize();
				callback && callback();
			},
			function(user_id, imgusername){	// onModify
				var user_type = '';
				if (act_panelists.coordinator && user_id == act.coordinator_id){
					user_type = 'Coordinator';
				} else if (act_panelists.self && user_id == part_id){
					user_type = 'Self';
				} else if (in_array(user_id, act_panelists.others)){
					user_type = 'Others';
				} else if (act_panelists.peers == 'all' || in_array(user_id, selected_arr)){
					user_type = 'Peer';
				}
				if (user_type){
					imgusername += ' (' + user_type + ')';
				}
				if (user_id == g_user_id){
					imgusername = '<b>' + imgusername + '</b>';
				}
				return imgusername;
			}
		);
	});

}


///////////////////////////////////////////////////////

var
	g_peerassessees_arr = 0,
	g_peerassessees_imp_iamassr = 0,
	g_peerassessees_ass_iamassr = 0
;
function updatePeerAssesseesArr(arr){

	g_peerassessees_arr = arr;
	g_peerassessees_imp_iamassr = 0;
	g_peerassessees_ass_iamassr = 0;

	// CHECK IF I AM ASSESSOR OF ANY ASSESSES IN ANY OF THE ASSESSMENT IN THIS ACTIVITY?
	for (var ass_id in arr){
		var assessees = arr[ass_id];
		if (assessees.length){
			if (ass_id == 0){
				g_peerassessees_imp_iamassr = 1;
			} else {
				g_peerassessees_ass_iamassr = 1;
			}
		}
	}
	//////////////////////////////////////////////////////
	// SHOW ALL TABS
	//////////////////////////////////////////////////////
	viewActAsst_all();
	viewActImpr_all();

}

//////////////////////////////////////////////////

// when ass_id = 0, it is impression
function getMyPeerAssessees(ass_id){
	var arr = [];
	if (g_peerassessees_arr && g_peerassessees_arr[ass_id]){
		arr = g_peerassessees_arr[ass_id];
	}
	return arr;
}

///////////////////////////////////////////////////////////

function selectPeerAssrs(jparent){
	console.log('select peerassessors');

	var
		jmsg = jparent.find('.td_message'),
		jbutton = jparent.find('button')
	;

	// copy the settings
	var jdiv = $('<div/>');
	jdiv.append($('#div_peer_assessment3').html());
	jdiv.find('.span_peers').text(g_pa_required);
	jdiv.find('.span_participants').text(g_pa_unselected);

	// ***TO BE TESTED AND REPLACED BY BODYVIEW
	g_lightbox = $.featherlight(jdiv, {
		afterClose: function(){
			return false;
		},
		afterContent: function(){
			// LIGHTBOX
			var jlightbox = this.$content;

			// BUILD UP THE SECOND POPUP TABLE
			var jtbl_select = jlightbox.find('.my_datatable').css('visibility', 'hidden');

			var selected_hash = num2hashArr(g_pa_selected_arr);

			actpage_addUsers(g_pa_unselected_arr, jtbl_select, selected_hash, function(){

				console.info('add peer assessors');

				// show it
				jtbl_select.css('visibility', 'visible');

				// modify the checkbox
				jtbl_select.find('input[type=checkbox]').css('zoom', 1.5);
				/////////////////////////////////////////
				// SELECT-ALL
				/////////////////////////////////////////
				jlightbox.find('.btn_selectall').unbind().click(function(){
					jlightbox.find('input[type=checkbox]').prop('checked', true);
				});
				/////////////////////////////////////////
				// CLEAR-ALL
				/////////////////////////////////////////
				jlightbox.find('.btn_clear').unbind().click(function(){
					jlightbox.find('input[type=checkbox]').prop('checked', false);
				});
				/////////////////////////////////////////
				// CANCEL
				/////////////////////////////////////////
				jlightbox.find('.btn_cancel').unbind().click(function(){
					g_lightbox.close();
				});

				/////////////////////////////////////////
				// SAVE
				/////////////////////////////////////////
				jlightbox.find('.btn_submit').unbind().click(function(){

					// FIND THE SELECTED ARRAY
					var selected_arr = [];
					var dt = jtbl_select.DataTable();
					dt.$("input:checked", {"page": "all"}).each(function(index, elem){	// row collection
						var	jobj = $(elem),
							jtr = jobj.closest('tr')
							row = dt.row( jtr ),
							data = row.data();
							user_id = parseInt(data[data.length - 1])
						;
						selected_arr.push(user_id);
					});

					var jmsg = jparent.find('.td_message');

					if (selected_arr.length != g_pa_required){

						var s = selected_arr.length + ' peer(s) are selected. Please select exactly ' + g_pa_required + ' peer(s).';
						errorDialog(s);

					} else {

						g_lightbox.close();

						openProgress2('Saving...');

						// SAVE THE RESULT TO THE DATABASE
						call_svrop(
							{
								type: 			'save_peerassessors',
								user_id: 		g_user_id,
								act_id: 		g_saved_activity.act_id,
								ass_id: 		g_curr_ass_id,	// if = 0, impression
								selected: 	selected_arr,
							},
							function (obj){
								closeProgress2();

								console.info('save_peerassessors', obj);
								if (!obj.error){

									jmsg.css('color', '');

									// update memory
									g_pa_selected_arr =
									g_usr_panelists.peer_assessors = selected_arr;
									g_pa_selected = selected_arr.length;

									// update interface
									actpage_addUsers(selected_arr, g_pa_jtbl, 0, function(){

										// APPROACH #1
										call_svrop(
											{
												type: 		'get_peerassessees_arr',
												act_id: 	g_saved_activity.act_id,
												user_id: 	g_user_id,
											},
											function (obj){
												console.log('get_peerassessee succeeded', obj);

												// update the back
												updatePeerAssesseesArr(obj.arr);

												// update the front
												updatePanelists(jparent, g_act_panelists, g_usr_panelists, 1, function(){
												//	showRoleTab2(ROLE_PARTICIPANT);
												});
											}
										);
									});
								}
						});
					}
				});
			});
		}
	});

}

//////////////////////////////////////////////

function getMyAssessors(panelists, upanelists, part_id){
	var
		act = g_saved_activity,
		assessors = []
	;
	// 1. coordinator
	if (panelists && panelists.coordinator){
		assessors.push(act.coordinator_id);
	}
	// 2. self
	if (panelists && panelists.self){
		assessors.push(part_id);
	}
	// 3. others
	if (panelists && is_array(panelists.others)){
		for (var i = 0; i < panelists.others.length; i++){
			var user_id = panelists.others[i];
			if (!in_array(user_id, assessors)){
				assessors.push(user_id);
			}
		}
	}
	// 4. peers
	if (panelists){
		if (panelists.peers == 'all' && g_saved_activity){
			var parts = g_saved_activity.participants;
			for (var i = 0; i < parts.length; i++){
				var user_id = parts[i];
				if (!in_array(user_id, assessors)){
					assessors.push(user_id);
				}
			}
		} else if (panelists.peers > 0 && upanelists){
			var peer_assessors = upanelists.peer_assessors;
			if (peer_assessors){
				if (!is_array(peer_assessors)){
					peer_assessors = hash2numArr_val(peer_assessors);
				}
				if (is_array(peer_assessors)){
					for (var i = 0; i < peer_assessors.length; i++){
						var user_id = peer_assessors[i];
						if (!in_array(user_id, assessors)){
							assessors.push(user_id);
						}
					}
				}
			}
		}
	}
	// sort by number
	assessors.sort(sortByNumber);
	return assessors;
}

////////////////////////////////////////////////////////////////////////////////////

function getMyAssessees(panelists, peer_assessees, part_id){
	var
		//part_id = g_user_id
		act = g_saved_activity,
		assessees = []
	;
	if (
			panelists
		&&
			(
				// 1. coordinator
				(panelists.coordinator && part_id == act.coordinator_id)
		||
				// 2. selected assessors
				in_array(part_id, panelists.others)
			)
	){
		// all the activity participants
		assessees = jsonclone(act.participants);
	} else {
		// 3. peers
		if (panelists && panelists.peers){
			assessees = jsonclone(peer_assessees);
		}
		// 4. self
		if (panelists && panelists.self && !in_array(part_id, assessees)){
			assessees.push(part_id);
		}
	}
	assessees.sort(sortByNumber);
	return assessees;
}
