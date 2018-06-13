
<table id="tbl_search_activity" cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td class="tab_title text_createactivity">
			Create activity
		</td>
	</tr>
	<tr>
		<td>
			<table class="layout_box" cellspacing="0" cellpadding="5" style="width:100%">
				<tr>
					<td>
						<table style="width:100%" border="0">
							<thead>
							
								<tr>
									<td valign="top" class="section_header text_title">
										Title
									</td>
								</tr>

								<tr>
									<td align="left" class="section_body">
										<input type="text" class="inp_text" style="width:100%; font-weight:normal; font-size:18px" value="Beyond Our Borders: Experience Taiwan and South Korea"/>
									</td>
								</tr>
							
								<tr>
									<td valign="top" class="section_header text_type">
										Type
									</td>
								</tr>
								
								<tr>
									<td valign="top" class="section_body">
										<table cellspacing="0" cellpadding="0">
											<tr>
												<td>
													<div id="toggle_activity_type" class="toggle_type toggle-light" style="margin-right:6px;"></div>
												</td>
												<td id="td_activity_type" style="padding-left:10px">
												</td>
											</tr>
										</table>
									</td>
								</tr>
<!--
								<tr>
									<td valign="top" class="section_header">
										Stamp proof
									</td>
								</tr>
								
								<tr>
									<td valign="top" class="section_body">
										<table cellspacing="0" cellpadding="0">
											<tr>
												<td>
													<div class="toggle_stamp2 toggle-light" style="margin-right:6px;"></div>
												</td>
												<td id="td_stamp2" style="padding-left:10px">
												</td>
											</tr>
										</table>
									</td>
								</tr>
-->								
								<tr>
									<td valign="top" class="section_header text_period">
										Period
									</td>
								</tr>
								
								<tr>
									<td valign="top" class="section_body">
										<table>
											<tr>
												<td>
													<span class="text_starttime">Start time</span>: <input class="assessment_datetime" value="2016/05/28 09:00" style="border-radius:8px; padding:4px; border:1px solid #c0c0c0"/>
												</td>
												<td>
													-
												</td>
												<td>
													<span class="text_endtime">End time</span>: <input class="assessment_datetime" value="2016/06/28 09:00" style="border-radius:8px; padding:4px; border:1px solid #c0c0c0"/>
												</td>
											</tr>
										</table>
									</td>
								</tr>

								<tr>
									<td valign="top" class="section_header text_desc">
										Description
									</td>
								</tr>
								<tr>
									<td valign="top" class="section_body">
										<textarea class="editor">
											<table>
												<tr>
													<td colspan="2" align="center">
														<img width="100%" src="./oclx/taiwan_korea.jpg" style="border:1px solid gray; border-radius:8px"/>
													</td>
												</tr>
												<tr>
													<td valign="top">
														<div id="div_search_desc">
<!--														
															<iframe class="ifrm_youtube" style="width:320px;height:240px" src="" frameborder="0" index="1" allowfullscreen></iframe>
