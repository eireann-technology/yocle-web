<!--METHOD: UPPER PART-->
<div id="div_assessment_edit" class="bodyview_lvl3">

	<!--STICKY HEADER-->
	<div class="div_bodyview_header">
		<table>
			<tr>
				<td rowspan="2">
					<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeEditAssessment()"/>
				</td>
				<td class="bodyview_title">Edit Assessment</td>
			</tr>
			<tr>
				<td class="bodyview_title2">
				</td>
			</tr>
		</table>
	</div>		

	<div class="div_editass">
	
		<!--PERIOD-->
		<div class="actpage_header">Title</div>
		<div class="editable_parent">
			<div class="editable"
				data-name="assessment_title"
				data-mode="inline"
				data-type="text"
				data-title="Enter the title of the assessment"
				data-emptytext="The title of the assessment"
				data-inputclass="input_wysihtml5"
				data-url=""
				show_trash="0"
				data-unsavedclass-xxx="unsavededitable"
				data-showbuttons="bottom"
				data-placement="bottom"
			></div>
		</div>
	
		<div class="section_separator">&nbsp;</div>		
		
		<!--DESCRIPTION-->
		<div class="actpage_header" style="">Description</div>
		<div class="div_ass_desc editable_parent">
			<div class="editable"
				data-name="assessment_desc"
				data-mode="inline"
				data-type="wysihtml5"
				data-title="Enter the description of the assessment"
				data-emptytext="The description of the assessment"
				data-inputclass="input_wysihtml5"
				data-url=""
				show_trash="0"
				data-unsavedclass-xxx="unsavededitable"
				data-showbuttons="bottom"
				data-placement="bottom"
			></div>
		</div>
		<div class="section_separator">&nbsp;</div>
		
		<!--PERIOD-->
		<div class="actpage_header">Period</div>
		<table class="tbl_period">
			<tr>
				<td nowrap class="text_start">
					Start:
				</td>
				<td style="width:120px">
					<input class="event_datetime start_datetime" value="">
				</td>
			</tr>
			<tr>
				<td nowrap class="text_end">
					End:
				</td>
				<td style="width:150px">
					<input class="event_datetime end_datetime" value="">
				</td>
			</tr>
		</table>
		
		<div class="section_separator">&nbsp;</div>			
		<!--GENERIC SKILLS-->
		<div class="actpage_header" style="">Generic Skills</div>
		<div>
			<?php include 'find_skills.php'?>
		</div>
		<div class="section_separator">&nbsp;</div>	

		<!--ITEMS-->
		<!--<div class="div_ass_items"></div>-->
		<div class="div_edit_asst_items">
			<table class="actpage_header">
				<tr>
					<td class="actpage_items_label">
						Items
					</td>
					<td width="10">
						<button class="btn btn-primary but_additem" style="font-size:12px" onclick="createItem()"><span>Add</span></button>
					</td>
				</tr>
			</table>
			
			<!--LIKERT-->
			<table class="tbl_likert" style="width:100%; margin:8px;">
				<tr>
					<td><b><u>Rubrics</u></b></td>
					<td align="right">
						Likert scale:
						<select class="select_likert" onchange="onChangeLikertScale(this)" style="border-radius:8px; padding:4px; display:table-cell; text-align:right">
							<option>3</option/>
							<option>4</option/>
							<option selected>5</option/>
						</select>
					</td>
				</tr>
			</table>

			<!--ITEMS DATABLE-->
			<table class="my_datatable row-border order-column compact nowrap" dt_type="items" style="width:100%">
				<thead>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
				</thead>
			</table>
			
			<div class="section_separator">&nbsp;</div>
		</div>
		
		
		<!--PANELISTS-->
		<div class="actpage_header" style="">Assessors</div>
		<?php include 'index_panelists.php'?>
		
		<div class="div_separator">&nbsp;</div>		
		
		<!--BUTTON PANEL-->
		<div class="btn_panel">
			<button class="btn_back btn btn-primary" onclick="closeEditAssessment()"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
		</div>
	</div>

</div>

<!--peer assessment (new: inline)-->
<div id="div_peer_assessment2" class="div_tmp">							

	<span class="subsection_header">Peer Assessors</span>
	
	<table class="tbl_peer_assessment" style="background:white; border-radius:8px; width:100%;" cellspacing="4" cellpadding="4">
	
		<tr>
			<td class="td_message" style="padding-bottom:10px">
				Select <span class="span_peers"></span> peer assessors out of the <span class="span_participants"></span> participants.
			</td>
			<td align="right">
				<button class="btn_select btn-sm btn btn-primary" style="width:80px; margin-bottom: 10px;" data-placement="left"><i class="glyphicon glyphicon-th-list"></i> Select</button>
			</td>
		</tr>
		
		<tr>
			<td colspan="2">
				<table class="my_datatable display nowrap" dt_type="users" style="width:100%">
					<thead>
						<td>Name</td>
<!--					
						<td>User ID</td>
						<td>&nbsp;</td>
						<td>Name</td>
						<td>Email</td>
						<td>Position</td>
						<td>Status</td>
-->						
					</thead>
				</table>
			</td>
		</tr>
		
	</table>								
</div>

<!--peer assessment (new: popup)-->
<div id="div_peer_assessment3" class="div_tmp">

	<span class="subsection_header">Peer Assessors</span>
	
	<table class="tbl_peer_assessment" style="background:white; border-radius:8px;" cellspacing="4" cellpadding="4">
	
		<tr>
			<td>
				Select the <span class="span_peers"></span> peer assessors out of the <span class="span_participants"></span> participants.
			</td>
		</tr>
		
		<tr>
			<td>
				<table class="my_datatable display nowrap" dt_type="peer_assessors3" style="width:100%">
					<thead>
						<td>Name</td>
<!--					
						<td>User ID</td>
						<td>&nbsp;</td>
						<td>Name</td>
						<td>Email</td>
						<td>Position</td>
-->						
						<td>Select</td>
					</thead>
				</table>
			</td>
		</tr>
		
	</table>
	
	<div class="div_error_msg" style="color:red; text-align:center;">&nbsp;</div>
	
	<div style="text-align:center">
		<button class="btn_cancel btn-sm btn btn-primary" style="width:75px;"><i class="glyphicon glyphicon-ban-circle"></i> Cancel</button>
		<button class="btn_selectall btn-sm btn btn-primary" style="width:75px;"><i class="glyphicon glyphicon-list"></i> Select all</button>
		<button class="btn_clear btn-sm btn btn-primary" style="width:75px;"><i class="glyphicon glyphicon-remove"></i> Clear	</button>
		<button class="btn_submit btn-sm btn btn-success" style="width:75px;"><i class="glyphicon glyphicon-ok"></i> Submit</button>
	</div>
	
</div>
