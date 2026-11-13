import { Module } from '@nestjs/common';
import { SinistrosModule } from '../module/sinistros/sinistros.module';

@Module({
  imports: [SinistrosModule],
})
export class AppModule {}
