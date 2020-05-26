# flutter_C_Interop

## 目標

在 flutter 中使用 C code

## 參考文件
[Binding to native code using dart:ffi](https://flutter.dev/docs/development/platform-integration/c-interop)

### 1. 根據上面提到的文件可以創建flutter的plugin， name：native_add

### 2. Step 2: Add C/C++ sources
You add the sources to the ios folder, because CocoaPods doesn’t allow including sources above the podspec file, but Gradle allows you to point to the ios folder. It’s not required to use the same sources for both iOS and Android; **you may, of course, add Android-specific sources to the android folder and modify CMakeLists.txt appropriately.**

  1. 參考[Android Developer: add C/C++ to your project](https://developer.android.com/studio/projects/add-native-code)可以將    natvie code 放在 Android/src/main/cpp之下。
  
  2. [Success]參考[Android Developer: Create a CMake build script](https://developer.android.com/studio/projects/configure-cmake)用CMakeLists.txt文件來定義應如何編譯native code並將Gradle指向該文件，CMakeLists.txt 放在 android/下面。
  
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
             native-lib

             # Sets the library as a shared library.
             SHARED

             # Provides a relative path to your source file(s).
             src/main/cpp/native-lib.cpp )
  ```
  
  [stackoverflow 上的範例](https://stackoverflow.com/questions/54939099/where-can-i-find-a-working-cmakelists-txt-for-new-android-studio-project-with-ob)
  
```java
# For more information about using CMake with Android Studio, read the
# documentation: https://d.android.com/studio/projects/add-native-code.html

# Sets the minimum version of CMake required to build the native library.

cmake_minimum_required(VERSION 3.4.1)

include_directories(third_party)
include_directories(src/main/cpp/)

# Creates and names a library, sets it as either STATIC
# or SHARED, and provides the relative paths to its source code.
# You can define multiple libraries, and CMake builds them for you.
# Gradle automatically packages shared libraries with your APK.

add_library( # Sets the name of the library.
        audio-native-lib

        # Sets the library as a shared library.
        SHARED

        # Provides a relative path to your source file(s).
        #${audiosupport_sources}
        # main game files
        src/main/cpp/audio-support.cpp
        src/main/cpp/main/AudioPlayer.cpp

        # audio engine
        src/main/cpp/audio/AAssetDataSource.cpp
        src/main/cpp/audio/Player.cpp

        # UI engine
        src/main/cpp/ui/OpenGLFunctions.cpp

        # utility functions
        src/main/cpp/utils/logging.h
        src/main/cpp/utils/UtilityFunctions.cpp
        )


set (TARGET_LIBS log android oboe GLESv2)
MESSAGE(STATUS "Using NDK media extractor")
add_definitions(-DUSE_FFMPEG=0)
target_sources( audio-native-lib PRIVATE src/main/cpp/audio/NDKExtractor.cpp )
set (TARGET_LIBS ${TARGET_LIBS} mediandk)

# Specifies libraries CMake should link to your target library. You
# can link multiple libraries, such as libraries you define in this
# build script, prebuilt third-party libraries, or system libraries.
target_link_libraries( audio-native-lib ${TARGET_LIBS} )

# Set the path to the Oboe directory.
# TODO change this to where you downloaded oboe library
set (OBOE_DIR /Users/MyUser/Documents/repos/android_audio/oboe)
# Add the Oboe library as a subdirectory in your project.
# add_subdirectory tells CMake to look in this directory to
# compile oboe source files using oboe's CMake file.
# ./oboe specifies where the compiled binaries will be stored
add_subdirectory (${OBOE_DIR} ./oboe-bin)



target_compile_options(audio-native-lib
        PRIVATE -std=c++14 -Wall -Werror "$<$<CONFIG:RELEASE>:-Ofast>")
```
  3. add an externalNativeBuild section to android/app/build.gradle. For example:
  
```java
externalNativeBuild {
        // Encapsulates your CMake build configurations.
        cmake {
            // Provides a relative path to your CMake build script.
            path '../CMakeLists.txt'
        }
    }
```

  4. On Android, a dynamically linked library is distributed as a set of .so (ELF) files, one for each architecture. 
在native_add plugin 的7個路徑下的4個檔案夾(arm64-v8a、armeabi-v7a、x86、x86_64)裡面各有一個'.so'檔，共28個。

    1. ./example/build/app/intermediates/merged_native_libs/debug/out
    2. ./example/build/app/intermediates/stripped_native_libs/debug/out
    3. ./example/build/native_add/intermediates/cmake/debug
    4. ./example/build/native_add/intermediates/intermediate-jars/debug
    5. ./example/build/native_add/intermediates/library_and_local_jars_jni
    6. ./example/build/native_add/intermediates/merged_native_libs/debug/out
    7. ./example/build/native_add/intermediates/stripped_native_libs/debug/out
    
    
### 3. Step 3: Load the code using the FFI library
在根據[Binding to native code using dart:ffi](https://flutter.dev/docs/development/platform-integration/c-interop)這份文件創建出來的plugin中實驗：

  1. 直接使用Joshua幫我們compile的libed25519.so
  
  ```java
  final ffi.DynamicLibrary nativeAddLib = Platform.isAndroid
    ? ffi.DynamicLibrary.open("libed25519.so")
    : ffi.DynamicLibrary.process();
  ```
  
  2. 測試使用libed25519.so中的Function
  
  ```java
  final int Function(ffi.Pointer<ffi.Void> x) ed25519CreateSeed = nativeAddLib
    .lookup<ffi.NativeFunction<ffi.Int32 Function(ffi.Pointer<ffi.Void>)>>("ed25519_create_seed")
    .asFunction();
  ```
  
  3. 目前測試結果為失敗，
  
   失敗原因: 
   
   1. dart:ffi 與 dart:core 型別沒有一一對應，[dart:ffi型別](https://api.dart.dev/stable/2.8.2/dart-ffi/dart-ffi-library.html)
   
   2. [在dart中似乎不能使用Pointer]Dart is a garbage collected language which means that Dart objects are not guaranteed to live at a particular memory address as the garbage collector can (and certainly will) move these objects to different memory locations during a garbage collection. 
      
  解決方案: [import dart package ffi](https://pub.dev/packages/ffi#-readme-tab-)
    
   1. [The Uint8List lives in the Dart heap, which is garbage collected, and the objects might be moved around by the garbage collector. So, you'll have to convert it into a pointer into the C heap.](https://github.com/dart-lang/ffi/issues/27)
   
   2. [allocate Func source code](https://github.com/dart-lang/ffi/tree/master/lib/src)
    
  實作方法：
  
  ```java
  import 'dart:ffi' as ffi; // For FFI
  import 'package:ffi/ffi.dart';
  import 'dart:io'; // For Platform.isX

  ffi.Pointer<ffi.Uint8> getPointer(Uint8List buffer) {
    final ffi.Pointer<ffi.Uint8> pointer =
        allocate<ffi.Uint8>(count: buffer.length);
    for (int i = 0; i < buffer.length; i++) {
        pointer[i] = buffer[i];
    }
    pointer.cast<ffi.Void>();
    free(pointer);
    return pointer;
  }

  ```
  
  成功處理轉型後會面對到兩個錯誤：
  
  1. Failed to load dynamic library (dlopen failed: library “libed25519.so” not found) 
  
  2. NoSuchMethodError: The method 'call' was called on nul. Tried calling: call(Pointer<Uint8>: address=0x79880b4e80, Pointer<Uint8>: address=0x798806ff00, Pointer<Uint8>: address=0x79880b4e80)
  
  根據上述描述所面對到問題，決定參考第2步使用cmake自己compile xxx.so檔，但遇到了下列幾個問題，目前已經解決，錯誤原因為CMakeLists.txt寫錯，正確寫法在下面有提到。
  
  1. Execution failed for task ':app:generateJsonModelDebug'. 
    嘗試的解決方案
      1.  brew install cmake && install 
      2. [CMake Error: CMake was unable to find a build program corresponding to "Ninja".]    (https://stackoverflow.com/questions/54500937/cocos2d-x-android-build-failed), [Install ninja on Mac OSX](http://macappstore.org/ninja/)App description: Small build system for use with gyp or CMake
      
  2. Execution failed for task ':app:externalNativeBuildDebug'.
    
相關文件：

CMakeLists.txt
```java
# Sets the minimum version of CMake required to build your native library.
# This ensures that a certain set of CMake features is available to
# your build.

cmake_minimum_required(VERSION 3.4.1)

project(Ed25519)

# set(DIRECTORY ./src/main/cpp/ed25519.h )

# target_include_directories(Ed25519 PRIVATE ${DIRECTORY})

# include_directories(${DIRECTORY})

# add_executable(Ed25519 src/main/cpp/ed25519.h src/main/cpp/key_exchange.c)

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
           ./src/main/cpp/key_exchange.c
           )


# find_package( OpenCV REQUIRED )

# set( sources /src/main/cpp/ed25519.h )

# add_executable( Ed25519 ${sources} )

# target_compile_options( Ed25519 PUBLIC -std=c++11 -fpermissive -w -Wall )

# target_link_libraries( Ed25519 ${OpenCV_LIBS} -L/usr/lib64 -ldl )
  
```
  
Error Message 1

```java
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:generateJsonModelDebug'.
> Build command failed.
Error while executing process /Users/emilyliang/Library/Android/sdk/cmake/3.6.4111459/bin/cmake with arguments {-H/Users/emilyliang/Workspace/TideiSun/FlutterDev/wallet/android/app -B/Users/emilyliang/Workspace/TideiSun/FlutterDev/wallet/android/app/.cxx/cmake/debug/armeabi-v7a -DANDROID_ABI=armeabi-v7a -DANDROID_PLATFORM=android-19 -DCMAKE_LIBRARY_OUTPUT_DIRECTORY=/Users/emilyliang/Workspace/TideiSun/FlutterDev/wallet/build/app/intermediates/cmake/debug/obj/armeabi-v7a -DCMAKE_BUILD_TYPE=Debug -DANDROID_NDK=/Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462 -DCMAKE_TOOLCHAIN_FILE=/Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/build/cmake/android.toolchain.cmake -DCMAKE_MAKE_PROGRAM=/Users/emilyliang/Library/Android/sdk/cmake/3.6.4111459/bin/ninja -GAndroid Gradle - Ninja}
  -- Check for working C compiler: /Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang
  -- Check for working C compiler: /Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang -- works
  -- Detecting C compiler ABI info
  -- Detecting C compiler ABI info - done
  -- Detecting C compile features
  -- Detecting C compile features - done
  -- Check for working CXX compiler: /Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++
  -- Check for working CXX compiler: /Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang++ -- works
  -- Detecting CXX compiler ABI info
  -- Detecting CXX compiler ABI info - done
Launching lib/main.dart on Pixel 3 in debug mode...

FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:generateJsonModelDebug'.
> Build command failed.
  -- Detecting CXX compile features
  -- Detecting CXX compile features - done
  -- Configuring done
  -- Generating done
  -- Build files have been written to: /Users/emilyliang/Workspace/TideiSun/FlutterDev/wallet/android/app/.cxx/cmake/debug/armeabi-v7a

  CMake Error: CMake can not determine linker language for target: ed25519-lib

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

```

Error Message 2

```java
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:externalNativeBuildDebug'.
> Build command failed.
  Error while executing process /Users/emilyliang/Library/Android/sdk/cmake/3.6.4111459/bin/cmake with arguments {--build /Users/emilyliang/Workspace/TideiSun/FlutterDev/wallet/android/app/.cxx/cmake/debug/armeabi-v7a --target ed25519}
  [1/2] Building C object CMakeFiles/ed25519.dir/src/main/cpp/key_exchange.c.o
  [2/2] Linking C shared library /Users/emilyliang/Workspace/TideiSun/FlutterDev/wallet/build/app/intermediates/cmake/debug/obj/armeabi-v7a/libed25519.so
  FAILED: : && /Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/toolchains/llvm/prebuilt/darwin-x86_64/bin/clang  --target=armv7-none-linux-androideabi19 --gcc-toolchain=/Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/toolchains/llvm/prebuilt/darwin-x86_64 --sysroot=/Users/emilyliang/Library/Android/sdk/ndk/21.1.6352462/toolchains/llvm/prebuilt/darwin-x86_64/sysroot -fPIC -g -DANDROID -fdata-sections -ffunction-sections -funwind-tables -fstack-protector-strong -no-canonical-prefixes -D_FORTIFY_SOURCE=2 -march=armv7-a -mthumb -Wformat -Werror=format-security  -O0 -fno-limit-debug-info  -Wl,--exclude-libs,libgcc.a -Wl,--exclude-libs,libgcc_real.a -Wl,--exclude-libs,libatomic.a -static-libstdc++ -Wl,--build-id -Wl,--fatal-warnings -Wl,--exclude-libs,libunwind.a -Wl,--no-undefined -Qunused-arguments -shared -Wl,-soname,libed25519.so -o /Users/emilyliang/Workspace/TideiSun/FlutterDev/wallet/build/app/intermediates/cmake/debug/obj/armeabi-v7a/libed25519.so CMakeFiles/ed25519.dir/src/main/cpp/key_exchange.c.o  -latomic -lm && :
  ...
```


cmake success:
CMakeLists.txt
```java
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
           )

