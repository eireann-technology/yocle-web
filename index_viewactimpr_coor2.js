///////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Coordinator's table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_coor1(){

	console.log('viewActImpr_coor1');

	var
		jdiv = $('.div_viewimpr_coordinator'),
		jtr = $('#tr_actpage_impression_coordinator'),
		jtbl = jtr.find('.my_datatable'),
		activity = g_saved_activity,
		uact = g_saved_uact,
		skills = uact.impression ? uact.impression.skills : 0,
		closed = isActClosed(activity),
		markable = !closed,
		count = skills ? obj_count(skills) : 0,
		assr_id = g_user_id
	;
	// COORDINATOR
	if (!g_imp_coor || !count || !skills){
		jtr.hide();
		$('#tr_viewact_impression .div_asspage_assessors').hide();

	} else {
		jtr.show();

		var dt = 0,
			dt_opts = {
			order: [[1, "desc"]],
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language: {
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				{	targets: [0],		orderable: true, 	type: 'html' },
				{	targets: [1],		orderable: true, 	type: 'string' },
				{ targets: [2],	orderable: false, className: 'dt-center'},
			],
		};
		if (!jtbl.hasClass('dataTable')){
			dt = jtbl.DataTable(dt_opts);
			jdiv.find('.viewass_search').keyup(function(){
				var key = $(this).val();
				dt.search(key).draw();
			});
			jdiv.find('.viewActPart_sel').change(function(){
				var index = $(this).prop('selectedIndex');
				switch (index){
					case 0: // sort by status
						dt_opts.order = [[1, "desc"]];
						break;
					case 1: // sort by name
						dt_opts.order = [[0, "asc"]];
						break;
				}
				dt.destroy();
				jtbl.next().find('tbody').empty();
				var key = jdiv.find('.viewass_search').val();
				dt = jtbl.DataTable(dt_opts).search(key).draw();
			});
		} else {
			dt = jtbl.show().DataTable().clear().draw();
		}

		for (var i in g_saved_parts){
			var
				part_id = g_saved_parts[i],
				act_assr_scores = g_saved_activity.impression.act_assr_scores;
				score = g_string_pending;
			if (
				act_assr_scores
			&&
				typeof act_assr_scores[assr_id+','+part_id] != 'undefined'
			){
				score = act_assr_scores[assr_id+','+part_id];
				score = '<!--' + (score) + '--><div class="star_rating" data-rating="' + score + '" part_id="' + part_id + '"></div>';
			}
			dt.row.add([
				getImgUserName(part_id, g_act_parts),
				score,
				g_but_right,
			]);
		}
		dt.draw();

		setStarRating(jtbl.find('.star_rating'), 0);

		$('#tr_viewact_impression .div_asspage_assessors').hide();

		addImpOnClickEvent();
		setTimeout(function(){
			transdiv($('.div_viewimpr_coordinator'), 0);
		}, 1000);
	}

}

////////////////////////////////////////////////////////////////////

function viewActImpr_coor2(part_id){

	console.info('viewActImpr_coor2', part_id);
	g_part_id = part_id;

	var
		jdiv = $('.div_viewimpr_coordinator'),
		imgusername = getImgUserName(part_id, g_act_parts)
	;
	jdiv.find('.div_rating_participant').html(imgusername);

	var dt = 0, jtbl = $('[dt_type=impression_coor2]');
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
				{ targets: [ 0 ],	orderable: false},
				{ targets: [ 1 ],	orderable: true, className: 'dt-center'},
				{ targets: [ 2 ],	orderable: false, className: 'dt-center'},
			],
		});
	} else {
		dt = jtbl.show().DataTable().clear().draw()
	}
	transdiv(jdiv, 1);

	// read the user
	getUserDoc(part_id, function(user){

		var act_id = g_saved_activity.act_id;
		closeProgress2();

		var
			skills = g_saved_activity.impression.skills,
			uact = getUact(act_id, user),
			uskills = uact.impression.skills,
			total_stars = 0,
			skill_count = 0			
		;

		for (var skill_name in skills){
			var
				skill = skills[skill_name],
				skill2 = uact.impression.skills[skill_name],
				score = 0
			;
			if (skill2 && typeof skill2.usr_part_score != 'undefined'){
				score = skill2.usr_part_score;
			}
			dt.row.add([
				skill_name,
				getDivStar(score, '', 1),
				g_but_right,
			]);
			// calc average
			total_stars += score;
			skill_count++;
		}
		dt.draw();
		
		var av_stars = !skill_count ? 0 : total_stars/skill_count;
		jdiv.find('.part_impr_av_stars').html(getDivStar(av_stars,'',1));
		showDivStar(jdiv);

		jtbl.find('td').click(function(e){
			var
				jobj = $(this),
				jtr = jobj.closest('tr'),
				skill_name = jtr.find('>td:first-child').text()
			;
			viewActImpr_coor3(skill_name, user);
		});

	}, 1);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_coor3(skill_name, user){
	var act_id = g_saved_activity.act_id;
		uact = getUact(act_id, user),
		uskills = uact.impression.skills,
		uskill = getSkillByName(uskills, skill_name)
	;
	console.info('viewActImpr_coor3', skill_name, g_part_id, skill_name, uskill);

	var imgusername = getImgUserName(g_part_id, g_act_parts, 0, function(user_id, username){
		return username + ': ' + skill_name;
	});
	//$('.div_rating_participant_skill').html(imgusername + ': ' + skill_name);
	$('.div_rating_participant_skill').html(imgusername);

	transdiv($('.div_viewimpr_coordinator'), 2);

	// show assessors
	var jtbl = $('[dt_type=impression_coor3]'), dt = 0;
	if (!jtbl.hasClass('dataTable')){
		dt = jtbl.DataTable({
			ordering: false,	// otherwise, the list is difficult to trace
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language: {
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				{	targets: '_all', orderable: false},
				{ targets: [ 1 ], type: 'string', className: 'dt-center'},
				{ targets: [ 2 ], orderable: false, className: 'dt-center'},
				{ targets: [ 3 ], orderable: false, className: 'dt-center'},
			],
		});
	} else {
		dt = jtbl.show().DataTable().clear().draw();
	}

	// activities
	var act_id = g_saved_activity.act_id,
		uact = getUact(act_id, user),
		uskill = uact.impression.skills[skill_name],
		nassessors = obj_count(uskill.assessors);
	;

	for (var assr_id in uskill.assessors){
		getImprComment(act_id, assr_id, g_part_id, function(comments){
			var s =
				'<div class="part_impr_results">' +
					getImgUserName(comments.assr_id, g_impr_assrs) + 
					getDivStar(uskill.assessors[comments.assr_id].usr_assr_score, '', 1) +
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
