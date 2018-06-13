<div id="div_peers" class="bodyview_lvl1">

	<table id="tbl_peers" cellspacing="4" cellpadding="4" width="100%">

		<!--SECONDARY TAB AND SEARCH BAR-->
		<tr>
			<td style="width:100%">
		
				<table cellpadding="0" cellspacing="0" style="border-spacing:4px; width:100%">
					<tr>
						<td>
						
							<!--TAB BAR-->
							<table class="tbl_tab_bar">
								<tr>
									<td>
									
										<div class="div_peers_tab selected" onclick="showPeerTab(PEERTAB_FRIENDS)">
										
												My Peers
										
											<span class="peers_tab_data friends"></span>											
										</div>
										
									</td>

									<td>
									
										<div class="div_peers_tab" onclick="showPeerTab(PEERTAB_NETWORKS)">
											
												Activity Peers
											
											<span class="peers_tab_data networks"></span>											
										</div>
									
									</td>
									<td>
									
										<div class="div_peers_tab" onclick="showPeerTab(PEERTAB_FIND)">
											
												Find Peers
											
										</div>
									
									</td>
								</tr>
							</table>

						</td>
					</tr>
					
					<!--SEARCH BAR-->
					<tr>
						<td align="left" style="width: 100%; height:32px">
							<input id="inp_peers_filter" class="search_box" style="width:100%; height:32px; padding:0px 8px" type="text" placeholder=""/>
						</td>
					</tr>
				</table>
	
			</td>
		</tr>
		
		<tr>
			<td>
				<div class="layout_box">
					<div id="div_ntwk_users"></div>
				</div>
			</td>
		</tr>
		
	</table>

</div>

