<?php

namespace Tests\AppBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class DefaultControllerTest extends WebTestCase {
	public function testIndex() {
		$client = static::createClient([], [
			'HTTP_HOST' => 'localhost:8000'
		]);

		$crawler = $client->request("GET", "/");

		$this->assertEquals(200, $client->getResponse()->getStatusCode());
		$this->assertStringNotContainsString($crawler->filter("#container h1")->text(), 'Welcome to Symfony');
	}
}
