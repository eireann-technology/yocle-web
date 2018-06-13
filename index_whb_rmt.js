//var RMT_WIDTH = 256,
//		RMT_HEIGHT = 144
//;
var RMT_WIDTH = 1024,
		RMT_HEIGHT = 576
;
var
	jrmt_canvas = 0,
	jrmt_container = 0,
	g_remote_myop_pending = 0,
	g_remote_myop = 0,
	g_rmt_blankimg1 = 'images/rmt_blank2.png',
	g_rmt_blankimg2 = '../../' + g_rmt_blankimg1
;


function initRmt(){
	jrmt_canvas = $('#noVNC_canvas');
	jrmt_container = jrmt_canvas.parent();
}

///////////////////////////////////////

function sendWhbRmt(){
	var myop = 0;

	var hostport = $.trim($('#topmenu_rmt_hostport').val());
	if (hostport == ''){

		console.error('no hostport');
		closeDialog();

	} else {

		var cx = 0, cy = 0, cw = 0, ch = 0, img_w = 0, img_h = 0, img_file = '';

		switch (g_topmenu_type){

			case TOPMENU_RMT_NEW:
				var jimg = $('#topmenu_img'),
					offset = jimg.offset()
					img_file = '',
					img_w = RMT_WIDTH,
					img_h = RMT_HEIGHT
				;
				cx = offset.left;
				cy = offset.top;
				cw = jimg.width();
				ch = jimg.height();
				break;

			case TOPMENU_RMT_EDT:
				var jimg = $('#topmenu_img'),
					img_w = g_edit_op.img_w,
					img_h = g_edit_op.img_h,
					offset = jimg.offset()
				;
				img_file = jimg.attr('img_file');
				cx = offset.left;
				cy = offset.top;
				cw = jimg.width();
				ch = jimg.height();
				break;

		}

		// FIND PARAM
		var zoom = cw / img_w;
		var a1 = cvs2abs(cx, cy);
		var a2 = cvs2abs(cx + cw, cy + ch);

		myop = {
			type: 'whb_rmt',
			nick: mynick,
			img_file: img_file,
			hostport: hostport,
			img_w: img_w,
			img_h: img_h,
			x: a1.x,
			y: a1.y,
			minx: a1.x,	miny: a1.y,
			maxx: a2.x,	maxy: a2.y,
			zoom: zoom / g_final_zoom,
			password: '',
		};

		console.info('sendWhbRmt', myop);

		// SEND MY OP
		saveSendWhbOp(myop);
	}
	return myop;
}

///////////////////////////////////////////////////////////////////////

function getRmtImgFile(myop){
	//return myop.img_file ? getMyFileUrl(myop.img_file) : '../../images/rmt_blank_16_9.png';
	return getMyFileUrl(myop.img_file ? myop.img_file : g_rmt_blankimg2);
}

/////////////////////////////////ffs//////////////////////////////////////

function editWhbRmt(myop, callback){
	console.info('editWhbRmt', myop);
	var
			ax1 = myop.minx,
			ay1 = myop.miny,
			img_w = myop.img_w,
			img_h = myop.img_h,
			c1 = abs2cvs(ax1, ay1),
			c2 = abs2cvs(myop.maxx, myop.maxy),
			cx = c1.x, // - HIGHLIGHT_BORDER,
			cy = c1.y, // - HIGHLIGHT_BORDER,
			zoom = g_final_zoom * myop.zoom,
			cw = Math.floor(myop.img_w * zoom),
			ch = Math.floor(myop.img_h * zoom)
	;

	console.info('editWhbRmt', myop.hostport,
		cx + ',' + cy,
		cw + 'x' + ch
	);
	$('#topmenu_rmt_hostport').val(myop.hostport);

	$('#invisible-center')
		.attr('title', '')
		.css({left: cx, top: cy, width: cw, height: ch})
		.show()
	;
	// load image
	var img_file = myop.img_file;
	var url = getRmtImgFile(myop);
	loadTopMenuImg(url, img_file, function(img){
		openTopMenu_cvs(TOPMENU_RMT_EDT, cx, cy, zoom);
		hideToolbar();
		callback && callback();
	});

}

///////////////////////////////////////

function insertRmt(){
 	console.info('insertRmt');
	loadTopMenuImg(g_rmt_blankimg1, '', function(img){
		animate_newimg_cvs(img, function(cx, cy){
			openTopMenu_cvs(TOPMENU_RMT_NEW, cx, cy, 1);
		});
	});

}

