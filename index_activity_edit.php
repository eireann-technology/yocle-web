
<div id="div_activity_edit" class="bodyview_lvl2">

	<div class="div_bodyview_header">
		<table>
			<tr>
				<td>
					<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeEditActivity()"/>
				</td>
				<td class="bodyview_title">Edit Activity</td>
			</tr>
		</table>
	</div>

	<div>

		<?php include "./index_activity_tabs.php" ?>

		<!--TAB#1: INFO-->
		<div class="div_editact div_editact_information">

			<a class="cmenu_anchor" name="anchor_actedit_information">
				<div class="actpage_header">Icon</div>
			</a>
			<table class="act_info">
				<tr>
					<td>
						<img class="activity_photo_edit"/>
					</td>
					<td>
						<span class="btn btn-primary div_input_file" style="heightx:40px">
							<i class="glyphicon glyphicon-picture"></i> Change
							<input id="inp_activity_photo" class="input_file" type="file" accept="image/*"/>
						</span>
					</td>
				</tr>
			</table>

			<div class="section_separator"></div>

			<!--TITLE-->
			<div class="actpage_header">Title <span class="asterisk">*</span></div>
			<div class="input_area">
				<div class="editable"
					data-name="activity_title"
					data-mode="inline"
					data-type="text"
					data-title="Enter the title of the activity"
					data-emptytext="The title of the activity"
					data-url=""
					show_trash="0"
					data-unsavedclass="unsavededitable"
					data-placement="bottom"
					data-showbuttons="bottom"
				></div>
			</div>

			<div class="section_separator"></div>

			<!--TYPE-->
			<div class="actpage_header">Type <span class="asterisk">*</span></div>
			<div class="input_area">
				<div class="toggle_type toggle-light" ></div>
				<!--<div class="toggle_type_text" nowrap></div>-->
			</div>

			<div class="section_separator"></div>

			<!--PERIOD-->
			<div class="actpage_header">Period <span class="asterisk">*</span></div>
			<div class="input_area div_tbl_period">
<!--
				<table class="tbl_period">
					<tr>
						<td nowrap class="text_start">
							Start:
						</td>
						<td>
							<input class="event_datetime start_datetime" value=""/>
						</td>
					</tr>
					<tr>
						<td nowrap class="text_end">
							End:
						</td>
						<td>
							<input class="event_datetime end_datetime" value=""/>
						</td>
					</tr>
				</table>
-->
			</div>

			<div class="section_separator"></div>

			<!--DESCRIPTION-->
<!--
			<div class="actpage_header">Description
				<span class="asterisk">*</span>
				<button id="but_tinymce_actdesc" class="btn btn-primary but_edititem">Edit</button>
			</div>
-->
<!--
			<table>
				<tr>
					<td class="actpage_header">Description</td>
					<td>
						<button id="but_tinymce_actdesc" class="btn btn-primary but_edititem">Edit</button>
					</td>
				</tr>
			</table>
-->
			<div class="div_ass_desc editact_media">
				<table class="actpage_header actpage_header2">
					<tr>
						<td>
							Description
						</td>
						<td width="10" style="padding:4px">
							<button id="but_tinymce_actdesc" class="btn btn-primary but_edititem">Edit</button>
						</td>
					</tr>
				</table>
			</div>
			<div id="div_tinymce_actdesc" class="div_tinymce_parent"></div>

			<div class="section_separator"></div>
		</div>

		<!--TAB#2: PARTICIPANTS-->
		<div class="div_editact div_editact_participants">

			<table class="actpage_header actpage_header2">
				<tr>
					<td>
						Participants <span class="asterisk">*</span> <span class="span_editact_npart"></span>
					</td>
<!--
					<td width="10">
						<button class="btn btn-primary but_import">Import</button>
					</td>
