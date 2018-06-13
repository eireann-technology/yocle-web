/////////////////////////////////////////////////////////////////////////////////////////////
// http://www.chartjs.org/docs/
var g_chart_cfg = {
	//responsive: false,
	type: 'radar',
	data: {
		labels: [],
		datasets: [{
			label: '',
			backgroundColor: "rgba(32,150,32,.2)",
			pointBackgroundColor: "rgba(220,220,220,1)",
			strokeColor: "rgba(102,45,145,1)",
			pointColor : "rgba(220,220,220,1)",				
			data: [],
		}],
	},
	options: {
		defaultFontSize: 20,	// not working, has to modify the inside
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			onComplete: null, // to be override 
		},
		legend: {
			position: 'top',
			fontSize: 30,
		},
		title: {
		},
		scale: {
			scaleShowLabels : true,
			
			lineArc: false,
			gridLines: {
				color: ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
			},
			angleLines: {
				display: true,
				lineWidth: 1,
			},
			pointLabels: {
				fontSize: 14,
			},
			ticks: {
				fontSize: 14,
				lineArc: false,
				beginAtZero: true,
				fixedStepSize: 1,
				stepSize: 1,
				maxTicksLimit: 5,
				max: 5,
				//backdropColor: 'red',
				backdropPaddingX: 20,	//Number	2	Horizontal padding of label backdrop
				backdropPaddingY: 10,
				showLabelBackdrop: false,
			},
		},
		onResize: null, // to be override
	},
};

var g_chart_arr = {};


///////////////////////////////////////////////////////////////////////////////////

function initSkillCanvas(){
}

/////////////////////////////////////////////////////////////////////////////////////////////////

var g_drawskillcanvastimer = 0;

function drawSkillCanvas(chart_id, skills, forced, onCompleted){

	//console.info('drawSkillCanvas', chart_id);//, skills);
	
	var jcvs = $('#' + chart_id),
		cvs = jcvs[0],
		jparent = jcvs.parent();
		
	jcvs.hide();

	var w0 = jparent.attr('data-w'),
		//h0 = jparent.attr('data-h'),
		w1 = jparent.outerWidth(),
		//h1 = jparent.outerHeight(),
		diff = Math.abs(w1 - w0)
	;
	if (w0 == '') w0 = 0;
	//var w2 = w1 - 24;
	var w2 = w1 - 16;
	var h2 = w2 * .75;
	
	// store the size
	jparent
		.attr('data-w', w2)
		.attr('data-h', h2)
	;
	//alert(jparent.outerHTML());
	//console.info(forced, w0, w1, diff);
	if (forced || !w0 || diff > 17){
		console.debug('drawSkillCanvas2: '+w1+', '+h2);

		// destroy the previous one
		if (g_chart_arr[chart_id]){
			g_chart_arr[chart_id].destroy();
			g_chart_arr[chart_id] = 0;
		}
		// clear previous timer
		if (g_drawskillcanvastimer){
			clearTimeout(g_drawskillcanvastimer);
			g_drawskillcanvastimer = 0;
		}		
		// create a new one
		if (forced){
			drawSkillCanvas2(chart_id, skills);
			onCompleted && onCompleted();
		} else {
			//var onCompleted2 = onCompleted;
			g_drawskillcanvastimer = setTimeout(function(){
				drawSkillCanvas2(chart_id, skills);
				//onCompleted2 && onCompleted2();
			}, 500);
		
/*
				(function(onCompleted) {
						g_drawskillcanvastimer = setTimeout(function() {
							drawSkillCanvas2(chart_id, skills);
							onCompleted && onCompleted();
						}, 500);
				})(onCompleted);				
*/			
		}
	} else if (!g_drawskillcanvastimer){
		//console.info('drawSkillCanvas2: '+w1+', '+h2, diff);		
		jcvs.show();
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////

function drawSkillCanvas2(chart_id, skills){
	//alert('drawSkillCanvas2');

	// DEFAULT
	Chart.defaults.global.responsive = true;
	Chart.defaults.global.legend.display = false;
	
	// FIND ALL THE LABELS AND SCORES
	var 
		labels1 = [], scores1 = [],
		labels2 = [], scores2 = []
	;
	for (var name in skills){
		var	skill = skills[name];
		labels1.push(name);
		scores1.push(skill.score);
		if (skill.show){
			labels2.push(name);
			scores2.push(skill.score);
		}
	}
	
	// DRAW IT NOW
	var jcvs = $('#' + chart_id),
		cvs = jcvs[0],
		jparent = jcvs.parent()
	;
	if (labels2.length < 3){
		
		// hide
		jparent.slideUp('', function(){
			jparent.hide();
		});
		g_drawskillcanvastimer = 0;
		
	} else {
		jparent.show();
		jparent.slideDown('', function(){
			// FIND THE OBJECT SIZE
			var
				w2 = parseInt(jparent.attr('data-w')),
				h2 = parseInt(jparent.attr('data-h'))
			;
			jcvs
				.width(w2)
				.height(h2)
				.css({
					display: 'inline-block',
					width:w2,
					height:h2,
					'max-width':w2,
					'max-height':h2,
				});
			//alert(jcvs.outerHTML());
			
			// FIND THE FONT SIZE
			var fontsize = w2 / 25;
			if (fontsize < 12){
				fontsize=  12;
			} else if (fontsize > 20){
				fontsize = 20;
			}

			// DECLARE THE CONFIG
			var cfg = jsonclone(g_chart_cfg);
			cfg.options.scale.ticks.fontSize = 
			cfg.options.scale.pointLabels.fontSize = fontsize;
			cfg.chart_id = chart_id;
			cfg.data.labels = labels2;
			cfg.data.datasets[0].data = scores2;
			cfg.options.animation.onComplete = function(){
				var chart_id = this.config.chart_id;
				g_chart_arr[chart_id].completed = 1;
				var jcvs = $('#'+chart_id);
				jcvs.css('display', 'inline-block');
			};
			g_chart_arr[chart_id] = new Chart(cvs, cfg);
			g_drawskillcanvastimer = 0;

		});
	}
}