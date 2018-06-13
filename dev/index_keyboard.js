
////////////////////////////////////////////////////////////////
/*
function initKeyboard(){
	$('#login_email, #login_pwd').keypress(function(event){
		var key = eval(event.which), ctrl = event.ctrlKey ? 1 : 0, shift = event.shiftKey ? 1 : 0, alt = event.altKey ? 1 : 0;
    switch (key) {
			case 13:
				goLogIn();
				break;
		}
	});

}
*/
function initKeyboard(){
	
	$('#login_email, #login_pwd').keypress(function(e){
		var key = eval(e.which), ctrl = e.ctrlKey ? 1 : 0, shift = e.shiftKey ? 1 : 0, alt = e.altKey ? 1 : 0;
    	switch (key) {
			case 13:
				e.stopPropagation();
				goLogIn();
				break;
		}
	});
	
	$(document).keydown(function(e){
		//console.info(e);
		if (e.which == 27){
			e.stopPropagation();
			
			console.info('escape key', g_curr_page);

			switch (g_curr_page){
				
				case PAGE_VIEW_ACT:
					break;

				case PAGE_VIEW_ASS:
					//goBack_asst();
					break;

				case PAGE_VIEW_SKILL:
				case PAGE_VIEW_USER:
				case PAGE_VIEW_USER:
				case PAGE_WHATSUP:
				case PAGE_MESSENGER_LIST:
				case PAGE_MESSENGER_COMM:
					changeBodyView(-1);
					break;
/*
				case PAGE_VIEW_ACT:
					if (g_curr_inline_jtr){
						resumeIconPlus();
						slideUpParticipantList();
					} else {
						changeBodyView(-1);
					}
					break;
*/					
			}
		}
	});

}