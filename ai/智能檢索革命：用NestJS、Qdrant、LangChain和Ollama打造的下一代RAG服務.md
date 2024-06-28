# 智能檢索革命：用NestJS、Qdrant、LangChain和Ollama打造的下一代RAG服務

## 1. 介紹

**目標**：
在這篇教學文章中，我們將逐步建立一個基於 NestJS 的 API 伺服器，使用 Qdrant 作為向量存儲，並利用 LangChain 和 Ollama 建立一個檢索增強生成（RAG）服務。

**應用場景**：
這個 RAG 服務可以應用於多種自然語言處理（NLP）場景，如聊天機器人、智慧客服等。

**參考流程**

![image](https://github.com/CAFECA-IO/KnowledgeManagement/assets/123862185/2ba70f8b-f712-443c-bb60-2044a3086e29)

credit: [AWS](https://aws.amazon.com/tw/what-is/retrieval-augmented-generation/)


## 2. 準備工作

**環境設置**：
1. **安裝 Node.js 與 npm**：
   前往 [Node.js 官網](https://nodejs.org/)下載並安裝最新版本的 Node.js，這將自動安裝 npm。
   
2. **安裝 NestJS CLI**：
   在命令行中運行以下命令以全局安裝 NestJS CLI：
   ```bash
   npm install -g @nestjs/cli
   ```

3. **安裝相關依賴庫**：
   在開始之前，我們需要安裝一些必要的 npm 包。請確保在項目目錄中運行以下命令：
   ```bash
    npm install @nestjs/common @nestjs/core @nestjs/platform-express reflect-metadata rxjs
    npm install @langchain/qdrant @langchain/community

   ```

4. **用 Docker 建立 Qdrant 服務**：
   安裝 Docker 後，在命令行中運行以下命令以啟動 Qdrant 容器：
   ```bash
   docker run -d --name qdrant -p 6333:6333 -v /qdrant_data:/data qdrant/qdrant
   ```
5. **以 Docker 建立 ollama 服務**
```bash
docker run --name ollama -d --gpus=all -v ollama:/root/.ollama -p 11434:11434 ollama/ollama
```

6. 下載 ollama 模型
```bash
docker exec -it ollama ollama run nomic-embed-text && docker exec -it ollama ollama run llama3
```

## 3. 建立 NestJS 項目

**初始化 NestJS 項目**：
1. 使用 NestJS CLI 創建新項目：
   ```bash
   nest new rag-service
   ```
   選擇 `npm` 作為包管理器。

2. 項目結構介紹：
   NestJS 項目默認結構如下：
   ```
   src/
     app.controller.ts
     app.module.ts
     app.service.ts
     main.ts
   ```
### 4. 利用 Ollama 建立語言模型

#### 創建 Ollama Service

接下來，在你的 NestJS 專案中創建 Ollama 服務。

1. **創建 Ollama 服務**

在專案中相關的目錄中創建 Ollama 服務。

#### 文件結構示例：

```plaintext
src/
└── ollama/
    ├── ollama.module.ts
    ├── ollama.service.ts
```

2. **編寫 Ollama 模組**

在 `ollama.module.ts` 中定義並導出 Ollama 模組，同時導入相關的依賴模組。

```typescript
// ollama.module.ts
import { Module } from '@nestjs/common';
import { OllamaService } from './ollama.service';

@Module({
  providers: [OllamaService],
  exports: [OllamaService],
})
export class OllamaModule {}
```

3. **編寫 Ollama 服務**

在 `ollama.service.ts` 中實現 Ollama 相關的服務，利用 LangChain 函數來建立 RAG 模型。

```typescript
// ollama.service.ts
import { Injectable } from '@nestjs/common';
import { ChatOllama, OllamaEmbeddings } from '@langchain/community';
import { createStuffDocumentsChain } from '@/libs/lang_chain/functions'; // 導入 LangChain 函數
import { ChatPromptTemplate } from '@langchain/community/templates';
import {
  AUDIT_REPORT_TEMPLATE,
  MAX_CONCURRENCY,
} from '@/constants/configs/config';

@Injectable()
export class OllamaService {
  public llama3: ChatOllama;
  public nomicEmbedding: OllamaEmbeddings;

  constructor() {
    this.llama3 = new ChatOllama({
      baseUrl: 'localhost:11434', // 默認值
      model: 'llama3', // 默認值
      format: 'json', // 輸出格式
    });

    this.nomicEmbedding = new OllamaEmbeddings({
      baseUrl: 'localhost:11434', // 默認值
      model: 'nomic-embed-text', // 可從模型列表中提取
      maxConcurrency: MAX_CONCURRENCY,
    });
  }
}
```

## 5. 整合 Qdrant 向量存儲

**安裝與配置 Qdrant**：
1. Qdrant 簡介：
   Qdrant 是一個高效的向量存儲和檢索系統，適合用於構建高性能的檢索系統。

### 文件處理模組（File_process Module）

文件處理模組負責處理上傳的文件，例如處理 PDF 文件並將其分割成文檔。

#### 1. 建立文件處理模組

在你的 NestJS 專案中建立文件處理模組。

#### 文件結構示例：

```plaintext
src/
└── file_process/
    ├── file_process.module.ts
    ├── file_process.service.ts
```

#### 2. 編寫文件處理模組

在 `file_process.module.ts` 中定義並導出文件處理模組。

```typescript
// file.module.ts
import { Module } from '@nestjs/common';
import { FileProcessService } from './file_process.service';

@Module({
  providers: [FileProcessService],
  exports: [FileProcessService],
})
export class FileProcessModule {}

```

#### 3. 編寫文件處理服務（File Service）

在 `file_process.service.ts` 中實現文件處理服務，例如處理 PDF 文件並將其分割成文檔。

```typescript
import { Injectable } from '@nestjs/common';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

@Injectable()
export class FileProcessService {
  async processPDFFile(filePath: string) {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter();
    return splitter.splitDocuments(docs);
  }
}
```

### Qdrant 模組引入文件處理模組

將文件處理模組引入到 Qdrant 模組中，以便在 Qdrant 模組中使用文件處理服務來處理上傳的文件並將其存儲到 Qdrant 中。

#### 1. 建立 Qdrant 模組

在 Qdrant 相關的目錄中建立 Qdrant 模組。

#### 文件結構示例：

```plaintext
src/
└── qdrant/
    ├── qdrant.module.ts
    ├── qdrant.service.ts
```

#### 2. 編寫 Qdrant 模組

在 `qdrant.module.ts` 中定義並導出 Qdrant 模組，同時導入文件處理模組。

```typescript
// qdrant.module.ts
import { Module } from '@nestjs/common';
import { QdrantService } from './qdrant.service';
import { FileModule } from '@/file/file.module'; // 導入文件處理模組

@Module({
  imports: [FileModule, OllamaModule], // 導入文件處理模組, Ollama 模組
  providers: [QdrantService],
  exports: [QdrantService],
})
export class QdrantModule {}
```

#### 3. 編寫 Qdrant 服務

在 `qdrant.service.ts` 中實現 Qdrant 相關的服務，並使用文件處理服務來處理上傳的文件並將其存儲到 Qdrant 中。

```typescript
// qdrant.service.ts
import { Injectable } from '@nestjs/common';
import { QdrantVectorStore } from '@langchain/qdrant';
import { FileProcessService } from '../file_process/file_process.service';
import { QDRANT_COLLECTION_NAME } from '@/constants/configs/config';
import { OllamaService } from '../ollama/ollama.service';

@Injectable()
export class QdrantService {
  private QDRANT_HOST = process.env.QDRANT_HOST; // 需更換為您的 Qdrant 主機地址
  private vectorStore: QdrantVectorStore;

  constructor(
    private readonly fileProcessService: FileProcessService,
    private readonly ollamaService: OllamaService,
  ) {
    // 調用異步方法初始化 vectorStore
    this.initializeVectorStore();
  }

  private async initializeVectorStore() {
    // 可以替換為您的Embedding模型
    try {
      this.vectorStore = await QdrantVectorStore.fromExistingCollection(
        this.ollamaService.nomicEmbedding,
        {
          url: this.QDRANT_HOST, // 需更換為您的 Qdrant 主機地址
          collectionName: QDRANT_COLLECTION_NAME, // 集合名稱
        },
      );
      return this.vectorStore;
    } catch (error) {
      return null;
    }
  }

  async create(filePath: string) {
    let success = false;
    const splitDocs = await this.fileProcessService.processPDFFile(filePath);

    // 存儲到 Qdrant 中
    if (this.vectorStore) {
      this.vectorStore.addDocuments(splitDocs);
      success = true;
    } else {
      success = false;
    }
    return success;
  }
}
```

### 6. 架構 RAG 流程

1. 建立 RAG 相關目錄
在你的 NestJS 專案中建立 RAG 相關目錄。

文件結構示例：
```plaintext
src/
└── rag/
    ├── rag.module.ts
    ├── rag.service.ts
```
2. 編寫 RAG 模組
在 rag.module.ts 中定義並導出 RAG 模組。

```typescript
// rag.module.ts
import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { QdrantModule } from '../qdrant/qdrant.module'; // 導入 Qdrant 模組
import { OllamaModule } from '../ollama/ollama.module'; // 導入 Ollama 模組

@Module({
  imports: [QdrantModule, OllamaModule], // 導入 Qdrant 模組, Ollama 模組
  providers: [RagService],
  exports: [RagService],
})
export class RagModule {}
```
3. 編寫 RAG 服務
在 rag.service.ts 中實現 RAG 相關的服務，並使用 Qdrant 服務和 Ollama 服務來實現檢索增強生成。

```typescript
// rag.service.ts
import { Injectable } from '@nestjs/common';
import { QdrantService } from '../qdrant/qdrant.service';
import { OllamaService } from '../ollama/ollama.service';
import { createStuffDocumentsChain } from '@/libs/lang_chain/functions'; // 導入 LangChain 函數
import { ChatPromptTemplate } from '@langchain/community/templates';
import { AUDIT_REPORT_TEMPLATE } from '@/constants/configs/config';

@Injectable()
export class RagService {
  constructor(
    private readonly qdrantService: QdrantService,
    private readonly ollamaService: OllamaService,
  ) {}

  async generateResponse(query: string): Promise<string> {
   const WEATHER_EXPERT_TEMPLATE = `
你是一位專業且有禮貌的氣象專家，請根據提供的內容以繁體中文回答問題，且只回答氣象相關問題：

<context>
{context}
</context>

問題如下: {input}

回傳請用以下JSON格式：
{{  
  "問題": "{input}",
  "答案": "根據{input}的問題參考{context}內容的回答",
  "不確定的部分": "如果有不確定的部分，請註明",
  "參考資料": "context中metadata裡的參考資料",
}}
`; 
    const prompt = ChatPromptTemplate.fromTemplate(PROMPT_TEMPLATE);// 使用模板
    const retriever = await this.qdrantService.vectorStore.asRetriever();
    const documentChain = await createStuffDocumentsChain({
      llm: this.ollamaService.llama3,
      prompt,
    });
    const retrievalChain = await createRetrievalChain({
      combineDocsChain: documentChain,
      retriever,
    });
    const result = await retrievalChain.invoke({
      input: question,
    });
    const { answer } = result;
    return answer;
  }
}
```

### 7. 構建 API 端點

**設計 API 路由**：

1. **定義路由與控制器**：

在 `app.module.ts` 中引入 `RagController`：

```typescript
import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { RagModule } from './api/rag/rag.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports:[RagModule],
})
export class AppModule {}
```

2. **設置主要 API 端點（如檢索、生成）**：

在 `rag.controller.ts` 中設置 `/rag` 路由：

```typescript
// rag.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('rag')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('generate-report')
  async generateReport(@Body('question') question: string): Promise<any> {
    const answer = await this.ragService.generateReport(question);
    return { answer };
  }
}

```

3. **修改 RAG 模組** :
在 rag.module.ts 中定義並導出 RAG 模組。

```typescript
// rag.module.ts
import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { QdrantModule } from '../qdrant/qdrant.module';
import { OllamaModule } from '../ollama/ollama.module';

@Module({
  imports: [QdrantModule, OllamaModule],
  providers: [RagService],
  exports: [RagService],
  controllers: [RagController], // 添加控制器
})
export class RagModule {}
```

## 8. 結論

恭喜你！你已成功構建了一個基於 NestJS 的 API 伺服器，使用 Qdrant 作為向量存儲，並利用 LangChain 和 Ollama 建立了一個檢索增強生成（RAG）服務。

這個系統將文本檔轉化為向量，並通過檢索相似向量來增強生成的回答，適用於各種自然語言處理（NLP）應用場景，如智能客服、知識管理等。

希望這個教學能夠幫助你更好地理解和實現 RAG 服務。如果有任何問題或建議，歡迎在下方留言或聯繫我。

**未來改進方向**：
- 優化檢索和生成模型的性能。
- 增加更多數據預處理和清洗步驟。
- 擴展 RAG 模型以支持更多應用場景。

**進一步閱讀**：
- [NestJS 官方文檔](https://docs.nestjs.com/)
- [Qdrant 官方文檔](https://qdrant.tech/documentation/)
- [LangChain 官方文檔](https://langchain.com/docs/)
- [Ollama 官方文檔](https://ollama.com/docs/)

