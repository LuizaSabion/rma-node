import { Module } from '@nestjs/common';

const { GarantiaService } = require('./application/service/garantia.service');
const { SinistroMemoryRepository } = require('./infrastructure/adapters/sinistro.memory.repository');

import { SinistrosNestController } from './presentation/sinistros.nest.controller';

@Module({
  controllers: [SinistrosNestController],

  providers: [
    SinistroMemoryRepository,
    {
      provide: GarantiaService,
      useFactory: (repositorio) => {
        return new GarantiaService(repositorio);
      },
      inject: [SinistroMemoryRepository],
    },
  ],

  exports: [GarantiaService],
})
export class SinistrosModule {}