
<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td>
			<b>Add an OCL-X</b>
		</td>
	</tr>
</table>

<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td colspan="2">
			<b>OCL-X</b>
		</td>
	</tr>
	<tr>
		<td>
			<input class="inp_text" type="text" placeholder="The name of the activitiy..." value="Beyond Our Borders: Experience Taiwan and South Korea" style="width:99%"/>
		</td>
	</tr>
	<tr>
		<td>
			<div class="editor" style="min-height:15px; border-radius:8px" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
			<p style="text-align:center">
				<img src="./oclx/taiwan_korea.jpg"/>
			</p>
The Global Citizenship Summer Institute (GCSI) provides a platform for Social Sciences students to step beyond their academic and physical borders, engaging in intellectual and experiential learning through participating in a four-week intensive study programme in Taiwan and South Korea.
GCSI aims to enhance Social Sciences students' awareness of the importance of Asia in the globalizing world. Students will spend first two weeks in Taiwan and following two weeks in South Korea attending academic lectures relating to three focus areas: social, cultural and political developments in Taiwan and South Korea. Students will critically examine these focus areas through a comparative lens as well as analyzing their regional and global implications. Field visits to civil society organizations and political and cultural parties will be organized to provide students with a more holistic understanding of Taiwanese and South Korean societies. By the end of these four weeks, students will gain a unique perspective on Asia through interacting with academics, students, community leaders and people in the selected Asian societies.</div>
		</td>
	</tr>
</table>

<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td>
			<b>Assessment</b>
		</td>
	</tr>
	<tr>
		<td>
		
			<table id="tbl_assess" align="center">
			
				<!--SURVEY 1-->
				<tr>
					<td class="header" style="width:175px">
						Title
					</td>
					<td class="header" style="width:165px">
						Method
					</td>
					<td class="header" style="width:80px">
						Weight%
					</td>
					<td class="header" style="width:80px">
						Start time
					</td>
					<td class="header" style="width:80px">
						Due time
					</td>
					<td class="header" style="width:100px">
						Status
					</td>
				</tr>
				
				<?php include 'index_oclx_add_abstract.php'?>
				<?php include 'index_oclx_add_blog.php'?>
				<?php include 'index_oclx_add_mcq.php'?>
				<?php include 'index_oclx_add_participation.php'?>
				<?php include 'index_oclx_add_reflective.php'?>
				<?php include 'index_oclx_add_survey.php'?>
				
			</table>
		</td>
	</tr>
				
	<tr>
		<td align="center">
			<button class="medium_button">Add Assessment</button>
		</td>
	</tr>
	
</table>


<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td>
			<b>Skills to be developed</b>
		</td>
	</tr>
	<tr>
		<td>
			<table id="tbl_gskills" align="left" width="100%">
				<thead>
					<td width="160">
						Genetic Skills
					</td>
					<td width="100">
						Overall weight%
					</td>
					<td>
						Assessment 1 weight%
					</td>
					<td>
						Assessment 2 weight%
					</td>
					<td>
						Assessment 3 weight%
					</td>
					<td>
						Assessment 4 weight%
					</td>
					<td>
						Assessment 5 weight%
					</td>
					<td>
						Assessment 6 weight%
					</td>
					<td>
						&nbsp;
					</td>
				</thead>
				<tr>
					<td>
						<?=getSelectSkill('Organization')?>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<button class="icon_button but_trash"></button>
					</td>					
				</tr>
				<tr>
					<td>
						<?=getSelectSkill('Communication')?>
					</td>
					<td>
						<input class="assessment_spinner" value="30" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<button class="icon_button but_trash"></button>
					</td>					
				</tr>
				<tr>
					<td>
						<?=getSelectSkill('Teamwork')?>
					</td>
					<td>
						<input class="assessment_spinner" value="30" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<input class="assessment_spinner" value="40" style="width:25px"/>
					</td>
					<td>
						<button class="icon_button but_trash"></button>
					</td>					
				</tr>
				<tr>
					<td colspan="99">
						&nbsp;
					</td>
				</tr>
				<tr>
					<td colspan="99" style="text-align:center">
						<button class="medium_button">Add skill</button>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>

<table cellspacing="0" cellpadding="5" width="100%" class="layout_box">
	<tr>
		<td colspan="2">
			<b>Participants</b>
		</td>
	</tr>
	
	<tr>
		<td width="100%">
			<table cellpadding="0" cellspacing="0" width="100%">
				<tr>
					<td width="100%">
						<input id="inp_search" class="search_box" type="text" placeholder="Filter people..." style="width:100%"/>
					</td>
					<td style="padding-left:2px">
						<div class="svg_container" svg="search" style="position: relative; left: -40px; width:16px; height:16px; padding:4px; border-radius:8px; cursor:pointer;" svgfill="green"></div>
					</td>
				</tr>
			</table>	
		</td>
	</tr>
	
	<tr>
		<td>
			<table>
				<tr>
					<td>
						<table>
							<tr>
								<td>
									<img src="./people/f01.jpg" class="photo_home"/>
								</td>
							</tr>
							<tr>
								<td class="person_name">
									Chole Madely
								</td>
							</tr>
						</table>
					</td>
					<td>
						<table>
							<tr>
								<td>
									<img src="./people/m01.jpg" class="photo_home"/>
								</td>
							</tr>
							<tr>
								<td class="person_name">
									John Davis
								</td>
							</tr>
						</table>
					</td>
					<td>
						<table>
							<tr>
								<td>
									<img src="./people/f02.jpg" class="photo_home"/>
								</td>
							</tr>
							<tr>
								<td class="person_name">
									Juliana Altimari
								</td>
							</tr>
						</table>
					</td>
					<td>
						<table>
							<tr>
								<td>
									<img src="./people/f03.jpg" class="photo_home"/>
								</td>
							</tr>
							<tr>
								<td class="person_name">
									Evelin Kwok
								</td>
							</tr>
						</table>
					</td>
					
					<td>
						<table>
							<tr>
								<td>
									<img src="./people/m02.jpg" class="photo_home"/>
								</td>
							</tr>
							<tr>
								<td class="person_name">
									Col Macy
								</td>
							</tr>
						</table>
					</td>
					
					<td>
						<table>
							<tr>
								<td>
									<img src="./people/f04.jpg" class="photo_home"/>
								</td>
							</tr>
							<tr>
								<td class="person_name">
									Cherish Chan
								</td>
							</tr>
						</table>
					</td>
					
					<td>
						<table>
							<tr>
								<td>
									<img src="./people/m04.jpg" class="photo_home"/>
								</td>
							</tr>
							<tr>
								<td class="person_name">
									Randell Lee
								</td>
							</tr>
						</table>
					</td>
					
				</tr>
			</table>
		</td>
	</tr>

	<tr>
		<td>
			<table cellspacing="10" align="center">
				<tr>
					<td>
						<button class="medium_button">Add by Excel</button>
					</td>
					<td>
						<button class="medium_button">Add by CSV</button>
					</td>
					<td>
						<button class="medium_button">Add by groups</button>
					</td>
					<td>
						<button class="medium_button">Add by individuals</button>
					</td>
				</tr>
			</table>
		</td>
	</tr>
	
</table>


<table class="layout_box" style="width:100%">
	<tr>
		<td>
			<table cellspacing="10" align="center">
				<tr>
					<td>
						<button class="medium_button">Preview</button>
					</td>
					<td>
						<button class="medium_button">Save</button>
					</td>
					<td>
						<button class="medium_button">Send</button>
					</td>
					<td>
						<button class="medium_button">Cancel</button>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
