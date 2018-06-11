<?php

$sPresent = "Present";
$col_usr = 'users';
$col_act = 'activities';

// common
include "common.php";
include "database.php";
include "generate_profile_helper.php";
include "generate_profile_spider2.php";
include "generate_profile_gauge.php";

// Include the main TCPDF library (search for installation path).
require_once('./tcpdf/tcpdf.php');

// Extend the TCPDF class to create custom Header and Footer
class MYPDF extends TCPDF {

	//Page header
	public function Header() {
		$this->SetY(2);
		$this->SetFont('aealarabiya', '', 18);
	// Set some content to print
	$html =
<<<EOD
<!--
	<table>
		<tr>
			<td width="18">
			</td>
			<td>
				<table width="100%" cellpadding="4" cellspacing="2" bgcolor="green">
					<tr>
						<td width="100">
							<img src="./yocle_logo15_h40.png" height="28">
						</td>
						<td style="color:white; " align="center" valign="center" width="500">
							Your Out of Classroom Experience
						</td>
					</tr>
				</table>
			</td>
		</tr>
	</table>
-->
	<img src="./images_profile/banner2.png"/>
EOD;
		$this->writeHTMLCell(0, 0, '', '', $html, 0, 1, 0, true, '', true);
	}

	// Page footer
	public function Footer() {
		// Position at 15 mm from bottom
		$this->SetY(-15);
		$this->SetFont('helvetica', 'I', 8);
		$this->Cell(0, 10, 'Page '.$this->getAliasNumPage().'/'.$this->getAliasNbPages(), 0, false, 'C', 0, '', 0, false, 'T', 'M');
	}
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////

function read_user($user_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $g_media_url, $col_usr;
	$criteria = ['user_id' => $user_id];
	$options = ['projection' => ['_id' => 0]];
	$users = databaseRead($database, $col_usr, $criteria, $options);
	return $users[0];
}

//////////////////////////////////////////////////////////////////////////////////

$images_profile_path = "." . SLASH . "images_profile" . SLASH;

function get_user_img($img_id){
	global $database, $error, $type, $email, $pwd, $error, $output, $secret, $template_user, $g_media_url, $col_usr;
	global $images_profile_path;

	//./images_profile/
	$images = databaseRead($database, 'images', ['img_id' => $img_id]);
	if (sizeof($images) > 0){
		$root = $images[0]->image->getData();
		$data = $root;
	} else {
		$im = new imagick(realpath("./images/new_user.png").'[0]');
		$data = $im->getImageBlob();
	}

	$im = new imagick();
	$im->readImageBlob($data);
	$im->setImageFormat('png');
	if (function_exists($im->roundCorners)){
		$im->roundCorners(8, 8);
	}
	$data = $im->getImageBlob();

	// write to file
	$file = $images_profile_path . "user_" . $img_id . ".jpg";
	file_put_contents($file, $data);

	return $file;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

function test_spider(){
	$user_id = 2;
	$user = read_user($user_id);
	//print_json($user);
	//print_pdf($user);

	$spider_img = get_spider_chart($user);
	$im = new Imagick($spider_img);
	ob_clean();	// remove unwanted buffer before
	header('Content-Type: image/png');
	echo $im->getImageBlob();
}

//test_spider(); exit();
$user_id = getQs("user_id");
if (!$user_id){
	$user_id = 2;
} else {
	$user_id = intval($user_id);
}
$user = read_user($user_id);
//print_json($user);
print_pdf($user);

?>
