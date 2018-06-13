
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
	
	// checkboxes
	//$(selector + ' input[type=checkbox]').uniform();	// http://opensource.audith.org/uniform/
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
				//var w = token_input.parent().parent().outerWidth() - 13;	// getting outerWidth must after show, 743
				//console.info(token_input, w);
				var w = 710;
				token_input.width(w)
			;
			jobj2.slideDown(slidespeed, function(){
			});
		} else {
			jobj2.slideUp(slidespeed, function(){
				jtr.hide();
			});
		}
	});
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
	if (skills && getObjCount(skills) > 0){//skills.length > 0){
		// SETUP GENERIC SKILLS
		var jtbl = jdiv.find('.my_datatable[dt_type=skills]');
		addSkills(skills, jtbl);
	}
	
	// HAS PANELISTS
	if (panelists){
		// FOR EACH PANELISTS
		//for (var key in panelists){	// i.e. coordinator, self, peer and others
			//var value = panelists[key];
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
