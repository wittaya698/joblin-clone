<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Model\Note;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class NotesController extends ApiController {
	#[Route('notes')]
	public function allAction(Request $request): JsonResponse {
		if ($request->isMethod('POST')) {
			$note = new Note();
			$note->fromPublicArray($request->request->all());
			$note->owner_id = $this->user()->id;
			$note->save();
			return static::successResponse($note->toPublicArray());
		}

		return static::errorResponse('Invalid method');
	}

	#[Route('notes/{id}')]
	public function oneAction($id, Request $request) {
		$note = Note::find(Note::unhex($id));
		if (!$note && !$request->isMethod('PUT')) return static::errorResponse('Not found', 0, 404);

		if ($request->isMethod('GET')) {
			return static::successResponse($note);
		}

		if ($request->isMethod('PUT')) {
			if (!$note) $note = new Note();
			$note->fromPublicArray($this->putParameters());
			$note->id = Note::unhex($id);
			$note->owner_id = $this->user()->id;
			$note->save();
			return static::successResponse($note);
		}

		if ($request->isMethod('PATCH')) {
			throw new \Exception("Note PATCH method to be implemented");
		}

		if ($request->isMethod('DELETE')) {
			throw new \Exception("Note DELETE method to be implemented");
		}

		return static::errorResponse('Invalid method');
	}
}
