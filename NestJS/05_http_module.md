## 使用 HttpModule 
使用 httpModule 串接第三方的 API
### 安裝
```shell!
npm i --save @nestjs/axios axios
```
### 在 module 中導入
以 tickers.module.ts 為例，將 HttpModule 導入：
```typescript!
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TickersController } from './tickers.controller';
import { TickersService } from './tickers.service';

@Module({
  imports: [HttpModule],
  controllers: [TickersController],
  providers: [TickersService],
})
export class TickersModule {}

```
在導入中也可以使用用 config：
```typescript!
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TickersController } from './tickers.controller';
import { TickersService } from './tickers.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import MarketConfigFactory from 'src/config/market.config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: 'development.env',
      load: [MarketConfigFactory],
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TickersController],
  providers: [TickersService],
})
export class TickersModule {}
```
在 development.env 中設定 HTTP_TIMEOUT、HTTP_MAX_REDIRECTS
```env!
HTTP_TIMEOUT=5000
HTTP_MAX_REDIRECTS=5
```
### 在 Module 使用的 Provider 也就是 Service 中使用
以 tickers.service.ts 為例
```typescript!
@Injectable()
export class TickersService {
  constructor(private readonly httpService: HttpService) {}
  
  async listTickers(): Promise<Tickers[]> {
    const url = 'https://staging-001.tidebit.network/api/v1/market/tickers'
    const { data } = await firstValueFrom(
        this.httpService.get(url)
        .pipe(
            catchError((error: AxiosError) => {
              this.logger.error(error.response.data);
              throw 'An error happened!';
            }),
        ),
    );
    return data;
  }
}
```
