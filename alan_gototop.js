$(function(){

	// https://dotblogs.com.tw/f2e/2016/02/26/172615
  $(window).scroll(function(){
  	var jobj = $(".gototop");
		var scrolltop = $(window).scrollTop();
		if (jobj.attr('disable') != 1 && scrolltop >= 70){
		 	jobj.fadeIn();
		} else{
		  jobj.fadeOut();
		}
  });

	$(document.body).append($('<div class="gototop" selectable="false"><img src="./images/alan_gototop_24.png"/></div>')
		.click(function(){
			// instead of $(window).scrollTop(0)
			scrollNow(0, 100);
			return false;
		}));
})

function enableGotoTop(bEnable){
	console.log('enableGotoTop', bEnable);
	if (bEnable){
		$('.gototop').attr('disable', 0);
	} else {
		$('.gototop').attr('disable', 1).hide();
	}
}
