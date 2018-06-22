<?php
///////////////////////////////////////////////////////////////////////////////////////////////////////

function uploadImg(){
	global $database, $error, $type, $email, $pwd, $error, $output;

	//$email = $img_id = 'alantypoon@gmail.com'; $file = 'batman.jpg'; // testing only
	$result = 0;
	//if (!isset($_REQUEST['img_id'])){
	//	$error = "img_id is missed";
	//} else
	if (!isset($_FILES['file'])){
		$error = "no file";
	} else if (!isset($_FILES['file']['error'])){
		$error = "no file error";
	} else {

		$user_id = getQs('user_id');
		$act_id = getQs('act_id');
		$img_id = getQs('img_id');

		$user_id = $user_id ? intval($_REQUEST['user_id']) : 0;
		$act_id = $act_id ? intval($_REQUEST['act_id']) : 0;
		$img_id = $img_id ? intval($_REQUEST['img_id']) : 0;

		if ($img_id == ''){
			$img_id = 0;
		} else if ($img_id != '' && is_numeric($img_id)){
			$img_id = intval($img_id);
		}
		// GENERATE NEW IMG ID
		if (!$img_id){
			//$img_id = databaseFindAndInc($database, 'sequences', 'img_id');
			$img_id = getNewSequenceID('img_id', 'images');
		}
		$email = isset($_REQUEST['email']) ? $_REQUEST['email'] : '';

		// GET FILE PATH
		$file = $_FILES['file']['tmp_name'];
		if (!$file){
			$error = "No file";
		}
		//echo '1***' . $error . '***';

		// CHECK FILE ERROR
		if (!$error){
			switch ($_FILES['file']['error']) {
					case UPLOAD_ERR_OK:						break;
					case UPLOAD_ERR_NO_FILE: 			$error = "No file sent";							break;
					case UPLOAD_ERR_INI_SIZE:
					case UPLOAD_ERR_FORM_SIZE:		$error = "Exceeded filesize limit";		break;
					default:											$error = "Unknown error";							break;
			}
		}
		//echo '2***' . $error . '***';

		// CHECK FILE SIZE
		if (!$error){
			//$filesizelimit = 16000000;	// 16MB
			$filesizelimit = 0; // unlimited
			if ($filesizelimit && $_FILES['file']['size'] > $filesizelimit) {
				$error = "Exceeded filesize limit $filesizelimit";
			}
		}
		//echo '3***' . $error . '***';

		// CHECK MIME_TYPE
		$ext = '';
		if (!$error){
			// DO NOT TRUST $_FILES['file']['mime'] VALUE !! Check MIME Type by yourself. extension=php_fileinfo.dll
			$finfo = new finfo(FILEINFO_MIME_TYPE);
			$ext = array_search(
				$finfo->file($file), array(
					'jpg' => 'image/jpeg',
					'png' => 'image/png',
					'gif' => 'image/gif',
				), true
			);
			if ($ext === false){
				$error = "Invalid file format";
			}
		}
		//echo '4***' . $error . '***';

		if (!$error){

			//echo "ha1ha";

			// resize to default size
			$IMG_SIZE = 156;
			$im = new imagick(realpath($file).'[0]');
			$w = $im->getImageWidth();
			$h = $im->getImageHeight();
			//echo "ha2ha: $w x $h user_id=$user_id act_id=$act_id";
			//$r = $w / $h;
			//$output['width'] = $w;
			//$output['height'] = $h;
			//$output['ratio'] = $r;
			//echo $w . 'x' . $h . ' ' . $r;

			if ($user_id)
			{
				/////////////////////////////////
				// USER: CROP TO SQUARE
				// PRESERVE COLORFUL BACKGROUND
				/////////////////////////////////
				if ($w > $h){
					$im->cropImage($h, $h, ($w - $h)/2, 0);
				} else if ($h > $w){
					$im->cropImage($w, $w, 0, ($h - $w)/2);
				}
				if ($w != $IMG_SIZE){
					//echo "resizeImage $IMG_SIZE x $IMG_SIZE";
					$im->resizeImage($IMG_SIZE, $IMG_SIZE, 1, 0);
				}
				$data = $im->getImageBlob();
			}
			else {
				//////////////////////////////////
				// ACTIVITY: ENLARGE WITH CANVAS
				// PRESERVE ALL THE DETAILS
				//////////////////////////////////
				$x = 0; $y = 0;
				$w2 = 0; $h2 = 0;
				if ($w > $h){
					$w2 = $IMG_SIZE;
					$h2 = intval($IMG_SIZE * $h / $w);
					$y = ($w2 - $h2) / 2;
				} else {
					$w2 = intval($IMG_SIZE * $w / $h);
					$h2 = $IMG_SIZE;
					$x = ($h2 - $w2) / 2;
				}
				$im->resizeImage($w2, $h2, 1, 0);
				$canvas = new Imagick();
				$canvas->newImage($IMG_SIZE, $IMG_SIZE, new ImagickPixel('white'));
				$canvas->setImageFormat($ext);
				$canvas->compositeImage($im, imagick::COMPOSITE_OVER, $x, $y);
				$data = $canvas->getImageBlob();
				//echo "ha4ha:" . $w2 . "x" . $h2 . " " . $x . ',' . $y;
			}
			$img_bson = new MongoDB\BSON\Binary($data, MongoDB\BSON\Binary::TYPE_GENERIC);
			$result = databaseInsertOrUpdate($database, 'images', ['img_id' => $img_id], ['image' => $img_bson]);
			if ($user_id){
				$result = databaseInsertOrUpdate($database, 'users', ['user_id' => $user_id], ['img_id' => $img_id]);
			}
			if ($act_id){
				$result = databaseInsertOrUpdate($database, 'activities', ['act_id' => $act_id], ['img_id' => $img_id]);
			}
			$output['user_id'] = $user_id;
			$output['img_id'] = $img_id;
			$output['file'] = $file;
		}
		//echo '5***' . $error . '***';
	}
	return $result;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function downloadImg(){
	global $database, $error, $type, $email, $pwd, $error, $output;
	$nooutput = 0;
	if (!isset($_REQUEST['img_id'])){
		$error = "img_id is missed";
	} else {
		$img_id = intval($_REQUEST['img_id']);
		$documents = databaseRead($database, 'images', ['img_id' => $img_id]);
		if (sizeof($documents) > 0){
			$root = $documents[0]->image->getData();
			$data = $root;
		} else {
			$im = new imagick(realpath("./images/new_user.png").'[0]');
			$data = $im->getImageBlob();
		}
		ob_clean();	// remove unwanted buffer before
		header('Content-Type: image/jpg');	// or png (it doesn't really matter);
		echo $data;
		$nooutput = 1;
		//{
		//	ob_clean();	// remove unwanted buffer before
		//	header('Content-Type: image/jpg');	// or png (it doesn't really matter);
		//	echo $data;
		//	$nooutput = 1;
		//} //else {
		//	$error = "img_id=$img_id not found";
		//}
	}
	return $nooutput;
}

?>
