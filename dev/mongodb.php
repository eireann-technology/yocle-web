<?php

// INITIAL SETUP
$manager = new MongoDB\Driver\Manager(MONGODB_URL);
$query = new MongoDB\Driver\Query([], []);

// TRANVERSE ALL DATABASES
$listdatabases = new MongoDB\Driver\Command(["listDatabases" => 1]);
$res = $manager->executeCommand("admin", $listdatabases);
$databases = current($res->toArray());
foreach ($databases->databases as $el) {
	$database = $el->name;
	if ($database == 'local'){
		continue;
	}
  echo "<h1 style=\"color:red\">Database: $database</h1>";
	
	// TRANVERSE ALL DATABASES
	$listcollections = new MongoDB\Driver\Command(["listCollections" => 1]);
	$res = $manager->executeCommand($database, $listcollections);
	$collections = $res->toArray();
	foreach ($collections as $el2){
		$collection = $el2->name;
		if ($collection == 'system.indexes'){
			continue;
		}
		echo "<h2 style=\"color:blue\">Collection: $collection</h2>";
		// TRANVERSE ALL DOCUMENTS
		$index = 1;
		$res = $manager->executeQuery("$database.$collection", $query);
		$documents = $res->toArray();
		foreach ($documents as $document){
			echo "<h3>Document $index</h3>";
			foreach ($document as $key => $value){
				if ($key == '_id'){
					continue;
				}
				echo "<b>$key:</b> $value<br/>";
			}
			echo "<br/>";
			$index++;
		}
	}	
}
?>