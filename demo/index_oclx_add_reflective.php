<tr>
	<td>
		<input class="inp_text assessment_title" type="text" placeholder="Title..." value="Self Reflective"/>
	</td>
	<td>
<?=getSelectMethod('Reflective Piece')?>
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
								<td style="width:100px" class="header">
									Min / Max
								</td>
							</tr>
							
							<tr>
								<td class="assessment_num" valign="top">
									1.
								</td>
								<td>
									<textarea class="ta_question editor" rows="1">Experience: What have you done and contribute?<br/> Briefly describe the activity that you want to reflect upon.<br/> Consider what happened and what part your played in it.</textarea>
								</td>
								<td valign="top" align="center">
									<input class="assessment_spinner" style="width:35px" value="300"/>
									<br/>/<br/>
									<input class="assessment_spinner" style="width:35px" value="500"/>
								</td>
								<td width="28" valign="top">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>
							
							<tr>
								<td class="assessment_num" valign="top">
									2.
								</td>
								<td>
									<textarea class="ta_question editor" rows="1">What went well?</textarea>
								</td>
								<td valign="top" align="center">
									<input class="assessment_spinner" style="width:35px" value="500"/>
									<br/>/<br/>
									<input class="assessment_spinner" style="width:35px" value="1000"/>
								</td>
								<td width="28" valign="top">
									<button class="icon_button but_trash"></button>
								</td>
							</tr>

							<tr>
								<td class="assessment_num" valign="top">
									3.
								</td>
								<td>
									<textarea class="ta_question editor" rows="1">Learning: What have you learnt?</textarea>
								</td>
								<td valign="top" align="center">
									<input class="assessment_spinner" style="width:35px" value="500"/>
									<br/>/<br/>
									<input class="assessment_spinner" style="width:35px" value="1000"/>
								</td>
								<td width="28" valign="top">
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
		</div>

	</td>
</tr>						