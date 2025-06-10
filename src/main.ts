import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000, '0.0.0.0', () => {
    console.log(`[bootstrap] Server serve at http://127.0.0.1:3000;`);
  });
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
