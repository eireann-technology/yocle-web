<!--FOR ASSESSMENTS TO BE VIEWED, DONE, MARKED AND REVIEWED-->
<div id="div_assessment_view" class="bodyview_lvl3">
	
	<!--STICKY HEADER-->
	<div class="div_bodyview_header">
		<table>
			<tr>
				<td rowspan="2">
					<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeSkillBreakdown()"/>
				</td>
				<td class="bodyview_title">View Assessment</td>
			</tr>
			<tr>
				<td class="bodyview_title2">
				</td>
			</tr>
		</table>
	</div>
	
	<div>
		<table class="tbl_asspage_marks" cellspacing="0" cellpadding="0" width="100%">
			<tr>
				<td>&nbsp;</td>
				<td class="asspage_marks" align="right"></td>
			</tr>
		</table>
		
		<!--<div class="section_separator"></div>-->
		
		<!--INFORMATION-->
		<a class="cmenu_anchor" name="anchor_assview_information">
			<div class="actpage_header">Information</div>	
		</a>
		<div class="div_indent">
			<table cellspacing="0" cellpadding="6" align="center" style="width:100%;">
				<tr>
					<td class="asspage_title"></td>
				</tr>
				<tr>
					<td class="asspage_role"></td>
				</tr>
				<tr>
					<td class="asspage_participant"></td>
				</tr>
				<tr>
					<td class="asspage_period" align="left"></td>
					</td>
				</tr>
				<tr>
					<td class="asspage_status"></td>
				</tr>
			</table>
		</div>
		<div class="section_separator"></div>	
		
		<!--DESCRIPTION-->
		<a class="cmenu_anchor" name="anchor_assview_description">
			<div class="actpage_header">Description</div>	
		</a>	
		<div class="div_indent">		
			<div class="asspage_desc"></div>
		</div>
		<div class="section_separator"></div>	
		
		<!--GENERIC SKILLS-->
		<a class="cmenu_anchor" name="anchor_assview_skills">
			<div class="actpage_header">Generic Skills Involved</div>	
		</a>	
		<div class="div_indent">
			<table class="my_datatable display nowrap" dt_type="skills">
				<thead>
					<td>
						Skill
					</td>
				</thead>
			</table>
		</div>
		<div class="section_separator"></div>	

		<!--ASSESSMENTS-->	
		<a class="cmenu_anchor" name="anchor_assview_assessments"></a>
		
		<!--ITEMS HEADER(OPTION 1)-->
		<div class="asspage_header1 actpage_header">Assessments</div>	
	
		<!--ITEMS HEADER(OPTION 2)-->
		<table class="asspage_header2 tbl_asspage_media actpage_header" style="padding-top:0px;padding-bottom:0px;width:100%; border-spacing:0px;">
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
		
		<div class="div_indent" style="padding-left:0px">
			<!--TBL FOR ITEMS-->
			<table class="tbl_asspage_assessment">
				<tbody>
				</tbody>
			</table>
			<div class="div_asspage_prt"></div>
		</div>
		<div class="section_separator"></div>	
		
		<!--ASSESSORS-->
		<a class="cmenu_anchor" name="anchor_assview_assessors">
			<table class="actpage_header" width="100%">
				<tr>
					<td>
						<div>Assessors</div>
					</td>
					<td class="but_expand"></td>
				</tr>
			</table>			
		</a>
		<div id="div_asspage_assessors" class="div_indent">
		
			<!--PEER ASSESSORS-->
			<div class="div_peer_assessment"></div>
			
			<!--ASSESSORS-->
			<span class="subsection_header ass_primaryassessors">Assessors</span>
			<table class="my_datatable display nowrap asspage_users" dt_type="users" style="width:100%">
				<thead>
					<td>Name</td>
				</thead>
			</table>
		</div>
		<div class="section_separator"></div>	

		<!--BUTTON PANEL-->
		<div class="btn_panel">
			<button class="btn_back btn btn-primary"><i class="glyphicon glyphicon-arrow-left"></i>	Back</button>
			<button class="btn_cancel btn btn-primary"><i class="glyphicon glyphicon-ban-circle"></i>	Cancel</button>
			<button class="btn_clear btn btn-primary"><i class="glyphicon glyphicon-remove"></i> Clear</button>
			<button class="btn_save btn btn-primary"><i class="glyphicon glyphicon-ok"></i>	Save</button>
			<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button>
			<button class="btn_submit btn btn-success"><i class="glyphicon glyphicon-send"></i> Submit</button>
		</div>
	</div>
</div>