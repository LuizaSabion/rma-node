import { BaseEntity, DefaulTimeStampsProps } from '../../../../shared/domain/entity/base.entity';
import { SEVERIDADE_POR_DEFEITO, TipoDefeitoEnum } from '../value-objects/defeito.enum';
import { NivelSeveridade, Severidade } from '../value-objects/severidade.value-object';
import { Status, StatusSinistroEnum } from '../value-objects/status.value-object';

export type SinistroProps = {
  id: string;
  cliente: string;
  dispositivo: string;
  numeroSerie: string;
  tipoDefeito: TipoDefeitoEnum;
  descricaoDefeito: string;
  laudo?: string | null;
  severidade: Severidade;
  status: Status;
} & DefaulTimeStampsProps;

export class SinistroEntity extends BaseEntity<SinistroProps> {
  constructor(props: SinistroProps) {
    super(props);
  }

  static createSinistro(
    id: string,
    cliente: string,
    dispositivo: string,
    numeroSerie: string,
    tipoDefeito: TipoDefeitoEnum,
    descricaoDefeito: string,
  ): SinistroEntity {
    if (!cliente || !cliente.trim()) {
      throw new Error('Informe o nome do cliente.');
    }
    if (!numeroSerie || !numeroSerie.trim()) {
      throw new Error('Informe o número de série do aparelho.');
    }
    if (!descricaoDefeito || descricaoDefeito.trim().length < 10) {
      throw new Error('Descreva o defeito com pelo menos 10 caracteres.');
    }
    if (!SEVERIDADE_POR_DEFEITO[tipoDefeito]) {
      throw new Error(`Tipo de defeito inválido: "${tipoDefeito}"`);
    }

    return new SinistroEntity({
      id,
      cliente: cliente.trim(),
      dispositivo: dispositivo ? dispositivo.trim() : '',
      numeroSerie: numeroSerie.trim().toUpperCase(),
      tipoDefeito,
      descricaoDefeito: descricaoDefeito.trim(),
      laudo: null,
      severidade: Severidade.create(SEVERIDADE_POR_DEFEITO[tipoDefeito]),
      status: Status.aberto(),
      createdAt: new Date(),
    });
  }

  static restoreSinistro(
    id: string,
    cliente: string,
    dispositivo: string,
    numeroSerie: string,
    tipoDefeito: TipoDefeitoEnum,
    descricaoDefeito: string,
    severidade: NivelSeveridade | string,
    status: StatusSinistroEnum | string,
    laudo?: string,
    createdAt?: Date,
  ): SinistroEntity {
    return new SinistroEntity({
      id,
      cliente,
      dispositivo,
      numeroSerie,
      tipoDefeito,
      descricaoDefeito,
      laudo,
      severidade: Severidade.create(severidade),
      status: Status.create(status),
      createdAt,
      updateAt: new Date(),
    });
  }

  // se o defeito muda, a severidade acompanha
  atualizarDefeito(tipoDefeito: TipoDefeitoEnum) {
    if (!SEVERIDADE_POR_DEFEITO[tipoDefeito]) {
      throw new Error(`Tipo de defeito inválido: "${tipoDefeito}"`);
    }
    this.props.tipoDefeito = tipoDefeito;
    this.props.severidade = Severidade.create(SEVERIDADE_POR_DEFEITO[tipoDefeito]);
  }
}
