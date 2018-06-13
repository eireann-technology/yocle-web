
jQuery.fn.outerHTML = function(s){
	return s
		? this.before(s).remove()
		: jQuery("<p>").append(this.eq(0).clone()).html();
}


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
