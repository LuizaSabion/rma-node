import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';

// ETAPA 2 - Tipos e prazos que definimos, sem alterar o tipo de defeito existente.
export enum TipoDispositivoEnum {
  FONE_COM_FIO = 'FONE_COM_FIO',
  CELULAR = 'CELULAR',
  FONE_BLUETOOTH = 'FONE_BLUETOOTH',
  NOTEBOOK = 'NOTEBOOK',
}

export const PRAZO_GARANTIA_MESES: Record<TipoDispositivoEnum, number> = {
  [TipoDispositivoEnum.FONE_COM_FIO]: 6,
  [TipoDispositivoEnum.CELULAR]: 12,
  [TipoDispositivoEnum.FONE_BLUETOOTH]: 12,
  [TipoDispositivoEnum.NOTEBOOK]: 24,
};

export function validarTipoDispositivo(valor: unknown): TipoDispositivoEnum {
  if (typeof valor !== 'string' || !Object.values(TipoDispositivoEnum).includes(valor as TipoDispositivoEnum)) {
    throw new RegraNegocioError('Selecione o tipo de aparelho para definir o prazo da garantia.');
  }
  return valor as TipoDispositivoEnum;
}

// ETAPA 2 - Compara apenas a data civil. Assim, a garantia vale
// durante todo o seu ultimo dia, sem depender da hora da compra.
export function dataHojeBrasil(agora: Date = new Date()): Date {
  const partes = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(agora);
  const numero = (nome: string) => Number(partes.find((p) => p.type === nome)?.value);
  return new Date(Date.UTC(numero('year'), numero('month') - 1, numero('day')));
}

export function validarDataCompra(valor: string, hoje: Date = dataHojeBrasil()): Date {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(valor ?? '')) {
    throw new RegraNegocioError('Informe a data de compra no formato AAAA-MM-DD.');
  }
  const data = new Date(`${valor}T00:00:00.000Z`);
  if (!Number.isFinite(data.valueOf()) || data.toISOString().slice(0, 10) !== valor) {
    throw new RegraNegocioError('A data de compra informada e invalida.');
  }
  if (data > hoje) {
    throw new RegraNegocioError('A data de compra nao pode estar no futuro.');
  }
  return data;
}

// ETAPA 2 - Ajusta meses com seguranca: 31/jan + 1 mes resulta no ultimo dia de fevereiro.
export function calcularVencimento(dataCompra: Date, meses: number): Date {
  const ano = dataCompra.getUTCFullYear();
  const mesBase = dataCompra.getUTCMonth() + meses;
  const ultimoDia = new Date(Date.UTC(ano, mesBase + 1, 0)).getUTCDate();
  const dia = Math.min(dataCompra.getUTCDate(), ultimoDia);
  return new Date(Date.UTC(ano, mesBase, dia));
}
