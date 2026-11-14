import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { EstatisticasSinistroService } from './application/service/read/estatisticas.sinistro.service';
import { FindAllSinistroService } from './application/service/read/findall.sinistro.service';
import { FindByIdSinistroService } from './application/service/read/findbyid.sinistro.service';
import { ConcluirReparoService } from './application/service/write/concluir.reparo.service';
import { CreateSinistroService } from './application/service/write/create.sinistro.service';
import { DeleteSinistroService } from './application/service/write/delete.sinistro.service';
import { EmitirLaudoService } from './application/service/write/emitir.laudo.service';
import { EnviarLaboratorioService } from './application/service/write/enviar.laboratorio.service';
import { UpdateSinistroService } from './application/service/write/update.sinistro.service';
// ETAPA 2 - Novo caso de uso somente para o comprovante, sem criar modulo extra.
import { ComprovanteGarantiaService } from './application/service/write/comprovante.garantia.service';
import { ComprovanteGarantiaController } from './presentation/comprovante.garantia.controller';
// ETAPA 3 - Um unico servico de atribuicao, sem duplicar regras em controller.
import { AtribuicaoTecnicoService } from './application/service/write/atribuicao.tecnico.service';
import { AtribuicaoTecnicoController } from './presentation/atribuicao.tecnico.controller';
import { ESTATISTICAS_SINISTRO_USE_CASE } from './application/use-case/read/estatisticas.sinistro.use-case';
import { FIND_ALL_SINISTRO_USE_CASE } from './application/use-case/read/findall.sinistro.use-case';
import { FIND_BY_ID_SINISTRO_USE_CASE } from './application/use-case/read/findbyid.sinistro.use-case';
import { CONCLUIR_REPARO_USE_CASE } from './application/use-case/write/concluir.reparo.use-case';
import { CREATE_SINISTRO_USE_CASE } from './application/use-case/write/create.sinistro.use-case';
import { DELETE_SINISTRO_USE_CASE } from './application/use-case/write/delete.sinistro.use-case';
import { EMITIR_LAUDO_USE_CASE } from './application/use-case/write/emitir.laudo.use-case';
import { ENVIAR_LABORATORIO_USE_CASE } from './application/use-case/write/enviar.laboratorio.use-case';
import { UPDATE_SINISTRO_USE_CASE } from './application/use-case/write/update.sinistro.use-case';
import { SINISTRO_READ_REPOSITORY } from './domain/ports/sinistro.read.repository';
import { SINISTRO_WRITE_REPOSITORY } from './domain/ports/sinistro.write.repository';
import { SinistroPrismaReadRepository } from './infrastructure/adapters/sinistro.prisma.read.repository';
import { SinistroPrismaWriteRepository } from './infrastructure/adapters/sinistro.prisma.write.repository';
import { ConcluirReparoController } from './presentation/concluir.reparo.controller';
import { CreateSinistroController } from './presentation/create.sinistro.controller';
import { DeleteSinistroController } from './presentation/delete.sinistro.controller';
import { EmitirLaudoController } from './presentation/emitir.laudo.controller';
import { EnviarLaboratorioController } from './presentation/enviar.laboratorio.controller';
import { EstatisticasSinistroController } from './presentation/estatisticas.sinistro.controller';
import { FindAllSinistroController } from './presentation/findall.sinistro.controller';
import { FindByIdSinistroController } from './presentation/findbyid.sinistro.controller';
import { UpdateSinistroController } from './presentation/update.sinistro.controller';

// estatisticas antes do findById senao da conflito com o :id
const sinistroControllers = [
  FindAllSinistroController,
  EstatisticasSinistroController,
  FindByIdSinistroController,
  CreateSinistroController,
  UpdateSinistroController,
  DeleteSinistroController,
  EnviarLaboratorioController,
  EmitirLaudoController,
  // ETAPA 1 - Rota específica para a conclusão do reparo.
  ConcluirReparoController,
  // ETAPA 2 - Rotas de upload e conferencia humana da garantia.
  ComprovanteGarantiaController,
  AtribuicaoTecnicoController,
];

const sinistroProviders = [
  { provide: FIND_ALL_SINISTRO_USE_CASE, useClass: FindAllSinistroService },
  { provide: FIND_BY_ID_SINISTRO_USE_CASE, useClass: FindByIdSinistroService },
  { provide: ESTATISTICAS_SINISTRO_USE_CASE, useClass: EstatisticasSinistroService },
  { provide: CREATE_SINISTRO_USE_CASE, useClass: CreateSinistroService },
  { provide: UPDATE_SINISTRO_USE_CASE, useClass: UpdateSinistroService },
  { provide: DELETE_SINISTRO_USE_CASE, useClass: DeleteSinistroService },
  { provide: ENVIAR_LABORATORIO_USE_CASE, useClass: EnviarLaboratorioService },
  { provide: EMITIR_LAUDO_USE_CASE, useClass: EmitirLaudoService },
  // ETAPA 1 - Registra o novo caso de uso sem criar outro módulo.
  { provide: CONCLUIR_REPARO_USE_CASE, useClass: ConcluirReparoService },
  ComprovanteGarantiaService,
  AtribuicaoTecnicoService,
  { provide: SINISTRO_READ_REPOSITORY, useClass: SinistroPrismaReadRepository },
  { provide: SINISTRO_WRITE_REPOSITORY, useClass: SinistroPrismaWriteRepository },
];

@Module({
  imports: [PrismaModule],
  controllers: [...sinistroControllers],
  providers: [...sinistroProviders],
})
export class SinistroModule {}
