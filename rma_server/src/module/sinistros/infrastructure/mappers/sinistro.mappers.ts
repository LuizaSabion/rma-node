import { Sinistro as PrismaSinistro } from '@prisma/client';
import { SinistroRequest } from '../../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../../application/dto/sinistro.dto.response';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';

export class SinistroMapper {
  static toSinistroEntityFromRequest(request: SinistroRequest) {
    return SinistroEntity.createSinistro({
      cliente: request.cliente,
      dispositivo: request.dispositivo,
      numeroSerie: request.numeroSerie,
      tipoDefeito: request.tipoDefeito,
      descricaoDefeito: request.descricaoDefeito,
      severidade: request.severidade,
    });
  }

  static toSinistroEntityFromSinistroPrisma(raw: PrismaSinistro) {
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
    );
  }

  static toSinistroFromSinistroEntity(sinistroEntity: SinistroEntity) {
    return {
      id: sinistroEntity.props.id,
      cliente: sinistroEntity.props.cliente,
      dispositivo: sinistroEntity.props.dispositivo,
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
      numeroSerie: sinistroEntity.props.numeroSerie.value,
      tipoDefeito: sinistroEntity.props.tipoDefeito.value,
      tipoDefeitoNome: sinistroEntity.props.tipoDefeito.nome,
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

  static toListSinistroEntityFromListSinistro(rawList: PrismaSinistro[]): SinistroEntity[] {
    return rawList.map((raw) => this.toSinistroEntityFromSinistroPrisma(raw));
  }
}
