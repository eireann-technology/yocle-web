<table>
	<tr>
		<td style="height:100%; border-left:1px solid lightgray;">
		</td>
		<td height="150">
			<table width="100%" height="100%" border="0">
				<tr>
					<td align="center">
						<table border="0">
							<tr>
								<td style="text-align:center">
									<b class="text_gsstatus">GS Status</b>
								</td>
							</tr>
							<tr>
								<td>
									<div>
										<canvas class="status_gauge" style="width:125px" user="<?=$user?>"></canvas>
										<div class="preview-textfield"><?=$status?></div>
									</div>
								</td>
							</tr>
							<tr>
								<td style="text-align:center;" class="text_bronze">
									Bronze
								</td>
							</tr>
						</table>
					</td>
				</tr>
				<tr>
					<td style="border-bottom:1px solid lightgrey; height:2px">
					</td>
				</tr>
				<tr>
					<td align="center">
						<table>
							<tr>
								<td style="text-align:center">
									<b class="text_ntwk">Network</b>
								</td>
							</tr>
							<tr>
								<td class="networks_num">
									<?=$network?>
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
</table>