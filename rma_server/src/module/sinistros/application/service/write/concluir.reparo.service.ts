import { Inject, Injectable } from '@nestjs/common';
import { NaoEncontradoError } from '../../../../../shared/domain/errors/domain.errors';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SINISTRO_WRITE_REPOSITORY, SinistroWriteRepository } from '../../../domain/ports/sinistro.write.repository';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { ConcluirReparoUseCase } from '../../use-case/write/concluir.reparo.use-case';

@Injectable()
export class ConcluirReparoService implements ConcluirReparoUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly readRepository: SinistroReadRepository,
    @Inject(SINISTRO_WRITE_REPOSITORY)
    private readonly writeRepository: SinistroWriteRepository,
  ) {}

  async execute(id: string): Promise<SinistroResponse> {
    const sinistroEntity = await this.readRepository.findSinistroById(id);
    if (!sinistroEntity) {
      throw new NaoEncontradoError('Sinistro não encontrado.');
    }

    // ETAPA 1 - O Domain valida a transição EM_REPARO -> REPARADO e o laudo.
    sinistroEntity.concluirReparo();
    const atualizado = await this.writeRepository.updateSinistro(id, sinistroEntity);
    return SinistroMapper.toSinistroResponseFromSinistroEntity(atualizado);
  }
}
