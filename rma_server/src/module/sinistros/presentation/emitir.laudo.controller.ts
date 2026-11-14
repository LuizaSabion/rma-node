import { Body, Controller, Inject, Param, Patch } from '@nestjs/common';
// ETAPA 3 - Bloqueio RBAC no backend, nunca apenas no botao da tela.
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import { LaudoRequest } from '../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import { EMITIR_LAUDO_USE_CASE, EmitirLaudoUseCase } from '../application/use-case/write/emitir.laudo.use-case';

@Perfis(PerfilUsuario.TECNICO)
@Controller('sinistro')
export class EmitirLaudoController {
  constructor(
    @Inject(EMITIR_LAUDO_USE_CASE)
    private readonly emitirLaudoUseCase: EmitirLaudoUseCase,
  ) {}

  @Patch(':id/laudo')
  async emitirLaudo(@Param('id') id: string, @Body() laudoRequest: LaudoRequest, @UsuarioAtual() autor: UsuarioAutenticado): Promise<SinistroResponse> {
    return await this.emitirLaudoUseCase.execute(id, laudoRequest, autor.id);
  }
}
