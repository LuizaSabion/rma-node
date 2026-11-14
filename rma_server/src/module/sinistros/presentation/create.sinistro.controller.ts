import { Body, Controller, Inject, Post } from '@nestjs/common';
// ETAPA 3 - Bloqueio RBAC no backend, nunca apenas no botao da tela.
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import { SinistroRequest } from '../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';
import {
  CREATE_SINISTRO_USE_CASE,
  CreateSinistroUseCase,
} from '../application/use-case/write/create.sinistro.use-case';

@Perfis(PerfilUsuario.ATENDENTE)
@Controller('sinistro')
export class CreateSinistroController {
  constructor(
    @Inject(CREATE_SINISTRO_USE_CASE)
    private readonly createSinistroUseCase: CreateSinistroUseCase,
  ) {}

  @Post()
  async createSinistro(@Body() createRequest: SinistroRequest): Promise<SinistroResponse> {
    return await this.createSinistroUseCase.execute(createRequest);
  }
}
