///////////////////////////////////////////////////////////////////////////////////////////////////////////

var
	g_saved_assessment_view = 0,
	g_assr_asst_marks = 0,
	g_curr_assessment_assessors = 0;

function viewActAsst_all(activity, uact, ass_peer_assessees){

	if (!activity.assessment || activity.assessment.enabled == '0'){

		$('#tr_actpage_assessment').hide();
	
	} else {

		console.debug('viewActAsst_all peer_assessees', ass_peer_assessees);
		
		// check for weightings
		var arr = [], total = 0;
		var assts = activity.assessment.assessments
		for (var i = 0; i < assts.length; i++){
			var asst = assts[i];
			var weight = asst.weight;
			if (typeof(weight) != 'undefined' && !isNaN(weight)){
				arr.push(weight);
				total += parseInt(weight);
			}
		}
		// put evenly weights to the assessment (for display purpose only)
		if (arr.length != assts.length || total != 100){
			arr = getEvenWeightings(assts.length);
			for (var i = 0; i < assts.length; i++){
				assts[i].weight = arr[i];
			}
		}		

		$('#tr_actpage_assessment').show();
		
		// am i the coordinator?
		var jtr = $('#tr_actpage_assessment_coordinator');
		if (uact.uact_coordinator == 1){
			jtr.show();
			var jtbl = jtr.find('.my_datatable[dt_type=assessment_coor1]');
			//console.error('jtbl', jtbl);
			viewActAsst_coor1(jtbl, activity.assessment.assessments);
		} else {
			jtr.hide();
		}

		var activity = g_saved_activity,
			act_id = activity.act_id,
			participants = activity.participants
		;
		
		// FIND THE ASSESSEES
		var jtr = $('#tr_actpage_assessment_assessor');
/*		
		var assessees = [];
		if (uact.uact_assessor == 1){
			// assess all participants 
			assessees = jsonclone(participants);
		} else if (getObjCount(peer_assessees)){
			assessees = jsonclone(peer_assessees);
		}
		
		// AM I ASSESSOR?
		var nassessees = getObjCount(assessees);
*/
		var amiassessor = 0;
		for (var i in activity.assessment.assessments){
			var assessment = activity.assessment.assessments[i];
			if (amIAssessor(assessment, activity, ass_peer_assessees)){
				amiassessor = 1;
				break;
			}
		}
		if (amiassessor){
			jtr.show();
			var jtbl = jtr.find('.my_datatable[dt_type=assessment_assr1]');
			viewActAsst_assr1(jtbl, activity, ass_peer_assessees);
		} else {
			jtr.hide();
		}
		
		// am i one of the participant?
		var jtr = $('#tr_actpage_assessment_participant');
		if (uact.uact_participant == 1){
			jtr.show();
			var jtbl = jtr.find('.my_datatable[dt_type=assessment_part1]');
			viewActAsst_part1(jtbl, activity.assessment.assessments, uact);
		} else {
			jtr.hide();
		}
	}

	// click to view
	var jtds = $('#tr_actpage_assessment .my_datatable>tbody>tr>td:first-child');
	jtds.unbind().click(function(e){
		e.stopPropagation();	// stop from escalating
		var jtbl = $(this).closest('table');
			dt_type = jtbl.attr('dt_type'),
			role = dt_type.split('_')[1]	// .substring(0, 4),
			jtd1 = $(this).parent().find('td:first-child'),
			jtd2 = $(this).parent().find('td:last-child'),
			ass_id = parseInt(jtd1.html().split('-->')[0].split('<!--')[1])
		;
		console.debug('onclick1', role, ass_id);
		switch (role){
			case 'coor1':
			case 'assr1':		viewAssessment(ass_id, 'previewing', 0, ''); break;
			case 'part1':		viewAssessment(ass_id, 'participant', g_user_id, g_user.username); break;
		}
	});
	
	// click to mark
	var jtds = $('#tr_actpage_assessment .my_datatable>tbody>tr>td:last-child');
	jtds.unbind().click(function(e){
		e.stopPropagation();	// stop from escalating
		
		var bExpanded = checkExpanded($(this));
		
		var jtbl = $(this).closest('table');
			dt_type = jtbl.attr('dt_type'),
			jtd1 = $(this).parent().find('td:first-child'),
			jtd2 = $(this).parent().find('td:last-child'),
			ass_id = parseInt(jtd1.html().split('-->')[0].split('<!--')[1]),
			role = dt_type.split('_')[1]	// .substring(0, 4),
		;
		// call the action
		console.debug('onclick2', role, ass_id);
		switch (role){
			case 'coor1':		viewActAsst_coor2(ass_id, jtd2);	break;
			case 'assr1':		viewActAsst_assr2(ass_id, jtd2, ass_peer_assessees);	break;
			case 'part1':		viewAssessment(ass_id, 'participant', g_user_id, g_user.username); break;
		}
		
		// switch icon +/-
		switch (role){
			case 'coor1':	case 'assr1'://	case 'part1':
				var jdiv = jtd2.find('.div_but_special i');
				if (jdiv.length){
					var jdiv = jtd2.find('.div_but_special i');
					if (!bExpanded){
						setGlyphicon(jdiv, 'minus');
					} else {
						setGlyphicon(jdiv, 'plus');
					}
				}
				break;
		}
		
	});
	
}

/////////////////////////////////////////////////////////////////////////////////////////////
/*
	"panelists" : {
		"coordinator" : 1,
		"self" : 0,
		"peers" : 0,
		"others" : 0
	},
	peer_assessees = ass_peer_assessees[ass_id]
*/

