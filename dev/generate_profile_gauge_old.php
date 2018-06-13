<?php

function draw_gauge($stars){
	
	$size = 100;
	
	$strokeColor = '';
	//$fillColor = '#e0e0e0';
	$backgroundColor = 'white';
	$startX = 0;
	$startY = 0;
	$endX = $size;
	$endY = $size;
	$angle = 180 * ($stars / 5) - 90;
	
	//Create a ImagickDraw object to draw into.
	$draw = new \ImagickDraw();
	$draw->setStrokeWidth(1);
	$draw->setStrokeColor($strokeColor);
	//$draw->setFillColor($fillColor);
	$draw->setFillColor('#e0e0e0');
	//$draw->setFillColor('red');
	$draw->setStrokeWidth(2);
	$draw->arc($startX, $startY, $endX, $endY, 180, 360);
	
	// draw lower cicle
	$draw->setFillColor('white');
	$thickness = 30;
	$draw->arc($startX + $thickness, $startY + $thickness, $endX - $thickness, $endY - $thickness, 180, 360);
	//$draw->setFillColor('red');
	//$draw->arc($startX + $thickness, $startY + $thickness, $endX - $thickness, $endY - $thickness, 180, $angle);
	//$draw->arc($startX, $startY, $endX, $endY, 180, $angle);
	
	// draw the pointer
	$midX = ($startX + $endX) / 2;
	$midY = ($startY + $endY) / 2;
	$draw->setStrokeColor('black');
	//$draw->setFontSize(72);
	
	// draw pointer
	for ($i = 1; $i < 7; $i++){
		$radius -= 5;
		$shortest = 8;
		if ($radius < $shortest){
			$radius = $shortest;
		}
		$draw->setStrokeWidth($i);
		$ptX = $midX + $radius * sin(deg2rad($angle));
		$ptY = $midY - $radius * cos(deg2rad($angle));
		$draw->line($midX, $midY, $ptX, $ptY);
	}
	
	//Create an image object which the draw commands can be rendered into
	$image = new \Imagick();
	$image->newImage($size, $size, $backgroundColor);
	$image->setImageFormat("png");
	$image->drawImage($draw);
	header("Content-Type: image/png");
	echo $image->getImageBlob();
}

//draw_gauge(0);
//draw_gauge(2.5);
draw_gauge(3.5);
//draw_gauge(5);


?>