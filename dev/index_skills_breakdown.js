//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE SKILLS OF ALL THE ACTIVITY ON THE PROFILE PAGE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getSkillsWithBreakdown_user(user){
/*
	var
		skills_history = {},
		base_skills = user.skills
	;
	for (var skill_name in base_skills){

		// FORM A GROUP FOR THIS SKILL
		var obj = [];
		var base_skill = base_skills[skill_name];

		// FIND THIS SKILL IN ALL ACTIVITIES
		var markings = {};

		var breakdowns = [];
		var uacts = user.profile.activity;
		for (var index in uacts){

			// for each uact
			var	uact = uacts[index];
			if (!uact.impression){
				console.error('wrong scheme');
				continue;
			}
			for (var skill_name2 in uact.impression.skills){
				if (skill_name2 == skill_name){

					// markers
					var skills2 = uact.impression.skills[skill_name];
					var assessors = skills2.assessors;
					for (var assr_id in assessors){
						var assessor = assessors[assr_id];
						breakdowns.push({
							assr_id:	assr_id,
							act_id:		uact.act_id,
							title: 		uact.title,
							img_id:		uact.img_id,
							score:		assessor.usr_assr_score,
							comments: 	assessor.comments,
						});
					}
					break;
				}
			}
		}
		skills_history[skill_name] = {
			show: base_skill.show,
			score: base_skill.usr_final_score,
			breakdowns: breakdowns,
			markings: markings,
		};
	}
	console.debug('skills_history', skills_history);
	return skills_history;
*/
	return user.skills;
}

///////////////////////////////////////////////////////////////////////////////
// my activitiy
function getSkillsWithBreakdown_act(activity){
	var skills_history = {}
	for (var skill_name in activity.impression.skills){
		var skill = activity.impression.skills[skill_name];
		var breakdowns = [];
		for (var assr_id in skill.assessors){
			var assessor = skill.assessors[assr_id];
			breakdowns.push({
				assr_id:		assr_id,
				act_id:			activity.act_id,
				img_id: 		activity.img_id,
				title: 			activity.title,
				score:			assessor.usr_assr_score,
				comments: 	assessor.comments,
			});
		}
		skills_history[skill_name] = {
			show: 1,//skill.show,
			score: skill.usr_part_score,
			breakdowns: breakdowns,
		}
	}
	//console.info('skills_history', skills_history);
	return skills_history;
}

///////////////////////////////////////////////////////////////////////////////

function createBreakdownList(breakdowns, info_users, num_of_assessors_shown){
	var s = '<table style="background-color:transparent" class="tbl_assessors">'
			+ '<tr>';
	var assr_ids = {};
	var bMore = 0;
	for (var i in breakdowns){
		if (i <= num_of_assessors_shown - 1){
			var
				breakdown = breakdowns[i],
				assr_id = breakdown.assr_id,
				assessor = getUserByID(info_users, assr_id)
			;
			if (!assessor){
				console.error('missing user', assr_id);
			} else if (assr_ids[assr_id]){
				// skip repeated
			} else {
				assr_ids[assr_id] = 1;
				s += '<td><img class="person_photo" img_id="' + assessor.img_id + '"/></td>';
			}
		} else {
			bMore = 1;
			break;
		}
	}
	//if (bMore){
	//	s += '<td><a class="fa fa-chevron-right""></a></td>';
	//} else {
	//	s += '<td style="width:10px">&nbsp;</td>';
	//}
	s	+= '</tr></table>';
	return s;
}

/////////////////////////////////////////////////////////////////////////////////////

function createBreakdownList2(jtbl, skills, info_users){

	// UPDATE PHOTO
	jtbl.find('.person_photo').each(function(){
		var img_id = $(this).attr('img_id');
		if (img_id){
			updateImgPhoto($(this), img_id, 'user');
		}
	});

	jtbl.find('.tbl_assessors').click(function(){
		var jtr = $(this).closest('table').closest('tr');
		var skill_name = jtr.find('>td:nth-child(' + (jtr.find('>td').length == 3 ? 1 : 2 ) + ')').text();
		//createBreakdownList3(skills, info_users, skill_name)
		viewSkillBreakdown2(skills, info_users, skill_name);
	});
}

////////////////////////////////////////////////////////////////////////////////////////////

function getAssessorsFromBreakdown(skills){
		// get assessors of the skill
	var assessors = {};
	for (var skill_name in skills){
		var	skill = skills[skill_name];
		for (var i in skill.breakdowns){
			var breakdown = skill.breakdowns[i];
			assessors[breakdown.assr_id] = 1;
		}
	}
	// convert it to array
	var assessors2 = [];
	for (var assr_id in assessors){
		assessors2.push(assr_id);
	}
	return assessors2;
}

////////////////////////////////////////////////////////////////////////////////////////////
// replace createBreakdownList3
////////////////////////////////////////////////////////////////////////////////////////////

