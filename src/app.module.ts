import {
  MiddlewareConsumer,
  Module,
  NestModule,
  ValidationPipe,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookEntity } from './modules/book/entities/book.entity';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { GeneralQueryEntity } from './modules/book/entities/generalQuery.entity';
import { HostlistEntity } from './modules/hostlist/entities/hostlist.entity';
import { GoogleDMCALinkEntity } from './modules/google/entities/googledmcalink.entity';
import { GoogleDMCAListEntity } from './modules/google/entities/googledmcalist.entity';
import { BookModule } from './modules/book/book.module';
import { HostlistModule } from './modules/hostlist/hostlist.module';
import { GoogleDMCAModule } from './modules/google/googledmca.module';
import { BingDMCAModule } from './modules/bing/bingdmca.module';
import { RequestLoggerMiddleware } from './middlewares/accesslog.middleware';
import { GoogleAccountEntity } from './modules/google/entities/googleaccount.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'dmca',
      password: '123@dmca',
      synchronize: true,
      entities: [
        BookEntity,
        GeneralQueryEntity,
        HostlistEntity,
        GoogleAccountEntity,
        GoogleDMCALinkEntity,
        GoogleDMCAListEntity,
      ],
    }),
    BookModule,
    HostlistModule,
    GoogleDMCAModule,
    BingDMCAModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_PIPE, useClass: ValidationPipe },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
