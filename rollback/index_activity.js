//glyphicon glyphicon-edit
function initActivity(){
	console.info('initActivity');
	initActivityEdit();
	initActivityList();
	
	// add to featherlight else cannot resume scrollbar
	$.featherlight.defaults.afterClose = function(){
		//closeLightBox();
	}
}

