<?php

//$m = new MongoClient(); // connect
//$db = $m->selectDB("example");
//require 'vendor/autoload.php'; // include Composer goodies

var_dump(phpversion("mongodb"));

$manager = new MongoDB\Driver\Manager("mongodb://mongodb:27017");
var_dump($manager);

//$connection = new Mongo();

//This line is to include the dependencies 
//require 'vendor/autoload.php';

$serverName = "localhost";
$port = 12345;
$manager = new MongoDB\Driver\Manager("mongodb://$serverName:$port");
$collection = new MongoDB\Collection($manager, "database.someCollection");

//get all items
$result = $collection->find();

foreach ($result as $entry) {
    //print element _id and time
    echo $entry->_id, ': ', $entry->time, "</br>";
}


echo "IT works!";
?>