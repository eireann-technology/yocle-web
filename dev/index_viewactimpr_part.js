///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Impression for participants
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_part1(jtbl, skills){
	//console.info('viewActImpr_part1', skills);

	// show assessors
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
				{	targets: '_all',	orderable: false},
				{ targets: [ 1 ], type: 'string', className: 'dt-center'},
				{ targets: [ 2 ], orderable: false, className: 'dt-center'},
			],
		});
	}
	var
		act_id = g_saved_activity.act_id,
		uact = getUact(act_id),
		usr_skills = uact.impression.skills
	;

	// skills
	var dt_skills = jtbl.show().DataTable().clear().draw();
	for (var skill_name in skills){
		var
			usr_skill = getSkillByName(usr_skills, skill_name),
			usr_part_score = usr_skill.usr_part_score
		;
		dt_skills.row.add([
			skill_name,
			'<!--' + usr_part_score  + '--><div class="star_rating" data-rating="' + usr_part_score + '"></div>',
			g_but_plus,
		]);
	}
	dt_skills.draw();

	// draw star rating
	//var star_opts = jsonclone(g_star_opts);
	//setTimeout(function(){
	//	jtbl.find('.star_rating').starRating(star_opts);
	//}, 100);
	setStarRating(jtbl.find('.star_rating'), 0);
}


//////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_part2(skill_name, obj){

	if (g_curr_inline_jtr){
		var
			 skill_name2 = g_curr_inline_jtr.attr('skill_name'),
			 dt_type = g_curr_inline_jtr.closest('table').attr('dt_type')
		;
		if (skill_name2 == skill_name && dt_type == 'impression_part1'){
			resumeIconPlus();	// resume the icon +
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}

	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var
		act_id = g_saved_activity.act_id,
		uact = getUact(act_id),
		usr_skills = uact.impression.skills,
		usr_skill = getSkillByName(usr_skills, skill_name),
		assessors = usr_skill.assessors,
		nassessors = obj_count(assessors),
		assessors2 = hash2numArr_key(assessors)
	;
	if (nassessors){

		// DEBUGGING
		console.info('viewActImpr_part2', 'skill_name=' + skill_name);

		var jtr = $(obj).closest('tr');
		//console.info(jtr);
		var s = '<table class="my_datatable display" dt_type="impression_part2" style="width:100%">'
						+ '<thead>'
							+ '<tr>'
								+ '<td>User ID</td>'
								+ '<td>Assessors</td>'
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
				{ targets: '_all', orderable: false, },
				{	targets: 0,	visible: false, },
			],

		});
		var dt = jtbl.show().DataTable().clear().draw();
		for (var assr_id in assessors){
			var assessor = assessors[assr_id],
				imgusername = getImgUserName(assr_id, g_curr_impression_assessors),
				usr_assr_score = assessor.usr_assr_score,
				date = assessor.date ? getDateWithoutTime(assessor.date) : '',
				comments = assessor.comments ? assessor.comments : ''
			;
			var arr = [
					assr_id,
					imgusername,
					'<!--' + usr_assr_score + '--><div class="star_rating" data-rating="' + usr_assr_score + '"></div>',
					'<span style="color:red">' + comments + "</span>",
			];
			dt.row.add(arr);
		}
		dt.draw();

		// SHOW THE TBL
		var jdiv = jtbl.parent();
		jdiv.slideDown();

		// REMEMBER THE ROW
		g_curr_inline_jtr = jtr2;

		// DRAW STAR RATING
		//var star_opts = jsonclone(g_star_opts);
		//setTimeout(function(){
		//	jtbl.find('.star_rating').starRating(star_opts);
		//}, 100);
		setStarRating(jtbl.find('.star_rating'), 0);

		// ADD BUTTONS PANEL
		jtr2.after('<tr class="tr_buttons_panel"><td colspan="7"><div class="buttons_panel">'
			+ '<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button> '
			+ '<div></td></tr>');

		var jtr3 = jtr2.next();
		jtr3.find('.btn_close').click(function(){
			resumeIconPlus();	// resume the icon +
			slideUpParticipantList();
		});

		//jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	}
}
