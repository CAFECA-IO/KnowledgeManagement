## 參考
- [Upload objects from a filesystem 官網](https://cloud.google.com/storage/docs/uploading-objects)
- [Make data public](https://cloud.google.com/storage/docs/access-control/making-data-public#storage-make-bucket-public-nodejs)
- [Google官方storage 套件](https://github.com/googleapis/nodejs-storage)
- [Cross-origin resource sharing (CORS)](https://cloud.google.com/storage/docs/cross-origin)

# 目錄

# 1. 新增專案
- 連結：
	- [Google Console Cloud](https://console.cloud.google.com/)

先進入[Google Console Cloud](https://console.cloud.google.com/)，在這裡新增一個專案(由於這邊已經存在一個專案，畫面可能不太一樣)

- 點左上角的專案區

![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午1.58.17.png)

- 然後選擇專案名稱，如果公司有付費可以選擇機構

![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午1.48.45.png)

- 進入這個畫面就成功了
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.00.13.png)

# 2. IAM 權限管理

要從nodejs 上傳圖片，我們需要有一個service account（服務帳戶），他可以賦予程式特定幾組GCP的權限，並使用金鑰或其他方式認證。

- 點選下面的 `IAM與管理`
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.04.36.png)

- 點選左邊的服務帳戶 => 建立服務帳戶
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.19.29.png)

- 給這個帳號一個名字
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.23.04.png)

- 給他Cloud Storage往下的 `Storage`管理員、`Storage`物件使用者這兩個權限其中一個
	- `Storage`管理員: 權限比較大，可以上傳檔案，還可以將檔案存取狀態設定成`Public`，如果在`值區(Bucket)`中選擇 **精細**調整存取權限的話，建議選此
	- `Storage`物件使用者：權限不包含將檔案存取狀態設定成`Public`，因此在`值區(Bucket)`中需要統一把整個Bucket的存取權限設定為公開，外部人員才看得到圖片。
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.24.11.png)

- 接著按下完成(角色只要選其中一個就好)
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.24.58.png)

# 3. 新建一個值區(Bucket)
接著要建立一個`值區(Bucket)`，它和 Amazon S3很像，都是一個存放檔案的地方。

- 回到主畫面，點擊左下角`Cloud Storage` 
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.41.49.png)

- 進入值區，點擊建立
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.46.20.png)

- 取一個名字
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.49.16.png)

- 選一個儲存位置，可以單選台灣，速度很快，如果有減碳需求可以選擇低二氧化碳標示的地區
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.51.03.png)

- 預設級別有四種，依照多常存取而區分不同的收費，standard的最貴。如果不確定可以選擇 `Autoclass`，如果有資料不常被存取，可以運許物件切換到 Coldline 和 Archive
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.52.37.png)

- 設定存取權，先取消禁止公開存取(因為我的檔案是要供外界讀取)，並建議選擇`精細`，我們可以用 google 提供的[nodejs-storage](https://github.com/googleapis/nodejs-storage)逐一修改檔案的公開狀態(需要搭配擁有`Storage`管理員 角色的Service Account)
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.53.30.png)

- 自後的資料保護可以自己選擇，然後按下建立
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.54.13.png)

# 4. 生成Service Account 金鑰
我們需要Service Account的金鑰才能讓`nodejs`與storage 溝通 
- 回到主畫面 `IAM與管理`
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午2.04.36.png)

- 點選剛剛建立的服務帳戶=>管理金鑰
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午3.13.29.png)

- 點選新增金鑰
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午3.14.58.png)

- 點選`json`格式
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午3.15.51.png)

建立之後會下載一個金鑰如：`專案id-xxxxxxxxxxxx.json`

內容如下，接著會在程式碼中使用
```json
{
  "type": "service_account",
  "project_id": "",
  "private_key_id": "",
  "private_key": "",
  "client_email": "",
  "client_id": "",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "",
  "universe_domain": "googleapis.com"
}
```

# 5. 於後端實作上傳功能

