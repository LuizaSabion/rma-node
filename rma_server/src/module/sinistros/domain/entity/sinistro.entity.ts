import { randomUUID } from 'crypto';
import { BaseEntity, DefaulTimeStampsProps } from '../../../../shared/domain/entity/base.entity';
import { RegraNegocioError } from '../../../../shared/domain/errors/domain.errors';
import { NumeroSerie } from '../value-objects/numero-serie.value.object';
import { Severidade } from '../value-objects/severidade.value.object';
import { Status, SinistroStatusEnum } from '../value-objects/status.value.object';
import { TipoDefeito } from '../value-objects/tipo-defeito.value.object';
import { calcularVencimento, dataHojeBrasil, PRAZO_GARANTIA_MESES, TipoDispositivoEnum, validarTipoDispositivo } from '../value-objects/garantia.value.object';

// limite de reparos do mesmo aparelho, depois disso vira troca
export const LIMITE_REPAROS = 2;

// ETAPA 2 - Apenas metadados em memoria: os bytes do comprovante ficam no PostgreSQL.
export type ComprovanteResumo = {
  nomeArquivo: string;
  dataCompra: Date;
  numeroDocumento: string | null;
  prazoGarantiaMeses: number | null;
  dataVencimento: Date | null;
  confirmadoEm: Date | null;
};

