function getUassRoles(uass){
	var roles = [];
	if (uass.uass_coordinator == "1"){
		roles.push('coordinator');
	}
	if (uass.uass_assessor == "1"){
		roles.push('assessor');
	}
	if (uass.uass_participant == "1"){
		roles.push('participant');
	}
	return '<b>Role' + (roles.length>1?'s':'') + ':</b> ' + capitalizeWords(roles.join(', '))
}