-->															
														</div>
														<i>Global Citizenship Summer Institute</i>
													</td>
													<td style="padding-left:10px;text-align:justify; border:0px solid gray; border-radius:8px">
														<b>The Global Citizenship Summer Institute (GCSI)</b> provides a platform for Social Sciences students to step beyond their academic and physical borders, engaging in intellectual and experiential learning through participating in a four-week intensive study programme in Taiwan and South Korea.<br/><br/>
														GCSI aims to enhance Social Sciences students' awareness of the importance of Asia in the globalizing world. Students will spend first two weeks in Taiwan and following two weeks in South Korea attending academic lectures relating to three focus areas: social, cultural and political developments in Taiwan and South Korea. Students will critically examine these focus areas through a comparative lens as well as analyzing their regional and global implications. Field visits to civil society organizations and political and cultural parties will be organized to provide students with a more holistic understanding of Taiwanese and South Korean societies. By the end of these four weeks, students will gain a unique perspective on Asia through interacting with academics, students, community leaders and people in the selected Asian societies.
													</td>
												</tr>
											</table>
										</textarea>
									</td>
								</tr>								
								
								<tr>
									<td class="section_header text_participants">
										Participants
									</td>
								</tr>

								<tr>
									<td class="section_body">
									
										<table width="100%" border="0" class="layout_box lightbar">
											<tr>
												<td>
													<?php $id = "inp_findparticipants"; $placeholder = 'Find participants'; include "searchbar.php"?>
												</td>
												<td style="width:120px; padding-right:10px">
													<button class="medium_button add_button"><span class="svg_container" svg="add_user" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_add" nowrap>Add</span></button>
												</td>
												<td style="border-left:1px solid #e0e0e0; width:150px" align="center">
													<button class="medium_button import_button"><span class="svg_container" svg="import" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_import" nowrap>Import</span></button>
												</td>
											</tr>
										</table>
										
										<table width="100%" border="0" class="layout_box lightbar">
											<tr>
												<td colspan="3">
													<table width="100%" border="0" class="datatable" style="background:#f0f0f0">
														<thead>
															<tr>
																<td>
																	&nbsp;
																</td>
																<td class="table_header text_name">
																	Name
																</td>
																<td class="table_header text_desc">
																	Description
																</td>
																<td>
																	&nbsp;
																</td>
																<td>
																	&nbsp;
																</td>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td width="24">
																	<img src="./people/f01.jpg" class="person_photo"/>
																</td>
																<td width="150">
																	Chole Madely
																</td>
																<td>
																	Social Science HKU
																</td>
																<td width="100">
																	<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																</td>
																<td width="24">
																	<button class="icon_button but_trash"></button>
																</td>													
															</tr>

															<tr>
																<td width="24">
																	<img src="./people/m01.jpg" class="person_photo"/>
																</td>
																<td width="150">
																	John Davis
																</td>
																<td>
																	Psyhcology HKU
																</td>
																<td width="100">
																	<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																</td>
																<td width="24">
																	<button class="icon_button but_trash"></button>
																</td>													
															</tr>
															
														</tbody>
													</table>
												</td>
											</tr>
											
										</table>
									</td>
								</tr>
								
								
								<tr>
									<td class="section_header text_genericskills">
										Generic Skills
									</td>
								</tr>

								<tr>
									<td class="section_body">
									
										<table id="tbl_gskills" width="100%" border="0" class="layout_box lightbar">
											<tr>
												<td>
													<?=getSelectSkill('')?>
												</td>
												<td style="width:120px; padding-right:10px">
													<button class="medium_button" onclick="addSkill()"><span class="svg_container" svg="skill" svgfill="black" svgsize="16"></span><span class="text_add" nowrap>&nbsp; Add</span></button>
												</td>
												<td style="border-left:1px solid #e0e0e0; width:150px" align="center">
													<button class="medium_button import_button"><span class="svg_container" svg="import" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_import" nowrap>Import</span></button>
												</td>
											</tr>
										</table>
										
										<div class="separator2"></div>
											
										<table id="tbl_gskills2" width="100%" border="0" class="layout_box lightbar">
											<tr>
												<td colspan="5">
													<table width="100%" border="0" class="datatable" style="background:#f0f0f0">
														<thead>
															<tr>
																<td class="table_header text_genericskills">
																	Generic Skills
																</td>
																<td class="table_header text_weight" nowrap>
																	Weight %
																</td>
																<td>
																	&nbsp;
																</td>
																<td>
																	&nbsp;
																</td>
															</tr>
														</thead>
														<tbody style="background:white">
															<tr>
																<td>
																	Organization
																</td>
																<td width="120">
																	<input class="assessment_spinner" value="50" style="width:25px"/>
																</td>
																<td width="100">
																	<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																</td>
																<td width="24">
																	<button class="icon_button but_trash"></button>
																</td>													
															</tr>

															<tr>
																<td>
																	Communication
																</td>
																<td width="120">
																	<input class="assessment_spinner" value="50" style="width:25px"/>
																</td>
																<td width="100">
																	<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																</td>
																<td width="24">
																	<button class="icon_button but_trash"></button>
																</td>													
															</tr>
															
														</tbody>
													</table>
												</td>
											</tr>
											
										</table>
									
										<div class="separator2"></div>
										
										<?php include "assessors.php"?>									
									
									</td>
								</tr>
	
								
								<tr>
									<td class="section_header text_assessment">
										Assessment
									</td>
								</tr>

								<tr>
									<td style="padding:12px">
										<table cellspacing="0" cellpadding="0">
											<tr>
												<td>
													<div class="toggle_assess toggle-light" style="margin-right:6px;"></div>
												</td>
												<td id="td_assess" style="padding-left:10px">
												</td>
											</tr>
										</table>
									</td>
								</tr>
								
								<tr>
									<td class="section_body">
										<div id="div_assess_method">
											<table width="100%" border="0" class="layout_box lightbar">
												<tr>
													<td width="50" class="table_header text_method">
														Method
													</td>
													<td>
														<?=getSelectMethod('Abstract')?>
													</td>
													<td width="308">
														<input id="inp_title" class="inp_text" placeholder="Title of assignment" style="width:290px"/>
													</td>
													<td style="width:120px; padding-right:10px">
														<button class="medium_button"><span class="svg_container" svg="assessment" svgfill="black" svgsize="16"></span><span class="text_add" nowrap>&nbsp; Add</span></button>
													</td>
													<td style="border-left:1px solid #e0e0e0; width:150px" align="center">
														<button class="medium_button import2_button"><span class="svg_container" svg="import" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_import">Import</span></button>
													</td>
												</tr>
											</table>
											
											<table width="100%" border="0" class="layout_box lightbar">
												<tr>
													<td colspan="5">
														<table id="tbl_method" width="100%" border="0" cellspacing="0" cellpadding="2" style="background:#f0f0f0">
														
															<thead>
																<tr>
																	<td class="table_header text_method"> 
																		Method
																	</td>
																	<td class="table_header text_title">
																		Title
																	</td>
																	<td class="table_header text_weight">
																		Weight %
																	</td>
																	<td>
																		&nbsp;
																	</td>
																	<td>
																		&nbsp;
																	</td>
																</tr>
															</thead>
															
															<tbody style="background:white">
																
																<tr>
																	<td width="250">
																		Abstract
																	</td>
																	<td>
																		Overseas Experience
																	</td>
																	<td width="120">
																		<input class="assessment_spinner" value="20" style="width:25px"/>
																	</td>
																	<td width="100">
																		<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																	</td>
																	<td width="24">
																		<button class="icon_button but_trash"></button>
																	</td>													
																</tr>
																<?php include "index_activity_create_abstract.php"?>
																
																<tr>
																	<td>
																		Blog
																	</td>
																	<td>
																		My Blog
																	</td>
																	<td width="120">
																		<input class="assessment_spinner" value="20" style="width:25px"/>
																	</td>
																	<td width="100">
																		<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																	</td>
																	<td width="24">
																		<button class="icon_button but_trash"></button>
																	</td>													
																</tr>
																<?php include "index_activity_create_blog.php"?>

																<tr>
																	<td>
																		MCQ
																	</td>
																	<td>
																		GCSI MCQ
																	</td>
																	<td width="120">
																		<input class="assessment_spinner" value="20" style="width:25px"/>
																	</td>
																	<td width="100">
																		<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																	</td>
																	<td width="24">
																		<button class="icon_button but_trash"></button>
																	</td>													
																</tr>
																<?php include "index_activity_create_mcq.php"?>

																<tr>
																	<td>
																		Participation
																	</td>
																	<td>
																		Practical Observation
																	</td>
																	<td width="120">
																		<input class="assessment_spinner" value="20" style="width:25px"/>
																	</td>
																	<td width="100">
																		<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																	</td>
																	<td width="24">
																		<button class="icon_button but_trash"></button>
																	</td>													
																</tr>
																<?php include "index_activity_create_participation.php"?>

																<tr>
																	<td>
																		Reflective Piece
																	</td>
																	<td>
																		Self Reflective
																	</td>
																	<td width="120">
																		<input class="assessment_spinner" value="10" style="width:25px"/>
																	</td>
																	<td width="100">
																		<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																	</td>
																	<td width="24">
																		<button class="icon_button but_trash"></button>
																	</td>													
																</tr>
																<?php include "index_activity_create_reflective.php"?>

																<tr>
																	<td>
																		Survey
																	</td>
																	<td>
																		Community Advisor Survey
																	</td>
																	<td width="120">
																		<input class="assessment_spinner" value="10" style="width:25px"/>
																	</td>
																	<td width="100">
																		<button class="details_button"><span class="svg_container" svg="details" svgfill="black" svgsize="16"></span>&nbsp; <span class="text_details" nowrap>Details</span></button>
																	</td>
																	<td width="24">
																		<button class="icon_button but_trash"></button>
																	</td>													
																</tr>
																<?php include "index_activity_create_survey.php"?>
																
																
															</tbody>
														</table>
													</td>
												</tr>
												
											</table>
										</div>
									</td>
								</tr>
							
								<tr>
									<td colspan="2">
										<table cellspacing="10" align="center">
											<tr>
												<td>
													<button class="medium_button text_preview">Preview</button>
												</td>
												<td>
													<button class="medium_button text_save">Save</button>
												</td>
												<td>
													<button class="medium_button text_cancel">Cancel</button>
												</td>
											</tr>
										</table>
									</td>
								</tr>
								
							</thead>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>

