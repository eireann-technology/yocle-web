<?php
$debug_location = 0;

function ip_is_private ($ip) {
    $pri_addrs = array (
                      '10.0.0.0|10.255.255.255', // single class A network
                      '172.16.0.0|172.31.255.255', // 16 contiguous class B network
                      '192.168.0.0|192.168.255.255', // 256 contiguous class C network
                      '169.254.0.0|169.254.255.255', // Link-local address also refered to as Automatic Private IP Addressing
                      '127.0.0.0|127.255.255.255' // localhost
                     );

    $long_ip = ip2long ($ip);
    if ($long_ip != -1) {

        foreach ($pri_addrs AS $pri_addr) {
            list ($start, $end) = explode('|', $pri_addr);

             // IF IS PRIVATE
             if ($long_ip >= ip2long ($start) && $long_ip <= ip2long ($end)) {
                 return true;
             }
        }
    }

    return false;
}
$country = '';
if (isset($_SERVER['REMOTE_ADDR'])){
	$ip = $_SERVER['REMOTE_ADDR'];
	$is_private = ip_is_private($ip);
	if ($debug_location){
		echo "$ip $is_private<br/>";
	}
	//$ curl ipinfo.io/8.8.8.8
	//{
	// "ip": "8.8.8.8",
	//"hostname": "google-public-dns-a.google.com",
	//  "loc": "37.385999999999996,-122.0838",
	//  "org": "AS15169 Google Inc.",
	//  "city": "Mountain View",
	//  "region": "CA",
	//  "country": "US",
	//  "phone": 650
	//}
	if (!$is_private){
		//$details = json_decode(file_get_contents("http://ipinfo.io/{$ip}/json"));
		if (isset($details)){
			if ($debug_location){
				var_dump($details);
			}
			if (isset($details->loc)){
				$latlng_arr = explode(",", $details->loc);
				$lat = $latlng_arr[0];
				$lng = $latlng_arr[1];
			}
			$country = isset($details->country) ? $details->country : "";
			$city = isset($details->city); // -> "Mountain View"
			$org = isset($details->org);
			$region = isset($details->region);
		}
	}
}
//echo $country;	// CN/OTHERS

?>
