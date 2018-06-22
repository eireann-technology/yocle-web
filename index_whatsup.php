<!--FOR ASSESSMENTS TO BE VIEWED, DONE, MARKED AND REVIEWED-->
<div id="div_whatsup" class="bodyview_lvl6">

	<!--STICKY HEADER-->
	<div class="div_whatsup_top">
		<span class="span_uploader_label">
			<input id="uploader_whatsup" class="uploader" type="file" accept="image/*, video/*, audio/*, capture=camcorder, .pdf" data-title="Add">
		</span>
	</div>

	<!--WHATSUP OUTPUT-->
	<div class="div_whatsup_output div_jscroll" onscroll="removeAllTooltips()"></div>

	<!--WHATSUP INPUT-->
	<table class="tbl_whatsup_input" style="border-spacing:4px; width:100%; padding-top:50px">

		<!--UPLOAD BUTTON-->
		<tr>
			<td>
				<table width="100%">
					<tr>
						<td width="1">
							<img src="./images/camera.png"/>
						</td>
						<td style="white-space:nowrap; padding:0px 10px">
							Media:
						</td>
						<td class="td_section" align="right" width="1">
							<span class="span_uploader_label"></span>
						</td>
					</tr>
				</table>
			</td>
		</tr>

		<!--GALLERY-->
		<tr>
			<td>
				<div class="uploader_gallery"></div>
			</td>
		</tr>


		<!--DESCRIPTION-->
		<tr>
			<td class="td_section">
				<table>
					<tr>
						<td width="1">
							<i class="glyphicon glyphicon-info-sign"></i>
						</td>
						<td style="white-space:nowrap; padding:0px 10px">
							Description:
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td class="td_desc" style="padding-left:20px">
				<div id="div_whatsup_desc" class="uploader_desc" style="height:60px"
					contenteditable="true"
					autocapitalize="none"
					autocorrect="off"
					autocomplete="off"
					spellcheck="false"
					placeholder="Say something..."
				></div>
			</td>
		</tr>

		<!--LOCATION-->
		<tr>
			<td class="td_section">
				<table>
					<tr>
						<td width="1">
							<img src="./images/profile_location.png"/>
						</td>
						<td style="white-space:nowrap; padding:0px 10px">
							Location:
						</td>
					</tr>
				</table>
			</td>
		</tr>
		<tr>
			<td style="padding-left:20px">
				<input type="text" id="inp_whatsup_location" style="width:100%" placeholder="Where was it?"/>
			</td>
		</tr>

		<!--USER GROUP-->
		<tr>
			<td class="td_section">
				<table>
					<tr>
						<td width="1">
							<img src="./images/peers_group.png"/>
						</td>
						<td style="white-space:nowrap; padding:0px 10px">
							Share to:
						</td>
					</tr>
				</table>
			</td>
		</tr>

		<tr>
			<td style="padding-left:20px">
				<div id="div_whatsup_receivers"style="width:100%">
				</div>
			</td>
		</tr>

		<tr>
			<td align="right" style="padding-bottom:50px">
				<button class="btn_send btn btn-success">
					<span class="glyphicon glyphicon-send"></span>&nbsp;Send
				</button>
			</td>
		</tr>

	</table>

</div>
