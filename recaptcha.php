<?php
	$lang = 'en';
	$server = $_SERVER['SERVER_NAME'];
	//echo $server;
	switch ($server){
		case 'yocle.net':
		case 'www.yocle.net':
			$siteKey = '6Ldk-CUUAAAAAIsQFpLv7z8rIOJV--NwBaLktjYq';
			$secret = '6Ldk-CUUAAAAAOk-riJi_wVn-rZ5SLIsfXbxleTS';
			break;
		
		case 'dev.adiai.com':
			$siteKey = '6LdISgcUAAAAAFR54pQKZYdfTK3X0d7q_g7TPZtG';
			$secret = '6LdISgcUAAAAAInjMnTewGbX7d3PV-O8SigXLLq5';
			break;
	
		case 'yolofolio2.cetl.hku.hk':
			$siteKey = '6LdLFAcUAAAAAC4BDZY_lGDpSaiec53iNM_MKWtg';
			$secret = '6LdLFAcUAAAAAO96sBBgZvLpBem1M1EoorBFVAFM';
			break;
			
		case 'yolofolio.cetl.hku.hk':
			$siteKey = '6Lf7lSUTAAAAADyA-i-nrPpMmk6N7vgm6gPvCy64';
			$secret = '6Lf7lSUTAAAAAE7mOQuRv1Xl40eYtbLprNq2FzX6';
			break;
		
		case 'cetl.ddns.net':
			$siteKey = '6LeumSUTAAAAACoSGkkqR7jic-HuS0RckObDicpM';
			$secret = '6LeumSUTAAAAALP8Tz7WDVV3JqFzLFDOjHsqzXVg';
			break;
		
		case 'videoboard.hk':
			$siteKey = '6LfdeSUTAAAAAHzc_8S3aQCYdhRTKEbfCLuTApP0';
			$secret = '6LfdeSUTAAAAADpTY5F3AkK7woWccI-2vY0DdoJu';
			break;
			
		case 'alanpoon.no-ip.org':
		case 'alanpoon.ddns.net':
		case '192.168.1.10':
			$siteKey = '6LdQmCUTAAAAAB_2WCqpYGU5Jhex0JRekdZ-fQD_';
			$secret = '6LdQmCUTAAAAAJ7PH78oZu_qe0FLGR7NawBGZ1Qc';
			break;
	}
?>
