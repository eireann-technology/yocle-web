
<!--SURVEY 2-->
<tr>
	<td colspan="8">

		<div class="div_details">

			<?php include "period.php"?>
			
			<table width="100%" class="tbl_details">
							<thead>
								<td colspan="3">
									<b>Rubrics - Marking Scheme</b>
								</td>
							</thead>
			
				<tr>
					<td>
						
						<table border="0" align="center">
						
							<thead>
								<td>
									<b>Name</b>
								</td>
								<td>
									<b>Weight %</b>
								</td>
								<td>
								</td>
							</thead>
							
							<tr>
								<td class="assessment_num" valign="middle">
									<input type="text" class="inp_text" style="width:300px" value="Participation"/>
								</td>
								<td>
									<input type="text" class="assessment_spinner" value="70"/>
								</td>
								<td width="28">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>

							<tr>
								<td class="assessment_num" valign="middle">
									<input type="text" class="inp_text" style="width:300px" value="Leadership"/>
								</td>
								<td>
									<input type="text" class="assessment_spinner" value="20"/>
								</td>
								<td width="28">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>

							<tr>
								<td class="assessment_num" valign="middle">
									<input type="text" class="inp_text" style="width:300px" value="Q&A"/>
								</td>
								<td>
									<input type="text" class="assessment_spinner" value="10"/>
								</td>
								<td width="28">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>

							
						</table>
					</td>
				</tr>
				
				<tr>
					<td class="assessment_num" valign="middle" colspan="2" style="text-align:center">
						<button class="medium_button">Add rubric item</button>
					</td>
				</tr>
				
			</table>

			<div class="separator2"></div>

			<?php include "assessors.php"?>
	
		</div>

	</td>
</tr>						