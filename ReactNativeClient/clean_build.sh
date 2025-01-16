#!/bin/bash

rm -rf android/app/build
rm -rf android/build
rm -rf android/.gradle
rm -rf node_modules
npm install
./start_server.sh