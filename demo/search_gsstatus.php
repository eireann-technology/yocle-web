<table class="layout_box tbl_modal" style="width:800px">
	<thead>
	
		<tr>
			<td id="gsstatus_title" class="modal_search_title" style="font-weight:bold">
			</td>
			<td id="gsstatus_date" class="modal_search_date" align="right">
			</td>
		</tr>
		<tr>
			<td id="gsstatus_task" class="modal_search_task" colspan="2" style="padding:10px 0px;">
			</td>
		</tr>
		<tr>
			<td colspan="2">
				<?php $id="inp_findpeople"; $placheolder = 'Find people';include "searchbar.php"?>								
			</td>
		</tr>
		
	</thead>
	<tr>
		<td colspan="2">
			<table id="tbl_gsstatus" class="layout_box datatable_printable tbl_assessor" cellspacing="2" cellpadding="5" style="width:100%">
			
				<thead>
					<tr>
						<td width="32">
							&nbsp;
						</td>
						<td width="120">
							Name
						</td>
						<td width="120">
							Generic Skills Score
						</td>
						<td>
							Comments
						</td>
						<td width="80" align="center">
							Overall
						</td>
					</tr>
				</thead>
				
				<tbody>
					<tr>
						<td>
							<img src="./people/m01.jpg" width="32"/>
						</td>
						<td>
							Wilson Lee
						</td>
						<td>
							<table cellspacing="0" cellpadding="0">
								<tr>
									<td>
										Teamwork
									</td>
									<td>
										<span class="gs_rating2"></span>
									</td>
								</tr>
								<tr>
									<td>
										Communication
									</td>
									<td>
										<span class="gs_rating2"></span>
									</td>
								</tr>
								<tr>
									<td>
										Critical thinking
									</td>
									<td>
										<span class="gs_rating2"></span>
									</td>
								</tr>
							</table>
						</td>
						<td class="gs_text_box">
						</td>
						<td align="center">
							<div>
								<canvas id="mygauge1" class="status_gauge" style="width:75px"></canvas>
								<div class="preview-textfield">0</div>
							</div>
						</td>
					</tr>

					<tr>
						<td>
							<img src="./people/f08.jpg" width="32"/>
						</td>
						<td>
							Marianna Chan
						</td>
						<td>
							<table cellspacing="0" cellpadding="0">
								<tbody>
									<tr>
										<td>
											Teamwork
										</td>
										<td>
											<span class="gs_rating2"></span>
										</td>
									</tr>
									<tr>
										<td>
											Communication
										</td>
										<td>
											<span class="gs_rating2"></span>
										</td>
									</tr>
									<tr>
										<td>
											Critical thinking
										</td>
										<td>
											<span class="gs_rating2"></span>
										</td>
									</tr>
								</tbody>
							</table>
						</td>
						<td class="gs_text_box">
						</td>
						<td align="center">
							<div>
								<canvas id="mygauge2" class="status_gauge" style="width:75px"></canvas>
								<div class="preview-textfield">0</div>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</td>
	</tr>
</table>


