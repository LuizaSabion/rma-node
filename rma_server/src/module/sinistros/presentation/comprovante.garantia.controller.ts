import { Body, Controller, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
// ETAPA 3 - Bloqueio RBAC no backend, nunca apenas no botao da tela.
import { PerfilUsuario } from '@prisma/client';
import { Perfis, UsuarioAtual, UsuarioAutenticado } from '../../auth/auth.roles';
import { FileInterceptor } from '@nestjs/platform-express';
import { ComprovanteGarantiaService, ArquivoRecebido } from '../application/service/write/comprovante.garantia.service';
import { SinistroResponse } from '../application/dto/sinistro.dto.response';

@Perfis(PerfilUsuario.ATENDENTE)
@Controller('sinistro')
export class ComprovanteGarantiaController {
  constructor(private readonly service: ComprovanteGarantiaService) {}

  // ETAPA 2 - multipart/form-data: arquivo, dataCompra e numeroDocumento opcional.
  // Arquivo limitado a 5 MB e guardado diretamente no PostgreSQL.
  @Post(':id/comprovante')
  @UseInterceptors(FileInterceptor('arquivo', { limits: { fileSize: 5 * 1024 * 1024 } }))
  anexar(
    @Param('id') id: string,
    @UploadedFile() arquivo: ArquivoRecebido | undefined,
    @Body('dataCompra') dataCompra: string,
    @Body('numeroDocumento') numeroDocumento?: string,
  ): Promise<SinistroResponse> {
    return this.service.anexar(id, arquivo, dataCompra, numeroDocumento);
  }

  // ETAPA 2 - Acao manual de conferencia; NAO valida automaticamente ao anexar.
  @Patch(':id/conferir-garantia')
  confirmar(@Param('id') id: string): Promise<SinistroResponse> {
    return this.service.confirmar(id);
  }
}
