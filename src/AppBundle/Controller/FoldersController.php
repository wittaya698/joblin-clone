<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Exception\MethodNotAllowedException;
use AppBundle\Exception\NotFoundException;
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

		throw new MethodNotAllowedException();
	}

	#[Route('folders/{id}')]
	public function oneAction($id, Request $request) {
		$folder = Folder::byId(Folder::unhex($id));
		if (!$folder && !$request->isMethod('PUT')) throw new NotFoundException();

		if ($request->isMethod('GET')) {
			return static::successResponse($folder);
		}

		if ($request->isMethod('PUT')) {
			$isNew = !$folder;
			if ($isNew) $folder = new Folder();
			$folder->fromPublicArray(Folder::filter($this->putParameters()));
			$folder->id = Folder::unhex($id);
			$folder->owner_id = $this->user()->id;
			$folder->setIsNew($isNew);
			$folder->save();
			return static::successResponse($folder);
		}

		if ($request->isMethod('PATCH')) {
			$data = $this->patchParameters();
			$folder->fromPublicArray(Folder::filter($this->patchParameters()));
			$folder->id = Folder::unhex($id);
			$folder->save();
			return static::successResponse($folder);
		}

		if ($request->isMethod('DELETE')) {
			$folder->delete();
			return static::successResponse(array('id' => $id));
		}

		throw new MethodNotAllowedException();
	}

	#[Route('folders/{id}/notes')]
	public function linkAction($id, Request $request) {
		$folder = Folder::byId(Folder::unhex($id));
		if (!$folder) throw new NotFoundException();

		if ($request->isMethod('GET')) {
			return static::successResponse($folder->notes());
		}

		throw new MethodNotAllowedException();
	}
}
