import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '../../database/prisma.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessaoGuard } from './sessao.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService,
    // ETAPA 3 - Guarda GLOBAL: todas as rotas exigem sessao, exceto login publico.
    { provide: APP_GUARD, useClass: SessaoGuard },
  ],
})
export class AuthModule {}
