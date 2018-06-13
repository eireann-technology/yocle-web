<table class="tbl_viewass_panel">
	<tr>
		<td colspan="2">
			<table width="100%">
				<tr>
					<td width="10">
						<button class="btn btn-primary btn_icon" onclick="goBack_asst()" style="width:70px"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
					</td>
					<td class="viewass_info" align="right"></td>
				</tr>
			</table>
		</td>
	</tr>
<!--
	<tr>
		<td class="viewass_title" colspan="99"></td>
	</tr>
-->
	<tr>
		<td width="100%">
			<input class="viewass_search" placeholder="Search participant..."/>
		</td>
		<td align="center" width="10">
			<select class="viewActPart_sel">
				<option>Sort by status</option>
				<option>Sort by name</option>
			</select>
		</td>
	</tr>
</table>

<table class="my_datatable display nowrap" dt_type="assessment_<?=$role?>" style="width:100%">
	<thead>
		<tr>
			<td>User ID</td>
			<td>Participants</td>
			<td>Status</td>
			<td>Action</td>
		</tr>
	</thead>
	<tbody>
	</tbody>
</table>
