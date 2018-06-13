 <?php
header('Content-type: application/json');
echo '[
{"file":"/files/images/green.jpg","caption":"This image is 50x50 and uses colors #B9E4FB and #260b50","foreground":"B9E4FB","background":"260b50"},
{"file":"/files/images/img-2.jpg"","caption":"This image is 70x70 and uses colors #6ECC43 and #00374a","foreground":"6ECC43","background":"00374a"}]';
?>