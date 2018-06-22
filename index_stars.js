
///////////////////////////////////////////////////////////////////////////////////////////////////
// starRating
// jquery.star-rating-svg
// http://github.com/nashio/star-rating-svg
///////////////////////////////////////////////////////////////////////////////////////////////////

var g_star_opts = {
	readOnly: true,
  disableAfterRate: false,
  initialRating: 0,
	totalStars: 5,
	starSize: 14,
	strokeWidth: 3,
	strokeColor: 'black',
	starShape: 'rounded',
	emptyColor: 'lightgray',
	hoverColor: 'salmon',
	activeColor: '#ff6700',
	useGradient: false,
	//starShape: 'straight',
	//activeColor: 'cornflowerblue',
	//starGradient: { start: '#99ccff',	end: '#3399ff'},	// darker
	//starGradient: {start: '#bbeeff',	end: '#55bbff'},		// lighter
	callback: function(currentRating, $el){
	},
  onHover: function(currentIndex, currentRating, $el){
	},
	onLeave: function(currentIndex, currentRating, $el){
	},
};

/////////////////////////////////////////////

function getStarRating(stars){
	return '<!--' + stars + '--><div class="star_rating" data-rating="' + stars + '" title="' + stars + '"></div>';
}


/////////////////////////////////////////////////////////

function getTruncatedScore(stars){
	if (!stars || isNaN(stars)){
		stars = 0;
	}
	var
		stars_float = parseFloat(stars),
		stars_int = parseInt(stars),
		stars = stars_int,
		x = stars_float - stars_int
	;
	if (x >= 0.25 && x < 0.75){
		stars += .5;
	} else if (x >= 0.75){
		stars += 1;
	}
	return getDecPlace(stars, 1);
}

//////////////////////////////////////////////////////////////

function getStarsStatus(stars){
	if (stars == 'submitted'){
		return '<!--1---><span class="marks">' + g_string_submitted + '</span>';

	} else if (stars == 'Checked'){
		return '<!--4--->' + g_string_checked;

	} else if (isNaN(stars) || stars == '-'){
		//console.warn('undefined stars here');
		//return '-';
		return '<!--2-->' + g_string_pending;

	} else {
		return '<!--3---><!--' + (5 - stars) + '-->' + getDivStar(stars);
	}
}

/////////////////////////////////////////////////////////
/*
function getDisplayMarks(marks, bShowNumber){
	var s = '';
	if (marks == 'submitted'){
		s = '<span class="marks">' + g_string_submitted + '</span>';
	} else if (isNaN(marks) || marks == '-'){
		s = g_string_pending;
	} else {
		s = getStarsStatus(marks);
		if (bShowNumber) s += ' <span class="score_number">' + marks + '</span>';
	}
	return s;
}
*/
//////////////////////////////////////////////////////////////

function getDivStar(stars, label, showstext){
	stars = getTruncatedScore(stars);
	var
		label = !label ? '' : '<td class="stars_label">' + label + '</td>',
		startext = !showstext ? '' : ' <td class="stars_text">' + stars + '</td>',
		s = '<table class="tbl_stars">'
			+ '<tr>'
				+ label
				+ '<td class="stars_shape">'
					+ getStarRating(stars)	// with star_rating here
				+ '</td>'
				+ startext
			+ '</tr>'
		+ '</table>'
	;
	return s;
}


//////////////////////////////////////////////////////////////

function showDivStar(jdiv){
	var jratings = jdiv.find('.star_rating');
	console.log('showDivStar', 'x'+jratings.length);
	var editable = 1;
	jratings.each(function(){
		var
			jrating = $(this),
			stars = jrating.attr('data-rating'),
			jtbl = jrating.closest('.tbl_stars')
		;
		//console.log('showDivStar2', stars);
		setDivStarValue(jtbl, stars);
	});
}

//////////////////////////////////////////////////////////////

function setDivStarValue(jdiv, stars){
	console.log('setDivStarValue', stars);
	var
		jrating = jdiv.find('.star_rating'),
		jtbl = jrating.closest('.tbl_stars')
	;
	stars = getTruncatedScore(stars);
	jrating.attr('data-rating', stars);
	if (!jrating.find('.jq-star').length){
		jrating.starRating(g_star_opts);
	} else {
		jrating.starRating('setRating', stars);
	}
	jtbl.find('.stars_text').text(stars);
}


/////////////////////////////////////////////

function setStarRating(jstars, markable, stars, onchange){
	//console.log('setStarRating', jstars, markable, stars);
	if (jstars.length == 1){

		// for individual
		if (typeof(stars) == 'undefined' || stars == null){
			stars = jstars.attr('data-rating');
		}
		var stars_float = getTruncatedScore(stars);
		if (typeof(stars_float) != 'undefined'){
			jstars.attr('data-rating', stars_float);
		}
		//console.info('setStarRating', stars_float);
		//if (jstars.attr('star_inited') != 1){
			//jstars.attr('star_inited', 1);
		if (!jstars.find('.jq-star').length){
			var star_opts = jsonclone(g_star_opts);
			star_opts.readOnly = !markable;
			if (onchange){
				star_opts.callback = onchange;
			}
			jstars.starRating(star_opts);
			jstars.attr('data-rating', '');
			if (markable){
				jstars.find('.jq-star').css('cursor', 'pointer');
			}
		} else {
			jstars.starRating('setRating', stars_float);
		}
	} else {
		// for a group
		jstars.each(function(){
			setStarRating($(this), markable, stars, onchange);
		});
	}
}

/////////////////////////////////////////////////////////

function setStarAverage(jstars, jstars_av){
	var av_stars = getAverageStars(jstars);
	console.log('setStarAverage', av_stars);
	setStarRating(jstars_av, 0, av_stars);
}

/////////////////////////////////////////////////////////

function getAverageStars(jstars){
	var total = 0, count = 0;
	jstars.each(function(){
		var
			jstar = $(this),
			stars = jstar.starRating('getRating')
			//stars = $(this).attr('star_rating')
		;
		total += parseFloat(stars);
		count++;
	});
	return getTruncatedScore(total / count);
}
