import { ValueObjects } from '../../../../shared/domain/value-objects/value.objects';

export enum NivelSeveridade {
  BAIXA = 'BAIXA',
  MEDIA = 'MEDIA',
  ALTA = 'ALTA',
}

export class Severidade extends ValueObjects<NivelSeveridade> {
  private constructor(value: NivelSeveridade) {
    super(value);
  }

  static create(value: unknown): Severidade {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('A severidade deve ser um texto preenchido');
    }

    const normalizada = value.trim().toUpperCase() as NivelSeveridade;

    if (!Object.values(NivelSeveridade).includes(normalizada)) {
      const permitidos = Object.values(NivelSeveridade).join(', ');
      throw new Error(`Severidade inválida: "${value}". Valores permitidos: ${permitidos}`);
    }

    return new Severidade(normalizada);
  }

  static baixa(): Severidade {
    return new Severidade(NivelSeveridade.BAIXA);
  }

  static media(): Severidade {
    return new Severidade(NivelSeveridade.MEDIA);
  }

  static alta(): Severidade {
    return new Severidade(NivelSeveridade.ALTA);
  }

  isCritica(): boolean {
    return this.value === NivelSeveridade.ALTA;
  }
}
