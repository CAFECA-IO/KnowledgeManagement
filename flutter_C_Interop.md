# Flutter C Interop

## 背景說明
### 使用場景
在 ATWallet Android 版本的 Flutter 專案中使用開發資源的 C library， 以實現ed25519 key exchange。

### C library
[orlp/ed25519](https://github.com/orlp/ed25519)


## 參考資料
1. [Flutter 官方文件主要參考環境設置： Binding to native code using dart:ffi](https://flutter.dev/docs/development/platform-integration/c-interop)

2. [Android Developer: Create a CMake build script用CMakeLists.txt文件來定義應如何編譯](https://developer.android.com/studio/projects/configure-cmake)
    *  [補充資料: stackoverflow Cmake 實作](https://stackoverflow.com/questions/54939099/where-can-i-find-a-working-cmakelists-txt-for-new-android-studio-project-with-ob)
    
3. [Implement C in Flutter 主要作為實作 C Function的參考: Flutter_nano_ffi](https://github.com/appditto/flutter_nano_ffi/blob/master/lib/src/ffi/ed25519_blake2b.dart)

## 實作方法

### CMake 
1. import C/C++ sources
You add the sources to the ios folder, because CocoaPods doesn’t allow including sources above the podspec file, but Gradle allows you to point to the ios folder. It’s not required to use the same sources for both iOS and Android; **you may, of course, add Android-specific sources to the android folder and modify CMakeLists.txt appropriately.**

故參考[Android Developer: add C/C++ to your project](https://developer.android.com/studio/projects/add-native-code)可以本專案將C/C++ sources放在 Android/src/main/cpp。
  
2. Create a CMake build script
檔名： CMakeLists.txt
位置： [flutter project name]/android/
寫法：
```java
  # Sets the minimum version of CMake required to build your native library.
  # This ensures that a certain set of CMake features is available to
  # your build.

  cmake_minimum_required(VERSION 3.4.1)

  # Specifies a library name, specifies whether the library is STATIC or
  # SHARED, and provides relative paths to the source code. You can
  # define multiple libraries by adding multiple add_library() commands,
  # and CMake builds them for you. When you build your app, Gradle
  # automatically packages shared libraries with your APK.

  add_library( # Specifies the name of the library.
             ed25519

             # Sets the library as a shared library.
             SHARED

             # Provides a relative path to your source file(s).
             src/main/cpp/add_scalar.c
             src/main/cpp/fe.c
             src/main/cpp/fe.h
             src/main/cpp/fixedint.h
             src/main/cpp/ge.c
             src/main/cpp/ge.h
             src/main/cpp/key_exchange.c
             src/main/cpp/keypair.c
             src/main/cpp/precomp_data.h
             src/main/cpp/sc.c
             src/main/cpp/sc.h
             src/main/cpp/seed.c
             src/main/cpp/sha512.c
             src/main/cpp/sha512.h
             src/main/cpp/sign.c
             src/main/cpp/verify.c
             src/main/cpp/ethereum_utility.h
             src/main/cpp/bitcoin_utility.h)
             
  set_target_properties(ed25519 PROPERTIES LINKER_LANGUAGE CXX)
```
### 環境設定
1. Install cmake by ```brew install cmake && install```

2. Install ninja by [Install ninja on Mac OSX](http://macappstore.org/ninja/)App description: Small build system for use with gyp or CMake
```
根據下次錯誤訊息得知還需 install ninja
```   
[CMake Error: CMake was unable to find a build program corresponding to "Ninja".](https://stackoverflow.com/questions/54500937/cocos2d-x-android-build-failed), 

3. 將Gradle指向 CMakeLists.txt, by adding an externalNativeBuild section to android/app/build.gradle. For example:  
```java
externalNativeBuild {
        // Encapsulates your CMake build configurations.
        cmake {
            // Provides a relative path to your CMake build script.
            path '../CMakeLists.txt'
        }
    }
``` 

### flutter run cmake
即可compile出libed25519.so，在project中使用

### Implement C Function

1. 建立一個dart file 用來import native code function。
檔名： native_add.dart
位置：（但目錄位置不重要，可任意制定）
```java

 ____wallet
   |____lib
     |____native_add
       |____native_add.dart
```

2. open native_add.dart
   1. import 'dart:ffi' as ffi; 
   2. import 'package:ffi/ffi.dart'; 提供將buffer轉成pointer的function

3. import libed25519.so
```java
final ffi.DynamicLibrary ed25519Lib = Platform.isAndroid
    ? ffi.DynamicLibrary.open("libed25519.so")
    : ffi.DynamicLibrary.process();
```

4. 實作function, 以 ed25519CreateSeed function - int ed25519_create_seed(unsigned char *seed) 為例
   1. 以dart:ffi 提供的型別定義 C function 接收與回傳的參數型別
   ```java
   typedef ed25519_create_seed_func = ffi.Int32 Function(ffi.Pointer<ffi.Uint8> seed);
   ```
   2. 根據上述function定義 dart function
   ```java
   typedef Ed25519CreateSeed = int Function(ffi.Pointer<ffi.Uint8> seed);
   ```
   3. 轉換C function to Dart function
   ```java
   final int Function(ffi.Pointer<ffi.Uint8>) ed25519CreateSeed = ed25519Lib
    .lookup<ffi.NativeFunction<ed25519_create_seed_func>>('ed25519_create_seed')
    .asFunction<Ed25519CreateSeed>();
   ```
   範例2
   ```java 
   // C ed25519CreateKeypair function -
   // void ed25519_create_keypair(
   // unsigned char *public_key,
   // unsigned char *private_key,
   // const unsigned char *seed);
   typedef ed25519_create_keypair_func = ffi.Void Function(
       ffi.Pointer<ffi.Uint8> publicKey,
       ffi.Pointer<ffi.Uint8> privateKey,
       ffi.Pointer<ffi.Uint8> seed);
   typedef Ed25519CreateKeypair = void Function(ffi.Pointer<ffi.Uint8> publicKey,
       ffi.Pointer<ffi.Uint8> privateKey, ffi.Pointer<ffi.Uint8> seed);
   final void Function(
           ffi.Pointer<ffi.Uint8>, ffi.Pointer<ffi.Uint8>, ffi.Pointer<ffi.Uint8>)
       ed25519CreateKeypair = ed25519Lib
           .lookup<ffi.NativeFunction<ed25519_create_keypair_func>>(
               'ed25519_create_keypair')
           .asFunction<Ed25519CreateKeypair>();
   ```
   4. 定義一個class，將上述由C 轉成 dart 的 function 的參數轉為一般型別
   ```java
   class Ed25519 {
     // Copy byte array to native heap
     static ffi.Pointer<ffi.Uint8> _bytesToPointer(Uint8List bytes) {
       final length = bytes.lengthInBytes;
       final result = allocate<ffi.Uint8>(count: length);
       for (var i = 0; i < length; ++i) {
         result[i] = bytes[i];
       }
       return result;
     }

     // Creates a 32 byte random seed in seed for key generation. seed must be a writable 32 byte buffer. Returns 0 on success, and nonzero on failure.
     static Uint8List createSeed() {
       final result = allocate<ffi.Uint8>(count: 32);
       int response = ed25519CreateSeed(result);
       print('createSeed response isSucceed: ${response == 0 ? 'true' : 'false'}');
       return result.asTypedList(32);
     }
     //Creates a new key pair from the given seed. public_key must be a writable 32 byte buffer, private_key must be a writable 64 byte buffer and seed must be a 32 byte buffer.
     static KeyPair generateKeyPair(Uint8List seed) {
       final seedPointer = _bytesToPointer(seed);
       final publicKey = allocate<ffi.Uint8>(count: 32);
       final privateKey = allocate<ffi.Uint8>(count: 64);
       ed25519CreateKeypair(publicKey, privateKey, seedPointer);
       free(seedPointer);
       return KeyPair(
         publicKey: publicKey.asTypedList(32),
         privateKey: privateKey.asTypedList(64),
       );
     }
   }
   ```
   5. 要使用上述function的話，即可直接在該檔案中 import '../native_add/native_add.dart';
   ```java
   //++ test C function
    if (this.token.isEmpty) {
      final Uint8List seed = Ed25519.createSeed();
      final keyPair = Ed25519.generateKeyPair(seed);
      Uint8List privateKey = keyPair.privateKey;
      Uint8List publicKey = keyPair.publicKey;
      this.publicKey = publicKey;
      this.privateKey = privateKey;
    }
   ```
   
### 其餘參考文件

[參考資料1: dart-lang/ffi/issues/31](https://github.com/dart-lang/ffi/issues/31)

[參考資料2: Uint8Pointer/asTypedList](https://api.dart.dev/stable/2.7.0/dart-ffi/Uint8Pointer/asTypedList.html)

[參考資料3: ffi/system-command/linux](https://github.com/dart-lang/samples/blob/master/ffi/system-command/linux.dart)

[參考資料4: dart-lang/sdk/issues/35770](https://github.com/dart-lang/sdk/issues/35770)

[參考資料5: flutter-platform-channels-ce7f540a104e](https://medium.com/flutter/flutter-platform-channels-ce7f540a104e)
