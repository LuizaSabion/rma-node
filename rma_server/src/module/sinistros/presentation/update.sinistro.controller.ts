import { Body, Controller, Inject, Param, Put } from '@nestjs/common';
// ETAPA 3 - Bloqueio RBAC no backend, nunca apenas no botao da tela.
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import { SinistroRequest } from '../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import {
  UPDATE_SINISTRO_USE_CASE,
  UpdateSinistroUseCase,
} from '../application/use-case/write/update.sinistro.use-case';

@Perfis(PerfilUsuario.ATENDENTE)
@Controller('sinistro')
export class UpdateSinistroController {
  constructor(
    @Inject(UPDATE_SINISTRO_USE_CASE)
    private readonly updateSinistroUseCase: UpdateSinistroUseCase,
  ) {}

  @Put(':id')
  async updateSinistro(@Param('id') id: string, @Body() updateRequest: SinistroRequest): Promise<SinistroResponse> {
    return await this.updateSinistroUseCase.execute(id, updateRequest);
  }
}
