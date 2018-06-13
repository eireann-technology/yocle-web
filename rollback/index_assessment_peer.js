////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// setpeerassessment2:
// using datatable, double featherlight
// https://editor.datatables.net/examples/api/checkbox.html
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//var g_lightbox2 = 0;

function initPeerAssessment(){

}

function setPeerAssessment2(jparent, ass_panelists, user_panelists, bEditable, act_id, ass_id){
	console.info('setPeerAssessment2');
	//console.info(panelists);
	var
		activity = g_saved_activity
		,participants = g_curr_participants
	;
	
	// FIND NUM OF REQUIRED PEER ASSESSORS
	var required = 0;
	if (ass_panelists.peers != 0){
		required = parseInt(ass_panelists.peers);
		if (required > participants.length){
			// NO MORE THAN THAT OF PARTICIPANTS
			required = participants.length;
		}
	}
	// FIND NUM OF SELECTED ASSESSORS
	var selected = user_panelists && user_panelists.peer_assessors ? user_panelists.peer_assessors.length : 0;
	
	// testing
	// panelists.peer_assessors = [2,3,4];
	// required = 1;	selected = 0; // testing only
	
	//console.info('required='+required, 'selected='+selected);
	jparent.attr('required', required);
	jparent.attr('selected', selected);
	if (!required || (!bEditable && !selected)){
		jparent.hide();			// no Peer Assessors with message
		jparent.next().hide();	// no primary assessors subheader
		return;					// !!! no need to continue
	}

	////////////////////////////////////////////////////////////////////
	// THE MESSAGE (THERE IS REQUIRED PEER ASSESSORS)
	////////////////////////////////////////////////////////////////////
	// SHOW PEER ASSESSORS
	jparent.show();			// Peer Assessors with message
	//jparent.next().show();	// show primary assessors subheader
		
	// SET THE TEMPLATE
	jparent.empty();
	jparent.append($('#div_peer_assessment2').html());

	// SET THE MESSAGE
	jparent.find('.span_participants').text(participants.length);
	jparent.find('.span_peers').text(required);
	// TO SHOW IT IN RED?
	var jmsg = jparent.find('.td_message');
	if (!bEditable){
		jmsg.hide();
	} else if (selected != required){
		jmsg.show().css('color', 'red');
	} else {
		jmsg.show().css('color', '');
	}
	
	/////////////////////////////////////////////////////////////////
	// DATATABLE FOR SELECTED ASSESSORS (SHOW ONLY IF THERE IS ANY)
	/////////////////////////////////////////////////////////////////
	var jtbl = jparent.find('.my_datatable').hide();
	if (user_panelists && user_panelists.peer_assessors){
		actpage_addUsers(user_panelists.peer_assessors, jtbl, 0, function(users){
			jtbl.show();
		});
	}	
	
	
	/////////////////////////////////////////////////////////////////
	// PREPARE THE SELECT BUTTON
	/////////////////////////////////////////////////////////////////
	var jbutton = jparent.find('button');
	if (!bEditable){
		jbutton.hide();
	}	
	jbutton.unbind().click(function(){
		// CONSTRUCT THE POPUP TABLE
		console.info('select peer assessors');

		// unselected (participants) = participants - panelists
		var primary_assessors = getPrimaryAssessors(activity.coordinator_id, g_user_id, ass_panelists, 0);
		var unselected = [];

		// loop for each participant
		for (var i in participants){
			var
				participant = participants[i],
				user_id = participant.user_id
				bFound = 0;
			;
			// check if it is already in panelist
			for (var j in primary_assessors){
				var
					my_panelist = primary_assessors[j],
					user_id2 = my_panelist.user_id
				;
				if (user_id2 == user_id){
					bFound = 1;
					break;
				}
			}
			if (!bFound){
				unselected.push(user_id);
			}
		}

		var jdiv2 = $('<div/>');
		jdiv2.append($('#div_peer_assessment3').html());
		jdiv2.find('.span_participants').text(participants.length);
		jdiv2.find('.span_peers').text(required);

		// ***TO BE TESTED AND REPLACED BY BODYVIEW				
		g_lightbox = $.featherlight(jdiv2, {
			afterClose: function(){
				return false;
			},
			afterContent: function(){

				// LIGHTBOX
				var jdiv3 = this.$content;

				// FIND THE SELECTED OBJ
				var selected = {};
				if (user_panelists.peer_assessors){
					for (var i in user_panelists.peer_assessors){
						var user_id = user_panelists.peer_assessors[i];
						selected[user_id] = 1;
					}
				}

				// BUILD UP THE SECOND POPUP TABLE
				var jtbl3 = jdiv3.find('.my_datatable').css('visibility', 'hidden');
				actpage_addUsers(unselected, jtbl3, selected, function(users){

					console.info('add peer assessors');
					jtbl3.css('visibility', 'visible');
					jtbl3.find('input[type=checkbox]').css('zoom', 1.5);
					// BUTTONS
					jdiv3.find('.btn_selectall').click(function(){
						jdiv3.find('input[type=checkbox]').prop('checked', true);
					});
					jdiv3.find('.btn_clear').click(function(){
						jdiv3.find('input[type=checkbox]').prop('checked', false);
					});
					jdiv3.find('.btn_cancel').click(function(){
						g_lightbox.close();
					});
					jdiv3.find('.btn_submit').click(function(){
						// FIND THE SELECTED ARRAY
						var selected = [];
						var dt = jtbl3.DataTable();
						dt.$("input:checked", {"page": "all"}).each(function(index, elem){	// row collection
							var	jobj = $(elem),
								jtr = jobj.closest('tr')
								row = dt.row( jtr ),
								data = row.data();
								user_id = parseInt(data[data.length - 1])
							;
							selected.push(user_id);
						});
						if (selected.length != required){
							
							// TURN THE MESSAGE TO BE RED
							jmsg.css('color', 'red');
							jdiv3.find('.div_error_msg').html(selected.length + ' selected. Please select exactly ' + required + '.');
							
								
						} else {
							
							// TURN THE MESSAGE TO BE BLACK
							jmsg.css('color', '');
							
							// HANDLE THE SELECTED ARRAY
							user_panelists.peer_assessors = selected;
							if (!user_panelists.peer_assessors){
								jtbl.hide();
							} else {
								jtbl.show();
								// PUT THE FINISH ARRAY BACK TO THE FIRST TABLE
								actpage_addUsers(user_panelists.peer_assessors, jtbl, 0, function(users){
									g_lightbox.close();
									// SAVE THE RESULT TO THE DATABASE
									call_svrop(
										{
											type: 'save_peerassessors',
											user_id: g_user_id,
											act_id: act_id,
											ass_id: ass_id,	// if=0, impression
											selected: selected,
										},
										function (obj){
											console.info(obj);
										}
									)
								});
							}
						}
					});
				});
			},
		});

	});

}
