<html>
<head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">

<script>

function load_script(path, s){
	if (s) path += '?d=' + s;
	var sNew = document.createElement("script");
	sNew.async = false;
	sNew.src = path;
	document.head.appendChild(sNew);
}
function load_css(path, s){
	if (s) path += '?d=' + s;
	var sNew = document.createElement("link");
	sNew.async = false;
	sNew.href = path;
	sNew.type = "text/css";
	sNew.rel = "stylesheet";
	document.head.appendChild(sNew);
}
function getDateString2(){
	var d = new Date();
	return d.getFullYear().toString() + d.getMonth().toString() + d.getDate().toString() + d.getHours().toString() + d.getMinutes().toString() + d.getSeconds().toString();
}

var d = getDateString2();

d = '';

var arr = ['jquery-3.1.1.js', 'jquery.jscroll-alan.js'];

arr.forEach(function(files){
	if (files){
		files.split(' ').forEach(function(file){
			if (file.indexOf('.css') > 0){
				load_css('./' + file, d);
			} else if (file.indexOf('.js') > 0){
				load_script('./' + file, d);
			}
		})
	}
});

window.onload = function(){
	var
		jscroll = $('.jscroll'),
		jtest1 = $('.jtest1'),
		jtest2 = $('.jtest2')
	;
	jscroll.hide();
	jtest1.show();
	jtest2.hide();

///*
	$('#but_switch').click(function(){
		if (jscroll.is(':visible')){
			jscroll
				.html('')
				.hide()
			;
			jtest1.show();
			jscroll.jscroll('destroy');
		} else {
			jtest1.hide();
			jscroll
				.html('<div class="next"><a href="./example-page1.html">next page</a></div>')
				.show()
			;

			if (!jscroll.find('.scroll-inner').length){
				jscroll.jscroll({
					debug: true,
					autoTrigger: true,
					loadingHtml: '<img src="loading.gif" alt="Loading"/> Loading...',
					nextSelector: '.next a:last',
					contentSelector: '.contents',
					padding: 20,
				});
			}
		}
	});
//*/
/*
jscroll.hide();
jtest2.show();
jtest1.hide();

$('#but_switch').click(function(){
	if (jtest1.is(':visible')){
		jtest1.hide();
		jtest2.show();
	} else {
		jtest2.hide();
		jtest1.show();
	}
});
*/
}
</script>
<style>
</style>
</head>

<body>

<button id="but_switch">switch</button>

<div class="jscroll" style="height:100%; background:yellow">
	<div class="next">
		<a href="./example-page1.html">next page</a>
	</div>
</div>


