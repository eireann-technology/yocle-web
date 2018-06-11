<div id="web_home" class="web_layout">
	<table width="100%">
		<tr>

			<td valign="top" width="100">
				<table>
					<tr>
						<td class="td_myinfo_photo">
						<img id="home_photo" class="custom_photo myinfo_photo" src=""/>
						</td>
					</tr>
					<tr>
						<td class="td_hr">
						</td>
					</tr>
					<tr>
						<td class="td_tbl_gauge">
							<table border="0" class="tbl_gauge"  cellspacing="0" cellpadding="0">
								<tr>
									<td style="text-align:center">
										<span class="text_gsscore">GS Score</span>
									</td>
								</tr>
								<tr>
									<td>
										<div>
											<canvas id="cvs_gauge_home" class="canvas_gauge"></canvas>
											<div class="div_gauge div_gauge1"></div>
										</div>
									</td>
								</tr>
							</table>
						</td>
					</tr>
					<tr>
						<td class="td_hr">
						</td>
					</tr>
					<tr>
						<td class="td_tbl_userstat">
							<?php $id="1"; include 'index_userstat.php'?>
						</td>
					</tr>
				</table>
			</td>

			<td class="td_user_skills" rowspan="2" valign="top">

				<table class="user_info">
					<tr>
						<td class="user_info_col1" colspan="10" align="center" valign="top" style="text-align:center">
							<img id="home_photo" class="custom_photo myinfo_photo" src=""/>
						</td>
					</tr>

					<tr>
						<td style="width:10px">
							<img src="./images/profile_username.png"/>
						</td>
						<td>
							<span class="myinfo_username" style="font-weight:bold; font-size:20px"></span>
						</td>
					</tr>

					<tr>
						<td style="width:10px">
							<img src="./images/profile_birthday.png"/>
						</td>
						<td>
							<span class="myinfo_birthday"></span>
						</td>
					</tr>

					<tr>
						<td>
							<img src="./images/profile_position.png"/>
						</td>
						<td>
							<span class="myinfo_position"></span>
						</td>
					</tr>

					<tr>
						<td>
							<img src="./images/profile_location.png"/>
						</td>
						<td>
							<span class="myinfo_location"></span>
						</td>
					</tr>
					<tr>
						<td>
							<img src="./images/profile_mood.png"/>
						</td>
						<td>
							<span class="myinfo_mood"></span>
						</td>
					</tr>
					<tr>
						<td>
							<img src="./images/profile_relationship.png"/>
						</td>
						<td>
							<span class="myinfo_relationship"></span>
						</td>
					</tr>
				</table>

				<table class="user_skills" width="100%">
					<tr>
						<td>
							<div style="padding:10px 2px"><u><b>Generic Skills</b></u></div>
							<table id="tbl_skills_home" class="tbl_skills display round"></table>
						</td>
					</tr>
					<tr>
						<td align="center">
							<canvas id="cvs_skills_home" class="canvas_chart"></canvas>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
</div>
