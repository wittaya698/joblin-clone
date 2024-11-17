<?php

namespace AppBundle\Model;

class Folder extends FolderItem {

	protected $versionedFields = array('title');

	public function add($ids) {
		throw new \Exception("add(): to be implemened");
	}

	public function notes() {
		throw new \Exception("notes(): to be implemened");
	}
}
