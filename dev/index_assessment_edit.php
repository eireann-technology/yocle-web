<!--METHOD: UPPER PART-->
<div id="div_asst_edit" class="bodyview_lvl3">

	<!--STICKY HEADER-->
	<div class="div_editass">

		<table>
			<tr>
				<td style="height: 60px; padding-top: 10px;">
					<div class="div_editass_heading"></div>
				</td>
			</tr>
		</table>

		<!--PERIOD-->
		<div class="actpage_header">Title</div>
		<div class="editable_parent">
			<div class="editable"
				data-name="assessment_title"
				data-mode="inline"
				data-type="text"
				data-title="Enter the title of the assessment"
				data-emptytext="The title of the assessment"
				data-inputclass="input_editable_text"
				data-url=""
				show_trash="0"
				data-showbuttons="bottom"
				data-placement="bottom"
			></div>
		</div>

		<div class="section_separator">&nbsp;</div>

		<!--DESCRIPTION-->
<!--
		<table>
			<tr>
				<td class="actpage_header">Description</td>
				<td>
					<button id="but_tinymce_assdesc" class="btn btn-primary but_edititem">Edit</button>
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
						<button id="but_tinymce_assdesc" class="btn btn-primary but_edititem">Edit</button>
					</td>
				</tr>
			</table>
		</div>
		<div id="div_tinymce_assdesc"></div>


		<div class="section_separator">&nbsp;</div>

		<div class="div_ass_desc editact_media">
			<table class="actpage_header actpage_header2">
				<tr>
					<td>
						Material <div class="div_material_hdr">File formats: png, mp4, bmp, gif, jpg, mp3, pdf</div>
					</td>
					<td width="10">
						<input id="uploader_editass" class="uploader" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">
					</td>
				</tr>
			</table>
			<div id="gallery_editass" class="uploader_gallery"></div>
		</div>

		<div class="section_separator">&nbsp;</div>

		<!--PERIOD-->
		<div class="actpage_header">Period</div>
		<div class="input_area div_tbl_period">
<!--
			<table class="tbl_period">
				<tr>
					<td nowrap class="text_start">
						Start:
					</td>
					<td>
						<input class="event_datetime start_datetime" value="">
					</td>
				</tr>
				<tr>
					<td nowrap class="text_end">
						End:
					</td>
					<td>
						<input class="event_datetime end_datetime" value="">
					</td>
				</tr>
			</table>
-->
		</div>

		<div class="section_separator">&nbsp;</div>

		<!--GENERIC SKILLS-->
		<div class="actpage_header" style="">Generic Skills</div>
		<div>
			<?php include 'find_skills.php'?>
		</div>

		<div class="section_separator">&nbsp;</div>

		<!--ITEMS-->
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

	</div>

</div>

<!--peer assessment (new: popup)-->

<div id="div_peer_assessment3" class="div_tmp">

	<span class="subsection_header">Peer Assessors</span>

	<table class="tbl_peer_assessment" style="background:white; border-radius:8px;" cellspacing="4" cellpadding="4" align="center">

		<tr class="tr_peer_asst_others">
			<td>
				Select the <span class="span_peers"></span> peer assessors out of the other <span class="span_participants"></span> participants.
			</td>
		</tr>

		<tr class="tr_peer_asst_all">
			<td colspan="2">
				All peers are assessors
			</td>
		</tr>

		<tr>
			<td>
				<table class="my_datatable display nowrap" dt_type="peer_assessors3" style="width:100%">
					<thead>
						<td>Name</td>
						<td>Select</td>
					</thead>
				</table>
			</td>
		</tr>

	</table>

	<div class="div_error_msg" style="color:red; text-align:center;">&nbsp;</div>

	<div id="div_peerassessment_btn_panel" style="text-align:center">
		<button class="btn_cancel btn-sm btn btn-primary"><i class="glyphicon glyphicon-ban-circle"></i> Cancel</button>
		<button class="btn_submit btn-sm btn btn-success"><i class="glyphicon glyphicon-ok"></i> Submit</button><br/>
		<button class="btn_selectall btn-sm btn btn-primary"><i class="glyphicon glyphicon-list"></i> Select all</button>
		<button class="btn_clear btn-sm btn btn-primary"><i class="glyphicon glyphicon-remove"></i> Clear	all</button>
	</div>
</div>
