#!/bin/bash
set -e

CLIENT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
npm version patch
# bash $CLIENT_DIR/build.sh
# cp "$CLIENT_DIR/package.json" build/
# cp "$CLIENT_DIR/../ReactNativeClient/lib/package.json" build/lib
# cd "$CLIENT_DIR/build"
# sudo npm install -g
# #sudo yarn global add
# cd -

$CLIENT_DIR/build.sh
sudo rsync -aP "$CLIENT_DIR/build/" "/opt/homebrew/Cellar/nvm/0.40.1/versions/node/v20.18.0/lib/node_modules/joplin"