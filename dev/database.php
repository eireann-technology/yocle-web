<?php

define('MONGODB', 'localhost');
//define('MONGODB_AUTH', []);
//define('MONGODB_AUTH', ['username' => 'yocle_user', 'password' => 'yoloisgreat2017']);
//print_json(MONGODB_AUTH);exit();
//define('MONGODB_URL', "mongodb://yocle_user:yoloisgreat2017@".MONGODB.":27017");
define('MONGODB_URL', "mongodb://".MONGODB.":2700");


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

	$manager = new MongoDB\Driver\Manager(MONGODB_URL);
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
			echo "Exception: $database.$collection " . $e->getMessage() . "In file:" . $e->getFile() . "On line:" . $e->getLine() . "<br/>\r\n<br/>\r\n";
			print_json($filters);
			print_json($options);
		}
	}
	return $documents;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseWrite($database, $collection, $bulk){
	global $dbdebug, $dberr;
	$dberr = 0;

	$manager = new MongoDB\Driver\Manager(MONGODB_URL);
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

function databaseUpdate($database, $collection, $filters, $update){//, $createIfNone){
	//echo "<br><br><b>***databaseUpdate: $database.$collection<br>"; print_r($filters); echo "<br>"; print_r($update); echo "</b><br>";	// single-line debug
	global $dbdebug, $dberr;
	$bulk = new MongoDB\Driver\BulkWrite;
	$opts = ['multi' => TRUE, 'upsert' => FALSE];
	$bulk->update($filters, $update, $opts);
	$result = databaseWrite($database, $collection, $bulk);
	return $result;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////

function databaseInsertOrUpdate($database, $collection, $filters, $sets, $options = []){
	global $dbdebug, $dberr;
	$result = 0;
	// read if the filters exists
	$documents = databaseRead($database, $collection, $filters, $options);
	if ($dberr != ""){
		echo "dberr=$dberr";
	} else if (sizeof($documents) == 0){
		//echo 'insert';
		//print_json($filters); print_json($sets);
		//$sets = array_merge($filters, $sets);	// won't work as they may be objects
///*
		//$sets['img_id'] = 10;
		//$sets = json_decode(json_encode($sets), true);
		foreach ($filters as $index => $element){
			if (isset($index)){
				//echo "index=$index element=$element";
				//print_json($sets[$index]);
				//print_json($element);
				//$sets->$index = $element;	// okay for signup?
				if ($sets instanceof stdClass){
					$sets->$index = $element;	// okay for signup?
				} else {
					$sets[$index] = $element;	// okay for upload_image, is it okay for signup?
				}
			}
		}
//*/
		//print_json($sets);
		//var_dump($sets);
		$result = databaseInsert($database, $collection, $sets);
	} else {
		//echo 'update';
		$result = databaseUpdate($database, $collection, $filters, ['$set' => $sets]);
	}
	return $result;
}

//////////////////////////////////////////////////////////////////////////////////////

// https://www.mkyong.com/mongodb/spring-data-mongodb-like-query-example/
function databaseFind($manager, $database, $collection, $field, $searchkey, $options = []){
	global $dbdebug, $dberr;
	$dberr = 0;
	$documents = 0;
	switch ($collection){

		case 'users':
			$filters = array($field => new MongoDB\BSON\Regex("$searchkey", 'i'), 'confirmed_email' => 1);
			$query = new MongoDB\Driver\Query($filters, $options);	// filter, options
			try {
				// filter by searchkey here
				$result = $manager->executeQuery("$database.$collection", $query);
				$documents = $result->toArray();
			} catch (MongoDB\Driver\Exception\Exception $e) {
				echo "The ".basename(__FILE__)." script has experienced an error: ".$e->getMessage()." ".$e->getFile()." ".$e->getLine();
			}
			break;

		case 'activities':
			$filters = array($field => new MongoDB\BSON\Regex("$searchkey", 'i'));
			$query = new MongoDB\Driver\Query($filters, $options);	// filter, options
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
	$manager = new MongoDB\Driver\Manager(MONGODB_URL);
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
function databaseFindAndInc($database, $collection, $field){
	global $dbdebug, $dberr;
	$value = 0;

	$manager = new MongoDB\Driver\Manager(MONGODB_URL);
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

	$manager = new MongoDB\Driver\Manager(MONGODB_URL);
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

//////////////////////////////////////////////////////////////////////////////////////
//($database, $col_usr, ['user_id' => $user_id], 'profile.activity', ['act_id' => $act_id], $new_uact);

function databaseUpdateArrayElement($database, $collection, $filters, $path,
		$old_element, $new_element)
{
	$update = ['$pull' => [	$path => $old_element ] ];
	$documents = databaseUpdate($database, $collection, $filters, $update);
	$update = ['$push' => [	$path => $new_element ] ];
	$result = databaseUpdate($database, $collection, $filters, $update);
}

/////////////////////////////////////////////////////////////////////////////////////

function checkUserExists($email){
	global $database, $col_usr;
	$user = 0;
	$filters = ['email' => $email];
	$options = ['projection' => ['_id'=> 0,
		'user_id' => 1,
		'email' => 1,
		'username' => 1,
		'pwd' => 1,
		'gender' => 1,
		'birthday' => 1,
		'confirmed_email' => 1,
		'secret_token' => 1,
	]];
	$documents = databaseRead($database, $col_usr, $filters, $options);
	if (sizeof($documents)){
		$user = $documents[0];
	}
	return $user;
}

//////////////////////////////////////////////////////////////////

function addBlogIdToUsersPeers($user_id, $blog_id){
	global $database, $col_usr;
	// ADD TO EACH OF THE USER'S FRIENDS AND NETWORKS
	$criteria = ['user_id' => $user_id];
	$options = ['projection' => ['_id' => 0, 'friends' => 1, 'networks' => 1]];
	$users = databaseRead($database, $col_usr, $criteria, $options);
	if ($users && sizeof($users)){
		$user = $users[0];

		$hash = [$user_id => 1];
		num2hashArr2($user->networks, $hash);
		num2hashArr2($user->friends, $hash);
		$users2 = hash2NumArr_key($hash);
		//print_json($users6);

		// add blog_id to their blog_ids
		foreach ($users2 as $user_id2){
			$filters = ['user_id' => $user_id2];

			// remove from the array
			$update = ['$pull' => ['blog_ids' => $blog_id]];
			$result = databaseUpdate($database, $col_usr, $filters, $update);

			// add to the array
			$update = ['$push' => [
				'blog_ids' => [
					'$each' => [$blog_id],
					'$sort' => 1,
				]
			]];
			$result = databaseUpdate($database, $col_usr, $filters, $update);
		}
	}
}


///////////////////////////////////////////////////////////////////////////////////////////////////////

function newSequence(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$field = getQS('field');
	$new_seq = databaseFindAndInc($database, 'sequences', $field);
	$output['new_seq'] = $new_seq;
}

///////////////////////////////////////////////////////////////////////////////////////////

function getNewSequenceID($id_name, $collection){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$new_id = 0;
	$retry = 1000;
	while ($retry-- > 0){
		// generate a new id
		$new_id = intval(databaseFindAndInc($database, 'sequences', $id_name));
		if (is_nan($new_id) || $new_id == 0){
			// impossible
			$new_id = 0;
		} else {
			// check if this is used already
			$documents = databaseRead($database, $collection, [$id_name => $new_id]);
			if (!$documents || !sizeof($documents)){
				// not used yet
				wlog("generate new $id_name=$new_id on $database $collection");
				break;
			} else {
				wlog("WARNING duplicate $id_name=$new_id from $database $collection");
			}
		}
	}
	return intval($new_id);
}

?>
