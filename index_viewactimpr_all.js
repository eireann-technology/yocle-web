
/////////////////////////////////////////////////////////////////////////////////////////////////////
var
	g_imp_part = 0,
	g_imp_coor = 0,
	g_imp_assr = 0,
	g_role_tbl = '',
	g_curr_part_jtd = 0
;

function viewActImpr_all(){
	var
		activity = g_saved_activity,
		uact = g_saved_uact,
		act_id = activity.act_id
	;

	if (!activity.impression || activity.impression.enabled == '0'){
		$('#tr_actpage_impression').hide();

	} else {
		$('#tr_actpage_impression').show();

		// load assessor information
		var
			jtr = $('#tr_actpage_assessment_assessor'),
			jtbl = $('#div_activity_view [dt_type=actpage_impression_assessors]'),
			imp_panelists = activity.impression ? activity.impression.panelists : [],
			uimp = uact.impression ? uact.impression : 0,
			uimp_panelists = uimp ? uimp.panelists : [],
			uskills = uimp.skills,
			coor_id = activity.coordinator_id
		;
		// SHOW THE TABLE FIRST
		jtbl.show();

		// FIND THE ASSESSEES
		g_imp_assessees = [];
		g_imp_part = getUserByID(g_saved_parts, g_user_id) ? 1 : 0;
		g_imp_coor = coor_id == g_user_id ? 1 : 0;
		g_imp_assr = 0;

/*
		// who are my assessess
		if (amIPrimaryAssr(activity.coordinator_id, imp_panelists)){
			// case 1: i am coordinator or selected assessors
			g_imp_assessees = jsonclone(activity.participants);
			g_imp_assr = 1;
		}
		if (g_peerassessees_imp_iamassr){
			g_imp_assessees = jsonclone(getMyPeerAssessees(0));
			g_imp_assr = 1;
		}

		// gather assessors from scores and comments
		var primary_assrs = getMyAssessors(
			activity.coordinator_id,
			g_user_id,
			imp_panelists,
			uimp_panelists
		);
*/
		// find assessees
		g_imp_assessees = getMyAssessees(imp_panelists, getMyPeerAssessees(0), g_user_id);
		if (g_imp_assessees.length){
			g_imp_assr = 1;
		}

		// find assessors
		var primary_assessors = getMyAssessors(imp_panelists, uimp_panelists, g_user_id);

		// find assessor from the skills (no need?)
		var hash_assessors = num2hashArr(primary_assessors);
		if (uact && uact.impression && uskills){
			for (var skill_name in uskills){
				var skill = uskills[skill_name];
				for (var assr_id in skill.assessors){
					hash_assessors[assr_id] = 1;
				}
			}
			primary_assessors = hash2numArr_key(hash_assessors);
		}
		//console.log('***viewActImpr_all', primary_assrs); return;

		/////////////////////////////////////////////////////////////////////////////
		// SHOW ALL THE ASSESSORS TO THE VISIBLE LIST (WITH EXPANSION)
		/////////////////////////////////////////////////////////////////////////////
		actpage_addUsers(primary_assessors, jtbl, 0, function(users){
			// SET AS GLOBAL
			g_impr_assrs = users;
		});

	}
	showActBtnPanel();
}

/////////////////////////////////////////////////////
// onclick of the tds
/////////////////////////////////////////////////////

function addImpOnClickEvent(){

	$('#tbl_actpage_impression .my_datatable>tbody>tr>td').unbind().click(function(e){
		var
			jtr = $(this).closest('tr');
			user_id = jtr.find('.imgusername').attr('user_id');
			jtd1 = jtr.find('>td:first-child')
			jtbl = jtd1.closest('table'),
			dt_type = jtbl.attr('dt_type'),
			role = dt_type.split('_')[1]
		;

		console.log(role);

		switch (role){

			case 'assr1':
				g_curr_part_jtd = jtr.find('>td:nth-child(2)');
				viewActImpr_assr2(user_id);
				role = 'assr2';
				break;

			case 'part1':
				var skill_name = jtd1.text();
				viewActImpr_part2(skill_name, jtd1);
				role = 'part2';
				break;

			case 'coor1':
				viewActImpr_coor2(user_id);
				role = 'coor2';
				break;
		}
		g_role_tbl = role;

		$('#tr_actpage_impression_primary_assessors').hide();

		showActBtnPanel();

	});
}

//////////////////////////////////////////////////////////////////////////////////////

function goBack_impr(new_index){
	var
		jdiv = $('.div_viewimpr_' + g_curr_role),
		jdiv2 = jdiv.closest(' .div_transdiv'),
		index = parseInt(jdiv2.attr('transdiv_index'))
	;
	if (typeof(new_index) == 'undefined' && !isNaN(index)){
		new_index = index - 1;
	}
	if (new_index < 0){
		new_index = 0;
	}

	if (!new_index){
		$('#tr_actpage_impression_primary_assessors').show();
		$('#div_viewact_btn_panel .assr_panel').hide();
		g_role_tbl = '';
	}

	//console.log('goBack_impr', g_curr_role, g_curr_roletab, new_index);
	transdiv(jdiv2, new_index);

	showActBtnPanel();

	scrollNow(g_scrolltop_arr2[new_index+1]);	
}
