#!/bin/bash
# php ./cli-client/main.php --config cli-client/.config1 --sync
# php ./cli-client/main.php --config cli-client/.config2 --sync
# go run ./cli-client/main.go
# php bin/console app:build-mime-type-array

echo '============================================================================================='
echo 'Testing controllers....'
echo '============================================================================================='
php ./vendor/bin/phpunit --bootstrap vendor/autoload.php tests/Controller/

echo ""

echo '============================================================================================='
echo 'Testing models....'
echo '============================================================================================='
php ./vendor/bin/phpunit --bootstrap vendor/autoload.php tests/Model/