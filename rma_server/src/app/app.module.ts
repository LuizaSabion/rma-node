import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../database/prisma.module';
import { SinistroModule } from '../module/sinistros/sinistros.module';
// ETAPA 3 - Login e RBAC globais, sem repetir validacao em cada endpoint.
import { AuthModule } from '../module/auth/auth.module';

const modules = [PrismaModule, AuthModule, SinistroModule];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...modules,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