<div class="jtest1" style="background:green">

	<h3>Page 1</h3>
	<p>
		Page 1 of jScroll Example - jQuery Infinite Scrolling Plugin
		This is the content of page 1 in the jScroll example. Scroll to the bottom of this box to load the next set of content.
		This is example text for the jScroll demonstration. jScroll is a jQuery plugin for infinite scrolling, endless scrolling, lazy loading, auto-paging, or whatever you may call it.
		With jScroll, you can initialize the scroller on an element with a fixed height and overflow setting of "auto" or "scroll," or it can be set on a standard block-level element within the document and the scrolling will be initialized based on the brower window's scroll position.
		jScroll is open-source and can be downloaded from my GitHub repository at github.com/pklauzinski/jscroll.
	</p>

	<hr>
	<h3>Page 2</h3>
	<p>This is the content of <strong>page 2</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
	<p>Fusce et nunc sed nibh eleifend posuere. Integer sodales, elit sit amet porta varius, augue elit consectetur tortor, vitae rhoncus diam ipsum sed quam. Nullam turpis magna, convallis ultrices auctor ut, gravida eu leo. Pellentesque ut risus nibh, in ultrices ante. Suspendisse potenti. Vestibulum dolor sapien, dapibus non fringilla at, fringilla sed ipsum. In adipiscing mi nec risus hendrerit sollicitudin. Nullam eget felis tellus. Quisque dapibus molestie scelerisque. Curabitur sit amet tortor erat, et pretium nisl. Phasellus posuere, nibh vel feugiat sagittis, ligula lorem porttitor sapien, quis aliquam nisl nulla vel nunc.</p>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ullamcorper eros, non ullamcorper diam. Aliquam euismod erat eget purus volutpat sagittis. Aliquam pharetra, magna quis lacinia lacinia, lorem sapien placerat erat, hendrerit rhoncus felis ligula ultrices neque. Duis eleifend mi id tempor rutrum. Mauris vitae metus sodales, luctus odio eu, semper sapien. Morbi vitae tellus urna. Mauris suscipit dignissim nisl, eu laoreet ligula laoreet vel. In semper nibh neque, dapibus condimentum lorem convallis nec. Suspendisse ut tincidunt orci. Maecenas vel lacinia mauris. Phasellus tempor, urna vitae ultricies eleifend, mi diam condimentum libero, eget fermentum dui nisi eget leo. Morbi at scelerisque massa, quis sollicitudin est. Donec viverra congue augue, semper malesuada tellus tempor sit amet. Morbi placerat sollicitudin dignissim.</p>

	<hr>
	<h3>Page 3</h3>
	<p>This is the content of <strong>page 3</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
	<p>Duis vel vestibulum tortor. Curabitur id nulla nec nunc porta blandit quis gravida eros. Proin dictum sagittis velit porta fringilla. Ut ac libero dui. Donec purus leo, semper condimentum porttitor vitae, feugiat vel elit. Etiam ut erat velit. Proin quis tortor lorem. Pellentesque ut lectus ligula. Donec ullamcorper, tellus at fringilla tristique, quam elit luctus felis, ut venenatis quam erat quis lacus. In consequat imperdiet magna posuere vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin sodales, nisl eu accumsan molestie, mauris sem luctus sem, at volutpat turpis lorem non massa. Nulla erat turpis, auctor id congue ac, placerat et velit. Donec id ipsum erat, non pellentesque turpis. Nulla facilisi.</p>
	<p>Nulla facilisi. Nam tempus adipiscing nisi, non venenatis erat dignissim id. Praesent consequat, eros ac convallis sodales, nunc lacus faucibus eros, ut laoreet turpis ante et augue. Cras nec turpis sit amet diam eleifend vestibulum. Vivamus vel dolor ac tellus malesuada congue. Mauris aliquam consequat dui, id ornare leo egestas ut. Etiam fringilla vestibulum porttitor. Aenean ut aliquam ligula, ut vehicula dui. Nam tempor purus velit, nec eleifend nibh ultrices quis. Phasellus urna elit, volutpat non nulla quis, aliquet dignissim odio. Curabitur ac fringilla quam, vitae laoreet lorem. Vivamus sapien tortor, tincidunt at libero non, placerat sodales erat. Proin ultricies pellentesque fringilla. Maecenas nec metus felis.</p>

	<h3>Page 4</h3>
	<p>This is the content of <strong>page 4</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
	<p>Fusce et nunc sed nibh eleifend posuere. Integer sodales, elit sit amet porta varius, augue elit consectetur tortor, vitae rhoncus diam ipsum sed quam. Nullam turpis magna, convallis ultrices auctor ut, gravida eu leo. Pellentesque ut risus nibh, in ultrices ante. Suspendisse potenti. Vestibulum dolor sapien, dapibus non fringilla at, fringilla sed ipsum. In adipiscing mi nec risus hendrerit sollicitudin. Nullam eget felis tellus. Quisque dapibus molestie scelerisque. Curabitur sit amet tortor erat, et pretium nisl. Phasellus posuere, nibh vel feugiat sagittis, ligula lorem porttitor sapien, quis aliquam nisl nulla vel nunc.</p>
	<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ullamcorper eros, non ullamcorper diam. Aliquam euismod erat eget purus volutpat sagittis. Aliquam pharetra, magna quis lacinia lacinia, lorem sapien placerat erat, hendrerit rhoncus felis ligula ultrices neque. Duis eleifend mi id tempor rutrum. Mauris vitae metus sodales, luctus odio eu, semper sapien. Morbi vitae tellus urna. Mauris suscipit dignissim nisl, eu laoreet ligula laoreet vel. In semper nibh neque, dapibus condimentum lorem convallis nec. Suspendisse ut tincidunt orci. Maecenas vel lacinia mauris. Phasellus tempor, urna vitae ultricies eleifend, mi diam condimentum libero, eget fermentum dui nisi eget leo. Morbi at scelerisque massa, quis sollicitudin est. Donec viverra congue augue, semper malesuada tellus tempor sit amet. Morbi placerat sollicitudin dignissim.</p>

	<hr>
	<h3>Page 5</h3>
	<p>This is the content of <strong>page 5</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
	<p>Aliquam sed quam id dolor facilisis auctor vitae eu felis. Morbi sollicitudin lacinia orci nec aliquet. Morbi ornare sapien sit amet convallis hendrerit. Vestibulum egestas et quam id ultricies. Donec vitae mi scelerisque, ullamcorper nisi in, euismod odio. Cras sit amet nulla mi. Mauris ut molestie ipsum. Phasellus vulputate lorem in risus luctus ullamcorper. Phasellus vehicula velit id gravida faucibus. Curabitur aliquam lacinia erat, in tempus elit vulputate et. Nulla et faucibus magna. Fusce quis quam turpis. Aliquam tempor placerat ligula, a vestibulum augue tempus volutpat. Pellentesque malesuada posuere velit ut tincidunt. Etiam id urna auctor, interdum tellus vel, placerat sem. Nullam dapibus vel nibh in pretium.</p>
	<p>Aliquam a nulla pellentesque, elementum nulla laoreet, faucibus nisl. Cras egestas risus eu nibh varius auctor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur venenatis hendrerit nisi, sed convallis diam molestie nec. Aliquam eros libero, gravida nec consectetur sit amet, congue consectetur lorem. Etiam interdum ut metus fermentum pretium. Proin libero urna, pretium id ipsum vitae, laoreet lobortis tellus. Sed ut adipiscing eros. Vestibulum hendrerit lorem ac erat tempor mattis. Pellentesque vel porta sem.</p>

	<hr>
	<h3>Page 6 - Final Page</h3>
	<p>This is the content of <strong>page 6</strong> in the jScroll example. This is the final page of content, and nothing more will be loaded when you scroll to the bottom of this page.</p>
	<p>Aliquam sed quam id dolor facilisis auctor vitae eu felis. Morbi sollicitudin lacinia orci nec aliquet. Morbi ornare sapien sit amet convallis hendrerit. Vestibulum egestas et quam id ultricies. Donec vitae mi scelerisque, ullamcorper nisi in, euismod odio. Cras sit amet nulla mi. Mauris ut molestie ipsum. Phasellus vulputate lorem in risus luctus ullamcorper. Phasellus vehicula velit id gravida faucibus. Curabitur aliquam lacinia erat, in tempus elit vulputate et. Nulla et faucibus magna. Fusce quis quam turpis. Aliquam tempor placerat ligula, a vestibulum augue tempus volutpat. Pellentesque malesuada posuere velit ut tincidunt. Etiam id urna auctor, interdum tellus vel, placerat sem. Nullam dapibus vel nibh in pretium.</p>
	<p>Aliquam a nulla pellentesque, elementum nulla laoreet, faucibus nisl. Cras egestas risus eu nibh varius auctor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur venenatis hendrerit nisi, sed convallis diam molestie nec. Aliquam eros libero, gravida nec consectetur sit amet, congue consectetur lorem. Etiam interdum ut metus fermentum pretium. Proin libero urna, pretium id ipsum vitae, laoreet lobortis tellus. Sed ut adipiscing eros. Vestibulum hendrerit lorem ac erat tempor mattis. Pellentesque vel porta sem.</p>
