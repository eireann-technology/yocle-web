<div id="div_activity_list" class="bodyview_lvl1">
	<table>
		<tr>
			<td>
				<input id="inp_search_activity" class="search_box" style="width:100%" type="text" placeholder="Find activities..."/>
			</td>
			<td style="width:1px">
				<span class="btn btn-primary btn_createact" onclick="createActivity()">
					<span>Create activity</span>
				</span>
			</td>
		</tr>
	</table>

	<table id="dt_activity_list" class="my_datatable display" dt_type="activities">
		<thead>
			<td>Title</td>
<!--			
			<td>Type</td>
			<td>Role</td>
			<td>Status</td>
-->			
			<td>&nbsp;</td>
			<td>ACT_ID</td>
		</thead>
	</table>	

</div>