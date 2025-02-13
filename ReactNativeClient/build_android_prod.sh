#!/bin/bash

# Clear build dir if permission issue:
# rm -rf android/app/build

# Set environment
export PATH_TO_NODE=$(which node)

# Run Node.js script
$PATH_TO_NODE ../Tools/prepare-android-prod-build.js

# Change to android directory
cd android

# Build the APK with Gradle
./gradlew assembleRelease -PbuildDir=build --console plain