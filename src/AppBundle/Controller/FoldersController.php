<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Model\Folder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class FoldersController extends ApiController {
	#[Route('folders')]
	public function allAction(Request $request): JsonResponse {
		if ($request->isMethod('GET')) {
			return static::successResponse(Folder::all());
		}

		if ($request->isMethod('POST')) {
			$folder = new Folder();
			$folder->fromPublicArray($request->request->all());
			$folder->owner_id = $this->user()->id;
			$folder->save();
			return static::successResponse($folder);
		}

		return static::errorResponse('Invalid method');
	}

	#[Route('folders/{id}')]
	public function oneAction($id, Request $request) {
		$folder = Folder::byId(Folder::unhex($id));
		if (!$folder && !$request->isMethod('PUT')) {
			throw new \Exception("Folder not found");
		}

		if ($request->isMethod('GET')) {
			return static::successResponse($folder);
		}

		if ($request->isMethod('PUT')) {
			if (!$folder) $folder = new Folder();
			$folder->fromPublicArray($this->putParameters());
			$folder->id = Folder::unhex($id);
			$folder->owner_id = $this->user()->id;
			$folder->save();
			return static::successResponse($folder);
		}

		if ($request->isMethod('PATCH')) {
			$data = $this->patchParameters();
			$folder->fromPublicArray($this->patchParameters());
			$folder->id = Folder::unhex($id);
			$folder->save();
			return static::successResponse($folder);
		}

		if ($request->isMethod('DELETE')) {
			$folder->delete();
			return static::successResponse(array('id' => $id));
		}

		return static::errorResponse('Invalid method');
	}

	#[Route('folders/{id}/notes')]
	public function linkAction($id, Request $request) {
		$folder = Folder::byId(Folder::unhex($id));
		if (!$folder) return static::errorResponse('Not found', 0, 404);

		if ($request->isMethod('GET')) {
			return static::successResponse($folder->notes());
		}

		return static::errorResponse('Invalid method');
	}
}
