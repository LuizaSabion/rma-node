import { Controller, Inject, Param, Patch } from '@nestjs/common';
// ETAPA 3 - Bloqueio RBAC no backend, nunca apenas no botao da tela.
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import {
  ENVIAR_LABORATORIO_USE_CASE,
  EnviarLaboratorioUseCase,
} from '../application/use-case/write/enviar.laboratorio.use-case';

@Perfis(PerfilUsuario.ATENDENTE)
@Controller('sinistro')
export class EnviarLaboratorioController {
  constructor(
    @Inject(ENVIAR_LABORATORIO_USE_CASE)
    private readonly enviarLaboratorioUseCase: EnviarLaboratorioUseCase,
  ) {}

  @Patch(':id/enviar-laboratorio')
  async enviarLaboratorio(@Param('id') id: string): Promise<SinistroResponse> {
    return await this.enviarLaboratorioUseCase.execute(id);
  }
}
