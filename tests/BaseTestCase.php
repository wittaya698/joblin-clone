<?php

use PHPUnit\Framework\TestCase;
use AppBundle\Model\BaseModel;
use AppBundle\Model\User;

class BaseTestCase extends TestCase {

	protected function createModelId($type, $num = 1) {
		$c = '';
		if ($type == 'user') {
			$c = 'A';
		} else if ($type == 'client') {
			$c = 'C';
		} else if ($type == 'session') {
			$c = 'B';
		} else if ($type == 'note') {
			$c = 'D';
		}
		return BaseModel::unhex(str_repeat($c . $num, 16));
	}

	protected function clientId($num = 1) {
		return $this->createModelId('client', $num);
	}

	protected function user($num = 1) {
		$id = $this->createModelId('user', $num);
		$user = User::find($id);
		if ($user) return $user;

		$user = new User();
		$user->id = $id;
		$user->owner_id = $user->id;
		$user->email = BaseModel::hex($id) . '@example.com';
		$user->password = '$2y$10$YJeArRNypSbmpWG3RA83n.o78EVlyyVCFN71lWJ7.Omc1VEdwmX5W'; // Session::hashPassword('12345678');
		$user->save();

		return $user;
	}

	protected function session($userNum = 1, $clientNum = 1, $sessionNum = 1) {
		throw new Exception("session(): to be implemented");
	}

	public function setUp(): void {
		BaseModel::setClientId($this->clientId());
	}

	public function tearDown(): void {
	}
}
