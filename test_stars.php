<html>
<head>
	<link href="star-rating-svg.css" type="text/css" rel="stylesheet">
	<script src="jquery-3.1.1.js"></script>
	<script src="jquery.star-rating-svg.js"></script>
	<script src="index_common.js"></script>
	<script src="index_stars.js"></script>
	<script>
	
	
	window.onload = function(){
		
	g_star_opts = {
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
	var s = '<table width="100%" cellspacing="4" cellpadding="4">';
		for (var i = 0; i <= 5; i += .5){
			s +=
				'<tr>'
					+ '<td width="10">' + i + '</td>'
					+ '<td>' + getStarRating(i) + '</td>'
				'</tr>'
			;
		}
		s += '</table>';

		$(document.body).append(s);	
		
		$('.star_rating').each(function(){
			setStarRating($(this), 0, $(this).attr('data-rating'));
		});
	}
	</script>
</head>
<body>

</body>
</html>