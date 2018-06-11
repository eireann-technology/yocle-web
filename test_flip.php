<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="jquery-3.1.1.js"></script>
    <script src="flip.js"></script>
    <title>jQuery plugin</title>
    <style type="text/css">
      .card {
        width: 600px;
        height: 400px;
        margin: 20px;
      }
      .front, .back, .other-front, .other-back {
        border: 2px gray solid;
        padding: 10px;
      }
      .front, .other-front {
        background-color: #ccc;
      }
      .back, .other-back {
        background-color: red;
      }
    </style>
  </head>
  <body>
    <div id="card-1" class="card">
      <div class="front">
          Front: Cursus aliquet mus et sociis, placerat adipiscing a placerat magnis integer nisi lacus in, turpis porttitor? Lectus nunc dis in porta, montes lacus. Tortor. Pid sit nisi eu nec aenean.
      </div>
      <div class="back">
          <a href="http://google.com">link</a>
          Back: Dolor scelerisque ridiculus! Mus? Augue, montes, montes proin rhoncus vel a parturient dapibus eros? Penatibus nascetur. In turpis nisi elementum nascetur habitasse augue egestas, in ac rhoncus odio porttitor turpis.
          Back: Dolor scelerisque ridiculus! Mus? Augue, montes, montes proin rhoncus vel a parturient dapibus eros? Penatibus nascetur. In turpis nisi elementum nascetur habitasse augue egestas, in ac rhoncus odio porttitor turpis.
      </div>
    </div>

    <div id="card-2" class="card">
      <div class="front">
          Front: Cursus aliquet mus et sociis, placerat adipiscing a placerat magnis integer nisi lacus in, turpis porttitor? Lectus nunc dis in porta, montes lacus. Tortor. Pid sit nisi eu nec aenean.
      </div>
      <div class="back">
          <a href="http://google.com">link</a>
          Back: Dolor scelerisque ridiculus! Mus? Augue, montes, montes proin rhoncus vel a parturient dapibus eros? Penatibus nascetur. In turpis nisi elementum nascetur habitasse augue egestas, in ac rhoncus odio porttitor turpis.
          <button>button</button>
      </div>
    </div>

    <script type="text/javascript">
/*
    $(function(){

      $("#card-1").flip({
        axis: "y", // y or x
        reverse: false, // true and false
        trigger: "hover", // click or hover
        speed: '250',
        front: $('.other-front'),
        back: $('.other-back'),
        autoSize: false
      });
      $("#card-2").flip({
        axis: "x",
        reverse: true,
        trigger: "click"
      });
    });
*/
/*
  $("#card-1").flip({
    axis: 'x',
    trigger: 'hover'
  });

  $("#card-1").click(function(){
    console.info('toggle');
    $("#card-1").flip(true);
  });
*/
/*
  $("#card-1").flip({
    axis: "y", // y or x
    reverse: false, // true and false
    trigger: "click", // click or hover
    //speed: '250',
    //front: $('.other-front'),
    //back: $('.other-back'),
    //autoSize: false
  });

  $("#card-2").flip({
    axis: "x",
    reverse: true,
    trigger: "click"
  });
*/

  $(".card").flip();

    </script>
  </body>
</html>