function closeSkillBreakdown(){

	changeBodyView(-1);	// go to previous page
}
/*
	skills = {
	"Communication":{
		"show":1,
		"score":0.3,
		"breakdowns":[
			{
				"assr_id":"1",
				"act_id":4,
				"title":"Post-earthquake Visit to Sichuan",
				'img_id': 4,
				"score":"3",
				"comments":"He performed well in the visit. He talked to many survivors and examine the site."
			},
*/
////////////////////////////////////////////////////////////////////////////////////////////
// skills
function viewSkillBreakdown(skills, info_users, skill_name){
}

////////////////////////////////////////////////////////////

function viewSkillBreakdown2(skills, info_users, skill_name, act_title){

	console.info('viewSkillBreakdown', skills);

	var jdiv = $('#div_skill_breakdown'),
			jtbl = jdiv.find('.tbl_skills_breakdown'),
			dt = 0,
			skill = skills[skill_name],
			assts = [],
			markings = 0
	;
	if (!skill){
		console.error('skill not found');	return;	// impossible
	}
	var skill_stars = getDecPlace(skill.skill_stars, 2);

	// 3. UPDATE TITLE
/*	
	//jdiv.find('.bodyview_title2 .num_of_markings').text(markings);

	jdiv.find('.bodyview_title').text(skill_name + (bIsActSkill?' (In This Activity)':''));
	jdiv.find('.bodyview_title2 .star_value').text(skill_stars);

	var
		star_opts = {},
		star_opts2 = {
			starGradient: {start: '#bbeeff',	end: '#55bbff'},	// lighter
		}
	;

	$.extend(star_opts, g_star_opts, star_opts2);
	var jstars = jbody.find('.bodyview_title2 .star_rating');
	setStarRating(jstars, 0, skill_stars);//, 'viewSkillBreakdown2: ' + skill_name);
*/
	// 4. CHANGE SCREEN
	jdiv.show();
	changeBodyView(PAGE_VIEW_SKILL);

	// 5. MARKINGS FROM UACT
	var jtbody = jtbl.find('tbody').empty();
	
	// add title
	var title = act_title ? act_title + '<br/>' : '';
	jtbody.append(
		'<tr>' +
			'<td class="div_bodyview_header2" colspan="99">' +
				'<table>' +
					'<tr>' +
						'<td rowspan="2">' + 
							'<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeSkillBreakdown()"/>' +
						'</td>' +
						'<td class="bodyview_title">' + title + skill_name + '</td>' +
					'</tr>' +
					'<tr>' +
						'<td class="bodyview_title2">' +
							//getStarRatingWithScore(skill_stars, 1) +
							getDivStar(skill_stars, 0, 1) +
						'</td>' +
					'</tr>' +
				'</table>' +
			'</td>' +
		'</tr>' +
		'<tr>' +
			'<td colspan="99" style="height:10px">' +
			'</td>' +
		'</tr>'
	);
	//jtbody.find('.bodyview_title').text(skill_name + (bIsActSkill?' (In This Activity)':''));
	
	var markings = skill.markings;
	for (var act_id in markings){

		var uact = getUact(act_id);

		var marking = markings[act_id];
		jtbody.append(
				'<tr>'
				+ '<td class="td_acttitle">'
				 + getImgActTitle(uact)
				+ '</td>'
			+ '</tr>'
		);

		for (var i in marking){
			var asst = marking[i],
				ass_id = asst.ass_id,
			 	source = asst.source,
				stars = asst.stars,
				weight = asst.weight_pc,
				uass = getUactAss(uact, ass_id),
				ass_title = ass_id == 0 ? '*  Rating on Impression' : ass_id + '. ' + uass.title;
			;
			jtbody.append(
				'<tr>'
					+ '<td class="brkdn_asstitle">' + ass_title + ' (' + weight + '%) ' +  '</td>'
			 		+ '<td>' + getStarRating(stars) + '</td>'
					+ '<td class="brkdn_skillstars">' + stars + '</td>'
				+ '</tr>'
			);

		}
		jtbody.append(
			'<tr>'
				+ '<td colspan="10">&nbsp;</td>'
			+ '</tr>'
		);
	}
	//setTimeout(function(){
	//	jtbl.find('.star_rating').starRating(star_opts);
	//}, 100);
	var jstars = jtbl.find('.star_rating');
	setStarRating(jstars)
}


///////////////////////////////////////////////////////////////////////////////

function createActList(skill, num_of_acts_shown){
	var s = '<table style="background-color:transparent" class="tbl_assessors">'
			+ '<tr>';
	var i = 0;
	for (var act_id in skill){
		if (i++ >= num_of_acts_shown){
			break;
		} else {
			var uact = getUact(act_id);
			if (uact && uact.img_id){
				s += '<td><img class="person_photo" src="' + getActImgSrc(uact.img_id) + '"/></td>';
				//s += '<td>' + getImgActTitle(uact) + '</td>';
			}
		}
	}
	s	+= '</tr></table>';
	return s;
}
