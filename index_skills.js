/////////////////////////////////////////////////////////////////////////////////////////////
// set the skill on datatable with custom css
/////////////////////////////////////////////////////////////////////////////////////////////

var g_toggle_showhide_opts = {
	click: true,
	text: {
		on: 'Show', // text for the ON position
		off: 'Hide' // and off
	},
	width: 70,
	type: 'compact',	//type: 'select', // if this is set to 'select' then the select style toggle will be used
};

/////////////////////////////////////////////////////////////////////////////////////////////

function clearSkills(selector){
	var jdiv = $(selector);

	// clearTokenfield
	clearTokenfield(jdiv.find('.my_tokenfield[tt_type=skills]'), 1);
	clearTokenfield(jdiv.find('.my_tokenfield[tt_type=users]'), 0);

	jdiv.find('.my_datatable[dt_type=skills]').hide().DataTable().clear().draw();
	jdiv.find('.my_datatable[dt_type=users]').hide().DataTable().clear().draw();
}

/////////////////////////////////////////////////////////////////////////////////////////////

function getSkillsFromTbl(selector, bAssessment){
	var skills = [];
	var jdiv = $(selector),
		jtbl = jdiv.find('.my_datatable[dt_type=skills]')
	;
	if (jtbl.length){
		skills = jtbl.DataTable().column(0).data().toArray().sort();
	}
	var hasharr =  num2hashArr(skills);
	for (var skill_name in hasharr){
		hasharr[skill_name] = jsonclone(!bAssessment ? template_act_impression_skills : template_act_assessment_skills);
	}
	return hasharr;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////

function setSkillTableCanvas(jtbl, jcvs, skills, info_users, num_of_assessors_shown, bEnableBut, act_title){

	if (!jtbl.hasClass('dataTable')){

		var dt_opts = {
			//ordering: false,	// otherwise, the list is difficult to trace
			//rowReorder: true,
			autoWidth: false,
			bPaginate: false,
			dom: '',
			language:{
				emptyTable: '',
				zeroRecords: '',
			},
			columnDefs: [
			],
		}
		//////////////////////////////////
		// SETUP DATATABLE THEAD
		//////////////////////////////////
		var s = '<thead>'
							+ '<tr>';

		if (bEnableBut){

			s += '<td>&nbsp;</td>';

			dt_opts.columnDefs = [
				{ targets: '_all', orderable: false, },
				{	targets: [ 0, 3 ], orderable: false,	},
				{ targets: 3,	visible: false},
			];
			// for mobile layout, the assessor list has to be removed
			switch (g_platform){
				case 'ios':
				case 'android':
					dt_opts.columnDefs.push({ targets: 2,	visible: false});
					dt_opts.columnDefs.push({ targets: 4,	visible: false});
					break;

				default:
					dt_opts.columnDefs.push({ targets: 2,	className: 'dt-center', width: 1})
					dt_opts.columnDefs.push({ targets: 4,	className: 'dt-center', width: 1, orderable: false});
					break;
			}

		} else {

			dt_opts.columnDefs = [
				{ targets: '_all', orderable: false, },
				{ targets: 1,	type: 'string',	className: 'dt-center', width: 100},
				{ targets: 2,	orderable: false,	},
				{ targets: 3,	className: 'dt-center', width: 1, orderable: false},
			];

			// for mobile layout, the assessor list has to be removed
			switch (g_platform){
					case 'ios':
					case 'android':
						dt_opts.columnDefs.push({ targets: 2,	visible: false})
						break;

					default:
						dt_opts.columnDefs.push({ targets: 2,	className: 'dt-center', width: 1})
						break;
			}
		}

		s += '<td>Skills</td>'
				+ '<td>Scores</td>'
				+ '<td>&nbsp;</td>'
				+ '<td>&nbsp;</td>'
			+ '</tr>'
		'</thead>'
		;
		jtbl.empty().append(s);

		///////////////////////////////////
		// SETUP DATATABLE TBODY
		///////////////////////////////////
		jtbl.DataTable(dt_opts);
	}

	// view button
	var button = '<button type="button" class="btn btn-sm btn_view" data-toggle="tooltip" title="View breakdowns"><i class="glyphicon glyphicon-search"></i></button>';

	var dt_skills = jtbl.show().DataTable().clear().draw();

	// LIST OF SKILLS
	var nSkills = 0;
	for (var skill_name in skills){
		var arr = [],
			skill = getSkillByName(skills, skill_name),
			stars = getTruncatedScore(skill.skill_stars)
		;
		if (bEnableBut){
			//console.log(skill_name, stars);
			if (stars > 0){
				arr.push('<td class="td_skills_show"><div class="toggle_showgs toggle-light"></div></td>');
			} else {
				arr.push('<td>&nbsp;</td>');
			}
		}
		var bShow = typeof(skill.show) == 'undefined' || skill.show == 1;
		if (bEnableBut || bShow){
			
			// SKILL NAME
			arr.push(skill_name);
			
			// SCORE
			arr.push(getDivStar(stars, 0, 1));
			
			// SKILL ASSESSORS LIST
			var list = createActList(skill.markings, num_of_assessors_shown);
			arr.push(list);
			
			// VIEW BUTTON
			arr.push(g_but_right);
		}
		if (arr.length){
			//console.info(arr);
			dt_skills.row.add(arr);
			nSkills++;
		}
	}
	if (nSkills < 3){
		jtbl.removeClass('charted');
	} else {
		jtbl.addClass('charted');	// for bottom css in home page
	}
	if (nSkills){
		jtbl.find('>thead>tr>td').show();
		dt_skills.draw();
		// ADD POPUP EVENTS
		createBreakdownList2(jtbl, skills, info_users);
	} else {
		jtbl.find('>thead>tr>td').hide();
		jtbl.find('>tbody>tr>td:first-child').html('No any skills yet.');
	}

	////////////////////////////////////////////////////
	// CLICK TO VIEW THE VIEWBREAK
	////////////////////////////////////////////////////
	jtbl.find('>tbody>tr>td').click(function(){
		var jtr = $(this).closest('tr'),
			skill_name = jtr.find('>td:nth-child('+(bEnableBut?2:1)+')').text().trim()
			index = $(this).index()
		;
		if (bEnableBut && index == 0){
			// skip enable button
		} else {
			viewSkillBreakdown2(skills, info_users, skill_name, act_title);
		}
	});

	// hide header
	jtbl.find('>thead>tr>td').hide();

	setStarRating(jtbl.find('.star_rating'), 0);
}

//////////////////////////////////////////////////////////////////////////////////////////////

function profileToggleSkill(e, active){
	var
		jobj = $(this),
		skill_name = jobj.closest('td').next().text(),	//find('td:nth-last-child(4)').text()
		skills = g_user.skills
	;

	// toggle show
	skills[skill_name].show = active?1:0;

	refreshMySkills();
	var skills = getSkillsWithBreakdown_user(g_user);
	drawSkillCanvas('cvs_skills_profile', skills, 1);

	// REPORT TO SERVER
	call_svrop(
		{
			type: 'show_skill',
			user_id: g_user.user_id,
			label: skill_name,
			show: active?1:0,
		},
		function (obj){
			//console.info(obj);
		}
	);
	e.stopPropagation();
}

//////////////////////////////////////////////////////////

function getGsScore(skills){
	var total = 0, count = 0;
	for (var name in skills){
		var skill = skills[name];
		if ((typeof(skill.show) == 'undefined' || skill.show) && skill.skill_stars > 0){
			total += skill.skill_stars;
			count++;
		}
		//console.log(score);
	};
	var score = count ? total / count : 0;
	return getTruncatedScore(score);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshUserSkills(user, outputs){
	console.info('refreshUserSkills');

	// UPDATE GS SCORE
	var gs_score = getGsScore(user.skills);
	for (var i in outputs){
		var
			output = outputs[i],
			jgauge = output.gauge ? $('#' + output.gauge) : 0
		;
		if (jgauge){
			setGauge1(jgauge, gs_score);
		}
	}

	// GET SKILLS WITH HISTORY
	var skills = getSkillsWithBreakdown_user(user);
	var assessors = getAssessorsFromBreakdown(skills);
	if (!assessors.length){
		refreshUserSkills2([], skills, outputs);
	} else {
		getUsersFromDB(assessors, function(info_users){
			refreshUserSkills2(info_users, skills, outputs);
		});
	}
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshUserSkills2(info_users, skills, outputs){
	for (var i in outputs){
		var
			output = outputs[i],
			jtbl = $('#'+output.tbl),
			jchart = $('#'+output.chart),
			num_of_assessors_shown = output.num_of_assessors_shown,
			editable = output.editable ? 1 : 0
		;
		// UPDATE TABLE AND CHART
		setSkillTableCanvas(jtbl, jchart, skills, info_users, num_of_assessors_shown, editable);
	}
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// REFRESH SKILLS x 3 types
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshMySkills(){
	console.info('refreshMySkills');
	refreshUserSkills(g_user, [
		{
			tbl: 		'tbl_skills_home',
			chart: 	'cvs_skills_home',
			gauge: 	'cvs_gauge_home',
			num_of_assessors_shown: 2,
		},
		{
			tbl: 	'tbl_skills_profile',
			chart: 	'cvs_skills_profile',
			gauge: 	'cvs_gauge_profile',
			num_of_assessors_shown: 4,
			editable: 1,
		},
	]);

	// https://github.com/simontabor/jquery-toggles
	$('#tbl_skills_profile .toggle_showgs').each(function(){
		var jobj = $(this),
			jtr = $(this).parent().parent(),
			skill_name = jtr.find(' > td:nth-child(2)').text().trim(),
			skill = getSkillByName(g_user.skills, skill_name),
			opts = jsonclone(g_toggle_showhide_opts);
			opts.on = skill ? skill.show : 0
			//opts.clicker = jobj
		;
		//console.log('*', skill_name);
		if (!jobj.find('.toggle-slide').length){
			jobj
				.toggles(opts)
				.on('toggle', profileToggleSkill)
			;
		}
	});

}
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshUserPageSkills(user){
	console.info('refreshUserPageSkills', 'user_id='+user.user_id);
	refreshUserSkills(user, [
		{
			tbl: 		'tbl_skills_userpage',
			chart: 	'cvs_skills_userpage',
			gauge: 	'cvs_gauge_userpage',
			num_of_assessors_shown: 4,
			editable: 0,
		},
	]);
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function refreshMyActivitySkills(act_id){
	var activity = getActivityByID(g_user.profile.activity, act_id);
	var skills = getSkillsWithBreakdown_act(activity);
	if (skills && obj_count(skills)){

		//console.info('refreshMyActivitySkills', 'act_id='+act_id)
		var assessors = getAssessorsFromBreakdown(skills);
		var outputs = [
			{
				tbl: 	'tbl_skills_' + act_id,
				chart: 	'cvs_skills_' + act_id,
				gauge: 	'cvs_gauge_' + act_id,
				num_of_assessors_shown: 3,
				editable: 0,
			},
		];
		// load users
		if (!assessors.length){

			refreshMyActivitySkills2([], skills, outputs);

		} else {

			getUsersFromDB(assessors, function(info_users){
				refreshMyActivitySkills2(info_users, skills, outputs);
			});
		}
	}
}

/////////////////////////////////////////////////////////////////

function refreshMyActivitySkills2(info_users, skills, outputs){

	for (var i in outputs){

		//console.info('refreshMyActivitySkills2', outputs[i]);

		var
			output = outputs[i],
			jtbl = $('#'+output.tbl),
			jchart = $('#'+output.chart),
			jgauge = output.gauge?$('#'+output.gauge):0,
			num_of_assessors_shown = output.num_of_assessors_shown,
			editable = output.editable?1:0
		;
		// UPDATE TABLE AND CHART
		setSkillTableCanvas(jtbl, jchart, skills, info_users, num_of_assessors_shown, editable);


	}
}
