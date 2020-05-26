# flutter-plugin

## 目標

在 flutter 中使用 C code

## 參考文件
[Binding to native code using dart:ffi](https://flutter.dev/docs/development/platform-integration/c-interop)

### 1. 根據上面提到的文件可以創建flutter的plugin， name：native_add

### 2. Step 2: Add C/C++ sources
You add the sources to the ios folder, because CocoaPods doesn’t allow including sources above the podspec file, but Gradle allows you to point to the ios folder. It’s not required to use the same sources for both iOS and Android; **you may, of course, add Android-specific sources to the android folder and modify CMakeLists.txt appropriately.**

  1. 參考[Android Developer: add C/C++ to your project](https://developer.android.com/studio/projects/add-native-code)可以將    natvie code 放在 Android/src/main/cpp之下。
  2. 參考[Android Developer: Create a CMake build script](https://developer.android.com/studio/projects/configure-cmake)用CMakeLists.txt文件來定義應如何編譯native code並將Gradle指向該文件

  ？. On Android, a dynamically linked library is distributed as a set of .so (ELF) files, one for each architecture. 
在native_add plugin 的7個路徑下的4個檔案夾(arm64-v8a、armeabi-v7a、x86、x86_64)裡面各有一個'.so'檔，共28個。

    1. ./example/build/app/intermediates/merged_native_libs/debug/out
    2. ./example/build/app/intermediates/stripped_native_libs/debug/out
    3. ./example/build/native_add/intermediates/cmake/debug
    4. ./example/build/native_add/intermediates/intermediate-jars/debug
    5. ./example/build/native_add/intermediates/library_and_local_jars_jni
    6. ./example/build/native_add/intermediates/merged_native_libs/debug/out
    7. ./example/build/native_add/intermediates/stripped_native_libs/debug/out
    
    
### 3. Step 3: Load the code using the FFI library
在根據[Binding to native code using dart:ffi](https://flutter.dev/docs/development/platform-integration/c-interop)這份文件創建出來
  
