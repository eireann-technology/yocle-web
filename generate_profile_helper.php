<?php

function hexToRgb($hex, $alpha = false) {
   $hex      = str_replace('#', '', $hex);
   $length   = strlen($hex);
   $rgb['r'] = hexdec($length == 6 ? substr($hex, 0, 2) : ($length == 3 ? str_repeat(substr($hex, 0, 1), 2) : 0));
   $rgb['g'] = hexdec($length == 6 ? substr($hex, 2, 2) : ($length == 3 ? str_repeat(substr($hex, 1, 1), 2) : 0));
   $rgb['b'] = hexdec($length == 6 ? substr($hex, 4, 2) : ($length == 3 ? str_repeat(substr($hex, 2, 1), 2) : 0));
   if ( $alpha ) {
      $rgb['a'] = $alpha;
   }
   return $rgb;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getUserStat($user){
	$stat = [
		'coordinated' => 0,
		'assessed' => 0,
		'participated' => 0,
	];
	foreach ($user->profile->activity as $uact){
		//$uact = $user->profile->activity[i];
		if ($uact->uact_coordinator){
			$stat['coordinated']++;
		}
		if ($uact->uact_assessor){
			$stat['assessed']++;
		}
		if ($uact->uact_participant){
			$stat['participated']++;
		}
	}
	return $stat;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getGsScore($skills){
	$total = 0; $count = 0;
	foreach ($skills as $name => $skill){
		if ($skill->show && $skill->skill_stars > 0){
			$total += $skill->skill_stars;
			$count++;
		}
	};
	$score = $count > 0 ? $total / $count : 0;
	return getTruncatedScore($score);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
$month_arr = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function getMyBirthday($birthday){
	global $month_arr;
	$arr = explode('-', $birthday);
	$birthday2 = intval($arr[2]) . ' ' . $month_arr[intval($arr[1]) - 1];
	//echo intval($arr[1]); exit();
	//echo "$birthday $birthday2"; exit();
	return $birthday2;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cmp_act_title($a, $b){
	return strcmp($a->title, $b->title);
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////

function print_pdf($user){

	// create new PDF document
	$pdf = new MYPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

	// set document information
	$pdf->SetCreator(PDF_CREATOR);
	$pdf->SetAuthor('Alan Poon');
	$pdf->SetTitle('YOCLE');
	$pdf->SetSubject('YOCLE');
	$pdf->SetKeywords('Yocle, Generic Skills');

	// set default header data
	$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 001', PDF_HEADER_STRING, array(0,64,255), array(0,64,128));
	$pdf->setFooterData(array(0,64,0), array(0,64,128));

	// set header and footer fonts
	$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
	$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
	$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
	$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
	$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
	$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
	$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
	$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

	if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
		require_once(dirname(__FILE__).'/lang/eng.php');
		$pdf->setLanguageArray($l);
	}
	$pdf->setFontSubsetting(true);
	$pdf->AddPage();

	// user profile image
	$user_img = get_user_img($user->img_id);

	// stat
	$stat = getUserStat($user);
	$coordinated = $stat['coordinated'];
	$assessed = $stat['assessed'];
	$participated = $stat['participated'];

	// spider img
	$spider_img = get_spider_chart($user);
	$gsscore = getGsScore($user->skills);
	$gauge_img = get_gauge(190, $gsscore); //$user->user_gsscore);
	$birthday = getMyBirthday($user->birthday);

	$objectives = $user->profile->objectives;

	// Set some content to print
	$html_personal =
<<<EOD
<table width="100%" cellpadding="2" cellspacing="2" border="0">
	<tr>
		<td width="200">
			<table cellpadding="5" cellspacing="5">
				<tr>
					<td>
						<img src="$user_img" width="156">
					</td>
				</tr>
			</table>
		</td>
		<td>
			<table cellpadding="2" cellspacing="2" height="1" border="0">
				<tr>
					<td width="30" height="10"><img src="./images/profile_username.png" width="18"/></td>
					<td width="370" va>$user->username</td>
				</tr>
				<tr>
					<td><img src="./images/profile_birthday.png" width="18"/></td>
					<td>$birthday</td>
				</tr>
				<tr>
					<td><img src="./images/profile_position.png" width="18"/></td>
					<td>$user->position</td>
				</tr>
				<tr>
					<td><img src="./images/profile_location.png" width="18"/></td>
					<td>$user->location</td>
				</tr>
				<tr>
					<td><img src="./images/profile_mood.png" width="18"/></td>
					<td>$user->mood</td>
				</tr>
				<tr>
					<td><img src="./images/profile_relationship.png" width="18"/></td>
					<td>$user->relationship</td>
				</tr>
			</table>
		</td>
	</tr>
</table>
EOD;

	$html_objectives =
<<<EOD
<table width="600" cellpadding="0" cellspacing="0" border="0">
	<tr>
		<td width="30">
		</td>
		<td width="570">
			$objectives
		</td>
	</tr>
</table>
EOD;

	$html_gsscore =
<<<EOD
<table width="100%" cellpadding="2" cellspacing="2" border="0">
	<tr>
		<td>
			<table>
				<tr>
					<td width="100">
					</td>
					<td width="250">
						<table width="162" cellpadding="4" cellspacing="4" border="0">
							<tr>
								<td colspan="2" align="center" style="font-size:18px">
									<b>Activities</b>
								</td>
							</tr>
							<tr>
								<td width="100" bgcolor="#b0e0e6" align="center">
									Coordinated
								</td>
								<td width="50" bgcolor="#e0e0e0" align="center">
									$coordinated
								</td>
							</tr>
							<tr>
								<td width="100" bgcolor="#ffb6c1" align="center">
									Assessed
								</td>
								<td width="50" bgcolor="#e0e0e0" align="center">
									$assessed
								</td>
							</tr>
							<tr>
								<td width="100" bgcolor="#98fb98" align="center">
									Participated
								</td>
								<td width="50" bgcolor="#e0e0e0" align="center">
									$participated
								</td>
							</tr>
						</table>
					</td>
					<td width="190">
						<table cellpadding="3">
							<tr>
								<td align="center" height="30">
									<b>GS Score</b>
								</td>
							</tr>
							<tr>
								<td align="center">
									<img src="$gauge_img"/>
								</td>
							</tr>
							<tr>
								<td align="center" style="font-size:18px">
									$gsscore
								</td>
							</tr>
						</table>
					</td>
				</tr>
			</table>
		</td>
	</tr>
EOD;

	$html_spider =
<<<EOD
<table width="100%" cellpadding="2" cellspacing="2" border="0">
	<tr>
		<td width="30">
		</td>
		<td width="100%">
			<img src="$spider_img"/>
		</td>
	</tr>
</table>
EOD;

	$html_skills = '<table width="100%" cellpadding="2" cellspacing="2" border="0">';
	foreach ($user->skills as $skill_name => $skill){

		if (!isset($skill->show)){
			$skill->show = 1;
		}

		if ($skill->show == 1){
			$stars = isset($skill->skill_stars) ? $skill->skill_stars : 0;
			$stars = getTruncatedScore($stars);
			$html_skills .=
<<<EOD
	<tr>
		<td width="35">
		</td>
		<td width="400">
			$skill_name
		</td>
		<td width="80">
			<img src="./images_profile/star_red_$stars.png"/>
		</td>
		<td width="50" align="center">
			$stars
		</td>
	</tr>
EOD;
		}
	}
	$html_skills .= '</table>';

	// acts
	$html_acts =
		//'<b>Activities</b><br/>' .
		'<table width="100%" cellpadding="2" cellspacing="2" border="0">'
	;
	$acts = [];
	foreach ($user->profile->activity as $act){
		array_push($acts, $act);
	}
	// sort by title???
	usort($acts, "cmp_act_title");

	foreach ($acts as $act){

		if (!isset($act->show)){
			$act->show = 1;
		}
		if ($act->show == 1)
		{
			$stars = isset($act->act_gsscore) ? $act->act_gsscore : 0;
			$stars = getTruncatedScore($stars);
			if ($stars > 0){
				$html_acts .=
<<<EOD
	<tr>
		<td width="490">
			$act->title;
		</td>
		<td width="80">
			<img src="./images_profile/star_red_$stars.png"/>
		</td>
		<td width="50" align="center">
			$stars
		</td>
	</tr>
EOD;
			}
		}
	}
	$html_acts .= '</table>';

	/////////////////////////////////////////////////////////////////////////////
	// PAGE 1
	/////////////////////////////////////////////////////////////////////////////
	$pdf->SetLineStyle(array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => [50, 50, 50]));

	//
	// select font
	//
	// https://stackoverflow.com/questions/8737772/tcpdf-encode-chinese-character
	//$pdf->SetFont('kozminproregular', '', 12);
	//$pdf->SetFont('arialuni', '', 12);
	//$pdf->SetFont('DroidSansFallback.ttf', '', 12);
	$pdf->SetFont('stsongstdlight', '', 12);

	// https://alucard-blog.blogspot.hk/2013/06/tcpdf-how-to-display-chinese-character.html
	TCPDF_FONTS::addTTFfont('fonts/DroidSansFallback.ttf');
	$pdf->SetFont('DroidSansFallback', '', 12, '', false);

	// draw box on the personal info
	$x = 70; $y = 17; $w = 120; $h = 54;
	$pdf->RoundedRect($x, $y, $w, $h, 1, '1111', 'DF', null, hexToRgb('#ffffff'));
	//$pdf->RoundedRect($x, $y, $w, $h, 1, '1111', 'DF', null, hexToRgb('#f8f8f8'));

	// draw box on the activities
	$x = 40; $y = 76; $w = 55; $h = 40;
	$pdf->RoundedRect($x, $y, $w, $h, 1, '1111', 'DF', null, hexToRgb('#f8f8f8'));
	$pdf->RoundedRect($x + 5, $y + 10, $w - 10, 8, 1, '1111', 'DF', null, hexToRgb('#b0e0e6'));
	$pdf->RoundedRect($x + 5, $y + 19, $w - 10, 8, 1, '1111', 'DF', null, hexToRgb('#ffb6c1'));
	$pdf->RoundedRect($x + 5, $y + 28, $w - 10, 8, 1, '1111', 'DF', null, hexToRgb('#98fb98'));

	// draw box on GS Score
	$x = 115;
	$pdf->RoundedRect($x, $y, $w, $h, 1, '1111', 'DF', null, hexToRgb('#f8f8f8'));

	$x = 20; $y = 122; $w = 170; $h = 70;
	//$pdf->RoundedRect($x, $y, $w, $h, 1, '1111', 'DF', null, hexToRgb('#ffffff'));

	// draw box on Spider
	//$x = 20; $y = 130; $w = 170; $h = 100;
	//$pdf->RoundedRect($x, $y, $w, $h, 1, '1111', 'DF', null, hexToRgb('#ffffff'));

	// personal
	$pdf->SetY(17);
	$pdf->writeHTMLCell(0, 0, '', '', $html_personal, 0, 1, 0, true, '', true);

	// activities and gs score
	$pdf->SetY(75);
	$pdf->writeHTMLCell(0, 0, '', '', $html_gsscore, 0, 1, 0, true, '', true);

	$pdf->SetY(125);
	$pdf->writeHTMLCell(0, 0, '', '', $html_objectives, 0, 1, 0, true, '', true);

	/////////////////////////////////////////////////////////////////////////////
	// PAGE 2
	/////////////////////////////////////////////////////////////////////////////
	// spider chart
	$pdf->AddPage();
	$pdf->SetY(17);
	$pdf->writeHTMLCell(0, 0, '', '', $html_spider, 0, 1, 0, true, '', true);

	// skill list
	$pdf->writeHTMLCell(0, 0, '', '', $html_skills, 0, 1, 0, true, '', true);

		/////////////////////////////////////////////////////////////////////////////
	// PAGE 2 + N: activities
	/////////////////////////////////////////////////////////////////////////////
	$pdf->AddPage();
	$pdf->SetY(17);
	$pdf->writeHTMLCell(0, 0, '', '', $html_acts, 0, 1, 0, true, '', true);

  $download = getQs('download');
  if ($download == '1'){
    //$file = 'profile.pdf';
    $file = getcwd() . "/images_profile/profile_". $user->user_id . ".pdf";
    $pdf->Output($file, 'F');
    header("Content-Type: application/octet-stream");
    header('Content-Description: File Transfer');
    header('Content-Disposition: attachment; filename=' . urlencode(basename('profile.pdf')));
    header('Expires: 0');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Pragma: public');
    header('Content-Length: ' . filesize($file));
    ob_clean();
    flush();
    readfile($file);
  } else {
    $file = getcwd() . "/images_profile/profile_". $user->user_id . ".pdf";
    $pdf->Output($file, 'F');
    $pdf->Output('yocle_profile.pdf', 'I');
  }
}

?>
