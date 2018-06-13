
///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getUact(act_id){
	var uact = 0;
	var activities = g_user.profile.activity;
	for (var i = 0; i < activities.length; i++){
		var activity = activities[i];
		if (activity.act_id == act_id){
			uact = activity;
			break;
		}
	}
	return uact;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getUactRoles(uact){
	// ROLES
	var roles = [];
	if (uact.uact_coordinator == "1"){
		roles.push('coordinator');
	}
	if (uact.uact_assessor == "1"){
		roles.push('assessor');
	}
	if (uact.uact_participant == "1"){
		roles.push('participant');
	}
	return '<b>Role' + (roles.length>1?'s':'') + ':</b> ' + capitalizeWords(roles.join(', '));
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

function getHighestUactRole(uact){
	var sRole = '';
	if (uact.uact_coordinator == "1"){
		sRole = 'Coordinator';
	} else if (uact.uact_assessor == "1"){
		sRole = 'Assessor';
	} else if (uact.uact_participant == "1"){
		sRole = 'Participant';
	}
	//console.info(uact, sRole);
	return sRole;
}