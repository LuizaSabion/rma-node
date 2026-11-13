import { Inject, Injectable } from '@nestjs/common';
import { NaoEncontradoError } from '../../../../../shared/domain/errors/domain.errors';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SINISTRO_WRITE_REPOSITORY, SinistroWriteRepository } from '../../../domain/ports/sinistro.write.repository';
import { DeleteSinistroUseCase } from '../../use-case/write/delete.sinistro.use-case';

@Injectable()
export class DeleteSinistroService implements DeleteSinistroUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly readRepository: SinistroReadRepository,
    @Inject(SINISTRO_WRITE_REPOSITORY)
    private readonly writeRepository: SinistroWriteRepository,
  ) {}

  async execute(id: string): Promise<void> {
    const sinistroEntity = await this.readRepository.findSinistroById(id);
    if (!sinistroEntity) {
      throw new NaoEncontradoError('Sinistro não encontrado.');
    }

    sinistroEntity.validarExclusao();
    await this.writeRepository.deleteSinistro(id);
  }
}
