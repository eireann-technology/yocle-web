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