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
				$msg = array();
				$msg[] = 'Exception: ' . $e->getMessage() . ' at ' . $e->getFile() . ':' . $e->getLine();
				$msg[] = '';
				$msg[] = $e->getTraceAsString();
				echo implode("\n", $msg);
				echo "\n";
			}
		});


		// HACK: get connection once here so that it's initialized and can
		// be accessed from models.
		$this->db =  $this->eloquent->connection();

		$s = $this->session();

		// TODO: find less hacky way to get request path
		$requestPath = isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '';
		$requestPath = ltrim($requestPath, '/');
		$requestPath = rtrim($requestPath, '?');

		// TODO: to keep it simple, only respond to logged in users, but in theory some data
		// could be public.
		if ($requestPath != 'sessions' && (!$s || !$this->user())) {
			throw new UnauthorizedException('A session and user are required');
		}

		BaseModel::setClientId($s ? $s->client_id : 0);

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
		preg_match('/boundary=(.*)$/', $_SERVER['CONTENT_TYPE'], $matches);
		$boundary = $matches[1];
		$blocks = preg_split("/-+$boundary/", $input);
		array_pop($blocks);
		foreach ($blocks as $id => $block) {
			if (empty($block)) continue;

			// you'll have to var_dump $block to understand this and maybe replace \n or \r with a visibile char

			// parse uploaded files
			if (strpos($block, 'application/octet-stream') !== FALSE) {
				throw new \Exception("Found 'application/octet-stream'");
				// preg_match("/name=\"([^\"]*)\".*stream[\n|\r]+([^\n\r].*)?$/s", $block, $matches);
			} else {
				// match "name" and optional value in between newline sequences
				preg_match('/name=\"([^\"]*)\"[\n|\r]+([^\n\r].*)?\r$/s', $block, $matches);
			}
			if (!isset($matches[2])) {
				// Regex above will not find anything if the parameter has not value. For example
				// "parent_id" below:

				// Content-Disposition: form-data; name="parent_id"
				//
				//
				// Content-Disposition: form-data; name="id"
				//
				// 54ad197be333c98778c7d6f49506efcb

				$output[$matches[1]] = '';
			} else {
				$output[$matches[1]] = $matches[2];
			}
		}

		return $output;
	}

	protected function putParameters() {
		return $this->patchParameters();
	}
}
