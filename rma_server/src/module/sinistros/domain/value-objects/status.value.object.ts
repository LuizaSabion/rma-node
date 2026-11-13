import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';
import { ValueObjects } from '../../../../shared/domain/value.objects/value.objects';

export enum SinistroStatusEnum {
  ABERTO = 'ABERTO',
  EM_LABORATORIO = 'EM_LABORATORIO',
  REPARADO = 'REPARADO',
  SUBSTITUIDO = 'SUBSTITUIDO',
  REPROVADO = 'REPROVADO',
}

export const DECISOES_LAUDO = [
  SinistroStatusEnum.REPARADO,
  SinistroStatusEnum.SUBSTITUIDO,
  SinistroStatusEnum.REPROVADO,
];

export class Status extends ValueObjects<SinistroStatusEnum> {
  private constructor(value: SinistroStatusEnum) {
    super(value);
  }

  static create(value: unknown): Status {
    if (typeof value !== 'string' || !value.trim()) {
      throw new RegraNegocioError('O status deve ser um texto preenchido');
    }

    const normalized = value.trim().toUpperCase() as SinistroStatusEnum;

    if (!Object.values(SinistroStatusEnum).includes(normalized)) {
      const permitidos = Object.values(SinistroStatusEnum).join(', ');
      throw new RegraNegocioError(`Status inválido: "${value}". Valores permitidos: ${permitidos}`);
    }

    return new Status(normalized);
  }

  static decisao(value: unknown): Status {
    const status = Status.create(value);
    if (!DECISOES_LAUDO.includes(status.value)) {
      throw new RegraNegocioError('A decisão do laudo deve ser REPARADO, SUBSTITUIDO ou REPROVADO.');
    }
    return status;
  }

  static aberto(): Status {
    return new Status(SinistroStatusEnum.ABERTO);
  }

  static emLaboratorio(): Status {
    return new Status(SinistroStatusEnum.EM_LABORATORIO);
  }

  static substituido(): Status {
    return new Status(SinistroStatusEnum.SUBSTITUIDO);
  }

  isAberto(): boolean {
    return this.value === SinistroStatusEnum.ABERTO;
  }

  isEmLaboratorio(): boolean {
    return this.value === SinistroStatusEnum.EM_LABORATORIO;
  }

  isReparado(): boolean {
    return this.value === SinistroStatusEnum.REPARADO;
  }
}
