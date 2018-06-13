<table width="100%" class="tbl_details">
	<tr>
		<td width="100%">
			<b class="text_assessors">Assessors</b>
		</td>
	</tr>
	<tr>
		<td>
			<table width="100%" border="0" class="layout_box" style="background:#f0f0f0">
				<tr>
					<td>
						<?php $id="inp_findassessors"; $placeholder = 'Find assessors'; include "searchbar.php"?>
					</td>
					<td style="width:120px; padding-right:10px">
						<button class="medium_button add_button"><span class="svg_container" svg="add_user" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_add" nowrap>Add</span></button>
					</td>
					<td style="border-left:1px solid #e0e0e0; width:150px" align="center">
						<button class="medium_button import_button"><span class="svg_container" svg="import" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_import" nowrap>Import</span></button>
					</td>
				</tr>
				
				<tr>
					<td colspan="3">
						<table width="100%" border="0" class="datatable" style="background:#f0f0f0">
						
							<thead>
								<tr>
									<td>
										&nbsp;
									</td>
									<td class="table_header text_name">
										Name
									</td>
									<td class="table_header text_desc">
										Description
									</td>
									<td>
										&nbsp;
									</td>
									<td>
										&nbsp;
									</td>
								</tr>
							</thead>
							
							<tbody>
								<tr>
									<td width="24">
										<img src="./people/p01.jpg" class="person_photo"/>
									</td>
									<td width="150">
										Prof. David Jasper
									</td>
									<td>
										Social Science HKU
									</td>
									<td width="100">
										<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
									</td>
									<td width="24">
										<button class="icon_button but_trash"></button>
									</td>													
								</tr>

								<tr>
									<td>
										<img src="./people/p02.jpg" class="person_photo"/>
									</td>
									<td>
										C. Lee
									</td>
									<td>
										Psychology HKU
									</td>
									<td width="100">
										<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
									</td>
									<td width="24">
										<button class="icon_button but_trash"></button>
									</td>													
								</tr>
								
							</tbody>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	
	<tr>
		<td align="center">
			<table class="tbl_footbar">
				<tr>
					<td style="border-right:2px solid #e0e0e0; text-align:center; width:30%">
						<input type="checkbox" checked/><span class="text_assessedbyself">Assessed by Self</span>
					</td>
					<td style="border-right:2px solid #e0e0e0; text-align:center; width:30%">
						<input type="checkbox" checked/><span class="text_assessedbycoordinator">Assessed by Coordinator</span>
					</td>
					<td style="text-align:center; width:40%">
						<input type="checkbox" checked/><span class="text_assessedbypeers">Assessed by Peers</span>
						<span>(<span class="text_min">Min.</span> <input class="assessment_spinner" value="5" style="width:25px"/>)</span>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
