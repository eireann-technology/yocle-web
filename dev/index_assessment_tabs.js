var
	g_curr_roletab = 0,
	g_curr_ntab = 0,
	ROLE_PARTICIPANT = 1,
	ROLE_ASSESSOR = 2,
	ROLE_COORDINATOR = 3
;

function showRoleTab(tab_index){

	// tab_type
	var tab_type = g_acttab_index == ACTTAB_RATING ? 'impression' : 'assessment';

	g_role_tbl = '';

	// handle the old one
	switch (g_acttab_index){

		case ACTTAB_RATING:
			goBack_impr(0);
			break;

		case ACTTAB_ASSESSMENTS:
			goBack_asst(0);
			break;

		default:
			//showViewActBtnPanel();
			break;
	}
	// div
	var jdiv = $('.div_viewact_' + tab_type);
	jdiv.find('.ass_tab').hide().removeClass('selected', 0);

	tab_index = showRoleTab2(tab_index);

	// tab_name
	var tab_name = '';
	switch (tab_index){

		case ROLE_PARTICIPANT:
			tab_name = 'participant';
			switch (g_acttab_index){
				case ACTTAB_RATING:				viewActImpr_part1();	break;
				case ACTTAB_ASSESSMENTS:	viewActAsst_part1();	break;
			}
			break;

		case ROLE_ASSESSOR:
			tab_name = 'assessor';
			switch (g_acttab_index){
				case ACTTAB_RATING:				viewActImpr_assr1();	break;
				case ACTTAB_ASSESSMENTS:	viewActAsst_assr1();	break;
			}
			break;

		case ROLE_COORDINATOR:
			tab_name = 'coordinator';
			switch (g_acttab_index){
				case ACTTAB_RATING:				viewActImpr_coor1();	break;
				case ACTTAB_ASSESSMENTS:	viewActAsst_coor1();	break;
			}
			break;
	}
	g_curr_role = tab_name;

	console.log('showRoleTab', tab_type, tab_name);

	// show first
	$('#tr_actpage_' + tab_type + '_' + tab_name).show();

	// hide others
	setTimeout(function(){
		var s = '.tr_actpage_' + tab_type + '[id!=tr_actpage_' + tab_type + '_' + tab_name + ']';
		//console.log(s);
		$(s).hide();
	}, 100);

	setTimeout(transdiv_resize, 100);
}

////////////////////////////////////////////////////////

function showRoleTab2(tab_index){
	var tab_type = g_acttab_index == ACTTAB_RATING ? 'impression' : 'assessment';
	var jdiv = $('.div_viewact_' + tab_type);

	// tab_index
	var ntab = 0;
	var uact = getUact(g_saved_activity.act_id);
	if (uact.uact_participant == 1){
		jdiv.find('.ass_tab:nth-child(1)').show();
		ntab++;
	} else if (tab_index == 1){
		tab_index	= 2;
	}
	if (
			(g_acttab_index == ACTTAB_RATING && g_imp_assr)
		||
			(g_acttab_index == ACTTAB_ASSESSMENTS && g_ass_assr)
	){
		jdiv.find('.ass_tab:nth-child(2)').show();
		ntab++;
	} else if (tab_index == 2){
		tab_index	= 3;
	}
	if (uact.uact_coordinator == 1){
		jdiv.find('.ass_tab:nth-child(3)').show();
		ntab++;
	} else if (tab_index == 3){
		tab_index	= 1;
	}
	switch (ntab){
		case 1:
			$('.tbl_ass_tabs').hide();
			break;

		case 2:
			$('.tbl_ass_tabs').show();
			jdiv.find('.ass_tab').css('width', '50%');
			break;

		case 3:
			$('.tbl_ass_tabs').show();
			jdiv.find('.ass_tab').css('width', '33%');
			break;
	}

	g_curr_ntab = ntab;
	g_curr_roletab = tab_index;

	// selected
	jdiv.find('.ass_tab:nth-child(' + tab_index + ')').addClass('selected');

	console.log('showRoleTab2', tab_type, 'ntab=' + ntab);
	return tab_index;
}
