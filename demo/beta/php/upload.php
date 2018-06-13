<?php

function getServer(){
	$protocol = strtolower(substr($_SERVER["SERVER_PROTOCOL"],0,strpos( $_SERVER["SERVER_PROTOCOL"],'/'))).'://';
	$host = getenv('HTTP_HOST');
	$port = getenv('SERVER_PORT');
	if ($port == 80){
		$port = '';	
	} else {
		$port = ':' . 80;
	}
	return $protocol . $host . $port;
}
//echo getServerName(); exit();
	
if(isset($_FILES['upload'])){
	$filen = $_FILES['upload']['tmp_name']; 
	$fileName = $_FILES['upload']['name'];
	$filePath = "./uploaded/" . $fileName;
	$url = getServer() . "/php/" . $filePath;
	move_uploaded_file($filen, $filePath);

	$funcNum = $_GET['CKEditorFuncNum'];
	// Optional: instance name (might be used to load a specific configuration file or anything else).
	$CKEditor = $_GET['CKEditor'] ;
	// Optional: might be used to provide localized messages.
	//$langCode = $_GET['langCode'] ;
	// Usually you will only assign something here if the file could not be uploaded.
	$message = '';
	echo "<script type='text/javascript'>window.parent.CKEDITOR.tools.callFunction($funcNum, '$url', '$message');</script>";
}
?>