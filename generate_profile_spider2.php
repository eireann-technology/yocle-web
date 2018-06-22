<?php
// http://www.pchart.net/download
// http://wiki.pchart.net/doc.draw.radar.html

// pChart library inclusions
// Standard inclusions

include("./pChart_2.1.4/class/pData.class.php");
include("./pChart_2.1.4/class/pDraw.class.php");
include("./pChart_2.1.4/class/pRadar.class.php");
include("./pChart_2.1.4/class/pImage.class.php");

function get_spider_chart($user){

  $file = getcwd()."/images_profile/spider_" . $user->user_id . ".png";
	$width = 532;
	$height = 450;
	$margin = 70;
	$halfmargin = $margin / 2;

	$labels = [];
	$values = [];
	if (isset($user->labels) && isset($user->values)){
		// read from hard-coded data
		$labels = $user->labels;
		$values = $user->values;

	} else {
		// read skills
		foreach ($user->skills as $skill_name => $skill){
			if ($skill->show){
				array_push($labels, $skill_name);
				array_push($values, $skill->skill_stars);
			}
		}
	}

  // Prepare some nice data & axis config
  $MyData = new pData();
	$MyData->addPoints($values, "valuesA");

  // Create the X serie
	$MyData->addPoints($labels, "Labels");
  $MyData->setAbscissa("Labels");

  // Create the pChart object
  $myPicture = new pImage($width, $height - $margin ,$MyData);

  // Draw a solid background
  $Settings = array("R"=>179, "G"=>217, "B"=>91, "Dash"=>1, "DashR"=>199, "DashG"=>237, "DashB"=>111);
  //$myPicture->drawFilledRectangle(0, 0, $width, $width, $Settings);

  // Overlay some gradient areas
  $Settings = array("StartR"=>194, "StartG"=>231, "StartB"=>44, "EndR"=>43, "EndG"=>107, "EndB"=>58, "Alpha"=>50);
  //$myPicture->drawGradientArea(0,0,$width,$width,DIRECTION_VERTICAL,$Settings);

  // Draw the border
  $myPicture->drawRectangle(0, 0, $width - 2, $height - 80, array("R"=>0,"G"=>0,"B"=>0));

  // Write the title
  //$myPicture->setFontProperties(array("FontName"=>"fonts/Arial.ttf","FontSize"=>6));
  //$myPicture->drawText(10,13,"pRadar - Draw radar charts",array("R"=>255,"G"=>255,"B"=>255));

  // Define general drawing parameters
  //$myPicture->setFontProperties(array("FontName"=>"fonts/Arial.ttf","FontSize"=>10,"R"=>80,"G"=>80,"B"=>80));
  //$myPicture->setShadow(TRUE, array("X"=>2,"Y"=>2,"R"=>0,"G"=>0,"B"=>0,"Alpha"=>10));

  // Create the radar object
  $SplitChart = new pRadar();

  // Draw the 1st radar chart
  $myPicture->setGraphArea(1.5 * $margin, 0, $width -1.5 * $margin, $height - 85);
  //$Options = array("Layout"=>RADAR_LAYOUT_STAR, "BackgroundGradient"=>array("StartR"=>255,"StartG"=>255,"StartB"=>255,"StartAlpha"=>100,"EndR"=>207,"EndG"=>227,"EndB"=>125,"EndAlpha"=>50));
	//$Options = array("Layout"=>RADAR_LAYOUT_CIRCLE, "LabelPos"=>RADAR_LABELS_HORIZONTAL, "BackgroundGradient"=>array("StartR"=>255,"StartG"=>255,"StartB"=>255,"StartAlpha"=>50,"EndR"=>32,"EndG"=>109,"EndB"=>174,"EndAlpha"=>30));
	$Options = [
		//"Layout" => RADAR_LAYOUT_CIRCLE,
		"Layout" => RADAR_LAYOUT_STAR,
		"LabelPos" => RADAR_LABELS_HORIZONTAL,	// RADAR_LABELS_ROTATED
		//"LabelPos" => RADAR_LABELS_ROTATED,
		"DrawPoly" => TRUE,
		"WriteValues" => FALSE,
		"ValueFontSize" => 10,
    //"SkipLabels" => 5,
/*
		"BackgroundGradient" => [
			"StartR"=>255,
			"StartG"=>255,
			"StartB"=>255,
			"StartAlpha"=>100,
			"EndR"=>207,
			"EndG"=>227,
			"EndB"=>125,
			"EndAlpha"=>50,
		]
*/
	];
  $SplitChart->drawRadar($myPicture,$MyData,$Options);

  // Render the picture
  $myPicture->Render($file);

  return $file;
}


if (!function_exists('wlog')){
	include "common.php";

	$user = [
		'user_id' => 2,
		'labels' => [
			"Adaptability",
			"Appreciation",
			"Appreciation for others",
			"Collaboration",
			"Confidence",
			"Confident",
			"Contribution",
	/*
			"Creativity",
			"Critical thinking",
			"Initiative",
			"Interpersonal",
			"Interpersonal Skills",
			"Leadership",
			"Manners",
			"Openness",
			"Resilience",
			"Respect",
			"Responsibility",
			"Self-awareness",
			"Self-confidence",
			"Self-management",
			"Teamwork",
			"Time-management",
	*/
		],
		'values' => [
			1,
			2,
			3,
			4,
			5,
			4,
			3,
/*
			2,
			1,
			2,
			3,
			4,
			5,
			4,
			3,
			2,
			1,
			2,
			3,
			4,
			5,
			4,
			3,
*/
		]
	];
	$user = json_decode(json_encode($user), false);

	//print_json('test'); exit();

	$file = get_spider_chart($user);
	$im = new Imagick($file);
	ob_clean();	// remove unwanted buffer before
	header('Content-Type: image/png');
	echo $im->getImageBlob();
}

?>
