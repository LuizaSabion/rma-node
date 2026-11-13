import { SinistroEntity } from '../entity/sinistro.entity';
import { SinistroStatusEnum } from '../value-objects/status.value.object';

export const SINISTRO_READ_REPOSITORY = 'SINISTRO_READ_REPOSITORY';

export interface SinistroReadRepository {
  findSinistroAll(status?: SinistroStatusEnum): Promise<SinistroEntity[]>;
  findSinistroById(id: string): Promise<SinistroEntity | null>;
  countReparos(numeroSerie: string): Promise<number>;
  countByStatus(): Promise<Record<SinistroStatusEnum, number>>;
}