export type SinistroProps = {
  id: string;
  cliente: string;
  dispositivo: string;
  tipoDispositivo: TipoDispositivoEnum | null;
  comprovante: ComprovanteResumo | null;
  motivoReprovacao: string | null;
  // ETAPA 3 - Autorizar laudo somente do tecnico vinculado ao sinistro.
  tecnicoResponsavelId: string | null;
  tecnicoResponsavelNome: string | null;
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
  tipoDispositivo?: string;
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
      // ETAPA 2 - Categoria define o prazo padrao de garantia.
      tipoDispositivo: validarTipoDispositivo(dados.tipoDispositivo),
      comprovante: null,
      motivoReprovacao: null,
      tecnicoResponsavelId: null,
      tecnicoResponsavelNome: null,
      numeroSerie: NumeroSerie.create(dados.numeroSerie),
      tipoDefeito,
      descricaoDefeito: SinistroEntity.validarDescricao(dados.descricaoDefeito),
      severidade: dados.severidade ? Severidade.create(dados.severidade) : tipoDefeito.severidadePadrao(),
      // ETAPA 2 - Abrir pedido nao significa comprovar a garantia.
      status: Status.pendenteComprovacao(),
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
    tipoDispositivo: string | null = null,
    comprovante: ComprovanteResumo | null = null,
    motivoReprovacao: string | null = null,
    tecnicoResponsavelId: string | null = null,
    tecnicoResponsavelNome: string | null = null,
  ): SinistroEntity {
    return new SinistroEntity({
      id,
      cliente,
      dispositivo,
      tipoDispositivo: tipoDispositivo ? validarTipoDispositivo(tipoDispositivo) : null,
      comprovante,
      motivoReprovacao,
      tecnicoResponsavelId,
      tecnicoResponsavelNome,
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
    // ETAPA 2 - Permite corrigir dados de cadastros pendentes, sem liberar analise.
    if (!this.props.status.isAberto() && !this.props.status.isPendenteComprovacao()) {
      throw new RegraNegocioError('Só é possível alterar sinistros abertos ou pendentes.');
    }
    const tipoDispositivo = validarTipoDispositivo(dados.tipoDispositivo);
    // ETAPA 2 - Nunca altera o prazo apos a conferencia sem novo processo de auditoria.
    if (this.props.comprovante?.confirmadoEm && (
      tipoDispositivo !== this.props.tipoDispositivo ||
      dados.dispositivo.trim() !== this.props.dispositivo ||
      dados.numeroSerie.trim().toUpperCase() !== this.props.numeroSerie.value
    )) {
      // ETAPA 2 - Documento conferido nao pode ser reaproveitado em outro aparelho.
      throw new RegraNegocioError('Dados de identificacao do aparelho nao podem mudar apos conferir o comprovante.');
    }
    this.props.tipoDispositivo = tipoDispositivo;

    const tipoDefeito = TipoDefeito.create(dados.tipoDefeito);

    this.props.cliente = SinistroEntity.validarCliente(dados.cliente);
    this.props.dispositivo = SinistroEntity.validarDispositivo(dados.dispositivo);
    this.props.numeroSerie = NumeroSerie.create(dados.numeroSerie);
    this.props.descricaoDefeito = SinistroEntity.validarDescricao(dados.descricaoDefeito);
    this.props.tipoDefeito = tipoDefeito;
    this.props.severidade = dados.severidade ? Severidade.create(dados.severidade) : tipoDefeito.severidadePadrao();
  }

  // ETAPA 1 - A entidade centraliza a mudança de status; nenhum serviço altera diretamente a propriedade.
  private transicionarPara(proximo: Status): void {
    this.props.status.validarTransicaoPara(proximo);
    this.props.status = proximo;
  }

  // ETAPA 2 - O documento pode ser anexado, mas nao e considerado conferido automaticamente.
  anexarComprovante(resumo: ComprovanteResumo): void {
    if (!this.props.status.isAberto() && !this.props.status.isPendenteComprovacao()) {
      throw new RegraNegocioError('Comprovante so pode ser anexado antes da entrada no laboratorio.');
    }
    if (this.props.comprovante?.confirmadoEm) {
      throw new RegraNegocioError('O comprovante ja foi conferido e nao pode ser substituido nesta etapa.');
    }
    if (!this.props.tipoDispositivo) {
      throw new RegraNegocioError('Informe o tipo de aparelho antes de anexar o comprovante.');
    }
    if (this.props.status.isAberto()) this.transicionarPara(Status.pendenteComprovacao());
    this.props.comprovante = resumo;
  }

  // ETAPA 2 - Guarda que exige conferência humana e calcula a garantia no dominio.
  conferirGarantia(agora: Date = new Date()): void {
    const comprovante = this.props.comprovante;
    if (!this.props.status.isPendenteComprovacao() && !this.props.status.isAberto()) {
      throw new RegraNegocioError('Esta solicitacao nao esta aguardando conferencia de garantia.');
    }
    if (!comprovante || !this.props.tipoDispositivo) {
      throw new RegraNegocioError('Anexe a nota fiscal ou comprovante equivalente e informe a categoria do aparelho.');
    }
    if (comprovante.confirmadoEm) {
      throw new RegraNegocioError('Este comprovante ja foi conferido.');
    }
    const prazo = PRAZO_GARANTIA_MESES[this.props.tipoDispositivo];
    const vencimento = calcularVencimento(comprovante.dataCompra, prazo);
    const vencida = dataHojeBrasil(agora) > vencimento;
    comprovante.prazoGarantiaMeses = prazo;
    comprovante.dataVencimento = vencimento;
    comprovante.confirmadoEm = agora;
    if (vencida) {
      this.transicionarPara(Status.create(SinistroStatusEnum.REPROVADO));
      this.props.motivoReprovacao = `Garantia vencida em ${vencimento.toISOString().slice(0, 10)}.`;
    } else if (this.props.status.isPendenteComprovacao()) {
      this.transicionarPara(Status.aberto());
    }
  }

  enviarParaLaboratorio(): void {
    // ETAPA 2 - A validacao permanece obrigatoria na API, mesmo se o botao aparecer.
    const doc = this.props.comprovante;
    if (!doc?.confirmadoEm || !doc.dataVencimento) {
      throw new RegraNegocioError('O comprovante precisa ser anexado e conferido antes de enviar ao laboratorio.');
    }
    if (dataHojeBrasil() > doc.dataVencimento) {
      throw new RegraNegocioError('A garantia expirou; reavalie a cobertura antes de enviar ao laboratorio.');
    }
    this.transicionarPara(Status.emLaboratorio());
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

    // ETAPA 1 - Preservamos a regra existente de substituição por excesso de reparos.
    // Agora, a decisão de reparar inicia EM_REPARO, não conclui como REPARADO.
    if (statusFinal.value === SinistroStatusEnum.EM_REPARO && reparosAnteriores >= LIMITE_REPAROS) {
      statusFinal = Status.substituido();
      textoFinal += ` (substituição automática: aparelho já passou por ${reparosAnteriores} reparos)`;
    }

    // ETAPA 1 - A transição só acontece após validar o laudo e a matriz de estados.
    this.transicionarPara(statusFinal);
    this.props.laudo = textoFinal;
  }

  // ETAPA 1 - A conclusão é uma ação distinta do laudo inicial.
  concluirReparo(): void {
    if (!this.props.laudo || this.props.laudo.trim().length < 10) {
      throw new RegraNegocioError('Não é possível concluir reparo sem laudo técnico inicial.');
    }
    this.transicionarPara(Status.reparado());
  }

  validarExclusao(): void {
    // ETAPA 1 - Estende o bloqueio existente para a nova etapa EM_REPARO.
    if (this.props.status.isEmLaboratorio() || this.props.status.isEmReparo()) {
      throw new RegraNegocioError('Não é possível excluir um sinistro em laboratório ou em reparo.');
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
