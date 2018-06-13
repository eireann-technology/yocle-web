<tr>

	<!--LOGO-->	
	<td style="width:130px">
		<img src="yocle_logo15_h40.png"/>
	</td>
	
	<!--FIND PEOPLE-->	
	<td style="text-align:left; width:100%;">
		<input id="inp_topmenu_search" type="text" placeholder="Find people"/>
	</td>
	
	<!--USER NAME-->
	<td style="color:white; padding-right:10px;">
		<table>
			<tr>
				<td>
					<img id="topmenu_photo" class="myinfo_photo" src=""/>
				</td>
				<td class="myinfo_username" style="color:white; font-size:14px; font-weight:bold; cursor:hand; padding-left:4px" nowrap onclick="openHome()">
				</td>
			</tr>
		</table>
	</td>
	
	<!--BUTTONS-->
	<td align="right" style="width:50px">
		<table id="top_panel" cellspacing="0" cellspacing="0" border="0">
			<tr>
						
				<td id="topmenu_settings" class="svg_container topmenu_btn" svg="settings" title="Settings" data-toggle="tooltip" data-placement="bottom" svgsize="20" style="display:none">
				</td>
				
				<td id="topmenu_notice" class="svg_container topmenu_btn" svg="notice" title="Notice board" data-toggle="tooltip" data-placement="bottom" svgsize="20" style="display:none">
					<div class="balloon"><div class="balloon2"></div></div>
				</td>

				<td id="topmenu_whatsup" class="svg_container topmenu_btn" svg="whatsup" title="What's up?" onclick="openWhatsup()" data-toggle="tooltip" data-placement="bottom" svgsize="20" style="displayx:none">
					<div class="balloon"><div class="balloon2"></div></div>
				</td>
				
				<td id="topmenu_msg" class="svg_container topmenu_btn" svg="chat" title="Message" onclick="openMessengerList()" data-toggle="tooltip" data-placement="bottom" svgsize="20">
					<div class="balloon"><div class="balloon2"></div></div>
				</td>
				
				<td id="topmenu_lang" class="svg_container topmenu_btn" svg="language" title="Language" onclick="openDropmenu($(this), 'lang', event);" data-toggle="tooltip" data-placement="bottom" svgsize="20" style="display:none">
				</td>
				
				<td id="topmenu_logout" class="svg_container topmenu_btn" svg="logout" title="Log out" data-toggle="tooltip" data-placement="bottom" svgsize="20"></td>
				
			</tr>
		</table>
	</td>
</tr>
