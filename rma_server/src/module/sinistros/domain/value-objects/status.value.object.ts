import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';
import { ValueObjects } from '../../../../shared/domain/value.objects/value.objects';

export enum SinistroStatusEnum {
  // ETAPA 2 - Falta comprovante validado para seguir ao laboratorio.
  PENDENTE_COMPROVACAO = 'PENDENTE_COMPROVACAO',
  ABERTO = 'ABERTO',
  EM_LABORATORIO = 'EM_LABORATORIO',
  // ETAPA 1 - Novo estado: laudo inicial aprovado e conserto em andamento.
  EM_REPARO = 'EM_REPARO',
  REPARADO = 'REPARADO',
  SUBSTITUIDO = 'SUBSTITUIDO',
  REPROVADO = 'REPROVADO',
}

// ETAPA 1 - Um laudo inicial pode INICIAR o reparo, mas não concluí-lo diretamente.
export const DECISOES_LAUDO = [
  SinistroStatusEnum.EM_REPARO,
  SinistroStatusEnum.SUBSTITUIDO,
  SinistroStatusEnum.REPROVADO,
];

// ETAPA 1 - Matriz da máquina de estados: apenas estas mudanças são permitidas.
// A reavaliação EM_REPARO -> EM_LABORATORIO será liberada junto ao Audit Log,
// pois precisará preservar motivo, autor e todos os laudos anteriores.
const TRANSICOES: Record<SinistroStatusEnum, readonly SinistroStatusEnum[]> = {
  // ETAPA 2 - Comprovante recebido ou reprovacao automatica pela vigencia.
  [SinistroStatusEnum.PENDENTE_COMPROVACAO]: [SinistroStatusEnum.ABERTO, SinistroStatusEnum.REPROVADO],
  [SinistroStatusEnum.ABERTO]: [SinistroStatusEnum.PENDENTE_COMPROVACAO, SinistroStatusEnum.EM_LABORATORIO, SinistroStatusEnum.REPROVADO],
  [SinistroStatusEnum.EM_LABORATORIO]: [
    SinistroStatusEnum.EM_REPARO,
    SinistroStatusEnum.SUBSTITUIDO,
    SinistroStatusEnum.REPROVADO,
  ],
  [SinistroStatusEnum.EM_REPARO]: [SinistroStatusEnum.REPARADO],
  [SinistroStatusEnum.REPARADO]: [],
  [SinistroStatusEnum.SUBSTITUIDO]: [],
  [SinistroStatusEnum.REPROVADO]: [],
};

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
      throw new RegraNegocioError('A decisão do laudo deve ser EM_REPARO, SUBSTITUIDO ou REPROVADO.');
    }
    return status;
  }

  // ETAPA 2 - Todo novo cadastro aguarda documento; sinistros antigos mantem ABERTO.
  static pendenteComprovacao(): Status {
    return new Status(SinistroStatusEnum.PENDENTE_COMPROVACAO);
  }

  static aberto(): Status {
    return new Status(SinistroStatusEnum.ABERTO);
  }

  static emLaboratorio(): Status {
    return new Status(SinistroStatusEnum.EM_LABORATORIO);
  }

  // ETAPA 1 - Cada alteração de status passa pela matriz, inclusive via API.
  validarTransicaoPara(proximo: Status): void {
    if (!TRANSICOES[this.value].includes(proximo.value)) {
      throw new RegraNegocioError(
        `Transição não permitida: ${this.value} -> ${proximo.value}.`,
      );
    }
  }

  static reparado(): Status {
    return new Status(SinistroStatusEnum.REPARADO);
  }

  static substituido(): Status {
    return new Status(SinistroStatusEnum.SUBSTITUIDO);
  }

  isPendenteComprovacao(): boolean {
    return this.value === SinistroStatusEnum.PENDENTE_COMPROVACAO;
  }

  isAberto(): boolean {
    return this.value === SinistroStatusEnum.ABERTO;
  }

  isEmLaboratorio(): boolean {
    return this.value === SinistroStatusEnum.EM_LABORATORIO;
  }

  isEmReparo(): boolean {
    return this.value === SinistroStatusEnum.EM_REPARO;
  }

  isReparado(): boolean {
    return this.value === SinistroStatusEnum.REPARADO;
  }
}
