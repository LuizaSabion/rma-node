import { Inject, Injectable } from '@nestjs/common';
import { SINISTRO_READ_REPOSITORY, SinistroReadRepository } from '../../../domain/ports/sinistro.read.repository';
import { EstatisticasResponse } from '../../dto/sinistro.dto.response';
import { EstatisticasSinistroUseCase } from '../../use-case/read/estatisticas.sinistro.use-case';

@Injectable()
export class EstatisticasSinistroService implements EstatisticasSinistroUseCase {
  constructor(
    @Inject(SINISTRO_READ_REPOSITORY)
    private readonly repository: SinistroReadRepository,
  ) {}

  async execute(): Promise<EstatisticasResponse> {
    const qtd = await this.repository.countByStatus();

    return {
      total: Object.values(qtd).reduce((soma, n) => soma + n, 0),
      abertos: qtd.ABERTO,
      laboratorio: qtd.EM_LABORATORIO,
      // ETAPA 1 - Inclui EM_REPARO nas estatísticas.
      emReparo: qtd.EM_REPARO,
      reparados: qtd.REPARADO,
      substituidos: qtd.SUBSTITUIDO,
      reprovados: qtd.REPROVADO,
    };
  }
}
