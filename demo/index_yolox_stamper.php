
<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td>
			<b>YOLO-X Stamper</b>
		</td>
	</tr>
	
	<tr>
		<td>
		
			<table class="datatable" style="width:100%">

				<thead>
					<td>
						Title
					</td>
					<td>
						Start date
					</td>
					<td>
						Due date
					</td>
					<td>
						SP <span class="svg_container" svg="stamp" svgsize="16" valign="middle" style="vertical-align:middle"></span>
					</td>
					<td align="center">
						Progress
					</td>
					<td>
						Status
					</td>
					<td>
						&nbsp;
					</td>
				</thead>
				
				<tbody>
				
					<tr>
						<td>
							Experiential Learning 2016
						</td>
						<td>
							15 May 2016
						</td>
						<td>
							30 May 2016
						</td>
						<td>
							Stamped
						</td>
						<td align="center">
							10/30
						</td>
						<td>
							Invited
						</td>
						<td>
							<button class="details_button" onclick="togglePage('#div_yolox_stamp1')">Stamp</button>
						</td>
					</tr>
				
					<tr>
						<td>
							Parachute Diving
						</td>
						<td>
							17 Jul 2016
						</td>
						<td>
							31 Jul 2016
						</td>
						<td>
							Stamped
						</td>
						<td align="center">
							35/45
						</td>
						<td>
							Invited
						</td>
						<td>
							<button class="details_button" onclick="togglePage('#div_yolox_stamp2')">Stamp</button>
						</td>
					</tr>
					
					<tr>
						<td>
							Volunteer & Community Service
						</td>
						<td>
							15 May 2016
						</td>
						<td>
							31 Jul 2016
						</td>
						<td>
							Stamped
						</td>
						<td align="center">
							30/38
						</td>
						<td>
							Invited
						</td>
						<td>
							<button class="details_button" onclick="togglePage('#div_yolox_stamp3')">Stamp</button>
						</td>
					</tr>
					
				</tbody>
				
			</table>
		
		</td>
	</tr>
</table>

<!--YOLO1-->
<div id="div_yolox_stamp1" class="display_page">
	<?php $title='Experiential Learning 2016'; $date='15 May 2016'; include "./assess.php"?>
</div>

<!--YOLO2-->
<div id="div_yolox_stamp2" class="display_page">
	<?php $title='Parachute Diving'; $date='17 Jul 2016'; include "./assess.php"?>
</div>

<!--YOLO3-->
<div id="div_yolox_stamp3" class="display_page">
	<?php $title='Volunteer & Community Service'; $date='15 May 2015'; include "./assess.php"?>
</div>