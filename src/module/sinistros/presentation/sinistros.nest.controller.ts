import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
} from '@nestjs/common';

const { GarantiaService } = require('../application/service/garantia.service');

@Controller('api/sinistros')
export class SinistrosNestController {
  constructor(
    @Inject(GarantiaService)
    private readonly garantiaService: any,
  ) {}

  @Get()
  listar(@Query('status') status?: string) {
    return this.garantiaService.listarFila(status || 'TODOS');
  }

  @Get('estatisticas')
  estatisticas() {
   return this.garantiaService.estatisticas();
  }

    @Post()
    abrir(@Body() body: any) {
     return this.garantiaService.abrirSinistro(body);
}

  @Post(':id/enviar-laboratorio')
  enviarParaLaboratorio(@Param('id') id: string) {
  return this.garantiaService.enviarParaLaboratorio(id);

  }

  @Post(':id/laudo')
emitirLaudo(
  @Param('id') id: string,
  @Body() body: any,
) {
  return this.garantiaService.emitirLaudo(
    id,
    body.decisao,
    body.laudo,
  );
}
}
