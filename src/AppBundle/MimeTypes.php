<?php

namespace AppBundle;

class MimeTypes {

	private $mimeTypes_ = null;
	private $paths_ = null;
	private $defaultMimeType_ = 'application/octet-stream';
	private $defaultMimeTypeId_ = null;

	public function __construct(Paths $paths) {
		$this->paths_ = $paths;
	}

	public function idFromPath($filePath) {
		throw new \Exception("idFromPath(): to be implemented");
	}

	private function loadMimeTypes() {
		throw new \Exception("loadMimeTypes(): to be implemented");
	}

	public function defaultMimeTypeId() {
		throw new \Exception("defaultMimeTypeId(): to be implemented");
	}

	public function defaultMimeType() {
		throw new \Exception("defaultMimeType(): to be implemented");
	}

	public function idToString($id) {
		throw new \Exception("idToString(): to be implemented");
	}

	public function stringToId($mimeType) {
		throw new \Exception("stringToId(): to be implemented");
	}

	private function extensionToMimeTypeId($ext) {
		throw new \Exception("extensionToMimeTypeId(): to be implemented");
	}
}
