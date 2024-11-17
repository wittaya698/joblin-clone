<?php

namespace AppBundle\Model;

use AppBundle\Diff;

class Change extends BaseModel {

	static protected $enums = array(
		'type' => array('create', 'update', 'delete'),
	);

	static public function changesDoneAfterId($userId, $clientId, $changeId) {
		throw new \Exception("changesDoneAfterId(): to be implemented");
	}

	static public function itemFieldHistory($itemId, $itemField, $toId = null) {
		$query = self::where('item_id', '=', $itemId);
		$query->where('item_field', '=', $itemField);
		if ($toId) $query->where('id', '<=', $toId);
		$query->orderBy('id');
		return $query->get();
	}

	static public function fullFieldText($itemId, $itemField, $toId = null, $returnRevId = false) {
		$output = '';
		$changes = self::itemFieldHistory($itemId, $itemField, $toId);
		$revId = 0;
		for ($i = 0; $i < count($changes); $i++) {
			$change = $changes[$i];
			$result = Diff::patch($output, $change->delta);
			if (!count($result[1])) throw new \Exception('Unexpected result format for patch operation: ' . json_encode($result));
			if (!$result[1][0]) {
				// Could not patch the string. TODO: handle conflict
			}
			$output = $result[0];

			$revId = $change->id;
		}

		return $returnRevId ? array('text' => $output, 'revId' => $revId) : $output;
	}

	public function createDelta($newText) {
		$currentText = self::fullFieldText($this->item_id, $this->item_field, $this->previous_id);
		$this->delta = Diff::diff($currentText, $newText);
	}
}
