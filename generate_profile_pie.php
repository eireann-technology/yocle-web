<?php 
//  create a new canvas object and a white image 
$canvas     = new Imagick(); 
$canvas->newImage(600, 600, 'white'); 

image_pie($canvas, 300, 300, 200, 0, 45, 'red'); 
//image_pie($canvas, 300, 300, 200, 45, 125, 'green'); 
//image_pie($canvas, 300, 300, 200, 125, 225, 'blue'); 
//image_pie($canvas, 300, 300, 200, 225, 300, 'cyan'); 
//image_pie($canvas, 300, 300, 200, 300, 360, 'orange'); 

//  output the image 
$canvas->setImageFormat('png'); 
header("Content-Type: image/png"); 
echo $canvas; 
exit; 

// FUNCTIONS 

function image_pie( &$canvas, $ox, $oy, $radius, $sd, $ed, $color = 'black' ) { 

	//  draw pie segment 
	//  $ox, $oy specify the circle origin 
	//  $sd, and $ed specify start and end angles in degrees 
	//  degrees start from 0 = East, and go clockwise 

	//  position 1 - convert degrees to radians and get first point on perimeter of circle 
	$x1     = $radius * cos($sd / 180 * 3.1416); 
	$y1     = $radius * sin($sd / 180 * 3.1416); 

	//  position 2 - convert degrees to radians and get second point on perimeter of circle 
	$x2     = $radius * cos($ed / 180 * 3.1416); 
	$y2     = $radius * sin($ed / 180 * 3.1416); 

	//  draw segment triangle - specify the 3 points and draw a polygon 
	$points = array(array('x' => $ox, 'y' => $oy), array('x' => $ox + $x1, 'y' => $oy + $y1), array('x' => $ox + $x2, 'y' => $oy + $y2)); 

	image_polygon($canvas, $points, $color); 

	//  draw corrsesponding arc to complete the "pie" segment 
	image_arc($canvas, $ox - $radius, $oy - $radius, $ox + $radius, $oy + $radius, $sd, $ed, $color); 
} 

function image_arc( &$canvas, $sx, $sy, $ex, $ey, $sd, $ed, $color = 'black' ) { 
	//  draw arc on canvas 
	//  $sx, $sy, $ex, $ey specify a bounding rectangle of a circle with the origin in the middle 
	//  $sd, and $ed specify start and end angles in degrees 

	$draw = new ImagickDraw(); 
	$draw->setFillColor($color); 
	$draw->setStrokeColor($color); 
	$draw->setStrokeWidth(1); 
	$draw->arc($sx, $sy, $ex, $ey, $sd, $ed); 
	$canvas->drawImage($draw); 
} 

function image_polygon( &$canvas, $points, $color = 'black' ) { 

    //  draw a polygon on canvas 

    $draw = new ImagickDraw(); 
    $draw->setFillColor($color); 
    $draw->setStrokeColor($color); 
    $draw->setStrokeWidth(1); 
    $draw->polygon($points); 
    $canvas->drawImage($draw); 
} 

?>
