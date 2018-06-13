<table width="100%" class="layout_box" style="background:#e0e0e0">
	<thead>
	
		<tr>
			<td id="eva_title" style="font-weight:bold">
			</td>
			<td id="eva_date" align="right">
			</td>
		</tr>

		<tr>
			<td id="eva_task" colspan="2" style="padding:10px 0px;">
			</td>
		</tr>
		
		
		
	</thead>
	<tr>
		<td colspan="2">
			<table id="tbl_eva" class="layout_box datatable tbl_assessor" cellspacing="0" cellpadding="5" style="width:100%">
			
				<thead>
					<tr>
						<td width="32">
							&nbsp;
						</td>
						<td>
							Name
						</td>
						<td width="100">
							Assessment
						</td>
						<td width="100" align="center">
							Marks %
						</td>
						<td width="200">
							Open comments
						</td>
					</tr>
				</thead>
				
				<tbody>
					<tr>
						<td width="32">
							<img src="./people/m01.jpg" width="32"/>
						</td>
						<td>
							Wilson Lee
						</td>
						<td width="100">
							<button class="medium_button open_assessment_button" nowrap style="width:150px">Open Assessment</button>
						</td>
						<td align="center" width="100">
							<input class="assessment_spinner" value="0" style="width:25px"/>
						</td>
						<td width="200">
							<textarea class="layout_box assess_comment" style="resize:none;width:200px" rows="1">Good work!</textarea>
						</td>
					</tr>

					<tr>
						<td>
							<img src="./people/f08.jpg" width="32"/>
						</td>
						<td>
							Marianna Chan
						</td>
						<td>
							<button class="medium_button open_assessment_button" nowrap style="width:150px">Open Assessment</button>
						</td>
						<td align="center">
							<input class="assessment_spinner" value="0" style="width:25px"/>
						</td>
						<td>
							<textarea class="layout_box assess_comment" style="resize:none;width:200px" rows="1">Well done!</textarea>
						</td>
					</tr>
				</tbody>
			</table>
		</td>
	</tr>
	<tr>
		<td colspan="2">
			<table cellspacing="10" align="center">
				<tr>
					<td align="center">
						<button class="medium_button" onclick="openSearchActivity()">Save</button>
					</td>
					<td align="center">
						<button class="medium_button" onclick="openSearchActivity()">Send</button>
					</td>
					<td align="center">
						<button class="medium_button" onclick="openSearchActivity()">Back</button>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
