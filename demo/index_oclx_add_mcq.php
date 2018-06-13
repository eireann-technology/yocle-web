<tr>
	<td>
		<input class="inp_text assessment_title" type="text" placeholder="Title..." value="GCSI MCQ"/>
	</td>
	<td>
		<?=getSelectMethod('MCQ')?>
	</td>
	<td align="center">
	 <input class="assessment_spinner" value="10"/>
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

<tr>
	<td colspan="8" width="900">
		<div class="div_details">

			<table width="100%" class="tbl_details">
				<tr>
					<td width="100%">
						<b>MCQ</b>
						<table width="100%" border="0">
							<tr>
								<td style="width:20px">
									&nbsp;
								</td>
								<td class="header" style="text-align:left">
									Questions
								</td>
								<td class="header multiple_choice">
									Correct
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
								<td colspan="3">
									<table width="100%" border="0">
										<tr>
											<td colspan="3">
												<textarea class="ta_question editor" rows="1">Do you know the capital city of South Korea?</textarea>
											</td>
											<td class="td_delete" valign="top">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
										
										<tr>
											<td class="mcq_letter">A.</td>
											<td>
												<textarea class="ta_question" rows="1">Seoul</textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s1q1" checked/>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">B.</td>
											<td>
												<textarea class="ta_question" rows="1">Busan</textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s1q1"/>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">C.</td>
											<td>
												<textarea class="ta_question" rows="1">Icheon</textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s1q1"/>
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
								<td colspan="3">
									<table width="100%" border="0">
										<tr>
											<td colspan="3">
												<textarea class="ta_question editor" rows="1">What is the population in South Korea?</textarea>
											</td>
											<td class="td_delete" valign="top">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
										
										<tr>
											<td class="mcq_letter">A.</td>
											<td>
												<textarea class="ta_question" rows="1">22.8 million</textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s2q1" checked />
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">B.</td>
											<td>
												<textarea class="ta_question" rows="1">40 million</textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s2q1"/>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">C.</td>
											<td>
												<textarea class="ta_question" rows="1">50 million</textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s2q1"/>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>

										<tr>
											<td class="mcq_letter">D.</td>
											<td>
												<textarea class="ta_question" rows="1">70 million</textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s2q1"/>
											</td>
											<td class="td_delete">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
									
									</table>
								</td>
							</tr>

							<!--QUESTION 3-->
							<tr>
								<td class="assessment_num" valign="top">
									3.
								</td>
								<td colspan="3">
									<table width="100%" border="0">
										<tr>
											<td colspan="3">
												<textarea class="ta_question editor" rows="1">What is the population in South Korea?</textarea>
											</td>
											<td class="td_delete" valign="top">
												<button class="icon_button but_trash"></button>
											</td>
										</tr>
										
										<tr>
											<td class="mcq_letter">A.</td>
											<td>
												<textarea class="ta_question" rows="1"></textarea>
											</td>
											<td class="multiple_choice">
												<input type="radio" name="s2q2" checked />
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
			
			<div style="height:5px"></div>

<!--
							<tr>
								<td>
									&nbsp;
								</td>
								<td class="assessment_num" valign="top" colspan="3">
									<input type="checkbox"/> Add feedback
								</td>
							</tr>
							
							<tr>
								<td>
									&nbsp;
								</td>
								<td colspan="2">
									<textarea class="editor" rows="1"></textarea>
								</td>
							</tr>
-->
			
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
		
		</div>

	</td>
</tr>

