<?php  

ini_set( 'display_errors', 1 );  

error_reporting( E_ALL );  

$to = "alantypoon@gmail.com";

mail(
	$to,
	'PHP Test E-mail',
	'This is a test e-mail ' . date('r'),
	'From: noreply@hku.hk\r\n'
);

  
echo "Test email sent";  
?>
