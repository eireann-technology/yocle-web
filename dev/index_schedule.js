// dhtmlxschedule
// http://dhtmlx.com/
// http://docs.dhtmlx.com/scheduler/index.html
// http://docs.dhtmlx.com/scheduler/api__refs__scheduler.html
//
function initSchedule(){
	//scheduler.config.xml_date = "%Y-%m-%d %H:%i";
	//scheduler.init('div_scheduler', new Date(), "month");
	//scheduler.parse(
	//	[{text:"Meeting", start_date:"2016-09-24 15:00", end_date:"2016-09-26 17:00"}]
	//,"json");		
	
	//console.info(schedule_arr);
	scheduler.config.xml_date = "%Y-%m-%d %H:%i";
	scheduler.config.first_hour = 8;
	scheduler.config.limit_time_select = true;
	scheduler.config.drag_resize= false;
	scheduler.config.drag_highlight = false;
	scheduler.config.drag_create = false;
	scheduler.config.drag_move = false;
	scheduler.templates.event_class = function(start, end, event){
		//console.info(start, end, event);
		var css = "";
		if (event.type){ // if event has subject property then special class should be assigned
			css += "event_" + event.type;
		}
		if (event.id == scheduler.getState().select_id){
			css += " selected";
		}
		return css; // default return
	};
	// http://docs.dhtmlx.com/scheduler/api__scheduler_onclick_event.html
	scheduler.attachEvent("onClick", function (id){
		var eventObj = scheduler.getEvent(id);
		console.info(id, eventObj);
		viewActivity(eventObj.act_id);
		return false;	// prevent default action
  });	
	scheduler.attachEvent("onDblClick", function (id){
		return false;
  });	
	var jdiv = $('#div_scheduler');
	if (jdiv.length){
		var div_id = jdiv.attr('id');
		initResponsive(scheduler);
		scheduler.init(div_id, new Date(), "month");
	}
	//scheduler.clearAll();
	setTimeout(function(){
		refreshSchedule();
	}, 1000);
}

/////////////////////////////////////////////////////////////////////////////////////

function refreshSchedule(){
	
	var jdiv = $('#div_scheduler')
	if (jdiv.length){
		//var h = g_nScreenH - $('#div_topmenu').outerHeight() - $('#div_footer').outerHeight() - 50;
		//jdiv.height(h);
		//jdiv.height(900);
		jdiv.height(900);
		
		var schedule_arr = [];
		if (g_user && g_user.profile && g_user.profile.activity){
			var arr = g_user.profile.activity;
			for (var i = 0; i < arr.length; i++){
				var activity = arr[i];
				schedule_arr.push({
					act_id: activity.act_id,
					text: activity.title,
					start_date: activity.start,
					end_date: activity.end,
				});		
			}
		}
		scheduler.clearAll();
		scheduler.updateView();
		setTimeout(function(){
			scheduler.clearAll();
			scheduler.updateView();
			setTimeout(function(){
				scheduler.parse(schedule_arr, 'json');
				scheduler.updateView();
			}, 1);
		}, 1);
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////////////

function openSchedule2(){
	console.info('openSchedule');
	g_curr_user = 0;

	changeBodyView(TAB_SCHEDULE);
	refreshSchedule();
}