import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { NaoEncontradoError } from '../../../../../shared/domain/errors/domain.errors';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { SINISTRO_WRITE_REPOSITORY, SinistroWriteRepository } from '../../../domain/ports/sinistro.write.repository';
import { SinistroMapper } from '../../../infrastructure/mappers/sinistro.mappers';
import { LaudoRequest } from '../../dto/sinistro.dto.request';
import { SinistroResponse } from '../../dto/sinistro.dto.response';
import { EmitirLaudoUseCase } from '../../use-case/write/emitir.laudo.use-case';

@Injectable()
export class EmitirLaudoService implements EmitirLaudoUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly readRepository: SinistroReadRepository,
    @Inject(SINISTRO_WRITE_REPOSITORY)
    private readonly writeRepository: SinistroWriteRepository,
  ) {}

  async execute(id: string, laudo: LaudoRequest, usuarioId: string): Promise<SinistroResponse> {
    const sinistroEntity = await this.readRepository.findSinistroById(id);
    if (!sinistroEntity) {
      throw new NaoEncontradoError('Sinistro não encontrado.');
    }
    // ETAPA 3 - Conferencia no Application, alem do RBAC do controller.
    // O tecnico so pode agir sobre o sinistro que ele mesmo assumiu.
    if (sinistroEntity.props.tecnicoResponsavelId !== usuarioId) {
      throw new ForbiddenException('Somente o técnico responsável pode realizar esta ação.');
    }

    const reparos = await this.readRepository.countReparos(sinistroEntity.props.numeroSerie.value);
    sinistroEntity.emitirLaudo(laudo.decisao, laudo.laudo, reparos);

    const atualizado = await this.writeRepository.updateSinistroComoTecnico(id, sinistroEntity, usuarioId);
    return SinistroMapper.toSinistroResponseFromSinistroEntity(atualizado);
  }
}
