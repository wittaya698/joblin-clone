<?php

namespace AppBundle;

class Cache {

	private $cacheDir_ = null;
	private $adapter_ = null;

	public function __construct(string $kernelCacheDir) {
		$this->cacheDir_ = $kernelCacheDir . '/cache_service';
		if (!file_exists($this->cacheDir_)) mkdir($this->cacheDir_, 0755, true);
	}

	private function adapter() {
		throw new \Exception("adapter(): to be implemented");
	}

	public function get($k) {
		throw new \Exception("get(): to be implemented");
	}

	public function set($k, $v, $expiryTime = null) {
		throw new \Exception("set(): to be implemented");
	}

	public function delete($k) {
		throw new \Exception("delete(): to be implemented");
	}

	public function getOrSet($k, $func, $expiryTime = null) {
		throw new \Exception("getOrSet(): to be implemented");
	}
}
