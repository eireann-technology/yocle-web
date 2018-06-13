
<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<thead>
		<tr>
			<td class="tab_title text_searchactivity">
				Search activity
			</td>
		</tr>
		<tr>
			<td>
				<table width="100%">
					<tr>
						<td>
							<?php $id = "inp_searchmyact"; $placheolder = 'Find in my activities';include "searchbar.php"?>
						</td>
						<td width="100">
							<table border="0" cellspacing="0" cellpadding="0" style="border-radius:8px; border:1px solid #e0e0e0; ">
								<tr>
									<td style="width:18px">
										<span class="svg_container" svg="pin" svgsize="18" svgfill="gray" style="cursor:pointer"></span>
									</td>
									<td style="width:18px; padding-right:0px;">
										<input id="cb_assessment" type="checkbox" xchecked />
									</td>
									
									<td style="width:18px">
										<span class="svg_container" svg="notice" svgsize="18" svgfill="gray" style="cursor:pointer"></span>
									</td>
									<td style="width:18px; padding-right:2px;">
										<input id="cb_notice" type="checkbox" xchecked />
									</td>
									
									<td style="width:18px">
										<span class="svg_container" svg="message" svgsize="18" svgfill="gray" style="cursor:pointer"></span>
									</td>
									<td style="width:18px; padding-right:0px;">
										<input id="cb_message" type="checkbox" xchecked />
									</td>
									
								</tr>
							</table>
						</td>
						<td align="right" width="120">
							<button class="medium_button text_togglealltask" onclick="toggleAllTasks(0)">Toggle all tasks</button>
						</td>
						<td align="right" width="120">
							<button class="medium_button text_createactivity" onclick="openCreateActivity()">Create activity</button>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</thead>
	
	<tbody>
		<tr>
			<td>
				<!--DATATABLE-->
				<table id="tbl_search_activity" class="datatable" style="width:100%">

					<thead id="thead_search_activity">
						<td>
							Type
						</td>
						<td>
							Title
						</td>
						<td>
							Role
						</td>
						<td>
							Start
						</td>
						<td>
							End
						</td>
						<td>
							Status
						</td>
						<td>
							&nbsp;
						</td>
					</thead>
					
					<tbody id="tbody_search_activity">
					</tbody>
				</table>
			</td>
		</tr>
	</tbody>
</table>

