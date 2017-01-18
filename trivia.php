<?php 
$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, 'https://www.opentdb.com/api.php?amount=1&category=12&type=multiple');
curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($curl ,CURLOPT_FOLLOWLOCATION, true);
$question = curl_exec($curl);
print_r($question);
 ?>