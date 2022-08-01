import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 검증기능 추가. class-validator
  app.useGlobalFilters(new HttpExceptionFilter()); // Exception Filter 등록하기
  await app.listen(3000);
}
bootstrap();
