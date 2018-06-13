
<!--SURVEY 2-->
<tr>
	<td colspan="8">

		<div class="div_details">

			<?php include "period.php"?>
			
			<table width="100%" class="tbl_details">
				<tr>
					<td width="500">
						<b>Rubrics - Marking Scheme</b>
					</td>
					<td width="80" align="right" nowrap>
						<b>Likert Scale:</b>
					</td>
					<td width="10" align="center">
						<select onchange="onChangeLikertScale(this)" style="border-radius:8px;padding:4px;">
							<option>3</option/>
							<option>4</option/>
							<option selected>5</option/>
						</select>
					</td>
				</tr>
				<tr>
					<td width="100%" colspan="3">
						<table class="tbl_participation" width="100%">
							<tbody>
								<tr>
									<td width="140" height="20" style="padding-left:4px">
										Item
									</td>
									<td width="70" height="20" style="padding-left:4px">
										Weight%
									</td>
									<td rowspan="100">
										<!--RUBRICS TABLE-->
										<table class="tbl_rubrics" width="100%">
											<tr>
												<td>
													Excellent
												</td>
												<td>
													Proficient
												</td>
												<td>
													Average
												</td>
												<td>
													Poor
												</td>
												<td>
													Unacceptable
												</td>
											</tr>
											<tr>
												<td>
													<textarea>The diagnosis skill is excellent.</textarea>
												</td>
												<td>
													<textarea>The diagnosis skill is proficient.</textarea>
												</td>
												<td>
													<textarea>The diagnosis skill is average.</textarea>
												</td>
												<td>
													<textarea>The diagnosis skill is poor.</textarea>
												</td>
												<td>
													<textarea>The diagnosis skill is unacceptable.</textarea>
												</td>
											</tr>
											<tr>
												<td>
													<textarea>The problem solving skill is excellent.</textarea>
												</td>
												<td>
													<textarea>The problem solving skill is proficient.</textarea>
												</td>
												<td>
													<textarea>The problem solving skill is average.</textarea>
												</td>
												<td>
													<textarea>The problem solving skill is poor.</textarea>
												</td>
												<td>
													<textarea>The problem solving is unacceptable.</textarea>
												</td>
											</tr>
											<tr>
												<td>
													<textarea>The communication is excellent.</textarea>
												</td>
												<td>
													<textarea>The communication is proficient.</textarea>
												</td>
												<td>
													<textarea>The communication is average.</textarea>
												</td>
												<td>
													<textarea>The communication is poor.</textarea>
												</td>
												<td>
													<textarea>The communication is unacceptable.</textarea>
												</td>
											</tr>
											<tr>
												<td>
													<textarea>The clinical skill is excellent.</textarea>
												</td>
												<td>
													<textarea>The clinical skill is proficient.</textarea>
												</td>
												<td>
													<textarea>The clinical skill is average.</textarea>
												</td>
												<td>
													<textarea>The clinical skill is poor.</textarea>
												</td>
												<td>
													<textarea>The clinical skill is unacceptable.</textarea>
												</td>
											</tr>
										</table>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" value="Diagnoisis"/>
									</td>
									<td>
										<input class="assessment_spinner" value="50" style="width:25px"/>
									</td>
								</tr>
								<tr>
									<td nowrap>
										<input type="text" value="Problem Solving"/>
									</td>
									<td>
										<input class="assessment_spinner" value="20" style="width:25px"/>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" value="Communication"/>
									</td>
									<td>
										<input class="assessment_spinner" value="20" style="width:25px"/>
									</td>
								</tr>
								<tr>
									<td>
										<input type="text" value="Clinical Skills"/>
										
									</td>
									<td>
										<input class="assessment_spinner" value="10" style="width:25px"/>
									</td>
								</tr>
							</tbody>
						</table>
					</td>
				</tr>
				<tr>
					<td class="assessment_num" valign="middle" colspan="3" style="text-align:center">
						<button class="medium_button">Add rubric item</button>
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