import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';
import { DELETE_SINISTRO_USE_CASE, DeleteSinistroUseCase } from '../application/use-case/write/delete.sinistro.use-case';

@Controller('sinistros')
export class DeleteSinistroController {
  constructor(
    @Inject(DELETE_SINISTRO_USE_CASE)
    private readonly deleteSinistroUseCase: DeleteSinistroUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(200)
  async excluir(@Param('id') id: string): Promise<{ mensagem: string }> {
    await this.deleteSinistroUseCase.execute(id);
    return { mensagem: 'Sinistro excluído com sucesso.' };
  }
}