</div>


<div class="jtest2" style="height: 100%; overflow-y: scroll; background: blue;">
   <div class="jscroll-inner">
      <div class="jscroll-added">
         <div class="contents">
            <hr>
            <h3>Page 1</h3>
            <p>
               Page 1 of jScroll Example - jQuery Infinite Scrolling Plugin
               This is the content of page 1 in the jScroll example. Scroll to the bottom of this box to load the next set of content.
               This is example text for the jScroll demonstration. jScroll is a jQuery plugin for infinite scrolling, endless scrolling, lazy loading, auto-paging, or whatever you may call it.
               With jScroll, you can initialize the scroller on an element with a fixed height and overflow setting of "auto" or "scroll," or it can be set on a standard block-level element within the document and the scrolling will be initialized based on the brower window's scroll position.
               jScroll is open-source and can be downloaded from my GitHub repository at github.com/pklauzinski/jscroll.
            </p>
         </div>
      </div>
      <div class="jscroll-added">
         <div class="contents">
            <hr>
            <h3>Page 2</h3>
            <p>This is the content of <strong>page 2</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
            <p>Fusce et nunc sed nibh eleifend posuere. Integer sodales, elit sit amet porta varius, augue elit consectetur tortor, vitae rhoncus diam ipsum sed quam. Nullam turpis magna, convallis ultrices auctor ut, gravida eu leo. Pellentesque ut risus nibh, in ultrices ante. Suspendisse potenti. Vestibulum dolor sapien, dapibus non fringilla at, fringilla sed ipsum. In adipiscing mi nec risus hendrerit sollicitudin. Nullam eget felis tellus. Quisque dapibus molestie scelerisque. Curabitur sit amet tortor erat, et pretium nisl. Phasellus posuere, nibh vel feugiat sagittis, ligula lorem porttitor sapien, quis aliquam nisl nulla vel nunc.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ullamcorper eros, non ullamcorper diam. Aliquam euismod erat eget purus volutpat sagittis. Aliquam pharetra, magna quis lacinia lacinia, lorem sapien placerat erat, hendrerit rhoncus felis ligula ultrices neque. Duis eleifend mi id tempor rutrum. Mauris vitae metus sodales, luctus odio eu, semper sapien. Morbi vitae tellus urna. Mauris suscipit dignissim nisl, eu laoreet ligula laoreet vel. In semper nibh neque, dapibus condimentum lorem convallis nec. Suspendisse ut tincidunt orci. Maecenas vel lacinia mauris. Phasellus tempor, urna vitae ultricies eleifend, mi diam condimentum libero, eget fermentum dui nisi eget leo. Morbi at scelerisque massa, quis sollicitudin est. Donec viverra congue augue, semper malesuada tellus tempor sit amet. Morbi placerat sollicitudin dignissim.</p>
         </div>
      </div>
      <div class="jscroll-added">
         <div class="contents">
            <hr>
            <h3>Page 3</h3>
            <p>This is the content of <strong>page 3</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
            <p>Duis vel vestibulum tortor. Curabitur id nulla nec nunc porta blandit quis gravida eros. Proin dictum sagittis velit porta fringilla. Ut ac libero dui. Donec purus leo, semper condimentum porttitor vitae, feugiat vel elit. Etiam ut erat velit. Proin quis tortor lorem. Pellentesque ut lectus ligula. Donec ullamcorper, tellus at fringilla tristique, quam elit luctus felis, ut venenatis quam erat quis lacus. In consequat imperdiet magna posuere vehicula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Proin sodales, nisl eu accumsan molestie, mauris sem luctus sem, at volutpat turpis lorem non massa. Nulla erat turpis, auctor id congue ac, placerat et velit. Donec id ipsum erat, non pellentesque turpis. Nulla facilisi.</p>
            <p>Nulla facilisi. Nam tempus adipiscing nisi, non venenatis erat dignissim id. Praesent consequat, eros ac convallis sodales, nunc lacus faucibus eros, ut laoreet turpis ante et augue. Cras nec turpis sit amet diam eleifend vestibulum. Vivamus vel dolor ac tellus malesuada congue. Mauris aliquam consequat dui, id ornare leo egestas ut. Etiam fringilla vestibulum porttitor. Aenean ut aliquam ligula, ut vehicula dui. Nam tempor purus velit, nec eleifend nibh ultrices quis. Phasellus urna elit, volutpat non nulla quis, aliquet dignissim odio. Curabitur ac fringilla quam, vitae laoreet lorem. Vivamus sapien tortor, tincidunt at libero non, placerat sodales erat. Proin ultricies pellentesque fringilla. Maecenas nec metus felis.</p>
         </div>
      </div>
      <div class="jscroll-added">
         <div class="contents">
            <hr>
            <h3>Page 4</h3>
            <p>This is the content of <strong>page 4</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
            <p>Fusce et nunc sed nibh eleifend posuere. Integer sodales, elit sit amet porta varius, augue elit consectetur tortor, vitae rhoncus diam ipsum sed quam. Nullam turpis magna, convallis ultrices auctor ut, gravida eu leo. Pellentesque ut risus nibh, in ultrices ante. Suspendisse potenti. Vestibulum dolor sapien, dapibus non fringilla at, fringilla sed ipsum. In adipiscing mi nec risus hendrerit sollicitudin. Nullam eget felis tellus. Quisque dapibus molestie scelerisque. Curabitur sit amet tortor erat, et pretium nisl. Phasellus posuere, nibh vel feugiat sagittis, ligula lorem porttitor sapien, quis aliquam nisl nulla vel nunc.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vel ullamcorper eros, non ullamcorper diam. Aliquam euismod erat eget purus volutpat sagittis. Aliquam pharetra, magna quis lacinia lacinia, lorem sapien placerat erat, hendrerit rhoncus felis ligula ultrices neque. Duis eleifend mi id tempor rutrum. Mauris vitae metus sodales, luctus odio eu, semper sapien. Morbi vitae tellus urna. Mauris suscipit dignissim nisl, eu laoreet ligula laoreet vel. In semper nibh neque, dapibus condimentum lorem convallis nec. Suspendisse ut tincidunt orci. Maecenas vel lacinia mauris. Phasellus tempor, urna vitae ultricies eleifend, mi diam condimentum libero, eget fermentum dui nisi eget leo. Morbi at scelerisque massa, quis sollicitudin est. Donec viverra congue augue, semper malesuada tellus tempor sit amet. Morbi placerat sollicitudin dignissim.</p>
         </div>
      </div>
      <div class="jscroll-added">
         <div class="contents">
            <hr>
            <h3>Page 5</h3>
            <p>This is the content of <strong>page 5</strong> in the jScroll example. Scroll to the bottom of this box to load the next set of content.</p>
            <p>Aliquam sed quam id dolor facilisis auctor vitae eu felis. Morbi sollicitudin lacinia orci nec aliquet. Morbi ornare sapien sit amet convallis hendrerit. Vestibulum egestas et quam id ultricies. Donec vitae mi scelerisque, ullamcorper nisi in, euismod odio. Cras sit amet nulla mi. Mauris ut molestie ipsum. Phasellus vulputate lorem in risus luctus ullamcorper. Phasellus vehicula velit id gravida faucibus. Curabitur aliquam lacinia erat, in tempus elit vulputate et. Nulla et faucibus magna. Fusce quis quam turpis. Aliquam tempor placerat ligula, a vestibulum augue tempus volutpat. Pellentesque malesuada posuere velit ut tincidunt. Etiam id urna auctor, interdum tellus vel, placerat sem. Nullam dapibus vel nibh in pretium.</p>
            <p>Aliquam a nulla pellentesque, elementum nulla laoreet, faucibus nisl. Cras egestas risus eu nibh varius auctor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur venenatis hendrerit nisi, sed convallis diam molestie nec. Aliquam eros libero, gravida nec consectetur sit amet, congue consectetur lorem. Etiam interdum ut metus fermentum pretium. Proin libero urna, pretium id ipsum vitae, laoreet lobortis tellus. Sed ut adipiscing eros. Vestibulum hendrerit lorem ac erat tempor mattis. Pellentesque vel porta sem.</p>
         </div>
      </div>
      <div class="jscroll-added">
         <div class="contents">
            <hr>
            <h3>Page 6 - Final Page</h3>
            <p>This is the content of <strong>page 6</strong> in the jScroll example. This is the final page of content, and nothing more will be loaded when you scroll to the bottom of this page.</p>
            <p>Aliquam sed quam id dolor facilisis auctor vitae eu felis. Morbi sollicitudin lacinia orci nec aliquet. Morbi ornare sapien sit amet convallis hendrerit. Vestibulum egestas et quam id ultricies. Donec vitae mi scelerisque, ullamcorper nisi in, euismod odio. Cras sit amet nulla mi. Mauris ut molestie ipsum. Phasellus vulputate lorem in risus luctus ullamcorper. Phasellus vehicula velit id gravida faucibus. Curabitur aliquam lacinia erat, in tempus elit vulputate et. Nulla et faucibus magna. Fusce quis quam turpis. Aliquam tempor placerat ligula, a vestibulum augue tempus volutpat. Pellentesque malesuada posuere velit ut tincidunt. Etiam id urna auctor, interdum tellus vel, placerat sem. Nullam dapibus vel nibh in pretium.</p>
            <p>Aliquam a nulla pellentesque, elementum nulla laoreet, faucibus nisl. Cras egestas risus eu nibh varius auctor. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Curabitur venenatis hendrerit nisi, sed convallis diam molestie nec. Aliquam eros libero, gravida nec consectetur sit amet, congue consectetur lorem. Etiam interdum ut metus fermentum pretium. Proin libero urna, pretium id ipsum vitae, laoreet lobortis tellus. Sed ut adipiscing eros. Vestibulum hendrerit lorem ac erat tempor mattis. Pellentesque vel porta sem.</p>
         </div>
      </div>
   </div>
</div>
</body>
</html>
