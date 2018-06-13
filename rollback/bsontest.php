<?php
	// this file has to be
	// (1) in the format of UTF-8 without BOM, OR
	// (2) ob_clean is added
	
	include "common.php";
	include "database.php";	

	$database = 'yolofolio';	
	$collection = 'images';
	
	// testing variables
	$file = 'alan.jpg';
	$img_id = 'alantypoon@gmail.com';
	$filters = ['img_id' => $img_id];
	
	// INSERT OR UPDATE IMAGE
	$img_bson = new MongoDB\BSON\Binary(file_get_contents($file), MongoDB\BSON\Binary::TYPE_GENERIC);
	
	databaseInsertOrUpdate($database, $collection, $filters, ['image' => $img_bson]);	

	// READ THE IMAGE
	$documents = databaseRead($database, $collection, $filters);
	if (sizeof($documents) > 0){
		$root = $documents[0]->image->getData();
		$data = $root;
		ob_clean();	// remove unwanted buffer before
		header('Content-Type: image/jpg');	// or png (it doesn't really matter);
		echo $data;
	}
	
?>