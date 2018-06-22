/***********************************************
* Drop Down Date select script- by JavaScriptKit.com
* This notice MUST stay intact for use
* Visit JavaScript Kit at http://www.javascriptkit.com/ for this script and more
* WARNING -------------------------------------------------------!-
* This javascript has been modified by *bdhacker* for real life use
* ishafiul@gmail.com
* http://bdhacker.wordpress.com
***********************************************/

var monthtext=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sept','Oct','Nov','Dec'];

function date_get2digits(n){
	return (n < 10 ? '0' : '') + n;
}
function date_populate(dayfield, monthfield, yearfield){
	var today=new Date();
	var dayfield=document.getElementById(dayfield)
	var monthfield=document.getElementById(monthfield)
	var yearfield=document.getElementById(yearfield)
	// date
	for (var i=0; i<31; i++){
		dayfield.options[i]=new Option(i+1, date_get2digits(i+1))
	}
	dayfield.options[today.getDate() - 1].setAttribute('selected', 1); //select today's date
	// month
	for (var m=0; m<12; m++){
		monthfield.options[m] = new Option(monthtext[m], date_get2digits(m+1));
	}
	monthfield.options[today.getMonth()].setAttribute('selected', 1); //select today's month
	// year
	var thisyear=today.getFullYear()
	for (var y=0; y<100; y++){
			yearfield.options[y]=new Option(thisyear, thisyear)
			thisyear-=1
	}
	yearfield.options[0].setAttribute('selected', 1);
}

function get_birthday(dayfield, monthfield, yearfield){
	var dayfield=document.getElementById(dayfield)
	var monthfield=document.getElementById(monthfield)
	var yearfield=document.getElementById(yearfield)
	return yearfield.options[yearfield.selectedIndex].value + '-' + monthfield.options[monthfield.selectedIndex].value + '-' + dayfield.options[dayfield.selectedIndex].value;
}