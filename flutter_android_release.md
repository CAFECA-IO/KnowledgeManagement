# [Flutter android release note](https://flutter.dev/docs/deployment/android)

### 第一步：簽名 app
如果沒有keystore的話，使用下面的command line生成([] 內的名稱為自訂)
```
keytool -genkey -v -keystore ~/[upload-keystore].jks -keyalg RSA -keysize 2048 -validity 10000 -alias [upload]
```

### 第二步：在app內部制訂使用哪一個keystore
創建一個名為[project]/android/key.properties的文件，其中包含對keystore的引用：
```
storePassword=<password from previous step>
keyPassword=<password from previous step>
keyAlias=upload
storeFile=<location of the key store file, such as /Users/<user name>/upload-keystore.jks>
```

### 第三步：在gradle裡面加入signing的配置
通過編輯[project] /android/app/build.gradle文件，將gradle配置為在發布模式下構建應用程序時使用上載密鑰。
1. 在android塊之前，從屬性文件中添加密鑰庫信息：
```
   buildTypes {
       release {
           // TODO: Add your own signing config for the release build.
           // Signing with the debug keys for now,
           // so `flutter run --release` works.
           signingConfig signingConfigs.debug
       }
   }

```
2. 替換buildTypes塊：
```
   buildTypes {
       release {
           // TODO: Add your own signing config for the release build.
           // Signing with the debug keys for now,
           // so `flutter run --release` works.
           signingConfig signingConfigs.debug
       }
   }

```
使用簽名配置信息：
```
   signingConfigs {
       release {
           keyAlias keystoreProperties['keyAlias']
           keyPassword keystoreProperties['keyPassword']
           storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
           storePassword keystoreProperties['storePassword']
       }
   }
   buildTypes {
       release {
           signingConfig signingConfigs.release
       }
   }

```

上述完成後即可打包app。

### 第四步：
打包app

### 第五步：[上傳金鑰憑證](https://play.google.com/console/u/0/developers/4896765305009695058/app/4974517770901992268/keymanagement)
使用下面的comand line 得到keystore的sha1及sha256
```
keytool -list -v \
-alias key -keystore ~/.android/key.jks
```
把該資訊放到google play console內的設定的應用程式完整性的上傳金鑰憑證。
