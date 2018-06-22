<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8 />
<title>JS Bin</title>

<style>

#slides{
  position:relative;
  overflow:hidden;
  margin:0 auto;
  background:#cf5;
  width:400px;
  height:200px;
  white-space:nowrap;
}
#slides div{
  position:relative;
  display: inline-block;
  margin-right:-4px;
  white-space:normal;
  vertical-align:top;
  background: #eee;
  width: 400px;
  height: 200px;
}
</style>

</head>
<body>

<div id="slides">

  <div>
    Content 1
    <a href="#" id="show-slide2">Show Content 2</a>
  </div>

  <div>
    Content 2
    <a href="#" id="show-slide1">Show Content 1</a>
  </div>

</div>

<script src="jquery-3.1.1.js"></script>
<script>

$(function(){

  var slideW = $('#slides').width();

  $('#show-slide2').click(function(e){
    //e.preventDefault();
    $('#show-slide2').animate({scrollLeft: slideW }, 600);
  });

  //$('#show-slide1').click(function( e ){
    //e.preventDefault();
  //  $('#show-slide1').animate({scrollRight: slideW }, 600);
  //});

});
</script>
</body>
</html>
