<tr>
	<td colspan="8" width="900">

		<div class="div_details">

			<?php include "period.php"?>
			
			<table width="100%" class="tbl_details">
				<tr>
					<td width="100%">
						<table width="100%" border="0">
							<tr>
								<td style="width:20px">
									&nbsp;
								</td>
								<td class="header" style="text-align:left">
									Survey Questions
								</td>
								<td style="width:180px" align="center" class="header">
									Like scale
								</td>
							</tr>
							
							<tr>
								<td class="assessment_num" valign="middle">
									1.
								</td>
								<td>
									<textarea class="ta_question" rows="1">Did the student complete the tasks given in a satisfactory manner?</textarea>
								</td>
								<td style="text-align:center; padding-right:30px;" valign="top">
									<div class="ui-widget assessment_scale">
										<select class="assessment_combobox">
											<option>Yes/No</option>
											<option>Agreed/Disagreed</option>
											<option>1-3</option>
											<option selected>1-5</option>
											<option selected>Strongly agree-Strong disagree</option>
											<option>Always/Sometimes/No/Did not turn up/Others</option>
											<option>Open commnets</option>
										</select>
									</div>
								</td>
								<td width="28">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>
							
							<tr>
								<td class="assessment_num" valign="middle">
									2.
								</td>
								<td>
									<textarea class="ta_question" rows="1">Was the student able to communicate to the local community articulately?</textarea>
								</td>
								<td style="text-align:center; padding-right:30px;" valign="top">
									<div class="ui-widget assessment_scale">
										<select class="assessment_combobox">
											<option>Yes/No</option>
											<option>Agreed/Disagreed</option>
											<option>1-3</option>
											<option>1-5</option>
											<option selected>Strongly agree-Strong disagree</option>
											<option selected>Always/Sometimes/No/Did not turn up/Others</option>
											<option>Open commnets</option>
										</select>
									</div>
								</td>
								<td width="28">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>

							<tr>
								<td class="assessment_num" valign="middle">
									3.
								</td>
								<td>
									<textarea class="ta_question" rows="1">Please provide comments on the student’s generic skills.</textarea>
								</td>
								<td style="text-align:center; padding-right:30px;" valign="top">
									<div class="ui-widget assessment_scale">
										<select class="assessment_combobox">
											<option>Yes/No</option>
											<option>Agreed/Disagreed</option>
											<option>1-3</option>
											<option>1-5</option>
											<option>Always/Sometimes/No/Did not turn up/Others</option>
											<option selected>Open commnets</option>
										</select>
									</div>
								</td>
								<td width="28">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>
							
							
							
						</table>
					</td>
				</tr>
				<tr>
					<td align="center">
						<table class="tbl_footbar">
							<tr>
								<td align="center">
									<button class="medium_button">Add question</button>
									<button class="medium_button">Save template</button>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>

			<div style="height:5px"></div>

			<?php include "assessors.php"?>
			
		</div>

	</td>
</tr>						