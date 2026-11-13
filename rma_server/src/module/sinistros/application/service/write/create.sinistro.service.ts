import { Inject, Injectable } from '@nestjs/common';
import { SINISTRO_WRITE_REPOSITORY, SinistroWriteRepository } from '../../../domain/ports/sinistro.write.repository';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { SinistroRequest } from '../../dto/sinistro.dto.request';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { CreateSinistroUseCase } from '../../use-case/write/create.sinistro.use-case';

@Injectable()
export class CreateSinistroService implements CreateSinistroUseCase {
  constructor(
    @Inject(SINISTRO_WRITE_REPOSITORY)
    private readonly repository: SinistroWriteRepository,
  ) {}

  async execute(sinistro: SinistroRequest): Promise<SinistroResponse> {
    let sinistroEntity = SinistroMapper.toSinistroEntityFromRequest(sinistro);
    sinistroEntity = await this.repository.createSinistro(sinistroEntity);
    return SinistroMapper.toSinistroResponseFromSinistroEntity(sinistroEntity);
  }
}
