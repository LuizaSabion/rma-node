import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';
import { ValueObjects } from '../../../../shared/domain/value.objects/value.objects';
import { Severidade } from './severidade.value.object';

export enum TipoDefeitoEnum {
  TELA = 'TELA',
  BATERIA = 'BATERIA',
  PLACA = 'PLACA',
  CONECTOR = 'CONECTOR',
  SOFTWARE = 'SOFTWARE',
}

const INFO_DEFEITO: Record<TipoDefeitoEnum, { nome: string; severidade: () => Severidade }> = {
  TELA: { nome: 'Tela / display', severidade: Severidade.media },
  BATERIA: { nome: 'Bateria', severidade: Severidade.alta },
  PLACA: { nome: 'Placa-mãe', severidade: Severidade.alta },
  CONECTOR: { nome: 'Conector / porta de carga', severidade: Severidade.media },
  SOFTWARE: { nome: 'Software / firmware', severidade: Severidade.baixa },
};

export class TipoDefeito extends ValueObjects<TipoDefeitoEnum> {
  private constructor(value: TipoDefeitoEnum) {
    super(value);
  }

  static create(value: unknown): TipoDefeito {
    if (typeof value !== 'string' || !value.trim()) {
      throw new RegraNegocioError('Informe o tipo de defeito.');
    }

    const normalized = value.trim().toUpperCase() as TipoDefeitoEnum;

    if (!Object.values(TipoDefeitoEnum).includes(normalized)) {
      const permitidos = Object.values(TipoDefeitoEnum).join(', ');
      throw new RegraNegocioError(`Tipo de defeito inválido: "${value}". Valores permitidos: ${permitidos}`);
    }

    return new TipoDefeito(normalized);
  }

  get nome(): string {
    return INFO_DEFEITO[this.value].nome;
  }

  severidadePadrao(): Severidade {
    return INFO_DEFEITO[this.value].severidade();
  }
}
