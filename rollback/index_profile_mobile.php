<div id="mobile_profile">
	<table class="user_info">
		<tr>
			<td class="td_tbl_photo2" style="text-align:center">
			
				<!--PHOTO and BUTTON--->
				<table class="tbl_photo" style="display:inline; text-align:center;">
					<tr>
						<td style="padding-right:10px; text-align:center; width:1px;">
							<img id="profile_photo" class="custom_photo myinfo_photo" src="">
						</td>
						<td>
							<table>
								<tr>
									<td>
										<span class="btn_change btn btn-primary div_input_file" style="width:90px; margin-bottom:8px;">
											<i class="glyphicon glyphicon-picture"></i> Change
											<input id="inp_user_photo" class="input_file" name="input_file" type="file" accept="image/*"/>
										</span>
									</td>
								</tr>
								<tr>
									<td>
										<span class="btn_preview btn btn-primary" onclick="openUserPage(g_user_id)" style="width:90px; margin-bottom:8px;">
											<i class="glyphicon glyphicon-eye-open"></i> Preview
										</span>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
				
			</td>
		</tr>
		<tr>
		<tr>
			<td valign="top">
			
				<!--USER INFO--->
				<table class="tbl_user_info">
					<tr>
						<td style="width:10px">
							<img src="./images/profile_username.png" title="Name"/>
							
						</td>
						<td>
							<div class="editable" style="font-weight:bold; font-size:20px"
								data-name="username"
								data-mode="inline"
								data-type="text"
								data-title="Enter your name"
								data-emptytext="Your name"
								data-inputclass="input_username"
								data-placement="bottom"
								data-showbuttons="bottom"					
							></div>
						</td>
					</tr>
					
					<tr>
						<td>
							<img src="./images/profile_position.png" title="Position"/>
							
						</td>
						<td>
							<div class="editable"
								data-name="position"
								data-mode="inline"
								data-type="text"
								data-title="Please enter your current position"
								data-emptytext="Your current position"
								data-inputclass=""
								data-placement="bottom"
								data-showbuttons="bottom"
							></div>
						</td>
					</tr>
					
					<tr>
						<td>
							<img src="./images/profile_location.png" title="Location"/>
							
						</td>									
						<td>
							<div class="editable"
								data-name="location"
								data-mode="inline"
								data-type="text"
								data-title="Please enter your current location"
								data-emptytext="Your current location"
								data-inputclass=""
								data-placement="bottom"
								data-showbuttons="bottom"
							></div>
						</td>
					</tr>
					
					<tr>
						<td>
							<img src="./images/profile_mood.png" title="Mood"/>
							
						</td>									
						<td>
							<div
								class="editable"
								data-type="text"
								
								idx="editable_mood"												
								data-typex="typeaheadjs"
								data-pkx="1"
								
								data-name="mood"
								data-mode="inline"
								data-title="Please enter your mood"
								data-emptytext="Your current mood"
								data-inputclass=""
								data-placement="bottom"
								data-showbuttons="bottom"
							></div>
						</td>
					</tr>

					<tr>									
						<td>
							<img src="./images/profile_relationship.png" title="Glue"/>
							
						</td>									
						<td>
							<div class="editable"
								data-name="relationship"
								data-mode="inline"
								data-type="text"
								data-title="Please enter your relationship"
								data-emptytext="Your current relationship"
								data-inputclass=""
								data-placement="bottom"
								data-showbuttons="bottom"
							></div>										
						</td>
					</tr>
					
				</table>
			</td>
		</tr>
			
		<tr>						
			<td colspan="2">
				<div style="padding:10px"><u><b>Generic Skills</b></u></div>
				<table id="tbl_skills_profile" class="tbl_skills display round"></table>
			</td>
		</tr>
		
		<tr>
			<td colspan="2">
				<canvas id="cvs_skills_profile" class="canvas_chart" width="220" height="220"></canvas>
			</td>
		</tr>

	</table>
</div>
