import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';
import { ValueObjects } from '../../../../shared/domain/value.objects/value.objects';

export class NumeroSerie extends ValueObjects<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(value: unknown): NumeroSerie {
    if (typeof value !== 'string' || !value.trim()) {
      throw new RegraNegocioError('Informe o número de série do aparelho.');
    }

    const normalized = value.trim().toUpperCase();

    if (!/^[A-Z0-9]{4,30}$/.test(normalized)) {
      throw new RegraNegocioError('O número de série deve ter de 4 a 30 letras ou números, sem espaço.');
    }

    return new NumeroSerie(normalized);
  }
}
