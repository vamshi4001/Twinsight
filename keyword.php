<?php

$text = $_POST["text"];
$key = "9d5ba080b995005d1523ded129e6eba9e16bc0fe";
$url = "http://access.alchemyapi.com/calls/text/TextGetKeywords";

$curlPost = 'apikey=' . urlencode($key) . '&text=' . urlencode($text) . '';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $curlPost);
$data = curl_exec($ch);
$info = curl_getinfo($ch);

if ($data === false || $info['http_code'] != 200) {
	$data = "No cURL data returned for $url [". $info['http_code']. "]";
    if (curl_error($ch))
        $data .= "\n" . curl_error($ch);
}else {
    $xml = new SimpleXMLElement($data);
    $results = $xml->keywords;
    $children = $results->children();
    $total = count($children) - 1;
    // echo $total;
    $i = 0;
    foreach($children AS $child) {
        if ($i < $total) {
            print $child . ", \n";
        }elseif ($i == $total) {
            print $child;
        }
        $i++;
    }
}
curl_close($ch);

?>