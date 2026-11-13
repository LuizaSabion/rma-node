import { Module } from '@nestjs/common';

import { CreateSinistroController } from './presentation/create.sinistro.controller';
import { FindAllSinistroController } from './presentation/findall.sinistro.controller';
import { FindByIdSinistroController } from './presentation/findbyid.sinistro.controller';
import { UpdateSinistroController } from './presentation/update.sinistro.controller';
import { DeleteSinistroController } from './presentation/delete.sinistro.controller';

import { CREATE_SINISTRO_USE_CASE } from './application/use-case/write/create.sinistro.use-case';
import { UPDATE_SINISTRO_USE_CASE } from './application/use-case/write/update.sinistro.use-case';
import { DELETE_SINISTRO_USE_CASE } from './application/use-case/write/delete.sinistro.use-case';
import { FIND_ALL_SINISTRO_USE_CASE } from './application/use-case/read/findall.sinistro.use-case';
import { FIND_BY_ID_SINISTRO_USE_CASE } from './application/use-case/read/findbyid.sinistro.use-case';

import { CreateSinistroService } from './application/service/write/create.sinistro.service';
import { UpdateSinistroService } from './application/service/write/update.sinistro.service';
import { DeleteSinistroService } from './application/service/write/delete.sinistro.service';
import { FindAllSinistroService } from './application/service/read/findall.sinistro.service';
import { FindByIdSinistroService } from './application/service/read/findbyid.sinistro.service';

import { SINISTRO_READ_REPOSITORY } from './domain/ports/sinistro.read.repository';
import { SINISTRO_WRITE_REPOSITORY } from './domain/ports/sinistro.write.repository';
import { SinistroMemoryReadRepository } from './infrastructure/adapters/sinistro.memory.read.repository';
import { SinistroMemoryWriteRepository } from './infrastructure/adapters/sinistro.memory.write.repository';
import { SinistroMemoryStore } from './infrastructure/store/sinistro.memory.store';

@Module({
  controllers: [
    CreateSinistroController,
    FindAllSinistroController,
    FindByIdSinistroController,
    UpdateSinistroController,
    DeleteSinistroController,
  ],
  providers: [
    SinistroMemoryStore,

    { provide: CREATE_SINISTRO_USE_CASE, useClass: CreateSinistroService },
    { provide: UPDATE_SINISTRO_USE_CASE, useClass: UpdateSinistroService },
    { provide: DELETE_SINISTRO_USE_CASE, useClass: DeleteSinistroService },
    { provide: FIND_ALL_SINISTRO_USE_CASE, useClass: FindAllSinistroService },
    { provide: FIND_BY_ID_SINISTRO_USE_CASE, useClass: FindByIdSinistroService },

    { provide: SINISTRO_READ_REPOSITORY, useClass: SinistroMemoryReadRepository },
    { provide: SINISTRO_WRITE_REPOSITORY, useClass: SinistroMemoryWriteRepository },
  ],
})
export class SinistrosModule {}
