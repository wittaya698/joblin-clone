#!/bin/bash
CLIENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

rm -f "$CLIENT_DIR/spec-build/src"
ln -s "$CLIENT_DIR/build/src" "$CLIENT_DIR/spec-build"

npm run build && NODE_PATH="$CLIENT_DIR/spec-build/" npm run test spec-build/synchronizer.js