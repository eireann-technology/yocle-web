<?php

// connect
$m = new MongoClient("mongodb://mongodb:27017");
$dbases = $m->listDBs();
//print_r($dbases);
foreach ($dbases['databases'] as $dbs){
  $dbName = $dbs['name'];
	if ($dbName == 'local') continue;
	echo "<h1 style=\"color:red\">Database: $dbName</h1>";
	$db = $m->selectDB($dbName);
	$collections = $db->getCollectionNames();
	foreach ($collections as $collectionName){
		echo "<h3>Collection: $collectionName</h3>";
		$collection = $db->__get($collectionName); 
		$cursor = $collection->find();
		$index = 1;
		foreach ($cursor as $document) {
			//print_r($document);	
			echo "<b>Document $index</b><br/>";
			$index++;
			foreach ($document as $key => $value){
				if ($key != '_id'){
					echo "$key=$value<br/>";
				}
			}
			echo "<br/>";
		}	
	}
}

// add a record
//$document = array( "title" => "Calvin and Hobbes", "author" => "Bill Watterson" );
//$collection->insert($document);

// add another record, with a different "shape"
//$document = array( "title" => "XKCD", "online" => true );
//$collection->insert($document);

// find everything in the collection
//$cursor = $collection->find();

// iterate through the results
//foreach ($cursor as $document) {
//  echo $document["a"] . "\n";
//}


?>