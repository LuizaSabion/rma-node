import { NivelSeveridade } from './severidade.value-object';

export enum TipoDefeitoEnum {
  TELA = 'TELA',
  BATERIA = 'BATERIA',
  PLACA = 'PLACA',
  CONECTOR = 'CONECTOR',
  SOFTWARE = 'SOFTWARE',
}

// o tipo do defeito define a severidade, ninguém digita isso
export const SEVERIDADE_POR_DEFEITO: Record<TipoDefeitoEnum, NivelSeveridade> = {
  [TipoDefeitoEnum.TELA]: NivelSeveridade.MEDIA,
  [TipoDefeitoEnum.BATERIA]: NivelSeveridade.ALTA,
  [TipoDefeitoEnum.PLACA]: NivelSeveridade.ALTA,
  [TipoDefeitoEnum.CONECTOR]: NivelSeveridade.MEDIA,
  [TipoDefeitoEnum.SOFTWARE]: NivelSeveridade.BAIXA,
};

// depois de 2 reparos no mesmo aparelho, o próximo vira troca
export const LIMITE_REPAROS = 2;
