/////////////////////////////////////////////////////////////////////////

function getServerDateTime(){
	var d = new Date();
	return d.getFullYear() + '-' + get2Digits(d.getMonth()+1) + '-' + get2Digits(d.getDate()) + ' ' +
		get2Digits(d.getHours()) + ':' + get2Digits(d.getMinutes())
		+ ':' + get2Digits(d.getSeconds())
	;
}


/////////////////////////////////////////////////////////////////////////////

function getTimeString(){
	var d = new Date();
	return get2Digits(d.getHours()) + ":" + get2Digits(d.getMinutes());
}

///////////////////////////////////////////////////////////////////////////////

function get2Digits(n) {
    return (n < 10 ? '0' + n : n).toString();
}

/////////////////////////////////////////////////////////////////////////////

function getDateString(){
	return '<div class="date_string">'
			+ getDateTimeString()
		+ '</div>'
	;
}

/////////////////////////////////////////////////////////////////////////

function getDateTimeString(){
	var d = new Date();
	return d.getFullYear() + '-' + get2Digits(d.getMonth()+1) + '-' + get2Digits(d.getDate()) + ' ' +
		get2Digits(d.getHours()) + ':' + get2Digits(d.getMinutes())
		//+ ':' + get2Digits(d.getSeconds())
	;
}

/////////////////////////////////////////////////////////////////////////

function getDateString2(){
	var d = new Date();
	return d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
}

/////////////////////////////////////////////////////////////////////////////

function getDateString_start(){
	//var d = new Date(new Date().getTime() + 24 * 3600000);
	var d = new Date();
	return get2Digits(d.getFullYear()) + '-' + get2Digits(d.getMonth()+1) + '-' + get2Digits(d.getDate()) + ' 09:00';
}

/////////////////////////////////////////////////////////////////////////////

function getDateString_end(){
	var d = new Date(new Date().getTime() + 672 * 3600000); // 4 weeks = 672 hours
	return get2Digits(d.getFullYear()) + '-' + get2Digits(d.getMonth()+1) + '-' + get2Digits(d.getDate()) + ' 18:00';
}


/////////////////////////////////////////////////////////////////////////////////////

function getUniformDateTime(datetime, bDateWithoutTime){
	if (bDateWithoutTime){
		datetime = getDateWithoutTime(datetime);
	}
	return datetime;
}

/////////////////////////////////////////////////////////////////////////////

function getDateWithoutTime(s){
	if (!s){
		return '';
	} else if (s.length > 10){
		// yyyy-mm-dd hh:mm:ss
		return s.substring(0, 10);
	} else {
		return s;
	}
}

/////////////////////////////////////////////////////////////////////////////

function getDateWithoutSecond(s){
	if (!s){
		return '';
	} else if (s.length >= 16){
		// yyyy-mm-dd hh:mm:ss
		return s.substring(0, 16);
	} else if (s.length == 8){
		return s.substring(0, 5);		
	} else {
		return s;
	}
}

/////////////////////////////////////////////////////////////////////////////////////

function getUniformPeriod(start, end, bDateWithoutTime){
	if (bDateWithoutTime){
		return getUniformDateTime(start,1) + ' - ' + getUniformDateTime(end,1);
	} else {
		return start + ' - ' + end;
	}
	
	// TIMESTAGE
	//var timestage = getTimeStage(start, end);
	//jdiv.find('.actpage_timestage').html('(' + timestage.desc + ')');
	
	//return s;
}

