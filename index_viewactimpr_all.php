<table style="width:100%" id="tbl_actpage_impression">

	<tr id="tr_actpage_impression_participant" class="tr_actpage_impression">
		<td class="td_indent">

			<div class="div_viewimpr_participant div_transdiv">
				<div>

					<!--skills-->
					<div>
						<span class="subsection_header">Results</span>
						<table class="my_datatable display" dt_type="impression_part1" style="width:100%">
							<thead>
								<td>Skills</td>
								<td>Score</td>
								<td>&nbsp;</td>
							</thead>
						</table>
					</div>

					<!--detailed skills report-->
					<div>
						<table cellspacing="0" cellpadding="0" width="100%" style="margin-top: 8px;">
							<tr>
								<td style="padding:4px; width:1px;">
									<button class="btn btn-primary btn-sm btn_icon" onclick="goBack_impr()" style="width:70px"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
								</td>
								<td>
									<div class="div_rating_skill"></div>
								</td>
							</tr>
						</table>
						<table class="my_datatable display nowrap" dt_type="impression_part2" style="width:100%">
							<thead>
								<td>Assessment</td>
							</thead>
						</table>

					</div>
				</div>
			</div>
		</td>
	</tr>

	<tr id="tr_actpage_impression_assessor" class="tr_actpage_impression">
		<td class="td_indent">

			<div class="div_viewimpr_assessor div_transdiv">
				<div>

					<!--parts-->
					<div>
						<span class="subsection_header">Markings</span>

						<table class="tbl_viewass_panel">
							<tr>
								<td width="100%">
									<input class="viewass_search" placeholder="Search participant..."/>
								</td>
								<td align="center" width="10">
									<select class="viewActPart_sel">
										<option>Sort by status</option>
										<option>Sort by name</option>
									</select>
								</td>
							</tr>
						</table>

						<table class="my_datatable display nowrap" dt_type="impression_assr1" style="width:100%">
							<thead>
								<td>Participants</td>
								<td>Score</td>
								<td>&nbsp;</td>
							</thead>
						</table>
					</div>

					<!--markings-->
					<div>

						<table class="tbl_asstview" cellspacing="0" cellpadding="0" width="100%" style="margin-top: 8px;">
							<tr>
								<td style="padding:4px; width:80px;">
									<button class="btn btn-primary btn-sm btn_icon" onclick="goBack_impr()" style="width:70px"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
								</td>
								<td>
									<div class="div_rating_participant"></div>
								</td>
								<td style="width:80px">
									<!--<div class="star_rating star_rating_av"></div>-->
									<div class="part_impr_av_stars"></div>
								</td>
							</tr>
						</table>

						<table class="my_datatable display nowrap" dt_type="impression_assr2" style="width:100%">
							<thead>
								<td>Skills</td>
								<td>Score</td>
							</thead>
						</table>

						<div class="div_comments" contenteditable="true" placeholder="Comments"></div>

						<div class="div_datetime"></div>

					</div>

				</div>
			</div>
		</td>
	</tr>

	<tr id="tr_actpage_impression_coordinator" class="tr_actpage_impression">
		<td class="td_indent">

			<div class="div_viewimpr_coordinator div_transdiv">
				<div>

					<!--parts-->
					<div>
						<span class="subsection_header">Statistics</span>

						<table class="tbl_viewass_panel">
							<tr>
								<td width="100%">
									<input class="viewass_search" placeholder="Search participant..."/>
								</td>
								<td align="center" width="10">
									<select class="viewActPart_sel">
										<option>Sort by status</option>
										<option>Sort by name</option>
									</select>
								</td>
							</tr>
						</table>

						<table class="my_datatable display nowrap" dt_type="impression_coor1" style="width:100%">
							<thead>
								<td>Participants</td>
								<td>Score</td>
								<td>&nbsp;</td>
							</thead>
						</table>
					</div>

					<!--one's results review-->
					<div>

						<table class="tbl_asstview" cellspacing="0" cellpadding="0" width="100%" style="margin-top: 8px;">
							<tr>
								<td style="padding:4px; width:80px;">
									<button class="btn btn-primary btn-sm btn_icon" onclick="goBack_impr()" style="width:70px"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
								</td>
								<td>
									<div class="div_rating_participant"></div>
								</td>
								<td style="width:80px">
									<div class="part_impr_av_stars"></div>
								</td>
							</tr>
						</table>

						<table class="my_datatable display nowrap" dt_type="impression_coor2" style="width:100%">
							<thead>
								<td>Skills</td>
								<td>Score</td>
							</thead>
						</table>
					</div>

					<!--one's skill review-->
					<div>

						<table cellspacing="0" cellpadding="0" width="100%" style="margin-top: 8px;">
							<tr>
								<td style="padding:4px; width:1px;">
									<button class="btn btn-primary btn-sm btn_icon" onclick="goBack_impr()" style="width:70px"><i class="glyphicon glyphicon-arrow-left"></i> Back</button>
								</td>
								<td>
									<div class="div_rating_participant_skill"></div>
								</td>
							</tr>
						</table>

						<table class="my_datatable display nowrap" dt_type="impression_coor3" style="width:100%">
							<thead>
								<td>Assessment</td>
							</thead>
						</table>
					</div>

				</div>
			</div>

		</td>
	</tr>
</table>

<!--
<tr id="tr_actpage_impression_peer_assessment">
	<td class="td_indent">
		<div class="div_peer_assessment">
			<?php //include "index_peer_asst.php"?>
		</div>
	</td>
</tr>
	<tr id="tr_actpage_impression_primary_assessors">
		<td class="td_indent">
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
-->

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
