/////////////////////////////////////////////////////////////////////////////////////////////
// http://www.chartjs.org/docs/
	//Chart.defaults.global.responsive = true;
	//Chart.defaults.global.legend.display = false;

var g_chart_cfg = {
	responsive: false,
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
			duration: 10,
			onComplete: null, // to be override
		},
		legend: {
			display: false,
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
	//Chart.defaults.global.animation.duration = 10;
}

/////////////////////////////////////////////////////////////////////////////////////////////////

var g_drawskillcanvastimer = 0;

function drawSkillCanvas(chart_id, skills, forced, onCompleted){
	var jcvs = $('#' + chart_id),
		cvs = jcvs[0],
		jparent = jcvs.parent();

	jcvs.hide();

	var w0 = jparent.attr('data-w'),
		w1 = jparent.outerWidth() ? jparent.outerWidth() : w0,
		diff = 0
	;
	if (isNaN(w0)){
		w0 = 0;
	}
	if (isNaN(w1)){
		w1 = 0;
	}
	if (w0 && w1){
		diff = Math.abs(w1 - w0);
	} else {
		force = 1;
	}
	var w2 = w1 - 16;
	var h2 = w2 * .75;

	// store the size
	jparent
		.attr('data-w', w2)
		.attr('data-h', h2)
	;

	if (forced || !w0 || diff > 20){

		console.info('drawSkillCanvas', chart_id, w0, w1, w2, 'diff='+diff);
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
			}, 500);

		}
	} else if (!g_drawskillcanvastimer){
		jcvs.show();
	}
}

/////////////////////////////////////////////////////////////////////////////////////////////////
var MAX_LENGTH_DOTDOTDOT = 22;

function drawSkillCanvas2(chart_id, skills){
	console.log('drawSkillCanvas2', chart_id);

	// DEFAULT
	//Chart.defaults.global.responsive = true;
	//Chart.defaults.global.legend.display = false;

	// FIND ALL THE LABELS AND SCORES
	var
		labels1 = [], scores1 = [],
		labels2 = [], scores2 = []
	;
	for (var name in skills){
		var	skill = skills[name];
		var name2 = name;
		if (name2.length > MAX_LENGTH_DOTDOTDOT){
			name2 = name2.substring(0, MAX_LENGTH_DOTDOTDOT) + '...';
		}
		labels1.push(name2);
		scores1.push(skill.skill_stars);
		if (skill.show){
			labels2.push(name2);
			scores2.push(skill.skill_stars);
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
/*
			cfg.animation = false;
			cfg.options.animation.duration = 0;
			cfg.options.animation.duration = 0;
			cfg.options.animation.onComplete = function(){
				var chart_id = this.config.chart_id;
				if (g_chart_arr[chart_id]){
					g_chart_arr[chart_id].completed = 1;
				}
				var jcvs = $('#'+chart_id);
				jcvs.css('display', 'inline-block');
			};
*/
			if (g_chart_arr[chart_id]){
				console.log(g_chart_arr[chart_id]);
			}
			g_chart_arr[chart_id] = new Chart(cvs, cfg);
			g_drawskillcanvastimer = 0;

		});
	}
}
