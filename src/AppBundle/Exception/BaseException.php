<?php

namespace AppBundle\Exception;

class BaseException extends \Exception {
	protected $httpStatusCode = 400;

	public function getType() {
		throw new \Exception("getType(): to be implemented");
	}

	public function getHttpStatusCode() {
		throw new \Exception("getHttpStatusCode(): to be implemented");
	}

	public function toErrorArray() {
		throw new \Exception("toErrorArray(): to be implemented");
	}

	public function toJsonResponse($errorObject = null) {
		throw new \Exception("toJsonResponce(): to be implemented");
	}
}
