	<!--<div class="subsection_header">Assessors</div>-->
	
	<table class="tbl_panelists layout_box" border="0"> 

		<tr>
			<td>
				<input class="cb_coordinator" type="checkbox" checked />
			</td>
			<td>
				Coordinator
			</td>
		</tr>

		<tr>
			<td>
				<input class="cb_self" type="checkbox" checked />
			</td>
			<td>
				Self
			</td>
		</tr>

		<tr>
			<td valign="top">
				<input class="cb_peers" type="checkbox" checked />
			</td>
			<td>
				Peers
			</td>
		</tr>
		
		<tr class="tr_peers" style="display:none">
			<td>
				&nbsp;
			</td>
			<td	style="padding-left:4px">
				<div class="div_num_of_peers">
					(Number of peers:
					<select class="select_num_of_peers"></select>)
				</div>
			</td>
		</tr>

		<tr>
			<td valign="top">
				<input class="cb_others" type="checkbox" xchecked />
			</td>
			<td>
				Other assessors <span class="span_others_num"></span>
			</td>
		</tr>
		
		<tr class="tr_others">
			<td colspan="2"> 
				<div class="div_assessors">
					<?php include 'find_users.php'?>
				</div>
			</td>
		</tr>
	</table>
