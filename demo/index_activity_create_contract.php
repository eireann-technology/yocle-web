
<tr>
	<td colspan="8">

		<div class="div_details">

			<?php include "period.php"?>
			
			<table width="100%" class="tbl_details tbl_contract">
				<tr>
					<td colspan="3">
						<b>Terms</b>
					</td>
				</tr>
			
				<tr>
					<td width="20">
						1.
					</td>
					<td width="500">
						<textarea class="autogrow">My main goals of this learning experience are:</textarea>
					</td>
					<td>
						<button class="icon_button but_trash"></button>
					</td>
				</tr>
				
				<tr>
					<td>
						2.
					</td>
					<td>
						<textarea class="autogrow">My consequqnces if I don't meet my goals:</textarea>
					</td>
					<td>
						<button class="icon_button but_trash"></button>
					</td>
				</tr>
				
				<tr>
					<td>
						3.
					</td>
					<td>
						<textarea class="autogrow">Contribution / Outputs</textarea>
					</td>
					<td>
						<button class="icon_button but_trash"></button>
					</td>
				</tr>
				
				<tr>
					<td align="center" colspan="3">
						<table class="tbl_footbar">
							<tr>
								<td style="width:25%; text-align:center; border-left:0px solid #c0c0c0">
									<button class="medium_button">Add term</button>
								</td>
								<td style="width:25%; text-align:center; border-left:1px solid #c0c0c0">
									<button class="medium_button">Save template</button>									
								</td>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				
			</table>

			<div class="separator2"></div>

			<?php include "assessors.php"?>
	
			<div class="separator2"></div>
			
			<?php $title = "Generic Skills (Based On This Assessment)"; include "add_genericskills.php"?>
	
		</div>

	</td>
</tr>						