-->					
				</tr>
			</table>
			<div class="div_select_typeahead div_participants input_area" type="users">
				<?php include 'find_users.php'?>
			</div>
		</div>

		<!--TAB#3: RATING-->
		<div class="div_editact div_editact_impression">
			<div class="actpage_header">
				<table width="100%">
					<tr>
						<td>
							Rating and Feedback
						</td>
						<td style="padding:4px 8px; width:1px;">
							<div class="toggle_impression toggle-light" style="margin-right:2px;"></div>
						</td>
					</tr>
				</table>
			</div>

			<div id="div_editact_impression" class="input_area">

				<!--WEIGHTING OF IMPRESSION-->
				<table width="100%">
					<tr>
						<td style="white-space:nowrap; width:10px;">
							Weight:
						</td>
						<td class="td_basiclinked">
							<div id="edit_act_weight_imp" class="basicLinked"></div>
						</td>
						<td style="white-space:nowrap; width:10px;">
							%
						</td>
						<td style="white-space:nowrap; width:10px;">
							<button class="but_left btn btn-sm"><i class="glyphicon glyphicon-chevron-left"></i></button>
						</td>
						<td style="white-space:nowrap; width:10px;">
							<button class="but_right btn btn-sm"><i class="glyphicon glyphicon-chevron-right"></i></button>
						</td>
					</tr>
				</table>

				<div class="subsection_header">Skills</div>
				<div class="div_select_typeahead" type="skills">
					<?php include 'find_skills.php'?>
				</div>
				<div class="subsection_header">Assessors</div>
				<?php include 'index_panelists.php'?>
			</div>
			<!--<div class="section_separator"></div>-->

		</div>

		<!--TAB#4: ASSESSMENTS-->
		<div class="div_editact div_editact_assessment">

			<div class="div_editact_asslist">
				<div class="actpage_header">
					<table width="100%">
						<tr>
							<td>
								Assessments
							</td>
							<td style="padding:4px 8px; width:1px;">
								<div class="toggle_assessment toggle-light" style="margin-right:2px;"></div>
							</td>
						</tr>
					</table>
				</div>
				<div id="div_editact_asst" class="input_area">
					<!--WEIGHTING OF ASSESSMENTS-->
					<table width="100%" style="padding-bottom:10px">
						<tr>
							<td style="white-space:nowrap; width:10px;">
								Weight:
							</td>
							<td class="td_basiclinked">
								<div id="edit_act_weight_ass" class="basicLinked"></div>
							</td>
							<td style="white-space:nowrap; width:10px;">
								%
							</td>
							<td style="white-space:nowrap; width:10px;">
								<button class="but_left btn btn-sm"><i class="glyphicon glyphicon-chevron-left"></i></button>
							</td>
							<td style="white-space:nowrap; width:10px;">
								<button class="but_right btn btn-sm"><i class="glyphicon glyphicon-chevron-right"></i></button>
							</td>
						</tr>
					</table>

					<table id="tbl_assessment" width="100%" border="0" class="layout_box lightbar" style="border-spacing:10px">


						<tr>
							<td style="width:70px; padding-left:8px">
								<span class="assessment_header">Method:</span>
							</td>
							<td style="width:200px">
								<select class="select_methods" style="width:100%"></select>
							</td>
							<td>
								&nbsp;
							</td>
							<td align="center" style="width:40px;">
								<button class="btn btn-primary but_additem" style="font-size:12px">Add</button>
							</td>
						</tr>
					</table>

					<table width="100%" border="0" class="dynamic_sliders my_datatable display nowrap" style="margin-top:6px; display:none" dt_type="assessments">
						<thead>
							<tr>
								<td>Method</td>
								<td>Title</td>
								<td>&nbsp;</td>
								<td>&nbsp;</td>
								<td>&nbsp;</td>
							</tr>
						</thead>
					</table>
				</div>
			</div>

			<div class="div_editact_assedit">
				<?php include 'index_assessment_edit.php'?>
			</div>

		</div>

		<!--TAB#5: RUBRICS-->
		<div class="div_editact div_editact_rubrics">

			<div class="actpage_header">
				<table width="100%">
					<tr>
						<td>
							Rubrics
						</td>
					</tr>
				</table>
			</div>

			<div id="div_editact_rubrics" class="input_area"></div>

		</div>

		<!--TAB#6: MEDIA: PHOTOS AND VIDEOS-->
		<div class="div_editact div_editact_media">
			<table class="actpage_header actpage_header2">
				<tr>
					<td>
						Material <div class="div_material_hdr">File formats: png, mp4, bmp, gif, jpg, mp3, pdf</div>
					</td>
					<td width="10">
						<input id="uploader_editact" class="uploader" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">
					</td>
				</tr>
			</table>
			<div id="gallery_editact" class="uploader_gallery"></div>
		</div>

	</div>

	<!--BUTTON PANEL-->
	<div id="div_editact_btn_panel" class="btn_panel">
		<button class="btn_editact_view btn btn-success"><i class="glyphicon glyphicon-eye-open"></i> View Activity</button>

		<!--<button class="btn_editact_cancel btn btn-success"><i class="glyphicon glyphicon-ban-circle"></i> Cancel Unsaved</button>-->
		<button class="btn_editact_duplicate btn btn-primary"><i class="glyphicon glyphicon-duplicate"></i>	Duplicate</button>
		<button class="btn_editact_delete btn btn-danger"><i class="glyphicon glyphicon-remove-circle"></i> Delete</button>
		<button class="btn_editact_save btn btn-primary"><i class="glyphicon glyphicon-ok"></i> Save</button>

		<!--<button class="btn_editact_clear btn btn-success"><i class="glyphicon glyphicon-remove"></i> Clear</button>-->
		<button class="btn_editact_publish btn btn-primary"><i class="glyphicon glyphicon-edit"></i> Publish</button>

	</div>

</div>
