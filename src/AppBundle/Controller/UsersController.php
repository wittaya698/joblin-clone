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
			$data = $request->request->all();

			$errors = User::validate($data);
			if (count($errors)) throw ValidationException::fromErrors($errors);

			$data['password'] = Session::hashPassword($data['password']);
			$user->fromPublicArray($data);
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
