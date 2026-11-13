import { randomUUID } from 'crypto';
import { SinistroRequest } from '../../application/dto/sinistro.dto.request';
import { SinistroResponse } from '../../application/dto/sinistro.dto.response';
import { SinistroEntity } from '../../domain/entity/sinistro.entity';
import { TipoDefeitoEnum } from '../../domain/value-objects/defeito.enum';

export class SinistroMapper {
  static toSinistroEntityFromRequest(request: SinistroRequest): SinistroEntity {
    return SinistroEntity.createSinistro(
      request.id ?? randomUUID(),
      request.cliente,
      request.dispositivo ?? '',
      request.numeroSerie,
      request.tipoDefeito as TipoDefeitoEnum,
      request.descricaoDefeito,
    );
  }

  static toSinistroResponseFromSinistroEntity(sinistroEntity: SinistroEntity): SinistroResponse {
    const { props } = sinistroEntity;

    return new SinistroResponse({
      id: props.id,
      cliente: props.cliente,
      dispositivo: props.dispositivo,
      numeroSerie: props.numeroSerie,
      tipoDefeito: props.tipoDefeito,
      descricaoDefeito: props.descricaoDefeito,
      laudo: props.laudo ?? '',
      severidade: props.severidade.value,
      status: props.status.value,
      createdAt: props.createdAt ?? null,
      updateAt: props.updateAt ?? null,
    });
  }

  static toListSinistroResponseFromListSinistroEntity(entities: SinistroEntity[]): SinistroResponse[] {
    return entities.map((entity) => this.toSinistroResponseFromSinistroEntity(entity));
  }
}
