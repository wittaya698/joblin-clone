<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Model\Session;
use AppBundle\Exception\MethodNotAllowedException;
use Symfony\Component\Routing\Attribute\Route;

class SessionsController extends ApiController {
	#[Route('/sessions')]
	public function allAction(Request $request) {
		if ($request->isMethod('POST')) {
			$data = $request->request->all();
			// Note: the login method will throw an exception in case of failure
			$session = Session::login($data['email'], $data['password'], Session::unhex($data['client_id']));
			return static::successResponse($session);
		}

		throw new MethodNotAllowedException();
	}

	#[Route('/sessions/{id}')]
	public function oneAction($id, Request $request) {
		throw new \Exception("oneAction: to be implemented");
	}
}
