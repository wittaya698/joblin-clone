<?php

namespace AppBundle\Exception;

class ValidationException extends BaseException {

	protected $message = 'validation error';
	public $validationErrors = array();

	static public function fromErrors($errors) {
		throw new \Exception("fromErrors(): to be implemented");
	}

	public function toErrorArray() {
		throw new \Exception("toErrorArray(): to be implemented");
	}
}
