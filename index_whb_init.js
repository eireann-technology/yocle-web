var SIG_FIG = 100;
var jcanvas = 0, editing_ctx = 0, drawing_ctx = 0, drawing_ctx_orig = 0;
var WHB_EDGE_OFFSET = 100;
var g_imgonscreen_arr = {};

// INITIALIZATION
function initWhiteboard(){
	jcanvas = $('#div_board');
	drawing_ctx_orig = drawing_ctx = jcanvas[0].getContext('2d');
	editing_ctx = $('#canvas_edit')[0].getContext('2d');

	// mouse event for canvas
	resetPen();
	if (bHasTouchScreen){

		var initScale = 1;
		setAPinch(jcanvas, function(el, w0, h0, e){

			if (g_mycursor == CURSOR_MOVE){

				console.info('skipped pinch in move mode');

			} else {
				if (e.type == 'pinchstart'){
					initScale = getWhbZoom(g_whb_zoom_lvl) / e.scale;
				}
				var scale = initScale * e.scale;
				//console.info('e.scale=' + e.scale, 'initScale=' + initScale, 'scale=' + scale);
				var
					cx = e.center.x,
					cy = e.center.y,
					zlvl = getWhbZoomRev(scale);
				;
				if (e.type != 'pinch') // simply too much
				{
					//console.info(e.type, initScale, e.scale, zlvl, cx, cy);
				}
				setWhbZoomLvl(zlvl, cx, cy);	// cx & cy as the reference point for the zooming
			}
		});

	}
}

//////////////////////////////////////////////////////////////////////

var g_bWhiteboard = 0;
var g_obj_arr = new Array(),
		g_chat_arr = new Array(),
		g_undo_arr = new Array(),
		g_redo_arr = new Array()
;

function startWhiteboard(bForce){
	console.log('startWhiteboard', bForce);
	if (!g_bWhiteboard || bForce){
		console.info("startWhiteboard");
		jcanvas.show();
		g_bWhiteboard = 1;
		redrawWhiteboard();
	}
}

//////////////////////////////////////////////////////////////////////

