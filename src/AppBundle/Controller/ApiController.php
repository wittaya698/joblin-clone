<?php

namespace AppBundle\Controller;

use AppBundle\Eloquent;
use Symfony\Component\HttpFoundation\JsonResponse;
use AppBundle\Model\BaseModel;
use AppBundle\Model\Session;
use AppBundle\Model\User;
use AppBundle\Exception\UnauthorizedException;
use Illuminate\Database\Eloquent\Collection;
use AppBundle\Exception\BaseException;
use Psr\Container\ContainerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\RequestStack;

abstract class ApiController extends AbstractController {
	protected $db = null;
	protected $session = null;
	protected $user = null;

	private $eloquent;
	private $requestStack;
	private $useTestUserAndSession = false;
	private $testClientNum = 1;

	public function __construct(Eloquent $eloquent, RequestStack $requestStack) {
		$this->eloquent = $eloquent;
		$this->requestStack = $requestStack;
	}

	public function setContainer(ContainerInterface $container): ?ContainerInterface {
		parent::setContainer($container);

		set_exception_handler(function ($e) {
			if ($e instanceof BaseException) {
				$r = $e->toJsonResponse();
				$r->send();
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
				$response->send();
				echo "\n";
			}
		});


		// HACK: get connection once here so that it's initialized and can
		// be accessed from models.
		$this->db =  $this->eloquent->connection();

		$s = $this->session();

		$request = $this->container->get('request_stack')->getCurrentRequest();
		$requestPath = $request->getPathInfo();
		$requestPath = ltrim($requestPath, '/');
		$method = $request->getMethod();

		$sessionRequired = true;
		if ($method == 'POST' && $requestPath == 'sessions') $sessionRequired = false;
		if ($method == 'POST' && $requestPath == 'users') $sessionRequired = false;

		// TODO: to keep it simple, only respond to logged in users, but in theory some data
		// could be public.
		if ($sessionRequired && (!$s || !$this->user())) {
			throw new UnauthorizedException('A session and user are required');
		}

		BaseModel::setClientId($s ? $s->client_id : 0);
		restore_exception_handler();
		return $container;
	}

	protected function session() {
		if ($this->useTestUserAndSession) {
			$session = Session::find(Session::unhex('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'));
			if ($session) return $session;
			// if ($session) {
			// 	$ok = $session->delete();
			// 	if (!$ok) throw new \Exception("Cannot delete session");
			// }
			$session = new Session();
			$session->id = Session::unhex('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
			$session->owner_id = Session::unhex('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
			$session->client_id = Session::unhex($this->testClientNum == 1 ? 'C1C1C1C1C1C1C1C1C1C1C1C1C1C1C1C1' : 'C2C2C2C2C2C2C2C2C2C2C2C2C2C2C2C2');
			$session->save();
			return $session;
		}

		if ($this->session) return $this->session;
		$request = $this->requestStack->getCurrentRequest();
		$this->session = Session::find(BaseModel::unhex($request->query->get('session')));
		return $this->session;
	}

	protected function user() {
		if ($this->useTestUserAndSession) {
			$user = User::find(User::unhex('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA'));
			if (!$user) {
				$user = new User();
				$user->id = User::unhex('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
				$user->owner_id = $user->id;
				$user->email = 'test@example.com';
				$user->password = Session::hashPassword('12345678');
				$user->save();
			}
			return $user;
		}

		if ($this->user) return $this->user;
		$s = $this->session();
		$this->user = $s ? $s->owner() : null;
		return $this->user;
	}

	protected function userId() {
		$u = $this->user();
		return $u ? $u->id : 0;
	}

	protected function aclCheck($resource) {
		if (!is_array($resource)) $resource = array($resource);
		$user = $this->user();
		throw new \Exception("aclCheck(): to be implemented");
	}

	static protected function successResponse($data = null) {
		$output = BaseModel::anythingToPublicArray($data);
		return new JsonResponse($output, 200);
	}

	static protected function errorResponse($message, $errorCode = 0, $httpCode = 400) {
		$o = array('error' => $message, 'code' => $errorCode);
		$response = new JsonResponse($o);
		$response->setStatusCode($httpCode);
		return $response;
	}

	protected function multipleValues($v) {
		throw new \Exception("multipleValues(): to be implemented");
	}

	// PHP doesn't parse PATCH and PUT requests automatically, so it needs
	// to be done manually.
	// http://stackoverflow.com/a/5488449/561309
	protected function patchParameters() {
		$output = array();
		$input = file_get_contents('php://input');

		// TODO: check if it's possible to use the following method outside of testing
		if (isset($_SERVER['JOPLIN_TESTING']) && $_SERVER['JOPLIN_TESTING']) {
			$request = $this->container->get('request_stack')->getCurrentRequest();
			return $request->request->all();
		}

		if (!isset($_SERVER['CONTENT_TYPE']) || strpos($_SERVER['CONTENT_TYPE'], 'application/x-www-form-urlencoded') === 0) {
			parse_str($input, $output);
		} else {
			throw new \Exception('Only application/x-www-form-urlencoded Content-Type is supported');
		}

		return $output;
	}

	protected function putParameters() {
		return $this->patchParameters();
	}
}
