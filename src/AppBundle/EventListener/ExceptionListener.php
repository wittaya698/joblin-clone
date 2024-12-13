<?php

namespace AppBundle\EventListener;

use AppBundle\Exception\BaseException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;

class ExceptionListener implements EventSubscriberInterface {
	public static function getSubscribedEvents(): array {
		return [
			'kernel.exception' => 'onKernelException',
		];
	}

	public function onKernelException(ExceptionEvent $event): void {
		$e = $event->getThrowable();

		if ($e instanceof BaseException) {
			$r = $e->toJsonResponse();
			$event->setResponse($r);
			echo "\n";
		} else {
			$msg = $e->getMessage();

			// If the message was sent in Latin encoding, JsonResponse below will fail
			// so encode it using UTF-8 here.
			if (json_encode($msg) === false) {
				$msg = utf8_encode($e->getMessage());
			}

			$r = array(
				'error' => $msg,
				'code' => 0,
				'type' => 'Exception',
				//'trace' => $e->getTraceAsString(),
			);

			try {
				$response = new JsonResponse($r);
			} catch (\Exception $wat) {
				// If that happens, print the error message as is, since it's better than showing nothing at all
				die($e->getMessage());
			}

			$response->setStatusCode(500);
			$event->setResponse($response);
			echo "\n";
		}
	}
}
