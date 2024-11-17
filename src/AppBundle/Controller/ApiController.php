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

abstract class ApiController extends AbstractController {
	protected $db = null;
	protected $session = null;
	protected $user = null;

	private $useTestUserAndSession = true;
	private $testClientNum = 1;

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

		// 1. client 1 : bla bla bla
		// 2. client 2 : bla bla bla fromclient2
		// 3. client 1 : client1bla bla bla

		// RESULT: client1bla bla bla

		// Because diff for 3 is done between 2 and 3
		// Need to introduce revID so that Change class knows between which versions the diff should be made

		// HACK: get connection once here so that it's initialized and can
		// be accessed from models.
		$eloquent = new Eloquent();
		$this->db = $eloquent->connection();

		$s = $this->session();

		// TODO: to keep it simple, only respond to logged in users, but in theory some data
		// could be public.
		if (!$s || !$this->user()) throw new UnauthorizedException('A session and user are required');

		BaseModel::setClientId($s ? $s->client_id : 0);

		return $container;
	}

	protected function session() {
		if ($this->useTestUserAndSession) {
			$session = Session::find(Session::unhex('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB'));
			if ($session) $session->delete();
			$session = new Session();
			$session->id = Session::unhex('BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB');
			$session->owner_id = Session::unhex('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
			$session->client_id = Session::unhex($this->testClientNum == 1 ? 'C1C1C1C1C1C1C1C1C1C1C1C1C1C1C1C1' : 'C2C2C2C2C2C2C2C2C2C2C2C2C2C2C2C2');
			$session->save();
			return $session;
		}

		throw new \Exception("UseRealUserAndSession");
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

		throw new \Exception("Implement user");
	}

	protected function aclCheck($resource) {
		throw new \Exception("aclCheck(): to be implemented");
	}

	static private function serializeResponse($data) {
		$output = $data;

		if ($output instanceof Collection) {
			throw new \Exception("Output instance of Collection");
		}

		if ($output instanceof BaseModel) {
			$output = $output->toPublicArray();
		} else if (is_array($output)) {
			foreach ($output as $k => $v) {
				$output[$k] = self::serializeResponse($v);
			}
		}

		return $output;
	}

	static protected function successResponse($data = null) {
		$output = self::serializeResponse($data);
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
