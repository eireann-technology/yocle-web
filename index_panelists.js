
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setupPanelists(selector){
	var jdiv = $(selector);
	var num_of_part = 100;

	// number of peers
	var s = '';
	for (var i = 0; i <= num_of_part; i++){
		s += '<option value="' + (!i?'all':i) + '">' + (!i?'All':i) + '</option>';
	}
	$(selector + ' select.select_num_of_peers')
		.width(60)
		.html(s)
	;

	// peers
	var slidespeed = 500;
	$(selector + ' .cb_peers').change(function(){
		var jobj = $(this), checked = jobj.prop('checked')?1:0,
				jobj2 = jobj.closest('table').find('.div_num_of_peers'),
				jtr = jobj2.parent().parent()
		;
		//console.info('peers', checked, jobj2);
		if (checked){
			jtr.show();
			jobj2.slideDown(slidespeed, function(){
			});
		} else {
			jobj2.slideUp(slidespeed, function(){
				jtr.hide();
			});
		}
	});
	$(selector + ' .cb_others').change(function(){
		var
			jobj = $(this), checked = jobj.prop('checked')?1:0,
			jobj2 = jobj.closest('table').find('.div_assessors'),
			jtr = jobj2.parent().parent()
		;
		//console.info('others', jobj.prop('checked'), jobj2);
		if (checked){
			jtr.show();
				// set correct input width due to wrong width:auto calculation when it is hidden
				var token_input = jdiv.find('.div_assessors').find('.token-input');
				var w = 710;
				token_input.width(w)
			;
			jobj2.slideDown(slidespeed, function(){
			});
			jtr.parent().find('.span_others_num').show();
		} else {
			jobj2.slideUp(slidespeed, function(){
				jtr.hide();
			});
			jtr.parent().find('.span_others_num').hide();
		}
	});

	$(selector + ' [dt_type=users]').attr('dt_num', selector + ' .span_others_num');

	initTypeahead_tokenfield_skills(selector);
	initDT_skills(selector);
	initTypeahead_tokenfield_users(selector);
	initDT_users(selector);

	// clear by default
	clearPanelists(selector);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// output: panelist
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getPanelists(selector){
	var jobj = $(selector);
	var coordinator = jobj.find('.cb_coordinator').prop('checked')?1:0;
	var self = jobj.find('.cb_self').prop('checked')?1:0
	var peers = jobj.find('.cb_peers').prop('checked')?1:0;
	if (peers){
		peers = jobj.find('.select_num_of_peers').val();//.select2('val');
		if (!isNaN(peers)){
			peers = parseInt(peers);
		}
	}
	var others = jobj.find('.cb_others').prop('checked')?1:0;
	if (others){
		others = getUsers(jobj);
	}
	var panelists = {
		coordinator:		coordinator,
		self:						self,
		peers:					peers,
		others:					others,
	};
	return panelists;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function clearPanelists(selector){
	var jdiv = $(selector);

	// INIT CHECKBOXES
	var panelists = jsonclone(template_panelists);
	for (var key in panelists){
		var jobj = jdiv.find('.cb_'+key);
		//$.uniform.update(jobj.prop('checked', panelists[key] ? true : false));
		jobj
			.css({
				'zoom': 1.5,
				'margin-top': 2,
				'margin-left': 2,
			})
			.prop('checked', panelists[key] ? true : false);
	}
	// HIDE CHECKBOXES EXTRA
	jdiv.find('.tr_peers,.tr_others,div_num_of_peers,.div_assessors').hide();

	// RESET SKILL LIST
	clearTokenfield(jdiv.find('.my_tokenfield[tt_type=skills]'), 0);
	jdiv.find('.my_datatable[dt_type=skills]').hide().DataTable().clear().draw();

	// RESET ASSESSORS LIST
	clearTokenfield(jdiv.find('.my_datatable[dt_type=users]'), 0);
	jdiv.find('.my_datatable[dt_type=users]').hide().DataTable().clear();
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// output: panelist
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function setPanelists(jdiv, skills, panelists, onSuccess){

	// CLEAR FIRST
	clearPanelists();

	// SET DATA
	if (typeof(jdiv) == 'string'){
		jdiv = $(jdiv);
	}

	// HAS SKILLS
	if (skills && obj_count(skills) > 0){//skills.length > 0){
		// SETUP GENERIC SKILLS
		var jtbl = jdiv.find('.my_datatable[dt_type=skills]');
		addSkills(skills, jtbl);
	}

	// HAS PANELISTS
	if (panelists){
		// FOR EACH PANELISTS
		g_panelist_arr.forEach(function(name){
			var value = panelists[name];
			if (typeof(value) == "string" && !isNaN(value)){
				value = parseInt(value);
			}
			var jobj = jdiv.find('.cb_' + name);
			var checked = value ? true : false;

			//$.uniform.update(jobj.prop('checked', checked));
			jobj.prop('checked', checked);

			// EXTRA
			switch (name){

				case 'peers':
					var jobj2 = jobj.closest('table').find('.div_num_of_peers'),
							jtr = jobj2.parent().parent()
					;
					if (checked){
						jtr.show();
						jobj2.show();
						jobj2.find('select option[value='+value+']').prop('selected', true);
					}
					break;

				case 'others':
					var jobj2 = jobj.closest('table').find('.div_assessors'),
							jtr = jobj2.parent().parent()
					;
					if (checked){
						jtr.show(); jobj2.show();
						if (typeof(value) == 'object' && value.length > 0){
							// how to add a row of user here? (given that value is an array of user_id)
							var users = value,
								jtbl = jdiv.find('.dataTable[dt_type=users]')
							;
							addUsers(users, jtbl, onSuccess);
							onSuccess = 0;
						}
					}
					break;
			}
		});
		onSuccess && onSuccess();
	}
}

/////////////////////////////////////////////////////////////////////
/*
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

*/
