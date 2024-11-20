<?php

namespace AppBundle\Controller;

use AppBundle\Controller\ApiController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class FilesController extends ApiController {
	#[Route('files')]
	public function allAction(Request $request) {
		throw new \Exception("allAction() to be implemented");
	}

	#[Route('files/{id}')]
	public function oneAction($id, Request $request) {
		throw new \Exception("oneAction() to be implemented");
	}
}
