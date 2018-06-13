<!--FOR ASSESSMENTS TO BE VIEWED, DONE, MARKED AND REVIEWED-->
<div id="div_messenger_comm" class="bodyview_lvl5">
	
	<!--STICKY HEADER-->
	<div class="div_bodyview_header">
		<table>
			<tr>
				<td rowspan="2">
					<img class="leftarrow" src="./images/leftarrow_16.png" onclick="closeSkillBreakdown()"/>
				</td>
				<td rowspan="2">
					<img class="msg_photo2" src=""/>
				</td>
				<td class="bodyview_title"></td>
			</tr>
			<tr>
				<td class="bodyview_title2"></td>
			</tr>
		</table>
	</div>

	<!--MESSAGE COMM-->
	<table id="tbl_message_comm">
	
		<tr>
			<td>
				<div class="msg_output_container">
					<div class="msg_output"></div>
				</div>
			</td>
		</tr>
		
		<tr>
			<td height="1" stylex="padding:10px">
				<table id="tbl_message_comm_input" width="100%">
					<tr>
						<td id="td_msg_input">
<!--					
							<div class="msg_input" contenteditable="true"></div>
-->						
<!--
							<input class="msg_input"/>
-->
							<textarea class="msg_input"></textarea>
						</td>
						<td style="width:1px; height:1px">
							<button class="btn btn-primary btn_send" onclick="sendMsg()">
								<span class="glyphicon glyphicon-send"></span> Send
							</button>
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
	
</div>