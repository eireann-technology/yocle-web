<?php

$dbdebug = 0;
$dberr = "";

//////////////////////////////////////////////////////////////////////////////////////////////////////

function checkDatabase($manager, $database){
	global $dbdebug, $dberr;
	$dberr = 0;
	
	$listdatabases = new MongoDB\Driver\Command(["listDatabases" => 1]);
	$result = $manager->executeCommand("admin", $listdatabases);
	//print_r($result);
	$databases = current($result->toArray())->databases;
	//print_r($databases[1]);
	$found = 0;
	foreach ($databases as $el){
		if ($el->name == $database){
			$found = 1;
			break;
		}
	}
	if (!$found){	
		$dberr = "Not such database: $database";
	} else if ($dbdebug){
		echo "<br/>database found<br/>";
	}
	return $dberr;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function checkCollection($manager, $database, $collection){
	global $dbdebug, $dberr;
	$dberr = 0;
	
	$listcollections = new MongoDB\Driver\Command(["listCollections" => 1]);
	$result = $manager->executeCommand($database, $listcollections);
	$collections = $result->toArray();
	//print_r($collections);
	$found = 0;
	foreach ($collections as $el){
		if ($el->name == $collection){
			$found = 1;
			break;
		}
	}
	if (!$found){	
		$dberr = "Not such collection: $collection";
	} else if ($dbdebug){
		echo "<br/>collection found<br/>";
	}
	return $dberr;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseRead($database, $collection, $filters, $options = []){
	global $dbdebug, $dberr;
	$dberr = 0;
	
	$documents = 0;
	$manager = new MongoDB\Driver\Manager("mongodb://mongodb:27017");
	if (!checkDatabase($manager, $database) && !checkCollection($manager, $database, $collection)){
		//echo "databaseRead: $database, $collection";
		//print_r($filters); print_r($options); "<br/>";
		$query = new MongoDB\Driver\Query($filters, $options);	// filter, options
		//$query = new MongoDB\Driver\Query($filters, []);	// filter, options
		try {	
			//echo "<br/>executeQuery1<br/>";
			$result = $manager->executeQuery("$database.$collection", $query);
			//echo "<br/>executeQuery2<br/>";
			$documents = $result->toArray();
			//echo "<br/>executeQuery3<br/>";
		} catch (MongoDB\Driver\Exception\Exception $e) {
			//$filename = basename(__FILE__);
			echo "Exception:" . $e->getMessage() . "In file:" . $e->getFile() . "On line:" . $e->getLine() . "<br/>\r\n<br/>\r\n";
		}		
	}
	return $documents;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseWrite($database, $collection, $bulk){
	global $dbdebug, $dberr;
	$dberr = 0;
	
	$manager = new MongoDB\Driver\Manager("mongodb://mongodb:27017");
	if (!checkDatabase($manager, $database) && !checkCollection($manager, $database, $collection))
	{
		$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
		try {	
			//echo "<br/>write1: $database.$collection<br/>";
			$result = $manager->executeBulkWrite("$database.$collection", $bulk, $writeConcern);
			//echo "<br/>write2<br/>";
			
		} catch (MongoDB\Driver\Exception\BulkWriteException $e){
			$result = $e->getWriteResult();
			// Check if the write concern could not be fulfilled
			if ($writeConcernError = $result->getWriteConcernError()){
				printf("%s (%d): %s\n",
					$writeConcernError->getMessage(),
					$writeConcernError->getCode(),
					var_export($writeConcernError->getInfo(), true)
				);
			}
			// Check if any write operations did not complete at all
			foreach ($result->getWriteErrors() as $writeError){
				printf("Operation#%d: %s (%d)\n",
					$writeError->getIndex(),
					$writeError->getMessage(),
					$writeError->getCode()
				);
			}
		} catch (MongoDB\Driver\Exception\Exception $e){
			printf("Other error: %s\n", $e->getMessage());
		}	
	}
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseInsert($database, $collection, $document){
	global $dbdebug, $dberr;
	$bulk = new MongoDB\Driver\BulkWrite;
	$bulk->insert($document);
	$result = databaseWrite($database, $collection, $bulk);
	return $result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////
// if sets = ['$set' => $sets]; set operations
// otherwise a replacement document
//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseUpdate($database, $collection, $criteria, $update){//, $createIfNone){	
	//echo "$database.$collection";
	global $dbdebug, $dberr;
	$bulk = new MongoDB\Driver\BulkWrite;
	$opts = ['multi' => TRUE, 'upsert' => FALSE];
	$bulk->update($criteria, $update, $opts);
	$result = databaseWrite($database, $collection, $bulk);
	return $result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseInsertOrUpdate($database, $collection, $filters, $sets){
	global $dbdebug, $dberr;
	$result = 0;
	// read if the filters exists
	$documents = databaseRead($database, $collection, $filters);
	if ($dberr != ""){
		echo "dberr=$dberr";
	} else if (sizeof($documents) == 0){
		//echo 'insert';
		$sets2 = array_merge($filters, $sets);
		$result = databaseInsert($database, $collection, $sets2);
	} else {
		//echo 'update';
		$result = databaseUpdate($database, $collection, $filters, ['$set' => $sets]);
	}
	return $result;
}

//////////////////////////////////////////////////////////////////////////////////////

// https://www.mkyong.com/mongodb/spring-data-mongodb-like-query-example/
function datadbaseFind($manager, $database, $collection, $field, $searchkey){
	global $dbdebug, $dberr;
	$dberr = 0;
	$documents = 0;
	switch ($collection){
	
		case 'users':
			$filters = array($field => new MongoDB\BSON\Regex("$searchkey", 'i'), 'confirmed_email' => 1);
			$query = new MongoDB\Driver\Query($filters, []);	// filter, options
			try {	
				// filter by searchkey here
				$result = $manager->executeQuery("$database.$collection", $query);
				$documents = $result->toArray();
			} catch (MongoDB\Driver\Exception\Exception $e) {
				echo "The ".basename(__FILE__)." script has experienced an error: ".$e->getMessage()." ".$e->getFile()." ".$e->getLine(); 
			}		
			break;
			
		case 'skills':
			$filters = array('lang' => 'eng');
			$query = new MongoDB\Driver\Query($filters, []);	// filter, options
			try {	
				$result = $manager->executeQuery("$database.$collection", $query);
				$documents = $result->toArray();
				//echo(sizeof($documents) > 0);
				if ($documents && sizeof($documents) > 0){
					if ($searchkey == "^*"){
						$documents = $documents[0]->names;
					} else {
						$documents = preg_grep("/$searchkey/i", $documents[0]->names);
					}
				}
				//exit();
			} catch (MongoDB\Driver\Exception\Exception $e) {
				echo "The ".basename(__FILE__)." script has experienced an error: ".$e->getMessage()." ".$e->getFile()." ".$e->getLine(); 
			}		
			break;
	}
	return $documents;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseDelete($database, $collection, $filters){
	global $dbdebug, $dberr;
	$bulk = new MongoDB\Driver\BulkWrite;
	$bulk->delete($filters, ['limit' => 1]);
	$manager = new MongoDB\Driver\Manager("mongodb://mongodb:27017");
	$writeConcern = new MongoDB\Driver\WriteConcern(MongoDB\Driver\WriteConcern::MAJORITY, 1000);
	$result = $manager->executeBulkWrite("$database.$collection", $bulk, $writeConcern);	
	return $result;
}

//////////////////////////////////////////////////////////////////////////////////////
// http://stackoverflow.com/questions/9818046/how-to-use-findandmodify-in-php-and-mongodb
// http://php.net/manual/en/class.mongodb-driver-command.php
// https://docs.mongodb.com/v3.2/reference/method/db.collection.findAndModify/
// https://github.com/mongodb/mongo-php-library/blob/master/src/Operation/FindAndModify.php
//
// db.runCommand({findAndModify:"sequences", query:{}, sort: {rating: 1}, update:{$inc:{media_id:1}}})
//////////////////////////////////////////////////////////////////////////////////////
function datadbaseFindAndInc($database, $collection, $field){
	global $dbdebug, $dberr;
	$value = 0;

	$manager = new MongoDB\Driver\Manager("mongodb://mongodb:27017");
	if (!checkDatabase($manager, $database) && !checkCollection($manager, $database, $collection)){
		$cmd = [
			'findAndModify' => $collection,
			'query' => [],
			'sort' => ['rating' => 1],
			'update' => ['$inc' => [$field => 1]]
		];
		$cmd2 = new MongoDB\Driver\Command($cmd);
		$cursor = $manager->executeCommand($database, $cmd2);
    $result = current($cursor->toArray());		
		$value = $result->value->$field;
	}
	return $value;
}

//////////////////////////////////////////////////////////////////////////////////////
function datadbaseAggregate($database, $collection, $field){
	global $dbdebug, $dberr;
	$value = 0;

	$manager = new MongoDB\Driver\Manager("mongodb://mongodb:27017");
	if (!checkDatabase($manager, $database) && !checkCollection($manager, $database, $collection)){
		$cmd = [
			'aggregate' => $collection,
			'pipeline' => [
        ['$group' => ['_id' => '$y', 'sum' => ['$sum' => '$x']]],
			],
			'cursor' => new stdClass,
//			'findAndModify' => $collection,
//			'query' => [],
//			'sort' => ['rating' => 1],
//			'update' => ['$inc' => [$field => 1]]
		];
		$cmd2 = new MongoDB\Driver\Command($cmd);
		$cursor = $manager->executeCommand($database, $cmd2);
    $result = current($cursor->toArray());		
		$value = $result->value->$field;
	}
	return $value;
}



?>