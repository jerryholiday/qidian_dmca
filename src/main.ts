/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('起点DMCA')
    .setDescription('起点 DMCA 投诉')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`/docs`, app, document);

  await app.listen(3000, '0.0.0.0', () => {
    console.log(`[bootstrap] Server serve at http://127.0.0.1:3000;`);
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
