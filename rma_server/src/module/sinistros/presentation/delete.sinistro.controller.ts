import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';
import {
  DELETE_SINISTRO_USE_CASE,
  DeleteSinistroUseCase,
} from '../application/use-case/write/delete.sinistro.use-case';

@Controller('sinistro')
export class DeleteSinistroController {
  constructor(
    @Inject(DELETE_SINISTRO_USE_CASE)
    private readonly deleteSinistroUseCase: DeleteSinistroUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(204)
  async deleteSinistro(@Param('id') id: string): Promise<void> {
    await this.deleteSinistroUseCase.execute(id);
  }
}
