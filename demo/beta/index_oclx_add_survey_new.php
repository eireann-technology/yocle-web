<tr>
	<td>
		<input class="inp_text assessment_title" type="text" placeholder="Title..." value="Community Advisor Survey"/>
	</td>
	<td>
		<?=getSelectMethod('Survey')?>
	</td>
	<td align="center">
	 <input class="assessment_spinner" value="10" style="width:25px"/>
	</td>
	<td>
	 <input class="assessment_datetime" value="2016/05/28 09:00" style=" border-radius:8px; padding:4px; border:1px solid #c0c0c0"/>
	</td>
	<td>
	 <input class="assessment_datetime" value="2016/07/28 17:00" style=" border-radius:8px; padding:4px; border:1px solid #c0c0c0"/>
	</td>

	<td>
		<div class="ui-widget assessment_status">
			<select class="assessment_combobox">
				<option>Sent</option>
				<option>Saved</option>
			</select>
		</div>
	</td>
	<td>
		<button class="details_button" onclickx="toggleDetails(this)">Details</button>
	</td>
	<td>
		<button class="icon_button but_trash"></button>
	</td>
</tr>

<!--SURVEY 2-->
<tr>
	<td colspan="8" width="900">

		<div class="div_details">

			<table width="100%" class="tbl_details">
				<tr>
					<td width="100%">
						<b>Survey</b>
						<table width="100%" border="0">
							<tr>
								<td style="width:20px">
									&nbsp;
								</td>
								<td class="header" style="text-align:left">
									Questions
								</td>
								<td class="td_delete">
									&nbsp;
								</td>
							</tr>
							
							<!--QUESTION 1-->
							<tr>
								<td class="assessment_num" valign="top">
									1.
								</td>
								<td colspan="2">
									<table width="100%" border="0">
										<tr>
											<td colspan="2">
												<textarea class="ta_question editor" rows="1">Did the student complete the tasks given in a satisfactory manner?</textarea>
											</td>
											<td class="td_delete" valign="top">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
										
										<tr>
											<td class="mcq_letter">A.</td>
											<td>
												<textarea class="ta_question" rows="1">Always</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">B.</td>
											<td>
												<textarea class="ta_question" rows="1">Sometimes</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">C.</td>
											<td>
												<textarea class="ta_question" rows="1">Did not turn up</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">D.</td>
											<td>
												<textarea class="ta_question" rows="1">Others</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">E.</td>
											<td>
												<textarea class="ta_question" rows="1"></textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
										
									</table>
								</td>
							</tr>
							
							<!--QUESTION 2-->
							<tr>
								<td class="assessment_num" valign="top">
									2.
								</td>
								<td colspan="2">
									<table width="100%" border="0">
										<tr>
											<td colspan="2">
												<textarea class="ta_question editor" rows="1">Was the student able to communicate to the local community articulately?</textarea>
											</td>
											<td class="td_delete" valign="top">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
										
										<tr>
											<td class="mcq_letter">A.</td>
											<td>
												<textarea class="ta_question" rows="1">Always</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">B.</td>
											<td>
												<textarea class="ta_question" rows="1">Sometimes</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">C.</td>
											<td>
												<textarea class="ta_question" rows="1">Did not turn up</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">D.</td>
											<td>
												<textarea class="ta_question" rows="1">Others</textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>									
									</table>
								</td>
							</tr>

							<!--QUESTION -->
							<tr>
								<td class="assessment_num" valign="top">
									3.
								</td>
								<td>
									<textarea class="editor" rows="1">What are the main political differences between South Korea and North Korea?</textarea>
								</td>
								<td class="td_delete" valign="top">
									<button class="icon_button but_trash"></button>
								</td>								
							</tr>
							
							<tr>
								<td>
								</td>
								<td colspan="2">
									<table>
										<tr>
											<td class="mcq_letter">A.</td>
											<td>
												<textarea class="ta_question" rows="1"></textarea>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
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
								<td align="center" style="width:25%; text-align:center">
									<input type="checkbox"/>Random order
								</td>
								<td  style="width:25%; text-align:center; border-left:1px solid #c0c0c0">
									<button class="medium_button">Add question</button>
								</td>
								<td  style="width:25%; text-align:center; border-left:1px solid #c0c0c0">
									<button class="medium_button">Load template</button>
								</td>
								<td  style="width:25%; text-align:center; border-left:1px solid #c0c0c0">
									<button class="medium_button">Save template</button>									
								</td>
								</td>
							</tr>
						</table>
					</td>
				</tr>
				
			</table>
		
<!--		
			<table width="100%" class="tbl_details">
				<tr>
					<td width="100%">
						<b>Survey</b>
						<table width="100%" border="0">
							<tr>
								<td style="width:20px">
									&nbsp;
								</td>
								<td class="header">
									Questions
								</td>
								<td style="width:180px" align="center" class="header">
									&nbsp;
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
											<option selected>1-5</option>
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
									Open comments
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
									<button class="medium_button">Load template</button>
									<button class="medium_button">Save template</button>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
-->
			<div style="height:5px"></div>

			<table width="100%" class="tbl_details">
				<tr>
					<td width="100%">
						<b>Assessors</b>
					</td>
				</tr>
				<tr>
					<td>
						<table align="center">
							<tr>
								<td>
									<table>
										<tr>
											<td>
												<img src="./people/m03.jpg" class="photo_home"/>
											</td>
										</tr>
										<tr>
											<td class="person_name">
												Samson Chan
											</td>
										</tr>
									</table>
								</td>
								<td>
									<table>
										<tr>
											<td>
												<img src="./people/p01.jpg" class="photo_home"/>
											</td>
										</tr>
										<tr>
											<td class="person_name">
												Prof. David Jasper
											</td>
										</tr>
									</table>
								</td>
								<td>
									<table>
										<tr>
											<td>
												<img src="./people/p02.jpg" class="photo_home"/>
											</td>
										</tr>
										<tr>
											<td class="person_name">
												Janene Petit
											</td>
										</tr>
									</table>
								</td>
								<td>
									<table>
										<tr>
											<td>
												<img src="./people/p03.jpg" class="photo_home"/>
											</td>
										</tr>
										<tr>
											<td class="person_name">
												Juliana Altimari
											</td>
										</tr>
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
								<td style="border-right:2px solid #e0e0e0; text-align:center; width:25%">
									<input type="checkbox" checked/>Coordinator
								</td>
								<td style="border-right:2px solid #e0e0e0; text-align:center; width:25%">
									<input type="checkbox" checked/>Self
								</td>
								<td style="border-right:2px solid #e0e0e0; text-align:center; width:25%">
									<input type="checkbox" checked/>Peer
									<span>(Min. <input class="assessment_spinner" value="5" style="width:25px"/>)</span>
								</td>
								<td style="text-align:center; width:25%">
									<button class="medium_button">Add Assessor(s)</button>
								</td>
							</tr>
						</table>
						
					</td>
				</tr>
			</table>
<!--			
			<div style="height:5px"></div>

			<table width="100%" class="tbl_details">
				<tr>
					<td align="center">
						<button class="medium_button">Load template</button>
						<button class="medium_button">Save template</button>
					</td>
				</tr>
			</table>
-->			
		</div>

	</td>
</tr>						