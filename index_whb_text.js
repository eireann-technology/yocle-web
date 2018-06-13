
///////////////////////////////////////////////////////////////////////////
var DEFAULT_FSIZE = 30;
var g_caption_h = 0;

function initWhiteboard_text(){
}

////////////////////////////////////////////////////////////////////////////////////////
var g_text_canvas_dw = 10;
CanvasRenderingContext2D.prototype.wrapText = function(text, x, y, maxWidth, scale, bTestDraw){
	var rect_w = 0, rect_h = 0, nLine = 0;
	if (text){	
		var fsize = DEFAULT_FSIZE * scale * g_final_zoom + 'px';
		var lineHeight = (DEFAULT_FSIZE * scale + 3) * g_final_zoom;
		//var lineHeight = getTextHeight('sans-serif', fsize);
		drawing_ctx.font = fsize + ' sans-serif';
		drawing_ctx.textAlign = 'left';
		drawing_ctx.textBaseline = 'top';
		// testing
		var x0 = x, y0 = y;
		//if (bTestDraw){
			//console.info('wrapText1', 'scale='+scale, 'maxWidth='+Math.floor(maxWidth));
			//drawing_ctx.fillStyle = 'black';
			//drawing_ctx.fillRect(x, y, maxWidth, lineHeight);
			//drawing_ctx.fillStyle = 'white';
		//}
		// revised wraptext v4.0 by alantypoon 20160409
		// for each line
		var lines = text.split('\n');
		for (var t = 0; t < lines.length; t++){
			var line = '';
			var thisline = lines[t];
			if (checkUnicode(thisline)){
				line = thisline;
			} else {
				var words = thisline.split(' ');
				for (var n = 0; n < words.length; n++){
					var testLine = line + words[n] + ' ';
					var testWidth = this.measureText(testLine).width;
					if (n > 0 && maxWidth != '' && testWidth > maxWidth + g_text_canvas_dw){
						// one more word is over the limit
						//console.error('wraptext(over maxWidth)', testWidth+'/'+maxWidth);
						if (!bTestDraw){
							this.fillText(line, x, y);
						}
						var w = this.measureText(line).width;
						if (w > rect_w){
							rect_w = w;
						}
						y += lineHeight;
						nLine++;
						//console.info(line, nLine);
						// new line
						line = words[n] + ' ';
					} else {
						line = testLine;
					}
				}
			}
			// line-break for too long width
			var line2 = '';
			for (var n = 0; n < line.length; n++){
				var ch = line[n];
				if (ch == 10){	// enter
					//console.info('wraptext2', 'return');
					y += lineHeight;
					nLine++;
					//console.info('enter', nLine);
				} else {
					var testLine = line2 + ch;
					var testWidth = this.measureText(testLine).width;
					if (n > 0 && maxWidth != '' && testWidth > maxWidth + g_text_canvas_dw){
						//console.info('wraptext3', testLine, testWidth, maxWidth, y);
						if (!bTestDraw){
							this.fillText(line2, x, y);
						}
						var w = this.measureText(line2).width;
						if (w > rect_w){
							rect_w = w;
						}
						line2 = ch;
						y += lineHeight;
						nLine++;
						//console.info(line2, nLine);
					} else {
						line2 = testLine;
					}
				}
			}
			//console.info('wraptext4', line2, y);
			if (!bTestDraw){
				this.fillText(line2, x, y);
			}
			var w = this.measureText(line2).width;
			if (w > rect_w){
				rect_w = w;
			}
			y += lineHeight;
			nLine++;
			//console.info(line2, nLine);
		}

		rect_h = nLine*lineHeight;
	} else {
		console.error('drawWhbText2: no text')
	}
	// testing
	//if (bTestDraw){
	//	console.info('wrapText2', 'rect_w='+rect_w, 'rect_h='+rect_h);
	//	drawing_ctx.fillStyle = 'yellow';
	//	drawing_ctx.fillRect(x0, y0, rect_w, rect_h);
	//	drawing_ctx.fillStyle = 'white';
	//}

	//console.info('wrapText2', 'h='+lineHeight);

	return {w:rect_w, h:rect_h, lines:nLine};
}

///////////////////////////////////////////////////////////////////////////
/*
CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  this.beginPath();
  this.moveTo(x+r, y);
  this.arcTo(x+w, y,   x+w, y+h, r);
  this.arcTo(x+w, y+h, x,   y+h, r);
  this.arcTo(x,   y+h, x,   y,   r);
  this.arcTo(x,   y,   x+w, y,   r);
  this.closePath();
  return this;
}
*/
// http://stackoverflow.com/questions/1255512/how-to-draw-a-rounded-rectangle-on-html-canvas
/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Object} radius All corner radii. Defaults to 0,0,0,0;
 * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
 * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
 */

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius, fill, stroke) {
	var cornerRadius = { upperLeft: 0, upperRight: 0, lowerLeft: 0, lowerRight: 0 };
	if (typeof stroke == "undefined") {
		stroke = true;
	}
	for (var side in cornerRadius) {
		if (typeof radius === "object") {
			cornerRadius[side] = radius[side];
		} else {
			cornerRadius[side] = radius;
		}
	}
	this.beginPath();
	this.moveTo(x + cornerRadius.upperLeft, y);
	this.lineTo(x + width - cornerRadius.upperRight, y);
	this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
	this.lineTo(x + width, y + height - cornerRadius.lowerRight);
	this.quadraticCurveTo(x + width, y + height, x + width - cornerRadius.lowerRight, y + height);
	this.lineTo(x + cornerRadius.lowerLeft, y + height);
	this.quadraticCurveTo(x, y + height, x, y + height - cornerRadius.lowerLeft);
	this.lineTo(x, y + cornerRadius.upperLeft);
	this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
	this.closePath();
	if (stroke) {
		this.stroke();
	}
	if (fill) {
		this.fill();
	}
}

///////////////////////////////////////////////////////////////////////////////////

function closeWhbText(){
	//$('#div_text').highlight(0).hide();
	closeText2();
}


/////////////////////////////////////////////////////////////////

var g_resizing_text = 0;
var MIN_TEXT_SIZE = 10;

function drawWhbText2(text, cx, cy, color, maxWidth, scale, bTestDraw){
	if (color){
		drawing_ctx.fillStyle = color;
	}
	if (!scale){
		scale = 1;
	}
	var	x = (cx+g_whb_grid), y = (cy+g_whb_grid);
	var rect = drawing_ctx.wrapText(text, x, y, maxWidth, scale, bTestDraw);
	return rect;
}
