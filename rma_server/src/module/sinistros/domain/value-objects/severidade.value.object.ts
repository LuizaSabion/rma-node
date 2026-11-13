import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';
import { ValueObjects } from '../../../../shared/domain/value.objects/value.objects';

export enum NivelSeveridade {
  ALTA = 'ALTA',
  MEDIA = 'MEDIA',
  BAIXA = 'BAIXA',
}

export class Severidade extends ValueObjects<NivelSeveridade> {
  private constructor(value: NivelSeveridade) {
    super(value);
  }

  static create(value: unknown): Severidade {
    if (typeof value !== 'string' || !value.trim()) {
      throw new RegraNegocioError('A severidade deve ser um texto preenchido');
    }

    const normalized = value.trim().toUpperCase() as NivelSeveridade;

    if (!Object.values(NivelSeveridade).includes(normalized)) {
      const permitidos = Object.values(NivelSeveridade).join(', ');
      throw new RegraNegocioError(`Severidade inválida: "${value}". Valores permitidos: ${permitidos}`);
    }

    return new Severidade(normalized);
  }

  static alta(): Severidade {
    return new Severidade(NivelSeveridade.ALTA);
  }

  static media(): Severidade {
    return new Severidade(NivelSeveridade.MEDIA);
  }

  static baixa(): Severidade {
    return new Severidade(NivelSeveridade.BAIXA);
  }

  isAlta(): boolean {
    return this.value === NivelSeveridade.ALTA;
  }
}
