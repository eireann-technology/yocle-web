<?php 

//include "common.php";

function get_gauge($size, $stars){
	//  create a new canvas object and a white image 
	$file = getcwd() . "/images_profile/gauge_". $stars . ".png";
	
	$backcolor = '#f8f8f8';
	$include_text = 0;
	
	$half = $size / 2;
	$onethird = $size / 3;
	$twothird = 2 * $onethird;
	$canvas = new Imagick(); 
	$canvas->newImage($size, $onethird + 10, $backcolor); 

	// draw upper circle
	$angle = 200 + 140 * ($stars / 5);
	//echo $angle; exit();

	if ($include_text){
		image_pie($canvas, $half, $half, $onethird, 200, $angle, '#F9C802'); 
		image_pie($canvas, $half, $half, $onethird, $angle, 340, '#e0e0e0');
	} else {
		image_pie($canvas, $half, $onethird, $onethird, 200, $angle, '#F9C802'); 
		image_pie($canvas, $half, $onethird, $onethird, $angle, 340, '#e0e0e0');
	}

	// draw lower circle
	$draw = new ImagickDraw(); 
	$draw->setFillColor($backcolor);
	$startY = 
	$endY = $include_text ? $half : $onethird;
	$startX = 
	$endX = $half;
	$thickness = $size / 5;
	$draw->arc($startX + $thickness, $startY + $thickness, $endX - $thickness, $endY - $thickness, 180, 360);

	// draw pointer
	$draw->setStrokeColor('black');
	$radius = $onethird;
	$midX = $half;
	$midY = $include_text ? $half : $onethird;
	$steps = 8;
	for ($i = 1; $i < $steps; $i++){
		$radius -= 8; //$radius / $steps;
		$shortest = 8;
		if ($radius < $shortest){
			$radius = $shortest;
		}
		$draw->setStrokeWidth($i);
		$draw->setStrokeLineCap(\Imagick::LINECAP_ROUND);
		$draw->setStrokeLineJoin(\Imagick::LINEJOIN_ROUND);
		$ptX = $midX + $radius * cos(deg2rad($angle));
		$ptY = $midY + $radius * sin(deg2rad($angle));
		//echo "$midX, $midY, $ptX, $ptY<br>";
		$draw->line($midX, $midY, $ptX, $ptY);
	}
	
	if ($include_text){
		// upper text
		$ratio = $size / 400;
		$draw->setFont('arial');
		$draw->setFontSize( 30 );
		$draw->setStrokeWidth(2);
		$draw->setStrokeLineCap(\Imagick::LINECAP_BUTT);
		$draw->setStrokeLineJoin(\Imagick::LINEJOIN_MITER);
		$draw->annotation(135 * $ratio, 45, 'GS Score');

		// lower text
		$stars_float = number_format((float)$stars, 2, '.', '');
		$draw->annotation(167 * $ratio, 250, $stars_float);
	}

	// draw finally
	$canvas->drawImage($draw); 
	
	//  output the image 
	$canvas->setImageFormat('png'); 
	$data = $canvas->getImageBlob();
	file_put_contents($file, $data);	
	return $file;
}

// FUNCTIONS 

function image_pie( &$canvas, $ox, $oy, $radius, $sd, $ed, $color = 'black' ) { 

	//  draw pie segment 
	//  $ox, $oy specify the circle origin 
	//  $sd, and $ed specify start and end angles in degrees 
	//  degrees start from 0 = East, and go clockwise 

	//  position 1 - convert degrees to radians and get first point on perimeter of circle 
	$x1     = $radius * cos(deg2rad($sd)); 
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

if (!function_exists('wlog')){
	$file = get_gauge(180, 3);
	$im = new Imagick($file);
	ob_clean();	// remove unwanted buffer before
	header('Content-Type: image/png');
	echo $im->getImageBlob();
}

?>