///////////////////////////////////////////////////////////////////////
// save: 0=draw only, 1=save to undoarr and redraw
///////////////////////////////////////////////////////////////////////
function onRecvWhbRmt(myop){

	if (g_remote_myop && g_remote_myop.index == myop.index){
		// not drawing after activition
		return;
	}
	var
		c1 = abs2cvs(myop.minx, myop.miny)
		,c2 = abs2cvs(myop.maxx, myop.maxy)
		,cx = c1.x
		,cy = c1.y
		,bTestDraw = 1	// for getting the rect size
		,bTestDraw = 0
		,cw = myop.img_w
		,ch = myop.img_h
		,zoom = g_final_zoom * myop.zoom
		,cx1 = cx// - g_text_padding
		,cy1 = cy// + g_whb_grid// - g_text_padding
		,cw1 = cw * zoom
		,ch1 = ch * zoom
	;

	var img_file = myop.img_file ? myop.img_file : g_rmt_blankimg2;
	drawWhbImage(img_file, cx, cy, zoom, 0);

	// test draw text fore
	var
		scale = .8,
		rect = drawWhbText2(myop.hostport, 0, 0, 'blue', '', scale, 1),	// test draw
		cx2 = cx + (cw1 - rect.w) / 2,
		//cy2 = cy + (ch1 - rect.h) / 2
		cy2 = cy + 10,
		cw2 = rect.w + 10,
		ch2 = rect.h + 10
	;

	// draw text bkgd
	var border_radius = 8;
	drawing_ctx.fillStyle = 'white';
	drawing_ctx.roundRect(
		cx2 + g_whb_grid - 8,
		cy2 + g_whb_grid - 4,
		cw2,
		ch2,
		border_radius,
		1, 1
	);

	// draw text fore
	drawWhbText2(myop.hostport, cx2, cy2, 'blue', '', scale, 0);			// real draw
}

////////////////////////////////////////////////////////////////////////

function resolveHostPort(hostport){
	var
		host = hostport,
		port = 5900,
		port_index = hostport.indexOf(':')
	;
	if (port_index > 0){
		port = hostport.substring(port_index + 1);
		host = hostport.substring(0, port_index);
	}
	return {
		host: host,
		port: port,
	}
}

////////////////////////////////////////////////////////////////////////
// EVENTS
////////////////////////////////////////////////////////////////////////

function rmt_UIresize(w, h){
	console.info('rmt_onresize', w+'x'+h);
 	var r = jrmt_canvas.prop('width') / jrmt_canvas.prop('height');
	var w1, h1;

	w1 = w;
	h1 = Math.floor(w1 / r);
	x1 = 0;
	y1 = Math.floor((h - h1) / 2);

	if (h1 > h){
		h1 = h;
		w1 = Math.floor(h1 * r);
		x1 = Math.floor((w - w1) / 2);
		y1 = 0;
	}

	jrmt_canvas
		.css({
			width: w1,
			height: h1,
			left: x1,
			top: y1,
		})
	;//.show();
	//jrmt_container.show();
}

////////////////////////////////////////////////////////////////////////

function rmt_updateState(state, errmsg){
	console.info('rmt_updateState', state);
	updateProgressStatus(state);
	switch (state){

		case 'FBUComplete':
			changeDispMode(1, DISPMODE_REMOTE);
			jrmt_canvas.show().parent().show();

			g_remote_myop = g_remote_myop_pending;
			redrawWhiteboard();	// remove the backdrop
			closeProgressDialog(0);
			checkShowToolbar2();
			openToolbarMenu('remote');
			//jrmt_canvas.show();

			break;

		case 'error':
			//jrmt_canvas.hide();
			jrmt_container.hide();
			changeDispMode(1, DISPMODE_BOARD);

			if (g_remote_myop_pending){
				var myop = json_clone(g_remote_myop_pending);
				selectMyop(myop, function(){
					stopRmt();
					errorDialog(errmsg);
				});
			}
			break;
	}
}

///////////////////////////////////////////////////////////////////////////

function callRmtSvr(myop, view_only){

	hideToolbar();

	var
		encrypt = true, //WebUtil.getConfigVar('encrypt', (window.location.protocol === "https:"));
		repeaterID = '', //WebUtil.getConfigVar('repeaterID', '');
		local_cursor = false, //WebUtil.getConfigVar('cursor', true);
		shared = true, //WebUtil.getConfigVar('shared', true);
		view_only = view_only ? 1 : 0 //WebUtil.getConfigVar('view_only', false);
	;
	var
		hostport = resolveHostPort(myop.hostport),
		host = hostport.host,
		port = hostport.port,
		password = myop.password2 ? myop.password2 : myop.password
	;
	if (!password && !myop.remember_pwd){
		// ask now
	}

	closeTopMenu(1);

	//fitRmt2Screen(myop, function(){

		//jrmt_container.show();
		//changeDispMode(1, DISPMODE_REMOTE);

		showProgressAnimated('connecting...', 0, function(){
			stopRmt();
		});

		password = 'manipeer';
		try {
			window.connectRFB(host, port, password, '', jrmt_canvas[0], encrypt, repeaterID, local_cursor, shared, view_only);
			//jrmt_container.show();
		} catch (e){
			stopRmt();
		}
		myop.password2 = '';
	//});
	return password;
}


/////////////////////////////////////////////////////////////////////////

function onRecvWhbRmtView(myop){
	g_remote_myop_pending = json_clone(myop);
	//g_remote_index = g_edit_index;
	g_edit_op.index = g_edit_index;	// redundant: make sure the index is the same
	//g_remote_myop.rmt_activited = 1;

	console.info('onRecvWhbRmtView', myop);

	// start server
	callRmtSvr(myop, 1);

}

////////////////////////////////////////////////////////////////////

