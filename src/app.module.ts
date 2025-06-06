import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DmcaModule } from './dmca/dmca.module';
import { BookEntity } from './dmca/entities/book.entity';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { GeneralQueryEntity } from './dmca/entities/generalQuery.entity';
import { DomainListEntity } from './dmca/entities/domainlist';
import { DMCALinkEntity } from './dmca/entities/dmcalink.entity';
import { DMCAListEntity } from './dmca/entities/dmcalist.entity';

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
        DomainListEntity,
        DMCALinkEntity,
        DMCAListEntity,
      ],
    }),
    DmcaModule,
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
export class AppModule {}
