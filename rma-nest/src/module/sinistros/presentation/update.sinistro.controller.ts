import { Body, Controller, Inject, Param, Put } from '@nestjs/common';
import { SinistroRequest } from '../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import { UPDATE_SINISTRO_USE_CASE, UpdateSinistroUseCase } from '../application/use-case/write/update.sinistro.use-case';

@Controller('sinistros')
export class UpdateSinistroController {
  constructor(
    @Inject(UPDATE_SINISTRO_USE_CASE)
    private readonly updateSinistroUseCase: UpdateSinistroUseCase,
  ) {}

  @Put(':id')
  async atualizar(@Param('id') id: string, @Body() updateRequest: SinistroRequest): Promise<SinistroResponse> {
    return await this.updateSinistroUseCase.execute(id, updateRequest);
  }
}
