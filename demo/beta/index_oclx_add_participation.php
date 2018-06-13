<tr>
	<td>
		<input class="inp_text assessment_title" type="text" placeholder="Title..." value="Practical Observation"/>
	</td>
	<td>
<?=getSelectMethod('Participation')?>
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
		<button class="details_button" onclick="toggleDetails(this)">Details</button>
	</td>
	<td>
		<button class="icon_button but_trash"></button>
	</td>
</tr>

<!--SURVEY 2-->
<tr>
	<td colspan="8">

		<div class="div_details">

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