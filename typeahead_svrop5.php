<?php

include 'database.php';

$database = 'yolofolio';
$collection = 'users';

$arr = array();
$searchkey = isset($_REQUEST['q']) ? $_REQUEST['q'] : '';
//$searchkey = 'hku';
if ($searchkey != ''){
	$manager = new MongoDB\Driver\Manager(MONGODB_URL);
	if (!checkDatabase($manager, $database) && !checkCollection($manager, $database, $collection)){
		
		//echo "databaseRead: $database, $collection";
		$documents = 0;
		if (strpos($searchkey, '@') === false){
			// NORMAL SEARCH
			$documents = databaseFind($manager, $database, $collection, 'username', $searchkey, $arr);
			if (!$documents){
				$documents = databaseFind($manager, $database, $collection, 'email', $searchkey, $arr);
			}
		} else {
			// EMAIL SEARCH
			$documents = databaseFind($manager, $database, $collection, 'email', $searchkey, $arr);
		}
		foreach ($documents as $key => $value){
			array_push(
				$arr,
				array(
					'username'=>$value->username,
					'email'=>$value->email
				)
			);
		}
	}
}
$output = array('results' => 	$arr
	//,'searchkey' => $searchkey
);
echo json_encode($output);

?>			 
