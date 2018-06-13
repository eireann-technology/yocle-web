//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UPDATE SKILLS OF ALL THE ACTIVITY ON THE PROFILE PAGE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getSkillsWithBreakdown_user(user){
	var
		skills_history = {},
		base_skills = user.skills
	;
	for (var skill_name in base_skills){
		
		// FORM A GROUP FOR THIS SKILL
		var obj = [];
		var base_skill = base_skills[skill_name];
		
		// FIND THIS SKILL IN ALL ACTIVITY
		var breakdowns = [];
		var activities = user.profile.activity;
		for (var index in activities){
			var	activity = activities[index];
			if (!activity.impression){
				console.error('wrong scheme');
				continue;
			}
			 for (var skill_name2 in activity.impression.skills){
				if (skill_name2 == skill_name){
					var skills2 = activity.impression.skills[skill_name];
					var assessors = skills2.assessors;
					for (var assr_id in assessors){
						var assessor = assessors[assr_id];
						breakdowns.push({
							assr_id:	assr_id,
							act_id:		activity.act_id,
							title: 		activity.title,
							img_id:		activity.img_id,
							score:		assessor.usr_assr_score,
							comments: assessor.comments,
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
		};
	}
	return skills_history;
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
			} else {
				s	+= '<td><img class="person_photo" img_id="' + assessor.img_id + '"/></td>';
			}
		} else {
			bMore = 1;
			break;
		}
	}
	if (bMore){
		s += '<td><a class="fa fa-chevron-right""></a></td>';
	} else {
		s += '<td style="width:10px">&nbsp;</td>';
	}
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
		viewSkillBreakdown(skills, info_users, skill_name);
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
	console.debug('viewSkillBreakdown', skill_name);
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
	
	// 1. TRANSFORM from per-skill to per-activity
	for (var i in skill.breakdowns){
		var breakdown = skill.breakdowns[i];
		console.debug(breakdown);
		var act_id = breakdown.act_id;
		if (!assts[act_id]){
			assts[act_id] = {};
			assts[act_id] = {
				act_id: act_id,
				title: breakdown.title,
				img_id: breakdown.img_id,
				markings: [],
			};
		}
		var
			assr_id = parseInt(breakdown.assr_id),
			score = breakdown.score?parseFloat(breakdown.score):0,
			user = getUserByID(info_users, assr_id),
			imgusername = getImgUserName(user)
		;
		assts[act_id].markings.push({
			score: score,
			imgusername: imgusername,
			comments: breakdown.comments,
		});
		markings++;
	}
	// 2. CALC THE AVERAGE OF THE ACTIVITY
	var total2 = 0, count2 = 0;
	for (var act_id in assts){
		var 
			act = assts[act_id],
			total = 0,
			count = 0
		;
		for (var i in act.markings){
			var marking = act.markings[i];
			total += marking.score;
			count++;
			
			total2 += marking.score;
			count2++;
		}
		act.score = parseInt(10*total / count) / 10;
	}
	//console.dir(assts);
	
	// 3. UPDATE TITLE
	jdiv.find('.bodyview_title').text(skill_name);
	jdiv.find('.bodyview_title2 .num_of_markings').text(markings);
	var
		star_opts = {},
		star_opts2 = {
			starGradient: {start: '#bbeeff',	end: '#55bbff'},	// lighter
		}
	;
	$.extend(star_opts, g_star_opts, star_opts2);
	//var av_score = skill.score;
	var av_score = parseInt(10 * total2 / count2) / 10;	// count again
	// attr('data-rating', av_score).
	jdiv.find('.bodyview_title2 .star_rating').starRating(star_opts).starRating('setRating', av_score); // this one set the stars again
	
	// 4. CHANGE SCREEN
	jdiv.show();
	changeBodyView(PAGE_VIEW_SKILL);

	if (!markings){
		// no any marking
		jtbl.hide();
	} else {
		jtbl.show();
		// 5. LIST ALL THE ASSESSMENTS PER ACTIVITY
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
					{ targets:'_all', orderable: false, },
				],
			});
		} else {
			dt = jtbl.DataTable();
		}
		dt.clear();
		for (var act_id in assts){
			var asst = assts[act_id];
			var imgacttitle = getImgActTitle(asst);
			var arr = [
				'<b>' + imgacttitle + '</b>',
				//'<div class="star_rating" data-rating="' + asst.score + '"></div>',
				act_id,
			];
			dt.row.add(arr);
		}
		dt.draw();

		// 6. ADD SPECIFIC ASSESSMENT PER USER
		//if (!jtbl.find('.dataTables_empty').length)
		{
			var jtrs = [], index = 0;
			jtbl.find('>tbody>tr').each(function(){
				jtrs.push($(this));
			});
			for (var i in jtrs){
				var 
					jtr = jtrs[i],
					cols = dt.row(jtr).data(),
					act_id = parseInt(cols[cols.length-1]),
					act = assts[act_id]
				;
				// ADD THE USER TABLE
				var s = '<table class="tbl_skills_breakdown2">';
				for (var i in act.markings){
					var marking = act.markings[i];
					//console.debug(marking);
					s +=
						'<tr>'
						+ '<td>'
							+ marking.imgusername
						+ '</td>'
						+ '<td>'
							+ '<div class="star_rating" data-rating="' + marking.score + '"></div>'
						+ '</td>'
					+ '</tr>'
					+ '<tr>'
						+ '<td colspan="2">'
							+ marking.comments
						+ '</td>'
					+ '</tr>'
				}
				s += '</table>';
				jtr.after('<tr><td colspan="7">'+s+'</td></tr>');

				// 7. DECORATE THE STARS
				jtbl.find('.star_rating').starRating(star_opts);
			}
		}
	}	
}
