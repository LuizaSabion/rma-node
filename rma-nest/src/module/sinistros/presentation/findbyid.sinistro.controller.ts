import { Controller, Get, Inject, Param } from '@nestjs/common';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import { FIND_BY_ID_SINISTRO_USE_CASE, FindByIdSinistroUseCase } from '../application/use-case/read/findbyid.sinistro.use-case';

@Controller('sinistros')
export class FindByIdSinistroController {
  constructor(
    @Inject(FIND_BY_ID_SINISTRO_USE_CASE)
    private readonly serviceUseCase: FindByIdSinistroUseCase,
  ) {}

  @Get(':id')
  async buscar(@Param('id') id: string): Promise<SinistroResponse> {
    return await this.serviceUseCase.execute(id);
  }
}
