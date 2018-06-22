<?php
$email = isset($_COOKIE['email']) ? $_COOKIE['email'] : '';
$pwd = isset($_COOKIE['pwd']) ? $_COOKIE['pwd'] : '';
$login = isset($_COOKIE['login']) ? $_COOKIE['login'] : '';
echo "email=$email pwd=$pwd login=$login";
?>
