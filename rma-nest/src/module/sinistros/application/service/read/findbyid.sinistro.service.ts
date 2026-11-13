import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
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
      throw new NotFoundException('Sinistro não encontrado.');
    }

    return SinistroMapper.toSinistroResponseFromSinistroEntity(sinistroEntity);
  }
}
