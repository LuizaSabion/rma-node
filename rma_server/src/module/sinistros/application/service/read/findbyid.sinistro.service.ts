import { Inject, Injectable } from '@nestjs/common';
import { NaoEncontradoError } from '../../../../../shared/domain/errors/domain.errors';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { FindByIdSinistroUseCase } from '../../use-case/read/findbyid.sinistro.use-case';

@Injectable()
export class FindByIdSinistroService implements FindByIdSinistroUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly repository: SinistroReadRepository,
  ) {}

  async execute(id: string): Promise<SinistroResponse> {
    const sinistroEntity = await this.repository.findSinistroById(id);
    if (!sinistroEntity) {
      throw new NaoEncontradoError('Sinistro não encontrado.');
    }
    return SinistroMapper.toSinistroResponseFromSinistroEntity(sinistroEntity);
  }
}
