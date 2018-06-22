<table class="layout_box" cellspacing="0" cellpadding="5" style="width:100%">

	<tr>
		<td>
			<table style="width:100%">
				<thead>
					<td>
						<div class="div_title" index="<?php=$index?>"></div>
					</td>
					<td width="150">
						<div class="div_date" index="<?php=$index?>"></div>
					</td>
					<td width="24">
						<span class="svg_container svg_button" svg="edit" svgfill="black" svgsize="24" onclick="toggleEdit($('#<?php=$name?>'))"></span>
					</td>
				</thead>
			</table>
		</td>
	</tr>
	
	<tr>
		<td>
			<div id="<?php=$name?>">
				<table width="100%" border="0">
					<tr>
						<td align="center">
							<div class="div_desc" style="text-align:justify" index="<?php=$index?>"></div>
						</td>
					</tr>
					<tr>
						<td align="center">
							<img class="img_act" index="<?php=$index?>"/>
						</td>
					</tr>
					<tr>
						<td align="center">
							<iframe class="ifrm_youtube" src="" frameborder="0" index="<?php=$index?>" allowfullscreen></iframe>
						</td>
					</tr>
				</table>	
			</div>
		</td>
	</tr>
	<tr>
		<td>
			<table width="100%">
				<tr>
					<td class="tbl_header">
						Stamper(s):
					</td>
					<td>
						<ul>
							<li>
								<span class="stamper_header">Ian Smith</span>
								<span class="svg_container" svg="message" svgfill="black" svgsize="15" title="Send message reminder"></span>
								<span class="svg_container" svg="stamp" svgfill="black" svgsize="15"></span> (Stamped)
							</li>
							<li>
								<span class="stamper_header">Dr. C. Chan </span>
								<span class="svg_container" svg="message" svgfill="black" svgsize="15" title="Send message reminder"></span>
								<span class="svg_container" svg="hourglass" svgfill="black" svgsize="15"></span> (Pending)
							</li>
						</ul>
					</td>
					<td width="150">
						<table class="layout_box">
							<tr>
								<td class="tbl_header">
									Status:
								</td>
								<td>
									Invited
								</td>
							</tr>
						</table>
					</td>
				</tr>
				
				<tr>
					<td class="tbl_header">
						Due Date:
					</td>
					<td>
					 31 May 2016
					</td>
				</tr>

				<tr>
					<td colspan="3">
					
						<table class="layout_box">
						
							<tr>
								<td colspan="3">
									<b>G.S. Table</b>
								</td>
							</tr>
							
							<tr>
								<td width="250">
									Teamwork
								</td>
								<td width="50">
									<table style="display:inline" cellspacing="0" cellpadding="0">
										<tr>
											<td>
												<div class="skill_rating">8</div>
											</td>
											<td>
												<span class="svg_container" svg="stamp" svgfill="black" svgsize="15"></span>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td width="250">
									Leadership
								</td>
								<td>
									<table style="display:inline" cellspacing="0" cellpadding="0">
										<tr>
											<td>
												<div class="skill_rating">7</div>
											</td>
											<td>
												<span class="svg_container" svg="stamp" svgfill="black" svgsize="15"></span>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td width="250">
									Problem Solving
								</td>
								<td>
									<table style="display:inline" cellspacing="0" cellpadding="0">
										<tr>
											<td>
												<div class="skill_rating">6</div>
											</td>
											<td>
												<span class="svg_container" svg="stamp" svgfill="black" svgsize="15"></span>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							
							<tr>
								<td colspan="3">
									<table>
										<tr>
											<td valign="top" align="left" width="100%">
												<b>Comments:</b><br/>
												<textarea style="resize:none; width:850px; text-align:justify" class="text_box">Ian Smith: "Samson Chan always offers ideas to solve problems based on good information and sound judgment. He displays initiative and enthusiasm in leading the group. He also demonstrates excellent oral and written communication skills."</textarea>
											</td>
										</tr>
									</table>
								</td>
							</tr>
							
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