> 以下解說參考下兩個google官網
- [Upload objects from a filesystem](https://cloud.google.com/storage/docs/uploading-objects)
- [Make data public](https://cloud.google.com/storage/docs/access-control/making-data-public#storage-make-bucket-public-nodejs)

>這裡使用直接將本地檔案上傳的方法，因此建議使用如 [formidable](https://www.npmjs.com/package/formidable)、[multer](https://www.npmjs.com/package/multer) 等會將前端傳入的檔案先存在本地端 /tmp 資料夾的套件

- 先安裝 **[nodejs-storage](https://github.com/googleapis/nodejs-storage)** 套件
```
npm install @google-cloud/storage
```

## `google_setting.ts`
- 建立一個 `google_setting.ts`，程式碼如下，於後面解說。
```ts
// Ref: https://cloud.google.com/storage/docs/uploading-objects#storage-upload-object-client-libraries
import { Storage } from "@google-cloud/storage";

export const googleStorage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY || '{}'),
});

export const googleBucket = googleStorage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME || '');

export function uploadGoogleFile(filePath: string, destFileName: string, generationMatchPrecondition: number) {
  const options = {
    destination: destFileName,
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
  };
  const url = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET_NAME ?  process.env.GOOGLE_STORAGE_BUCKET_NAME + '/': ''}${destFileName}`;
  
  return async function uploadFile() {
    await googleBucket.upload(filePath, options);
    await googleBucket.file(destFileName).makePublic()
    return url;
  }
}
```

>首先是建立 storage object
```ts
import { Storage } from "@google-cloud/storage";

export const googleStorage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY || '{}'),
});
```

`projectId`可以在 主畫面中得到，放在`.env`中可以保護你的id
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午3.43.09.png)

storage認證的方法有兩種
- `keyFilename`:直接讀取金鑰json的存放位置來取得金鑰
- `credentials`:當程式中有金鑰`json`可以取用時，可直接貼入

使用 `keyFilename`認證，需要先把金鑰json檔案放在專案內，然後把路徑傳給`Storage`
```ts
export const googleStorage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  keyFilename:('/path/to/your/keyfile.json')
});
```

使用`credentials`的方法，可以先將金鑰用 `JSON.stringfy()`的方法轉成字串，並手動複製到`.env`裡面，字串前後可加引號 `GOOGLE_SERVICE='{JSON 文字}'`(但是部署之後建議把部署環境的引號刪除)
```ts
export const googleStorage = new Storage({
  projectId: process.env.GOOGLE_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_KEY || '{}'),
});
```

>建立 Bucket

```ts
export const googleBucket = googleStorage.bucket(process.env.GOOGLE_STORAGE_BUCKET_NAME || '');
```

用 `Storage`向下建立`bucket`，並傳入你想上傳的`值區(Bucket)`的名稱，名稱可以從`Cloud storage`中找到，我將名稱存放在 `.env`裏面

- 進入Cloud storage，點擊你的Bucket
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午3.53.29.png)

- 複製Bucket 名稱，另外可以先建立資料夾(不一定需要建立)
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午3.54.45.png)

> 產生上傳用function

這邊我使用閉包寫法，輸入argument如下
- `filePath`:要上傳檔案的本地存放path
- `destFileName`：要上傳的檔案位置與名稱，像是我想要上傳到`km`這個資料夾，就寫成`km/檔案名稱`，如果直接存放在`Bucket`的root ，傳入`檔案名稱`就可以了
- `generationMatchPrecondition`：處理同時上傳檔案時會發生的[race conditions](https://en.wikipedia.org/wiki/Race_condition#File_systems)，可以看[這裡](https://cloud.google.com/storage/docs/request-preconditions)的說明，不一定要加，如果加了，第一次上傳時設為0就好

```ts
export function uploadGoogleFile(filePath: string, destFileName: string, generationMatchPrecondition: number) {
  const options = {
    destination: destFileName,
    preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
  };

  const url = `https://storage.googleapis.com/${process.env.GOOGLE_STORAGE_BUCKET_NAME ?  process.env.GOOGLE_STORAGE_BUCKET_NAME + '/': ''}${destFileName}`;
  
  return async function uploadFile() {
    await googleBucket.upload(filePath, options);
    await googleBucket.file(destFileName).makePublic()
    return url;
  }
}
```

上傳完成之後，要從外界觀看上傳的檔案的話，url固定如下，因此可以寫死並回傳
```ts
const url = `https://storage.googleapis.com/${Bucket 名稱}/${檔案路徑＋檔案名稱}`;
```

最後會產生一個我們真正會使用的function
- `upload`: 把檔案上傳
- `makePublic`：將檔案設成公開，這裡需要`Bucket`的公開存取設定為**精確**才可以使用
```typescript
  return async function uploadFile() {
    await googleBucket.upload(filePath, options);
    await googleBucket.file(destFileName).makePublic()
    return url;
  }
