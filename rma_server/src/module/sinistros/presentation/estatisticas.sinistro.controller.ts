import { Controller, Get, Inject } from '@nestjs/common';
import { EstatisticasResponse } from '../application/dto/sinistro.dto.response';
import {
  ESTATISTICAS_SINISTRO_USE_CASE,
  EstatisticasSinistroUseCase,
} from '../application/use-case/read/estatisticas.sinistro.use-case';

@Controller('sinistro')
export class EstatisticasSinistroController {
  constructor(
    @Inject(ESTATISTICAS_SINISTRO_USE_CASE)
    private readonly serviceUseCase: EstatisticasSinistroUseCase,
  ) {}

  @Get('estatisticas')
  async estatisticas(): Promise<EstatisticasResponse> {
    return await this.serviceUseCase.execute();
  }
}
