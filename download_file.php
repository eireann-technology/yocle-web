<?php

include "common.php";

$file_name = getQs('file_name');
$orig_name = getQs('orig_name');

//echo "***$file"; exit();
$file = '';
if (strpos($file_name, 'profile') === false){
  $file = getMediaFolder() . $file_name;
} else {
  $file = getcwd() . "/images_profile/". $file_name;
}
//echo "***$file_name"; exit();
//if ($orig_name == 'undefined') $orig_name = 'file';
//echo "***$orig_name"; exit();

$download = getQs('download');
if ($download == 1){
  header("Content-Type: application/octet-stream");
  header("Content-Length: " . filesize($file));
  header('Content-Description: File Transfer');
  header('Content-Disposition: attachment; filename=' . urlencode(basename($orig_name)));
  header('Expires: 0');
  header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
  header('Pragma: public');
} else {
  header("Content-type: application/pdf");
  header('Content-Length: ' . filesize($file));
}
ob_clean();
flush();
readfile($file);

?>
