 <?php
/* geneate random success or failure on file upload for demo proposal
 *
 */
if (rand(0,3)>0) {

     //save your file here from _FILES['file1']


        $filename = basename($_FILES['file1']['name']);
        move_uploaded_file($_FILES['file1']['tmp_name'], '/files/images/' . $filename);



    $data = array('status' => 1,
        'file'=>'/files/images/green.jpg',
        'caption'=>'This image is 50x50 and uses colors #B9E4FB and #260b50',
        'foreground'=>'B9E4FB',
        'background'=>'260b50');
}
else {
    $data = array('status' => 0);
}
header('Content-type: text/html');
echo json_encode($data);

?>