var
	TAB_HOME = 0,
	TAB_PROFILE = 1,
	TAB_NTWK = 2,
	TAB_OCLX = 3,
	TAB_YOLOX = 4,
	TAB_ACTIVITY = 3
;

//////////////////////////////////////////////////////////////////////

jQuery.fn.outerHTML = function(s){
	return s
		? this.before(s).remove()
		: jQuery("<p>").append(this.eq(0).clone()).html();
}

//////////////////////////////////////////////////////////////////////

var g_editor_opts = {
	lang: 'en',
	fixedBtnPane: true,
	btnsGrps: {
		test: ['strong', 'em'] // Custom nammed group
	},
	btnsDef: {
			// Customizables dropdowns
			align: {
					dropdown: ['justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'],
					ico: 'justifyLeft'
			},
			image: {
					dropdown: ['insertImage', 'noembed', 'upload'],//, 'base64'],
					ico: 'insertImage'
			},
			//createTable: {
			//	ico: 'createTable',
			//}
	},
	btns: [
			//['createTable'],
			['bold', 'italic', 'underline'],//, 'strikethrough'],
			['formatting'],
			['align'],
			['unorderedList', 'orderedList'],
			//['superscript', 'subscript'],
			['link'],
			['image'],
			['foreColor', 'backColor'],
			//['preformatted'],
			['horizontalRule'],
			['removeformat'],
			['viewHTML'],
//					['fullscreen', 'close']
			//['undo', 'redo'],
			['script', 'style'],
	],
	autogrow: true,
};

/////////////////////////////////////////////////////////////////

function drawSvg(jobj){
	jobj.each(function(){
		var jobj = $(this),
			svg = jobj.attr('svg'),
			html = svg_obj[svg],
			jhtml = $(html);
		var svgfill = jobj.attr('svgfill'),
				svgsize = jobj.attr('svgsize'),
				svgback = jobj.attr('svgback')
		;
		jhtml
			.find('path,ellipse,circle,polygon')
			.attr('fill', svgfill ? svgfill : '#ffffff')
		;
		if (svgsize){
			jhtml.width(svgsize).height(svgsize)
		}
		if (svgback){
			jobj.css('background-color', svgback);
		}
		jobj.find('svg').remove();
		jobj.prepend(jhtml);
		//console.debug(jobj.outerHTML());
	});
}


/////////////////////////////////////////////////////////////////////////////////////

function onDelete(but){
	//if (confirm('Are you sure to delete this?')){
    $( "#dialog-confirm" ).dialog({
      modal: true,
      resizable: false,
      height:180,
      buttons: {
        "Yes": function() {
          $( this ).dialog( "close" );
					
					var jbut = $(but),
							jtd = jbut.parent(),
							jtr = jtd.parent(),
							jtbody = jtr.parent(),
							jtrs = jtbody.find('tr'),
							length = jtrs.length,
							index = jtrs.index(jtr)
					;
					//console.debug(index, length);
					if (index == length - 1){
						jtr.find('textarea').val('').css('height', '');
						jtr.find('div.autogrow-textarea-mirror').html('');
					} //else 
					{
						jtr.remove();
					}

					$('.div_details').each(function(){
						var num = 1;
						$(this).find('.assessment_num').each(function(){
							$(this).text((num++) + '.');
						});
						var code = 65; // begin from A
						$(this).find('.mcq_letter').each(function(){
							$(this).text(String.fromCharCode(code++) + '.');
						});
					});
				
        },
        Cancel: function() {
          $( this ).dialog( "close" );
        }
      }
    });		
		
	//}
}


//////////////////////////////////////////////////////////////////////
 
 function setBalloonNumber(name, num){
	var jobj = $('#topmenu_'+name), jballoon = jobj.find('.balloon'), jtext = jobj.find('.balloon2');
	if (num){
		if (num > 99){
			num = 99;
		}
		var offset = jobj.offset(), x = offset.left, y = offset.top, w = jobj.width(), w1 = num.toString().lenth*10;
		jtext.text(num);
		jballoon.show();
	} else {
		jballoon.hide();
	}
}

//////////////////////////////////////////////////////////////////////
 
function toggleDropmenu(obj, menu){
	var jobj = $(obj), jmenu = $("#dropmenu_"+menu);
	if (jmenu.css('display') != 'none'){
		console.debug('toggleDropMenu', 'close');
		jmenu.hide();
	} else {
		console.debug('toggleDropMenu', 'open');
		openDropmenu(obj, menu);
	}
}
