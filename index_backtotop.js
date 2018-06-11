// plugtrade.com - jQuery detect vertical scrollbar function //
(function($) {
    $.fn.has_scrollbar = function() {
        var divnode = this.get(0);
				var rv = divnode.scrollHeight > divnode.clientHeight;
				if (rv){
					console.log($(this), rv);
				}
        //return (divnode.scrollHeight > divnode.clientHeight)
    }
})(jQuery);

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
	var 
		scrolltop = $('#div_main').scrollTop(),
		jbtn = $('#myBtn')
	;
	console.info(scrolltop);
	if (scrolltop > 20) {
		jbtn.show();
	} else {
		jbtn.hide();
	}
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	//document.body.scrollTop = 0; // For Safari
	//document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
	$('html, body').animate({ scrollTop: 0 }, 'fast');
}

function initBackToTop(){
	//document.body.append('<button onclick="topFunction()" id="myBtn" title="Go to top">Top</button>');
	var elem = document.createElement('button');
	elem.onclick = topFunction;
	elem.id = 'myBtn';
	elem.title = 'Go to top';
	document.body.appendChild(elem);
}