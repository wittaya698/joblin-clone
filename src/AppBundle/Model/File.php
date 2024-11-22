<?php

namespace AppBundle\Model;

class File extends BaseModel {

	static public $mimeTypes_ = null;
	static public $paths_ = null;

	public $useUuid = true;
	public $incrementing = false;

	public function toPublicArray() {
		throw new \Exception("toPublicArray(): to be implemented");
	}
	public function delete() {
		throw new \Exception("delete(): to be implemented");
	}
	public function path() {
		throw new \Exception("path(): to be implemented");
	}
	static public function pathForId($id) {
		throw new \Exception("pathForId(): to be implemented");
	}
	public function moveUploadedFile($file) {
		throw new \Exception("moveUploadedFile(): to be implemented");
	}
}
