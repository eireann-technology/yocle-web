
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
		
	<!--INFORMATION-->
	<div>
		<a class="cmenu_anchor" name="anchor_actedit_information">
			<div class="actpage_header">Photo</div>
		</a>
		<table class="act_info">
			<tr>
				<td>
					<img class="activity_photo_edit"/>
				</td>
				<td>
					<span class="btn btn-primary div_input_file" style="heightx:40px">
						<i class="glyphicon glyphicon-picture"></i> Change<!--<br> Activity Photo-->
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
		<div class="input_area" stylex="padding-top:2px">
			<div class="toggle_type toggle-light" ></div>
			<div class="toggle_type_text" nowrap></div>
		</div>
		
		<div class="section_separator"></div>
		
		<!--PERIOD-->	
		<div class="actpage_header">Period <span class="asterisk">*</span></div>
		<div class="input_area">
			<table class="tbl_period">
				<tr>
					<td nowrap class="text_start">
						Start:
					</td>
					<td>
						<input class="event_datetime start_datetime" value="2016/05/28 09:00"/>
					</td>
				</tr>
				<tr>
					<td nowrap class="text_end">
						End:
					</td>
					<td>
						<input class="event_datetime end_datetime" value="2016/06/28 09:00"/>
					</td>
				</tr>
			</table>
		</div>
		
		<div class="section_separator"></div>
		
		<!--DESCRIPTION-->	
		<div class="actpage_header">Description <span class="asterisk">*</span></div>
		<div class="div_act_desc input_area" valign="top">
			<div class="editable"
				data-name="activity_desc"
				data-mode="inline"
				data-type="wysihtml5"
				data-type-xxx="textarea"
				data-title="Enter the description of the activity"
				data-emptytext="The description of the activity"
				data-inputclass="input_wysihtml5"
				data-url=""
				show_trash="0"
				data-unsavedclass-xxx="unsavededitable"
				data-showbuttons="bottom"
				data-placement="bottom"
			></div>
		</div>

		<div class="section_separator"></div>
		
		<!--DESCRIPTION-->	
		<div class="actpage_header">Participants <span class="asterisk">*</span></div>
		<div class="div_participants input_area">
			<?php include 'find_users.php'?>	
		</div>

		<div class="section_separator"></div>
		
		<!--IMPRESSION-->	
		<div class="actpage_header">
			<table width="100%">
				<tr>
					<td>
						Skills Rating and Comments (Based on Peer Impression)
					</td>
					<td style="padding:4px 8px; width:1px;">
						<div class="toggle_impression toggle-light" style="margin-right:2px;"></div>												
					</td>
				</tr>
			</table>
		</div>
		
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
		
		<div id="div_edit_skills" class="input_area">
			<div class="subsection_header">Skills</div>
			<?php include 'find_skills.php'?>
			<div class="subsection_header">Assessors</div>		
			<?php include 'index_panelists.php'?>
		</div>
		<div class="section_separator"></div>

		<!--ASSESSMENTS-->
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
						<div class="btn btn-primary but_additem" style="font-size:12px"><span>Add</span></div>
					</td>
				</tr>
			</table>
			<table width="100%" border="0" class="my_datatable display nowrap" style="margin-top:6px; display:none" dt_type="assessments">
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

		<div class="section_separator"></div>
		
		<!--PHOTOS AND VIDEOS-->
		<table class="actpage_header actpage_header2">
			<tr>
				<td>
					Photos and Videos
				</td>
				<td width="10">
					<input class="uploader" type="file" accept="image/*; video/*; capture=camcorder" data-title="Add">
				</td>
			</tr>
		</table>
		<div class="uploader_gallery"></div>			
		
		<!--BUTTON PANEL-->
		<div class="btn_panel">
			<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button>
			<button class="btn_cancel btn btn-primary"><i class="glyphicon glyphicon-ban-circle"></i> Cancel</button>
			<button class="btn_clear btn btn-primary"><i class="glyphicon glyphicon-remove"></i> Clear</button>
			<button class="btn_save btn btn-primary"><i class="glyphicon glyphicon-ok"></i> Save</button>
			<button class="btn_delete btn btn-danger"><i class="glyphicon glyphicon-remove-circle"></i> Delete</button>
			<button class="btn_publish btn btn-success"><i class="glyphicon glyphicon-certificate"></i>	Publish</button>
			
			<!--<button class="btn_submit btn btn-success"><i class="glyphicon glyphicon-ok"></i>	Submit</button>-->
		</div>
	</div>
</div>
	
