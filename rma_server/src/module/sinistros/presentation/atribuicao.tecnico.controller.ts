import { Body, Controller, Param, Post } from '@nestjs/common';
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import { AtribuicaoTecnicoService } from '../application/service/write/atribuicao.tecnico.service';

@Controller('sinistro')
export class AtribuicaoTecnicoController {
  constructor(private readonly service: AtribuicaoTecnicoService) {}

  // ETAPA 3 - Permissao por perfil; tecnico so pode assumir a si mesmo.
  @Perfis(PerfilUsuario.ATENDENTE, PerfilUsuario.TECNICO, PerfilUsuario.ADMINISTRADOR)
  @Post(':id/atribuir-tecnico')
  atribuir(@Param('id') id: string, @Body('tecnicoId') tecnicoId: string, @UsuarioAtual() autor: UsuarioAutenticado) {
    return this.service.atribuir(id, tecnicoId, autor);
  }

  @Perfis(PerfilUsuario.ADMINISTRADOR)
  @Post(':id/transferir-tecnico')
  transferir(@Param('id') id: string, @Body() dados: { tecnicoId: string; justificativa: string }, @UsuarioAtual() autor: UsuarioAutenticado) {
    return this.service.transferir(id, dados?.tecnicoId, dados?.justificativa, autor);
  }
}
