# flutter-plugin

## 目標

使用 dart 呼叫 kotlin code

https://flutter.dev/docs/development/platform-integration/platform-channels?tab=android-channel-java-tab

## 環境

1. 安裝 android studio

2. 安裝 flutter plugin

    在開啟專案介面右下角 Configure > Plugins，搜尋 flutter 後安裝即可

3. 新增 flutter-plugin 檔

    按 Start a new Flutter project > Flutter Plugin，後就會產出範例程式碼

## 解析

### 通過 MethodChannel 可以將資料從 dart, client 端間互相傳輸

![platform channels](https://flutter.dev/images/PlatformChannels.png)

以下範例以 Ed25519 為專案名稱

ed25519.dart

```java
// 建立 channel
static const MethodChannel _channel = const MethodChannel('ed25519');  
```

### 然後通過 invokeMethod 呼叫 channel 上自定義的 function 和參數

ed25519.dart

```java
// 建立 channel
static Future<String> get platformVersion async {
    var peerPubKey = hex.decode("818c0ee2aca3db00cb7602b6253e34fd003439e0ad6787378e4811d86a0da7f1");
    var privateKey = hex.decode("b3bbd391d3e72dde456459246f79023d1a079abb4a664c3e4be01ff2ffcfd5195f65d12b7c2c21b988b119f6fae157941b8884a3cbe309a7788db71c407c137d");

    final String version = await _channel.invokeMethod('getPlatformVersion',{
      "peerPubKey": peerPubKey,
      "privateKey": privateKey,
    });
    return version;
  }
```

### 接著看到 kotlin 的 code，建立一樣的 channel

並建立 listener setMethodCallHandler，接著再聽到呼叫的 function 名稱時要做的邏輯

Ed25519Plugin.kt

```java
public class Ed25519Plugin: FlutterPlugin, MethodCallHandler {

  ...
  
  companion object {
    fun registerWith(registrar: Registrar) {
      val channel = MethodChannel(registrar.messenger(), "ed25519")
      channel.setMethodCallHandler(Ed25519Plugin())
    }
  }

   override fun onMethodCall(call: MethodCall, result: Result) {
    if (call.method == "getPlatformVersion") {
      val peerPubKey = call.argument<ByteArray>("peerPubKey")
      val privateKey = call.argument<ByteArray>("privateKey")

      println("peerPubKey: ${peerPubKey}")
      println("privateKey: ${privateKey}")

      result.success("Android ${android.os.Build.VERSION.RELEASE}")
    } else {
      result.notImplemented()
    }
  }

  ...

}
```

### 在 kotlin 中引入第三方套件

範例程式預設使用的套檢管理系統為 grandle，原先也是採用這個方式拉第三方套件進來，都試過很多次都無法識別第三方套件的函式庫

因此最後是直接將第三方套件的 code 複製到 Ed25519Plugin.kt 同個目錄，再將第三方套件手動 import 進來

### 第三方套件遇到的問題

1. kotlin 型態轉換

    因為測試用函式庫 sharedKey function 吃的參數為 IntArray，所以採用下面方法把 Uint8List -> IntArray

    ```java
    val peerPubKeyIntBuf = ByteBuffer.wrap(peerPubKey)
            .order(ByteOrder.BIG_ENDIAN)
            .asIntBuffer()
    val peerPubKeyInt = IntArray(peerPubKeyIntBuf.remaining())
    peerPubKeyIntBuf[peerPubKeyInt]

    val privateKeyIntBuf = ByteBuffer.wrap(privateKey)
            .order(ByteOrder.BIG_ENDIAN)
            .asIntBuffer()
    val privateKeyInt = IntArray(privateKeyIntBuf.remaining())
    ```

    但還沒驗證其正確性（因該說也還不知道怎麼驗證，kotlin 不熟

2. 還沒確定函式庫是否能用

    https://github.com/miguelsandro/curve25519-kotlin

    測試進行到一半，還沒有成功將參數塞進 sharedKey function
    









