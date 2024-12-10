<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Exception\UnauthorizedException;
use AppBundle\Model\Change;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class SynchronizerController extends ApiController {
	#[Route('synchronizer')]
	public function allAction(Request $request): JsonResponse {
		$lastChangeId = (int)$request->query->get('rev_id');

		if (!$this->user() || !$this->session()) throw new UnauthorizedException();

		$actions = Change::changesDoneAfterId($this->user()->id, $this->session()->client_id, $lastChangeId);
		return static::successResponse($actions);
	}
}
