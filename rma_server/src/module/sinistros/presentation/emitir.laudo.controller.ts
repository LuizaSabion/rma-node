import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
import { LaudoRequest } from '../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import { EMITIR_LAUDO_USE_CASE, EmitirLaudoUseCase } from '../application/use-case/write/emitir.laudo.use-case';

@Controller('sinistro')
export class EmitirLaudoController {
  constructor(
    @Inject(EMITIR_LAUDO_USE_CASE)
    private readonly emitirLaudoUseCase: EmitirLaudoUseCase,
  ) {}

  @Patch(':id/laudo')
  async emitirLaudo(@Param('id') id: string, @Body() laudoRequest: LaudoRequest): Promise<SinistroResponse> {
    return await this.emitirLaudoUseCase.execute(id, laudoRequest);
  }
}
