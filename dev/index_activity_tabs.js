// TABS
////////////////////////////////////////////////////////////////////////////////////////////////////

var
	ACTTAB_INFO = 1,
	ACTTAB_PARTICIPANTS = 2,
	ACTTAB_RATING = 3
	ACTTAB_ASSESSMENTS = 4,
	ACTTAB_RUBRICS = 5,
	ACTTAB_PHOTO = 6
;
var g_acttab_index = 0;

function showActTab(tab_index){

	var tab_type = 'view';
	switch (g_curr_page){
		case PAGE_EDIT_ASS_LIST:
		case PAGE_EDIT_ACT:
		case PAGE_EDIT_ASS:
			tab_type = 'edit';
			break;
	}

	checkUpdateEditAct();

	// find tab_name
	var placeholder = '', tab_name = '';
	switch (tab_index){
		case ACTTAB_INFO:					tab_name = 'information';	break;
		case ACTTAB_PARTICIPANTS:			tab_name = 'participants';	break;
		case ACTTAB_RATING:					tab_name = 'impression';	break;
		case ACTTAB_ASSESSMENTS:			tab_name = 'assessment';	break;
		case ACTTAB_RUBRICS:				tab_name = 'rubrics';		break;
		case ACTTAB_PHOTO:					tab_name = 'media';			break;
	}

	console.log('showActTab', tab_name, tab_index, tab_type);

	// select second tab
	selectSecondTab($('#div_activity_' + tab_type + ' .tbl_act_tabs'), tab_index, placeholder, tab_type == 'edit');
	// hide other divs
	$('.div_' + tab_type + 'act').hide();
	// show the selected div
	$('.div_' + tab_type + 'act_' + tab_name).show();
	// panel
	$('#div_activity_' + tab_type + ' .btn_panel').show();

	g_acttab_index = tab_index;

	// title
	refreshViewActTitle();
	//return;

	setTimeout(function(){

		var roletab = 0;
		switch (tab_index){

			case ACTTAB_INFO:
			case ACTTAB_PARTICIPANTS:
			case ACTTAB_PHOTO:
				g_transdiv_index = 0;
				break;

			case ACTTAB_RATING:
				roletab = ROLE_PARTICIPANT;
				break;
		}


		// buttons
		switch (tab_type){

			case 'edit':
				switch (tab_index){
					case ACTTAB_ASSESSMENTS:
						$('.div_' + tab_type + 'act_asslist').show();
						$('.div_' + tab_type + 'act_assedit').hide();
						setCurrPage(PAGE_EDIT_ASS_LIST);
						break;

					case ACTTAB_RUBRICS:
						var act = getEditActivity();
						if (act){
							refreshEditActRubrics(act.assessment.assessments);
						}
						break;
				}
				break;

			case 'view':
				switch (tab_index){
					case ACTTAB_INFO:
						checkOnResize();
						break;

					case ACTTAB_ASSESSMENTS:
						roletab = ROLE_PARTICIPANT;
						setCurrPage(PAGE_VIEW_ASS_LIST);
						break;

					case ACTTAB_RUBRICS:
						break;
				}
				break;

		}

		// show the tab
		if (roletab){
			var uact = getUact(g_saved_activity.act_id);
			if (uact.uact_coordinator){
				roletab = ROLE_COORDINATOR;
			} else if (uact.uact_assessor){
				roletab = ROLE_ASSESSOR;
			} else {
				roletab = ROLE_PARTICIPANT;
			}
			showRoleTab(roletab);
		}
		showActBtnPanel();
	}, 10)
}

////////////////////////////////////////////////////////////////////////////////////////
// for second level tabs

function selectSecondTab(jtbl, tab_index, placeholder, bEditAct){
	console.log('selectSecondTab', tab_index);

	if (bEditAct){
		jtbl.find('.tbl_tab_bar td').css('display', 'table-cell');

	} else if (g_curr_page == PAGE_VIEW_ACT && g_saved_activity){

		// check impression
		jtbl.find('.tbl_tab_bar td:nth-child(3)').css('display', g_saved_activity.impression.weight ? 'table-cell' : 'none');
		// check assessment
		jtbl.find('.tbl_tab_bar td:nth-child(4)').css('display', g_saved_activity.assessment.weight ? 'table-cell' : 'none');
	}

	// placeholder
	jtbl.find('.inp_second_filter').attr('placeholder', placeholder ? placeholder : '');

	// select tab
	jtbl.find('.div_second_tab').removeClass('selected', 50);
	jtbl.find('.div_second_tab').eq(tab_index - 1).addClass('selected', 100);

}

////////////////////////////////////////////////////////////////////////////////////////

function refreshViewActTitle(){
	$('.viewact_title').html(getActTitle(g_saved_activity));
}
