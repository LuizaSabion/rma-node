import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DomainExceptionFilter } from './shared/filters/domain.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //localhost:8000/v1/sinistro

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET, PUT, POST, DELETE, PATCH',
    allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
    credentials: false,
  });

  app.useGlobalFilters(new DomainExceptionFilter());

  await app.listen(process.env.PORT ?? 8000);
}
bootstrap();
