var g_chart_samson1,
	g_chart_samson2,
	g_chart_chole1
;
function initRadarChart(jcanvas, jtbl, data, config, nRatedDisplay, bEditProfile){

	if (!jcanvas.length) return;
	var
		canvas = jcanvas[0],
		labels = Object.keys(data),
		scores = [],
		labels2 = [],
		scores2 = [],
		jparent = jcanvas.parent()
	;
	//console.debug(labels);
	for (var label in data){
		var score = data[label].score;
		scores.push(score);
	}
	for (var label in data){
		var
			show = data[label].show,
			score = data[label].score
		;
		if (show){
			labels2.push(label);
			scores2.push(score);
		}
	}
	config.data.labels = labels2;
	config.data.datasets[0].data = scores2;
	
	Chart.defaults.global.legend.display = false;
	chart = new Chart(canvas, config);
	
	// rating
	if (jtbl){
		jtbl.append('<tbody/>');
		
		var jtbody = jtbl.find('tbody');
		var s = '';
		for (var label in data){
			var
				gs = data[label],
				score = gs.score,
				ratedarr = gs.rated,
				bShow = gs.show
			;
			s += '<tr><td class="gs_label" nowrap>' + label + '</td>'
			s += '<td class="gs_score">' + score + '</td>'
			s += '<td align="right"><table><tr>';
			var bMore = 0;
			for (var i in ratedarr){
				if (i <= nRatedDisplay){
					var src = ratedarr[i];
					if (src == ''){
						s	+= '<td><span class="person_photo svg_container" svg="user"></span></td>';
					} else {
						s	+= '<td><img class="person_photo" src="./people/' + src + '.jpg"/></td>';
					}
				} else {
					bMore = 1;
					break;
				}
			}
			if (bMore){
				s += '<td><a class="fa fa-chevron-right"></a></td>';
			} else {
				s += '<td style="width:10px">&nbsp;</td>';
			}
			s	+= '</tr></table></td>'
			if (bEditProfile){
				s += '<td style="width:70px"><div class="toggle_showgs toggle-light"></div></td>';
			}
			s += '</tr>';
		}
		jtbody.append(s);
		
		drawSvg(jtbl.find('.svg_container'));
		
		if (bEditProfile){
			jtbl.find('.toggle_showgs')
				.toggles({
					drag: true, // allow dragging the toggle between positions
					click: true, // allow clicking on the toggle
					text: {
						on: 'Shown', // text for the ON position
						off: 'Hidden' // and off
					},
					on: true, // is the toggle ON on init
					animate: 150, // animation time (ms)
					easing: 'swing', // animation transition easing function
					checkbox: null, // the checkbox to toggle (for use in forms)
					clicker: null, // element that can be clicked on to toggle. removes binding from the toggle itself (use nesting)
					width: 70, // width used if not set in css
					height: 20, // height if not set in css
					type: 'compact' // if this is set to 'select' then the select style toggle will be used
				})
				.on('toggle', function(e, active) {
					var
						jobj = $(this),
						jtr = jobj.parent().parent(),
						label = jtr.find('td:first-child').text(),
						data = gs_samson,
						labels2 = [],
						scores2 = []
					;
					data[label].show = active?1:0;
					
					for (var label in data){
						//console.debug(label);
						var
							show = data[label].show,
							score = data[label].score
						;
						if (show){
							labels2.push(label);
							scores2.push(score);
						}
					}
					console.debug('toggle_showgs', labels2.length, labels2);
					var id = canvas.id, w = canvas.width, h = canvas.height;
					if (labels2.length < 3){
						$('#canvas_samson1, #canvas_samson2').css('visibility', 'hidden').slideUp();
					} else {
						$('#canvas_samson1, #canvas_samson2').css('visibility', 'visible').slideDown();
						config_samson.data.labels = labels2;
						config_samson.data.datasets[0].data = scores2;
						g_chart_samson1.update();
						g_chart_samson2.update();
					}
					// hide table in home
					$('#tbl_gs_samson1 > tbody > tr').hide();
					var bAlt = 0;
					for (var i in labels2){
						var label = labels2[i];
						var jtd = $('#tbl_gs_samson1 > tbody > tr > td:contains(' + label + ')')
						if (jtd){
							//console.debug(label, bAlt);
							jtd.parent().show().find('td').css('background-color', bAlt?'#e0e0e0':'#f0f0f0');
							bAlt = !bAlt?1:0;
						}
					}
					
				});//.data('toggles').toggle(true);
		}
	}
	return chart;
}	

/*
	// radar chat
	// https://codepen.io/Synvox/pen/iHbxE
  jcanvas.radarChart({
    color: [32,150,32],
    size: [700, 290],
    step: 1,
    title: 'My Generic Skills',
    scores: {
      "Creativity": 4.5,
      "Numeracy": 4,
      "Self-management": 4,
      "Information technology": 3.5,
      "Organization": 3,
    },
    showAxisLabels: true,
  });
*/
/*	
		// star rating
		var trs = '<tr><td class="gs_name">' + label + '</td><td class="gs_rating3" width="100"></td><td width="100"><button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button></td></tr>';
		jtbody.append(s);
		var jrating = jtbl.find('.gs_rating3');
		jrating.starRating({
			readOnly: true,
			disableAfterRate: false,
			initialRating: 0,
			totalStars: 5,
			starSize: 16,
			strokeWidth: 0,
			useGradient: false,		
			emptyColor: 'white',
			hoverColor: 'white',
			activeColor: 'forestgreen',		
			callback: function(currentRating, $el){
				//calcAvGauge(currentRating, $el);
			},
			onHover: function(currentIndex, currentRating, $el){
				//calcAvGauge(currentRating, $el);
			},
		});
		var i = 0;
		scores.forEach(function(rating){
			var jstar = jrating.eq(i++);
			jstar.starRating('setRating', rating);
		});
*/	