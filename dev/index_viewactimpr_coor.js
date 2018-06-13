///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coordinator's table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_coor1(jtbl, skills){

	//console.info('viewActImpr_coor1', jtbl, skills);
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
				{	targets: [ 0 ],	orderable: false},
				//{ targets: [ 1 ], className: 'dt-center'},
				{ targets: [ 1 ],	orderable: false, className: 'dt-center'},
			],
		});
	}
	// mark or view
	var dt_skills = jtbl.show().DataTable().clear().draw();
	for (var skill_name in skills){
		var skill = skills[skill_name];
		dt_skills.row.add([
			skill_name,
			g_but_plus, //button
		]);
	}
	dt_skills.draw();
}

////////////////////////////////////////////////////////////////////

function viewActImpr_coor2(skill_name, obj){

	// HIDE THE HIGHTLIGHT ROW
	if (g_curr_inline_jtr){
		resumeIconPlus();
		var
			 skill_name2 = g_curr_inline_jtr.attr('skill_name'),
			 dt_type = g_curr_inline_jtr.closest('table').attr('dt_type')
		;
		if (skill_name2 == skill_name && dt_type == 'impression_coor1'){
			slideUpParticipantList();
			return;
		} else {
			removeParticipantList();
		}
	}

	// DEBUGGING
	console.info('viewActImpr_coor2', 'skill_name=' + skill_name);

	// FIND ASSESSEES UNDER THIS IMPRESSION SKILLS
	var	act_id = g_saved_activity.act_id,
		act_skills = g_saved_activity.impression.skills,
		act_skill = getSkillByName(act_skills, skill_name),
		act_part_scores = act_skill.act_part_scores
	;

	var jtr = $(obj).closest('tr');
	//console.info(jtr);
	var s = '<table class="my_datatable display" dt_type="impression_coor2" style="width:100%">'
					+ '<thead>'
						+ '<tr>'
							+ '<td>User ID</td>'
							+ '<td>Particpants</td>'
							+ '<td>Score</td>'
							+ '<td></td>'
						+ '</tr>'
					+ '</thead>'
				+ '</table>'
	;
	jtr.after('<tr skill_name="' + skill_name + '"><td colspan="7"><div class="div_assessors" style="display:none">' + s + '</div></td></tr>');
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
			{ targets: '_all', orderable: false,},
			{	targets: 0,	visible: false, },
			//{	targets: [ 2 ],	className: 'dt-center'},
			//{	targets: [ 3 ],	orderable: false},
		],
	});
	var dt = jtbl.show().DataTable().clear().draw();
	for (var part_id in act_part_scores){
		var
			act_part_score = act_part_scores[part_id],
			imgusername = getImgUserName(part_id, g_curr_participants)
		;
		var arr = [
				part_id,
				imgusername,
				'<!--' + act_part_score + '--><div class="star_rating" data-rating="' + act_part_score + '"></div>',
				g_but_right, //button
		];
		dt.row.add(arr);
	}
	dt.draw();

	jtbl.find('td').click(function(e){
		viewActImpr_coor3($(this));
	});

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
		console.info('close participants');
		// resume the icon +
		resumeIconPlus();
		slideUpParticipantList();
	});
	if (g_platform != 'ios' && g_platform != 'android'){
		jtbl.find('[data-toggle="tooltip"]').tooltip(); 	// render bootstrap tooltip
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_coor3(jobj){
	var
		jtr = jobj.closest('tr'),
		jtbl = jtr.closest('table'),
		jtr2 = jtbl.closest('tr'),
		skill_name = jtr2.attr('skill_name'),
		dt = jtbl.DataTable()
		row = dt.row(jtr),
		cols = row.data(),
		part_id = parseInt(cols[0]),
		participant_name = $('<div>' + cols[1] + '</div>').text(),
		//skill = getSkillByName(g_saved_activity.impression.skills, skill_name)
		//participant_act = getUserByID(skill.participants, part_id)
		act_id = g_saved_activity.act_id,
		uact = getUact(act_id),
		usr_skills = uact.impression.skills,
		usr_skill = getSkillByName(usr_skills, skill_name)
	;
	console.info('viewActImpr_coor3', 'skill_name='+skill_name, 'part_id='+part_id);

	var assessors = usr_skill ? usr_skill.assessors : 0;
	if (assessors && obj_count(assessors)){
		var jdiv = $('<div/>');
		var s = '<span class="subsection_header">Markings for ' + participant_name + '\'s ' + skill_name + '</span>'
			+ '<table class="my_datatable display" dt_type="impression_coor3">'
					+ '<thead>'
						+ '<tr>'
							+ '<td>Assessors</td>'
							//+ '<td>Date</td>'
							+ '<td>Score</td>'
							+ '<td>Comments</td>'
						+ '</tr>'
					+ '</thead><tbody>'
		;
		for (var assr_id in assessors){
			var
				assessor = assessors[assr_id],
				imgusername = getImgUserName(assr_id, g_curr_impression_assessors),
				date = assessor.date,
				usr_assr_score = assessor.usr_assr_score,
				comments = assessor.comments
			;
			s += '<tr>'
					 + '<td>' + imgusername + '</td>'
					 //+ '<td>' + date + '</td>'
					 + '<td><!--' + usr_assr_score + '--><div class="star_rating" data-rating="' + usr_assr_score + '"></div></td>'
					 + '<td>' + comments + '</td>'
				 + '</tr>'
			;
		}
		s += '</tbody></table>';

		// add close button
		s += '<br/><div class="buttons_panel">'
					+ '<button class="btn_close btn btn-primary" onclick="closeLightBox()"><i class="glyphicon glyphicon-ok-circle"></i> Close</button> '
					+ '<div>';
		jdiv.append(s);

		// render the table
		jdiv.find('.my_datatable').DataTable({
			//ordering: false,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			autoWidth: false,
			columnDefs: [
				{targets:'_all', orderable: false,}
				//{	targets: [ 0 ],	width:250},
				//{	targets: [ 1 ],	width:100, className: 'dt-center'},
				//{	targets: [ 2 ],	width:100},
				//{	targets: [ 3 ],	orderable: false,	width:150},
			],
		});

		//var star_opts = jsonclone(g_star_opts);
		//setTimeout(function(){
		//	jdiv.find('.star_rating').starRating(g_star_opts);
		//}, 100);
		setStarRating(jdiv.find('.star_rating'), 0);

		// ***TO BE TESTED AND REPLACED BY BODYVIEW LVL 3!!!
		// open impression for individual examination of this impression
		g_lightbox = $.featherlight(jdiv, {});
	}


}
