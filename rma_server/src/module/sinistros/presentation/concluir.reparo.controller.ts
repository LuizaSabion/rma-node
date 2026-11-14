import { Controller, Inject, Param, Patch } from '@nestjs/common';
// ETAPA 3 - Bloqueio RBAC no backend, nunca apenas no botao da tela.
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import { CONCLUIR_REPARO_USE_CASE, ConcluirReparoUseCase } from '../application/use-case/write/concluir.reparo.use-case';

// ETAPA 1 - Endpoint de ação: não recebe um status escolhido livremente.
@Perfis(PerfilUsuario.TECNICO)
@Controller('sinistro')
export class ConcluirReparoController {
  constructor(
    @Inject(CONCLUIR_REPARO_USE_CASE)
    private readonly concluirReparoUseCase: ConcluirReparoUseCase,
  ) {}

  @Patch(':id/concluir-reparo')
  async concluirReparo(@Param('id') id: string, @UsuarioAtual() autor: UsuarioAutenticado): Promise<SinistroResponse> {
    return this.concluirReparoUseCase.execute(id, autor.id);
  }
}
