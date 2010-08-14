<?php 
		$str = $_POST["text"];
		$url = 'http://search.yahooapis.com/ContentAnalysisService/V1/termExtraction';
		$appid = 'pSQDjJHV34FkRSTyZoZrdF0oVAumFMwp5WsFWNa4zE7CcgWIS9CS_kQIZjvCB9DSieJysDDS6z6uv5ZfKi3I';
		$output = 'php';
		$context = urlencode($str);
		$context = substr($context, 0, 7000);
		$url = $url . '?appid=' . $appid . '&output=' . $output . '&context=' . $context;
		$ch = curl_init();
		// set URL and other appropriate options
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_HEADER, 0);
		curl_setopt($ch, CURLOPT_HTTPGET, true);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		// grab URL and pass it to the browser
		$response = curl_exec($ch);
		// close cURL resource, and free up system resources
		curl_close($ch);
		$total = count($response['ResultSet']['Result']) - 1;
		echo $total;
		$i=0;
		foreach ($response['ResultSet']['Result'] as $key => $term) 
		{
	    	if ($i < $total) 
			{
            	print $term . ", \n";
    	    }
			elseif ($i == $total) 
			{
            	print $term;
        	}
        	$i++;
		}
?>