#!/bin/bash
# php ./cli-client/main.php --config cli-client/.config1 --sync
# php ./cli-client/main.php --config cli-client/.config2 --sync
# go run ./cli-client/main.go
# php bin/console app:build-mime-type-array

php ./vendor/bin/phpunit --bootstrap vendor/autoload.php tests/
# php phpunit-5.7.20.phar --filter testConflict tests/Model/ChangeTest.php --bootstrap vendor/autoload.php tests/