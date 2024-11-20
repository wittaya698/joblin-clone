<?php

namespace AppBundle\Command;

use AppBundle\Paths;
use SebastianBergmann\Environment\Console;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

class BuildMimeTypeArrayCommand extends Command {

	private $paths;

	public function __construct(Paths $paths) {
		$this->paths = $paths;
		parent::__construct();
	}

	protected function configure() {
		$this->setName('app:build-mime-type-array');
		$this->setDescription('Build MIME type PHP array from Apache mime.types file.');
	}

	protected function execute(InputInterface $input, OutputInterface $output): int {
		$paths = $this->paths;

		$sourcePath = $paths->dataDir() . '/mime.types';
		$targetPath = $paths->dataDir() . '/mime_types.php';
		$sqlitePath = $paths->dataDir() . '/mime_types.sqlite.sql';

		# Remove ! below
		if (!file_exists($targetPath)) {
			// TODO: (or not)
			// To update the existing PHP file, it needs to be loaded first and the IDs need to remain in place
			// since they might be use in the database, etc., then any new type can be added.
			// This is easy to implement, but most likely YAGNI.
			throw new \Exception(sprintf('MimeType PHP file already exists at %s and the code to update it as not been implemented.', $targetPath));
		}

		$lines = file_get_contents($sourcePath);
		if ($lines === false) throw new \Exception('Cannot read ' . $sourcePath);
		$lines = explode("\n", $lines);

		$mimeTypes = array();
		$id = 1;
		foreach ($lines as $line) {
			$line = trim($line);
			if (!$line) continue;
			if ($line[0] == '#') continue;
			$tokens = explode("\t", $line);
			if (count($tokens) < 2) continue;
			$extensions = explode(' ', $tokens[count($tokens) - 1]);

			$mimeType = trim($tokens[0]);
			if (!$mimeType) continue; // Shouldn't happen

			$mimeTypes[$id] = array(
				'id' => $id,
				't' => $mimeType,
				'e' => $extensions,
			);

			$id++;
		}

		// CREATE TABLE mimetypes (
		//     id INT,
		// 	mime TEXT
		// );

		// CREATE TABLE mimetype_extensions (
		//     id INTEGER PRIMARY KEY,
		// 	mimetype_id,
		// 	extension TEXT
		// );

		// foreach ($mimeTypes[$id]

		$content = var_export($mimeTypes, true);
		$content = str_replace(" ", "", $content);
		$content = str_replace("\n", '', $content);
		$content = str_replace(',)', ')', $content);
		$content = '<?php return ' . $content . ';';

		$ok = file_put_contents($targetPath, $content);
		if ($ok === false) throw new \Exception('Could not write to ' . $targetPath);

		$output->writeln(sprintf('File created at "%s"', $targetPath));
		$output->write("\n\n------------Build Mime type arrat complete------------\n\n");

		return 0;
	}
}