function stopWhiteboard(bForce){
	console.log('stopWhiteboard', bForce);
	if (g_bWhiteboard || bForce){
		console.info("stopWhiteboard");
		jcanvas.hide();
		g_bWhiteboard = 0;
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////

function drawWhbCircle(color, strokesize, strokecolor, x, y, r){
	console.info('drawWhbCircle: ' + x + ',' + y + ' r='+r);
	drawing_ctx.beginPath();
	drawing_ctx.arc(x + g_whb_grid, y + g_whb_grid, r, 0, 2 * Math.PI, false);
	drawing_ctx.fillStyle = color;
	drawing_ctx.fill();
	drawing_ctx.lineWidth = strokesize;
	drawing_ctx.strokeStyle = strokecolor;
	drawing_ctx.stroke();
}

//////////////////////////////////////////////////////////////////////////////////////////////////
var debug_drawwhb = 0;
var debug_redraw = 0;

function drawWhiteboard(){
	//console.info('drawWhiteboard1', g_obj_arr.length);
	var time1;
	if (debug_drawwhb){
		time1 = new Date();
	}
	g_imgonscreen_arr = {};

	// find canvas bound
	var a1 = cvs2abs(0, 0);
	var a2 = cvs2abs(g_nScreenW, g_nScreenH);
	var minx = a1.x, miny = a1.y, maxx = a2.x, maxy = a2.y;

	for (var i = 0; i < g_obj_arr.length; i++){
		var myop = g_obj_arr[i];
		if (myop){
			if (!myop.type){
				console.error('undefined myop.type', myop);
			}
			// beyond screen min
			var pass1 = myop.minx >= minx && myop.miny >= miny?1:0;
			var pass2 = myop.maxx >= minx && myop.maxy >= miny?1:0;
			// within screen max
			var pass3 = myop.minx <= maxx && myop.miny <= maxy?1:0;
			var pass4 = myop.maxx <= maxx && myop.maxy <= maxy?1:0;
			var tmp = '';
			if (debug_redraw){
				tmp = myop.type + '\n' +
					'  myop=' + myop.minx + ',' + myop.miny + ' ' + myop.maxx + ',' + myop.maxy + '\n' +
					'screen=' + minx + ',' + miny + ' ' + maxx + ',' + maxy + '\n' +
					'  pass=' + pass1 + ',' + pass2 + ',' + pass3 + ',' + pass4;
			}
			// check boundary
			if ((pass1 || pass2) && (pass3 || pass4))
			{
				if (debug_redraw && myop.type == 'whb_pdf') console.info(tmp + '=>draw');
				switch (myop.type){
					case "whb_line":
					case "whb_lines":				onRecvWhbLine(myop);			break;	// don't put it in array
					case "whb_text":				onRecvWhbText(myop);			break;
					case "whb_img": 				onRecvWhbImg(myop);				break;
					case "whb_pdf":					onRecvWhbPdf(myop);				break;
					case "whb_rmt":					onRecvWhbRmt(myop);				break;
				}
			} else {
				if (debug_redraw && myop.type == 'whb_pdf') console.error(tmp + '=>skipped');
			}
		}
	}
	refreshMinimap();
	if (debug_drawwhb){
		var time2 = new Date();
		console.info('drawWhiteboard', 'obj='+g_obj_arr.length, 'elapsed='+(time2-time1)+'msec');
	}
}


////////////////////////////////////////////////////////////////////
// redrawWhiteboard
////////////////////////////////////////////////////////////////////

var
	g_redraw_msec = 0,
	//g_redraw_msec = 250,
	g_redraw_timeout = 0
;

function redrawWhiteboard(){
	if (!g_redraw_msec){
		redrawWhiteboard_delay();
	} else if (!g_redraw_timeout){
		g_redraw_timeout = setTimeout(redrawWhiteboard_delay, g_redraw_msec);
	} else {
		console.error('skipped redrawWhiteboard');
	}
}

/////////////////////////////////////////////////////////////////////

function redrawWhiteboard_delay(){
	if (g_display_mode != DISPMODE_BOARD && g_display_mode != DISPMODE_SCREEN){
		return;
	}
	clearWhiteboard();
	// RESIZE WRITING
	if (g_bWhiteboard){
		//clearWhiteboard();	// change of width or height already clean
		drawWhiteboard();
	}

	if (g_redraw_timeout){
		clearTimeout(g_redraw_timeout);
		g_redraw_timeout = 0;
	}
}

/////////////////////////////////////////////////////////////
//var AXIS_COLOR = '#404040',	GRID_COLOR = '#c0c0c0';	// darker
var AXIS_COLOR = '#808080',	GRID_COLOR = '#d0d0d0';	// lighter

function clearWhiteboard(){

	// clear board
	//var canvas = jcanvas[0];
	//drawing_ctx.clearRect(0,0, canvas.width, canvas.height);	// transparent background
	var w = g_nScreenW, h = g_nScreenH, w1 = w+g_whb_grid, h1 = h+g_whb_grid;// soffset = '-' + g_whb_grid + 'px';
	var obj = {
		top: -g_whb_grid,
		left: -g_whb_grid,
		width: w1,
		height: h1,
	};
	//console.info('clearWhiteboard', obj);
	jcanvas
		.show()
		.attr("width", w1).attr("height", h1)
		.css(obj)
		//.width(w1).height(h1);	// other css has no effect
		//.offset({left:-g_whb_grid, top:-g_whb_grid});
	;

	// clear explicitly
	var c = jcanvas[0];
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.rect(g_whb_grid, g_whb_grid, w, h);
	ctx.fillStyle = "white";
	ctx.fill();

	if (g_display_mode == DISPMODE_BOARD){
		// draw grid (only in board mode)
		var w = parseInt(jcanvas.attr('width'));
		var h = parseInt(jcanvas.attr('height'));
		if (w && h && g_whb_grid >= 0 && g_final_zoom > 0 && !isNaN(g_whb_offset_x) && !isNaN(g_whb_offset_y)){
			//console.info('drawBigWhbGrid', g_whb_offset_x+'x'+g_whb_offset_y);
			var whb_grid = 100 * g_final_zoom;
			//var start = 50;
			var i = -(g_whb_offset_x + g_whb_grid)/whb_grid,
					j = -(g_whb_offset_y + g_whb_grid)/whb_grid;
			i = i <= -1 ? Math.ceil(i) : Math.floor(i);
			j = j <= -1 ? Math.ceil(j) : Math.floor(j);
			//console.info('***z='+g_final_zoom+' g='+Math.floor(whb_grid)+' o='+Math.floor(g_whb_offset_x)+','+Math.floor(g_whb_offset_y)+' i='+i+' j='+j);
			var x = (g_whb_offset_x % whb_grid) + whb_grid, y = (g_whb_offset_y % whb_grid) + whb_grid;
			drawing_ctx.font = "14px arial";
			drawing_ctx.textAlign = 'center';
			drawing_ctx.textBaseline = 'middle';
			drawing_ctx.fillStyle = GRID_COLOR;
			var size = 1;
			var textcolor = AXIS_COLOR;
			var textsize = 14;

			var sx = 0, sy = 0, ex = 0, ey = 0, offset = 0;
			var jvideo = $('.video_screen');
			var jdiv = jvideo.parent();

			var c = abs2cvs(0, 0),																								// screen center
				cx = c.x + g_whb_grid, 						cy = c.y + g_whb_grid,							//
				x1 = g_whb_grid + 1, 							y1 = g_whb_grid + 1,								// screen NW
				x2 = g_nScreenW + g_whb_grid - 1, y2 = g_nScreenH + g_whb_grid - 1;		// screen SE

			var bShowBodyGrid = 1,
					bShowMarker = 0,
					bShowCenterPoint = 0,
					bShowBorder = 0,
					bShowCrossHair = 1;

			if (bShowBodyGrid){
				// vertical lines
				while (1){
					if (bShowMarker){
						drawWhbText2((++i).toString(), x, 0, textcolor);
					}
					drawWhbStLine(GRID_COLOR, size, x, 0, x, h);
					x += whb_grid;
					if (x > w) break;
				}
				// horizontal lines
				while (1){
					if (bShowMarker){
						drawWhbText2((++j).toString(), g_nScreenW - 20, y, textcolor);
					}
					drawWhbStLine(GRID_COLOR, size, 0, y, w, y);
					y += whb_grid;
					if (y > h) break;
				}
			}
			if (bShowCenterPoint){
				drawWhbLine2('blue', 10, cx, cy, cx + 1, cy, sx, sy, ex, ey);
			}
			if (bShowBorder){
				var color = 'green';
				drawWhbStLine(color, 1, x1, y1, x2, y1);
				drawWhbStLine(color, 1, x1, y2, x2, y2);
				drawWhbStLine(color, 1, x1, y1, x1, y2);
				drawWhbStLine(color, 1, x2, y1, x2, y2);
			}

			if (bShowCrossHair){
				var size = 1;
				drawWhbStLine(AXIS_COLOR, size, cx, y1, cx, y2);
				drawWhbStLine(AXIS_COLOR, size, x1, cy, x2, cy);
			}
		}
	}
}

////////////////////////////////////////////////////////////////////////////////////////////////

function onPenDblClick(e){
	if (g_locked){
		return;
	}
	switch (g_mycursor){
		case CURSOR_MOVE:
			var a = cvs2abs(g_nMouseX, g_nMouseY);
			toggleZoom(a.x, a.y);
			break;
	}
}
