
////////////////////////////////////////////////////////////////////

function openMessage(partner, bAddTheirMsg){
	if (partner == ''){
	}
	//$('#div_msg_partner').text(partner);
	// clear first
	$('#div_msgout_inner').html('');
	$('#dialog_msg .trumbowyg-editor').html('');
	g_msg_index = 0;
	if (bAddTheirMsg){
		addTheirMsg();
	}
	$('#dialog_msg').dialog({
		modal: true,
		autoOpen: true,
		resizable: false,
		width:'auto',		
		height:'auto',		
		buttons: {
			Send: function(){
				sendMsg();
			},
			Close: function(){
				$(this).dialog("close");
			},
		},	
	});
	setTimeout(function(){
		$('#dialog_msg .trumbowyg-editor').focus();	
	}, 500);
}