function amIAssessor(assessment, activity, ass_peer_assessees){
	var assessors = getAssAssessors(assessment, activity, ass_peer_assessees);
	var amiassessor = assessors[g_user_id] ? 1 : 0;
	return amiassessor;
}

function getAssAssessors(assessment, activity, ass_peer_assessees){

	var assessors = {};
	var ass_id = assessment.ass_id;
	var panelists = assessment.panelists;
	if (panelists.coordinator){
		assessors[activity.coordinator_id] = 1;
	}
	if (panelists.self){
		assessors[g_user_id] = 1;
	}
	if (panelists.others && panelists.others.length){
		for (var i in panelists.others){
			var user_id = panelists.others[i];
			assessors[user_id] = 1;
		}
	}
	if (panelists.peers && ass_peer_assessees && ass_peer_assessees[ass_id]){
		var peer_assessees = ass_peer_assessees[ass_id];
		if (peer_assessees && peer_assessees.length > 0){
			assessors[g_user_id] = 1;
		}
	}
	return assessors;
}

/////////////////////////////////////////////////////////////////////////////////////////////

function openAssessees_assessment(ass_id, obj){

	if (g_curr_inline_jtr){
		var ass_id2 = g_curr_inline_jtr.attr('ass_id');
		if (ass_id2 == ass_id){
			slideUpParticipantList();		
			return;
		} else {
			removeParticipantList();
		}
	}

	var
		act_id = g_saved_activity.act_id,
		index = ass_id - 1
	;
	// DEBUGGING
	console.info('openAssessees_assessment', 'act_id='+act_id, 'ass_id='+ass_id, obj);

	// ADD ASSESSEES
	var uass = getUserAssessment(g_user, act_id, ass_id);	
	var participants = uass.participants;
	if (!participants){
		console.error('no participants');
		return;
	}

	var jtr = $(obj).parent().parent();
	//console.info(jtr);
	var s = '<table class="my_datatable display nowrap" style="width:100%">'
					+ '<thead>'
						+ '<tr>'
							+ '<td>User ID</td>'
							+ '<td>Participant</td>'
							+ '<td>Performed</td>'
							+ '<td>Marked</td>'
							+ '<td>&nbsp;</td>'
						+ '</tr>'
					+ '</thead>'
				+ '</table>'
	;
	jtr.after('<tr act_id="' + act_id + '" ass_id="' + ass_id + '"><td colspan="10"></div><div class="div_assessors" style="display:none">' + s + '</div></td></tr>');
	var jtr2 = jtr.next();
	var jtbl = jtr2.find('.my_datatable');
	jtbl.DataTable({
		//ordering: false,	// otherwise, the list is difficult to trace
		rowReorder: true,
		autoWidth: false,
		bPaginate: false,
		dom: '',
		language:{
			emptyTable: '',
			zeroRecords: '',
		},
		columnDefs: [
			{	targets: [ 0 ],	orderable: false,	visible: false, },
			{	targets: [ 4 ],	orderable: false},
		],
	});
	var dt = jtbl.show().DataTable().clear().draw();
	for (var i = 0; i < participants.length; i++){
		var user = participants[i],
			user_id = user.user_id ? user.user_id : 0,
			imgusername = getImgUserName(user),
			button = !user.performed ? '' : user.marked ? g_but_review_assessee : g_but_mark_assessee,
			arr = [
				user_id,
				imgusername,
				user.performed,
				user.marked,
				button
		];
		//console.info(arr);
		dt
			.row
			.add(arr);
	}
	dt.draw();
	if (g_platform != 'ios' && g_platform != 'android'){
		jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	}

	// HIDE THE TBL
	var jdiv = jtbl.parent();
	jdiv.slideDown();

	// REMEMBER THE ROW
	g_curr_inline_jtr = jtr2;
	
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function slideUpParticipantList(){
	//console.debug('slideUpParticipantList', g_curr_inline_jtr);
	if (g_curr_inline_jtr){
		var jtr = g_curr_inline_jtr.prev();
		// retract the list
		var jdiv = g_curr_inline_jtr.find('div').eq(0);
		jdiv.slideUp('', function(){
			removeParticipantList();
		});
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function removeParticipantList(){
	if (g_curr_inline_jtr){
		var jtr = g_curr_inline_jtr.next();
		if (jtr.hasClass('tr_buttons_panel')){
		 jtr.remove();
		}
		g_curr_inline_jtr.remove();
		g_curr_inline_jtr = 0;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

// http://stackoverflow.com/questions/2644299/jquery-removeclass-wildcard
 $.fn.removeClassStartingWith = function (filter) {
	$(this).removeClass(function (index, className) {
		return (className.match(new RegExp("\\S*" + filter + "\\S*", 'g')) || []).join(' ')
	});
	return this;
};

//////////////////////////////////////////////////////////////////////////////////////////////////

function setGlyphicon(jdiv, name){
	jdiv.removeClassStartingWith('glyphicon-');
	jdiv.addClass('glyphicon-' + name);
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function resumeIconPlus(){
	if (g_curr_inline_jtr){
		var jdiv = g_curr_inline_jtr.prev().find('.div_but_special i');
		setGlyphicon(jdiv, 'plus');
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function checkExpanded(jobj){
	var sametable = g_curr_inline_jtr && g_curr_inline_jtr.closest('table').find(jobj).length > 0;
	var sameindex = g_curr_inline_jtr && jobj.closest('tr').next().index() == g_curr_inline_jtr.index();
	var out = sametable && sameindex ?1:0;
	console.debug('checkExpanded', sametable, sameindex, out);
	return out;
}