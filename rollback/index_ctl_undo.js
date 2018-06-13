var ACTION_NEW = 1
		,ACTION_EDIT = 2
		,ACTION_LAYER = 3
		//,ACTION_REDO = 4
;
var g_actionarr = ['', 'new','edit','layer','redo'];

//////////////////////////////////////////////////////////////
/*
function debugObjArr(){
	console.debug('debugObjArr');
	for (var i = 0; i < g_obj_arr.length; i++){
		var myop = g_obj_arr[i];
		console.log(i, myop.type, myop);
	}
}
*/
//////////////////////////////////////////////////////////////

function debugUndoArr(){
	return;
	if (g_obj_arr.length){
		console.debug('objArr');
		for (var i = 0; i < g_obj_arr.length; i++){
			var myop = g_obj_arr[i];
			console.log('\t', i, myop.type);
		}
	}
	if (g_undo_arr.length){
		console.debug('undoArr');
		for (var i = 0; i < g_undo_arr.length; i++){
			var do_ = g_undo_arr[i];
			console.log('\t',i,g_actionarr[do_.action],(do_.type?do_.type:''),(do_.index?do_.index:''),(do_.old_index||do_.new_index?do_.old_index+','+do_.new_index:''));
		}
	}
	if (g_redo_arr.length){
		console.debug('redoArr');
		for (var i = 0; i < g_redo_arr.length; i++){
			var do_ = g_redo_arr[i];
			console.log('\t',i,g_actionarr[do_.action],(do_.type?do_.type:''),(do_.index?do_.index:''),(do_.old_index||do_.new_index?do_.old_index+','+do_.new_index:''));
		}
	}
}

//////////////////////////////////////////////////////////////

function addUndoAction(action, myop, redo, index){
	var ax = 0, ay = 0, lvl = 0;
	if (redo){
		ax = redo.center_ax;
		ay = redo.center_ay;
		lvl = redo.zoom_lvl;
	} else {
		clearRedo();
		var a = getCenterPt();
		ax = a.x;
		ay = a.y;
		lvl = g_whb_zoom_lvl;
	}
	//console.debug('addUndoAction', g_actionarr[action], myop.type?myop.type:'', 'lvl='+lvl, 'c='+ax+','+ay);
	var undo = {
		action: action,
		type: myop.type,
		center_ax: ax,
		center_ay: ay,
		zoom_lvl: lvl,
	};
	switch (action){
	
		case ACTION_NEW:
			break;
			
		case ACTION_EDIT:
			if (typeof(index) == 'undefined'){
				debugger;
			}
			undo.index = index;
			undo.myop = cloneObj(myop);	// duplication: http://stackoverflow.com/questions/122102/what-is-the-most-efficient-way-to-clone-an-object
			break;
			
		case ACTION_LAYER:
			undo.old_index = myop.old_index;
			undo.new_index = myop.new_index;
			break;
			
	}
	g_undo_arr.push(undo);
		
	debugUndoArr();	// testing
}

/////////////////////////////////////////////////////////////////////////////////////////////

function addRedoAction(action, undo, myop){
	var ax = undo.center_ax
		,ay = undo.center_ay
		,lvl = undo.zoom_lvl
	;
	console.debug('addRedoAction', g_actionarr[undo.action], myop.type, 'lvl='+lvl, 'c='+ax+','+ay);
	var redo = {
		action: action,
		center_ax: ax,
		center_ay: ay,
		zoom_lvl: lvl,
		type: myop.type,
	};
	switch (action){
		case ACTION_NEW:
			redo.myop = myop;
			break;
			
		case ACTION_EDIT:
			if (typeof(undo.index) == 'undefined'){
				debugger;
			}
			redo.index = undo.index;
			redo.myop = myop;
			break;
			
		case ACTION_LAYER:
			redo.old_index = myop.old_index;
			redo.new_index = myop.new_index;
			break;
	}
	g_redo_arr.push(redo);
	
	debugUndoArr();	// testing
}

////////////////////////////////////////////////////////////////////////////////

function undoAction(bSender){
	if (g_undo_arr.length){
		//console.debug('undoAction1', g_obj_arr.length);
		// remove this first
		var undo = g_undo_arr.pop(),
				action = undo.action
		;
		console.debug('undoAction', undo);
		switch (action){
		
			case ACTION_NEW:
				// REMOVE FROM OBJECT
				var myop = g_obj_arr.pop();
				// ADD TO REDO
				addRedoAction(ACTION_NEW, undo, myop);
				break;
				
			case ACTION_EDIT:
				// REMOVE FROM OBJECT
				var myop = g_obj_arr.splice(undo.index, 1, undo.myop)[0];
				// ADD TO REDO
				addRedoAction(ACTION_EDIT, undo, myop);
				break;
				
			case ACTION_LAYER:
				addRedoAction(ACTION_LAYER, undo, {old_index:undo.old_index, new_index:undo.new_index});
				onChangeLayer(undo.old_index, undo.new_index);
				break;
		}
		// CHECK REDO ARR
		checkRedoPopup();
		
		// SET TO LOCATION AND REDRAW
		var undo2 = undo;
		// get the previous location if exist
		if (g_undo_arr.length){
			undo2 = g_undo_arr[g_undo_arr.length-1];
		}
		animate_myop(undo2);
		
		// MYOP (FOR OTHERS AND RECORDING)
		var myop = {
			type: 'whb_undo',
			//index: index,
		};
		// SEND TO OTHERS
		if (bSender){
			sendMsg(myop);
		}
		// ADD TO TIMELINE
		g_recordAll && g_recordAll.addTimeNode('msg', myop);
		//console.debug('undoAction2', g_obj_arr.length);
	}
}

//////////////////////////////////////////////////

function redoAction(bSender){
	if (g_redo_arr.length){
		//console.debug('redoAction1', g_obj_arr.length);
		var redo = g_redo_arr.pop(),
			action = redo.action
		;
		console.debug('redoAction', redo);
		switch (action){
		
			case ACTION_NEW:
				var myop = cloneObj(redo.myop)
				// PUSH TO OBJECT
				g_obj_arr.push(myop);
				g_obj_altered = 1;
				
				// ADD UNDO ACTION
				addUndoAction(ACTION_NEW, myop, redo);
				break;

			case ACTION_EDIT:
				var myop = cloneObj(redo.myop)
				// SWAP OBJECT
				var myop2 = g_obj_arr.splice(redo.index, 1, myop)[0];
				// ADD UNDO ACTION
				addUndoAction(ACTION_EDIT, myop2, redo, redo.index);
				break;
				
			case ACTION_LAYER:
				var new_index = redo.new_index,
						old_index = redo.old_index
				;
				addUndoAction(ACTION_LAYER, {old_index:old_index, new_index:new_index});
				onChangeLayer(new_index, old_index);
				break;
		}
		// CHECK REDO ARR
		checkRedoPopup();
		
		// SET TO LOCATION AND REDRAW
		animate_myop(redo);
		
		// MYOP
		var myop = {
			type: 'whb_redo',
		};
		// SEND TO OTHERS
		if (bSender){
			sendMsg(myop);
		}
		// ADD TO TIMELINE
		g_recordAll && g_recordAll.addTimeNode('msg', myop);
		//console.debug('redoAction2', g_obj_arr.length);
	}
}

//////////////////////////////////////////////////////////////////////

function cloneObj(obj){
	return jQuery.extend(true, {}, obj)
}