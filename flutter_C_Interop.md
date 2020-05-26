# flutter-plugin

## 目標

在 flutter 中使用 C code

## 參考文件
[Binding to native code using dart:ffi](https://flutter.dev/docs/development/platform-integration/c-interop)

### 1. 根據上面提到的文件可以創建flutter的plugin， name：native_add

### 2. Step 2: Add C/C++ sources
You add the sources to the ios folder, because CocoaPods doesn’t allow including sources above the podspec file, but Gradle allows you to point to the ios folder. It’s not required to use the same sources for both iOS and Android; **you may, of course, add Android-specific sources to the android folder and modify CMakeLists.txt appropriately.**

  1. 參考[Android Developer: add C/C++ to your project](https://developer.android.com/studio/projects/add-native-code)可以將    natvie code 放在 Android/src/main/cpp之下。
  
  2. [還未實驗]參考[Android Developer: Create a CMake build script](https://developer.android.com/studio/projects/configure-cmake)用CMakeLists.txt文件來定義應如何編譯native code並將Gradle指向該文件
  
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


  3. On Android, a dynamically linked library is distributed as a set of .so (ELF) files, one for each architecture. 
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
  
   失敗原因：
   
   1. dart:ffi 與 dart:core 型別沒有一一對應，[dart:ffi型別](https://api.dart.dev/stable/2.8.2/dart-ffi/dart-ffi-library.html)
   
   2. [在dart中似乎不能使用Pointer]Dart is a garbage collected language which means that Dart objects are not guaranteed to live at a particular memory address as the garbage collector can (and certainly will) move these objects to different memory locations during a garbage collection. 
      
   可能的解決方案
    
   1. [The Uint8List lives in the Dart heap, which is garbage collected, and the objects might be moved around by the garbage collector. So, you'll have to convert it into a pointer into the C heap.](https://github.com/dart-lang/ffi/issues/27)
    
  ```java
      Uint8List list;
      final pointer = allocate<Uint8>(count: list.length());
      for(int i = 0, ...){
        pointer[i] = list[i];
      }
      final voidStar = pointer.cast<Void>();
      // function call
      free(pointer);
  ```
    
