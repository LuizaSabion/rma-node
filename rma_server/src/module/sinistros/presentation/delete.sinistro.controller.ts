import { Controller, Delete, HttpCode, Inject, Param } from '@nestjs/common';
// ETAPA 3 - Bloqueio RBAC no backend, nunca apenas no botao da tela.
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import {
  DELETE_SINISTRO_USE_CASE,
  DeleteSinistroUseCase,
} from '../application/use-case/write/delete.sinistro.use-case';

@Perfis(PerfilUsuario.ATENDENTE)
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
