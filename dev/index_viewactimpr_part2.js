///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Impression for participants
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_part1(){
	console.log('viewActImpr_part1');

	var
		jdiv = $('.div_viewimpr_participant'),
		jtr = $('#tr_actpage_impression_participant'),
		jtbl = jtr.find('.my_datatable'),
		activity = g_saved_activity,
		uact = g_saved_uact,
		//skills = uact.impression ? uact.impression.skills : 0,
		closed = isActClosed(g_saved_activity),
		markable = !closed,
		count = skills ? obj_count(skills) : 0,

		imp_panelists = activity.impression ? activity.impression.panelists : [],
		uimp = uact.impression ? uact.impression : 0,
		uimp_panelists = uimp ? uimp.panelists : [],
		skills = uimp.skills,
		count = skills ? obj_count(skills) : 0
	;
	if (!g_imp_part || !count | !skills){

		jtr.hide();
		$('#tr_viewact_impression .div_asspage_assessors').hide();

	} else {

		jtr.show();
		var dt = 0;
		if (!jtbl.hasClass('dataTable')){
			dt = jtbl.DataTable({
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
		} else {
			dt = jtbl.show().DataTable().clear().draw();
		}
		// skills
		for (var skill_name in skills){
			var
				skill = getSkillByName(skills, skill_name),
				//score = '<!--' + skill.usr_part_score + '--><div class="star_rating" data-rating="' + skill.usr_part_score + '"></div>'
				score = skill.usr_part_score
			;
			dt.row.add([
				skill_name,
				getDivStar(score, '', 1),
				g_but_right,
			]);
		}
		dt.draw();

		// draw star rating
		//setStarRating(jtbl.find('.star_rating'), 0);
		showDivStar(jdiv);

		// PRPPARE FOR PEER ASSESSMENT
		var	jdiv = $('#tr_viewact_impression');
		
		var bPeerAsstEditable =
			g_curr_role == 'participant'
		&&
			(
				!uimp_panelists.peer_assessors.length	// not selected
			||
				!uimp.marked	// not marked
			)
		;
		//g_curr_ass_id = 0;
		updatePanelists(jdiv, imp_panelists, uimp_panelists, g_user_id, bPeerAsstEditable);

		$('#tr_viewact_impression .div_asspage_assessors').show();

		addImpOnClickEvent();
		setTimeout(function(){
			transdiv(jdiv, 0);
		}, 1000);
	}
}


//////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_part2(skill_name, obj){
	console.log('viewActImpr_part2', skill_name);
	$('.div_rating_skill').html(skill_name);

	transdiv($('.div_viewimpr_participant'), 1);

	// show assessors
	var jtbl = $('[dt_type=impression_part2]'), dt = 0;
	if (!jtbl.hasClass('dataTable')){
		dt = jtbl.DataTable({
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
				{ targets: [ 3 ], orderable: false, className: 'dt-center'},
			],
		});
	} else {
		dt = jtbl.show().DataTable().clear().draw();
	}

	// activities
	var
		act_id = g_saved_activity.act_id,
		uact = getUact(act_id),
		uskill = uact.impression.skills[skill_name],
		nassessors = obj_count(uskill.assessors);
	;

	for (var assr_id in uskill.assessors){
		getImprComment(act_id, assr_id, g_user_id, function(comments){
			var
				assr = uskill.assessors[comments.assr_id],
				usr_assr_score = assr && assr.usr_assr_score ? assr.usr_assr_score : 0,
				s =
				'<div class="part_impr_results">' +
					'<span class="star_rating" data-rating="' +  + '"></span> ' +
					getImgUserName(comments.assr_id, g_impr_assrs) + ':' +
					' <span class="display_comments">' + comments.comments + '</span>' +
					' <span class="div_datetime">(' + comments.datetime + ')</span>' +

				'</div>'
			;
			dt.row.add([
					s
			]);

			if (!--nassessors){
				dt.draw();
				// assessors
				setStarRating(jtbl.find('.star_rating'), 0);
				// resize
				setTimeout(function(){
					transdiv_resize();
				}, 500);
			}
		});
	}


}
