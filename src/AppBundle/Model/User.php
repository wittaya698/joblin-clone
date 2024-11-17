<?php

namespace AppBundle\Model;

class User extends BaseModel {

	public $useUuid = true;
	public $incrementing = false;

	public function __construct($attributes = array()) {
		parent::__construct($attributes);

		static::$defaultValidationRules['email'] = array(
			array('type' => 'required'),
			array('type' => 'notEmpty'),
			array('type' => 'function', 'args' => array(array('AppBundle\Model\User', 'validateUniqueEmail')), 'message' => 'email "{value}" is already in use'),
		);
		static::$defaultValidationRules['password'] = array(
			array('type' => 'required'),
			array('type' => 'minLength', 'args' => array(8)),
		);
	}

	public function toPublicArray() {
		throw new \Exception("toPublicArray(): to be implemented");
	}

	static public function byEmail($email) {
		return self::where('email', '=', '$email')->first();
	}

	public function save(array $options = array()) {
		$isNew = !$this->id;

		parent::save($options);
		if ($isNew) {
			$this->owner_id = $this->id;
			parent::save($options);
		}
	}

	static public function validateUniqueEmail($key, $rule, $data) {
		throw new \Exception("validateUniqueEmail(): to be implemented");
	}
}
