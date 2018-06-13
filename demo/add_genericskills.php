
<table width="100%" border="0" class="tbl_skills1 tbl_details">
<?php
	if ($title != ""){
		echo "<tr><td><b>$title</b></td></tr>";
	}
?>	
	<tr>
		<td>
			<table width="100%" border="0" class="layout_box lightbar">
				<tr>
					<td style="vertical-align:middle;">
						<?=getSelectSkill('')?>
					</td>
					<td style="width:120px; padding-right:10px">
						<button class="medium_button" onclick="addSkill(this)"><span class="svg_container" svg="skill" svgfill="black" svgsize="16"></span><span class="text_add" nowrap>&nbsp; Add</span></button>
					</td>
					<td style="border-left:1px solid #e0e0e0; width:150px" align="center">
						<button class="medium_button import_button"><span class="svg_container" svg="import" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_import" nowrap>Import</span></button>
					</td>
				</tr>
			</table>		
		</td>
	</tr>

	<tr>
		<td>
			<table class="tbl_skills2" width="100%" border="0" classx="datatable" style="background:#f0f0f0" cellspacing="0">
<!--			
				<thead>
					<tr>
						<td class="table_header text_genericskills">
							Generic Skills
						</td>
						<td>
							&nbsp;
						</td>
						<td>
							&nbsp;
						</td>
					</tr>
				</thead>
-->				
				<tbody>
					<tr>
						<td>
							Organization
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
							Communication
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

<div class="separator2"></div>