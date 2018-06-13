<?php
// http://pchart.sourceforge.net/download.php
// http://pchart.sourceforge.net/documentation.php?topic=exemple8

// Standard inclusions
include("./pChart_1.27/pData.class");
include("./pChart_1.27/pChart.class");

function get_spider_chart($user){

	$file = getcwd()."/images_profile/spider_" . $user->user_id . ".png";
	$size = 532;
	$margin = 120;

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
	//print_json($labels); print_json($values);

	if (sizeof($labels) >= 3){
		// Dataset definition
		$DataSet = new pData;
		$DataSet->AddPoint($labels, "Labels");
		$DataSet->AddPoint($values, "Values");
		$DataSet->AddSerie("Values");
		$DataSet->SetAbsciseLabelSerie("Labels");
		$DataSet->SetSerieName("Generic Skills", "Values");

		// Initialise the graph
		$pchart = new pChart($size, $size);
		//$pchart->setFontProperties("Fonts/tahoma.ttf", 12);
		$pchart->setFontProperties("fonts/DroidSansFallback.ttf", 12);
		$pchart->setGraphArea($margin, $margin, $size-$margin, $size-$margin);

		// Draw the radar graph
		$pchart->drawRadarAxis($DataSet->GetData(),$DataSet->GetDataDescription(),TRUE,20,120,120,120,230,230,230);
		$pchart->drawFilledRadar($DataSet->GetData(),$DataSet->GetDataDescription(),50,20);

		// Finish the graph
		$pchart->Render($file);
	} else {
		$file = '';
	}
	return $file;
}

/////////////////////////////////////////
// TESTING
/////////////////////////////////////////

if (!function_exists('wlog')){

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
		],
		'values' => [
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
			2,
			1,
			2,
			3,
			4,
			5,
			4,
			3,
		]
	];
	$user = json_decode(json_encode($user), false);
	$file = get_spider_chart($user);
	$im = new Imagick($file);
	ob_clean();	// remove unwanted buffer before
	header('Content-Type: image/png');
	echo $im->getImageBlob();
}

?>
