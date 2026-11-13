import { INestApplication } from '@nestjs/common';
import { SinistroRequest } from './module/sinistros/application/dto/sinistro.dto.request';
import { SinistroResponse } from './module/sinistros/application/dto/sinistro.dto.response';
import { CREATE_SINISTRO_USE_CASE, CreateSinistroUseCase } from './module/sinistros/application/use-case/write/create.sinistro.use-case';
import { UPDATE_SINISTRO_USE_CASE, UpdateSinistroUseCase } from './module/sinistros/application/use-case/write/update.sinistro.use-case';

export async function criarDadosIniciais(app: INestApplication) {
  const criar = app.get<CreateSinistroUseCase>(CREATE_SINISTRO_USE_CASE);
  const atualizar = app.get<UpdateSinistroUseCase>(UPDATE_SINISTRO_USE_CASE);

  const exemplos: Partial<SinistroRequest>[] = [
    { cliente: 'Mariana Costa', dispositivo: 'Smartphone Zenith X200', numeroSerie: 'SNX20001', tipoDefeito: 'BATERIA', descricaoDefeito: 'Bateria inchando e não carrega mais.' },
    { cliente: 'Rafael Souza', dispositivo: 'Notebook Zenith Book 14', numeroSerie: 'SNB14002', tipoDefeito: 'TELA', descricaoDefeito: 'Tela com listras coloridas na parte de baixo.' },
    { cliente: 'Camila Alves', dispositivo: 'Smartphone Zenith X200', numeroSerie: 'SNX20003', tipoDefeito: 'SOFTWARE', descricaoDefeito: 'Aparelho reinicia sozinho toda hora.' },
    { cliente: 'Bruno Lima', dispositivo: 'Fone Zenith Air Pro', numeroSerie: 'SNF10004', tipoDefeito: 'CONECTOR', descricaoDefeito: 'Um dos lados do fone não carrega na case.' },
    { cliente: 'Larissa Nunes', dispositivo: 'Notebook Zenith Book 14', numeroSerie: 'SNB14005', tipoDefeito: 'PLACA', descricaoDefeito: 'Notebook não liga depois de uma queda de energia.' },
  ];

  const criados: SinistroResponse[] = [];
  for (const exemplo of exemplos) {
    criados.push(await criar.execute(new SinistroRequest(exemplo)));
  }

  // deixa dois já andando pra lista não ficar toda igual
  await atualizar.execute(criados[3].id!, new SinistroRequest({ status: 'EM_LABORATORIO' }));
  await atualizar.execute(criados[2].id!, new SinistroRequest({
    status: 'REPARADO',
    laudo: 'Firmware reinstalado e aparelho testado por 24h sem reiniciar.',
  }));
}
