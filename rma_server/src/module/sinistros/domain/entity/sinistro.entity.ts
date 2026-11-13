import { randomUUID } from 'crypto';
import { BaseEntity, DefaulTimeStampsProps } from '../../../../shared/domain/entity/base.entity';
import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';
import { NumeroSerie } from '../value-objects/numero-serie.value.object';
import { Severidade } from '../value-objects/severidade.value.object';
import { Status } from '../value-objects/status.value.object';
import { TipoDefeito } from '../value-objects/tipo-defeito.value.object';

// limite de reparos do mesmo aparelho, depois disso vira troca
export const LIMITE_REPAROS = 2;

export type SinistroProps = {
  id: string;
  cliente: string;
  dispositivo: string;
  numeroSerie: NumeroSerie;
  tipoDefeito: TipoDefeito;
  descricaoDefeito: string;
  severidade: Severidade;
  status: Status;
  laudo?: string | null;
} & DefaulTimeStampsProps;

export type DadosSinistro = {
  cliente: string;
  dispositivo: string;
  numeroSerie: string;
  tipoDefeito: string;
  descricaoDefeito: string;
  severidade?: string | null;
};

export class SinistroEntity extends BaseEntity<SinistroProps> {
  constructor(props: SinistroProps) {
    super(props);
  }

  static createSinistro(dados: DadosSinistro): SinistroEntity {
    const tipoDefeito = TipoDefeito.create(dados.tipoDefeito);

    return new SinistroEntity({
      id: randomUUID(),
      cliente: SinistroEntity.validarCliente(dados.cliente),
      dispositivo: SinistroEntity.validarDispositivo(dados.dispositivo),
      numeroSerie: NumeroSerie.create(dados.numeroSerie),
      tipoDefeito,
      descricaoDefeito: SinistroEntity.validarDescricao(dados.descricaoDefeito),
      severidade: dados.severidade ? Severidade.create(dados.severidade) : tipoDefeito.severidadePadrao(),
      status: Status.aberto(),
      laudo: null,
    });
  }

  static restoreSinistro(
    id: string,
    cliente: string,
    dispositivo: string,
    numeroSerie: string,
    tipoDefeito: string,
    descricaoDefeito: string,
    severidade: string,
    status: string,
    laudo: string | null,
    createdAt: Date,
    updateAt: Date | null,
  ): SinistroEntity {
    return new SinistroEntity({
      id,
      cliente,
      dispositivo,
      numeroSerie: NumeroSerie.create(numeroSerie),
      tipoDefeito: TipoDefeito.create(tipoDefeito),
      descricaoDefeito,
      severidade: Severidade.create(severidade),
      status: Status.create(status),
      laudo,
      createdAt,
      updateAt,
    });
  }

  alterarDados(dados: DadosSinistro): void {
    if (!this.props.status.isAberto()) {
      throw new RegraNegocioError('Só é possível alterar sinistros que ainda estão abertos.');
    }

    const tipoDefeito = TipoDefeito.create(dados.tipoDefeito);

    this.props.cliente = SinistroEntity.validarCliente(dados.cliente);
    this.props.dispositivo = SinistroEntity.validarDispositivo(dados.dispositivo);
    this.props.numeroSerie = NumeroSerie.create(dados.numeroSerie);
    this.props.descricaoDefeito = SinistroEntity.validarDescricao(dados.descricaoDefeito);
    this.props.tipoDefeito = tipoDefeito;
    this.props.severidade = dados.severidade ? Severidade.create(dados.severidade) : tipoDefeito.severidadePadrao();
  }

  enviarParaLaboratorio(): void {
    if (!this.props.status.isAberto()) {
      throw new RegraNegocioError('Só é possível enviar ao laboratório sinistros que estão abertos.');
    }
    this.props.status = Status.emLaboratorio();
  }

  emitirLaudo(decisao: string, laudo: string, reparosAnteriores: number): void {
    if (!this.props.status.isEmLaboratorio()) {
      throw new RegraNegocioError('O sinistro precisa estar no laboratório antes de receber um laudo.');
    }

    const texto = (laudo ?? '').trim();
    if (texto.length < 10) {
      throw new RegraNegocioError('Escreva o laudo com pelo menos 10 caracteres.');
    }

    let statusFinal = Status.decisao(decisao);
    let textoFinal = texto;

    // ja foi reparado 2x -> substitui
    if (statusFinal.isReparado() && reparosAnteriores >= LIMITE_REPAROS) {
      statusFinal = Status.substituido();
      textoFinal += ` (substituição automática: aparelho já passou por ${reparosAnteriores} reparos)`;
    }

    this.props.status = statusFinal;
    this.props.laudo = textoFinal;
  }

  validarExclusao(): void {
    if (this.props.status.isEmLaboratorio()) {
      throw new RegraNegocioError('Não é possível excluir um sinistro que está no laboratório.');
    }
  }

  private static validarCliente(valor: string): string {
    const nome = (valor ?? '').trim();
    if (nome.length < 3) {
      throw new RegraNegocioError('Informe o nome do cliente (mínimo 3 letras).');
    }
    return nome;
  }

  private static validarDispositivo(valor: string): string {
    const dispositivo = (valor ?? '').trim();
    if (!dispositivo) {
      throw new RegraNegocioError('Informe o modelo do dispositivo.');
    }
    return dispositivo;
  }

  private static validarDescricao(valor: string): string {
    const descricao = (valor ?? '').trim();
    if (descricao.length < 10) {
      throw new RegraNegocioError('Descreva o defeito com pelo menos 10 caracteres.');
    }
    return descricao;
  }
}