include_directories(src/main/cpp/include/)
```

完成步驟2中的1、2、3步就直接使用flutter run cmake，就會compile出libed25519.so，使用方法如下：

1. 建立一個dart file 用來import native code function（目錄位置不重要）

```java

 ____wallet
   |____lib
     |____native_add
       |____native_add.dart
```

2. open native_add.dart

```java
import 'dart:async';
import 'dart:typed_data';

import 'package:flutter/services.dart';
import 'dart:ffi' as ffi; // For FFI
import 'package:ffi/ffi.dart';
import 'dart:io'; // For Platform.isX


final ffi.DynamicLibrary nativeAddLib = Platform.isAndroid
    ? ffi.DynamicLibrary.open("libed25519.so")
    : ffi.DynamicLibrary.process();

// final int Function(int x, int y) nativeAdd = nativeAddLib
//     .lookup<ffi.NativeFunction<ffi.Int32 Function(ffi.Int32, ffi.Int32)>>("native_add")
//     .asFunction();

ffi.Pointer<ffi.Uint8> getPointer(Uint8List buffer) {
  final ffi.Pointer<ffi.Uint8> pointer =
      allocate<ffi.Uint8>(count: buffer.length);
  for (int i = 0; i < buffer.length; i++) {
    pointer[i] = buffer[i];
  }
  pointer.cast<ffi.Void>();
  free(pointer);
  return pointer;
}

