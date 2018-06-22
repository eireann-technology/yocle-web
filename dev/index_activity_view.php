<div id="div_activity_view" class="bodyview_lvl2 div_transdiv_root">

	<div>

		<div class="viewact_title"></div>

		<?php include "./index_activity_tabs.php" ?>

		<!--TAB#1: INFO-->
		<div class="div_viewact div_viewact_information">
			<a class="cmenu_anchor" name="anchor_actview_information">
				<div class="actpage_header">Information</div>
			</a>
			<table class="act_info">
				<tr>
					<td>
						<img src="./images/new_activity.png" class="actpage_photo activity_photo custom_photo" style="width:100px; height:100px;"><br>
					</td>
				</tr>
				<tr>
					<td>
						<table width="100%" style="padding-bottom: 10px; border-spacing:10px;">

							<tr>
								<td>
									<button class="btn btn-primary but_message"><i class="glyphicon glyphicon-envelope"></i> Message</button>
								</td>
							</tr>

							<tr>
								<td class="actpage_title">
								</td>
							</tr>

							<tr>
								<td class="actpage_period"></td>
							</tr>

							<tr>
								<td class="actpage_status"></td>
							</tr>

							<tr>
								<td>
									<div class="actpage_desc"></div>
								</td>
							</tr>

							<tr>
								<td class="actpage_coordinator"></td>
							</tr>
							<tr>
								<td class="actpage_roles"></td>
							</tr>

						</table>
					</td>
				</tr>

				<tr>
					<td align="center">
						<table width="100%">
							<tr>

								<td width="50%" valign="top">
									<table class="tbl_myroles" cellpadding="0" cellspacing="0" style="border-spacing:8px;" valign="center" align="center">

										<tr>
											<td>
												<div class="userstat_text0 userstat_text2">
													Coordinator
												</div>
											</td>
										</tr>

										<tr>
											<td>
												<div class="userstat_text0 userstat_text3">
													Assessor
												</div>
											</td>
										</tr>

										<tr>
											<td>
												 <div class="userstat_text0 userstat_text4">
													 Participant
												 </div>
											</td>
										</tr>

									</table>
								</td>

								<td align="center" width="50%">
									<table border="0" class="tbl_gauge"  cellspacing="0" cellpadding="0">
										<tr>
											<td style="text-align:center">
												<span class="text_gsscore">Activity GS Score</span>
											</td>
										</tr>
										<tr>
											<td>
												<div>
													<canvas id="cvs_gauge_act" class="canvas_gauge" style="width:150px"></canvas>
													<div class="div_gauge div_gauge1"></div>
												</div>
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
						<table class="tbl_gskill_root" cellspacing="0" cellpadding="0" width="100%">
							<tr>
								<td>
									<b>Involved Generic Skills</b>
								</td>
							</tr>
							<tr>
								<td class="td_tbl_skills" valign="top">
									<div class="div_tbl_skills">
										<table id="tbl_skills_act" class="tbl_skills display round" style="" cellspacing="0" cellpadding="0" chart_type="userpage">
										</table>
									</div>
								</td>
							</tr>
							<tr>
								<td valign="top" align="center">
									<div class="div_canvas_act">
										<canvas id="cvs_skills_act" class="canvas_chart" chart_type="actpage"></canvas>
									</div>
								</td>
							</tr>
						</table>
					</td>
				</tr>

			</table>
		</div>

		<!--RATING AND FEEDBACK-->
		<div class="div_viewact div_viewact_impression">
			<a class="cmenu_anchor" name="anchor_actview_impression">
				<div id="view_act_title_imp" class="actpage_header">Rating and Feedback</div>
			</a>
			<table width="100%">

				<!--ASSESSMENT TABS-->
				<tr>
					<td>
						<?php include "./index_assessment_tabs.php" ?>
					</td>
				</tr>


				<tr id="tr_viewact_impression">
					<td>
						<?php include "./index_viewactimpr_all.php" ?>
					</td>
				</tr>
			</table>
		</div>

		<!--TAB#2: ASSESSMENTS-->
		<div class="div_viewact div_viewact_assessment">
			<a class="cmenu_anchor" name="anchor_actview_assessments">
				<div id="view_act_title_ass" class="actpage_header">Assessments</div>
			</a>
			<table width="100%">
				<tr id="tr_actpage_assessment">
					<td>
						<table style="width:100%">

							<!--ASSESSMENT TABS-->
							<tr>
								<td>
									<?php include "./index_assessment_tabs.php" ?>
								</td>
							</tr>

							<!--PARTICIPANT-->
							<tr id="tr_actpage_assessment_participant" class="tr_actpage_assessment">
								<td class="td_indent">
									<div id="div_viewass_part" class="div_transdiv">
										<div>
											<!--list-->
											<div>
												<span class="subsection_header">Assignments and Results</span>
												<table class="my_datatable display nowrap" dt_type="assessment_part1" style="width:100%">
													<thead>
														<td>Assessments</td>
														<td>Marks</td>
														<td>&nbsp;</td>
													</thead>
												</table>
											</div>
											<div>
												<!--performing-->
												<div class="div_viewass_participant">
													<?php include 'index_assessment_view.php'?>
												</div>
											</div>
										</div>
									</div>

								</td>
							</tr>

							<!--ASSESSOR-->
							<tr id="tr_actpage_assessment_assessor" class="tr_actpage_assessment">
								<td class="td_indent">

									<div id="div_viewass_assr" class="div_transdiv">

										<div>

											<!--assts-->
											<div>
												<span class="subsection_header">Markings</span>
												<table class="my_datatable display nowrap" dt_type="assessment_assr1" style="width:100%">
													<thead>
														<td>Assessments</td>
														<td>&nbsp;</td>
														<td>&nbsp;</td>
													</thead>
												</table>
											</div>

											<!--parts-->
											<div>
												<div class="div_viewass_viewpart">
													<?php $role="assr2"; include "index_activity_viewpart.php"?>
												</div>
											</div>

											<!--marking-->
											<div>
												<div class="div_viewass_assessor">
													<?php include 'index_assessment_view.php'?>
												</div>
											</div>
										</div>

									</div>

								</td>
							</tr>

							<!--COORDINATOR-->
							<tr id="tr_actpage_assessment_coordinator" class="tr_actpage_assessment">
								<td class="td_indent">

									<div id="div_viewass_coor" class="div_transdiv">
										<div>

											<div>
												<span class="subsection_header">Statistics</span>
												<table class="my_datatable display nowrap" dt_type="assessment_coor1" style="width:100%">
													<thead>
														<td>Assessments</td>
														<td>&nbsp;</td>
														<td>&nbsp;</td>
													</thead>
												</table>
											</div>

											<!--participants-->
											<div>
												<div class="div_viewass_previewing">
													<?php $role="coor2"; include 'index_assessment_view.php'?>
												</div>
												<div class="div_viewass_viewpart">
													<?php include "index_activity_viewpart.php"?>
												</div>
											</div>


											<div>
												<!--view marking-->
												<div class="div_viewass_coordinator">
													<?php include 'index_assessment_view.php'?>
												</div>
											</div>

										</div>
									</div>

								</td>
							</tr>


						</table>
					</td>
				</tr>
			</table>
		</div>


		<!--PARTICIPANTS-->
		<div class="div_viewact div_viewact_participants">

			<a class="cmenu_anchor" name="anchor_actview_participants">
				<table class="actpage_header" width="100%">
					<tr>
						<td>
							Participants <span class="div_viewact_npart"></span></div>
						</td>
					</tr>
				</table>
			</a>

			<div id="div_actpage_participant">
				<table style="width:100%" class="tbl_participants">
					<tr>
						<td class="td_indent">
							<table class="my_datatable display nowrap actpage_users" dt_type="actpage_participants" dt_num=".div_viewact_participants .div_viewact_npart" style="width:100%">
								<thead>
									<td>Name</td>
								</thead>
							</table>
						</td>
					</tr>
				</table>
			</div>
		</div>


		<!--PHOTOS AND VIDEOS-->
		<div class="div_viewact div_viewact_media">
			<table class="actpage_header">
				<tr>
					<td>
						<a class="cmenu_anchor" name="anchor_actview_photosvideos">
							Material <div class="div_material_hdr">File formats: png, mp4, bmp, gif, jpg, mp3, pdf</div>
						</a>
					</td>
					<td width="10">
						<input id="uploader_viewact" class="uploader" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">
					</td>
				</tr>
			</table>

			<div id="gallery_viewact" class="uploader_gallery"></div>
		</div>

		<div id="div_viewact_btn_panel" class="btn_panel">
			<button class="btn_viewact_edit btn btn-success"><i class="glyphicon glyphicon-edit"></i> Edit Activity</button>
			<button class="btn_viewact_export btn btn-success"><i class="glyphicon glyphicon-export"></i> Export to Excel</button>
			<button class="btn_viewact_submit btn btn-primary"><i class="glyphicon glyphicon-send"></i> Submit Assessment</button>
		</div>

	</div>
</div>
<!--
<iframe id="ifrm_export" style="display:none"></iframe>
-->
<div id="div_export" style="display:none"></div>
