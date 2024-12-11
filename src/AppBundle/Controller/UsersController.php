<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Exception\ValidationException;
use AppBundle\Model\Session;
use AppBundle\Model\User;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class UsersController extends ApiController {
	#[Route('users')]
	public function allAction(Request $request): JsonResponse {
		if ($request->isMethod('POST')) {
			$user = new User();
			$user->fromPublicArray($request->request->all());
			$user->validate();
			$user->password = Session::hashPassword($user->password); // Password is only hashed now so that validation can check its length
			$user->save();
			return static::successResponse($user->toPublicArray());
		}

		return static::errorResponse('Invalid method');
	}

	#[Route('users/{id}')]
	public function oneAction($id, Request $request): JsonResponse {
		$user = User::find(User::unhex($id));
		if (!$user) return static::errorResponse('Not found', 0, 404);
		$this->aclCheck($user);
		return static::successResponse($user);
	}
}