final void Function(ffi.Pointer<ffi.Uint8> publicKey,
        ffi.Pointer<ffi.Uint8> secretKey, ffi.Pointer<ffi.Uint8> seed)
    ed25519CreateKeypair = nativeAddLib
        .lookup<
            ffi.NativeFunction<
                ffi.Void Function(
                    ffi.Pointer<ffi.Uint8>,
                    ffi.Pointer<ffi.Uint8>,
                    ffi.Pointer<ffi.Uint8>)>>("ed25519_create_seed")
        .asFunction();


class NativeAdd {
  static const MethodChannel _channel = const MethodChannel('native_add');

  static Future<String> get platformVersion async {
    final String version = await _channel.invokeMethod('getPlatformVersion');
    return version;
  }
}
```

3. 在models/atwallet.dart中的 handshake function 中 使用 ed25519CreateKeypair function

```java
 // test native code
    print('ed25519CreateKeypair: $ed25519CreateKeypair'); 
    Uint8List publicKey = Uint8List(32);
    Uint8List secretKey = Uint8List(64);
    final Uint8List seed = Uint8List.fromList(hex.decode(
        'c42fe3e3cabbc1fdbef84fe5efa306874ff858d2ef8a60b307f06369feb3fe14'));
    ed25519CreateKeypair(getPointer(publicKey),getPointer(secretKey), getPointer(seed));
    print('handShake ed25519CreateKeypair publicKey: $publicKey');
    print('handShake ed25519CreateKeypair secretKey: $secretKey');
```

result:

```java
I/flutter (30616): ed25519CreateKeypair: Closure: (Pointer<Uint8>, Pointer<Uint8>, Pointer<Uint8>) => void
I/flutter (30616): handShake ed25519CreateKeypair publicKey: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
I/flutter (30616): handShake ed25519CreateKeypair secretKey: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
```
目前遇到的問題為：

1. 傳指標進去ed25519CreateKeypair function，但是對應的value沒有被更新。


https://flutter.dev/docs/development/platform-integration/platform-channels?tab=android-channel-java-tab

https://www.youtube.com/watch?v=X8JD8hHkBMc
