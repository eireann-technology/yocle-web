//////////////////////////////////////////////////////////////////
// Assessor's table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_assr1(jtbl, skills, assessees, markable){
	//console.info('viewActImpr_assr1', skills, assessees);
	//return;
	if (!jtbl.hasClass('dataTable')){
		jtbl.DataTable({
			//ordering: false,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language: {
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				{ targets: [ 0 ],	orderable: false},
				{ targets: [ 1 ], className: 'dt-center'},
				{ targets: [ 2 ],	orderable: false, className: 'dt-center'},
			],
		});
	}
	jtbl.attr('markable', markable?1:0);

	// preparation
	var
		dt_skills = jtbl.show().DataTable().clear().draw(),
		assr_id = g_user_id
	;
	for (var skill_name in skills){
		var
			act_skill = skills[skill_name],
			completed = act_skill.act_assr_completeds[g_user_id],
			nassessees = assessees.length
		;
		if (!completed) completed = 0;

		dt_skills.row.add([
			skill_name,
			'<span class="marks">' + completed + '/' + nassessees + '</span>',
			g_but_plus,
		]);
	}
	dt_skills.draw();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////

var g_curr_skill_name = 0;

function viewActImpr_assr2(skill_name, obj, markable, assessees){
	g_curr_skill_name = skill_name;

	if (g_curr_inline_jtr){
		var
			 skill_name2 = g_curr_inline_jtr.attr('skill_name'),
			 dt_type = g_curr_inline_jtr.closest('table').attr('dt_type')
		;
		if (skill_name2 == skill_name && dt_type == 'impression_assr1'){
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}

	// DEBUGGING
	console.info('viewActImpr_assr2', 'skill_name=' + skill_name, 'markable='+markable);

	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var jtr = $(obj).closest('tr'),
		act_id = g_saved_activity.act_id,
		act_skills = g_saved_activity.impression.skills,
		act_skill = getSkillByName(act_skills, skill_name),
		//participants = g_saved_activity.participants,
		scores = act_skill.act_assr_scores,
		assr_id = g_user_id
	;
	//console.info(jtr);
	var s = '<table class="my_datatable display" dt_type="impression_assr2" style="width:100%;">'
					+ '<thead>'
						+ '<tr>'
							+ '<td>User ID</td>'
							+ '<td>Participants</td>'
							//+ '<td>Date</td>'
							+ '<td>Scores</td>'
							+ '<td>Comments</td>'
						+ '</tr>'
					+ '</thead>'
				+ '</table>'
	;
	jtr.after('<tr skill_name="' + skill_name + '"><td colspan="7" class="td_inline_tbl"><div class="div_assessors" style="display:none">' + s + '</div></td></tr>');
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
			{	targets: '_all',	orderable: false, },
			{ targets: 0,	visible: false, },
		],
	});

	var dt = jtbl.show().DataTable().clear().draw();
	var nassessee = assessees.length;
	for (var i = 0; i < nassessee; i++){
		var	part_id = assessees[i],
			imgusername = getImgUserName(part_id, g_curr_participants),
			pair = assr_id + ',' + part_id,
			markings = scores[pair] ? scores[pair] : 0,
			date = markings.date ? getDateWithoutTime(markings.date) : '',
			score = markings.act_assr_score ? markings.act_assr_score : 0,
			comments = markings.comments ? markings.comments : ''
		;
		if (markable){
			// http://stackoverflow.com/questions/23708090/height-is-increasing-automatically-of-div-with-contenteditable-true
			comments =
			 //'<div class="asspage_open_comments1">'
			//	+ '<div class="asspage_open_comments2">'
					'<div class="asspage_open_comments" contenteditable="true">' + comments + '</div>'
			//	+ '</div>'
			//+ '</div>'
			;
		}
		var arr = [
				part_id,
				imgusername,
				'<!--' + score + '--><div class="star_rating" data-rating="' + score + '" part_id="' + part_id + '"></div>',
				comments
		];
		//console.info(arr);
		dt.row.add(arr);
	}
	dt.draw();
	//jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip

	// HIDE THE TBL
	var jdiv = jtbl.parent();
	jdiv.slideDown();

	// REMEMBER THE ROW
	g_curr_inline_jtr = jtr2;

	// ADD BUTTONS
	if (!markable){
		addCloseButton(jtr2);
	} else {
		jtr2.after(
			'<tr class="tr_buttons_panel"><td colspan="7"><div class="buttons_panel">'
		//	+ '<button class="btn_save btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Save</button> '
			+ '<button class="btn_cancel btn btn-primary"><i class="glyphicon glyphicon-ban-circle"></i> Cancel</button> '
			+ '<button class="btn_submit btn btn-success"><i class="glyphicon glyphicon-ok"></i> Submit</button> '
			+ '<div></td></tr>'
		);
		var jtr3 = jtr2.next();
		jtr3.find('.btn_cancel').click(function(){
			resumeIconPlus();	// resume the icon +
			slideUpParticipantList();
		});
		jtr3.find('.btn_submit').click(function(){
			//slideUpParticipantList();
			//confirmDialog('Are you sure you want to submit the inputs?', function(){
				submitImpression(1, nassessee);
			//});
		});
	}

	// draw star rating
	//setTimeout(function(){
	//	var star_opts = jsonclone(g_star_opts);
	//	star_opts.readOnly = !markable;
	//	jtbl.find('.star_rating').starRating(star_opts);
	//	if (markable){
	//		jtbl.find('.jq-star').css('cursor', 'pointer');
	//	}
	//}, 100);
	setStarRating(jtbl.find('.star_rating'), markable)

}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function submitImpression(bSubmit, nassessee){
	console.info('saveAssessment', 'submit='+bSubmit, 'nassessee='+nassessee);
	var
		act_id = g_saved_activity.act_id,
		assr_id = g_user_id
	;
	var
		jtbl = $('.my_datatable[dt_type=impression_assr2]')
		,dt = jtbl.DataTable()
		,markings = {}
	;
	// gather all the markings
	jtbl.find('>tbody>tr').each(function(){
		var
			jtr = $(this)
			//,row = dt.row(jtr)
			//,cols = row.data()
			//,part_id = parseInt(cols[0])
			,jstar = jtr.find('td:nth-child(2) .star_rating')
			,part_id = parseInt(jstar.attr('part_id'))
			,act_assr_score = jstar.starRating('getRating')
			,comments = jtr.find('td:nth-child(3) div').html()
		;
		markings[part_id] = {
			act_assr_score: act_assr_score,
			comments: comments,
		}
	});

	//slideUpParticipantList();

	//console.info(markings);
	openProgress2();
	call_svrop(
		{
			type: 'submit_impression',
			assr_id: g_user_id,
			skill_name: g_curr_skill_name,
			act_id: act_id,
			ass_id: g_curr_ass_id,
			markings: markings,
			//assr_asst_marks: g_assr_asst_marks,
			//submitted: bSubmit?1:0,
		},
		function (obj){
			console.info('success', obj);

			var
				activity = g_saved_activity,
				skill_name = g_curr_skill_name;
				assr_id = g_user_id,
				act_id = activity.act_id,
				act_skills = activity.impression.skills,
				act_skill = getSkillByName(act_skills, skill_name),
				uact = getUact(act_id);
				usr_skills = uact.impression.skills;
				usr_skill = getSkillByName(usr_skills, skill_name);
			;
			///////////////////////////////////////////
			// UPDATE MEMORY
			///////////////////////////////////////////

			// update all activity scores from server
			for (var part_id in markings){
				var pair = assr_id + ',' + part_id,
					marking = markings[part_id],
					date = obj.server_time,
					score = marking.act_assr_score,
					comments = marking.comments
				;
				// 1. act_assr_score
				if (part_id == g_user_id){
					usr_skill.assessors[assr_id] = {
						usr_assr_score: score,
						date: date,
						comments: comments,
					};
				}

				// 2. act_assr_score
				act_skill.act_assr_scores[pair] = {
					act_assr_score: score,
					date: date,
					comments: comments,
				};
			}

			// 3. act_assr_completed
/*
			var completed = obj.act_assr_completed;
			if (g_curr_inline_jtr){
				var jtr = g_curr_inline_jtr.prev();
				jtr.find('td:nth-child(2)').html(getCompleted(completed));
			}
*/
			if (g_curr_inline_jtr){
				var jtr = g_curr_inline_jtr.prev();
				jtr.find('td:nth-child(2)').html(getCompleted2(obj.act_assr_completed, nassessee));
			}

			// update my score from server
			for (var part_id in obj.scores){
				var scoreobj = obj.scores[part_id];
				if (scoreobj){

					var score = scoreobj.usr_part_score;
					if (typeof(score) != 'undefined'){

						// 4. usr_part_score;
						if (part_id == g_user_id){
							usr_skill.usr_part_score = score;
						}

						// 5. act_part_score
						act_skill.act_part_scores[g_user_id] = score;
					}
					var score = scoreobj.usr_final_score;
					if (typeof(score) != 'undefined'){

						// 6. usr_final_score
						if (part_id == g_user_id){
							if (!g_user.skills[skill_name]){
								g_user.skills[skill_name] = {};
							}
							g_user.skills[skill_name].usr_final_score = score;
						}
					}
				}
			}

			// refresh participants' results if it is visible
			var
				user = getUserByID(activity.participants, g_user_id)
				,iamparticipant = user ? 1: 0
			;
			if (iamparticipant){

				// refresh the results
				var
					jtr = $('#tr_actpage_impression_participant')
					,uact = getUact(activity.act_id)
					,skills = uact.impression ? uact.impression.skills : 0
				;
				viewActImpr_part1(jtr.find('.my_datatable'), skills);

				// refresh profile activity
				//updateUser();
				updateHome();
				updateProfile();
			}

			// change to close button
			//if (!g_multi_marking){
			//	var jtr3 = g_curr_inline_jtr.parent().find('.tr_buttons_panel');
			//	jtr3.remove()
			//	addCloseButton(g_curr_inline_jtr);
			//}

			// show dialog
			closeProgress2();
			//notifyDialog('The marking is submitted.');
			// retrace back
			resumeIconPlus();	// resume the icon +
			slideUpParticipantList();

			// ADD EVENTS
			addImpOnClickEvent();
		},
		function (obj){
			//console.error('saveactivity failed', obj);
		}
	);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function addCloseButton(jtr2){
	jtr2.after('<tr class="tr_buttons_panel"><td colspan="7"><div class="buttons_panel">'
		+ '<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button> '
		+ '<div></td></tr>');
	var jtr3 = jtr2.next();
	jtr3.find('.btn_close').click(function(){
		resumeIconPlus();	// resume the icon +
		slideUpParticipantList();
	});

}
