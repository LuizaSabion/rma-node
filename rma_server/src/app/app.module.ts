import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../database/prisma.module';
import { SinistroModule } from '../module/sinistros/sinistros.module';

const modules = [PrismaModule, SinistroModule];

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
