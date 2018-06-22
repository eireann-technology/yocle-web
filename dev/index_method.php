<?php

$method_arr = [
	'ref' => 'Reflection',	// Reflective Piece
	'mcq' => 'MCQ',
	'prt' => 'Participation',
	'abs' => 'Report/ Essay', // Dissertation/Essay/Reviews',
	'lcn' => 'Contract',	// Learning contract
	'sur' => 'Survey',
	'pst' => 'Poster',
	'blg' => 'Blog',
	'bl2' => 'Daily Journal',

//	'app' => 'Application',// Report',
//	'blg' => 'Blog',
//	'css' => 'Case Study',
//	'map' => 'Concept Map',
//	'jor' => 'Journal', // Daily or Weekly Logbooks',
//	'por' => 'Porfolio',
//	'prs' => 'Presentation',
//	'wik' => 'Wikis',
];

$sur_arr = [
	['Yes', 'No'],
	['Agree', 'Disagree'],
	['1', '2', '3'],
	['1', '2', '3', '4', '5'],
	['Strongly agree', 'Agree', 'Neutral', 'Disagree', 'Strongly disagree'],
	['Always', 'Often', 'Sometimes', 'Occasionally', 'Rarely', 'Never'],
	[],	// open comments
];


/*
	'Abstract', ///Dissertation/Essay/Reviews',
	'Application',///Report',
	'Blog',
	'Case Study',
	'Concept Map',
	'Journal',///Daily or Weekly Logbooks',
	'Learning contract',
	'MCQ',
	'Participation',
	'Porfolio',
	'Poster',
	'Presentation',
	'Reflective Piece',
	'Survey',
	'Wikis'
*/

//////////////////////////////////////////////////////////////////////////////////
// LOAD ALL METHODS
// - include html (template) and js (view, edit, mark)
//////////////////////////////////////////////////////////////////////////////////
/*
foreach ($method_arr as $method => $name){
	$file = "index_method_$method.php";
	if (file_exists($file)){
		include $file;
	} else {
		echo "$file do not exist";
	}
}
*/
?>
