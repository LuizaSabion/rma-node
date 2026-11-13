import { Inject, Injectable } from '@nestjs/common';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { Status } from '../../../domain/value-objects/status.value.object';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { FindAllSinistroUseCase } from '../../use-case/read/findall.sinistro.use-case';

@Injectable()
export class FindAllSinistroService implements FindAllSinistroUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly repository: SinistroReadRepository,
  ) {}

  async execute(status?: string): Promise<SinistroResponse[]> {
    const filtro = status ? Status.create(status).value : undefined;
    const sinistroEntity = await this.repository.findSinistroAll(filtro);
    return SinistroMapper.toListSinistroResponseFromListSinistroEntity(sinistroEntity);
  }
}
