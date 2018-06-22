<table width="100%">

	<!--USER INFO-->
	<tr>
		<td>
			<table class="user_info">

				<tr>

					<td align="center" style="text-align:center">
						<img id="userpage_photo" class="custom_photo photo" src=""/>
					</td>

					<td>
						<table>
							<tr>
								<td align="center">
									<button class="btn btn-primary but_editprofile but_userpage" onclick="editProfile()"><i class="glyphicon glyphicon-edit"></i> Edit Profile</button>
								</td>
							</tr>

							<tr>
								<td align="center">
									<button class="btn btn-primary but_print but_userpage" onclick="goPrintProfile()"><i class="glyphicon glyphicon-print"></i> Print Profile</button>
								</td>
							</tr>

							<tr>
								<td align="center">
									<button class="btn btn-primary but_logout but_userpage" onclick="goLogOut()"><i class="glyphicon glyphicon-log-out"></i> Log out</button>
								</td>
							</tr>


							<tr>
								<td align="center">
									<button class="btn btn-primary but_message but_userpage"><i class="glyphicon glyphicon-envelope"></i> Message</button>
								</td>
							</tr>
						</table>

					</td>
				</tr>

				<tr>
					<td colspan="2">
						<table width="100%" style="border-spacing:4px">

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
	</tr>

	<tr>
		<td>
			<table align="center" cellspacing="0" cellpadding="0">


				<tr>
					<td>
						<!--USER STAT-->
						<?php $id="3"; include 'index_userstat.php'?>
					</td>


					<td>
						<!--GS STATUS-->
						<table border="0" class="tbl_gauge">

							<tr>
								<td style="text-align:center">
									<span class="text_gsscore">GS Score</span>
								</td>
							</tr>
							<tr>
								<td>
									<div>

										<canvas id="cvs_gauge_userpage" class="canvas_gauge" style="width:125px"></canvas>
										<div class="div_gauge div_gauge3"></div>

									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>

	<!--ROW#2: MY GS TBL & CANVAS-->
	<tr>
		<td>
			<table class="tbl_gskill_root" cellspacing="0" cellpadding="0" width="100%">
				<tr>
					<td class="td_tbl_skills" valign="top">
						<div class="div_tbl_skills">
							<table id="tbl_skills_userpage" class="tbl_skills display round" style="" cellspacing="0" cellpadding="0" chart_type="userpage">
							</table>
						</div>
					</td>
				</tr>
				<tr>
					<td valign="top" align="center">
						<div class="div_canvas_userpage">
							<canvas id="cvs_skills_userpage" class="canvas_chart" chart_type="userpage"></canvas>
						</div>
					</td>
				</tr>
			</table>

		</td>
	</tr>
</table>
