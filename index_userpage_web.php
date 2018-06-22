<div id="web_userpage" class="web_layout">

	<button class="but_back_userpage btn btn-primary btn_icon" onclick="closeUserPage()">
			<i class="glyphicon glyphicon-arrow-left"></i> Back
	</button>

	<table width="100%" border="0">
		<tr>
			<!--COL#1: PHOTO, DESC, GAUGE AND STAT, SKILLS CHART AND TABLE-->
			<td valign="top" class="td_col">

				<div class="actpage_header">Information</div>

				<table class="tbl_col" cellspacing="0" cellpadding="0">
					<tr>
						<td valign="top" height="1">

							<!--PHOTO AND DESC-->
							<table width="100%" style="border-spacing: 10px;">

								<tr>
									<td class="td_photo" valign="top">
										<img id="userpage_photo" class="custom_photo photo" src=""/>
									</td>
								</tr>

								<tr>
									<td>
										<table class="tbl_userpage_info" width="100%">
											<tr>
												<td>
													<img src="./images/profile_username.png"/>
												</td>
												<td class="td_username">
													<span class="username" style="font-weight:bold; font-size:20px"></span>
												</td>
											</tr>

											<tr>
												<td style="width:10px">
													<img src="./images/profile_birthday.png"/>
												</td>
												<td class="td_birthday">
													<span class="birthday"></span>
												</td>
											</tr>

											<tr>
												<td>
													<img src="./images/profile_position.png"/>
												</td>
												<td class="td_position">
													<span class="position"></span>
												</td>
											</tr>
											<tr>
												<td>
													<img src="./images/profile_location.png"/>
												</td>
												<td class="td_location" style="width:100px">
													<span class="location"></span>
												</td>
											</tr>
											<tr>
												<td>
													<img src="./images/profile_mood.png"/>
												</td>
												<td class="td_mood" style="width:100px">
													<span class="mood"></span>
												</td>
											</tr>
											<tr>
												<td>
													<img src="./images/profile_relationship.png"/>
												</td>
												<td class="td_relationship" style="width:100px">
													<span class="relationship"></span>
												</td>
											</tr>
										</table>
									</td>
								</tr>
							</table>
						</td>
						<td valign="top">
							<table width="1">

								<tr>
									<td align="left">
										<button class="btn btn-primary but_editprofile but_userpage" onclick="editProfile()"><i class="glyphicon glyphicon-edit"></i> Edit Profile</button>
									</td>
								</tr>

								<tr>
									<td align="left">
										<button class="btn btn-primary but_print but_userpage" onclick="goPrintProfile()"><i class="glyphicon glyphicon-print"></i> Print Profile</button>
									</td>
								</tr>

								<tr>
									<td align="left">
										<button class="btn btn-primary but_logout but_userpage" onclick="goLogOut()"><i class="glyphicon glyphicon-log-out"></i> Log out</button>
									</td>
								</tr>


								<tr>
									<td align="center">
										<button class="btn btn-primary but_message but_userpage"><i class="glyphicon glyphicon-envelope"></i> Message</button>
									</td>
								</tr>

								<tr>
									<td class="td_tbl_gauge" align="center"></td>
								</tr>
								<tr>
									<td class="td_tbl_userstat"></td>
								</tr>
							</table>
						</td>
					</tr>

					<tr>
						<td colspan="2" valign="top">
							<!--SKILLS TABLE & AND CHART-->
							<table cellspacing="0" cellpadding="0" width="100%">
								<tr>
									<td class="td_div_canvas_userpage">
									</td>
								</tr>
								<tr>
									<td class="td_tbl_skills">
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</td>

			<!--COL#2: OCL-X-->
			<td valign="top" class="td_col">

				<div class="actpage_header">Participated</div>
				<div class="tbl_col">
					<div class="div_userpage_oclx div_slider"></div>
				</div>
			</td>

			<!--COL#3: YOLO-X-->
			<td valign="top" class="td_col">

				<div class="actpage_header">Self-Initiated</div>
				<div class="tbl_col">
					<div class="div_userpage_yolox div_slider"></div>
				</div>
				</table>
			</td>
		</tr>
	</table>
</div>
