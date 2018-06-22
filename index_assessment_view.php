<!--FOR ASSESSMENTS TO BE VIEWED, DONE, MARKED AND REVIEWED-->
<div class="div_asst_view bodyview_lvl3">

	<div>
		<table class="tbl_asspage_marks" cellspacing="0" cellpadding="0" width="100%">
			<tr>
				<td style="padding:8px">
					<button class="btn btn-primary btn-sm btn_icon" onclick="goBack_asst()" style="width:70px"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
				</td>
				<td class="asspage_marks" align="right">
					<div class="div_asst_stars"></div>
				</td>
			</tr>
		</table>

		<!--INFORMATION-->
		<a class="cmenu_anchor" name="anchor_assview_information">
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

		<!--MATERIAL-->
		<div class="div_assview_material">
			<a class="cmenu_anchor" name="anchor_assview_material">

				<div class="actpage_header">Material <div class="div_material_hdr">File formats: png, mp4, bmp, gif, jpg, mp3, pdf</div></div>

				<input class="uploader uploader_viewass_general" style="display:none" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">

			</a>
			<div class="div_indent">
				<div class="gallery_viewass_general"></div>
			</div>
			<div class="section_separator"></div>
		</div>

		<!--GENERIC SKILLS-->
		<div class="div_assview_skills">
			<a class="cmenu_anchor" name="anchor_assview_skills">
				<div class="actpage_header">Generic Skills and Learning Outcomes</div>
			</a>
			<div class="div_indent">
				<table class="my_datatable display nowrap" dt_type="skills">
					<thead>
						<tr>
							<td>
								Skill
							</td>
						</tr>
					</thead>
				</table>
			</div>
			<div class="section_separator"></div>
		</div>

		<!--ASSESSMENTS-->

		<!--ITEMS HEADER(OPTION 1)-->
		<div class="asspage_hdr_others asspage_hdr actpage_header">

			<a class="cmenu_anchor" name="anchor_assview_assessments"></a>

			<table width="100%">
				<tr>
					<td>
						Assessments
					</td>
					<td class="td_asst_add" width="1">
						<button class="btn btn-primary" style="width:80px">Add</button>
					</td>
				</tr>
			</table>
		</div>

		<!--ITEMS HEADER(OPTION 2)-->

		<div class="viewass_uploader_pst">
			<a class="cmenu_anchor" name="anchor_actview_photosvideos"></a>
			<table class="asspage_hdr_pst asspage_hdr tbl_asspage_media actpage_header" style="padding:0px; width:100%; border-spacing:0px;">
				<tr>
					<td>
						Assessments (Uploading Material) <div class="div_material_hdr">File formats: png, mp4, bmp, gif, jpg, mp3, pdf</div>
					</td>
					<td width="1">
						<input class="uploader_viewass_pst uploader" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">
					</td>
				</tr>
			</table>
		</div>

		<!--ITEMS HEADER(OPTION 3)-->
		<table class="asspage_hdr_blg asspage_hdr tbl_asspage_media actpage_header">
			<tr>
				<td>
					<a class="cmenu_anchor" name="anchor_actview_blog">
						Blog
					</a>
				</td>
				<td width="10">
					<button class="btn btn-primary but_additem" data-placement="left" style="font-size:12px" onclick="addBlogItem()">Add</button>
				</td>
			</tr>
		</table>

		<div class="div_indent" style="padding-left:0px">
			<!--TBL FOR ITEMS-->
			<table class="tbl_asspage_asst tbl_asspage_asst_general">
				<tbody>
				</tbody>
			</table>
			<div class="gallery_viewass_pst uploader_gallery tbl_asspage_asst tbl_asspage_asst_pst"></div>
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

		<div class="div_asspage_assessors div_indent">
			<!--PEER ASSESSORS-->
			<div class="div_peer_assessment">
				<?php include "index_peer_asst.php"?>
			</div>
			<!--ASSESSORS-->
			<span class="subsection_header ass_primaryassessors">Assessors</span>
			<table class="dt_all_assrs my_datatable display nowrap asspage_users" dt_type="users" style="width:100%">
				<thead>
					<td>Name</td>
				</thead>
			</table>
		</div>

		<div class="section_separator"></div>

		<!--BUTTON PANEL-->
		<div class="div_viewass_btn_panel btn_panel">
			<button class="btn_back btn btn-primary btn_icon"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
			<button class="btn_cancel btn btn-primary"><i class="glyphicon glyphicon-ban-circle"></i>	Cancel</button>
<!--
			<button class="btn_clear btn btn-primary"><i class="glyphicon glyphicon-remove"></i> Clear</button>
-->
			<button class="btn_save btn btn-primary"><i class="glyphicon glyphicon-ok"></i>	Save</button>
			<button class="btn_close btn btn-primary"><i class="glyphicon glyphicon-ok-circle"></i> Close</button>
			<button class="btn_submit btn btn-success"><i class="glyphicon glyphicon-send"></i> Submit Assessment</button>
			<button class="btn_resubmit btn btn-success" style="width:180px;"><i class="glyphicon glyphicon-send"></i> Request to resubmit</button>
		</div>
	</div>
</div>
