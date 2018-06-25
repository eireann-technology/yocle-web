
<table width="100%" border="0" class="layout_box lightbar">
	<tr>
		<td style="padding:4px">
			<input type="text" placeholder="User names (enter emails for invitations; use commas to seperate)" class="my_tokenfield" tt_type="users"/>
		</td>
		<td align="center" valign="bottom" style="width:80px; padding-bottom:8px;">
			<table>
				<tr>
					<td>
						<button class="btn btn-primary but_import" onclick="import_users(this)">Import</button>
					</td>
					<td>
						<button class="btn btn-primary but_additem">Add</button>
					</td>
				</tr>
			</table>
		</td>
<!--
		<td align="center" style="width:80px; display:none">
		</td>
-->

	</tr>
</table>

<table width="100%" border="0" style="background:#ffffff; margin-top:6px;" class="my_datatable display" dt_type="users">
	<thead>
		<tr>
			<td class="table_header text_name">Name</td>
			<td>&nbsp;</td>
		</tr>
	</thead>
</table>
