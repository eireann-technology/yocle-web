<div id="div_activity_view" class="bodyview_lvl2">

	<!--STICKY HEADER-->
	<div class="div_bodyview_header">
		<table>
			<tr>
				<td>
					<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeViewActivity()"/>
				</td>
				<td class="bodyview_title">View Activity</td>
			</tr>
		</table>
	</div>

	<div>
		<!--INFORMATION-->
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
							<td class="actpage_coordinator"></td>
						</tr>
						<tr>
							<td class="actpage_roles"></td>
						</tr>
						<tr>
							<td class="actpage_status"></td>
						</tr>
						<td>
							<div class="actpage_desc"></div>
						</td>					
					</table>
				</td>
			</tr>
		</table>

		<div class="section_separator"></div>
		
		<!--ASSESSMENTS-->
		<a class="cmenu_anchor" name="anchor_actview_assessment">
			<div id="view_act_title_ass" class="actpage_header">Assessments</div>
		</a>	
		<table width="100%">
			<tr id="tr_actpage_assessment">
				<td>
					<table style="width:100%">
						
						<tr id="tr_actpage_assessment_coordinator">
							<td class="td_indent">
								<span class="subsection_header">Statistics</span>
								<table class="my_datatable display nowrap" dt_type="assessment_coor1" style="width:100%">
									<thead>
										<td>Assessments</td>
										<td>&nbsp;</td>
	<!--									
										<td></td>
										<td>Assessments</td>
										<td>&nbsp;</td>
										<td>&nbsp;</td>
	-->										
									</thead>
								</table>
							</td>
						</tr>						
				
						<tr id="tr_actpage_assessment_assessor">
							<td class="td_indent">
								<span class="subsection_header">Markings</span>
								<table class="my_datatable display nowrap" dt_type="assessment_assr1" style="width:100%">
									<thead>
										<td>Assessments</td>
										<td>&nbsp;</td>
	<!--									
										<td></td>
										<td>Assessments</td>
										<td>Completed</td>
										<td>&nbsp;</td>
	-->										
									</thead>
								</table>
							</td>
						</tr>
						
						<tr id="tr_actpage_assessment_participant">
							<td class="td_indent">
								<span class="subsection_header">Assignments and Results</span>
								<table class="my_datatable display nowrap" dt_type="assessment_part1" style="width:100%">
									<thead>
	<!--									
										<td></td>
	-->										
										<td>Assessments</td>
										<td>Marks</td>
										<td>&nbsp;</td>
									</thead>
								</table>
							</td>
						</tr>
						
					</table>
				</td>
			</tr>
		</table>

		<div class="section_separator"></div>
		
		<!--IMPRESSION-->
		<a class="cmenu_anchor" name="anchor_actview_impression">
			<div id="view_act_title_imp" class="actpage_header">Skills Rating and Comments (Based on Peer Impression)</div>
		</a>
		<table width="100%">			
			<tr id="tr_actpage_impression">
				<td>
				
					<table style="width:100%" class="tbl_actpage_impression">
						<tr id="tr_actpage_impression_coordinator">
							<td class="td_indent">
								<span class="subsection_header">Statistics</span>
								<table class="my_datatable display nowrap" dt_type="impression_coor1" style="width:100%">
									<thead>
										<td>Skills</td>
										<td>&nbsp;</td>
									</thead>
								</table>
							</td>
						</tr>						
				
						<tr id="tr_actpage_impression_assessor">
							<td class="td_indent">
								<span class="subsection_header">Markings</span>
								<table class="my_datatable display nowrap" dt_type="impression_assr1" style="width:100%">
									<thead>
										<td>Skills</td>
										<td>Completed</td>
										<td>&nbsp;</td>
									</thead>
								</table>
							</td>
						</tr>
						
						<tr id="tr_actpage_impression_participant">
							<td class="td_indent">
								<span class="subsection_header">Results</span>
								<table class="my_datatable display" dt_type="impression_part1" style="width:100%">
									<thead>
										<td>Skills</td>
										<td>Score</td>
										<td>&nbsp;</td>
									</thead>
								</table>
							</td>
						</tr>						
						
						<tr id="tr_actpage_impression_peer_assessment">
							<td class="td_indent">
								<div class="div_peer_assessment"></div>
							</td>
						</tr>						

						<tr id="tr_actpage_impression_primary_assessors">
							<td class="td_indent">
								<!--EXPAND/COLLASE BUTTON-->
								<table width="100%">
									<tr>
										<td>
											<span class="subsection_header">Assessors</span>
										</td>
										<td class="but_expand"></td>
									</tr>
								</table>
								
								<div id="div_actpage_impression_assessors">
									<table class="my_datatable display nowrap actpage_users" dt_type="actpage_impression_assessors" style="width:100%">
										<thead>
											<td>Name</td>
										</thead>
									</table>
								</div>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>

		<div class="section_separator"></div>

		<!--PARTICIPANTS-->
		<a class="cmenu_anchor" name="anchor_actview_participants">
			<table class="actpage_header" width="100%">
				<tr>
					<td>
						<div>Participants</div>
					</td>
					<td class="but_expand"></td>
				</tr>
			</table>
		</a>
		<div id="div_actpage_participant">
			<table style="width:100%" class="tbl_participants">
				<tr>
					<td class="td_indent">
						<table class="my_datatable display nowrap actpage_users" dt_type="actpage_participants" style="width:100%">
							<thead>
								<td>Name</td>
							</thead>
						</table>
					</td>
				</tr>
			</table>
		</div>

		<div class="section_separator"></div>
		
		<!--PHOTOS AND VIDEOS-->
		<table class="actpage_header">
			<tr>
				<td>
					<a class="cmenu_anchor" name="anchor_actview_photosvideos">
						Photos and Videos
					</a>
				</td>
				<td width="10">
					<input class="uploader" type="file" accept="image/*; video/*; capture=camcorder" data-title="Add">
				</td>
			</tr>
		</table>
		
		<div class="uploader_gallery"></div>

		<div class="btn_panel">
			<button class="btn_delete btn btn-danger"><i class="glyphicon glyphicon-remove-circle"></i> Delete</button>
			<button class="btn_edit btn btn-primary"><i class="glyphicon glyphicon-edit"></i> Edit</button>
		</div>		
		
	</div>	
</div>
