import { Sinistro as PrismaSinistro } from '@prisma/client';
import { SinistroRequest } from '../../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../../application/dto/sinistro.dto.response';
import { ComprovanteResumo, SinistroEntity } from '../../domain/entity/sinistro.entity';

// ETAPA 2 - A consulta traz apenas metadados do documento (nunca o arquivo binario).
export type SinistroComResumoComprovante = PrismaSinistro & {
  comprovante?: ComprovanteResumo | null;
};

// ETAPA 2 - Seleciona somente metadados do comprovante, nunca o bytea.
export const comprovanteResumoSelect = {
  nomeArquivo: true,
  dataCompra: true,
  numeroDocumento: true,
  prazoGarantiaMeses: true,
  dataVencimento: true,
  confirmadoEm: true,
} as const;

export class SinistroMapper {
  static toSinistroEntityFromRequest(request: SinistroRequest) {
    return SinistroEntity.createSinistro({
      cliente: request.cliente,
      dispositivo: request.dispositivo,
      tipoDispositivo: request.tipoDispositivo,
      numeroSerie: request.numeroSerie,
      tipoDefeito: request.tipoDefeito,
      descricaoDefeito: request.descricaoDefeito,
      severidade: request.severidade,
    });
  }

  static toSinistroEntityFromSinistroPrisma(raw: SinistroComResumoComprovante) {
    return SinistroEntity.restoreSinistro(
      raw.id,
      raw.cliente,
      raw.dispositivo,
      raw.numeroSerie,
      raw.tipoDefeito,
      raw.descricaoDefeito,
      raw.severidade,
      raw.status,
      raw.laudo,
      raw.createdAt,
      raw.updatedAt,
      raw.tipoDispositivo,
      raw.comprovante ?? null,
      raw.motivoReprovacao,
    );
  }

  static toSinistroFromSinistroEntity(sinistroEntity: SinistroEntity) {
    return {
      id: sinistroEntity.props.id,
      cliente: sinistroEntity.props.cliente,
      dispositivo: sinistroEntity.props.dispositivo,
      tipoDispositivo: sinistroEntity.props.tipoDispositivo,
      motivoReprovacao: sinistroEntity.props.motivoReprovacao,
      numeroSerie: sinistroEntity.props.numeroSerie.value,
      tipoDefeito: sinistroEntity.props.tipoDefeito.value,
      descricaoDefeito: sinistroEntity.props.descricaoDefeito,
      severidade: sinistroEntity.props.severidade.value,
      status: sinistroEntity.props.status.value,
      laudo: sinistroEntity.props.laudo ?? null,
    };
  }

  static toSinistroResponseFromSinistroEntity(sinistroEntity: SinistroEntity): SinistroResponse {
    return {
      id: sinistroEntity.props.id,
      cliente: sinistroEntity.props.cliente,
      dispositivo: sinistroEntity.props.dispositivo,
      tipoDispositivo: sinistroEntity.props.tipoDispositivo,
      motivoReprovacao: sinistroEntity.props.motivoReprovacao,
      numeroSerie: sinistroEntity.props.numeroSerie.value,
      tipoDefeito: sinistroEntity.props.tipoDefeito.value,
      tipoDefeitoNome: sinistroEntity.props.tipoDefeito.nome,
      // ETAPA 2 - Metadados de garantia para orientar a conferencia na interface.
      comprovanteAnexado: Boolean(sinistroEntity.props.comprovante),
      comprovanteNome: sinistroEntity.props.comprovante?.nomeArquivo ?? null,
      comprovanteConferidoEm: sinistroEntity.props.comprovante?.confirmadoEm ?? null,
      dataCompra: sinistroEntity.props.comprovante?.dataCompra ?? null,
      dataVencimento: sinistroEntity.props.comprovante?.dataVencimento ?? null,
      prazoGarantiaMeses: sinistroEntity.props.comprovante?.prazoGarantiaMeses ?? null,
      descricaoDefeito: sinistroEntity.props.descricaoDefeito,
      severidade: sinistroEntity.props.severidade.value,
      status: sinistroEntity.props.status.value,
      laudo: sinistroEntity.props.laudo ?? '',
      createdAt: sinistroEntity.props.createdAt,
      updateAt: sinistroEntity.props.updateAt,
    };
  }

  static toListSinistroResponseFromListSinistroEntity(entities: SinistroEntity[]): SinistroResponse[] {
    return entities.map((entity) => this.toSinistroResponseFromSinistroEntity(entity));
  }

  static toListSinistroEntityFromListSinistro(rawList: SinistroComResumoComprovante[]): SinistroEntity[] {
    return rawList.map((raw) => this.toSinistroEntityFromSinistroPrisma(raw));
  }
}
