<?php

namespace AppBundle\Model;

class Folder extends BaseItem {

	protected $versionedFields = array('title');
	protected $isVersioned = true;

	public function add($ids) {
		throw new \Exception("add(): to be implemened");
	}

	public function notes() {
		return Note::where('parent_id', '=', $this->id)->get();
	}
}
