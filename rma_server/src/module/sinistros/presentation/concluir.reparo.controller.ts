import { Controller, Inject, Param, Patch } from '@nestjs/common';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import { CONCLUIR_REPARO_USE_CASE, ConcluirReparoUseCase } from '../application/use-case/write/concluir.reparo.use-case';

// ETAPA 1 - Endpoint de ação: não recebe um status escolhido livremente.
@Controller('sinistro')
export class ConcluirReparoController {
  constructor(
    @Inject(CONCLUIR_REPARO_USE_CASE)
    private readonly concluirReparoUseCase: ConcluirReparoUseCase,
  ) {}

  @Patch(':id/concluir-reparo')
  async concluirReparo(@Param('id') id: string): Promise<SinistroResponse> {
    return this.concluirReparoUseCase.execute(id);
  }
}