```

## `google_drive_upload.ts`

接著實作上傳功能，這邊假定是使用 `formidable`傳入一個 `formidable.File`的 file檔(注意並不是node 原生的 `File` type)，但其實只要能夠取得想要上傳檔案的存放位置，就可以使用。

程式碼如下：
- `fileName`:我使用`uuid`產生唯一值uuid名稱避免撞名，並使用`mime-types`產生`File`的副檔名，但這些不是必須，可以隨意給一個名稱
- `storePath`: 將`fileName`與我想上傳的資料夾名稱結合，如果存放在根目錄，直接使用`fileName`就好
- `uploadGoogleFile`：產生一個可上傳的function, 傳入
	- 本地端檔案位置
	- 要存放到哪裡
	- 0 (在可以確定不會有[race conditions](https://en.wikipedia.org/wiki/Race_condition#File_systems)時使用)
- `uploadToGoogle`: 上傳圖片並回傳上傳後的url，將這個url傳給前端，再經過下方CORS的設定就可以正常顯示在畫面了

```ts
// Reference:
// https://stackoverflow.com/questions/72864657/hosting-pictures-with-react-and-google-drive
// https://github.com/googleapis/google-api-nodejs-client#readme

import { File } from 'formidable';
import { uploadGoogleFile } from './google_setting';
import {v4 as uuidv4} from 'uuid';
import mime from 'mime-types';

export default async function googleDriveUpload(file: File) {

  try {
    const fileName = `${uuidv4()}.${mime.extension(file.mimetype || 'application/octet-stream')}`;
    const storePath = `km/${fileName}`;

    const uploadToGoogle = uploadGoogleFile(file.filepath, storePath, 0);
    const url = await uploadToGoogle();
    return url;
  }catch(e){
    throw e;
  }
}
```


## 備註：Google原始推薦的程式碼
### Upload objects from a filesystem
```js
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The path to your file to upload
// const filePath = 'path/to/your/file';

// The new ID for your GCS file
// const destFileName = 'your-new-file-name';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function uploadFile() {
  const options = {
    destination: destFileName,
    // Optional:
    // Set a generation-match precondition to avoid potential race conditions
    // and data corruptions. The request to upload is aborted if the object's
    // generation number does not match your precondition. For a destination
    // object that does not yet exist, set the ifGenerationMatch precondition to 0
    // If the destination object already exists in your bucket, set instead a
    // generation-match precondition using its generation number.
    preconditionOpts: {ifGenerationMatch: generationMatchPrecondition},
  };

  await storage.bucket(bucketName).upload(filePath, options);
  console.log(`${filePath} uploaded to ${bucketName}`);
}

uploadFile().catch(console.error);
```

### Make Public
```js
/**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
// The ID of your GCS bucket
// const bucketName = 'your-unique-bucket-name';

// The ID of your GCS file
// const fileName = 'your-file-name';

// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');

// Creates a client
const storage = new Storage();

async function makePublic() {
  await storage.bucket(bucketName).file(fileName).makePublic();

  console.log(`gs://${bucketName}/${fileName} is now public.`);
}

makePublic().catch(console.error);
```
# CORS

如果剛剛成功將url產出，你會發現前端網頁無法正常顯示，這是因為Google會限制可以存取他的資源的網站，我們可以用Cloud Shell設定 (注意：這裡的CORS並不是本地專案後端的問題)

- 在主畫面搜尋 `Cloud Shell`
![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午4.31.18.png)

- 新增 `cors.json`檔案，並輸入下方資訊(檔案位置可以隨意，只要cd進該資料夾就可以)
```
 [
    {
      "origin": ["*"]
    }
]
```

輸入以下指令
```
gsutil cors set ./cors.json gs://你的Bucket名稱
```

這樣就能正確上傳檔案了

![](./GCP%20上傳圖片的方法.md_Attachments/截圖%202024-03-01%20下午1.35.14%201.png)
