<?php
/*
//echo $_SERVER["DOCUMENT_ROOT"];
foreach(PDO::getAvailableDrivers() as $driver)
{
echo $driver.'<br />';
}
*/
$dbName = "C://Program Files (x86)//SMSServer//edison-gw.mdb";
if (!file_exists($dbName)){
    die("Could not find database file.");
}
//$db = new PDO("odbc:DRIVER={Microsoft Access Driver (*.mdb)}; DBQ=$dbName; Uid=; Pwd=;");
//$db = new PDO("odbc:DRIVER={Microsoft Access Driver (*.mdb)}; DSN=alan; DBQ=$dbName; Uid=; Pwd=;");
//$db = new PDO("odbc:DSN=alan");
//$db = new PDO("odbc:DRIVER={Microsoft Access Driver (*.mdb)}; DSN=alan");
//$db = new PDO("odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dbq=$dbName;Uid=");
$db = new PDO("odbc:Driver={Microsoft Access Driver (*.mdb, *.accdb)};Dsn=alan;Uid=");
/*
$sql  = "SELECT price FROM product";
$sql .= " WHERE id = " . $productId;

$result = $db->query($sql);
$row = $result->fetch();

$productPrice = $row["price"];
*/
?>