import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { criarDadosIniciais } from './seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // localhost:8001/v1/sinistros
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET, PUT, POST, DELETE, PATCH',
    allowedHeader: 'Content-Type, Accept, Authorization,  X-Requested-With',
    credentials: false,
  });

  await criarDadosIniciais(app);

  await app.listen(process.env.PORT ?? 8001);
  console.log('RMA rodando em http://localhost:8001/v1/sinistros');
}
bootstrap();
