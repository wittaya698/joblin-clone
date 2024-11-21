<?php

function config($name) {
	$config = array(
		'baseUrl' => 'http://localhost:8000',
	);
	if (isset($config[$name])) {
		return $config[$name];
	}
}

function execRequest($method, $path, $query = null, $data = null) {
	$url = config('baseUrl') . '/' . $path;
	if ($query) $url .= '?' . http_build_query($query);

	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, $url);
	if ($data) curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
	$response = curl_exec($ch);
	curl_close($ch);

	$output = json_decode($response, true);
	if ($output === null) {
		return array('error' => 'Cannot decode JSON', 'body' => $response);
	}

	return $output;
}

$session = execRequest('POST', 'sessions', null, array(
	'email' => 'wittayathongjeen698@gmail.com',
	'password' => '0906198331',
	'client_id' => '7849ef0a6f197c1d8429d95a91cfb961'
));

var_dump($session);

die();
