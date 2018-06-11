
var g_debug_transdiv = 0;

var g_transdiv_index = 0;

var g_scrolltop_arr2 = [];

function transdiv(jparent, index, callback){
    
    g_scrolltop_arr2[index] = $(window).scrollTop();

    var
        jinner = jparent.find('>div'),
        w = jparent.width(),
        x = -w * index,
        jchild = jinner.find('>div:nth-child(' + (index + 1) + ')'),
        h = jchild.height()
     ;
    if (g_debug_transdiv){
      console.info('transdiv', index, 'x='+x, 'height='+h);
    }

    jparent
      .attr('transdiv_index', index)
      .height(h)
    ;
    g_transdiv_index = index;

    jchild.height(h);

    jinner.animate({
        left: x,
        height: h,
    }, function(){
      transdiv_resize();
      callback && callback();
    });
}

////////////////////////////////////////////////////

function transdiv_resize(){
	// ensure it must work (e.g. after scrolling open)
	transdiv_resize2();
  	//setTimeout(transdiv_resize2, 500);
	//setTimeout(transdiv_resize2, 1000);
}

////////////////////////////////////////////////////

function transdiv_resize2(){
	$('.div_transdiv').each(function(){
		var
			jparent = $(this),
			jroot = jparent.closest('.div_transdiv_root'),
			w = jroot.width(),
			h = jroot.height()
		;
		if (g_debug_transdiv){
			console.info('transdiv_resize', jroot, 'w=' + w, 'h=' + h);
		}
		jparent.width(w);
		jparent.find('>div').width(w * 2);

		var jdivs = jparent.find('>div>div');
		jdivs
			.width(w - 20)
			.each(function(){
				 var
					jchild = $(this),
					//jparent = jchild.closest('.div_transdiv'),
					jinner = jparent.find('>div'),
					w = jchild.width(),
					w2 = jparent.width(),
					m = jdivs.index(jchild),
					x = m * w2
				 ;
				 jchild.css({left: x});

				 var n = parseInt(jparent.attr('transdiv_index'));
				 if (isNaN(n)) n = 0;

				 if (g_debug_transdiv){
					console.info('#' + m, 'left='+x, 'w2='+w2);
				 }
				 if (m == n){

				 	jchild.css({'height': ''});	// allow free expansion

					 var
						x2 = -w2 * m,
						h = jchild.height()
					 ;
					 jinner.css({left: x2});
					 if (g_debug_transdiv){
						 console.log('selected=' + m, 'height='+h, 'x='+x2);
					 }
					 jparent.css({
						 height: h + 10,// + 70,
					 });
				 }
		});

	});
}
