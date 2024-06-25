import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions: CorsOptions = {
    origin: ['http://localhost:4200'],
  };
  app.enableCors(corsOptions);
  
  app.setGlobalPrefix('api/v1');

  await app.listen(3000);
}
bootstrap();
