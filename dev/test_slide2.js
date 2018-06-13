function toggleDivs() {
    var
      jdiv = $('#div_trans1'),
      jdiv_inner = jdiv.find('>div')
    ;

    if (jdiv_inner.position().left == 0) {
        var w = jdiv.width();
        jdiv_inner.animate({
            left: -w,
        });
    }
    else {
        jdiv_inner.animate({
            left: 0,
        });
    }
}

$("button").bind("click", function() {
    toggleDivs();
});

var g_nScreenW = 0, g_nScreenH = 0;

function checkOnResize(){
    var 
        w = eval(window.innerWidth|| document.documentElement.clientWidth || document.body.clientWidth),
        h = eval(window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight)
    ;
    if (w != g_nScreenW || h != g_nScreenH){
        g_nScreenW = w;
        g_nScreenH = h;
        $('.div_transdiv').width(w);
        $('.div_transdiv>div').width(w * 2);
        $('.div_transdiv>div>div')
            .width(w)
            .each(function(){
               var
                jdiv = $(this),
                x = jdiv.position().left
               ;
               console.info(x, w);
               if (x > 0){
                   jdiv.css({left: w});
               }//
            });
    }
}

checkOnResize();
setInterval(checkOnResize, 1000);
