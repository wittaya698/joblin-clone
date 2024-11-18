#!/bin/bash
php ./cli-client/main.php --config cli-client/.config1 --sync
go run ./cli-client/main.go
php ./vendor/bin/phpunit --bootstrap vendor/autoload.php tests/Model/