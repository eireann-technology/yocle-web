var
	g_but_right = '<div class="div_but_special"><i class="glyphicon glyphicon-chevron-right"></i></div>',
	g_but_plus = '<div class="div_but_special"><i class="glyphicon glyphicon-plus"></i></div>',
	g_but_view_act = '<button type="button" class="btn btn-primary btn-list-view" onclick="viewActivity(getActIdFromRow(this))" data-toggle="tooltip" title="View"><i class="glyphicon glyphicon-eye-open"></i> View</button>',
	g_but_edit_act = '<button type="button" class="btn btn-primary btn-list-edit" onclick="editActivity(getActIdFromRow(this))" data-toggle="tooltip" title="Edit"><i class="glyphicon glyphicon-edit"></i> Edit</button>',
	color_unpublished = '#CCFFFF', color_pending='#FFFFDD', color_opening='#FFDDFF', color_closed='#EEEEEE'
;

function initListAct(){
	console.info('initListAct');
	$('#tbl_act_legend td:nth-child(2)').css('background-color', color_unpublished);
	$('#tbl_act_legend td:nth-child(3)').css('background-color', color_opening);
	$('#tbl_act_legend td:nth-child(4)').css('background-color', color_pending);
	$('#tbl_act_legend td:nth-child(5)').css('background-color', color_closed);
}

///////////////////////////////////////////////////////////////

var g_init_actlist = 0;

function openActivityList2(){

	console.info('openActivityList2');

	changeBodyView(TAB_ACTIVITY);
}

///////////////////////////////////////////////////////////////

function openActivityList3(){
	g_init_actlist = 1;
	g_curr_user = 0;

	//closeLightBox();
	$('#inp_topmenu_search').val('');

	setSavedAct(0);

	var jtbl = $('#dt_activity_list'), dt = jtbl.DataTable();

	// EMPTY THE ACTIVITY
	dt.clear().draw();

	$('#div_activity_list, #dt_activity_list').show();

	// LOAD THE ACTIVITES
	var arr = g_user.profile.activity;
	for (var i = 0; i < arr.length; i++){
		var
			activity = arr[i],
			act_id = activity.act_id,
			timestage = getTimeStage(activity.start, activity.end),
			title = activity.title,
			act_type = activity.act_type,
			start = getDateWithoutTime(activity.start),
			end = getDateWithoutTime(activity.end),
			uact = getUact(act_id),
			uact_role = getHighestUactRole(uact),			// get only the most important one
			act_status = getActStatus(uact, 1),	// 1=include dt order comment
			action = activity.published ? 'View' : 'Edit',
			icon = activity.published ? 'eye-open' : 'edit'
		;

		// dummy filters
		//if (activity.dummy == 1) continue;	// all dummies no display
		if (g_user_id > 10 && activity.dummy == 1) continue;	// only some show dummies

		var status = act_status.desc,
				status1 = status.split('-->')[0] + '-->',
				status2 = status.split('-->')[1],
				title2 = title + 
					' <span class="act_title_details">(' + getActType(activity) + ', ' +
				 	uact_role + ', ' + status2 + ')</span>'
		;
		if (!activity.published){
			title2 = '<i>' + title2 + '</i>';	// add italic if not published
		}
		title2 = status1 + ' <span class="act_title">' + getImgActTitle(activity, title2) + '</span>'
		var arr2 = [
			title2,
			g_but_right,
			act_id
		];
		dt.row.add(arr2)
	}

	// DESTROY FOR RESPONSIVE
	dt.destroy(false);

	// DRAW FOR RESPONSIVE
	var dt_opts = {
		bPaginate: false,	// show all the rows in one page
		//responsive: true,
		order: [[ 0, "asc" ]],
		dom: '',
		language:{
			emptyTable: '',
			zeroRecords: '',
		},
		autoWidth: false,
		columnDefs: [
			{ targets: '_all', orderable: false, },
			{	targets: -1,	visible: false,	searchable: false,},
			{	targets: 0,	type: 'string',	},
		],
	};
	dt = jtbl.addClass('nowrap').DataTable(dt_opts);

	if (g_platform == 'android'){
		jtbl.addClass('android')
	}
	// alter the whitespace state
	jtbl
		.find('>tbody>tr>td:first-child')
		.css('white-space', 'normal')
	;

	// CLICK TO OPEN PAGE
	$('#dt_activity_list>tbody>tr>td').click(function(e){
		e.stopPropagation();
		var
			row = dt.row(this),
			cols = row.data(),
			ncol = cols.length
			act_id = parseInt(cols[ncol-1])	// a hidden one
		;
		viewActivity(act_id);
	});

	// search bar
	var jsearch = $('#inp_search_activity');
	jsearch.on('keyup', function (){
		dt.search( this.value ).draw();
	});
	if (jsearch.val() != ''){
		dt.search( jsearch.val() ).draw();
	}
}
