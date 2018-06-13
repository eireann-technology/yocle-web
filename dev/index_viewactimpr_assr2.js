//////////////////////////////////////////////////////////////////
// Assessor's table
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_assr1(){

	console.log('viewActImpr_assr1');

	var
	jdiv = $('.div_viewimpr_assessor'),
		jtr = $('#tr_actpage_impression_assessor'),
		jtbl = jtr.find('.my_datatable'),
		activity = g_saved_activity,
		uact = g_saved_uact,
		skills = uact.impression ? uact.impression.skills : 0,
		closed = isActClosed(activity),
		markable = !closed,
		count = skills ? obj_count(skills) : 0
	;
	if (!g_imp_assr || !count | !skills){

		jtr.hide();
		$('#tr_viewact_impression .div_asspage_assessors').hide();

	} else {

		jtr.show();
		var dt = 0,
			dt_opts = {
			//ordering: false,	// otherwise, the list is difficult to trace
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
			// init search bar
			jdiv.find('.viewass_search').keyup(function(){
				var key = $(this).val();
				dt.search(key).draw();
			});

			// init sort field
			jdiv.find('.viewActPart_sel').change(function(){
				var index = $(this).prop('selectedIndex');
				//console.log(index);
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


		// preparation
		var assr_id = g_user_id;

		for (var i in g_imp_assessees){
			var part_id = g_imp_assessees[i];

			// find act_assr_scores
			var
				act_assr_scores = g_saved_activity.impression.act_assr_scores,
				score = g_string_pending
			;
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
			transdiv(jdiv, 0);
		}, 1000);
	}

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////
var g_part_id = 0;

function viewActImpr_assr2(part_id){
	console.info('viewActImpr_assr2', part_id);
	g_part_id = part_id;

	var
		jdiv = $('.div_viewimpr_assessor'),
		imgusername = getImgUserName(part_id, g_act_parts)
	;
	jdiv.find('.div_rating_participant').html(imgusername);

	var dt = 0, jtbl = $('[dt_type=impression_assr2]');
	if (!jtbl.hasClass('dataTable')){
		dt = jtbl.DataTable({
			rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language: {
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
				{ targets: [ 0 ],	orderable: true},
				//{ targets: [ 1 ],	orderable: true, className: 'dt-center'},
			],
		});
	} else {
		dt = jtbl.show().DataTable().clear().draw()
	}
	transdiv($('.div_viewimpr_assessor'), 1);

	// read the user
	getUserDoc(part_id, function(user){

		var act_id = g_saved_activity.act_id;

		getImprComment(act_id, g_user_id, part_id, function(comment){
			closeProgress2();
			var
				skills = g_saved_activity.impression.skills,
				uact = getUact(act_id, user),
				uskills = uact.impression.skills
			;
			for (var skill_name in skills){
				var
					skill = skills[skill_name],
					skill2 = uact.impression.skills[skill_name],
					score = 0,
					total_stars = 0,
					skill_count = 0							
				;
				if (
						skill2.assessors[g_user_id] 
					&&
						typeof skill2.assessors[g_user_id].usr_assr_score != 'undefined'
				 ){
				 	score = skill2.assessors[g_user_id].usr_assr_score;
				}
				//console.log(skill_name, score);
				//score = '<!--' + score + '--><div class="star_rating" data-rating="' + score + '" part_id="' + part_id + '"></div>';
				var arr = [
					skill_name,
					getDivStar(score, '', 1),
				];
				console.log(arr);
				dt.row.add(arr);
				// calc average
				total_stars += score;
				skill_count++;
			}
			dt.draw();

			// draw the stars
			//setStarRating(jstars, 1, null, function(){
			//	setStarAverage(jstars, jstars_av);
			//});
			//setStarAverage(jstars, jstars_av);
			
			var jstars = jtbl.find('.star_rating');
			var av_stars = !skill_count ? 0 : total_stars/skill_count;
			var jdiv_av_stars = jdiv.find('.part_impr_av_stars');
			jdiv_av_stars.html(getDivStar(av_stars,'',1));
			showDivStar(jstars);
			
			// show average
			jstars.each(function(){
				var opts1 = {
					readOnly: false,
					callback: function(currentRating, el){
						console.log(currentRating, stars, el);

						// update myself
						var 
							jtbl_stars = el.closest('.tbl_stars'),
							stars = getTruncatedScore(currentRating)
							//jtext = jtbl_stars.find('.stars_text')
						;
						//jtext.text(stars);
						jtbl_stars.find('.stars_text').text(stars);
						jtbl_stars.find('.star_rating').attr('title', stars);
						
						// average stars
						var stars = getAverageStars(jstars);
						setDivStarValue(jdiv_av_stars, stars);
					}
				}
				var opts2 = merge_options(jsonclone(g_star_opts), opts1);
				$(this).starRating(opts2);			
			});
			
			// show average
			showDivStar(jdiv_av_stars);
			
			// comments
			if (comment.datetime){
				$('#tr_actpage_impression_assessor .div_comments').html(comment.comments);
				$('#tr_actpage_impression_assessor .div_datetime').html('Marked on: ' + comment.datetime);
			} else {
				$('#tr_actpage_impression_assessor').find('.div_comments, .div_datetime').html('');
			}

			// resize
			setTimeout(function(){
				transdiv_resize();
				showActBtnPanel();
			}, 500);
		});
	}, 1); // skip closeprogress2
}

//////////////////////////////////////////////////////////////////

function getImprComment(act_id, assr_id, part_id, callback){

	call_svrop(
		{
			type: 'get_impr_comment',
			act_id: act_id,
			assr_id: assr_id,
			part_id: part_id,
		},
		function (obj){
			callback && callback(obj);	// obj.comments and datetime
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
