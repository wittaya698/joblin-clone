<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Diff;
use AppBundle\Model\Change;
use AppBundle\Model\BaseItem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class UsersController extends ApiController {
	#[Route('users')]
	public function allAction(Request $request): JsonResponse {
		throw new \Exception("allAction(): to be implemented");
	}

	#[Route('users/{id}')]
	public function oneAction(Request $request): JsonResponse {
		throw new \Exception("oneAction(): to be implemented");
	}
}