function onRecvWhbRmtStop(myop){
	console.info('onRecvWhbRmtStop');
	endRmtSvr(myop);
}

////////////////////////////////////////////////////////////////////

function sendRmtStop(myop){
	// send to others
	var myop2 = json_clone(myop);
	myop2.type = 'whb_rmt_stop';
	sendMsg(myop2);
}

///////////////////////////////////////

function stopRmt(callback){
	if (!g_remote_myop_pending) return;
 	console.info('stopRmt');

	var
		myop = g_remote_myop_pending,
		jpg_quality = 94,
		//canvas = document.getElementById('noVNC_canvas'),
		//img_url = canvas.toDataURL("image/jpeg", jpg_quality)
		//jcanvas = $('#noVNC_canvas');
		img_url = jrmt_canvas[0].toDataURL("image/jpeg", jpg_quality)

	;

	closeProgressDialog(0);

	jrmt_container.hide();
	changeDispMode(1, DISPMODE_BOARD);

	// upload this url
	if (g_remote_myop){

		jsUploadDataUrl(img_url, myop.hostport, '', RMT_WIDTH, 0, function(output){

			console.info('stopRmt2', output);
			// get position first
			var
				img_w = parseInt(output.w),
				img_h = parseInt(output.h)
			;

			// reset param
			var myop2 = json_clone(myop);
			myop2.img_file = output.file + '?d=' + getDateTime();	// add date to update
			myop2.img_w = img_w;
			myop2.img_h = img_h;
			//myop2.maxx = myop.minx + img_w * myop.zoom;
			//myop2.maxy = myop.miny + img_h * myop.zoom;

			sendRmtStop(myop2);

			endRmtSvr(myop2, callback);

		});


	} else {

		// show toolbar
		checkShowToolbar2();
	}

}

/////////////////////////////////////////////////////////////////////////////////////////

function startRmt(){

	if (!g_edit_op){
		// save the object first
		var myop = onDialogOkay();
		myop.img_file = getRmtImgFile(myop);
		// selec the object
		//selectMyop(myop, function(){
			// remove this object
			var myop2 = extractMyop(g_obj_arr.length - 1);
			// show edit and get edit obj
			editWhbRmt(myop2, function(){
				startRmt2();
			});
		//});
	} else {
		startRmt2();
	}
}

/////////////////////////////////////////////////////////////////////////////////////////

function startRmt2(){
	if (!g_edit_op){
		console.error('startRmt: no g_edit_op');
		return;
	}

	var myop = g_edit_op;
	g_remote_myop_pending = json_clone(myop);
	g_edit_op.index = g_edit_index;	// redundant: make sure the index is the same

	onDialogOkay();
	console.info('startRmt2', myop);

	// start server
	var password = callRmtSvr(myop, 0);

	// send to others
	var myop2 = json_clone(myop);
	myop2.type = 'whb_rmt_view';
	myop2.password2 = password;
	sendMsg(myop2);

	//openToolbarMenu('remote');
	//changeDispMode(1, DISPMODE_REMOTE);

}

/////////////////////////////////////////////////////////////////

function endRmtSvr(myop, callback){

	myop.type = 'whb_rmt';
	g_obj_arr[myop.index] = myop;

	// hide canvas
	jrmt_container.hide();
	changeDispMode(1, DISPMODE_BOARD);

	// zoom out
	selectMyop(myop, function(){

		// reset op
		g_remote_myop_pending =
		g_remote_myop = 0;

		// show toolbar
		openToolbarMenu();
		checkShowToolbar2();

		// disconnect now
		try {
			window.disconnectRFB();
		} catch (e){}

		// clear canvas
		var
			canvas = jrmt_canvas[0],
			context = canvas.getContext('2d')
		;
		context.clearRect(0, 0, canvas.width, canvas.height);

		// redraw
		redrawWhiteboard();

		callback && callback();

	});
}

///////////////////////////////////////
/*
	var r = g_nScreenW / cw / myop.zoom;
	setWhbGridOffset(r, ax, ay);
	var
		cw2 = 0,
		ch2 = (g_nScreenH - ch1) / 2
	;
	g_whb_offset_y += ch2;

	console.info(myop);
	console.info('screen='+g_nScreenW, 'cw='+cw, 'zoom='+myop.zoom, 'r='+r);
	console.info('l='+g_whb_zoom_lvl, g_whb_offset_x +', ' + g_whb_offset_y, cw+'x'+ch);

	if (isNaN(g_whb_zoom_lvl)){
		debugger;
	}

	redrawWhiteboard();

	sendWhbZoom();
*/

/*
function fitRmt2Screen(myop, callback){

	var
		cw = myop.img_w,
		ch = myop.img_h,
		cw1 = cw * myop.zoom,
		ch1 = ch * myop.zoom,
		//ax = myop.x,
		//ay = myop.y,

		r = g_nScreenW / cw / myop.zoom,
		ch2 = (g_nScreenH - ch1) / 2,

		minx = 0,
		miny = 0,
		maxx = 0,
		maxy = 0
	;
	animate_2pt(minx, miny, maxx, maxy, function(){
		callback && callback();
	});
}
*/
