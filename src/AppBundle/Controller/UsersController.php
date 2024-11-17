<?php

namespace AppBundle\Controller;

use Symfony\Component\HttpFoundation\Request;
use AppBundle\Controller\ApiController;
use AppBundle\Diff;
use AppBundle\Model\Action;
use AppBundle\Exception\UnauthorizedException;
use AppBundle\Model\Change;
use AppBundle\Model\FolderItem;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class UsersController extends ApiController {
	#[Route('users')]
	public function allAction(Request $request): JsonResponse {

		$source = "This is the first line.\n\nThis is the second line.";
		$target1 = "This is the first line XXX.\n\nThis is the second line.";
		$target2 = "This is the first line.\n\nThis is the second line YYY.";

		$r = Diff::merge3($source, $target1, $target2);
		var_dump($r);

		// $dmp = new DiffMatchPatch();
		// $patches = $dmp->patch_make($source, $target1);
		// // @@ -1,11 +1,12 @@
		// //  Th
		// // -e
		// // +at
		// //   quick b
		// // @@ -22,18 +22,17 @@
		// //  jump
		// // -s
		// // +ed
		// //   over
		// // -the
		// // +a
		// //   laz
		// $result = $dmp->patch_apply($patches, $target2);
		// var_dump($result);
		// die();

		// $dmp = new DiffMatchPatch();

		// $source = "This is the first line.\n\nThis is the second line.";
		// $target1 = "This is the first line XXX.\n\nThis is the second line.";
		// $target2 = "edsùfrklq lkzerlmk zemlkrmzlkerm lze.";


		// $diff1 = $dmp->patch_make($source, $target1);
		// $diff2 = $dmp->patch_make($source, $target2);

		// //var_dump($dmp->patch_toText($diff1));
		// // //var_dump($diff1[0]->patch_toText());

		// $r = $dmp->patch_apply($diff1, $source);
		// $r = $dmp->patch_apply($diff1, $target2);
		// var_dump($r);die();

		// $r = $dmp->patch_apply($diff2, $r[0]);

		// var_dump($r);


		// $dmp = new DiffMatchPatch();
		// $patches = $dmp->patch_make($source, $target1);
		// // @@ -1,11 +1,12 @@
		// //  Th
		// // -e
		// // +at
		// //   quick b
		// // @@ -22,18 +22,17 @@
		// //  jump
		// // -s
		// // +ed
		// //   over
		// // -the
		// // +a
		// //   laz
		// $result = $dmp->patch_apply($patches, $target2);
		// var_dump($result);

		// die();

		// $r = Diff::merge($source, $target1, $target2);
		// var_dump($r);die();

		// $diff1 = xdiff_string_diff($source, $target1);
		// $diff2 = xdiff_string_diff($source, $target2);

		// $errors = array();
		// $t = xdiff_string_merge3($source , $target1, $target2, $errors);
		// var_dump($errors);
		// var_dump($t);die();

		// var_dump($diff1);
		// var_dump($diff2);

		// $errors = array();
		// $t = xdiff_string_patch($source, $diff1, XDIFF_PATCH_NORMAL, $errors);
		// var_dump($t);
		// var_dump($errors);

		// $errors = array();
		// $t = xdiff_string_patch($t, $diff2, XDIFF_PATCH_NORMAL, $errors);
		// var_dump($t);
		// var_dump($errors);



		// var_dump($diff1);
		// var_dump($diff2);

		// $change = new Change();
		// $change->user_id = FolderItem::unhex('204705F2E2E698036034FDC709840B80');
		// $change->client_id = FolderItem::unhex('11111111111111111111111111111111');
		// $change->item_type = FolderItem::enumId('type', 'note');
		// $change->item_field = FolderItem::enumId('field', 'title');
		// $change->item_id = FolderItem::unhex('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
		// $change->delta = 'salut ca va';
		// $change->save();


		// $change = new Change();
		// $change->user_id = FolderItem::unhex('204705F2E2E698036034FDC709840B80');
		// $change->client_id = FolderItem::unhex('11111111111111111111111111111111');
		// $change->item_type = FolderItem::enumId('type', 'note');
		// $change->item_field = FolderItem::enumId('field', 'title');
		// $change->item_id = FolderItem::unhex('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
		// $change->createDelta('salut, ça va ? oui très bien');
		// $change->save();

		// $change = new Change();
		// $change->user_id = FolderItem::unhex('204705F2E2E698036034FDC709840B80');
		// $change->client_id = FolderItem::unhex('11111111111111111111111111111111');
		// $change->item_type = FolderItem::enumId('type', 'note');
		// $change->item_field = FolderItem::enumId('field', 'title');
		// $change->item_id = FolderItem::unhex('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
		// $change->createDelta('salut - oui très bien');
		// $change->save();

		// $change = new Change();
		// $change->user_id = FolderItem::unhex('204705F2E2E698036034FDC709840B80');
		// $change->client_id = FolderItem::unhex('11111111111111111111111111111111');
		// $change->item_type = FolderItem::enumId('type', 'note');
		// $change->item_field = FolderItem::enumId('field', 'title');
		// $change->item_id = FolderItem::unhex('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD');
		// $change->createDelta('salut, ça va ? oui bien');
		// $change->save();

		$d = Change::fullFieldText(FolderItem::unhex('DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD'), FolderItem::enumId('field', 'title'));
		var_dump($r);

		// $fineDiff = $this->get('app.fine_diff');
		// $opcodes = $fineDiff->getDiffOpcodes('salut ca va', 'salut va?');
		// var_dump($opcodes);
		// $merged = $fineDiff->renderToTextFromOpcodes('salut ca va', $opcodes);
		// var_dump($merged);
		// die();

		throw new \Exception("allAction(): to be implemented");
	}

	#[Route('users/{id}')]
	public function oneAction(Request $request): JsonResponse {
		throw new \Exception("oneAction(): to be implemented");
	}
}
