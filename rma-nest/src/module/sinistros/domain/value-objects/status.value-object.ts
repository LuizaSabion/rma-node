import { ValueObjects } from '../../../../shared/domain/value-objects/value.objects';

export enum StatusSinistroEnum {
  ABERTO = 'ABERTO',
  EM_LABORATORIO = 'EM_LABORATORIO',
  REPARADO = 'REPARADO',
  SUBSTITUIDO = 'SUBSTITUIDO',
  REPROVADO = 'REPROVADO',
}

export class Status extends ValueObjects<StatusSinistroEnum> {
  private constructor(value: StatusSinistroEnum) {
    super(value);
  }

  static create(value: unknown): Status {
    if (typeof value !== 'string' || !value.trim()) {
      throw new Error('O status deve ser um texto preenchido');
    }

    const normalizado = value.trim().toUpperCase() as StatusSinistroEnum;

    if (!Object.values(StatusSinistroEnum).includes(normalizado)) {
      const permitidos = Object.values(StatusSinistroEnum).join(', ');
      throw new Error(`Status inválido: "${value}". Valores permitidos: ${permitidos}`);
    }

    return new Status(normalizado);
  }

  static aberto(): Status {
    return new Status(StatusSinistroEnum.ABERTO);
  }

  static emLaboratorio(): Status {
    return new Status(StatusSinistroEnum.EM_LABORATORIO);
  }

  static reparado(): Status {
    return new Status(StatusSinistroEnum.REPARADO);
  }

  static substituido(): Status {
    return new Status(StatusSinistroEnum.SUBSTITUIDO);
  }

  static reprovado(): Status {
    return new Status(StatusSinistroEnum.REPROVADO);
  }

  // reparado, substituído ou reprovado = o laudo já saiu
  isFinalizado(): boolean {
    return (
      this.value === StatusSinistroEnum.REPARADO ||
      this.value === StatusSinistroEnum.SUBSTITUIDO ||
      this.value === StatusSinistroEnum.REPROVADO
    );
  }
}
