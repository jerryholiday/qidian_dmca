import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DmcaModule } from './dmca/dmca.module';
import { BookEntity } from './dmca/entities/book.entity';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { TransformInterceptor } from './interceptors/transform.interceptor';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
      username: 'dmca',
      password: '123@dmca',
      synchronize: true,
      entities: [BookEntity],
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
