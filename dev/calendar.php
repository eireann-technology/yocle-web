<!doctype html>
<head>
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<title>Basic initialization</title>
	<script src="dhtmlxscheduler.js" type="text/javascript" charset="utf-8"></script>
	<link rel="stylesheet" href="dhtmlxscheduler.css" type="text/css" media="screen" title="no title" charset="utf-8">	
</head>


	
<style type="text/css">
/*
	html, body{
		margin:0px;
		padding:0px;
		height:100%;
		overflow:hidden;
	}
*/
</style>

<script type="text/javascript" charset="utf-8">
	function initCalendar(){
		scheduler.config.xml_date = "%Y-%m-%d %H:%i";
		scheduler.init('div_scheduler', new Date(), "month");
		scheduler.parse([
				{text:"Meeting", start_date:"2016-09-24 15:00", end_date:"2016-09-26 17:00"},
		],"json");		
	}
</script>

<body onload="initCalendar();">
	<table width="100%">
		<tr>
			<td align="center">
				<div id="div_scheduler" class="dhx_cal_container" style="width:600px; height:400px">
					<div class="dhx_cal_navline">
						<div class="dhx_cal_prev_button">&nbsp;</div>
						<div class="dhx_cal_next_button">&nbsp;</div>
						<div class="dhx_cal_today_button"></div>
						<div class="dhx_cal_date"></div>
						<div class="dhx_cal_tab" name="day_tab" style="right:204px;"></div>
						<div class="dhx_cal_tab" name="week_tab" style="right:140px;"></div>
						<div class="dhx_cal_tab" name="month_tab" style="right:76px;"></div>
					</div>
					<div class="dhx_cal_header">
					</div>
					<div class="dhx_cal_data">
					</div>
				</div>
			</td>
		</tr>
	</table>
</body>