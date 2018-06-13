
var g_star_opts = {
	
		readOnly: true,
    disableAfterRate: false,
		
    initialRating: 0,
		totalStars: 5,
		starSize: 14,
		strokeWidth: 3,
		strokeColor: 'black',		
		//starShape: 'straight',
		starShape: 'rounded',
		emptyColor: 'lightgray',
		hoverColor: 'salmon',
		activeColor: 'cornflowerblue',
		
		useGradient: true,
		starGradient: { start: '#99ccff',	end: '#3399ff'},	// darker
		//starGradient: {start: '#bbeeff',	end: '#55bbff'},		// lighter
    callback: function(currentRating, $el){
    },
    onHover: function(currentIndex, currentRating, $el){
		},
    onLeave: function(currentIndex, currentRating, $el){
    },
	}
;

/////////////////////////////////////////////////////////////////////////////////////////////////////

function viewActImpr_all(activity, uact, peer_assessees){

	if (!activity.impression || activity.impression.enabled == '0'){

		$('#tr_actpage_impression').hide();
	
	} else {
		
		$('#tr_actpage_impression').show();
		
		// load assessor information
		var
			act_panelists = activity.impression?activity.impression.panelists:0,
			uact_panelists = uact.impression?uact.impression.panelists:0,
			all_assessors = getPrimaryAssessors(activity.coordinator_id, g_user_id, act_panelists, uact_panelists)
			//usr_skills = uact.impression.skills
		;
		console.info('viewActImpr_all');

		// gather assessors from scores and comments
		var hash_assessors = num2hashArr(all_assessors);
		if (uact && uact.impression && uact.impression.skills){
			for (var skill_name in uact.impression.skills){
				var skill = uact.impression.skills[skill_name];
				for (var assr_id in skill.assessors){
					hash_assessors[assr_id] = 1;
				}
			}
			all_assessors = hash2numArr(hash_assessors);
		}
		
		// ADD ASSESSORS TO THE TABLE
		var jtbl = $('#div_activity_view .my_datatable[dt_type=actpage_impression_assessors]');
		actpage_addUsers(all_assessors, jtbl, 0, function(users){
		
			// SET AS GLOBAL
			g_curr_impression_assessors = users;

			var activity = g_saved_activity,
				act_id = activity.act_id,
				uact = getUact(act_id),
				participants = activity.participants
				iamcoordinator = activity.coordinator_id == g_user_id ? 1 : 0,
				iamparticipant = getUserByID(activity.participants?activity.participants:0, g_user_id) ? 1 : 0
			;		
			
			// FIND THE ASSESSEES
			var jtr = $('#tr_actpage_assessment_assessor');
			var assessees = [];
			if (uact.uact_assessor == 1){
				// assess all participants 
				assessees = jsonclone(participants);
			} else if (peer_assessees.length){
				assessees = jsonclone(peer_assessees);
			}
			
			var closed = isActClosed(g_saved_activity);
			var markable = !closed;
			var count = getObjCount(activity.impression.skills);
			
			// COORDINATOR
			var jtr = $('#tr_actpage_impression_coordinator');
			if (iamcoordinator && count > 0){
				jtr.show();
				viewActImpr_coor1(jtr.find('.my_datatable'), activity.impression.skills, participants);
			} else {
				jtr.hide();
			}
						
			// ASSESSOR
			var jtr = $('#tr_actpage_impression_assessor');
			// AM I ASSESSOR?
			if (assessees.length && count > 0){
				jtr.show();
				viewActImpr_assr1(jtr.find('.my_datatable'), activity.impression.skills, assessees, markable);
			} else {
				jtr.hide();
			}
			
			// PARTICIPANTS
			var jtr = $('#tr_actpage_impression_participant');
			if (iamparticipant && count > 0){
				jtr.show();
				var
					uact = getUact(activity.act_id)
					,skills = uact.impression ? uact.impression.skills : 0 
				;	// the same in activity, but more straightforward to collect all
				viewActImpr_part1(jtr.find('.my_datatable'), skills);
			} else {
				jtr.hide();
			}
			jtbl.show();
			
			// onclick of the tds
			$('#tr_actpage_impression .my_datatable>tbody>tr>td').click(function(e){
				
				var sametable = g_curr_inline_jtr && g_curr_inline_jtr.closest('table').find($(this)).length > 0;
				var bExpanded = checkExpanded($(this));
				var
					jtd1 = $(this).closest('tr').find('td:first-child'),
					jtd2 = $(this).closest('tr').find('td:last-child'),
					//ass_id = parseInt(jtd1.html().split('-->')[0].split('<!--')[1]),
					skill_name = jtd1.text(),
					jtbl = jtd1.closest('table'),
					dt_type = jtbl.attr('dt_type'),
					role = dt_type.split('_')[1]	// .substring(0, 4),
					jtbl2 = jtbl.closest('table'),
					markable = jtbl2.attr('markable') == 1
				;
				// call the action
				console.debug(role, skill_name);
				switch (role){
					case 'coor1':		viewActImpr_coor2(skill_name, jtd2);	break;
					case 'assr1':		viewActImpr_assr2(skill_name, jtd2, markable, assessees);	break;
					case 'part1':		viewActImpr_part2(skill_name, jtd2);	break;
				}
				
				// switch icon +/-
				switch (role){
					case 'coor1':	case 'assr1':	case 'part1':
						var jdiv = jtd2.find('.div_but_special i');
						if (jdiv.length){
							var jdiv = jtd2.find('.div_but_special i');
							if (role == 'part1' && sametable){
								// don't over do it
							} else if (!bExpanded){
								setGlyphicon(jdiv, 'minus');
							} else {
								setGlyphicon(jdiv, 'plus');
							}
						}
						break;
				}

				
			});
			
		});
		
		
		
	}
}

