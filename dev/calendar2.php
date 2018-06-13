<!DOCTYPE html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>Bootstrap layout</title>
	
	<script src="dhtmlxscheduler-alan.js" type="text/javascript" charset="utf-8"></script>
	<script src="dhtmlxscheduler_year_view.js" type="text/javascript" charset="utf-8"></script>
	<link rel="stylesheet" href="dhtmlxscheduler_flat.css" type="text/css" media="screen" title="no title" charset="utf-8">

	<script src="jquery-1.12.4.js" type="text/javascript" charset="utf-8"></script>

	<link rel="stylesheet" href="bootstrap-alan.css">
	<link rel="stylesheet" href="bootstrap-theme.css">
	<script src="bootstrap.js"></script>

	<style type="text/css">
/*	
		html, body{
			height:100%; 
			padding:0px;
			margin:0px;
		}
*/		
		.well {
			text-align: right;
		}
		.container-fluid #div_scheduler {
			height: 700px;
			width: 100%;
			border: 1px solid #cecece;
		}
		#div_scheduler {
			border-radius: 4px;
		}
		
	</style>
</head>
<body>
<div class="container-fluid">
<!--
	<div class="navbar navbar-inverse">
		<div class="navbar-header">
			<a class="navbar-brand" href="#">dhtmlxScheduler</a>
		</div>
	</div>
-->
	<table width="100%">
		<tr>
			<td align="center">
				<div class="dhx_cal_container panel" id="div_scheduler" style="width:800px;height:500px;">
					<div class="dhx_cal_navline">
						<div class="dhx_cal_prev_button">&nbsp;</div>
						<div class="dhx_cal_next_button">&nbsp;</div>
						<div class="dhx_cal_today_button"></div>
						<div class="dhx_cal_date"></div>
						<div class="dhx_cal_tab" name="day_tab"></div>
						<div class="dhx_cal_tab" name="week_tab"></div>
						<div class="dhx_cal_tab" name="month_tab"></div>
						<div class="dhx_cal_tab" name="year_tab"></div>
					</div>
					<div class="dhx_cal_header"></div>
					<div class="dhx_cal_data"></div>
				</div>
			</td>
		</tr>
	</table>				

<script type="text/javascript">

window.onload = function(){
	scheduler.config.xml_date = "%Y-%m-%d %H:%i";
	scheduler.config.first_hour = 8;
	scheduler.config.limit_time_select = true;
	scheduler.init('div_scheduler', new Date(), "month");
	scheduler.parse([
		{text:"Meeting", start_date:"2016-09-24 15:00", end_date:"2016-09-26 17:00"},
/*	
		{ start_date: "2014-06-30 09:00", end_date: "2014-06-30 12:00", text:"Task A-12458", section_id:1},
		{ start_date: "2014-06-30 10:00", end_date: "2014-06-30 16:00", text:"Task A-89411", section_id:1},
		{ start_date: "2014-06-30 10:00", end_date: "2014-06-30 14:00", text:"Task A-64168", section_id:1},
		{ start_date: "2014-06-30 16:00", end_date: "2014-06-30 17:00", text:"Task A-46598", section_id:1},

		{ start_date: "2014-06-30 12:00", end_date: "2014-06-30 20:00", text:"Task B-48865", section_id:2},
		{ start_date: "2014-06-30 14:00", end_date: "2014-06-30 16:00", text:"Task B-44864", section_id:2},
		{ start_date: "2014-06-30 16:30", end_date: "2014-06-30 18:00", text:"Task B-46558", section_id:2},
		{ start_date: "2014-06-30 18:30", end_date: "2014-06-30 20:00", text:"Task B-45564", section_id:2},

		{ start_date: "2014-06-30 08:00", end_date: "2014-06-30 12:00", text:"Task C-32421", section_id:3},
		{ start_date: "2014-06-30 14:30", end_date: "2014-06-30 16:45", text:"Task C-14244", section_id:3},

		{ start_date: "2014-06-30 09:20", end_date: "2014-06-30 12:20", text:"Task D-52688", section_id:4},
		{ start_date: "2014-06-30 11:40", end_date: "2014-06-30 16:30", text:"Task D-46588", section_id:4},
		{ start_date: "2014-06-30 12:00", end_date: "2014-06-30 18:00", text:"Task D-12458", section_id:4}
*/		
	],"json");
}
</script>
</body>