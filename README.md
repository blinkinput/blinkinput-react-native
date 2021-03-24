# BlinkInput SDK wrapper for React Native

This repository contains example wrapper for BlinkInput native SDK for [Android](https://github.com/BlinkInput/blinkinput-android) and [iOS](https://github.com/BlinkInput/blinkinput-ios). For 100% of features and maximum control, consider using native SDK.


### Licensing

- [Generate](https://microblink.com/login?url=/customer/generatedemolicence) a **free demo license key** to start using the SDK in your app (registration required)

- Get the information about product and licensing of [BlinkInput](https://microblink.com/products/blinkinput)

## React Native Version

BlinkInput React Native was built and tested with [React Native v0.61.5](https://github.com/facebook/react-native/releases/tag/v0.61.5)

## Installation

First generate an empty project if needed:

```shell
react-native init --version="0.61.5" NameOfYourProject
```

Add the **blinkinput-react-native** module to your project:

```shell
cd <path_to_your_project>
npm i --save blinkinput-react-native
```

## Linking

### iOS

Link module with your project: 

```shell
react-native link blinkinput-react-native
```

[CocoaPods](http://cocoapods.org) is a dependency manager for Objective-C, which automates and simplifies the process of using 3rd-party libraries like BlinkInput in your projects.

- If you wish to use version v1.4.0 or above, you need to install [Git Large File Storage](https://git-lfs.github.com) by running these comamnds:

```shell
brew install git-lfs
git lfs install
```

- **Be sure to restart your console after installing Git LFS**

#### Installing pods

From [react-native 0.60](https://facebook.github.io/react-native/blog/2019/07/03/version-60#cocoapods-by-default) CocoaPods are now part of React Native's iOS project.

Go to `NameOfYourProject/ios` folder and install Pods

```shell
pod install
```

Our `blinkinput-react-native` depends on latest `PPBlinkOCR` pod so it will be installed automatically.

**To run iOS application, open NameOfYourProject.xcworkspace, set Your team for every Target in General settings and add Privacy - Camera Usage Description key to Your info.plist file and press run**

### Android

Add microblink maven repository to project level build.gradle:

```
allprojects {
  repositories {
    // don't forget to add maven and jcenter
    mavenLocal()
    jcenter()
    
    // ... other repositories your project needs
    
    maven { url "http://maven.microblink.com" }
  }
}
```

## Demo

This repository contains **initReactNativeDemoApp.sh** script that will create React Native project and download all of its dependencies. You can run this script with following command: 
```shell
./initReactNativeDemoApp.sh
```

## Usage

To use the module you call it in your index.android.js or index.ios.js file like in the [example app](demoApp/index.js). Available recognizers and API documentation is available in [JS API files](BlinkInput).

## FAQ

**Can I create a custom UI overlay?**

Yes you can, but you will have to implement it natively for android and ios, you can see native implementation guides [here(Android)](https://github.com/BlinkInput/blinkinput-android#recognizerRunnerView) and [here(ios)](https://github.com/BlinkInput/blinkinput-ios#recognizerRunnerViewController).

## Known react-native problems:

### Android build exception - missing `ReactSwipeRefreshLayout`

**java.lang.NoClassDefFoundError: com.facebook.react.views.swiperefresh.ReactSwipeRefreshLayout**

Add the following line to dependencies section in android/app/build.gradle:

`implementation 'androidx.swiperefreshlayout:swiperefreshlayout:1.1.0-alpha02'`

