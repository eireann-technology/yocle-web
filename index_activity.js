var
	OCLX = 'Participated',
	YOLOX = 'Self-initiated'
;

function getActType(act){
	return act.act_type == 'OCL-X' ? OCLX : YOLOX;
}

//glyphicon glyphicon-edit
//function initActivity(){
//	console.info('initActivity');
//	initEditAct();
//	initListAct();

	// add to featherlight else cannot resume scrollbar
//	$.featherlight.defaults.afterClose = function(){
		//closeLightBox();
//	}
//}

///////////////////////////////////////////////////////////////////
// strcmp: Returns 
//		< 0 if str1 is less than str2;
//		> 0 if str1 is greater than str2, and
//		0 if they are equal.
// localeCompare:
//		< 0: A negative number if the reference string occurs before the compare string;
//		> 0: positive if the reference string occurs after the compare string; 
//		0 if they are equivalent.

function cmp_act_title(a, b){
	//console.log(a.title, b.title, a.title.localeCompare(b.title));
	return b.title.localeCompare(a.title);
}


