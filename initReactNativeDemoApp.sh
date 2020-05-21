#!/bin/bash

blink_id_plugin_path=`pwd`/BlinkInput

# remove any existing code
rm -rf BlinkInputReactNative

# create a sample application
# https://github.com/react-native-community/cli#using-npx-recommended
npx react-native init --version="0.61.5" BlinkInputReactNative

# enter into demo project folder
pushd BlinkInputReactNative

if true; then
  # download npm package
  echo "Downloading blinkinput-react-native module"
  npm install --save blinkinput-react-native
else
  echo "Using blinkinput-react-native from this repo instead from NPM"
  # use directly source code from this repo instead of npm package
  # from RN 0.57 symlink does not work any more
  npm pack $blink_id_plugin_path
  npm install --save blinkinput-react-native-4.3.0.tgz
  #pushd node_modules
    #ln -s $blink_id_plugin_path blinkinput-react-native
  #popd
fi

# Auto-linking is done in 0.6 versions

# enter into android project folder
pushd android

# patch the build.gradle to add "maven { url https://maven.microblink.com }"" repository
perl -i~ -pe "BEGIN{$/ = undef;} s/maven \{/maven \{ url 'https:\\/\\/maven.microblink.com' }\n        maven {/" build.gradle

popd

# enter into ios project folder
pushd ios

# install pod
pod install

if false; then
  echo "Replace pod with custom dev version of nput framework"
  # replace pod with custom dev version of BlinkInput framework
  pushd Pods/PPBlinkOCR
  rm -rf Microblink.bundle
  rm -rf Microblink.framework

  cp -r ~/Downloads/blinkinput-ios/Microblink.bundle ./
  cp -r ~/Downloads/blinkinput-ios/Microblink.framework ./
  popd
fi

# go to react native root project
popd

# remove index.js
rm -f index.js

# remove index.ios.js
rm -f index.ios.js

# remove index.android.js
rm -f index.android.js

cp ../demoApp/index.js ./

# use the same index.js file for Android and iOS
cp index.js index.ios.js
cp index.js index.android.js

echo "Go to React Native project folder: cd BlinkInputReactNative"
echo "To run on Android execute: react-native run-android"
echo "To run on iOS: go to BlinkInputReactNative/ios and open BlinkInputReactNative.xcworkspace; set your development team and add Privacy - Camera Usage Description key to Your info.plist file and press run"
